import { cn } from '@/lib/utils'
import dwellLogo from '../../DwellLogo.png'

interface BrandLogoProps {
  className?: string
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <img
      src={dwellLogo}
      alt="Dwell"
      className={cn('w-auto object-contain', className)}
    />
  )
}
