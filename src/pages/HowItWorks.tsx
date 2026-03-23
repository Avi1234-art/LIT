import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import ReactLenis from 'lenis/react'
import { CharacterV1 } from '@/components/ui/text-scroll-animation'

/* ─── Scroll-animated text section ─── */
function ScrollText({
  text,
  charClassName,
  subtitle,
}: {
  text: string
  charClassName?: string
  subtitle?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const chars = text.split('')
  const center = Math.floor(chars.length / 2)

  return (
    <div ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
        <div
          className="max-w-5xl text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter font-serif"
          style={{ perspective: '500px' }}
        >
          {chars.map((char, i) => (
            <CharacterV1
              key={i}
              char={char}
              index={i}
              centerIndex={center}
              scrollYProgress={scrollYProgress}
              charClassName={charClassName}
            />
          ))}
        </div>
        {subtitle && (
          <SubtitleReveal scrollYProgress={scrollYProgress} text={subtitle} />
        )}
      </div>
    </div>
  )
}

/* ─── Subtitle that fades in after text converges ─── */
function SubtitleReveal({
  scrollYProgress,
  text,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  text: string
}) {
  const opacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1])
  const y = useTransform(scrollYProgress, [0.45, 0.6], [20, 0])

  return (
    <motion.p
      className="mt-6 text-lg sm:text-xl font-sans font-light text-slate-400 max-w-2xl text-center"
      style={{ opacity, y }}
    >
      {text}
    </motion.p>
  )
}

/* ─── Pipeline step ─── */
function PipelineStep({
  number,
  title,
  description,
  detail,
  delay,
}: {
  number: string
  title: string
  description: string
  detail?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, duration: 0.6 }}
      className="relative pl-12 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-[18px] top-10 bottom-0 w-px bg-gradient-to-b from-slate-700 to-transparent" />
      {/* Number dot */}
      <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-emerald-400 text-sm font-sans font-semibold">
        {number}
      </div>
      <h3 className="text-xl font-serif font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm font-sans font-light text-slate-400 leading-relaxed max-w-lg">{description}</p>
      {detail && (
        <div className="mt-3 px-4 py-3 rounded-lg bg-white/[0.03] border border-slate-800/60">
          <p className="text-xs font-sans text-slate-500 italic leading-relaxed">{detail}</p>
        </div>
      )}
    </motion.div>
  )
}

/* ─── Rating visual card ─── */
function RatingCard({
  stars,
  label,
  delay,
}: {
  stars: number
  label: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/[0.03] rounded-xl p-5 border border-slate-800/60 text-center"
    >
      <div className="flex justify-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < stars ? 'text-amber-400' : 'text-slate-700'}`}>
            &#9733;
          </span>
        ))}
      </div>
      <p className="text-sm font-sans text-slate-400">{label}</p>
    </motion.div>
  )
}

/* ─── Audience card ─── */
function AudienceCard({
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
      className="bg-white/[0.03] rounded-xl p-6 border border-slate-800/60 hover:border-slate-700/60 hover:bg-white/[0.05] transition-all duration-300"
    >
      <span className="text-3xl mb-4 block">{icon}</span>
      <h4 className="font-serif font-semibold text-slate-200 mb-2">{title}</h4>
      <p className="text-sm font-sans font-light text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   HOW IT WORKS PAGE
   ═══════════════════════════════════════════ */
export default function HowItWorks() {
  return (
    <ReactLenis root>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-serif">

        {/* ═══ HERO SCROLL ANIMATION ═══ */}
        <ScrollText
          text="smarter matches "
          charClassName="text-emerald-400"
          subtitle="Our AI doesn't just match randomly. It learns patterns, weighs 12+ dimensions of compatibility, and gets smarter with every match."
        />

        {/* ═══ THE MATCHING PIPELINE ═══ */}
        <section className="relative z-10 py-24 sm:py-32 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="text-xs font-sans font-light uppercase tracking-[0.2em] text-slate-500 mb-4 block">
                The Pipeline
              </span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-100 tracking-tight">
                How we find your perfect match
              </h2>
            </motion.div>

            <div className="max-w-xl mx-auto">
              <PipelineStep
                number="1"
                title="You Tell Us Everything"
                description="Fill out your lifestyle profile — budget, sleep schedule, cleanliness standards, noise tolerance, MBTI, social preferences, and deal-breakers. It takes under 5 minutes."
                delay={0.1}
              />
              <PipelineStep
                number="2"
                title="12+ Dimensions Analyzed"
                description="Our algorithm doesn't just check if you both picked 'clean.' It weighs how strongly each preference matters to you and scores compatibility across every dimension simultaneously."
                detail="Dimensions include: sleep schedule, budget range, cleanliness, noise tolerance, guest frequency, study habits, cooking habits, temperature preference, social energy, conflict style, personality type, and deal-breakers."
                delay={0.2}
              />
              <PipelineStep
                number="3"
                title="Hidden Patterns Detected"
                description="The AI discovers correlations you'd never think of. For example, people who prefer cold rooms tend to be night owls — so we factor that into matching too, even if you didn't explicitly state it."
                detail="These patterns emerge from real user data and feedback. The more matches we make, the smarter the correlations become."
                delay={0.3}
              />
              <PipelineStep
                number="4"
                title="Ranked Matches Delivered"
                description="You receive a ranked list of compatible roommates with a percentage score and a breakdown of exactly why you're compatible. No guesswork — just data-driven matches."
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* ═══ RATING SCROLL ANIMATION ═══ */}
        <ScrollText
          text="your rating matters "
          charClassName="text-amber-400"
          subtitle="Like Airbnb, both roommates rate each other. Your rating is your reputation — and it directly influences your future matches."
        />

        {/* ═══ THE RATING SYSTEM ═══ */}
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
                Accountability
              </span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-100 tracking-tight">
                A rating system that works
              </h2>
            </motion.div>

            {/* How it works visual */}
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Left: mutual rating */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-serif font-semibold text-slate-100 mb-4">Mutual Ratings</h3>
                <p className="text-sm font-sans font-light text-slate-400 leading-relaxed mb-6">
                  After living together, both roommates rate each other across categories like communication,
                  cleanliness, respect, and reliability. This creates a two-way accountability system
                  where both parties are incentivized to be great roommates.
                </p>

                <div className="space-y-3">
                  <RatingCard stars={5} label="5-star roommate gets matched with top-rated roommates" delay={0.1} />
                  <RatingCard stars={2} label="2-star roommate gets matched with 2-star roommates" delay={0.2} />
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-xs font-sans text-slate-600 italic"
                >
                  Your rating reflects your track record. Better roommate? Better matches.
                </motion.p>
              </motion.div>

              {/* Right: feedback loop */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-serif font-semibold text-slate-100 mb-4">The Feedback Loop</h3>
                <p className="text-sm font-sans font-light text-slate-400 leading-relaxed mb-6">
                  Every rating and review feeds back into the AI. The system learns which personality
                  combinations lead to successful living situations, and which ones don't — making
                  every future match smarter than the last.
                </p>

                {/* Loop diagram */}
                <div className="space-y-0">
                  {[
                    { step: 'Match', desc: 'AI pairs compatible roommates', icon: '1' },
                    { step: 'Live Together', desc: 'Experience the match firsthand', icon: '2' },
                    { step: 'Rate & Review', desc: 'Both parties give honest feedback', icon: '3' },
                    { step: 'AI Learns', desc: 'Patterns and outcomes feed back in', icon: '4' },
                    { step: 'Better Matches', desc: 'Next round is even smarter', icon: '5' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="flex items-center gap-4 py-3 border-b border-slate-800/40 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-sans font-semibold shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-serif font-semibold text-slate-200">{item.step}</p>
                        <p className="text-xs font-sans text-slate-500">{item.desc}</p>
                      </div>
                      {i < 4 && (
                        <span className="ml-auto text-slate-700 text-lg">&#8595;</span>
                      )}
                      {i === 4 && (
                        <span className="ml-auto text-emerald-500/60 text-lg">&#8635;</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ BUILT FOR SCROLL ANIMATION ═══ */}
        <ScrollText
          text="built for students "
          charClassName="text-blue-400"
          subtitle="Whether you're heading to co-op, an internship, exchange, or just need a place for the year — we've got you covered."
        />

        {/* ═══ WHO IT'S FOR ═══ */}
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
                Our Audience
              </span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-100 tracking-tight">
                Housing for every chapter
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AudienceCard
                icon="&#128188;"
                title="Co-op Students"
                description="Relocating for a 4 or 8-month work term? Find a roommate near your workplace who matches your schedule and budget."
                delay={0.1}
              />
              <AudienceCard
                icon="&#9728;&#65039;"
                title="Summer Interns"
                description="Short-term sublet for the summer? Match with another intern so you're both on the same timeline and lifestyle."
                delay={0.15}
              />
              <AudienceCard
                icon="&#9992;&#65039;"
                title="Exchange Students"
                description="Landing in a new city for a semester? Get matched with someone who understands the exchange experience."
                delay={0.2}
              />
              <AudienceCard
                icon="&#128218;"
                title="School Year Housing"
                description="Looking for a full-year roommate near campus? Our deepest matching pool, with the most verified students."
                delay={0.25}
              />
              <AudienceCard
                icon="&#127891;"
                title="Recent Graduates"
                description="First year out of school, first apartment? Find someone in the same life stage — starting careers, similar budgets."
                delay={0.3}
              />
              <AudienceCard
                icon="&#127968;"
                title="Landlords"
                description="List your property and get matched with verified, compatible tenants. Less turnover, happier renters, better reviews."
                delay={0.35}
              />
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
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
                Ready to see it in action?
              </h2>
              <p className="text-slate-500 mb-8 text-lg font-sans font-light relative z-10">
                Take the questionnaire and let the AI find your match.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Link
                  to="/questionnaire"
                  className="px-8 py-3 rounded-full border border-slate-500 text-slate-200 font-sans text-sm font-medium hover:bg-white/10 hover:border-slate-400 transition-all"
                >
                  Take the Questionnaire
                </Link>
                <Link
                  to="/"
                  className="px-8 py-3 rounded-full border border-slate-700 text-slate-400 font-sans text-sm font-medium hover:border-slate-500 hover:text-slate-300 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="relative z-10 border-t border-slate-800/60 py-10 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-serif font-semibold text-slate-400">RoomieMatch</span>
            <div className="flex items-center gap-6 text-sm font-sans font-light text-slate-600">
              <Link to="/" className="hover:text-slate-400 transition-colors">Home</Link>
              <Link to="/questionnaire" className="hover:text-slate-400 transition-colors">Find Roommates</Link>
              <Link to="/how-it-works" className="hover:text-slate-400 transition-colors">How It Works</Link>
              <Link to="/reviews" className="hover:text-slate-400 transition-colors">Reviews</Link>
            </div>
            <p className="text-xs font-sans text-slate-700">
              &copy; 2026 RoomieMatch. Academic Prototype.
            </p>
          </div>
        </footer>
      </div>
    </ReactLenis>
  )
}
