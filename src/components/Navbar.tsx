import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-serif font-semibold text-slate-100 tracking-wide group-hover:text-white transition-colors">
            RoomieMatch
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-sans font-light text-slate-400 hover:text-slate-200 transition-colors">
            Home
          </Link>
          <Link to="/questionnaire" className="text-sm font-sans font-light text-slate-400 hover:text-slate-200 transition-colors">
            Find Roommates
          </Link>
          <Link to="/landlord" className="text-sm font-sans font-light text-slate-400 hover:text-slate-200 transition-colors">
            Landlord Portal
          </Link>
          <Link to="/reviews" className="text-sm font-sans font-light text-slate-400 hover:text-slate-200 transition-colors">
            Reviews
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/questionnaire"
            className="px-5 py-2 rounded-full border border-slate-600 text-slate-200 text-sm font-sans font-medium hover:bg-slate-800 hover:border-slate-500 transition-all"
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
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-md border-b border-slate-800/60"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <Link onClick={() => setMobileOpen(false)} to="/" className="text-sm font-sans font-light text-slate-400 py-2">Home</Link>
              <Link onClick={() => setMobileOpen(false)} to="/questionnaire" className="text-sm font-sans font-light text-slate-400 py-2">Find Roommates</Link>
              <Link onClick={() => setMobileOpen(false)} to="/landlord" className="text-sm font-sans font-light text-slate-400 py-2">Landlord Portal</Link>
              <Link onClick={() => setMobileOpen(false)} to="/reviews" className="text-sm font-sans font-light text-slate-400 py-2">Reviews</Link>
              <Link
                onClick={() => setMobileOpen(false)}
                to="/questionnaire"
                className="mt-2 px-5 py-2.5 rounded-full border border-slate-600 text-slate-200 text-sm font-sans font-medium text-center"
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
