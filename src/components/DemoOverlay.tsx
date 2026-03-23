import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TextShimmer } from '@/components/ui/text-shimmer'
import { useDemo } from '@/context/DemoContext'

/* helper: get center of a DOM element */
function getElementCenter(selector: string): { x: number; y: number } | null {
  const el = document.querySelector(selector)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

/* helper: scroll element into view if off-screen */
function scrollToElement(selector: string) {
  const el = document.querySelector(selector)
  if (!el) return
  const rect = el.getBoundingClientRect()
  const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight
  if (!isVisible) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

/* helper: wait */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* compatibility bar data */
const BARS = [
  { label: 'Sleep Schedule', value: 95, color: 'bg-emerald-500' },
  { label: 'Budget Range', value: 88, color: 'bg-emerald-500' },
  { label: 'Cleanliness', value: 92, color: 'bg-emerald-500' },
  { label: 'Noise Tolerance', value: 78, color: 'bg-amber-500' },
  { label: 'Guest Frequency', value: 85, color: 'bg-emerald-500' },
  { label: 'Study Habits', value: 90, color: 'bg-emerald-500' },
]

const MATCH_TAGS = [
  'Both early risers who study at home',
  'Budget ranges overlap at $800–$950',
  'Similar cleanliness expectations',
  'Both prefer direct conflict resolution',
]

export function DemoOverlay() {
  const {
    isDemoActive,
    stopDemo,
    cursorPos,
    setCursorPos,
    demoPhase,
    setDemoPhase,
  } = useDemo()

  const navigate = useNavigate()
  const location = useLocation()
  const abortRef = useRef(false)
  const scriptRunningRef = useRef(false)

  /* result overlay state */
  const [showProcessing, setShowProcessing] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [scoreValue, setScoreValue] = useState(0)
  const [showBars, setShowBars] = useState(false)
  const [showProfiles, setShowProfiles] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [showInsight, setShowInsight] = useState(false)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

  const moveCursorTo = useCallback(
    async (selector: string, delayMs = 600) => {
      if (abortRef.current) return
      await wait(delayMs)
      if (abortRef.current) return
      scrollToElement(selector)
      // Wait for scroll to settle
      await wait(400)
      if (abortRef.current) return
      const pos = getElementCenter(selector)
      if (pos) setCursorPos(pos)
    },
    [setCursorPos],
  )

  const clickAt = useCallback(
    (pos: { x: number; y: number }) => {
      setRipple(pos)
      setTimeout(() => setRipple(null), 600)
    },
    [],
  )

  /* ─── LANDING PHASE: move cursor to hero CTA "Find My Roommate" ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'landing' || scriptRunningRef.current) return
    if (location.pathname !== '/' && location.pathname !== '/LIT/' && location.pathname !== '/LIT') {
      navigate('/')
      return
    }

    scriptRunningRef.current = true
    abortRef.current = false

    const run = async () => {
      // Wait for landing page to render
      await wait(2000)
      if (abortRef.current) return

      // Show cursor at center first
      setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      await wait(1200)
      if (abortRef.current) return

      // Move to the hero "Find My Roommate" button
      await moveCursorTo('[data-demo="hero-cta"]', 500)
      await wait(1000)
      if (abortRef.current) return

      // Click
      const ctaPos = getElementCenter('[data-demo="hero-cta"]')
      if (ctaPos) clickAt(ctaPos)
      await wait(700)
      if (abortRef.current) return

      setDemoPhase('navigating')
      scriptRunningRef.current = false
      navigate('/questionnaire')
    }

    run()

    return () => {
      abortRef.current = true
      scriptRunningRef.current = false
    }
  }, [isDemoActive, demoPhase, location.pathname, navigate, setCursorPos, moveCursorTo, clickAt, setDemoPhase])

  /* ─── NAVIGATING → FORM: wait for questionnaire to mount ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'navigating') return
    if (location.pathname === '/questionnaire' || location.pathname === '/LIT/questionnaire') {
      const timer = setTimeout(() => setDemoPhase('form'), 800)
      return () => clearTimeout(timer)
    }
  }, [isDemoActive, demoPhase, location.pathname, setDemoPhase])

  /* ─── FORM PHASE: auto-fill the actual questionnaire ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'form' || scriptRunningRef.current) return

    scriptRunningRef.current = true
    abortRef.current = false

    const run = async () => {
      const getFormControl = () => {
        return (window as unknown as { __demoFormControl?: { setField: (f: string, v: unknown) => void; setStep: (s: number) => void; submit: () => void } }).__demoFormControl
      }

      // Wait for form to mount and register
      await wait(1200)
      if (abortRef.current) return

      const fc = getFormControl()
      if (!fc) {
        scriptRunningRef.current = false
        return
      }

      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' })
      await wait(600)

      // ── Step 1: About You ──
      await moveCursorTo('#name', 600)
      await wait(500)
      // Type name letter by letter
      const name = 'Sarah M.'
      for (let i = 1; i <= name.length; i++) {
        if (abortRef.current) return
        fc.setField('name', name.slice(0, i))
        await wait(90)
      }
      await wait(500)

      await moveCursorTo('#age', 500)
      await wait(400)
      fc.setField('age', '21')
      if (abortRef.current) return
      await wait(400)

      await moveCursorTo('#gender', 500)
      await wait(400)
      fc.setField('gender', 'female')
      if (abortRef.current) return
      await wait(400)

      await moveCursorTo('#university', 500)
      await wait(400)
      fc.setField('university', 'Western University')
      if (abortRef.current) return
      await wait(400)

      await moveCursorTo('#program', 500)
      await wait(400)
      fc.setField('program', 'Business')
      if (abortRef.current) return
      await wait(400)

      await moveCursorTo('#year', 500)
      await wait(400)
      fc.setField('year', '3')
      if (abortRef.current) return

      // Click Next
      await wait(700)
      await moveCursorTo('[data-demo="next-btn"]', 500)
      await wait(500)
      const nextPos = getElementCenter('[data-demo="next-btn"]')
      if (nextPos) clickAt(nextPos)
      await wait(400)
      fc.setStep(1)
      if (abortRef.current) return

      // ── Step 2: Housing ──
      await wait(800)
      await moveCursorTo('#name', 400) // cursor to first visible field area
      fc.setField('budgetMin', '800')
      await wait(500)
      fc.setField('budgetMax', '1000')
      await wait(500)
      fc.setField('leaseLength', '8-month')
      await wait(400)
      fc.setField('roommateCount', '1')
      await wait(300)
      fc.setField('preferredGender', 'any')
      await wait(300)
      fc.setField('moveInDate', '2026-09-01')
      if (abortRef.current) return

      await wait(900)
      await moveCursorTo('[data-demo="next-btn"]', 500)
      await wait(500)
      const nextPos2 = getElementCenter('[data-demo="next-btn"]')
      if (nextPos2) clickAt(nextPos2)
      await wait(400)
      fc.setStep(2)
      if (abortRef.current) return

      // ── Step 3: Lifestyle ──
      await wait(800)
      fc.setField('sleepTime', '11 PM')
      await wait(400)
      fc.setField('wakeTime', '7 AM')
      await wait(400)
      fc.setField('cleaningFrequency', 'weekly')
      await wait(400)
      fc.setField('temperature', 'moderate')
      await wait(300)
      fc.setField('noiseTolerance', '60')
      if (abortRef.current) return

      await wait(900)
      await moveCursorTo('[data-demo="next-btn"]', 500)
      await wait(500)
      const nextPos3 = getElementCenter('[data-demo="next-btn"]')
      if (nextPos3) clickAt(nextPos3)
      await wait(400)
      fc.setStep(3)
      if (abortRef.current) return

      // ── Step 4: Social ──
      await wait(800)
      fc.setField('socialScale', [65])
      await wait(300)
      fc.setField('guestFrequency', 'occasionally')
      await wait(400)
      fc.setField('studyLocation', 'home')
      await wait(400)
      fc.setField('cookingFrequency', 'few-times')
      await wait(300)
      fc.setField('conflictStyle', 'direct')
      await wait(300)
      fc.setField('dealBreakers', ['Smoking', 'Drug Use'])
      if (abortRef.current) return

      await wait(900)
      await moveCursorTo('[data-demo="next-btn"]', 500)
      await wait(500)
      const nextPos4 = getElementCenter('[data-demo="next-btn"]')
      if (nextPos4) clickAt(nextPos4)
      await wait(400)
      fc.setStep(4)
      if (abortRef.current) return

      // ── Step 5: Personality ──
      await wait(700)
      const mbtiLetters = [
        { field: 'mbtiE', value: 'E' },
        { field: 'mbtiS', value: 'N' },
        { field: 'mbtiT', value: 'F' },
        { field: 'mbtiJ', value: 'J' },
      ]
      for (const { field, value } of mbtiLetters) {
        if (abortRef.current) return
        fc.setField(field, value)
        await wait(600)
      }

      await wait(900)
      await moveCursorTo('[data-demo="next-btn"]', 500)
      await wait(500)
      const nextPos5 = getElementCenter('[data-demo="next-btn"]')
      if (nextPos5) clickAt(nextPos5)
      await wait(400)
      fc.setStep(5)
      if (abortRef.current) return

      // ── Step 6: Verification ──
      await wait(700)
      await moveCursorTo('#uniEmail', 500)
      await wait(400)
      const email = 'sarah.m@uwo.ca'
      for (let i = 1; i <= email.length; i++) {
        if (abortRef.current) return
        fc.setField('universityEmail', email.slice(0, i))
        await wait(60)
      }
      await wait(500)
      fc.setField('idUploaded', true)
      await wait(500)
      fc.setField('agreeToTerms', true)
      if (abortRef.current) return

      // Click "Find My Match"
      await wait(900)
      await moveCursorTo('[data-demo="next-btn"]', 500)
      await wait(500)
      const submitPos = getElementCenter('[data-demo="next-btn"]')
      if (submitPos) clickAt(submitPos)
      await wait(700)

      // ── Transition to results ──
      setDemoPhase('processing')
      scriptRunningRef.current = false
    }

    run()

    return () => {
      abortRef.current = true
      scriptRunningRef.current = false
    }
  }, [isDemoActive, demoPhase, moveCursorTo, clickAt, setDemoPhase, setCursorPos])

  /* ─── PROCESSING + RESULTS PHASE ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'processing') return

    // Reset abort flag so the processing phase can run
    abortRef.current = false

    setCursorPos(null)
    setShowProcessing(true)

    const run = async () => {
      await wait(3500)
      if (abortRef.current) return
      setShowProcessing(false)
      setShowScore(true)

      // Count up score
      const steps = [0, 8, 18, 30, 45, 58, 72, 82, 88, 92]
      for (const s of steps) {
        if (abortRef.current) return
        setScoreValue(s)
        await wait(180)
      }

      await wait(1000)
      setShowBars(true)
      await wait(2500)
      setShowProfiles(true)
      await wait(1800)
      setShowTags(true)
      await wait(1800)
      setShowInsight(true)
      setDemoPhase('results')
    }

    run()
  }, [isDemoActive, demoPhase, setCursorPos, setDemoPhase])

  /* cleanup on stop */
  useEffect(() => {
    if (!isDemoActive) {
      setShowProcessing(false)
      setShowScore(false)
      setScoreValue(0)
      setShowBars(false)
      setShowProfiles(false)
      setShowTags(false)
      setShowInsight(false)
    }
  }, [isDemoActive])

  const handleStop = useCallback(() => {
    abortRef.current = true
    stopDemo()
    navigate('/')
  }, [stopDemo, navigate])

  const handleWatchAgain = useCallback(() => {
    abortRef.current = true
    setShowProcessing(false)
    setShowScore(false)
    setScoreValue(0)
    setShowBars(false)
    setShowProfiles(false)
    setShowTags(false)
    setShowInsight(false)
    scriptRunningRef.current = false

    setTimeout(() => {
      abortRef.current = false
      setDemoPhase('landing')
      navigate('/')
    }, 100)
  }, [setDemoPhase, navigate])

  if (!isDemoActive) return null

  /* ─── Score ring SVG ─── */
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (scoreValue / 100) * circumference

  return (
    <>
      {/* ── Animated border glow ── */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{
          boxShadow:
            'inset 0 0 40px rgba(59,130,246,0.12), inset 0 0 80px rgba(139,92,246,0.08), inset 0 0 120px rgba(52,211,153,0.06)',
          border: '2px solid',
          borderImage: 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.3), rgba(52,211,153,0.4)) 1',
        }}
      />

      {/* ── "Demo Active" badge + Exit button — right side, vertical ── */}
      <div className="fixed top-24 right-4 z-[10002] flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-sans font-medium text-emerald-400">Demo Active</span>
        </div>
        <button
          onClick={handleStop}
          className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-sans text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-all backdrop-blur-md cursor-pointer"
        >
          Exit Demo
        </button>
      </div>

      {/* ── Blue cursor dot ── */}
      <AnimatePresence>
        {cursorPos && (
          <motion.div
            className="fixed z-[10001] pointer-events-none"
            animate={{ left: cursorPos.x - 6, top: cursorPos.y - 6 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{ width: 12, height: 12 }}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-400/40 animate-ping" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Click ripple ── */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            className="fixed z-[10000] pointer-events-none"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-3 h-3 rounded-full bg-blue-400/40 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ PROCESSING OVERLAY ═══ */}
      <AnimatePresence>
        {showProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10003] bg-black/95 flex flex-col items-center justify-center"
          >
            <TextShimmer className="text-xl font-sans" duration={1.2}>
              Analyzing compatibility across 12 dimensions...
            </TextShimmer>
            <div className="mt-8 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-slate-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ RESULTS OVERLAY ═══ */}
      <AnimatePresence>
        {showScore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[10003] bg-black/95 overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col items-center justify-start pt-28 pb-20 px-6">
              {/* Score Ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative mb-8"
              >
                <svg width="140" height="140" className="-rotate-90">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="6" />
                  <motion.circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.15 }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                  <span className="text-4xl font-serif font-bold text-slate-100">{scoreValue}%</span>
                  <span className="text-[10px] font-sans text-slate-500 uppercase tracking-wider">Match</span>
                </div>
                {scoreValue >= 92 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                  >
                    <span className="text-sm font-serif font-semibold text-emerald-400">Excellent Match</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Compatibility Bars */}
              <AnimatePresence>
                {showBars && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md mt-10 space-y-3"
                  >
                    {BARS.map((bar, i) => (
                      <motion.div
                        key={bar.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                      >
                        <div className="flex justify-between text-xs font-sans mb-1">
                          <span className="text-slate-400">{bar.label}</span>
                          <span className="text-slate-500">{bar.value}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${bar.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.value}%` }}
                            transition={{ delay: i * 0.15 + 0.2, duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Profile Cards */}
              <AnimatePresence>
                {showProfiles && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-lg mt-12"
                  >
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                      {/* Sarah */}
                      <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/60"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-sm">
                            S
                          </div>
                          <div>
                            <p className="font-serif font-semibold text-slate-200 text-sm">Sarah M.</p>
                            <p className="text-xs font-sans text-slate-500">3rd Year, Business</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs font-sans text-slate-500">
                          <p>ENFJ</p>
                          <p>11 PM – 7 AM</p>
                          <p>$800–$1,000/mo</p>
                          <p>Weekly cleaner</p>
                          <p>Studies at home</p>
                        </div>
                      </motion.div>

                      {/* Score badge */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-14 h-14 rounded-full border-2 border-emerald-500/40 flex items-center justify-center">
                          <span className="text-slate-100 font-serif font-bold">92%</span>
                        </div>
                        <span className="text-[9px] font-sans text-slate-600 uppercase tracking-wider">Match</span>
                      </div>

                      {/* Alex */}
                      <motion.div
                        initial={{ x: 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/60"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-sm">
                            A
                          </div>
                          <div>
                            <p className="font-serif font-semibold text-slate-200 text-sm">Alex T.</p>
                            <p className="text-xs font-sans text-slate-500">4th Year, Engineering</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs font-sans text-slate-500">
                          <p>ENTJ</p>
                          <p>11 PM – 7 AM</p>
                          <p>$750–$950/mo</p>
                          <p>Tidy</p>
                          <p>Studies at home</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Match tags */}
              <AnimatePresence>
                {showTags && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 justify-center mt-6 max-w-lg"
                  >
                    {MATCH_TAGS.map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15 }}
                        className="px-3 py-1 rounded-full bg-white/[0.04] text-slate-400 text-xs font-sans border border-slate-700/60"
                      >
                        &#10003; {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Insight */}
              <AnimatePresence>
                {showInsight && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 max-w-md"
                  >
                    <div className="rounded-xl border border-slate-800/60 bg-white/[0.03] p-5">
                      <p className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-2">AI Insight</p>
                      <p className="text-sm font-sans text-slate-300 leading-relaxed italic">
                        "You're both early risers who study at home — the AI paired you because you'll
                        have compatible quiet hours and shared kitchen schedules. Your overlapping
                        budget range of $800–$950 means you can target the same listings."
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button
                        onClick={handleWatchAgain}
                        className="px-6 py-2.5 rounded-full border border-slate-700 text-slate-300 text-sm font-sans font-medium hover:bg-white/[0.06] hover:border-slate-500 transition-all cursor-pointer"
                      >
                        Watch Again
                      </button>
                      <button
                        onClick={() => { stopDemo(); navigate('/questionnaire') }}
                        className="px-6 py-2.5 rounded-full bg-slate-200 text-slate-900 text-sm font-sans font-semibold hover:bg-white transition-all cursor-pointer"
                      >
                        Try It Yourself &rarr;
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
