import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-xl border border-[rgba(255,145,92,0.18)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm font-sans text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] focus:outline-none focus:border-[rgba(255,145,92,0.45)] focus:ring-1 focus:ring-[rgba(255,145,92,0.2)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
