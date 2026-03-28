import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDemo } from '@/context/DemoContext'
import { BrandLogo } from '@/components/BrandLogo'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { startDemo } = useDemo()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6">
      <div className="brand-nav-shell max-w-7xl mx-auto px-5 sm:px-6 h-16 rounded-full flex items-center justify-between backdrop-blur-xl">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <BrandLogo className="h-10 sm:h-11" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:text-[var(--brand-text)] hover:bg-[rgba(255,145,92,0.08)] transition-all">
            Home
          </Link>
          <Link to="/questionnaire" data-demo="nav-find-roommates" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:text-[var(--brand-text)] hover:bg-[rgba(255,145,92,0.08)] transition-all">
            Find Roommates
          </Link>
          <Link to="/how-it-works" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:text-[var(--brand-text)] hover:bg-[rgba(255,145,92,0.08)] transition-all">
            How It Works
          </Link>
          <Link to="/landlord" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:text-[var(--brand-text)] hover:bg-[rgba(255,145,92,0.08)] transition-all">
            Landlord Portal
          </Link>
          <Link to="/reviews" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:text-[var(--brand-text)] hover:bg-[rgba(255,145,92,0.08)] transition-all">
            Reviews
          </Link>
          <button
            onClick={() => { navigate('/'); setTimeout(() => startDemo(), 100) }}
            className="px-4 py-1.5 rounded-full text-sm font-sans font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent-soft)] hover:bg-[rgba(255,145,92,0.08)] transition-all cursor-pointer"
            style={{ textShadow: '0 0 12px rgba(255,145,92,0.35)' }}
          >
            Demo
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            to="/questionnaire"
            className="brand-outline-button px-5 py-1.5 rounded-full text-sm font-sans font-medium"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-[var(--brand-text)] origin-center"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-0.5 bg-[var(--brand-text)]"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-[var(--brand-text)] origin-center"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="brand-nav-shell md:hidden overflow-hidden mt-3 rounded-3xl backdrop-blur-md"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              <Link onClick={() => setMobileOpen(false)} to="/" className="px-4 py-2 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:bg-[rgba(255,145,92,0.08)]">Home</Link>
              <Link onClick={() => setMobileOpen(false)} to="/questionnaire" className="px-4 py-2 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:bg-[rgba(255,145,92,0.08)]">Find Roommates</Link>
              <Link onClick={() => setMobileOpen(false)} to="/how-it-works" className="px-4 py-2 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:bg-[rgba(255,145,92,0.08)]">How It Works</Link>
              <Link onClick={() => setMobileOpen(false)} to="/landlord" className="px-4 py-2 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:bg-[rgba(255,145,92,0.08)]">Landlord Portal</Link>
              <Link onClick={() => setMobileOpen(false)} to="/reviews" className="px-4 py-2 rounded-full text-sm font-sans font-light text-[var(--brand-muted)] hover:bg-[rgba(255,145,92,0.08)]">Reviews</Link>
              <button onClick={() => { setMobileOpen(false); navigate('/'); setTimeout(() => startDemo(), 100) }} className="px-4 py-2 rounded-full text-sm font-sans font-medium text-[var(--brand-accent)] hover:bg-[rgba(255,145,92,0.08)] text-left cursor-pointer" style={{ textShadow: '0 0 12px rgba(255,145,92,0.35)' }}>Demo</button>
              <Link
                onClick={() => setMobileOpen(false)}
                to="/questionnaire"
                className="brand-outline-button mt-2 px-5 py-2 rounded-full text-sm font-sans font-medium text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
