'use client'

import { ClipboardList, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState, Label, Panel } from '@/components/os/ui'
import { askAgent, weakSections } from '@/lib/context'
import { uid, useStored } from '@/lib/store'
import { dayKey, mockPercent, type Mock } from '@/lib/types'
import { cn } from '@/lib/utils'

const FIELDS = [
  { key: 'technical', label: 'Technical' },
  { key: 'reasoning', label: 'Reasoning' },
  { key: 'ga', label: 'General Awareness' },
  { key: 'negative', label: 'Negative (deducted)' },
  { key: 'maxMarks', label: 'Max marks' },
] as const

const blank = () => ({ name: '', date: dayKey(Date.now()), technical: '', reasoning: '', ga: '', negative: '', maxMarks: '200' })

export function MocksApp() {
  const [mocks, setMocks] = useStored<Mock[]>('mocks', [])
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const sorted = [...mocks].sort((a, b) => b.date.localeCompare(a.date))
  const weak = weakSections(mocks)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = (v: string) => (v.trim() === '' ? 0 : Number(v))
    const values = { technical: num(form.technical), reasoning: num(form.reasoning), ga: num(form.ga), negative: num(form.negative), maxMarks: num(form.maxMarks) }
    if (Object.values(values).some((v) => !Number.isFinite(v) || v < 0)) return setError('Scores must be non-negative numbers.')
    if (values.maxMarks <= 0) return setError('Max marks must be greater than 0.')
    if (values.technical + values.reasoning + values.ga > values.maxMarks) return setError('Section scores exceed max marks.')
    setError('')
    const mock: Mock = { id: uid(), date: form.date, name: form.name.trim() || `Mock ${mocks.length + 1}`, ...values }
    setMocks((list) => [...list, mock])
    setForm({ ...blank(), maxMarks: form.maxMarks })
  }

  const analyse = (m?: Mock) =>
    askAgent(
      m
        ? `Analyse my mock "${m.name}" (${m.date}): Technical ${m.technical}, Reasoning ${m.reasoning}, GA ${m.ga}, Negative -${m.negative}, out of ${m.maxMarks} (${mockPercent(m).toFixed(1)}%). Compare with my earlier mocks, diagnose accuracy vs attempts, and give a 7-day fix plan with exact topics. Recommend my saved lectures for weak topics.`
        : 'Analyse my full mock history: trend, section-wise weaknesses, negative-marking pattern, and how far I am from the 75% safe zone. Give a prioritised action plan and recommend my saved lectures for weak topics.',
    )

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <Panel title="Log a mock test">
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="mk-name">Test name</Label>
            <input id="mk-name" className="field" placeholder="e.g. SSC JE Full Mock 3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="mk-date">Date</Label>
            <input id="mk-date" type="date" required className="field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          {FIELDS.map((f) => (
            <div key={f.key}>
              <Label htmlFor={`mk-${f.key}`}>{f.label}</Label>
              <input id={`mk-${f.key}`} type="number" inputMode="decimal" min={0} step={0.25} className="field font-mono" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          {error && (
            <p className="col-span-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="col-span-2 flex flex-wrap gap-2">
            <Button type="submit">
              <Plus /> Save mock
            </Button>
            <Button type="button" variant="outline" onClick={() => analyse()} disabled={!mocks.length}>
              <Sparkles /> Analyse all with AI
            </Button>
          </div>
        </form>
        {weak.length > 0 && (
          <div className="mt-4 rounded-lg border border-border p-3 text-sm">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Section averages · last 5</p>
            <ul className="space-y-1">
              {weak.map((w, i) => (
                <li key={w.name} className="flex justify-between">
                  <span className={cn(i === 0 && 'font-semibold text-destructive')}>
                    {w.name}
                    {i === 0 && ' (weakest)'}
                  </span>
                  <span className="font-mono">{w.avg.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      <Panel title={`History (${mocks.length})`}>
        {sorted.length ? (
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="py-1 font-medium">Test</th>
                  <th className="font-medium">Tech</th>
                  <th className="font-medium">Reas</th>
                  <th className="font-medium">GA</th>
                  <th className="font-medium">Neg</th>
                  <th className="font-medium">Score</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {sorted.map((m) => {
                  const pct = mockPercent(m)
                  return (
                    <tr key={m.id}>
                      <td className="py-2 font-sans">
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.date}</p>
                      </td>
                      <td>{m.technical}</td>
                      <td>{m.reasoning}</td>
                      <td>{m.ga}</td>
                      <td className="text-destructive">-{m.negative}</td>
                      <td>
                        <span className={cn('rounded-md px-1.5 py-0.5 font-semibold', pct >= 75 ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning')}>{pct.toFixed(1)}%</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <Button size="icon-xs" variant="ghost" onClick={() => analyse(m)} aria-label={`Analyse ${m.name} with AI`}>
                          <Sparkles />
                        </Button>
                        <Button size="icon-xs" variant="ghost" onClick={() => setMocks((l) => l.filter((x) => x.id !== m.id))} aria-label={`Delete ${m.name}`}>
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={<ClipboardList />} title="No mocks logged" hint="Your scores feed the Dashboard trajectory and the Master Agent's analysis." />
        )}
      </Panel>
    </div>
  )
}
