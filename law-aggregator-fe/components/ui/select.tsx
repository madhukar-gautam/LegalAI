'use client'
import * as React from 'react'
import { cn } from './utils'

export function Select({
  value,
  onChange,
  options = [],
  className,
}: {
  value?: string
  onChange?: (v: string) => void
  options?: string[]
  className?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        'h-10 w-full rounded-xl border border-slate-600 px-3 text-sm text-slate-100 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
        className
      )}
    >
      {options.map((o, i) => (
        <option key={i} value={o} className="bg-slate-800 text-slate-100">
          {o || 'Any practice'}
        </option>
      ))}
    </select>
  )
}
