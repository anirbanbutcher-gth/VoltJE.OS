'use client'

import { readStored } from './store'
import {
  DEFAULT_PLANNER,
  dayKey,
  mockPercent,
  type Folder,
  type Mock,
  type Planner,
  type Session,
  type Subject,
} from './types'

export function askAgent(prompt: string) {
  window.dispatchEvent(new CustomEvent('volt:ask', { detail: prompt }))
}

export function openApp(id: string) {
  window.dispatchEvent(new CustomEvent('volt:open', { detail: id }))
}

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent('volt:toast', { detail: message }))
}

export function weakSections(mocks: Mock[]) {
  if (!mocks.length) return []
  const recent = mocks.slice(-5)
  const avg = (k: 'technical' | 'reasoning' | 'ga') => recent.reduce((s, m) => s + m[k], 0) / recent.length
  return [
    { name: 'Technical', avg: avg('technical') },
    { name: 'Reasoning', avg: avg('reasoning') },
    { name: 'General Awareness', avg: avg('ga') },
  ].sort((a, b) => a.avg - b.avg)
}

/** Compact snapshot of the user's real data so the agent can personalise answers. */
export function buildStudyContext() {
  const subjects = readStored<Subject[]>('syllabus', [])
  const mocks = readStored<Mock[]>('mocks', [])
  const sessions = readStored<Session[]>('sessions', [])
  const folders = readStored<Folder[]>('library', [])
  const planner = readStored<Planner>('planner', DEFAULT_PLANNER)

  const lines: string[] = [`Today: ${new Date().toDateString()}`]

  if (subjects.length) {
    lines.push('Syllabus progress:')
    for (const s of subjects) {
      const done = s.units.filter((u) => u.done).map((u) => u.name)
      const pending = s.units.filter((u) => !u.done).map((u) => u.name)
      lines.push(`- ${s.name}: done [${done.join(', ') || 'none'}]; pending [${pending.join(', ') || 'none'}]`)
    }
  } else lines.push('Syllabus tracker: empty.')

  if (mocks.length) {
    lines.push('Recent mocks (date, name, tech/reasoning/GA/negative of max, %):')
    for (const m of mocks.slice(-6)) {
      lines.push(
        `- ${m.date} ${m.name}: ${m.technical}/${m.reasoning}/${m.ga}/-${m.negative} of ${m.maxMarks} = ${mockPercent(m).toFixed(1)}%`,
      )
    }
    lines.push(`Weakest section: ${weakSections(mocks)[0]?.name}`)
  } else lines.push('Mock tests: none logged yet.')

  const week = Date.now() - 7 * 864e5
  const recentFocus = sessions.filter((s) => s.end >= week).reduce((t, s) => t + s.focusMs, 0)
  lines.push(`Focused study last 7 days: ${(recentFocus / 36e5).toFixed(1)} h across ${sessions.filter((s) => s.end >= week).length} sessions.`)
  const today = sessions.filter((s) => dayKey(s.end) === dayKey(Date.now())).reduce((t, s) => t + s.focusMs, 0)
  lines.push(`Focused today: ${(today / 36e5).toFixed(1)} h.`)

  lines.push(`Planner daily capacity (Mon→Sun hours): ${planner.capacity.join(', ')}; ${planner.tasks.filter((t) => !t.done).length} open tasks.`)

  const links = folders.flatMap((f) => f.links.map((l) => `- [${f.name}] ${l.title} (topic: ${l.topic || 'n/a'}) ${l.url}`))
  if (links.length) {
    lines.push("User's saved lecture library (recommend these by title + URL when relevant to weak topics):")
    lines.push(...links.slice(0, 60))
  } else lines.push('Library: no saved lectures yet.')

  return lines.join('\n')
}

export const AGENT_SYSTEM = `You are "Volt", the Master AI Agent inside Volt OS — a personal study OS for an Electrical Engineering diploma graduate preparing for Junior Engineer exams (SSC JE, RRB JE, WBSEDCL, WBPSC). 
Be a sharp, encouraging mentor. Solve EE numericals step-by-step (circuits, machines, power systems, measurements, electronics, control, utilisation), and give exam strategy.
Formatting rules: use Markdown. Write all math in LaTeX using $...$ inline and $$...$$ for display. Unicode electrical symbols (Ω, ∠, φ, η, π, √, μ) are welcome in prose.
When asked to plan or distribute tasks, output concise day-wise bullet lists with hour estimates.
When the user has saved lectures that match a weak topic, recommend them explicitly with their URL.
Never invent the user's scores or progress — rely only on the data snapshot below. If official exam dates/cutoffs may have changed, say so and point to the official portal.`
