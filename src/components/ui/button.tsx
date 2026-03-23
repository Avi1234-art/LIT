import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-sans font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer',
          variant === 'default' &&
            'bg-slate-200 text-slate-900 hover:bg-white px-5 py-2.5',
          variant === 'outline' &&
            'border border-slate-700 text-slate-300 hover:bg-white/[0.06] hover:border-slate-500 px-5 py-2.5',
          variant === 'ghost' &&
            'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] px-4 py-2',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
