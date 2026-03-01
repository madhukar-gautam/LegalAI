import * as React from 'react'
import { cn } from './utils'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[120px] w-full rounded-xl border border-slate-600 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
