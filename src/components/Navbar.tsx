import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-serif font-semibold text-slate-300 hover:text-slate-100 transition-colors">
          RoomieMatch
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
            Home
          </Link>
          <Link to="/questionnaire" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
            Find Roommates
          </Link>
          <Link to="/landlord" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
            Landlord Portal
          </Link>
          <Link to="/reviews" className="px-4 py-1.5 rounded-full text-sm font-sans font-light text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-all">
            Reviews
          </Link>
          <Link to="/demo" className="px-4 py-1.5 rounded-full text-sm font-sans font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/[0.08] transition-all" style={{ textShadow: '0 0 12px rgba(52,211,153,0.4)' }}>
            Demo
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            to="/questionnaire"
            className="px-5 py-1.5 rounded-full border border-slate-700 text-slate-300 text-sm font-sans font-medium hover:bg-white/[0.06] hover:border-slate-500 transition-all"
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
            className="block w-5 h-0.5 bg-slate-300 origin-center"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-0.5 bg-slate-300"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-slate-300 origin-center"
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
            className="md:hidden overflow-hidden bg-black/90 backdrop-blur-md"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              <Link onClick={() => setMobileOpen(false)} to="/" className="px-4 py-2 rounded-full text-sm font-sans font-light text-slate-400 hover:bg-white/[0.06]">Home</Link>
              <Link onClick={() => setMobileOpen(false)} to="/questionnaire" className="px-4 py-2 rounded-full text-sm font-sans font-light text-slate-400 hover:bg-white/[0.06]">Find Roommates</Link>
              <Link onClick={() => setMobileOpen(false)} to="/landlord" className="px-4 py-2 rounded-full text-sm font-sans font-light text-slate-400 hover:bg-white/[0.06]">Landlord Portal</Link>
              <Link onClick={() => setMobileOpen(false)} to="/reviews" className="px-4 py-2 rounded-full text-sm font-sans font-light text-slate-400 hover:bg-white/[0.06]">Reviews</Link>
              <Link onClick={() => setMobileOpen(false)} to="/demo" className="px-4 py-2 rounded-full text-sm font-sans font-medium text-emerald-400 hover:bg-emerald-500/[0.08]" style={{ textShadow: '0 0 12px rgba(52,211,153,0.4)' }}>Demo</Link>
              <Link
                onClick={() => setMobileOpen(false)}
                to="/questionnaire"
                className="mt-2 px-5 py-2 rounded-full border border-slate-700 text-slate-300 text-sm font-sans font-medium text-center"
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
