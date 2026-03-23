import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TextShimmer } from '@/components/ui/text-shimmer'
import { useDemo } from '@/context/DemoContext'

function getElementCenter(selector: string): { x: number; y: number } | null {
  const el = document.querySelector(selector)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function scrollToElement(selector: string) {
  const el = document.querySelector(selector)
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (rect.top < 60 || rect.bottom > window.innerHeight - 20) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

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
  const { isDemoActive, stopDemo, cursorPos, setCursorPos, demoPhase, setDemoPhase } = useDemo()

  const navigate = useNavigate()
  const location = useLocation()
  const abortRef = useRef(false)
  const scriptRunningRef = useRef(false)

  const [showProcessing, setShowProcessing] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [scoreValue, setScoreValue] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

  const moveCursorTo = useCallback(
    async (selector: string, delayMs = 420) => {
      if (abortRef.current) return
      await wait(delayMs)
      if (abortRef.current) return
      scrollToElement(selector)
      await wait(160)
      if (abortRef.current) return
      const pos = getElementCenter(selector)
      if (pos) setCursorPos(pos)
    },
    [setCursorPos],
  )

  const clickAt = useCallback((pos: { x: number; y: number }) => {
    setRipple(pos)
    setTimeout(() => setRipple(null), 600)
  }, [])

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
      await wait(900)
      if (abortRef.current) return
      await moveCursorTo('[data-demo="hero-cta"]', 350)
      await wait(850)
      if (abortRef.current) return
      const p = getElementCenter('[data-demo="hero-cta"]')
      if (p) clickAt(p)
      await wait(550)
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
      const timer = setTimeout(() => setDemoPhase('form'), 650)
      return () => clearTimeout(timer)
    }
  }, [isDemoActive, demoPhase, location.pathname, setDemoPhase])

  /* ─── FORM PHASE — cursor visits every field ─── */
  useEffect(() => {
    if (!isDemoActive || demoPhase !== 'form' || scriptRunningRef.current) return
    scriptRunningRef.current = true
    abortRef.current = false

    const run = async () => {
      const getFC = () =>
        (window as unknown as { __demoFormControl?: { setField: (f: string, v: unknown) => void; setStep: (s: number) => void; submit: () => void } }).__demoFormControl

      await wait(850)
      if (abortRef.current) return
      const fc = getFC()
      if (!fc) { scriptRunningRef.current = false; return }

      window.scrollTo({ top: 0, behavior: 'smooth' })
      await wait(450)

      /* ── Step 1: About You ── */
      await moveCursorTo('#name', 330)
      await wait(280)
      const name = 'Sarah M.'
      for (let i = 1; i <= name.length; i++) {
        if (abortRef.current) return
        fc.setField('name', name.slice(0, i))
        await wait(75)
      }
      await wait(280)

      await moveCursorTo('#age', 280)
      await wait(230)
      fc.setField('age', '21')
      if (abortRef.current) return

      await moveCursorTo('#gender', 280)
      await wait(230)
      fc.setField('gender', 'female')
      if (abortRef.current) return

      await moveCursorTo('#university', 280)
      await wait(230)
      fc.setField('university', 'Western University')
      if (abortRef.current) return

      await moveCursorTo('#program', 280)
      await wait(230)
      fc.setField('program', 'Business')
      if (abortRef.current) return

      await moveCursorTo('#year', 280)
      await wait(230)
      fc.setField('year', '3')
      if (abortRef.current) return

      await wait(350)
      await moveCursorTo('[data-demo="next-btn"]', 280)
      await wait(330)
      let p = getElementCenter('[data-demo="next-btn"]')
      if (p) clickAt(p)
      await wait(280)
      fc.setStep(1)
      if (abortRef.current) return

      /* ── Step 2: Housing ── */
      await wait(500)
      await moveCursorTo('#budgetMin', 330)
      await wait(280)
      fc.setField('budgetMin', '800')
      if (abortRef.current) return

      await moveCursorTo('#budgetMax', 280)
      await wait(250)
      fc.setField('budgetMax', '1000')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="lease-section"]', 300)
      await wait(280)
      fc.setField('leaseLength', '8-month')
      if (abortRef.current) return

      await wait(280)
      fc.setField('roommateCount', '1')
      await wait(220)
      fc.setField('preferredGender', 'any')

      await moveCursorTo('#moveIn', 300)
      await wait(250)
      fc.setField('moveInDate', '2026-09-01')
      if (abortRef.current) return

      await wait(350)
      await moveCursorTo('[data-demo="next-btn"]', 280)
      await wait(330)
      p = getElementCenter('[data-demo="next-btn"]')
      if (p) clickAt(p)
      await wait(280)
      fc.setStep(2)
      if (abortRef.current) return

      /* ── Step 3: Lifestyle ── */
      await wait(500)
      await moveCursorTo('[data-demo="sleep-section"]', 330)
      await wait(280)
      fc.setField('sleepTime', '11 PM')
      await wait(280)
      fc.setField('wakeTime', '7 AM')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="cleaning-section"]', 300)
      await wait(280)
      fc.setField('cleaningFrequency', 'weekly')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="temp-section"]', 300)
      await wait(250)
      fc.setField('temperature', 'moderate')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="noise-section"]', 300)
      await wait(250)
      fc.setField('noiseTolerance', '60')
      if (abortRef.current) return

      await wait(350)
      await moveCursorTo('[data-demo="next-btn"]', 280)
      await wait(330)
      p = getElementCenter('[data-demo="next-btn"]')
      if (p) clickAt(p)
      await wait(280)
      fc.setStep(3)
      if (abortRef.current) return

      /* ── Step 4: Social ── */
      await wait(500)
      await moveCursorTo('[data-demo="social-slider"]', 330)
      await wait(280)
      fc.setField('socialScale', [65])
      if (abortRef.current) return

      await moveCursorTo('[data-demo="guest-section"]', 300)
      await wait(280)
      fc.setField('guestFrequency', 'occasionally')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="study-section"]', 300)
      await wait(280)
      fc.setField('studyLocation', 'home')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="cooking-section"]', 300)
      await wait(250)
      fc.setField('cookingFrequency', 'few-times')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="conflict-section"]', 300)
      await wait(250)
      fc.setField('conflictStyle', 'direct')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="dealbreaker-section"]', 300)
      await wait(280)
      fc.setField('dealBreakers', ['Smoking', 'Drug Use'])
      if (abortRef.current) return

      await wait(350)
      await moveCursorTo('[data-demo="next-btn"]', 280)
      await wait(330)
      p = getElementCenter('[data-demo="next-btn"]')
      if (p) clickAt(p)
      await wait(280)
      fc.setStep(4)
      if (abortRef.current) return

      /* ── Step 5: Personality — visit each dimension ── */
      await wait(500)
      await moveCursorTo('[data-demo="mbti-energy"]', 330)
      await wait(300)
      fc.setField('mbtiE', 'E')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="mbti-info"]', 330)
      await wait(300)
      fc.setField('mbtiS', 'N')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="mbti-decision"]', 330)
      await wait(300)
      fc.setField('mbtiT', 'F')
      if (abortRef.current) return

      await moveCursorTo('[data-demo="mbti-structure"]', 330)
      await wait(300)
      fc.setField('mbtiJ', 'J')
      if (abortRef.current) return

      await wait(350)
      await moveCursorTo('[data-demo="next-btn"]', 280)
      await wait(330)
      p = getElementCenter('[data-demo="next-btn"]')
      if (p) clickAt(p)
      await wait(280)
      fc.setStep(5)
      if (abortRef.current) return

      /* ── Step 6: Verification ── */
      await wait(500)
      await moveCursorTo('#uniEmail', 330)
      await wait(280)
      const email = 'sarah.m@uwo.ca'
      for (let i = 1; i <= email.length; i++) {
        if (abortRef.current) return
        fc.setField('universityEmail', email.slice(0, i))
        await wait(55)
      }
      await wait(330)

      await moveCursorTo('[data-demo="id-upload-section"]', 300)
      await wait(280)
      fc.setField('idUploaded', true)
      if (abortRef.current) return

      await wait(300)
      await moveCursorTo('#terms', 280)
      await wait(250)
      fc.setField('agreeToTerms', true)
      if (abortRef.current) return

      await wait(450)
      await moveCursorTo('[data-demo="next-btn"]', 280)
      await wait(380)
      p = getElementCenter('[data-demo="next-btn"]')
      if (p) clickAt(p)
      await wait(550)

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

      await wait(1200)
      if (abortRef.current) return
      setShowDetails(true)
      await wait(2500)
      if (abortRef.current) return
      setShowMap(true)
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
      setShowDetails(false)
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
    setShowDetails(false)
    setShowMap(false)
    scriptRunningRef.current = false
    setTimeout(() => { abortRef.current = false; setDemoPhase('landing'); navigate('/') }, 100)
  }, [setDemoPhase, navigate])

  if (!isDemoActive) return null

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (scoreValue / 100) * circumference

  return (
    <>
      {/* ── Animated gradient border — smooth rounded corners ── */}
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
      <div
        className="fixed inset-0 z-[9997] pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 30px rgba(59,130,246,0.08), inset 0 0 60px rgba(139,92,246,0.05), inset 0 0 90px rgba(52,211,153,0.04)',
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
            <div className="min-h-screen flex flex-col md:flex-row items-start justify-center pt-28 pb-20 px-6 gap-8">

              {/* ── Left column: score + details ── */}
              <div
                className="flex flex-col items-center w-full transition-all duration-700 ease-in-out"
                style={{ maxWidth: showMap ? '520px' : '600px' }}
              >
                {/* Score Ring */}
                <div className="relative mb-14">
                  <svg width="140" height="140" className="-rotate-90">
                    <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="6" />
                    <motion.circle
                      cx="70" cy="70" r="54" fill="none"
                      stroke="url(#scoreGradient)" strokeWidth="6" strokeLinecap="round"
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-serif font-bold text-slate-100">{scoreValue}%</span>
                    <span className="text-[10px] font-sans text-slate-500 uppercase tracking-wider">Match</span>
                  </div>
                  {scoreValue >= 92 && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-sm font-serif font-semibold text-emerald-400">Excellent Match</span>
                    </div>
                  )}
                </div>

                {/* Everything below appears at once — no bounce */}
                {showDetails && (
                  <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                    {/* Compatibility Bars */}
                    <div className="w-full max-w-md mt-6 space-y-3">
                      {BARS.map((bar) => (
                        <div key={bar.label}>
                          <div className="flex justify-between text-xs font-sans mb-1">
                            <span className="text-slate-400">{bar.label}</span>
                            <span className="text-slate-500">{bar.value}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${bar.color} transition-all duration-700 ease-out`}
                              style={{ width: `${bar.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Profile Cards */}
                    <div className="w-full max-w-lg mt-12">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/60">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-sm">S</div>
                            <div>
                              <p className="font-serif font-semibold text-slate-200 text-sm">Sarah M.</p>
                              <p className="text-xs font-sans text-slate-500">3rd Year, Business</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs font-sans text-slate-500">
                            <p>ENFJ</p><p>11 PM – 7 AM</p><p>$800–$1,000/mo</p><p>Weekly cleaner</p><p>Studies at home</p>
                          </div>
                        </div>
                        <div className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/60">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-sm">A</div>
                            <div>
                              <p className="font-serif font-semibold text-slate-200 text-sm">Alex T.</p>
                              <p className="text-xs font-sans text-slate-500">4th Year, Engineering</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs font-sans text-slate-500">
                            <p>ENTJ</p><p>11 PM – 7 AM</p><p>$750–$950/mo</p><p>Tidy</p><p>Studies at home</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Match tags */}
                    <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-lg">
                      {MATCH_TAGS.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.04] text-slate-400 text-xs font-sans border border-slate-700/60">
                          &#10003; {tag}
                        </span>
                      ))}
                    </div>

                    {/* AI Insight */}
                    <div className="mt-8 w-full max-w-md">
                      <div className="rounded-xl border border-slate-800/60 bg-white/[0.03] p-5">
                        <p className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-2">AI Insight</p>
                        <p className="text-sm font-sans text-slate-300 leading-relaxed italic">
                          "You're both early risers who study at home — the AI paired you because you'll
                          have compatible quiet hours and shared kitchen schedules. Your overlapping
                          budget range of $800–$950 means you can target the same listings."
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-4 mt-8">
                        <button onClick={handleWatchAgain} className="px-6 py-2.5 rounded-full border border-slate-700 text-slate-300 text-sm font-sans font-medium hover:bg-white/[0.06] hover:border-slate-500 transition-all cursor-pointer">
                          Watch Again
                        </button>
                        <button onClick={() => { stopDemo(); navigate('/questionnaire') }} className="px-6 py-2.5 rounded-full bg-slate-200 text-slate-900 text-sm font-sans font-semibold hover:bg-white transition-all cursor-pointer">
                          Try It Yourself &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right column: Map (slides in — only dynamic element) ── */}
              <AnimatePresence>
                {showMap && (
                  <motion.div
                    initial={{ opacity: 0, x: 80, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: 380 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="shrink-0 md:sticky md:top-28 overflow-hidden"
                  >
                    <div className="w-[380px] rounded-xl border border-slate-800/60 bg-white/[0.03] overflow-hidden">
                      {/* Real map — Western University, London ON */}
                      <div className="relative h-64 overflow-hidden rounded-t-xl">
                        <iframe
                          title="Western University area map"
                          src="https://www.openstreetmap.org/export/embed.html?bbox=-81.295%2C42.998%2C-81.250%2C43.022&amp;layer=mapnik&amp;marker=43.012%2C-81.270"
                          className="w-full h-full border-0"
                          style={{
                            filter: 'invert(1) hue-rotate(180deg) brightness(0.75) contrast(1.2) saturate(0.3)',
                          }}
                        />
                        {/* Pin label overlay */}
                        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                          <span className="text-[10px] font-sans text-slate-300">London, ON — near Western University</span>
                        </div>
                      </div>

                      {/* Listing details */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-1">Suggested Listing</p>
                            <p className="text-sm font-serif font-semibold text-slate-200">2BR Apartment — $900/mo</p>
                            <p className="text-xs font-sans text-slate-500 mt-0.5">123 Richmond St, London ON</p>
                          </div>
                          <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-sans font-medium text-emerald-400 shrink-0">
                            In Budget
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-sans text-slate-500">
                          <span>0.8 km from campus</span>
                          <span>Bus Route 6</span>
                          <span>Laundry in-unit</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500/60 transition-all duration-700 ease-out"
                              style={{ width: '85%' }}
                            />
                          </div>
                          <span className="text-[10px] font-sans text-slate-500 shrink-0">85% budget overlap</span>
                        </div>

                        {/* Quick stats */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-slate-800/40">
                            <p className="text-lg font-serif font-bold text-slate-200">2</p>
                            <p className="text-[9px] font-sans text-slate-500 uppercase">Bedrooms</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-slate-800/40">
                            <p className="text-lg font-serif font-bold text-slate-200">1</p>
                            <p className="text-[9px] font-sans text-slate-500 uppercase">Bathroom</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-slate-800/40">
                            <p className="text-lg font-serif font-bold text-slate-200">Sep</p>
                            <p className="text-[9px] font-sans text-slate-500 uppercase">Move-in</p>
                          </div>
                        </div>
                      </div>
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
