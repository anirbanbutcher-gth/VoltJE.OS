export type Theme = 'light' | 'dark'

export type Settings = { apiKey: string; model: string }
export const DEFAULT_MODEL = 'gemini-3.1-flash-lite'
export const DEFAULT_SETTINGS: Settings = { apiKey: '', model: DEFAULT_MODEL }

export const MODEL_FALLBACK_LIST = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3-flash',
  'gemini-3.6-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
] as const

export type Unit = { id: string; name: string; done: boolean }
export type Subject = { id: string; name: string; color: string; units: Unit[] }

export type Mock = {
  id: string
  date: string
  name: string
  technical: number
  reasoning: number
  ga: number
  negative: number
  maxMarks: number
}

export type Session = {
  id: string
  start: number
  end: number
  focusMs: number
  breakMs: number
  rating: number
  note: string
}

export type StopwatchState = {
  mode: 'idle' | 'focus' | 'break'
  segmentStart: number | null
  sessionStart: number | null
  focusMs: number
  breakMs: number
}
export const IDLE_STOPWATCH: StopwatchState = {
  mode: 'idle',
  segmentStart: null,
  sessionStart: null,
  focusMs: 0,
  breakMs: 0,
}

export type PlannerTask = {
  id: string
  topic: string
  subject: string
  hours: number
  priority: 1 | 2 | 3
  startDay: number
  done: boolean
}
export type Planner = { capacity: number[]; tasks: PlannerTask[] }
export const DEFAULT_PLANNER: Planner = { capacity: [6, 6, 6, 6, 6, 6, 6], tasks: [] }

export type Sticky = {
  id: string
  text: string
  color: StickyColor
  x: number
  y: number
  pinned: boolean
  createdAt: number
}
export type StickyColor = 'amber' | 'cyan' | 'lime' | 'rose'

export type AffairCard = { id: string; title: string; body: string; category: string; createdAt: number }
export type DiaryEntry = AffairCard & { keptAt: number }

export type LibraryLink = { id: string; title: string; url: string; topic: string }
export type Folder = { id: string; name: string; links: LibraryLink[] }

export type ExamTrack = { date: string; status: string; notes: string }

export type ChatAttachment = { name: string; mime: string }
export type ChatMessage = {
  id: string
  role: 'user' | 'model'
  text: string
  attachments?: ChatAttachment[]
  error?: boolean
  at: number
}

export const SUBJECT_COLORS = ['#22d3ee', '#3b82f6', '#f59e0b', '#10b981', '#ec4899', '#a78bfa', '#f97316', '#84cc16', '#14b8a6', '#eab308']

export function mockPercent(m: Mock) {
  if (!m.maxMarks) return 0
  return Math.max(0, ((m.technical + m.reasoning + m.ga - m.negative) / m.maxMarks) * 100)
}

export function dayKey(ts: number | Date) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatDuration(ms: number, withSeconds = true) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return withSeconds ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${h}h ${pad(m)}m`
}