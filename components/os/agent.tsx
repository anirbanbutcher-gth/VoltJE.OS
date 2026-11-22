'use client'

import { Bot, FileText, GripHorizontal, Loader2, Paperclip, Send, Settings2, Sparkles, Trash2, X } from 'lucide-react'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Markdown } from '@/components/os/markdown'
import { AGENT_SYSTEM, buildStudyContext } from '@/lib/context'
import { startInertialDrag, type Point } from '@/lib/drag'
import { aiErrorMessage, fileToBase64, generate, type GeminiContent, type GeminiPart } from '@/lib/gemini'
import { uid, useStored } from '@/lib/store'
import type { ChatMessage } from '@/lib/types'
import { cn } from '@/lib/utils'

const SYMBOLS = ['Ω', '∠', 'φ', 'η', 'π', '√', 'μ', 'θ', 'ω', 'λ', 'Δ', '∞', '°', '±', '≈', '²', '³', '∑', '∫', '→']
const PANEL_W = 420
const PANEL_H = 620
const MAX_BYTES = 15 * 1024 * 1024

type Pending = { file: File; preview: string | null }

export function Agent({ onOpenSettings }: { onOpenSettings: () => void }) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useStored<ChatMessage[]>('agent-history', [])
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<Pending[]>([])
  const [loading, setLoading] = useState(false)
  const [pos, setPos] = useState<Point | null>(null)
  const [mobile, setMobile] = useState(false)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [history.length, loading, open])

  const openPanel = () => {
    if (!pos) setPos({ x: Math.max(8, window.innerWidth - PANEL_W - 20), y: Math.max(56, window.innerHeight - PANEL_H - 96) })
    setOpen(true)
  }

  const send = async (text: string, attached: Pending[] = []) => {
    const prompt = text.trim()
    if ((!prompt && !attached.length) || loading) return
    const totalBytes = attached.reduce((s, f) => s + f.file.size, 0)
    if (totalBytes > MAX_BYTES) {
      setHistory((h) => [...h, { id: uid(), role: 'model', text: 'Attachments exceed 15 MB. Please upload smaller files.', error: true, at: Date.now() }])
      return
    }

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      text: prompt,
      attachments: attached.map((f) => ({ name: f.file.name, mime: f.file.type || 'application/octet-stream' })),
      at: Date.now(),
    }
    const prior = history.filter((m) => !m.error).slice(-20)
    setHistory((h) => [...h, userMsg].slice(-120))
    setInput('')
    setFiles([])
    setLoading(true)

    try {
      const parts: GeminiPart[] = []
      for (const f of attached) {
        parts.push({ inline_data: { mime_type: f.file.type || 'application/octet-stream', data: await fileToBase64(f.file) } })
        if (f.preview) URL.revokeObjectURL(f.preview)
      }
      parts.push({
        text: prompt || 'Analyse the attached file(s). If it is an EE problem, solve it step by step; if it is a schedule or syllabus, distribute it into study tasks.',
      })
      const contents: GeminiContent[] = [
        ...prior.map<GeminiContent>((m) => ({
          role: m.role,
          parts: [{ text: m.text + (m.attachments?.length ? `\n[attached earlier: ${m.attachments.map((a) => a.name).join(', ')}]` : '') || '(empty)' }],
        })),
        { role: 'user', parts },
      ]
      const reply = await generate({ contents, system: `${AGENT_SYSTEM}\n\n--- USER DATA SNAPSHOT ---\n${buildStudyContext()}` })
      setHistory((h) => [...h, { id: uid(), role: 'model' as const, text: reply, at: Date.now() }].slice(-120))
    } catch (error) {
      setHistory((h) => [...h, { id: uid(), role: 'model', text: aiErrorMessage(error), error: true, at: Date.now() }])
    } finally {
      setLoading(false)
    }
  }

  const onAsk = useEffectEvent((prompt: string) => {
    openPanel()
    void send(prompt)
  })

  useEffect(() => {
    const handler = (e: Event) => onAsk((e as CustomEvent<string>).detail)
    window.addEventListener('volt:ask', handler)
    return () => window.removeEventListener('volt:ask', handler)
  }, [])

  const insertSymbol = (sym: string) => {
    const el = textarea.current
    if (!el) return setInput((v) => v + sym)
    const start = el.selectionStart ?? input.length
    const end = el.selectionEnd ?? input.length
    const next = input.slice(0, start) + sym + input.slice(end)
    setInput(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + sym.length, start + sym.length)
    })
  }

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const next = Array.from(list).map((file) => ({ file, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null }))
    setFiles((f) => [...f, ...next].slice(0, 6))
  }

  const removeFile = (i: number) =>
    setFiles((f) => {
      const p = f[i]?.preview
      if (p) URL.revokeObjectURL(p)
      return f.filter((_, idx) => idx !== i)
    })

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          className="glass fixed right-4 bottom-24 z-[8000] flex items-center gap-2 rounded-full px-4 py-3 font-medium text-primary transition hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring md:bottom-6"
          aria-label="Open Volt Master AI Agent"
        >
          <Sparkles className="size-5" aria-hidden="true" />
          <span className="hidden sm:inline">Ask Volt AI</span>
        </button>
      )}

      {open && pos && (
        <section
          aria-label="Volt Master AI Agent"
          className={cn('glass fixed z-[8000] flex flex-col overflow-hidden rounded-2xl', mobile && 'inset-x-2 top-14 bottom-2')}
          style={mobile ? undefined : { left: pos.x, top: pos.y, width: PANEL_W, height: PANEL_H }}
        >
          <header
            className={cn('flex items-center gap-2 border-b border-border px-3 py-2', !mobile && 'cursor-grab active:cursor-grabbing')}
            onPointerDown={(e) =>
              !mobile &&
              startInertialDrag(e, pos, {
                onMove: setPos,
                bounds: () => ({ minX: 0, minY: 44, maxX: window.innerWidth - PANEL_W, maxY: window.innerHeight - 80 }),
              })
            }
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Bot className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-tight font-semibold">Volt · Master Agent</p>
              <p className="text-xs leading-tight text-muted-foreground">Gemini multimodal · sees your study data</p>
            </div>
            {!mobile && <GripHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />}
            <Button size="icon-sm" variant="ghost" onClick={onOpenSettings} aria-label="AI settings">
              <Settings2 />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => setHistory([])} aria-label="Clear conversation" disabled={!history.length}>
              <Trash2 />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)} aria-label="Close agent">
              <X />
            </Button>
          </header>

          <div ref={scroller} className="scroll-thin flex-1 space-y-3 overflow-y-auto p-3" aria-live="polite">
            {!history.length && (
              <div className="glass-soft rounded-xl p-4 text-sm">
                <p className="font-medium">Hi! I&apos;m Volt, your JE prep brain.</p>
                <p className="mt-1 text-muted-foreground">
                  Upload a photo of an EE numerical, ask for a strategy, or say &quot;distribute my pending syllabus across this week&quot;.
                </p>
              </div>
            )}
            {history.map((m) => (
              <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[88%] rounded-2xl px-3 py-2 text-sm',
                    m.role === 'user' ? 'bg-primary text-primary-foreground' : m.error ? 'border border-destructive/40 bg-destructive/10 text-foreground' : 'glass-soft',
                  )}
                >
                  {m.attachments?.length ? (
                    <div className="mb-1 flex flex-wrap gap-1">
                      {m.attachments.map((a, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-md bg-background/25 px-1.5 py-0.5 text-xs">
                          <FileText className="size-3" aria-hidden="true" />
                          {a.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {m.role === 'user' ? <p className="whitespace-pre-wrap">{m.text}</p> : <Markdown>{m.text}</Markdown>}
                  {m.error && m.text.includes('Settings') && (
                    <Button size="xs" className="mt-2" onClick={onOpenSettings}>
                      Open Settings
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Volt is thinking…
              </div>
            )}
          </div>

          <div className="border-t border-border p-2">
            <div className="scroll-thin mb-2 flex gap-1 overflow-x-auto pb-1" role="toolbar" aria-label="Electrical symbols">
              {SYMBOLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => insertSymbol(s)}
                  className="glass-soft min-w-7 rounded-md px-1.5 py-0.5 font-mono text-sm transition hover:bg-primary/15 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Insert ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {files.length > 0 && (
              <ul className="mb-2 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <li key={i} className="glass-soft relative flex items-center gap-2 rounded-lg p-1 pr-6 text-xs">
                    {f.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.preview} alt={f.file.name} className="size-9 rounded object-cover" />
                    ) : (
                      <FileText className="size-5" aria-hidden="true" />
                    )}
                    <span className="max-w-24 truncate">{f.file.name}</span>
                    <button type="button" className="absolute top-1 right-1 rounded p-0.5 hover:bg-muted" onClick={() => removeFile(i)} aria-label={`Remove ${f.file.name}`}>
                      <X className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                void send(input, files)
              }}
            >
              <input ref={fileInput} type="file" accept="image/*,application/pdf,text/plain" multiple hidden onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
              <Button type="button" variant="outline" size="icon" onClick={() => fileInput.current?.click()} aria-label="Attach image or document">
                <Paperclip />
              </Button>
              <label htmlFor="agent-input" className="sr-only">
                Message Volt
              </label>
              <textarea
                id="agent-input"
                ref={textarea}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    if (e.nativeEvent.isComposing || e.keyCode === 229) return
                    e.preventDefault()
                    void send(input, files)
                  }
                }}
                placeholder="Ask about a circuit, strategy, or upload a problem…"
                className="field scroll-thin max-h-32 min-h-9 flex-1 resize-none"
              />
              <Button type="submit" size="icon" disabled={loading || (!input.trim() && !files.length)} aria-label="Send message">
                {loading ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </form>
          </div>
        </section>
      )}
    </>
  )
}
