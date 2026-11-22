'use client'

import { BookOpen, Check, ExternalLink, FolderOpen, FolderPlus, Pencil, Plus, Sparkles, Trash2, Video } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState, Label, Panel } from '@/components/os/ui'
import { askAgent } from '@/lib/context'
import { uid, useStored } from '@/lib/store'
import { SUBJECT_COLORS, type Folder, type Subject } from '@/lib/types'
import { cn } from '@/lib/utils'

const JE_TEMPLATE: Record<string, string[]> = {
  'Basic Electrical': ['Ohm’s & Kirchhoff’s laws', 'Network theorems', 'AC fundamentals', 'Magnetic circuits', 'Electrostatics'],
  'Electrical Machines': ['DC machines', 'Transformers', 'Induction motors', 'Synchronous machines', 'Special machines'],
  'Power Systems': ['Generation', 'Transmission & distribution', 'Switchgear & protection', 'Per-unit & faults', 'Power factor improvement'],
  'Measurements & Instruments': ['Indicating instruments', 'Bridges', 'Energy meters', 'CT & PT'],
  'Power Electronics & Basic Electronics': ['Diodes & transistors', 'Thyristors', 'Rectifiers & inverters', 'Op-amps'],
  'Utilisation & Estimation': ['Illumination', 'Electric traction', 'Heating & welding', 'Estimation & costing'],
}

const isUrl = (s: string) => {
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function LibraryApp() {
  const [tab, setTab] = useState<'syllabus' | 'library'>('syllabus')
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2" role="tablist" aria-label="Library sections">
        <Button role="tab" aria-selected={tab === 'syllabus'} size="sm" variant={tab === 'syllabus' ? 'default' : 'outline'} onClick={() => setTab('syllabus')}>
          <BookOpen /> Syllabus Tracker
        </Button>
        <Button role="tab" aria-selected={tab === 'library'} size="sm" variant={tab === 'library' ? 'default' : 'outline'} onClick={() => setTab('library')}>
          <Video /> Lecture Library
        </Button>
      </div>
      {tab === 'syllabus' ? <SyllabusTracker /> : <LectureLibrary />}
    </div>
  )
}

function InlineRename({ value, onSave, label }: { value: string; onSave: (v: string) => void; label: string }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)
  if (!editing)
    return (
      <Button size="icon-xs" variant="ghost" onClick={() => (setText(value), setEditing(true))} aria-label={`Rename ${label}`}>
        <Pencil />
      </Button>
    )
  return (
    <form
      className="flex gap-1"
      onSubmit={(e) => {
        e.preventDefault()
        if (text.trim()) onSave(text.trim())
        setEditing(false)
      }}
    >
      <input autoFocus aria-label={`New name for ${label}`} className="field h-7 w-40 py-0" value={text} onChange={(e) => setText(e.target.value)} onBlur={() => setEditing(false)} onKeyDown={(e) => e.key === 'Escape' && setEditing(false)} />
    </form>
  )
}

function SyllabusTracker() {
  const [subjects, setSubjects] = useStored<Subject[]>('syllabus', [])
  const [name, setName] = useState('')
  const [unitDraft, setUnitDraft] = useState<Record<string, string>>({})
  const edit = (id: string, fn: (s: Subject) => Subject) => setSubjects((l) => l.map((s) => (s.id === id ? fn(s) : s)))

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubjects((l) => [...l, { id: uid(), name: name.trim(), color: SUBJECT_COLORS[l.length % SUBJECT_COLORS.length], units: [] }])
    setName('')
  }

  const loadTemplate = () =>
    setSubjects((l) => {
      const existing = new Set(l.map((s) => s.name.toLowerCase()))
      const added = Object.entries(JE_TEMPLATE)
        .filter(([n]) => !existing.has(n.toLowerCase()))
        .map(([n, units], i) => ({ id: uid(), name: n, color: SUBJECT_COLORS[(l.length + i) % SUBJECT_COLORS.length], units: units.map((u) => ({ id: uid(), name: u, done: false })) }))
      return [...l, ...added]
    })

  return (
    <>
      <form onSubmit={addSubject} className="flex flex-wrap items-end gap-2">
        <div className="min-w-48 flex-1">
          <Label htmlFor="sy-name">New subject</Label>
          <input id="sy-name" className="field" placeholder="e.g. Control Systems" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button type="submit">
          <Plus /> Add subject
        </Button>
        <Button type="button" variant="outline" onClick={loadTemplate}>
          Load JE (EE) template
        </Button>
      </form>
      {subjects.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {subjects.map((s) => {
            const done = s.units.filter((u) => u.done).length
            const pct = s.units.length ? (done / s.units.length) * 100 : 0
            return (
              <Panel
                key={s.id}
                title={s.name}
                action={
                  <div className="flex items-center gap-1">
                    <label className="relative size-5 cursor-pointer overflow-hidden rounded-full border border-border" style={{ background: s.color }}>
                      <span className="sr-only">Colour for {s.name}</span>
                      <input type="color" value={s.color} onChange={(e) => edit(s.id, (x) => ({ ...x, color: e.target.value }))} className="absolute inset-0 opacity-0" />
                    </label>
                    <InlineRename value={s.name} label={s.name} onSave={(v) => edit(s.id, (x) => ({ ...x, name: v }))} />
                    <Button size="icon-xs" variant="ghost" onClick={() => setSubjects((l) => l.filter((x) => x.id !== s.id))} aria-label={`Delete ${s.name}`}>
                      <Trash2 />
                    </Button>
                  </div>
                }
              >
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.name} progress`}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                </div>
                <ul className="space-y-1">
                  {s.units.map((u) => (
                    <li key={u.id} className="group flex items-center gap-2 text-sm">
                      <button
                        type="button"
                        onClick={() => edit(s.id, (x) => ({ ...x, units: x.units.map((y) => (y.id === u.id ? { ...y, done: !y.done } : y)) }))}
                        className={cn('flex size-5 shrink-0 items-center justify-center rounded border transition', u.done ? 'border-transparent text-background' : 'border-border')}
                        style={u.done ? { background: s.color } : undefined}
                        aria-pressed={u.done}
                        aria-label={`${u.name}: ${u.done ? 'done' : 'pending'}`}
                      >
                        {u.done && <Check className="size-3.5" />}
                      </button>
                      <span className={cn('flex-1', u.done && 'text-muted-foreground line-through')}>{u.name}</span>
                      <Button size="icon-xs" variant="ghost" className="opacity-60 group-hover:opacity-100" onClick={() => edit(s.id, (x) => ({ ...x, units: x.units.filter((y) => y.id !== u.id) }))} aria-label={`Delete unit ${u.name}`}>
                        <Trash2 />
                      </Button>
                    </li>
                  ))}
                </ul>
                <form
                  className="mt-2 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const v = unitDraft[s.id]?.trim()
                    if (!v) return
                    edit(s.id, (x) => ({ ...x, units: [...x.units, { id: uid(), name: v, done: false }] }))
                    setUnitDraft((d) => ({ ...d, [s.id]: '' }))
                  }}
                >
                  <label htmlFor={`unit-${s.id}`} className="sr-only">
                    New unit for {s.name}
                  </label>
                  <input id={`unit-${s.id}`} className="field h-8" placeholder="Add unit / topic" value={unitDraft[s.id] ?? ''} onChange={(e) => setUnitDraft((d) => ({ ...d, [s.id]: e.target.value }))} />
                  <Button type="submit" size="sm" variant="outline">
                    Add
                  </Button>
                </form>
              </Panel>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={<BookOpen />} title="No subjects yet" hint="Add your own subjects, or load the standard Electrical JE template and tick units off as you finish them." />
      )}
    </>
  )
}

function LectureLibrary() {
  const [folders, setFolders] = useStored<Folder[]>('library', [])
  const [folderName, setFolderName] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [link, setLink] = useState({ title: '', url: '', topic: '' })
  const [error, setError] = useState('')
  const current = folders.find((f) => f.id === active) ?? folders[0]

  const addFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim()) return
    const id = uid()
    setFolders((l) => [...l, { id, name: folderName.trim(), links: [] }])
    setActive(id)
    setFolderName('')
  }

  const addLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!current) return
    if (!isUrl(link.url.trim())) return setError('Enter a valid http(s) link.')
    setError('')
    setFolders((l) => l.map((f) => (f.id === current.id ? { ...f, links: [...f.links, { id: uid(), title: link.title.trim() || link.url.trim(), url: link.url.trim(), topic: link.topic.trim() }] } : f)))
    setLink({ title: '', url: '', topic: '' })
  }

  return (
    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="space-y-3">
        <form onSubmit={addFolder} className="flex gap-2">
          <label htmlFor="lib-folder" className="sr-only">
            New folder name
          </label>
          <input id="lib-folder" className="field h-8" placeholder="New folder" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
          <Button type="submit" size="icon-sm" aria-label="Create folder">
            <FolderPlus />
          </Button>
        </form>
        <ul className="space-y-1">
          {folders.map((f) => (
            <li key={f.id} className={cn('flex items-center gap-1 rounded-lg pr-1', current?.id === f.id ? 'bg-primary/15 text-primary' : 'hover:bg-muted')}>
              <button type="button" onClick={() => setActive(f.id)} className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left text-sm" aria-current={current?.id === f.id}>
                <FolderOpen className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{f.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{f.links.length}</span>
              </button>
              <InlineRename value={f.name} label={f.name} onSave={(v) => setFolders((l) => l.map((x) => (x.id === f.id ? { ...x, name: v } : x)))} />
              <Button size="icon-xs" variant="ghost" onClick={() => setFolders((l) => l.filter((x) => x.id !== f.id))} aria-label={`Delete folder ${f.name}`}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
        <Button size="sm" variant="secondary" className="w-full" disabled={!folders.some((f) => f.links.length)} onClick={() => askAgent('Based on my weak topics (mock sections and pending syllabus units), recommend which of my saved lectures I should watch next and in what order. Cite each by title and URL, and explain why.')}>
          <Sparkles /> AI recommend from my weak topics
        </Button>
      </div>

      {current ? (
        <Panel title={current.name}>
          <form onSubmit={addLink} className="mb-4 grid gap-2 sm:grid-cols-[1fr_1fr_0.8fr_auto] sm:items-end">
            <div>
              <Label htmlFor="ln-title">Title</Label>
              <input id="ln-title" className="field" placeholder="Transformer losses" value={link.title} onChange={(e) => setLink({ ...link, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ln-url">YouTube / lecture URL</Label>
              <input id="ln-url" type="url" required className="field" placeholder="https://youtube.com/…" value={link.url} onChange={(e) => setLink({ ...link, url: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ln-topic">Topic</Label>
              <input id="ln-topic" className="field" placeholder="Machines" value={link.topic} onChange={(e) => setLink({ ...link, topic: e.target.value })} />
            </div>
            <Button type="submit" className="h-9">
              <Plus /> Save
            </Button>
            {error && (
              <p className="text-sm text-destructive sm:col-span-4" role="alert">
                {error}
              </p>
            )}
          </form>
          {current.links.length ? (
            <ul className="divide-y divide-border">
              {current.links.map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-2 text-sm">
                  <Video className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 font-medium hover:text-primary hover:underline">
                      <span className="truncate">{l.title}</span>
                      <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                    {l.topic && <p className="text-xs text-muted-foreground">{l.topic}</p>}
                  </div>
                  <Button size="icon-xs" variant="ghost" onClick={() => setFolders((fs) => fs.map((f) => (f.id === current.id ? { ...f, links: f.links.filter((x) => x.id !== l.id) } : f)))} aria-label={`Delete ${l.title}`}>
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No lectures in this folder yet.</p>
          )}
        </Panel>
      ) : (
        <EmptyState icon={<FolderOpen />} title="No folders yet" hint="Create a folder per subject, then save YouTube or lecture links tagged by topic. Volt AI recommends them for your weak areas." />
      )}
    </div>
  )
}
