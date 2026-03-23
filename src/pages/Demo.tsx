import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TextShimmer } from '@/components/ui/text-shimmer'

/* ─── Types ─── */
interface CursorTarget {
  x: number
  y: number
}

interface BarData {
  label: string
  value: number
  color: string
}

/* ─── Constants ─── */
const SCENE_DURATIONS = [3000, 8000, 3000, 4000, 5000, 5000]

const BARS: BarData[] = [
  { label: 'Sleep Schedule', value: 95, color: 'bg-emerald-500' },
  { label: 'Budget Range', value: 88, color: 'bg-emerald-500' },
  { label: 'Cleanliness', value: 92, color: 'bg-emerald-500' },
  { label: 'Noise Tolerance', value: 78, color: 'bg-amber-500' },
  { label: 'Guest Frequency', value: 85, color: 'bg-emerald-500' },
  { label: 'Study Habits', value: 90, color: 'bg-emerald-500' },
]

const SCORE_STEPS = [0, 5, 12, 25, 40, 58, 72, 85, 92]

const WHY_TAGS = [
  'Both early risers who study at home',
  'Compatible budget ranges overlap at $800-$950',
  'Similar cleanliness expectations',
  'Both prefer direct conflict resolution',
]

/* ─── Typing text hook ─── */
function useTypingText(text: string, active: boolean, delayMs: number, speedMs = 80) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!active) {
      setDisplayed('')
      return
    }
    let idx = 0
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        idx++
        setDisplayed(text.slice(0, idx))
        if (idx >= text.length) clearInterval(interval)
      }, speedMs)
      return () => clearInterval(interval)
    }, delayMs)
    return () => clearTimeout(startTimeout)
  }, [active, text, delayMs, speedMs])

  return displayed
}

/* ─── Blue cursor component ─── */
function BlueCursor({ target, visible }: { target: CursorTarget; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute z-50 pointer-events-none"
          initial={{ opacity: 0, x: target.x, y: target.y }}
          animate={{ opacity: 1, x: target.x, y: target.y }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* Outer pulse */}
          <motion.div
            className="absolute -inset-2 rounded-full bg-blue-500/20"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Dot */}
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Click ripple effect ─── */
function ClickRipple({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute z-40 pointer-events-none rounded-full border-2 border-blue-400/60"
      style={{ left: x - 2, top: y - 2 }}
      initial={{ width: 4, height: 4, opacity: 0.8 }}
      animate={{ width: 60, height: 60, opacity: 0, x: -28, y: -28 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════
   SCENE 1: Landing Preview
   ═══════════════════════════════════════════ */
function Scene1({ onCursorMove }: { onCursorMove: (pos: CursorTarget) => void }) {
  const [showRipple, setShowRipple] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Cursor starts at center-ish, then moves to button
    onCursorMove({ x: 200, y: 100 })
    const t1 = setTimeout(() => {
      onCursorMove({ x: 195, y: 218 })
    }, 1200)
    const t2 = setTimeout(() => {
      setShowRipple(true)
    }, 2200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onCursorMove])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
      {/* Mini landing page */}
      <div className="text-center space-y-4 max-w-xs">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <p className="text-[10px] font-sans font-light text-slate-500 uppercase tracking-[0.2em]">
            Your perfect roommate awaits.
          </p>
          <h2 className="text-xl font-serif font-extralight text-slate-100 tracking-tight">
            Find your perfect roommate match
          </h2>
          <p className="text-xs font-sans text-slate-500">
            Where compatibility meets community.
          </p>
        </motion.div>

        <div ref={buttonRef} className="relative inline-block">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="px-5 py-2 rounded-full border border-slate-500 text-slate-200 font-sans text-xs font-medium"
          >
            Find My Roommate &rarr;
          </motion.div>
          {showRipple && <ClickRipple x={80} y={14} />}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SCENE 2: Form Filling
   ═══════════════════════════════════════════ */
interface FormField {
  label: string
  value: string
  delay: number
  cursorY: number
}

function Scene2({ onCursorMove }: { onCursorMove: (pos: CursorTarget) => void }) {
  const [showRipple, setShowRipple] = useState(false)
  const active = true

  const fields: FormField[] = [
    { label: 'Name', value: 'Sarah M.', delay: 200, cursorY: 42 },
    { label: 'Age', value: '21', delay: 1600, cursorY: 88 },
    { label: 'Sleep Schedule', value: '11 PM', delay: 2800, cursorY: 134 },
    { label: 'Budget', value: '$800 - $1000', delay: 3800, cursorY: 180 },
    { label: 'Cleaning', value: 'Weekly cleaner', delay: 4800, cursorY: 226 },
    { label: 'MBTI', value: 'ENFJ', delay: 5800, cursorY: 272 },
  ]

  const nameTyped = useTypingText('Sarah M.', active, 400, 90)
  const mbtiTyped = useTypingText('ENFJ', active, 6000, 150)

  const [visibleFields, setVisibleFields] = useState<number>(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    fields.forEach((f, i) => {
      const t = setTimeout(() => {
        onCursorMove({ x: 280, y: f.cursorY })
        setVisibleFields(i + 1)
      }, f.delay)
      timers.push(t)
    })
    // Move cursor to button and click
    const tBtn = setTimeout(() => {
      onCursorMove({ x: 195, y: 320 })
    }, 7000)
    timers.push(tBtn)
    const tClick = setTimeout(() => {
      setShowRipple(true)
    }, 7600)
    timers.push(tClick)
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getDisplayValue = (index: number, field: FormField) => {
    if (index >= visibleFields) return ''
    if (index === 0) return nameTyped
    if (index === 5) return mbtiTyped
    return field.value
  }

  return (
    <div className="relative w-full h-full flex flex-col px-5 py-4 overflow-hidden">
      <p className="text-[10px] font-sans font-light text-slate-500 uppercase tracking-[0.15em] mb-3">
        Questionnaire
      </p>
      <div className="space-y-2.5 flex-1">
        {fields.map((field, i) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i < visibleFields ? 1 : 0.3, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="text-[11px] font-sans text-slate-400 w-24 shrink-0">{field.label}</span>
            <div className="flex-1 h-7 rounded-md bg-white/[0.04] border border-slate-700/60 px-2.5 flex items-center overflow-hidden">
              <span className="text-[11px] font-sans text-slate-200 whitespace-nowrap">
                {getDisplayValue(i, field)}
                {((i === 0 && nameTyped.length < field.value.length && i < visibleFields) ||
                  (i === 5 && mbtiTyped.length < field.value.length && i < visibleFields)) && (
                  <motion.span
                    className="inline-block w-px h-3 bg-blue-400 ml-px"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-3 flex justify-center">
        <div className="px-5 py-2 rounded-full border border-slate-500 text-slate-200 font-sans text-xs font-medium inline-block">
          Find My Match &rarr;
        </div>
        {showRipple && <ClickRipple x={70} y={14} />}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SCENE 3: AI Processing
   ═══════════════════════════════════════════ */
function Scene3() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background pulse grid */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-px bg-slate-700/30"
            style={{ top: `${20 + i * 12}%` }}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`v${i}`}
            className="absolute h-full w-px bg-slate-700/30"
            style={{ left: `${15 + i * 14}%` }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Center pulse */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-blue-500/5"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.05, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-10 text-center space-y-5">
        <TextShimmer className="text-sm font-sans font-light" duration={1.5}>
          Analyzing compatibility across 12 dimensions...
        </TextShimmer>

        {/* Loading dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-400"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SCENE 4: Score Reveal
   ═══════════════════════════════════════════ */
function Scene4() {
  const [scoreIdx, setScoreIdx] = useState(0)
  const [glowing, setGlowing] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    SCORE_STEPS.forEach((_, i) => {
      if (i === 0) return
      const t = setTimeout(() => {
        setScoreIdx(i)
        if (i === SCORE_STEPS.length - 1) {
          setTimeout(() => setGlowing(true), 200)
        }
      }, i * 350)
      timers.push(t)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  const score = SCORE_STEPS[scoreIdx]
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Glow effect */}
        {glowing && (
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 128, height: 128, left: -4, top: -4 }}
          />
        )}

        <svg width="120" height="120" className="relative z-10">
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(100,116,139,0.2)"
            strokeWidth="6"
          />
          {/* Progress ring */}
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#64748b'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            transition={{ duration: 0.3 }}
          />
          {/* Score text */}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            className="font-serif font-bold fill-slate-100"
            fontSize="28"
          >
            {score}
          </text>
          <text
            x="60"
            y="74"
            textAnchor="middle"
            className="font-sans fill-slate-500"
            fontSize="10"
          >
            %
          </text>
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: score >= 92 ? 1 : 0, y: score >= 92 ? 0 : 10 }}
        transition={{ duration: 0.4 }}
        className="mt-4 text-sm font-serif font-semibold text-emerald-400"
      >
        Excellent Match
      </motion.p>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SCENE 5: Compatibility Breakdown
   ═══════════════════════════════════════════ */
function Scene5() {
  const [animatedBars, setAnimatedBars] = useState<number>(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    BARS.forEach((_, i) => {
      const t = setTimeout(() => setAnimatedBars(i + 1), 400 + i * 600)
      timers.push(t)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col px-5 py-4">
      <p className="text-[10px] font-sans font-light text-slate-500 uppercase tracking-[0.15em] mb-4">
        Compatibility Breakdown
      </p>
      <div className="space-y-3 flex-1">
        {BARS.map((bar, i) => {
          const isVisible = i < animatedBars
          return (
            <motion.div
              key={bar.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-sans text-slate-300">{bar.label}</span>
                <span className="text-[11px] font-sans text-slate-400">{bar.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${bar.color}`}
                  initial={{ width: '0%' }}
                  animate={{ width: isVisible ? `${bar.value}%` : '0%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SCENE 6: Profile Match
   ═══════════════════════════════════════════ */
function Scene6() {
  const [showTags, setShowTags] = useState(false)
  const [showInsight, setShowInsight] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowTags(true), 2000)
    const t2 = setTimeout(() => setShowInsight(true), 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col px-4 py-3 overflow-y-auto">
      {/* Profile cards row */}
      <div className="flex items-center gap-2 mb-3">
        {/* Sarah card */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="flex-1 bg-white/[0.04] rounded-lg p-2.5 border border-slate-800/40"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-[10px]">
              S
            </div>
            <div>
              <p className="font-serif font-semibold text-slate-200 text-[10px]">Sarah M.</p>
              <p className="text-[8px] font-sans text-slate-500">3rd Year, Business</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-sans text-slate-500">ENFJ</p>
            <p className="text-[8px] font-sans text-slate-500">Early Bird</p>
            <p className="text-[8px] font-sans text-slate-500">$800-1000</p>
            <p className="text-[8px] font-sans text-slate-500">Weekly cleaner</p>
          </div>
        </motion.div>

        {/* Score circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="flex flex-col items-center shrink-0"
        >
          <div className="w-11 h-11 rounded-full border-2 border-emerald-500/60 flex items-center justify-center">
            <span className="text-slate-100 font-serif font-bold text-xs">92%</span>
          </div>
          <span className="text-[7px] font-sans text-slate-500 mt-0.5">MATCH</span>
        </motion.div>

        {/* Alex card */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="flex-1 bg-white/[0.04] rounded-lg p-2.5 border border-slate-800/40"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-[10px]">
              A
            </div>
            <div>
              <p className="font-serif font-semibold text-slate-200 text-[10px]">Alex T.</p>
              <p className="text-[8px] font-sans text-slate-500">4th Year, Engineering</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[8px] font-sans text-slate-500">ENTJ</p>
            <p className="text-[8px] font-sans text-slate-500">Early Bird</p>
            <p className="text-[8px] font-sans text-slate-500">$750-950</p>
            <p className="text-[8px] font-sans text-slate-500">Tidy</p>
          </div>
        </motion.div>
      </div>

      {/* Why you matched tags */}
      <AnimatePresence>
        {showTags && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-2"
          >
            <p className="text-[9px] font-sans font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Why you matched
            </p>
            <div className="flex flex-wrap gap-1">
              {WHY_TAGS.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2, duration: 0.3 }}
                  className="px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 text-[8px] font-sans border border-slate-700/60"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insight */}
      <AnimatePresence>
        {showInsight && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-auto bg-blue-500/[0.06] border border-blue-500/20 rounded-lg p-2.5"
          >
            <p className="text-[8px] font-sans font-medium text-blue-400 uppercase tracking-wider mb-1">
              AI Insight
            </p>
            <p className="text-[9px] font-sans text-slate-400 leading-relaxed">
              You're both early risers who study at home — the AI paired you because you'll have
              compatible quiet hours and shared kitchen schedules.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN DEMO PAGE
   ═══════════════════════════════════════════ */
export default function Demo() {
  const [scene, setScene] = useState(0)
  const [finished, setFinished] = useState(false)
  const [cursorPos, setCursorPos] = useState<CursorTarget>({ x: 200, y: 150 })
  const [showCursor, setShowCursor] = useState(true)

  const handleCursorMove = useCallback((pos: CursorTarget) => {
    setCursorPos(pos)
  }, [])

  // Auto-advance scenes
  useEffect(() => {
    if (finished) return
    if (scene >= SCENE_DURATIONS.length) {
      setFinished(true)
      setShowCursor(false)
      return
    }
    const timer = setTimeout(() => {
      setScene((s) => s + 1)
    }, SCENE_DURATIONS[scene])
    return () => clearTimeout(timer)
  }, [scene, finished])

  // Hide cursor during processing scene
  useEffect(() => {
    if (scene === 2 || scene === 3 || scene === 4) {
      setShowCursor(false)
    } else if (!finished) {
      setShowCursor(true)
    }
  }, [scene, finished])

  const handleRestart = () => {
    setScene(0)
    setFinished(false)
    setShowCursor(true)
    setCursorPos({ x: 200, y: 150 })
  }

  const sceneLabels = [
    'Landing Page',
    'Questionnaire',
    'AI Processing',
    'Score Reveal',
    'Compatibility',
    'Profile Match',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-serif relative">
      {/* Background grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="demoGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(100,116,139,0.08)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#demoGrid)" />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-xs font-sans font-light uppercase tracking-[0.2em] text-slate-500 block mb-2">
            Interactive Demo
          </span>
          <h1 className="text-2xl sm:text-3xl font-extralight text-slate-100 tracking-tight">
            See RoomieMatch in action
          </h1>
        </motion.div>

        {/* Scene progress indicators */}
        <div className="flex items-center gap-1.5 mb-6">
          {sceneLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <motion.div
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  i < scene
                    ? 'bg-blue-500'
                    : i === scene && !finished
                    ? 'bg-blue-400'
                    : finished
                    ? 'bg-blue-500'
                    : 'bg-slate-700'
                }`}
                animate={{
                  width: i === scene && !finished ? 32 : 12,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Scene label */}
        <AnimatePresence mode="wait">
          {!finished && (
            <motion.p
              key={scene}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] font-sans text-slate-500 mb-4"
            >
              {sceneLabels[scene] ?? ''}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Browser frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/80">
              {/* Traffic lights */}
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              {/* URL bar */}
              <div className="flex-1 mx-3">
                <div className="bg-slate-800/60 rounded-md px-3 py-1 flex items-center">
                  <span className="text-[10px] font-sans text-slate-500 select-none">
                    roomiematch.com
                  </span>
                </div>
              </div>
            </div>

            {/* Browser content */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90 h-[400px] overflow-hidden">
              {/* Cursor */}
              <BlueCursor target={cursorPos} visible={showCursor} />

              {/* Scene content */}
              <AnimatePresence mode="wait">
                {scene === 0 && !finished && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Scene1 onCursorMove={handleCursorMove} />
                  </motion.div>
                )}
                {scene === 1 && !finished && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Scene2 onCursorMove={handleCursorMove} />
                  </motion.div>
                )}
                {scene === 2 && !finished && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Scene3 />
                  </motion.div>
                )}
                {scene === 3 && !finished && (
                  <motion.div
                    key="s4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Scene4 />
                  </motion.div>
                )}
                {scene === 4 && !finished && (
                  <motion.div
                    key="s5"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Scene5 />
                  </motion.div>
                )}
                {scene === 5 && !finished && (
                  <motion.div
                    key="s6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Scene6 />
                  </motion.div>
                )}

                {/* Finished state */}
                {finished && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-emerald-400"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <p className="text-sm font-serif font-semibold text-slate-200 mb-1">
                      Demo Complete
                    </p>
                    <p className="text-xs font-sans text-slate-500 text-center">
                      That's how RoomieMatch finds your ideal roommate using AI-powered compatibility
                      analysis.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Action buttons (after finish) */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-full border border-slate-600 text-slate-300 font-sans text-sm font-medium hover:bg-white/[0.05] hover:border-slate-500 transition-all"
              >
                Watch Again
              </button>
              <Link
                to="/questionnaire"
                className="px-6 py-2.5 rounded-full border border-slate-500 text-slate-200 font-sans text-sm font-medium hover:bg-white/10 hover:border-slate-400 transition-all"
              >
                Try It Yourself &rarr;
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
