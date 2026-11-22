'use client'

import { CalendarRange, Check, Loader2, Plus, Sparkles, Trash2, Wand2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState, Label, Panel } from '@/components/os/ui'
import { buildStudyContext, toast } from '@/lib/context'
import { aiErrorMessage, generateJSON } from '@/lib/gemini'
import { uid, useStored } from '@/lib/store'
import { DEFAULT_PLANNER, type Planner, type PlannerTask, type Subject } from '@/lib/types'
import { cn } from '@/lib/utils'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const PRIORITY = { 1: 'High', 2: 'Medium', 3: 'Low' } as const
const PRIORITY_TONE = { 1: 'border-l-destructive', 2: 'border-l-warning', 3: 'border-l-primary' } as const

type Chunk = { task: PlannerTask; hours: number; continued: boolean; shifted: boolean }

/** Greedy load balancer: fills each day up to capacity, spilling overflow into the following days. */
export function balanceWeek(planner: Planner) {
  const remaining = [...planner.capacity]
  const days: Chunk[][] = DAYS.map(() => [])
  const overflow: { task: PlannerTask; hours: number }[] = []
  const open = planner.tasks
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => !t.done)
    .sort((a, b) => a.t.startDay - b.t.startDay || a.t.priority - b.t.priority || a.i - b.i)

  for (const { t } of open) {
    let left = t.hours
    let continued = false
    for (let d = t.startDay; d < 7 && left > 0.001; d++) {
      const take = Math.min(left, remaining[d])
      if (take <= 0.001) continue
      days[d].push({ task: t, hours: take, continued, shifted: d !== t.startDay })
      remaining[d] -= take
      left -= take
      continued = true
    }
    if (left > 0.001) overflow.push({ task: t, hours: left })
  }
  return { days, overflow, remaining }
}

export function PlannerApp() {
  const [planner, setPlanner] = useStored<Planner>('planner', DEFAULT_PLANNER)
  const [subjects] = useStored<Subject[]>('syllabus', [])
  const [form, setForm] = useState({ topic: '', subject: '', hours: 2, priority: 2 as 1 | 2 | 3, startDay: (new Date().getDay() + 6) % 7 })
  const [busy, setBusy] = useState<'prioritize' | 'suggest' | null>(null)
  const { days, overflow } = balanceWeek(planner)
  const todayIdx = (new Date().getDay() + 6) % 7

  const update = (fn: (p: Planner) => Planner) => setPlanner((p) => fn(p))
  const setTask = (id: string, patch: Partial<PlannerTask>) => update((p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.topic.trim() || form.hours <= 0) return
    update((p) => ({ ...p, tasks: [...p.tasks, { id: uid(), topic: form.topic.trim(), subject: form.subject.trim(), hours: form.hours, priority: form.priority, startDay: form.startDay, done: false }] }))
    setForm((f) => ({ ...f, topic: '' }))
  }

  const aiPrioritize = async () => {
    const open = planner.tasks.filter((t) => !t.done)
    if (!open.length) return toast('Add some tasks first.')
    setBusy('prioritize')
    try {
      const res = await generateJSON<{ id: string; priority: number }[]>(
        `Reprioritise these JE exam study tasks (1=high,2=medium,3=low) based on exam weightage and my weak areas. Return ONLY a JSON array of {"id","priority"} for every task.\nTasks: ${JSON.stringify(open.map(({ id, topic, subject, hours }) => ({ id, topic, subject, hours })))}\n\nMy data:\n${buildStudyContext()}`,
      )
      const map = new Map(res.map((r) => [r.id, Math.min(3, Math.max(1, Math.round(r.priority))) as 1 | 2 | 3]))
      update((p) => ({ ...p, tasks: p.tasks.map((t) => (map.has(t.id) ? { ...t, priority: map.get(t.id)! } : t)) }))
      toast('Priorities updated by AI — the week has been rebalanced.')
    } catch (error) {
      toast(aiErrorMessage(error))
    } finally {
      setBusy(null)
    }
  }

  const aiSuggest = async () => {
    setBusy('suggest')
    try {
      const res = await generateJSON<{ topic: string; subject: string; hours: number; priority: number; startDay: number }[]>(
        `Create 6-10 study tasks for this week (startDay 0=Mon … 6=Sun, today is ${DAYS[todayIdx]}, don't schedule before today) for an EE Junior Engineer aspirant, focusing on pending syllabus units and weak mock sections. Respect daily capacity hours ${JSON.stringify(planner.capacity)}. Return ONLY a JSON array of {"topic","subject","hours","priority"(1-3),"startDay"}.\n\nMy data:\n${buildStudyContext()}`,
      )
      const tasks: PlannerTask[] = res
        .filter((r) => r.topic)
        .map((r) => ({
          id: uid(),
          topic: String(r.topic),
          subject: String(r.subject ?? ''),
          hours: Math.max(0.25, Number(r.hours) || 1),
          priority: Math.min(3, Math.max(1, Math.round(Number(r.priority) || 2))) as 1 | 2 | 3,
          startDay: Math.min(6, Math.max(todayIdx, Math.round(Number(r.startDay) || todayIdx))),
          done: false,
        }))
      update((p) => ({ ...p, tasks: [...p.tasks, ...tasks] }))
      toast(`AI added ${tasks.length} tasks.`)
    } catch (error) {
      toast(aiErrorMessage(error))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Panel
        title="Daily capacity (hours)"
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={aiPrioritize} disabled={!!busy}>
              {busy === 'prioritize' ? <Loader2 className="animate-spin" /> : <Wand2 />} AI Prioritise
            </Button>
            <Button size="sm" onClick={aiSuggest} disabled={!!busy}>
              {busy === 'suggest' ? <Loader2 className="animate-spin" /> : <Sparkles />} AI Suggest Tasks
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((d, i) => (
            <div key={d}>
              <label htmlFor={`cap-${i}`} className={cn('mb-1 block text-center text-xs font-medium', i === todayIdx ? 'text-primary' : 'text-muted-foreground')}>
                {d}
              </label>
              <input
                id={`cap-${i}`}
                type="number"
                min={0}
                max={16}
                step={0.5}
                className="field px-1 text-center font-mono"
                value={planner.capacity[i]}
                onChange={(e) => update((p) => ({ ...p, capacity: p.capacity.map((c, idx) => (idx === i ? Math.max(0, Math.min(16, Number(e.target.value) || 0)) : c)) }))}
              />
            </div>
          ))}
        </div>
      </Panel>

      <form onSubmit={addTask} className="glass-soft grid gap-2 rounded-xl p-3 sm:grid-cols-[2fr_1.3fr_0.7fr_1fr_1fr_auto] sm:items-end">
        <div>
          <Label htmlFor="pt-topic">Topic</Label>
          <input id="pt-topic" className="field" placeholder="e.g. Transformer OC/SC test" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="pt-subject">Subject</Label>
          <input id="pt-subject" list="pt-subjects" className="field" placeholder="Machines" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <datalist id="pt-subjects">
            {subjects.map((s) => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="pt-hours">Hours</Label>
          <input id="pt-hours" type="number" min={0.25} step={0.25} className="field font-mono" value={form.hours} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} />
        </div>
        <div>
          <Label htmlFor="pt-priority">Priority</Label>
          <select id="pt-priority" className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) as 1 | 2 | 3 })}>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </div>
        <div>
          <Label htmlFor="pt-day">From day</Label>
          <select id="pt-day" className="field" value={form.startDay} onChange={(e) => setForm({ ...form, startDay: Number(e.target.value) })}>
            {DAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="h-9">
          <Plus /> Add
        </Button>
      </form>

      {planner.tasks.length === 0 ? (
        <EmptyState icon={<CalendarRange />} title="Your week is empty" hint="Add topics above or let AI suggest tasks from your pending syllabus. Overflow beyond a day's capacity auto-shifts to the next day." />
      ) : (
        <>
          <div className="scroll-thin -mx-1 overflow-x-auto px-1 pb-1">
            <div className="grid min-w-[840px] grid-cols-7 gap-2">
              {days.map((chunks, i) => {
                const used = chunks.reduce((s, c) => s + c.hours, 0)
                const cap = planner.capacity[i]
                return (
                  <div key={i} className={cn('glass-soft flex min-h-48 flex-col rounded-xl p-2', i === todayIdx && 'ring-2 ring-primary/50')}>
                    <div className="mb-1 flex items-baseline justify-between text-xs">
                      <span className="font-semibold">{DAYS[i]}</span>
                      <span className="font-mono text-muted-foreground">
                        {used.toFixed(1)}/{cap}h
                      </span>
                    </div>
                    <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${cap ? Math.min(100, (used / cap) * 100) : 0}%` }} />
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {chunks.map((c, j) => (
                        <li key={c.task.id + j} className={cn('rounded-md border border-l-4 bg-background/40 p-1.5 text-xs', PRIORITY_TONE[c.task.priority])}>
                          <p className="font-medium leading-snug">{c.task.topic}</p>
                          <p className="text-muted-foreground">
                            {c.hours.toFixed(2).replace(/\.?0+$/, '')}h{c.task.subject ? ` · ${c.task.subject}` : ''}
                          </p>
                          {c.shifted && <p className="text-[10px] font-medium text-warning">{c.continued ? 'continued' : 'shifted'} from {DAYS[c.task.startDay]}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          {overflow.length > 0 && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm" role="alert">
              <p className="font-medium">Over weekly capacity by {overflow.reduce((s, o) => s + o.hours, 0).toFixed(1)}h</p>
              <p className="text-muted-foreground">{overflow.map((o) => `${o.task.topic} (${o.hours.toFixed(1)}h)`).join(', ')} — raise capacity or trim tasks.</p>
            </div>
          )}

          <Panel title="All tasks">
            <ul className="divide-y divide-border">
              {[...planner.tasks]
                .sort((a, b) => Number(a.done) - Number(b.done) || a.priority - b.priority)
                .map((t) => (
                  <li key={t.id} className="flex items-center gap-2 py-2 text-sm">
                    <Button size="icon-xs" variant={t.done ? 'default' : 'outline'} onClick={() => setTask(t.id, { done: !t.done })} aria-label={t.done ? `Mark ${t.topic} as not done` : `Mark ${t.topic} as done`} aria-pressed={t.done}>
                      <Check />
                    </Button>
                    <span className={cn('min-w-0 flex-1 truncate', t.done && 'text-muted-foreground line-through')}>
                      {t.topic} <span className="text-muted-foreground">· {t.hours}h · {DAYS[t.startDay]}</span>
                    </span>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs">{PRIORITY[t.priority]}</span>
                    <Button size="icon-xs" variant="ghost" onClick={() => update((p) => ({ ...p, tasks: p.tasks.filter((x) => x.id !== t.id) }))} aria-label={`Delete ${t.topic}`}>
                      <Trash2 />
                    </Button>
                  </li>
                ))}
            </ul>
          </Panel>
        </>
      )}
    </div>
  )
}
