import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ─── word-by-word reveal helper ─── */
function RevealText({
  text,
  className = '',
  baseDelay = 0,
  stagger = 0.12,
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
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: baseDelay + i * stagger,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
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
  icon,
  title,
  description,
  delay,
}: {
  number: string
  icon: string
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
      <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-violet-100/50 hover:-translate-y-1 transition-all duration-300">
        {/* Step number */}
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-violet-200">
          {number}
        </div>

        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

/* ─── feature card ─── */
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string
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
      className="flex gap-4 items-start p-5 rounded-xl hover:bg-violet-50/50 transition-colors"
    >
      <div className="text-2xl shrink-0 mt-0.5">{icon}</div>
      <div>
        <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

/* ─── testimonial card ─── */
function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  delay,
}: {
  quote: string
  name: string
  role: string
  avatar: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-amber-400 text-sm">&#9733;</span>
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-300 to-indigo-400 flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{name}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
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
      <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
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
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 800)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden relative">
      {/* ── Mouse gradient ── */}
      <div
        className="fixed w-80 h-80 rounded-full pointer-events-none blur-3xl transition-opacity duration-300 z-0"
        style={{
          left: mouse.x,
          top: mouse.y,
          opacity: mouse.opacity,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(139,92,246,0.08), rgba(99,102,241,0.05), transparent 70%)',
        }}
      />

      {/* ── Click ripples ── */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="fixed w-3 h-3 rounded-full pointer-events-none z-50"
          style={{ left: r.x, top: r.y }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="w-full h-full rounded-full bg-violet-400/40" />
        </motion.div>
      ))}

      {/* ── Grid background ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* ═══════════ HERO ═══════════ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 pt-32 pb-20 sm:pt-40 sm:pb-28 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200/60 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-violet-700">
              AI-Powered Roommate Matching
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
            <RevealText text="Find your perfect" baseDelay={0.5} />
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              <RevealText text="roommate match." baseDelay={1.1} />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Answer a quick questionnaire, and our AI matches you with compatible
            roommates based on lifestyle, budget, and personality — so you can
            focus on what matters.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/questionnaire"
              className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:-translate-y-0.5 transition-all"
            >
              Find My Roommate
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>
            <Link
              to="/landlord"
              className="px-8 py-3.5 rounded-full border-2 border-slate-200 text-slate-700 font-semibold hover:border-violet-300 hover:text-violet-600 hover:-translate-y-0.5 transition-all"
            >
              I'm a Landlord
            </Link>
          </motion.div>

          {/* Hero visual — animated matching cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8, ease: 'easeOut' }}
            className="mt-16 sm:mt-20 relative max-w-3xl mx-auto"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-violet-100/60 border border-slate-100 p-6 sm:p-8">
              {/* Match header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold text-slate-700">
                    AI Match Found
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                  Live Preview
                </span>
              </div>

              {/* Two profile cards with match score */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">
                {/* Profile 1 */}
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-5 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Sarah M.</p>
                      <p className="text-xs text-slate-400">3rd Year, Business</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>&#128164;</span> Early Bird
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>&#127969;</span> $800–$1,000/mo
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>&#10024;</span> Clean & Organized
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                <div className="flex flex-col items-center gap-2 py-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 3.0, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200"
                  >
                    <span className="text-white font-extrabold text-lg">92%</span>
                  </motion.div>
                  <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                    Match
                  </span>
                </div>

                {/* Profile 2 */}
                <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-2xl p-5 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-sky-500 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Alex T.</p>
                      <p className="text-xs text-slate-400">4th Year, Engineering</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>&#128164;</span> Early Bird
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>&#127969;</span> $750–$950/mo
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>&#10024;</span> Tidy
                    </div>
                  </div>
                </div>
              </div>

              {/* Match reasons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.4, duration: 0.6 }}
                className="mt-5 flex flex-wrap gap-2 justify-center"
              >
                {['Sleep Schedule', 'Budget Range', 'Cleanliness', 'Quiet Hours'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/60"
                    >
                      &#10003; {tag}
                    </span>
                  )
                )}
              </motion.div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-violet-200/30 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="relative z-10 py-12 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <StatCounter value="2,500+" label="Students Matched" delay={0} />
          <StatCounter value="94%" label="Satisfaction Rate" delay={0.1} />
          <StatCounter value="350+" label="Verified Listings" delay={0.2} />
          <StatCounter value="48h" label="Avg. Match Time" delay={0.3} />
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 block">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Three steps to your ideal roommate
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon="&#128203;"
              title="Fill Out Your Profile"
              description="Tell us about your lifestyle, budget, sleep schedule, cleanliness preferences, and personality type. Takes under 5 minutes."
              delay={0.1}
            />
            <StepCard
              number="2"
              icon="&#129302;"
              title="AI Finds Your Matches"
              description="Our matching algorithm analyzes compatibility across 12+ dimensions to find roommates who truly fit your living style."
              delay={0.25}
            />
            <StepCard
              number="3"
              icon="&#127968;"
              title="Connect & Move In"
              description="Chat with your matches, browse verified listings together, split costs, and coordinate your move-in date — all in one place."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="relative z-10 py-20 sm:py-28 px-6 bg-gradient-to-b from-slate-50/0 via-violet-50/30 to-slate-50/0">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 block">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything you need, one platform
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-2">
            <FeatureCard
              icon="&#128274;"
              title="Verified Profiles"
              description="University email verification, ID checks, and reference validation so you know who you're matching with."
              delay={0.1}
            />
            <FeatureCard
              icon="&#128176;"
              title="Cost Splitting Calculator"
              description="See exactly how rent, utilities, and groceries break down between you and your roommates — before you commit."
              delay={0.15}
            />
            <FeatureCard
              icon="&#128205;"
              title="Campus Proximity Map"
              description="Every listing shows distance to campus, transit routes, and nearby amenities so you can find the perfect location."
              delay={0.2}
            />
            <FeatureCard
              icon="&#128197;"
              title="Move-In Coordinator"
              description="Shared calendar for lease start dates, move-in logistics, and key handoff scheduling with your new roommates."
              delay={0.25}
            />
            <FeatureCard
              icon="&#9888;&#65039;"
              title="Deal-Breaker Alerts"
              description="Set hard requirements like no smoking, pet allergies, or quiet hours. We'll never match you with someone incompatible."
              delay={0.3}
            />
            <FeatureCard
              icon="&#11088;"
              title="Mutual Ratings & Reviews"
              description="Airbnb-style reviews for roommates, landlords, and tenants — building trust and accountability across the platform."
              delay={0.35}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="relative z-10 py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 block">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Loved by students everywhere
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            <TestimonialCard
              quote="I was nervous about finding a roommate for my co-op in Toronto. RoomieMatch paired me with someone who has the same sleep schedule and budget — we've been great roommates for two terms now!"
              name="Priya K."
              role="2nd Year, Computer Science"
              avatar="PK"
              delay={0.1}
            />
            <TestimonialCard
              quote="The deal-breaker feature is a lifesaver. I have a cat and need a roommate who's okay with pets. Every match I got was pet-friendly. No awkward conversations needed."
              name="Jordan L."
              role="3rd Year, Psychology"
              avatar="JL"
              delay={0.2}
            />
            <TestimonialCard
              quote="As a landlord with units near campus, this platform has been incredible. I get matched with verified students and the whole leasing process is so much smoother."
              name="Marcus W."
              role="Property Owner"
              avatar="MW"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative z-10 py-20 sm:py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl px-8 py-14 sm:px-14 sm:py-20 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 relative z-10">
              Ready to find your match?
            </h2>
            <p className="text-violet-200 mb-8 text-lg relative z-10">
              Join thousands of students who found their perfect roommate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/questionnaire"
                className="px-8 py-3.5 rounded-full bg-white text-violet-700 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Take the Questionnaire
              </Link>
              <Link
                to="/landlord"
                className="px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative z-10 border-t border-slate-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">RoomieMatch</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/" className="hover:text-violet-500 transition-colors">Home</Link>
            <Link to="/questionnaire" className="hover:text-violet-500 transition-colors">Find Roommates</Link>
            <Link to="/landlord" className="hover:text-violet-500 transition-colors">Landlords</Link>
            <Link to="/reviews" className="hover:text-violet-500 transition-colors">Reviews</Link>
          </div>
          <p className="text-xs text-slate-300">
            &copy; 2026 RoomieMatch. Academic Prototype.
          </p>
        </div>
      </footer>
    </div>
  )
}
