'use client'

import { useEffect, useRef } from 'react'

type Note = {
  x: number
  y: number
  vy: number
  sway: number
  swaySpeed: number
  rot: number
  vr: number
  flip: number
  vf: number
  scale: number
}

const NOTE_W = 124
const NOTE_H = 56

function drawNote(ctx: CanvasRenderingContext2D, n: Note, t: number) {
  ctx.save()
  ctx.translate(n.x + Math.sin(n.sway + t * n.swaySpeed) * 24, n.y)
  ctx.rotate(n.rot)
  const fx = Math.cos(n.flip)
  ctx.scale(n.scale * (Math.abs(fx) < 0.12 ? 0.12 * Math.sign(fx || 1) : fx), n.scale)
  const front = fx >= 0
  const x = -NOTE_W / 2
  const y = -NOTE_H / 2

  const g = ctx.createLinearGradient(x, y, x + NOTE_W, y + NOTE_H)
  g.addColorStop(0, front ? '#b9bba9' : '#a9ad9b')
  g.addColorStop(0.55, front ? '#9ea391' : '#959a87')
  g.addColorStop(1, front ? '#c4c3ad' : '#b1b19c')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.roundRect(x, y, NOTE_W, NOTE_H, 3)
  ctx.fill()

  ctx.strokeStyle = 'rgba(70, 76, 60, 0.55)'
  ctx.lineWidth = 1
  ctx.strokeRect(x + 4, y + 4, NOTE_W - 8, NOTE_H - 8)

  ctx.fillStyle = 'rgba(52, 58, 44, 0.85)'
  if (front) {
    ctx.font = '700 15px ui-sans-serif, system-ui'
    ctx.fillText('₹500', x + 9, y + 21)
    ctx.font = '600 6px ui-sans-serif, system-ui'
    ctx.fillText('RESERVE BANK OF INDIA', x + 9, y + 31)
    const r = ctx.createRadialGradient(x + 88, y + 28, 2, x + 88, y + 28, 17)
    r.addColorStop(0, 'rgba(240, 240, 225, 0.9)')
    r.addColorStop(1, 'rgba(160, 165, 145, 0.2)')
    ctx.fillStyle = r
    ctx.beginPath()
    ctx.ellipse(x + 88, y + 28, 14, 17, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(45, 120, 105, 0.7)'
    ctx.fillRect(x + 64, y, 2.5, NOTE_H)
    ctx.fillStyle = 'rgba(52, 58, 44, 0.75)'
    ctx.font = '700 11px ui-sans-serif, system-ui'
    ctx.fillText('500', x + NOTE_W - 30, y + NOTE_H - 9)
  } else {
    ctx.font = '800 22px ui-sans-serif, system-ui'
    ctx.fillText('500', x + 12, y + 36)
    ctx.strokeStyle = 'rgba(52, 58, 44, 0.4)'
    ctx.strokeRect(x + 66, y + 12, 44, 30)
  }
  ctx.restore()
}

export function Backdrop({ dark }: { dark: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (initial: boolean): Note => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -NOTE_H - Math.random() * 200,
      vy: 0.35 + Math.random() * 0.75,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.0006 + Math.random() * 0.0012,
      rot: (Math.random() - 0.5) * 1.2,
      vr: (Math.random() - 0.5) * 0.006,
      flip: Math.random() * Math.PI * 2,
      vf: 0.008 + Math.random() * 0.02,
      scale: 0.55 + Math.random() * 0.55,
    })
    const notes: Note[] = dark ? Array.from({ length: Math.round(Math.min(26, Math.max(10, w / 85))) }, () => spawn(true)) : []

    const drawGrid = (color: string, size: number) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < w; x += size) {
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, h)
      }
      for (let y = 0; y < h; y += size) {
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(w, y + 0.5)
      }
      ctx.stroke()
    }

    const drawLight = (t: number) => {
      const bg = ctx.createLinearGradient(0, 0, w, h)
      bg.addColorStop(0, '#eaf1fc')
      bg.addColorStop(1, '#f7f9fd')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
      drawGrid('rgba(59, 99, 180, 0.07)', 44)

      const mid = h * 0.56
      const phases = [
        { color: 'rgba(220, 60, 60, 0.55)', offset: 0 },
        { color: 'rgba(230, 160, 20, 0.6)', offset: (2 * Math.PI) / 3 },
        { color: 'rgba(40, 90, 220, 0.6)', offset: (4 * Math.PI) / 3 },
      ]
      const amp = Math.min(140, h * 0.16)
      const k = (Math.PI * 2) / Math.max(520, w * 0.55)
      const omega = t * 0.0011
      ctx.lineWidth = 2.4
      for (const p of phases) {
        ctx.strokeStyle = p.color
        ctx.beginPath()
        for (let x = 0; x <= w; x += 6) {
          const y = mid + amp * Math.sin(k * x - omega + p.offset)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(40, 90, 220, 0.12)'
      ctx.lineWidth = 18
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const y = h * 0.3 + amp * 0.6 * Math.sin(k * 0.45 * x + omega * 0.4)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.strokeStyle = 'rgba(30, 50, 90, 0.18)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, mid)
      ctx.lineTo(w, mid)
      ctx.stroke()
    }

    const drawDark = (t: number) => {
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#050c1a')
      bg.addColorStop(1, '#0b1d33')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
      drawGrid('rgba(34, 211, 238, 0.05)', 48)

      ctx.lineWidth = 1.5
      for (let i = 0; i < 3; i++) {
        const y = h * (0.22 + i * 0.28)
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)'
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
        const px = ((t * 0.12 + i * 400) % (w + 200)) - 100
        const glow = ctx.createRadialGradient(px, y, 0, px, y, 90)
        glow.addColorStop(0, 'rgba(34, 211, 238, 0.45)')
        glow.addColorStop(1, 'rgba(34, 211, 238, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(px - 90, y - 90, 180, 180)
      }

      ctx.globalAlpha = 0.5
      for (let i = 0; i < notes.length; i++) {
        const n = notes[i]
        if (!reduced) {
          n.y += n.vy
          n.rot += n.vr
          n.flip += n.vf
          if (n.y - NOTE_H > h) notes[i] = spawn(false)
        }
        drawNote(ctx, n, t)
      }
      ctx.globalAlpha = 1
    }

    const frame = (t: number) => {
      if (dark) drawDark(t)
      else drawLight(t)
      if (!reduced) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [dark])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
}
