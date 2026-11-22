'use client'

import { LayoutGrid, Loader2, Pin, PinOff, Plus, Sparkles, StickyNote, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { buildStudyContext, toast } from '@/lib/context'
import { startInertialDrag, type Point } from '@/lib/drag'
import { aiErrorMessage, generateJSON } from '@/lib/gemini'
import { uid, useStored } from '@/lib/store'
import type { Sticky, StickyColor } from '@/lib/types'
import { cn } from '@/lib/utils'

const NOTE_W = 200
const NOTE_H = 176
const GAP = 14
const COLORS: Record<StickyColor, string> = {
  amber: 'bg-amber-200 text-amber-950',
  cyan: 'bg-cyan-200 text-cyan-950',
  lime: 'bg-lime-200 text-lime-950',
  rose: 'bg-rose-200 text-rose-950',
}
const COLOR_KEYS = Object.keys(COLORS) as StickyColor[]

function gridSlot(i: number, width: number): Point {
  const cols = Math.max(1, Math.floor((width - GAP) / (NOTE_W + GAP)))
  return { x: GAP + (i % cols) * (NOTE_W + GAP), y: GAP + Math.floor(i / cols) * (NOTE_H + GAP) }
}

export function StickiesApp() {
  const [notes, setNotes] = useStored<Sticky[]>('stickies', [])
  const [busy, setBusy] = useState(false)
  const board = useRef<HTMLDivElement>(null)
  const width = () => board.current?.clientWidth ?? 800

  const add = (text = '', color?: StickyColor, at?: Point) =>
    setNotes((list) => {
      const p = at ?? gridSlot(list.length, width())
      return [...list, { id: uid(), text, color: color ?? COLOR_KEYS[list.length % COLOR_KEYS.length], x: p.x, y: p.y, pinned: false, createdAt: Date.now() }]
    })
  const patch = (id: string, change: Partial<Sticky>) => setNotes((list) => list.map((n) => (n.id === id ? { ...n, ...change } : n)))

  const arrange = () =>
    setNotes((list) => {
      let slot = 0
      return list.map((n) => (n.pinned ? n : { ...n, ...gridSlot(slot++, width()) }))
    })

  const suggest = async () => {
    setBusy(true)
    try {
      const tasks = await generateJSON<string[]>(
        `Suggest 4-6 concrete, bite-sized study tasks for TOMORROW for an EE Junior Engineer aspirant, each under 90 characters with a time estimate, based on pending syllabus and weak mock areas. Return ONLY a JSON array of strings.\n\nMy data:\n${buildStudyContext()}`,
      )
      setNotes((list) => {
        const start = list.length
        return [
          ...list,
          ...tasks.slice(0, 8).map((text, i) => {
            const p = gridSlot(start + i, width())
            return { id: uid(), text: `Tomorrow: ${text}`, color: 'cyan' as StickyColor, x: p.x, y: p.y, pinned: false, createdAt: Date.now() }
          }),
        ]
      })
    } catch (error) {
      toast(aiErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  const boardHeight = Math.max(480, ...notes.map((n) => n.y + NOTE_H + GAP))

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => add()}>
          <Plus /> New note
        </Button>
        <Button size="sm" variant="outline" onClick={arrange} disabled={!notes.length}>
          <LayoutGrid /> Snap to grid
        </Button>
        <Button size="sm" variant="secondary" onClick={suggest} disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} AI Suggest Tomorrow&apos;s Tasks
        </Button>
        <p className="ml-auto text-xs text-muted-foreground">Drag a note by its top strip · fling it to glide</p>
      </div>

      <div ref={board} className="glass-soft relative flex-1 overflow-hidden rounded-xl bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:22px_22px]" style={{ minHeight: boardHeight }}>
        {!notes.length && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <StickyNote className="size-8 text-primary" aria-hidden="true" />
            <p className="font-medium text-foreground">Empty board</p>
            <p className="text-sm">Create a note or let AI plan tomorrow.</p>
          </div>
        )}
        {notes.map((n) => (
          <Note
            key={n.id}
            note={n}
            bounds={() => ({ minX: 0, minY: 0, maxX: Math.max(0, (board.current?.clientWidth ?? 800) - NOTE_W), maxY: Math.max(0, (board.current?.clientHeight ?? 480) - NOTE_H) })}
            onChange={(c) => patch(n.id, c)}
            onDelete={() => setNotes((list) => list.filter((x) => x.id !== n.id))}
          />
        ))}
      </div>
    </div>
  )
}

function Note({ note, bounds, onChange, onDelete }: { note: Sticky; bounds: () => { minX: number; minY: number; maxX: number; maxY: number }; onChange: (c: Partial<Sticky>) => void; onDelete: () => void }) {
  const [drag, setDrag] = useState<Point | null>(null)
  const pos = drag ?? { x: note.x, y: note.y }
  return (
    <article
      className={cn('absolute flex flex-col rounded-lg shadow-lg transition-shadow', COLORS[note.color], drag && 'z-10 shadow-2xl', note.pinned && 'ring-2 ring-foreground/30')}
      style={{ left: pos.x, top: pos.y, width: NOTE_W, height: NOTE_H, transform: drag ? 'rotate(-1.5deg) scale(1.03)' : undefined }}
      aria-label="Sticky note"
    >
      <div
        className={cn('flex items-center gap-1 rounded-t-lg bg-black/10 px-1.5 py-1', note.pinned ? 'cursor-default' : 'cursor-grab active:cursor-grabbing')}
        onPointerDown={(e) =>
          !note.pinned &&
          startInertialDrag(e, pos, {
            bounds,
            onMove: setDrag,
            onEnd: (p) => {
              onChange({ x: Math.round(p.x), y: Math.round(p.y) })
              setDrag(null)
            },
          })
        }
      >
        {COLOR_KEYS.map((c) => (
          <button key={c} type="button" onClick={() => onChange({ color: c })} className={cn('size-3.5 rounded-full border border-black/30', COLORS[c].split(' ')[0])} aria-label={`Make note ${c}`} aria-pressed={note.color === c} />
        ))}
        <span className="flex-1" />
        <button type="button" onClick={() => onChange({ pinned: !note.pinned })} className="rounded p-0.5 hover:bg-black/10" aria-label={note.pinned ? 'Unpin note' : 'Pin note'} aria-pressed={note.pinned}>
          {note.pinned ? <Pin className="size-3.5 fill-current" /> : <PinOff className="size-3.5" />}
        </button>
        <button type="button" onClick={onDelete} className="rounded p-0.5 hover:bg-black/10" aria-label="Delete note">
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <label className="sr-only" htmlFor={`note-${note.id}`}>
        Note text
      </label>
      <textarea
        id={`note-${note.id}`}
        value={note.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Write something…"
        className="flex-1 resize-none bg-transparent p-2 text-sm leading-snug outline-none placeholder:text-current/50"
      />
    </article>
  )
}
