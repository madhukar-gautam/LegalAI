import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-slate-900 hover:bg-accent-light shadow-glow-sm hover:shadow-glow',
        outline:
          'bg-transparent border border-slate-600 text-slate-200 hover:border-accent/50 hover:text-accent',
      },
      size: { default: 'h-10 px-4', sm: 'h-8 px-3', lg: 'h-12 px-6 text-base' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
)
Button.displayName = 'Button'
