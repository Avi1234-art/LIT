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
  const isVisible = rect.top >= 60 && rect.bottom <= window.innerHeight - 20
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
  const [showMap, setShowMap] = useState(false)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

  const moveCursorTo = useCallback(
    async (selector: string, delayMs = 400) => {
      if (abortRef.current) return
      await wait(delayMs)
      if (abortRef.current) return
      scrollToElement(selector)
      await wait(150)
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

  /* ─── LANDING PHASE ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'landing' || scriptRunningRef.current) return
    if (location.pathname !== '/' && location.pathname !== '/LIT/' && location.pathname !== '/LIT') {
      navigate('/')
      return
    }

    scriptRunningRef.current = true
    abortRef.current = false

    const run = async () => {
      await wait(1500)
      if (abortRef.current) return

      setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      await wait(800)
      if (abortRef.current) return

      await moveCursorTo('[data-demo="hero-cta"]', 300)
      await wait(800)
      if (abortRef.current) return

      const ctaPos = getElementCenter('[data-demo="hero-cta"]')
      if (ctaPos) clickAt(ctaPos)
      await wait(500)
      if (abortRef.current) return

      setDemoPhase('navigating')
      scriptRunningRef.current = false
      navigate('/questionnaire')
    }

    run()
    return () => { abortRef.current = true; scriptRunningRef.current = false }
  }, [isDemoActive, demoPhase, location.pathname, navigate, setCursorPos, moveCursorTo, clickAt, setDemoPhase])

  /* ─── NAVIGATING → FORM ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'navigating') return
    if (location.pathname === '/questionnaire' || location.pathname === '/LIT/questionnaire') {
      const timer = setTimeout(() => setDemoPhase('form'), 600)
      return () => clearTimeout(timer)
    }
  }, [isDemoActive, demoPhase, location.pathname, setDemoPhase])

  /* ─── FORM PHASE ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'form' || scriptRunningRef.current) return

    scriptRunningRef.current = true
    abortRef.current = false

    const run = async () => {
      const getFC = () =>
        (window as unknown as { __demoFormControl?: { setField: (f: string, v: unknown) => void; setStep: (s: number) => void; submit: () => void } }).__demoFormControl

      await wait(800)
      if (abortRef.current) return
      const fc = getFC()
      if (!fc) { scriptRunningRef.current = false; return }

      window.scrollTo({ top: 0, behavior: 'smooth' })
      await wait(400)

      // ── Step 1: About You ──
      await moveCursorTo('#name', 300)
      await wait(250)
      const name = 'Sarah M.'
      for (let i = 1; i <= name.length; i++) {
        if (abortRef.current) return
        fc.setField('name', name.slice(0, i))
        await wait(70)
      }
      await wait(250)

      await moveCursorTo('#age', 250)
      await wait(200)
      fc.setField('age', '21')
      if (abortRef.current) return

      await moveCursorTo('#gender', 250)
      await wait(200)
      fc.setField('gender', 'female')
      if (abortRef.current) return

      await moveCursorTo('#university', 250)
      await wait(200)
      fc.setField('university', 'Western University')
      if (abortRef.current) return

      await moveCursorTo('#program', 250)
      await wait(200)
      fc.setField('program', 'Business')
      if (abortRef.current) return

      await moveCursorTo('#year', 250)
      await wait(200)
      fc.setField('year', '3')
      if (abortRef.current) return

      await wait(300)
      await moveCursorTo('[data-demo="next-btn"]', 250)
      await wait(300)
      const p = getElementCenter('[data-demo="next-btn"]')
      if (p) clickAt(p)
      await wait(250)
      fc.setStep(1)
      if (abortRef.current) return

      // ── Step 2: Housing ──
      await wait(450)
      await moveCursorTo('#budgetMin', 300)
      await wait(250)
      fc.setField('budgetMin', '800')
      await wait(300)
      fc.setField('budgetMax', '1000')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="lease-section"]', 300)
      await wait(250)
      fc.setField('leaseLength', '8-month')
      if (abortRef.current) return

      await wait(250)
      fc.setField('roommateCount', '1')
      fc.setField('preferredGender', 'any')

      await moveCursorTo('#moveIn', 300)
      await wait(200)
      fc.setField('moveInDate', '2026-09-01')
      if (abortRef.current) return

      await wait(300)
      await moveCursorTo('[data-demo="next-btn"]', 250)
      await wait(300)
      const p2 = getElementCenter('[data-demo="next-btn"]')
      if (p2) clickAt(p2)
      await wait(250)
      fc.setStep(2)
      if (abortRef.current) return

      // ── Step 3: Lifestyle ──
      await wait(450)
      await moveCursorTo('[data-demo="sleep-section"]', 300)
      await wait(250)
      fc.setField('sleepTime', '11 PM')
      await wait(250)
      fc.setField('wakeTime', '7 AM')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="cleaning-section"]', 300)
      await wait(250)
      fc.setField('cleaningFrequency', 'weekly')
      await wait(250)
      fc.setField('temperature', 'moderate')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="noise-section"]', 300)
      await wait(200)
      fc.setField('noiseTolerance', '60')
      if (abortRef.current) return

      await wait(300)
      await moveCursorTo('[data-demo="next-btn"]', 250)
      await wait(300)
      const p3 = getElementCenter('[data-demo="next-btn"]')
      if (p3) clickAt(p3)
      await wait(250)
      fc.setStep(3)
      if (abortRef.current) return

      // ── Step 4: Social ──
      await wait(450)
      await moveCursorTo('[data-demo="form-card"]', 300)
      await wait(250)
      fc.setField('socialScale', [65])
      if (abortRef.current) return

      await moveCursorTo('[data-demo="guest-section"]', 300)
      await wait(250)
      fc.setField('guestFrequency', 'occasionally')
      await wait(250)
      fc.setField('studyLocation', 'home')
      if (abortRef.current) return

      await wait(200)
      fc.setField('cookingFrequency', 'few-times')
      fc.setField('conflictStyle', 'direct')

      await moveCursorTo('[data-demo="dealbreaker-section"]', 300)
      await wait(250)
      fc.setField('dealBreakers', ['Smoking', 'Drug Use'])
      if (abortRef.current) return

      await wait(300)
      await moveCursorTo('[data-demo="next-btn"]', 250)
      await wait(300)
      const p4 = getElementCenter('[data-demo="next-btn"]')
      if (p4) clickAt(p4)
      await wait(250)
      fc.setStep(4)
      if (abortRef.current) return

      // ── Step 5: Personality ──
      await wait(450)
      await moveCursorTo('[data-demo="mbti-section"]', 300)
      await wait(300)
      const mbti = [
        { field: 'mbtiE', value: 'E' },
        { field: 'mbtiS', value: 'N' },
        { field: 'mbtiT', value: 'F' },
        { field: 'mbtiJ', value: 'J' },
      ]
      for (const { field, value } of mbti) {
        if (abortRef.current) return
        fc.setField(field, value)
        await wait(350)
      }

      await wait(300)
      await moveCursorTo('[data-demo="next-btn"]', 250)
      await wait(300)
      const p5 = getElementCenter('[data-demo="next-btn"]')
      if (p5) clickAt(p5)
      await wait(250)
      fc.setStep(5)
      if (abortRef.current) return

      // ── Step 6: Verification ──
      await wait(450)
      await moveCursorTo('#uniEmail', 300)
      await wait(250)
      const email = 'sarah.m@uwo.ca'
      for (let i = 1; i <= email.length; i++) {
        if (abortRef.current) return
        fc.setField('universityEmail', email.slice(0, i))
        await wait(50)
      }
      await wait(300)

      await moveCursorTo('[data-demo="id-upload-section"]', 250)
      await wait(250)
      fc.setField('idUploaded', true)
      await wait(300)
      fc.setField('agreeToTerms', true)
      if (abortRef.current) return

      await wait(400)
      await moveCursorTo('[data-demo="next-btn"]', 250)
      await wait(350)
      const sp = getElementCenter('[data-demo="next-btn"]')
      if (sp) clickAt(sp)
      await wait(500)

      setDemoPhase('processing')
      scriptRunningRef.current = false
    }

    run()
    return () => { abortRef.current = true; scriptRunningRef.current = false }
  }, [isDemoActive, demoPhase, moveCursorTo, clickAt, setDemoPhase, setCursorPos])

  /* ─── PROCESSING + RESULTS ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'processing') return
    abortRef.current = false
    setCursorPos(null)
    setShowProcessing(true)

    const run = async () => {
      await wait(3500)
      if (abortRef.current) return
      setShowProcessing(false)
      setShowScore(true)

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
      await wait(1500)
      setShowMap(true)
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
      setShowMap(false)
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
    setShowMap(false)
    scriptRunningRef.current = false
    setTimeout(() => { abortRef.current = false; setDemoPhase('landing'); navigate('/') }, 100)
  }, [setDemoPhase, navigate])

  if (!isDemoActive) return null

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (scoreValue / 100) * circumference

  return (
    <>
      {/* ── Animated gradient border — rounded corners via mask ── */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none rounded-xl"
        style={{
          padding: '2.5px',
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #34d399, #f59e0b, #ec4899, #3b82f6)',
          backgroundSize: '200% 100%',
          animation: 'demo-border-slide 3s linear infinite',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      />
      {/* Inner glow */}
      <div
        className="fixed inset-0 z-[9997] pointer-events-none"
        style={{
          boxShadow:
            'inset 0 0 30px rgba(59,130,246,0.08), inset 0 0 60px rgba(139,92,246,0.05), inset 0 0 90px rgba(52,211,153,0.04)',
        }}
      />

      {/* ── Badge + Exit ── */}
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
            transition={{ type: 'spring', stiffness: 150, damping: 22 }}
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
                className="relative mb-14"
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
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
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
                    className="w-full max-w-md mt-6 space-y-3"
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
                    <div className="grid grid-cols-2 gap-6 items-center">
                      <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/60"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-sm">S</div>
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

                      <motion.div
                        initial={{ x: 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/60"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-sm">A</div>
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

              {/* Suggested Listing — Map Card */}
              <AnimatePresence>
                {showMap && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md mt-8"
                  >
                    <div className="rounded-xl border border-slate-800/60 bg-white/[0.03] overflow-hidden">
                      {/* Map visualization */}
                      <div className="relative h-40 bg-slate-900/80 overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Grid streets */}
                          <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                          <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                          <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                          <line x1="80" y1="0" x2="80" y2="160" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                          <line x1="160" y1="0" x2="160" y2="160" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                          <line x1="240" y1="0" x2="240" y2="160" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                          <line x1="320" y1="0" x2="320" y2="160" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />

                          {/* Main roads */}
                          <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(148,163,184,0.2)" strokeWidth="3" />
                          <line x1="200" y1="0" x2="200" y2="160" stroke="rgba(148,163,184,0.2)" strokeWidth="3" />

                          {/* Campus area */}
                          <rect x="100" y="20" width="100" height="60" rx="4" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.2)" strokeWidth="1" strokeDasharray="4 2" />
                          <text x="150" y="55" textAnchor="middle" fill="rgba(52,211,153,0.4)" fontSize="9" fontFamily="Inter, sans-serif">Western Campus</text>

                          {/* Listing pin */}
                          <motion.g
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                          >
                            <circle cx="260" cy="60" r="16" fill="rgba(59,130,246,0.15)" />
                            <circle cx="260" cy="60" r="8" fill="rgba(59,130,246,0.3)" />
                            <circle cx="260" cy="60" r="4" fill="#3b82f6" />
                          </motion.g>

                          {/* Distance line */}
                          <line x1="180" y1="50" x2="252" y2="57" stroke="rgba(148,163,184,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                          <text x="216" y="46" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="8" fontFamily="Inter, sans-serif">0.8 km</text>

                          {/* Road labels */}
                          <text x="350" y="76" textAnchor="end" fill="rgba(148,163,184,0.25)" fontSize="7" fontFamily="Inter, sans-serif">Richmond St</text>
                          <text x="196" y="152" textAnchor="end" fill="rgba(148,163,184,0.25)" fontSize="7" fontFamily="Inter, sans-serif">Western Rd</text>
                        </svg>
                      </div>

                      {/* Listing details */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-1">Suggested Listing</p>
                            <p className="text-sm font-serif font-semibold text-slate-200">2BR Apartment — $900/mo</p>
                            <p className="text-xs font-sans text-slate-500 mt-0.5">123 Richmond St, London ON</p>
                          </div>
                          <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-sans font-medium text-emerald-400">
                            In Budget
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs font-sans text-slate-500">
                          <span>0.8 km from campus</span>
                          <span>Bus Route 6</span>
                          <span>Laundry in-unit</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500/60" style={{ width: '85%' }} />
                          </div>
                          <span className="text-[10px] font-sans text-slate-500">85% budget overlap</span>
                        </div>
                      </div>
                    </div>
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
