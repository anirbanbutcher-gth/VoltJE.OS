'use client'

import { ChevronLeft, ChevronRight, Coffee, Play, Square, Trash2, Zap } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Panel, StarRating } from '@/components/os/ui'
import { stopwatchTotals, useNow } from '@/lib/hooks'
import { uid, useStored } from '@/lib/store'
import { IDLE_STOPWATCH, dayKey, formatDuration, type Session, type StopwatchState } from '@/lib/types'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const NOTE_FRONT =
  'https://commons.wikimedia.org/wiki/Special:FilePath/India_new_500_INR,_MG_series,_2016,_obverse.jpg'
const NOTE_BACK =
  'https://commons.wikimedia.org/wiki/Special:FilePath/India_new_500_INR,_MG_series,_2016,_reverse.jpg'

const HALF_HOUR_MS = 30 * 60 * 1000 // 30 mins in ms
const QUARTER_HOUR_MS = 15 * 60 * 1000 // 15 mins in ms

// Deterministic "Time is Money" calculator — 100% synced with focusMs & breakMs
function calculateSessionMoney(focusMs: number, breakMs: number, rating: number) {
  const focusBlocks = Math.floor(focusMs / HALF_HOUR_MS)
  const ratePerHalfHour = rating >= 4 ? 100 : rating === 3 ? 50 : 0
  const earned = focusBlocks * ratePerHalfHour

  const breakBlocks = Math.floor(breakMs / QUARTER_HOUR_MS)
  const burned = breakBlocks * 100

  return {
    focusBlocks,
    ratePerHalfHour,
    earned,
    breakBlocks,
    burned,
    net: earned - burned,
  }
}

export function TimerApp() {
  const [sw, setSw] = useStored<StopwatchState>('stopwatch', IDLE_STOPWATCH)
  const [sessions, setSessions] = useStored<Session[]>('sessions', [])
  const now = useNow(250, sw.mode !== 'idle')
  const { focus, rest } = stopwatchTotals(sw, now)
  const reviewing = sw.mode === 'idle' && sw.sessionStart !== null
  const [rating, setRating] = useState(4)
  const [note, setNote] = useState('')

  // Free-floating drag state for the Big Glass Money Box
  const [floatOnScreen, setFloatOnScreen] = useState(false)
  const [vaultPos, setVaultPos] = useState({ x: 40, y: 90 })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      setVaultPos({
        x: Math.min(Math.max(12, e.clientX - dragOffset.current.x), window.innerWidth - 340),
        y: Math.min(Math.max(12, e.clientY - dragOffset.current.y), window.innerHeight - 120),
      })
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  const switchTo = (mode: 'focus' | 'break') =>
    setSw((s) => {
      const t = Date.now()
      if (s.mode === 'idle') return { mode, segmentStart: t, sessionStart: t, focusMs: 0, breakMs: 0 }
      const totals = stopwatchTotals(s, t)
      return { ...s, mode, segmentStart: t, focusMs: totals.focus, breakMs: totals.rest }
    })

  const end = () =>
    setSw((s) => {
      const totals = stopwatchTotals(s, Date.now())
      return { ...s, mode: 'idle', segmentStart: null, focusMs: totals.focus, breakMs: totals.rest }
    })

  // Calculate live session money & historical vault total from saved calendar sessions
  const liveMoney = calculateSessionMoney(focus, rest, rating)
  const savedVaultTotal = sessions.reduce((acc, s) => {
    const m = calculateSessionMoney(s.focusMs, s.breakMs, s.rating)
    return acc + m.net
  }, 0)
  const totalVaultRupees = Math.max(0, savedVaultTotal + liveMoney.net)

  // ₹500 Glass Box Bundling Logic (e.g. 5×₹100 or 2×₹200 + 1×₹100 = 1 physical ₹500 note)
  const fiveHundredNotes = Math.floor(totalVaultRupees / 500)
  const remainderRupees = totalVaultRupees % 500
  const loose200 = Math.floor(remainderRupees / 200)
  const loose100 = Math.floor((remainderRupees % 200) / 100)
  const loose50 = Math.floor((remainderRupees % 100) / 50)

  // Countdown until next Focus reward (every 30m) and next Break burn (every 15m)
  const msUntilNextFocusReward = HALF_HOUR_MS - (focus % HALF_HOUR_MS)
  const msUntilNextBreakBurn = QUARTER_HOUR_MS - (rest % QUARTER_HOUR_MS)

  const save = () => {
    if (sw.sessionStart === null) return
    const finalStats = calculateSessionMoney(sw.focusMs, sw.breakMs, rating)
    const moneyTag = `[Vault ${finalStats.net >= 0 ? `+₹${finalStats.net}` : `-₹${Math.abs(finalStats.net)}`} | Earned ₹${finalStats.earned}, Burned ₹${finalStats.burned}]`
    const fullNote = note.trim() ? `${note.trim()} ${moneyTag}` : moneyTag

    setSessions((list) => [
      ...list,
      {
        id: uid(),
        start: sw.sessionStart!,
        end: Date.now(),
        focusMs: sw.focusMs,
        breakMs: sw.breakMs,
        rating,
        note: fullNote,
      },
    ])
    setSw(IDLE_STOPWATCH)
    setNote('')
    setRating(4)
  }

  // Reusable Glass Money Box UI (can sit docked in the panel or float freely on the desktop)
  const glassMoneyBoxUI = (
    <div
      className={cn(
        'rounded-2xl border border-emerald-500/40 bg-slate-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-2xl transition-shadow',
        floatOnScreen && 'fixed z-[9990] w-[350px] select-none shadow-[0_24px_60px_rgba(0,0,0,0.85)]'
      )}
      style={floatOnScreen ? { left: `${vaultPos.x}px`, top: `${vaultPos.y}px` } : undefined}
    >
      {/* Header / Drag Handle */}
      <div
        onMouseDown={(e) => {
          if (!floatOnScreen || (e.target as HTMLElement).tagName === 'BUTTON') return
          setDragging(true)
          dragOffset.current = { x: e.clientX - vaultPos.x, y: e.clientY - vaultPos.y }
        }}
        className={cn(
          'flex items-center justify-between border-b border-emerald-500/20 pb-2.5',
          floatOnScreen && 'cursor-grab active:cursor-grabbing'
        )}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            {floatOnScreen ? '⠿ DRAG • TIME IS MONEY VAULT' : '💎 TIME IS MONEY GLASS VAULT'}
          </p>
          <p className="mt-0.5 font-mono text-2xl font-extrabold text-white">
            ₹{totalVaultRupees.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-medium text-emerald-300/80">
              ({fiveHundredNotes} × ₹500 notes)
            </span>
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setFloatOnScreen((v) => !v)}
          className="h-7 px-2.5 text-xs"
        >
          {floatOnScreen ? 'Dock in Tab' : 'Float on Screen'}
        </Button>
      </div>

      {/* Physical 3D Glass Chamber storing ₹500 Notes */}
      <div className="relative mt-3 flex h-36 flex-col justify-between overflow-hidden rounded-xl border border-emerald-300/35 bg-gradient-to-b from-white/10 via-emerald-500/10 to-emerald-950/50 p-3 shadow-[inset_0_0_28px_rgba(16,185,129,0.25)]">
        <div className="z-10 flex items-center justify-between text-[11px] font-semibold">
          <span className="text-emerald-300">LOCKED ₹500 STACK: {fiveHundredNotes}</span>
          <span className="text-slate-300">Next ₹500 bundle: ₹{remainderRupees}/₹500</span>
        </div>

        <div className="relative my-auto flex h-20 items-center justify-center">
          {fiveHundredNotes === 0 ? (
            <p className="px-3 text-center text-xs text-slate-300/80">
              Accumulate ₹500 (e.g., 5×₹100 or 2×₹200 + 1×₹100) to lock a crisp ₹500 note inside this glass box.
            </p>
          ) : (
            Array.from({ length: Math.min(fiveHundredNotes, 10) }).map((_, i) => (
              <img
                key={i}
                src={i % 2 === 0 ? NOTE_FRONT : NOTE_BACK}
                alt="500 INR Note"
                className=" absolute w-32 rounded border border-white/30 shadow-[0_8px_20px_rgba(0,0,0,0.65)]"
                style={{
                  transform: `translateY(${(i - 3) * -2.5}px) translateX(${(i - 3) * 7}px) rotate(${
                    (i % 2 === 0 ? 1 : -1) * (i * 2.4)
                  }deg)`,
                }}
              />
            ))
          )}
        </div>

        <div className="z-10 flex items-center justify-between text-[11px] text-slate-200">
          <span>
            Collector Tray:{' '}
            <strong className="text-emerald-300">
              {loose200 > 0 ? `${loose200}×₹200 ` : ''}
              {loose100 > 0 ? `${loose100}×₹100 ` : ''}
              {loose50 > 0 ? `${loose50}×₹50` : ''}
              {remainderRupees === 0 ? '₹0 (All bundled in ₹500s)' : ''}
            </strong>
          </span>
        </div>
      </div>

      {/* Live Session Telemetry Strip */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-2">
          <span className="text-[10px] uppercase text-emerald-400">Current Focus Earned</span>
          <p className="font-mono text-base font-bold text-emerald-300">+₹{liveMoney.earned}</p>
          <p className="text-[10px] text-slate-300">
            {focus < HALF_HOUR_MS
              ? `🔒 30m min lock (${formatDuration(HALF_HOUR_MS - focus)} left)`
              : `Next +₹${liveMoney.ratePerHalfHour} in ${formatDuration(msUntilNextFocusReward)}`}
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 p-2">
          <span className="text-[10px] uppercase text-amber-400">Current Break Burned</span>
          <p className="font-mono text-base font-bold text-rose-400">-₹{liveMoney.burned}</p>
          <p className="text-[10px] text-slate-300">
            {sw.mode === 'break'
              ? `🔥 -₹100 burn in ${formatDuration(msUntilNextBreakBurn)}`
              : `Next -₹100 at ${formatDuration(msUntilNextBreakBurn)} break`}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)]">
      {/* Global OS Window Opacity Enhancement so Active Tabs are Crisp & Readable */}
      <style>{`
        .glass, .glass-soft, [data-slot="dialog-content"] {
          backdrop-filter: blur(28px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(28px) saturate(160%) !important;
        }
        html:not(.light) .glass {
          background-color: rgba(10, 15, 28, 0.93) !important;
        }
      `}</style>

      <div className="space-y-4">
        <Panel title="Drift-Proof Dual Stopwatch">
          {/* Focus Quality Target Selector (Determines ₹200/hr vs ₹100/hr Rate) */}
          <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-background/60 p-2.5">
            <span className="text-xs font-medium text-muted-foreground">Focus Rate Tier:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRating(4)}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs font-semibold transition',
                  rating >= 4
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                ⭐⭐⭐⭐ 4★ (₹200/hr · ₹100/30m)
              </button>
              <button
                type="button"
                onClick={() => setRating(3)}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs font-semibold transition',
                  rating === 3
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                ⭐⭐⭐ 3★ (₹100/hr · ₹50/30m)
              </button>
            </div>
          </div>

          {/* Dual Clocks: On-Time Focus & Off-Time Break */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'On-Time · Focus',
                value: focus,
                active: sw.mode === 'focus',
                icon: <Zap className="size-4" aria-hidden="true" />,
                tone: 'text-primary',
                sub: focus < HALF_HOUR_MS ? 'Under 30m = ₹0' : `+₹${liveMoney.earned} minted`,
              },
              {
                label: 'Off-Time · Break',
                value: rest,
                active: sw.mode === 'break',
                icon: <Coffee className="size-4" aria-hidden="true" />,
                tone: 'text-warning',
                sub: `-₹100 / 15m (Burned: ₹${liveMoney.burned})`,
              },
            ].map((c) => (
              <div
                key={c.label}
                className={cn(
                  'rounded-xl border p-3 transition',
                  c.active
                    ? 'border-primary/60 bg-primary/10 shadow-[0_0_24px_-6px_var(--primary)]'
                    : 'border-border'
                )}
              >
                <p className={cn('flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide', c.tone)}>
                  {c.icon}
                  {c.label}
                </p>
                <p className="mt-2 font-mono text-2xl font-semibold tabular-nums sm:text-3xl" aria-live="off">
                  {formatDuration(c.value)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{c.sub}</p>
              </div>
            ))}
          </div>

          {reviewing ? (
            <div className="mt-4 space-y-3 rounded-xl border border-primary/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Session complete — {formatDuration(sw.focusMs, false)} focus. Rate it:
                </p>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 font-mono text-xs font-bold',
                    liveMoney.net >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  )}
                >
                  Net: {liveMoney.net >= 0 ? `+₹${liveMoney.net}` : `-₹${Math.abs(liveMoney.net)}`}
                </span>
              </div>
              <StarRating value={rating} onChange={setRating} />
              <label htmlFor="session-note" className="sr-only">
                Session note
              </label>
              <input
                id="session-note"
                className="field"
                placeholder="What did you cover? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={save}>Save to calendar & Vault</Button>
                <Button variant="ghost" onClick={() => setSw(IDLE_STOPWATCH)}>
                  Discard
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {sw.mode !== 'focus' && (
                <Button onClick={() => switchTo('focus')}>
                  <Play /> {sw.mode === 'idle' ? 'Start focus' : 'Resume focus'}
                </Button>
              )}
              {sw.mode === 'focus' && (
                <Button variant="secondary" onClick={() => switchTo('break')}>
                  <Coffee /> Take a break (-₹100/15m)
                </Button>
              )}
              {sw.mode !== 'idle' && (
                <Button variant="destructive" onClick={end}>
                  <Square /> End session
                </Button>
              )}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground text-pretty">
            100% synced with your Glass Vault, Study Calendar, and Volt AI. Uses epoch timestamps (Date.now deltas) so Focus and Break never drift or mix.
          </p>
        </Panel>

        {/* Big Glass Money Box (Renders here or floats freely on screen) */}
        {glassMoneyBoxUI}
      </div>

      <StudyCalendar
        sessions={sessions}
        onDelete={(id) => setSessions((l) => l.filter((s) => s.id !== id))}
      />
    </div>
  )
}

function StudyCalendar({ sessions, onDelete }: { sessions: Session[]; onDelete: (id: string) => void }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const [selected, setSelected] = useState(() => dayKey(Date.now()))

  const byDay = new Map<string, Session[]>()
  for (const s of sessions) {
    const k = dayKey(s.end)
    byDay.set(k, [...(byDay.get(k) ?? []), s])
  }

  const first = new Date(cursor.y, cursor.m, 1)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) => {
    const day = i - offset + 1
    return day >= 1 && day <= daysInMonth ? new Date(cursor.y, cursor.m, day) : null
  })
  const move = (delta: number) =>
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  const daySessions = byDay.get(selected) ?? []
  const today = dayKey(Date.now())

  return (
    <Panel
      title={first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
      action={
        <div className="flex gap-1">
          <Button size="icon-sm" variant="ghost" onClick={() => move(-1)} aria-label="Previous month">
            <ChevronLeft />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={() => move(1)} aria-label="Next month">
            <ChevronRight />
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-7 gap-1 text-center text-xs" role="grid" aria-label="Study calendar">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 font-medium text-muted-foreground" role="columnheader">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} aria-hidden="true" />
          const k = dayKey(d)
          const list = byDay.get(k) ?? []
          const hrs = list.reduce((t, s) => t + s.focusMs, 0) / 36e5
          const dayRupees = list.reduce((t, s) => t + calculateSessionMoney(s.focusMs, s.breakMs, s.rating).net, 0)
          const intensity = Math.min(1, hrs / 8)
          return (
            <button
              key={k}
              type="button"
              role="gridcell"
              aria-selected={selected === k}
              aria-label={`${d.toDateString()}: ${hrs.toFixed(1)} focus hours, ₹${dayRupees}`}
              onClick={() => setSelected(k)}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition hover:border-primary/60',
                selected === k ? 'border-primary ring-2 ring-primary/40' : 'border-border',
                k === today && 'font-bold text-primary'
              )}
              style={
                hrs > 0
                  ? { background: `color-mix(in oklch, var(--primary) ${Math.round(12 + intensity * 50)}%, transparent)` }
                  : undefined
              }
            >
              <span>{d.getDate()}</span>
              {hrs > 0 && <span className="font-mono text-[10px] leading-none">{hrs.toFixed(1)}h</span>}
              {list.length > 0 && (
                <span
                  className={cn(
                    'font-mono text-[9px] leading-none font-bold',
                    dayRupees >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  )}
                >
                  {dayRupees >= 0 ? `+₹${dayRupees}` : `-₹${Math.abs(dayRupees)}`}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        <h4 className="mb-2 text-sm font-medium">{new Date(selected + 'T00:00').toDateString()}</h4>
        {daySessions.length ? (
          <ul className="space-y-2">
            {daySessions.map((s) => {
              const stats = calculateSessionMoney(s.focusMs, s.breakMs, s.rating)
              return (
                <li key={s.id} className="glass-soft flex items-center gap-3 rounded-lg p-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs text-muted-foreground">
                        {new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                        {new Date(s.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 font-mono text-[10px] font-bold',
                          stats.net >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        )}
                      >
                        {stats.net >= 0 ? `+₹${stats.net}` : `-₹${Math.abs(stats.net)}`}
                      </span>
                    </div>
                    <p>
                      Focus {formatDuration(s.focusMs, false)} · Break {formatDuration(s.breakMs, false)}
                    </p>
                    {s.note && <p className="truncate text-xs text-muted-foreground">{s.note}</p>}
                  </div>
                  <StarRating value={s.rating} size="sm" />
                  <Button size="icon-xs" variant="ghost" onClick={() => onDelete(s.id)} aria-label="Delete session">
                    <Trash2 />
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No sessions on this day.</p>
        )}
      </div>
    </Panel>
  )
}