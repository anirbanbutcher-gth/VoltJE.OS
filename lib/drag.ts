'use client'

import type React from 'react'

export type Point = { x: number; y: number }
export type Bounds = { minX: number; minY: number; maxX: number; maxY: number }

type DragOptions = {
  onMove: (p: Point) => void
  onEnd?: (p: Point) => void
  bounds: () => Bounds
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Pointer drag with release momentum, friction and soft wall bounces. */
export function startInertialDrag(event: React.PointerEvent, origin: Point, { onMove, onEnd, bounds }: DragOptions) {
  if (event.button !== 0) return
  const target = event.target as HTMLElement
  if (target.closest('button, input, textarea, select, a, [data-no-drag]')) return
  event.preventDefault()

  const startX = event.clientX
  const startY = event.clientY
  let pos = { ...origin }
  let vx = 0
  let vy = 0
  let lastT = performance.now()
  let lastX = startX
  let lastY = startY

  const fit = (p: Point): Point => {
    const b = bounds()
    return { x: clamp(p.x, b.minX, b.maxX), y: clamp(p.y, b.minY, b.maxY) }
  }

  const move = (ev: PointerEvent) => {
    const now = performance.now()
    const dt = Math.max(1, now - lastT)
    vx = vx * 0.5 + ((ev.clientX - lastX) / dt) * 0.5
    vy = vy * 0.5 + ((ev.clientY - lastY) / dt) * 0.5
    lastT = now
    lastX = ev.clientX
    lastY = ev.clientY
    pos = fit({ x: origin.x + ev.clientX - startX, y: origin.y + ev.clientY - startY })
    onMove(pos)
  }

  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    document.body.style.userSelect = ''

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || performance.now() - lastT > 90) {
      onEnd?.(pos)
      return
    }
    vx = clamp(vx, -3, 3)
    vy = clamp(vy, -3, 3)
    let prev = performance.now()
    const step = (now: number) => {
      const dt = Math.min(32, now - prev)
      prev = now
      const friction = Math.pow(0.93, dt / 16)
      vx *= friction
      vy *= friction
      let nx = pos.x + vx * dt
      let ny = pos.y + vy * dt
      const b = bounds()
      if (nx < b.minX || nx > b.maxX) {
        nx = clamp(nx, b.minX, b.maxX)
        vx = -vx * 0.45
      }
      if (ny < b.minY || ny > b.maxY) {
        ny = clamp(ny, b.minY, b.maxY)
        vy = -vy * 0.45
      }
      pos = { x: nx, y: ny }
      onMove(pos)
      if (Math.hypot(vx, vy) > 0.015) requestAnimationFrame(step)
      else onEnd?.(pos)
    }
    requestAnimationFrame(step)
  }

  document.body.style.userSelect = 'none'
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
}
