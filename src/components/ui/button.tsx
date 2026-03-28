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
            'bg-[linear-gradient(135deg,var(--brand-accent),var(--brand-accent-strong))] text-[#311207] hover:brightness-105 px-5 py-2.5 shadow-[0_16px_30px_rgba(255,122,73,0.18)]',
          variant === 'outline' &&
            'border border-[rgba(255,145,92,0.22)] text-[var(--brand-text)] hover:bg-[rgba(255,145,92,0.1)] hover:border-[rgba(255,145,92,0.45)] px-5 py-2.5',
          variant === 'ghost' &&
            'text-[var(--brand-muted)] hover:text-[var(--brand-text)] hover:bg-[rgba(255,145,92,0.08)] px-4 py-2',
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
