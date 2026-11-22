'use client'

import { ExternalLink, Radar, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/os/ui'
import { askAgent } from '@/lib/context'
import { useStored } from '@/lib/store'
import type { ExamTrack } from '@/lib/types'
import { cn } from '@/lib/utils'

export const EXAMS = [
  { id: 'ssc-je', name: 'SSC JE (Electrical)', body: 'Staff Selection Commission', url: 'https://ssc.gov.in' },
  { id: 'rrb-je', name: 'RRB JE (Electrical)', body: 'Railway Recruitment Board, Chandigarh', url: 'https://www.rrbcdg.gov.in' },
  { id: 'wbsedcl', name: 'WBSEDCL Assistant Engineer / JE', body: 'West Bengal State Electricity Distribution Co.', url: 'https://www.wbsedcl.in' },
  { id: 'wbpsc-je', name: 'WBPSC JE (Electrical)', body: 'Public Service Commission, West Bengal', url: 'https://psc.wb.gov.in' },
] as const

const STATUSES = ['Watching', 'Notification out', 'Applied', 'Admit card', 'Appeared', 'Result awaited', 'Qualified']
const EMPTY: ExamTrack = { date: '', status: 'Watching', notes: '' }

export function daysUntil(date: string) {
  if (!date) return null
  const target = new Date(date + 'T00:00').getTime()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target - today.getTime()) / 864e5)
}

export function RadarApp() {
  const [tracks, setTracks] = useStored<Record<string, ExamTrack>>('exams', {})
  const set = (id: string, patch: Partial<ExamTrack>) => setTracks((t) => ({ ...t, [id]: { ...EMPTY, ...t[id], ...patch } }))

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Radar className="size-4 text-primary" aria-hidden="true" />
        Track your target exams. Always verify notifications on the official portals.
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {EXAMS.map((exam) => {
          const t = { ...EMPTY, ...tracks[exam.id] }
          const left = daysUntil(t.date)
          return (
            <article key={exam.id} className="glass-soft flex flex-col gap-3 rounded-xl p-4">
              <header className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{exam.name}</h3>
                  <p className="text-xs text-muted-foreground">{exam.body}</p>
                </div>
                <div className={cn('rounded-lg px-2 py-1 text-center font-mono', left === null ? 'bg-muted text-muted-foreground' : left < 0 ? 'bg-muted text-muted-foreground' : left <= 30 ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary')}>
                  <span className="block text-lg leading-none font-bold">{left === null ? '—' : Math.abs(left)}</span>
                  <span className="text-[10px] uppercase">{left === null ? 'no date' : left < 0 ? 'days ago' : 'days left'}</span>
                </div>
              </header>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`${exam.id}-date`}>Exam date</Label>
                  <input id={`${exam.id}-date`} type="date" className="field" value={t.date} onChange={(e) => set(exam.id, { date: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor={`${exam.id}-status`}>Status</Label>
                  <select id={`${exam.id}-status`} className="field" value={t.status} onChange={(e) => set(exam.id, { status: e.target.value })}>
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor={`${exam.id}-notes`}>Notes</Label>
                <input id={`${exam.id}-notes`} className="field" placeholder="Vacancies, form deadline, centre…" value={t.notes} onChange={(e) => set(exam.id, { notes: e.target.value })} />
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={exam.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-7 items-center gap-1 rounded-lg border border-border px-2.5 text-[0.8rem] font-medium transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
                  <ExternalLink className="size-3.5" aria-hidden="true" /> Official portal
                  <span className="sr-only">(opens in new tab)</span>
                </a>
                <Button
                  size="sm"
                  onClick={() =>
                    askAgent(
                      `Give me a focused preparation strategy and an overview of recent cutoff trends for ${exam.name} (${exam.body}). My status: ${t.status}${t.date ? `, exam on ${t.date} (${left} days away)` : ''}${t.notes ? `, notes: ${t.notes}` : ''}. Include exam pattern, high-weightage EE topics, a countdown plan using my real progress, and remind me to verify cutoffs on ${exam.url}.`,
                    )
                  }
                >
                  <Sparkles /> Ask AI Strategy & Cutoff
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
