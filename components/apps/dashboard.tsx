'use client'

import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { BookOpen, ClipboardList, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, Panel } from '@/components/os/ui'
import { chartPalette } from '@/lib/chart-setup'
import { openApp } from '@/lib/context'
import { useStored } from '@/lib/store'
import { dayKey, mockPercent, type Mock, type Session, type Subject } from '@/lib/types'

function hexAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

export function DashboardApp({ dark }: { dark: boolean }) {
  const [subjects] = useStored<Subject[]>('syllabus', [])
  const [mocks] = useStored<Mock[]>('mocks', [])
  const [sessions] = useStored<Session[]>('sessions', [])
  const p = chartPalette(dark)

  const totalUnits = subjects.reduce((s, x) => s + x.units.length, 0)
  const doneUnits = subjects.reduce((s, x) => s + x.units.filter((u) => u.done).length, 0)
  const syllabusPct = totalUnits ? (doneUnits / totalUnits) * 100 : 0
  const sortedMocks = [...mocks].sort((a, b) => a.date.localeCompare(b.date))
  const avgMock = mocks.length ? mocks.reduce((s, m) => s + mockPercent(m), 0) / mocks.length : 0

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - (13 - i))
    return d
  })
  const hoursByDay = new Map<string, number>()
  for (const s of sessions) hoursByDay.set(dayKey(s.end), (hoursByDay.get(dayKey(s.end)) ?? 0) + s.focusMs / 36e5)
  const weekHours = days.slice(7).reduce((t, d) => t + (hoursByDay.get(dayKey(d)) ?? 0), 0)

  const withUnits = subjects.filter((s) => s.units.length)
  const doughnutData = {
    labels: withUnits.flatMap((s) => s.units.map((u) => `${s.name} · ${u.name}${u.done ? ' ✓' : ''}`)),
    datasets: [
      {
        label: 'Units',
        data: withUnits.flatMap((s) => s.units.map(() => 1)),
        backgroundColor: withUnits.flatMap((s) => s.units.map((u) => (u.done ? s.color : hexAlpha(s.color, 0.18)))),
        borderColor: dark ? '#0b1d33' : '#f3f6fc',
        borderWidth: 2,
        weight: 1.4,
      },
      {
        label: 'Subjects',
        data: withUnits.map((s) => s.units.length),
        backgroundColor: withUnits.map((s) => hexAlpha(s.color, 0.85)),
        borderColor: dark ? '#0b1d33' : '#f3f6fc',
        borderWidth: 2,
        weight: 1,
      },
    ],
  }

  const axis = { ticks: { color: p.muted }, grid: { color: p.grid } }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Syllabus done', value: `${syllabusPct.toFixed(0)}%`, sub: `${doneUnits}/${totalUnits} units` },
          { label: 'Avg mock score', value: mocks.length ? `${avgMock.toFixed(1)}%` : '—', sub: `${mocks.length} mocks logged` },
          { label: 'Focus · last 7d', value: `${weekHours.toFixed(1)}h`, sub: `${sessions.length} sessions total` },
          {
            label: 'Safe-zone hits',
            value: mocks.length ? `${mocks.filter((m) => mockPercent(m) >= 75).length}` : '—',
            sub: '≥ 75% mocks',
          },
        ].map((k) => (
          <div key={k.label} className="glass-soft rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-primary">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Syllabus Completion" action={<Button size="xs" variant="outline" onClick={() => openApp('library')}>Edit syllabus</Button>}>
          {withUnits.length ? (
            <div className="relative mx-auto aspect-square max-w-[300px] [perspective:700px]">
              <div className="absolute inset-0 translate-y-3 rounded-full bg-primary/20 blur-xl" aria-hidden="true" />
              <div className="relative h-full w-full [transform:rotateX(28deg)] drop-shadow-[0_14px_10px_rgba(0,0,0,0.35)]">
                <Doughnut
                  data={doughnutData}
                  aria-label={`Syllabus doughnut chart: ${syllabusPct.toFixed(0)} percent complete`}
                  options={{
                    cutout: '42%',
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.label}` } } },
                  }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-bold">{syllabusPct.toFixed(0)}%</span>
                <span className="text-xs text-muted-foreground">complete</span>
              </div>
            </div>
          ) : (
            <EmptyState icon={<BookOpen />} title="No syllabus yet" hint="Add subjects and units in the Library app — or load the standard JE (EE) template." action={<Button size="sm" onClick={() => openApp('library')}>Open Syllabus Tracker</Button>} />
          )}
          {withUnits.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {withUnits.map((s) => (
                <li key={s.id} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                  {s.name} {Math.round((s.units.filter((u) => u.done).length / s.units.length) * 100)}%
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Mock Test Trajectory" action={<Button size="xs" variant="outline" onClick={() => openApp('mocks')}>Log mock</Button>}>
          {sortedMocks.length ? (
            <div className="h-[300px]">
              <Line
                aria-label="Line chart of mock scores against 75 percent safe zone"
                data={{
                  labels: sortedMocks.map((m) => `${m.date.slice(5)} ${m.name}`.trim()),
                  datasets: [
                    { label: 'Score %', data: sortedMocks.map((m) => +mockPercent(m).toFixed(1)), borderColor: p.primary, backgroundColor: p.primary, tension: 0.35, pointRadius: 4 },
                    { label: 'Safe Zone 75%', data: sortedMocks.map(() => 75), borderColor: p.safeLine, borderDash: [6, 6], pointRadius: 0, fill: 'end', backgroundColor: p.safe },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: { y: { min: 0, max: 100, ...axis }, x: axis },
                  plugins: { legend: { labels: { color: p.text } } },
                }}
              />
            </div>
          ) : (
            <EmptyState icon={<ClipboardList />} title="No mock scores yet" hint="Log your first mock in the Mock Analyser to start the trajectory." action={<Button size="sm" onClick={() => openApp('mocks')}>Open Mock Analyser</Button>} />
          )}
        </Panel>
      </div>

      <Panel title="Study Time Analytics · On-Time hours (last 14 days)" action={<Button size="xs" variant="outline" onClick={() => openApp('timer')}>Start focus</Button>}>
        {sessions.length ? (
          <div className="h-[240px]">
            <Bar
              aria-label="Bar chart of daily focused study hours"
              data={{
                labels: days.map((d) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })),
                datasets: [{ label: 'Focus hours', data: days.map((d) => +(hoursByDay.get(dayKey(d)) ?? 0).toFixed(2)), backgroundColor: p.accent, borderRadius: 6 }],
              }}
              options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, ...axis }, x: axis }, plugins: { legend: { display: false } } }}
            />
          </div>
        ) : (
          <EmptyState icon={<Timer />} title="No study sessions yet" hint="Every session you finish in the Stopwatch lands here." />
        )}
      </Panel>
    </div>
  )
}
