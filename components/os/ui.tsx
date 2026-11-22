'use client'

import { Star, X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}) {
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    panel.current?.querySelector<HTMLElement>('input, textarea, button')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-background/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} className={cn('glass w-full max-w-md rounded-2xl p-5', className)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close dialog">
            <X />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, hint, action }: { icon: ReactNode; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="glass-soft flex flex-col items-center justify-center gap-2 rounded-xl px-6 py-8 text-center">
      <div className="text-primary [&_svg]:size-7">{icon}</div>
      <p className="font-medium">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted-foreground text-pretty">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </label>
  )
}

export function StarRating({ value, onChange, size = 'md' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-1" role={onChange ? 'radiogroup' : 'img'} aria-label={`Rating ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onChange(n)}
            className="rounded-md p-0.5 text-warning transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star className={cn(size === 'sm' ? 'size-4' : 'size-7', n <= value ? 'fill-current' : 'opacity-40')} />
          </button>
        ) : (
          <Star key={n} className={cn('text-warning', size === 'sm' ? 'size-3' : 'size-5', n <= value ? 'fill-current' : 'opacity-30')} aria-hidden="true" />
        ),
      )}
    </div>
  )
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('glass-soft rounded-xl p-4', className)}>
      {(title || action) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && <h3 className="text-sm font-semibold tracking-wide">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
