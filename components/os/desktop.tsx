'use client'

import {
  BookOpen,
  CalendarRange,
  ClipboardList,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  Minus,
  Moon,
  Newspaper,
  Radar,
  Settings2,
  StickyNote,
  Sun,
  Timer,
  X,
  Zap,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import '@/lib/chart-setup'
import { AffairsApp } from '@/components/apps/affairs'
import { DashboardApp } from '@/components/apps/dashboard'
import { LibraryApp } from '@/components/apps/library'
import { MocksApp } from '@/components/apps/mocks'
import { PlannerApp } from '@/components/apps/planner'
import { RadarApp } from '@/components/apps/radar'
import { StickiesApp } from '@/components/apps/stickies'
import { TimerApp } from '@/components/apps/timer'
import { Agent } from '@/components/os/agent'
import { Backdrop } from '@/components/os/backdrop'
import { SettingsModal } from '@/components/os/settings'
import { Button } from '@/components/ui/button'
import { startInertialDrag } from '@/lib/drag'
import { stopwatchTotals, useIsMobile, useNow } from '@/lib/hooks'
import { useStored } from '@/lib/store'
import { IDLE_STOPWATCH, formatDuration, type StopwatchState, type Theme } from '@/lib/types'
import { cn } from '@/lib/utils'

type AppDef = { id: string; title: string; icon: ReactNode; render: (dark: boolean) => ReactNode }

const APPS: AppDef[] = [
  { id: 'dashboard', title: 'Command Dashboard', icon: <LayoutDashboard />, render: (dark) => <DashboardApp dark={dark} /> },
  { id: 'planner', title: 'Task Planner', icon: <CalendarRange />, render: () => <PlannerApp /> },
  { id: 'timer', title: 'Stopwatch & Calendar', icon: <Timer />, render: () => <TimerApp /> },
  { id: 'stickies', title: 'Sticky Board', icon: <StickyNote />, render: () => <StickiesApp /> },
  { id: 'radar', title: 'Exam Radar', icon: <Radar />, render: () => <RadarApp /> },
  { id: 'mocks', title: 'Mock Analyser', icon: <ClipboardList />, render: () => <MocksApp /> },
  { id: 'affairs', title: 'Current Affairs', icon: <Newspaper />, render: () => <AffairsApp /> },
  { id: 'library', title: 'Library & Syllabus', icon: <BookOpen />, render: () => <LibraryApp /> },
]

type Win = { id: string; x: number; y: number; w: number; h: number; z: number; min: boolean; max: boolean }

export function Desktop() {
  const [theme, setTheme] = useStored<Theme>('theme', 'dark')
  const dark = theme === 'dark'
  const [wins, setWins] = useState<Win[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([])
  const zTop = useRef(10)
  const mobile = useIsMobile()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#050c1a' : '#eaf1fc')
  }, [dark])

  const open = useCallback((id: string) => {
    zTop.current += 1
    const z = zTop.current
    setWins((list) => {
      const found = list.find((w) => w.id === id)
      if (found) return list.map((w) => (w.id === id ? { ...w, z, min: false } : w))
      const w = Math.min(1000, window.innerWidth - 40)
      const h = Math.min(660, window.innerHeight - 150)
      const n = list.length % 6
      return [...list, { id, w, h, z, min: false, max: false, x: Math.max(20, (window.innerWidth - w) / 2 - 60 + n * 30), y: 60 + n * 26 }]
    })
  }, [])

  useEffect(() => {
    open('dashboard')
    const onOpen = (e: Event) => open((e as CustomEvent<string>).detail)
    const onToast = (e: Event) => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t.slice(-3), { id, text: (e as CustomEvent<string>).detail }])
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000)
    }
    window.addEventListener('volt:open', onOpen)
    window.addEventListener('volt:toast', onToast)
    return () => {
      window.removeEventListener('volt:open', onOpen)
      window.removeEventListener('volt:toast', onToast)
    }
  }, [open])

  const patch = (id: string, change: Partial<Win>) => setWins((list) => list.map((w) => (w.id === id ? { ...w, ...change } : w)))
  const focus = (id: string) => {
    zTop.current += 1
    patch(id, { z: zTop.current })
  }
  const visible = wins.filter((w) => !w.min)
  const topId = visible.reduce<Win | null>((a, w) => (!a || w.z > a.z ? w : a), null)?.id

  return (
    <div className="relative h-dvh overflow-hidden">
      <Backdrop dark={dark} />
      <TopBar dark={dark} onToggleTheme={() => setTheme(dark ? 'light' : 'dark')} onSettings={() => setSettingsOpen(true)} onOpenTimer={() => open('timer')} />

      <main aria-label="Desktop">
        {!visible.length && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <Zap className="size-12 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold tracking-tight">Volt OS v15</h1>
            <p className="text-muted-foreground">Open an app from the dock to start.</p>
          </div>
        )}
        {wins.map((w) => {
          const app = APPS.find((a) => a.id === w.id)!
          if (w.min) return null
          if (mobile && w.id !== topId) return null
          const full = w.max || mobile
          return (
            <section
              key={w.id}
              aria-label={app.title}
              onPointerDownCapture={() => w.id !== topId && focus(w.id)}
              className={cn('glass absolute flex flex-col overflow-hidden rounded-2xl', w.id === topId ? 'ring-1 ring-primary/40' : 'opacity-95')}
              style={full ? { left: 8, top: 52, right: 8, bottom: mobile ? 84 : 92, zIndex: w.z } : { left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z }}
            >
              <header
                className={cn('flex shrink-0 items-center gap-2 border-b border-border px-3 py-1.5 select-none', !full && 'cursor-grab active:cursor-grabbing')}
                onPointerDown={(e) =>
                  !full &&
                  startInertialDrag(e, { x: w.x, y: w.y }, {
                    onMove: (p) => patch(w.id, p),
                    bounds: () => ({ minX: 80 - w.w, minY: 44, maxX: window.innerWidth - 80, maxY: window.innerHeight - 90 }),
                  })
                }
                onDoubleClick={() => !mobile && patch(w.id, { max: !w.max })}
              >
                <span className="text-primary [&_svg]:size-4" aria-hidden="true">
                  {app.icon}
                </span>
                <h2 className="flex-1 truncate text-sm font-semibold">{app.title}</h2>
                <Button size="icon-xs" variant="ghost" onClick={() => patch(w.id, { min: true })} aria-label={`Minimise ${app.title}`}>
                  <Minus />
                </Button>
                {!mobile && (
                  <Button size="icon-xs" variant="ghost" onClick={() => patch(w.id, { max: !w.max })} aria-label={w.max ? `Restore ${app.title}` : `Maximise ${app.title}`}>
                    {w.max ? <Minimize2 /> : <Maximize2 />}
                  </Button>
                )}
                <Button size="icon-xs" variant="ghost" onClick={() => setWins((l) => l.filter((x) => x.id !== w.id))} aria-label={`Close ${app.title}`}>
                  <X />
                </Button>
              </header>
              <div className="scroll-thin flex-1 overflow-auto">{app.render(dark)}</div>
              {!full && (
                <div
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 size-4 cursor-se-resize"
                  onPointerDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const sx = e.clientX
                    const sy = e.clientY
                    const move = (ev: PointerEvent) => patch(w.id, { w: Math.max(420, w.w + ev.clientX - sx), h: Math.max(300, w.h + ev.clientY - sy) })
                    const up = () => {
                      window.removeEventListener('pointermove', move)
                      window.removeEventListener('pointerup', up)
                    }
                    window.addEventListener('pointermove', move)
                    window.addEventListener('pointerup', up)
                  }}
                />
              )}
            </section>
          )
        })}
      </main>

      <nav aria-label="Dock" className="glass fixed bottom-3 left-1/2 z-[7000] flex max-w-[calc(100vw-1rem)] -translate-x-1/2 gap-1 overflow-x-auto rounded-2xl p-1.5 scroll-thin">
        {APPS.map((a) => {
          const w = wins.find((x) => x.id === a.id)
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => (w && !w.min && w.id === topId ? patch(a.id, { min: true }) : open(a.id))}
              className={cn(
                'group relative flex size-11 shrink-0 items-center justify-center rounded-xl transition hover:-translate-y-1 hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring [&_svg]:size-5',
                w && !w.min ? 'text-primary' : 'text-foreground',
              )}
              aria-label={a.title}
              title={a.title}
            >
              {a.icon}
              {w && <span className="absolute bottom-0.5 size-1 rounded-full bg-primary" aria-hidden="true" />}
            </button>
          )
        })}
      </nav>

      <Agent onOpenSettings={() => setSettingsOpen(true)} />
      <SettingsModal key={String(settingsOpen)} open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <div className="pointer-events-none fixed top-14 left-1/2 z-[9500] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="glass pointer-events-auto rounded-xl px-4 py-2 text-sm">
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}

function TopBar({ dark, onToggleTheme, onSettings, onOpenTimer }: { dark: boolean; onToggleTheme: () => void; onSettings: () => void; onOpenTimer: () => void }) {
  const [sw] = useStored<StopwatchState>('stopwatch', IDLE_STOPWATCH)
  const now = useNow(1000)
  const { focus, rest } = stopwatchTotals(sw, now)
  const running = sw.mode !== 'idle'

  useEffect(() => {
    document.title = running ? `${sw.mode === 'focus' ? '⚡' : '☕'} ${formatDuration(sw.mode === 'focus' ? focus : rest)} · Volt OS` : 'Volt OS v15 — JE Exam Command Center'
  }, [running, sw.mode, focus, rest])

  return (
    <header className="glass fixed inset-x-0 top-0 z-[7500] flex h-11 items-center gap-3 rounded-none border-x-0 border-t-0 px-3">
      <div className="flex items-center gap-1.5 font-bold tracking-tight">
        <Zap className="size-4 text-primary" aria-hidden="true" />
        Volt OS <span className="font-mono text-xs text-muted-foreground">v15</span>
      </div>
      <div className="flex-1" />
      {running && (
        <button type="button" onClick={onOpenTimer} className={cn('rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums', sw.mode === 'focus' ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning')}>
          {sw.mode === 'focus' ? 'FOCUS' : 'BREAK'} {formatDuration(sw.mode === 'focus' ? focus : rest)}
        </button>
      )}
      <time className="hidden font-mono text-xs text-muted-foreground sm:block" suppressHydrationWarning>
        {new Date(now).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
      </time>
      <Button size="icon-sm" variant="ghost" onClick={onToggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
        {dark ? <Sun /> : <Moon />}
      </Button>
      <Button size="icon-sm" variant="ghost" onClick={onSettings} aria-label="Open settings">
        <Settings2 />
      </Button>
    </header>
  )
}
