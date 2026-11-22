'use client'

import { useEffect, useState } from 'react'
import type { StopwatchState } from './types'

/** Re-renders on an interval; the displayed value is always derived from Date.now(), so it never drifts. */
export function useNow(intervalMs = 1000, active = true) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    const onVisible = () => setNow(Date.now())
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [intervalMs, active])
  return now
}

export function stopwatchTotals(s: StopwatchState, now: number) {
  const live = s.segmentStart ? Math.max(0, now - s.segmentStart) : 0
  return {
    focus: s.focusMs + (s.mode === 'focus' ? live : 0),
    rest: s.breakMs + (s.mode === 'break' ? live : 0),
  }
}

export function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return mobile
}
