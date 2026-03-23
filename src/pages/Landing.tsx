import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ─── word-by-word reveal helper ─── */
function RevealText({
  text,
  className = '',
  baseDelay = 0,
  stagger = 0.15,
}: {
  text: string
  className?: string
  baseDelay?: number
  stagger?: number
}) {
  return (
    <span className={className}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em] hover:text-slate-200 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)', scale: 0.8 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          transition={{
            delay: baseDelay + i * stagger,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          whileHover={{
            textShadow: '0 0 20px rgba(203, 213, 225, 0.5)',
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

/* ─── animated step card ─── */
function StepCard({
  number,
  title,
  description,
  delay,
}: {
  number: string
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className="relative group"
    >
      <div className="relative bg-white/[0.03] backdrop-blur-sm rounded-2xl p-8 border border-slate-800/60 hover:border-slate-600/60 hover:bg-white/[0.05] transition-all duration-300">
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 text-xs font-sans font-medium">
          {number}
        </div>
        <h3 className="text-lg font-serif font-semibold text-slate-100 mb-3">{title}</h3>
        <p className="text-sm font-sans font-light text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

/* ─── feature card ─── */
function FeatureCard({
  title,
  description,
  delay,
}: {
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-xl border border-transparent hover:border-slate-800/60 hover:bg-white/[0.02] transition-all duration-300"
    >
      <h4 className="font-serif font-semibold text-slate-200 mb-2">{title}</h4>
      <p className="text-sm font-sans font-light text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
  )
}

/* ─── testimonial card ─── */
function TestimonialCard({
  quote,
  name,
  role,
  delay,
}: {
  quote: string
  name: string
  role: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-slate-800/60 hover:border-slate-700/60 transition-colors"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-slate-500 text-sm">&#9733;</span>
        ))}
      </div>
      <p className="text-slate-400 text-sm font-sans font-light leading-relaxed mb-5 italic">"{quote}"</p>
      <div>
        <p className="font-serif font-semibold text-slate-200 text-sm">{name}</p>
        <p className="text-xs font-sans text-slate-500">{role}</p>
      </div>
    </motion.div>
  )
}

/* ─── stat counter ─── */
function StatCounter({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
        {value}
      </div>
      <div className="text-sm font-sans font-light text-slate-500 mt-1">{label}</div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════ */
export default function Landing() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97])

  /* ── mouse-following gradient ── */
  const [mouse, setMouse] = useState({ x: 0, y: 0, opacity: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY, opacity: 1 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouse((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  /* ── click ripples ── */
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now()
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 1000)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  /* ── floating dots scroll trigger ── */
  const [scrolled, setScrolled] = useState(false)
  const floatingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true)
        const dots = document.querySelectorAll('.floating-dot')
        dots.forEach((el, index) => {
          const htmlEl = el as HTMLElement
          setTimeout(() => {
            htmlEl.style.animationPlayState = 'running'
            htmlEl.style.opacity = ''
          }, index * 200)
        })
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 overflow-hidden relative font-serif">
      {/* ── Mouse gradient ── */}
      <div
        className="fixed w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full pointer-events-none blur-xl sm:blur-2xl md:blur-3xl z-0"
        style={{
          left: mouse.x,
          top: mouse.y,
          opacity: mouse.opacity,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(156,163,175,0.05), rgba(107,114,128,0.05), transparent 70%)',
          transition: 'left 70ms linear, top 70ms linear, opacity 300ms ease-out',
        }}
      />

      {/* ── Click ripples ── */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="fixed w-1 h-1 rounded-full pointer-events-none z-50 bg-slate-300/60"
          style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)' }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}

      {/* ── Grid background ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="gridBg" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100,116,139,0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridBg)" />
        <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
        <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
        <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
        <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
        <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
        <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.05' }} />
        <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3s' }} />
        <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3.2s' }} />
        <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.4s' }} />
        <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.6s' }} />
        <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: '4s' }} />
      </svg>

      {/* ── Corner marks ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }} className="corner-mark top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8">
        <div className="absolute top-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full" />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.2 }} className="corner-mark top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8">
        <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full" />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.4 }} className="corner-mark bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8">
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full" />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.6 }} className="corner-mark bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full" />
      </motion.div>

      {/* ── Floating dots ── */}
      <div ref={floatingRef}>
        <div className="floating-dot" style={{ top: '25%', left: '15%', animationDelay: '0.5s' }} />
        <div className="floating-dot" style={{ top: '60%', left: '85%', animationDelay: '1s' }} />
        <div className="floating-dot" style={{ top: '40%', left: '10%', animationDelay: '1.5s' }} />
        <div className="floating-dot" style={{ top: '75%', left: '90%', animationDelay: '2s' }} />
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 min-h-screen flex flex-col justify-between items-center px-6 py-10 sm:px-8 sm:py-12 md:px-16 md:py-20"
      >
        {/* Top tag */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xs sm:text-sm font-sans font-light text-slate-300 uppercase tracking-[0.2em]"
          >
            <RevealText text="Your perfect roommate awaits." baseDelay={0} stagger={0.2} />
          </motion.h2>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '4rem', opacity: 0.3 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto"
          />
        </div>

        {/* Main heading */}
        <div className="text-center max-w-5xl mx-auto relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight leading-tight tracking-tight text-slate-50">
            <div className="mb-4 md:mb-6">
              <RevealText text="Find your perfect" baseDelay={0.7} />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin text-slate-300 leading-relaxed tracking-wide">
              <RevealText text="roommate match, where compatibility meets community." baseDelay={1.6} stagger={0.13} />
            </div>
          </h1>

          {/* Side detail lines */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '1rem' }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 h-px bg-slate-300"
          />
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '1rem' }}
            transition={{ delay: 3.4, duration: 0.6 }}
            className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 h-px bg-slate-300"
          />
        </div>

        {/* Bottom tag + CTAs */}
        <div className="text-center">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '4rem', opacity: 0.3 }}
            transition={{ delay: 3.5, duration: 0.8 }}
            className="mb-4 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto"
          />
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 3.6, duration: 0.8 }}
            className="text-xs sm:text-sm font-sans font-light text-slate-300 uppercase tracking-[0.2em]"
          >
            <RevealText text="Answer. Match. Move in." baseDelay={3.6} stagger={0.2} />
          </motion.h2>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/questionnaire"
              className="group px-8 py-3 rounded-full border border-slate-500 text-slate-200 font-sans text-sm font-medium hover:bg-white/10 hover:border-slate-400 transition-all"
            >
              Find My Roommate
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
            <Link
              to="/landlord"
              className="px-8 py-3 rounded-full border border-slate-700 text-slate-400 font-sans text-sm font-medium hover:border-slate-500 hover:text-slate-300 transition-all"
            >
              I'm a Landlord
            </Link>
          </motion.div>

          {/* Three dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5, duration: 0.6 }}
            className="mt-6 flex justify-center space-x-4"
          >
            <div className="w-1 h-1 bg-slate-300 rounded-full opacity-40" />
            <div className="w-1 h-1 bg-slate-300 rounded-full opacity-60" />
            <div className="w-1 h-1 bg-slate-300 rounded-full opacity-40" />
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="relative z-10 py-16 px-6 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <StatCounter value="2,500+" label="Students Matched" delay={0} />
          <StatCounter value="94%" label="Satisfaction Rate" delay={0.1} />
          <StatCounter value="350+" label="Verified Listings" delay={0.2} />
          <StatCounter value="48h" label="Avg. Match Time" delay={0.3} />
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="relative z-10 py-24 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-sans font-light uppercase tracking-[0.2em] text-slate-500 mb-4 block">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-100 tracking-tight">
              Three steps to your ideal roommate
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Fill Out Your Profile"
              description="Tell us about your lifestyle, budget, sleep schedule, cleanliness preferences, and personality type. Takes under 5 minutes."
              delay={0.1}
            />
            <StepCard
              number="2"
              title="AI Finds Your Matches"
              description="Our matching algorithm analyzes compatibility across 12+ dimensions to find roommates who truly fit your living style."
              delay={0.25}
            />
            <StepCard
              number="3"
              title="Connect & Move In"
              description="Chat with your matches, browse verified listings together, split costs, and coordinate your move-in date — all in one place."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ MATCH PREVIEW ═══════════ */}
      <section className="relative z-10 py-24 sm:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-sans font-light uppercase tracking-[0.2em] text-slate-500 mb-4 block">
              Live Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-100 tracking-tight">
              See how matching works
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-slate-800/60 p-6 sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
                <span className="text-sm font-sans font-light text-slate-300">Match Found</span>
              </div>
              <span className="text-xs font-sans text-slate-600 border border-slate-800 px-3 py-1 rounded-full">
                Demo
              </span>
            </div>

            {/* Two profiles + score */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">
              {/* Profile 1 */}
              <div className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/40">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-sm">
                    S
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-slate-200 text-sm">Sarah M.</p>
                    <p className="text-xs font-sans text-slate-500">3rd Year, Business</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-sans text-slate-500">Early Bird</p>
                  <p className="text-xs font-sans text-slate-500">$800–$1,000/mo</p>
                  <p className="text-xs font-sans text-slate-500">Clean & Organized</p>
                </div>
              </div>

              {/* Score */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center gap-2 py-2"
              >
                <div className="w-16 h-16 rounded-full border-2 border-slate-600 flex items-center justify-center">
                  <span className="text-slate-100 font-serif font-bold text-lg">92%</span>
                </div>
                <span className="text-[10px] font-sans font-medium text-slate-500 uppercase tracking-wider">
                  Match
                </span>
              </motion.div>

              {/* Profile 2 */}
              <div className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/40">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-slate-200 font-serif font-semibold text-sm">
                    A
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-slate-200 text-sm">Alex T.</p>
                    <p className="text-xs font-sans text-slate-500">4th Year, Engineering</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-sans text-slate-500">Early Bird</p>
                  <p className="text-xs font-sans text-slate-500">$750–$950/mo</p>
                  <p className="text-xs font-sans text-slate-500">Tidy</p>
                </div>
              </div>
            </div>

            {/* Match tags */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-5 flex flex-wrap gap-2 justify-center"
            >
              {['Sleep Schedule', 'Budget Range', 'Cleanliness', 'Quiet Hours'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/[0.04] text-slate-400 text-xs font-sans border border-slate-700/60"
                >
                  &#10003; {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="relative z-10 py-24 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-sans font-light uppercase tracking-[0.2em] text-slate-500 mb-4 block">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-100 tracking-tight">
              Everything you need, one platform
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <FeatureCard
              title="Verified Profiles"
              description="University email verification, ID checks, and reference validation so you know who you're matching with."
              delay={0.1}
            />
            <FeatureCard
              title="Cost Splitting Calculator"
              description="See exactly how rent, utilities, and groceries break down between you and your roommates — before you commit."
              delay={0.15}
            />
            <FeatureCard
              title="Campus Proximity Map"
              description="Every listing shows distance to campus, transit routes, and nearby amenities so you can find the perfect location."
              delay={0.2}
            />
            <FeatureCard
              title="Move-In Coordinator"
              description="Shared calendar for lease start dates, move-in logistics, and key handoff scheduling with your new roommates."
              delay={0.25}
            />
            <FeatureCard
              title="Deal-Breaker Alerts"
              description="Set hard requirements like no smoking, pet allergies, or quiet hours. We'll never match you with someone incompatible."
              delay={0.3}
            />
            <FeatureCard
              title="Mutual Ratings & Reviews"
              description="Airbnb-style reviews for roommates, landlords, and tenants — building trust and accountability across the platform."
              delay={0.35}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="relative z-10 py-24 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-sans font-light uppercase tracking-[0.2em] text-slate-500 mb-4 block">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-100 tracking-tight">
              Loved by students everywhere
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            <TestimonialCard
              quote="I was nervous about finding a roommate for my co-op in Toronto. RoomieMatch paired me with someone who has the same sleep schedule and budget — we've been great roommates for two terms now!"
              name="Priya K."
              role="2nd Year, Computer Science"
              delay={0.1}
            />
            <TestimonialCard
              quote="The deal-breaker feature is a lifesaver. I have a cat and need a roommate who's okay with pets. Every match I got was pet-friendly. No awkward conversations needed."
              name="Jordan L."
              role="3rd Year, Psychology"
              delay={0.2}
            />
            <TestimonialCard
              quote="As a landlord with units near campus, this platform has been incredible. I get matched with verified students and the whole leasing process is so much smoother."
              name="Marcus W."
              role="Property Owner"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative z-10 py-24 sm:py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl px-8 py-14 sm:px-14 sm:py-20 border border-slate-800/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/[0.02] rounded-full translate-y-1/2 -translate-x-1/2" />

            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-100 mb-4 relative z-10 tracking-tight">
              Ready to find your match?
            </h2>
            <p className="text-slate-500 mb-8 text-lg font-sans font-light relative z-10">
              Join thousands of students who found their perfect roommate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/questionnaire"
                className="px-8 py-3 rounded-full border border-slate-500 text-slate-200 font-sans text-sm font-medium hover:bg-white/10 hover:border-slate-400 transition-all"
              >
                Take the Questionnaire
              </Link>
              <Link
                to="/landlord"
                className="px-8 py-3 rounded-full border border-slate-700 text-slate-400 font-sans text-sm font-medium hover:border-slate-500 hover:text-slate-300 transition-all"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative z-10 border-t border-slate-800/60 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-serif font-semibold text-slate-400">RoomieMatch</span>
          <div className="flex items-center gap-6 text-sm font-sans font-light text-slate-600">
            <Link to="/" className="hover:text-slate-400 transition-colors">Home</Link>
            <Link to="/questionnaire" className="hover:text-slate-400 transition-colors">Find Roommates</Link>
            <Link to="/landlord" className="hover:text-slate-400 transition-colors">Landlords</Link>
            <Link to="/reviews" className="hover:text-slate-400 transition-colors">Reviews</Link>
          </div>
          <p className="text-xs font-sans text-slate-700">
            &copy; 2026 RoomieMatch. Academic Prototype.
          </p>
        </div>
      </footer>
    </div>
  )
}
