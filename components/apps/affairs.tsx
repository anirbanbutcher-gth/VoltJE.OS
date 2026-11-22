'use client'

import { Archive, BookmarkPlus, Loader2, Newspaper, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState, Label, Panel } from '@/components/os/ui'
import { askAgent, toast } from '@/lib/context'
import { aiErrorMessage, generateJSON } from '@/lib/gemini'
import { uid, useStored } from '@/lib/store'
import type { AffairCard, DiaryEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Power & Energy', 'Science & Tech', 'National', 'Economy', 'International', 'Awards & Sports', 'Static GK']
const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

export function AffairsApp() {
  const [feed, setFeed] = useStored<AffairCard[]>('affairs-feed', [])
  const [diary, setDiary] = useStored<DiaryEntry[]>('diary', [])
  const [tab, setTab] = useState<'feed' | 'diary'>('feed')
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState({ title: '', body: '', category: CATEGORIES[0] })

  const keep = (c: AffairCard) => {
    setDiary((d) => [...d, { ...c, keptAt: Date.now() }])
    setFeed((f) => f.filter((x) => x.id !== c.id))
  }

  const fetchCards = async () => {
    setBusy(true)
    try {
      const cards = await generateJSON<{ title: string; body: string; category: string }[]>(
        `Write 6 Inshorts-style current-affairs revision cards useful for SSC JE / RRB JE / WBSEDCL General Awareness, prioritising Indian power sector, energy, science & tech, schemes and static GK. Each body must be at most 60 words and factual; skip anything you are not confident about. Category must be one of ${JSON.stringify(CATEGORIES)}. Avoid repeating: ${JSON.stringify(
          [...feed, ...diary].slice(-30).map((c) => c.title),
        )}. Return ONLY a JSON array of {"title","body","category"}.`,
      )
      const fresh = cards
        .filter((c) => c.title && c.body)
        .map((c) => ({ id: uid(), title: String(c.title), body: String(c.body).split(/\s+/).slice(0, 60).join(' '), category: CATEGORIES.includes(c.category) ? c.category : 'National', createdAt: Date.now() }))
      setFeed((f) => [...fresh, ...f])
    } catch (error) {
      toast(aiErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  const addManual = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim() || !draft.body.trim() || wordCount(draft.body) > 60) return
    setFeed((f) => [{ id: uid(), title: draft.title.trim(), body: draft.body.trim(), category: draft.category, createdAt: Date.now() }, ...f])
    setDraft({ ...draft, title: '', body: '' })
  }

  const groups = new Map<number, Map<number, DiaryEntry[]>>()
  for (const entry of [...diary].sort((a, b) => a.keptAt - b.keptAt)) {
    const d = new Date(entry.keptAt)
    const months = groups.get(d.getFullYear()) ?? new Map<number, DiaryEntry[]>()
    months.set(d.getMonth(), [...(months.get(d.getMonth()) ?? []), entry])
    groups.set(d.getFullYear(), months)
  }

  const summarise = (range: 'week' | 'month') => {
    const since = Date.now() - (range === 'week' ? 7 : 31) * 864e5
    const entries = diary.filter((e) => e.keptAt >= since)
    if (!entries.length) return toast(`No diary entries in the last ${range}.`)
    askAgent(`Create a ${range === 'week' ? 'weekly' : 'monthly'} current-affairs revision summary from my diary, grouped by category, with 5 likely exam MCQs at the end:\n${entries.map((e) => `- [${e.category}] ${e.title}: ${e.body}`).join('\n')}`)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Current affairs views">
        {(['feed', 'diary'] as const).map((t) => (
          <Button key={t} role="tab" aria-selected={tab === t} size="sm" variant={tab === t ? 'default' : 'outline'} onClick={() => setTab(t)}>
            {t === 'feed' ? <Newspaper /> : <Archive />} {t === 'feed' ? `Feed (${feed.length})` : `Diary (${diary.length})`}
          </Button>
        ))}
        {tab === 'feed' ? (
          <Button size="sm" variant="secondary" className="ml-auto" onClick={fetchCards} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate cards with AI
          </Button>
        ) : (
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => summarise('week')}>
              Weekly summary
            </Button>
            <Button size="sm" variant="secondary" onClick={() => summarise('month')}>
              Monthly summary
            </Button>
          </div>
        )}
      </div>

      {tab === 'feed' ? (
        <>
          <form onSubmit={addManual} className="glass-soft grid gap-2 rounded-xl p-3 md:grid-cols-[1fr_auto]">
            <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
              <div>
                <Label htmlFor="ca-title">Headline</Label>
                <input id="ca-title" className="field" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Add your own card" />
              </div>
              <div>
                <Label htmlFor="ca-cat">Category</Label>
                <select id="ca-cat" className="field" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="ca-body">Summary · {wordCount(draft.body)}/60 words</Label>
                <textarea id="ca-body" rows={2} className={cn('field', wordCount(draft.body) > 60 && 'border-destructive')} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              </div>
            </div>
            <Button type="submit" className="self-end" disabled={!draft.title.trim() || !draft.body.trim() || wordCount(draft.body) > 60}>
              <Plus /> Add card
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">AI cards are generated from the model&apos;s knowledge, not a live news feed — cross-check dates before an exam.</p>
          {feed.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {feed.map((c) => (
                <article key={c.id} className="glass-soft flex flex-col rounded-xl p-4">
                  <span className="mb-2 w-fit rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">{c.category}</span>
                  <h3 className="leading-snug font-semibold text-balance">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => keep(c)}>
                      <BookmarkPlus /> Keep
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setFeed((f) => f.filter((x) => x.id !== c.id))}>
                      <Trash2 /> Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Newspaper />} title="Feed is empty" hint="Generate 60-word cards with AI or write your own. Keep the important ones in your diary." />
          )}
        </>
      ) : diary.length ? (
        <div className="space-y-4">
          {[...groups.entries()].map(([year, months]) => (
            <section key={year} aria-labelledby={`y-${year}`}>
              <h3 id={`y-${year}`} className="mb-2 font-mono text-lg font-bold text-primary">
                {year}
              </h3>
              <div className="space-y-3">
                {[...months.entries()].map(([month, entries]) => (
                  <Panel key={month} title={`${new Date(year, month).toLocaleDateString(undefined, { month: 'long' })} · ${entries.length} entries`}>
                    <ol className="space-y-2">
                      {entries.map((e, i) => (
                        <li key={e.id} className="flex gap-3 text-sm">
                          <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">{i + 1}.</span>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">
                              {e.title} <span className="text-xs font-normal text-muted-foreground">· {e.category} · {new Date(e.keptAt).toLocaleDateString()}</span>
                            </p>
                            <p className="text-muted-foreground">{e.body}</p>
                          </div>
                          <Button size="icon-xs" variant="ghost" onClick={() => setDiary((d) => d.filter((x) => x.id !== e.id))} aria-label={`Remove ${e.title} from diary`}>
                            <Trash2 />
                          </Button>
                        </li>
                      ))}
                    </ol>
                  </Panel>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Archive />} title="Diary is empty" hint="Cards you keep from the feed are archived here by Year → Month." />
      )}
    </div>
  )
}
