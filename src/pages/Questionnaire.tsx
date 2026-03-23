import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

const steps = [
  { id: 'about', title: 'About You' },
  { id: 'housing', title: 'Housing' },
  { id: 'lifestyle', title: 'Lifestyle' },
  { id: 'social', title: 'Social' },
  { id: 'personality', title: 'Personality' },
  { id: 'verification', title: 'Verification' },
]

interface FormData {
  // Step 1: About You
  name: string
  age: string
  gender: string
  university: string
  program: string
  year: string

  // Step 2: Housing Preferences
  budgetMin: string
  budgetMax: string
  leaseLength: string
  roommateCount: string
  preferredGender: string
  moveInDate: string

  // Step 3: Lifestyle
  sleepTime: string
  wakeTime: string
  cleaningFrequency: string
  temperature: string
  noiseTolerance: string
  quietHoursStart: string
  quietHoursEnd: string

  // Step 4: Social & Compatibility
  socialScale: number[]
  guestFrequency: string
  studyLocation: string
  cookingFrequency: string
  sharingPreference: string
  conflictStyle: string
  dealBreakers: string[]

  // Step 5: Personality
  mbtiE: string
  mbtiS: string
  mbtiT: string
  mbtiJ: string

  // Step 6: Verification
  universityEmail: string
  idUploaded: boolean
  agreeToTerms: boolean
}

const contentVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.15 } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export default function Questionnaire() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    university: '',
    program: '',
    year: '',
    budgetMin: '',
    budgetMax: '',
    leaseLength: '',
    roommateCount: '',
    preferredGender: '',
    moveInDate: '',
    sleepTime: '',
    wakeTime: '',
    cleaningFrequency: '',
    temperature: '',
    noiseTolerance: '',
    quietHoursStart: '',
    quietHoursEnd: '',
    socialScale: [50],
    guestFrequency: '',
    studyLocation: '',
    cookingFrequency: '',
    sharingPreference: '',
    conflictStyle: '',
    dealBreakers: [],
    mbtiE: '',
    mbtiS: '',
    mbtiT: '',
    mbtiJ: '',
    universityEmail: '',
    idUploaded: false,
    agreeToTerms: false,
  })

  const update = (field: keyof FormData, value: string | number[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Expose form control for demo mode
  useEffect(() => {
    (window as unknown as { __demoFormControl?: { setField: (f: string, v: unknown) => void; setStep: (s: number) => void; submit: () => void } }).__demoFormControl = {
      setField: (field: string, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
      },
      setStep: (step: number) => {
        setCurrentStep(step)
      },
      submit: () => {
        handleSubmit()
      },
    }
    return () => {
      delete (window as unknown as { __demoFormControl?: unknown }).__demoFormControl
    }
  }, [])

  const toggleDealBreaker = (item: string) => {
    setFormData((prev) => {
      const list = [...prev.dealBreakers]
      if (list.includes(item)) {
        return { ...prev, dealBreakers: list.filter((d) => d !== item) }
      }
      return { ...prev, dealBreakers: [...list, item] }
    })
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1)
  }

  const handleSubmit = () => {
    const incomplete = getIncompleteSteps()
    if (incomplete.length > 0) {
      setValidationErrors(incomplete.map((i) => i.label))
      // Jump to first incomplete step
      setCurrentStep(incomplete[0].step)
      return
    }
    setValidationErrors([])
    setIsSubmitting(true)
    // Save form data to localStorage for the results page
    localStorage.setItem('roomiematch-profile', JSON.stringify(formData))
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/results')
    }, 2000)
  }

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const getIncompleteSteps = (): { step: number; label: string }[] => {
    const missing: { step: number; label: string }[] = []
    if (!formData.name.trim() || !formData.age || !formData.gender)
      missing.push({ step: 0, label: 'About You — name, age, and gender required' })
    if (!formData.budgetMin)
      missing.push({ step: 1, label: 'Housing — minimum budget required' })
    if (!formData.sleepTime || !formData.cleaningFrequency)
      missing.push({ step: 2, label: 'Lifestyle — sleep schedule and cleaning habits required' })
    if (!formData.guestFrequency || !formData.studyLocation)
      missing.push({ step: 3, label: 'Social — guest frequency and study location required' })
    if (!formData.mbtiE || !formData.mbtiS || !formData.mbtiT || !formData.mbtiJ)
      missing.push({ step: 4, label: 'Personality — complete all 4 MBTI dimensions' })
    if (!formData.universityEmail.trim() || !formData.agreeToTerms)
      missing.push({ step: 5, label: 'Verification — email and terms agreement required' })
    return missing
  }

  /* ── Option card helper (no motion to avoid re-render flicker) ── */
  function OptionCard({
    value,
    currentValue,
    label,
    description,
    onSelect,
  }: {
    value: string
    currentValue: string
    label: string
    description?: string
    onSelect: () => void
    index?: number
  }) {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200',
          currentValue === value
            ? 'border-slate-500 bg-white/[0.06]'
            : 'border-slate-800/60 hover:border-slate-700 hover:bg-white/[0.03]',
        )}
        onClick={onSelect}
      >
        <div
          className={cn(
            'mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 transition-all duration-200 flex items-center justify-center',
            currentValue === value ? 'border-slate-200' : 'border-slate-600',
          )}
        >
          {currentValue === value && <div className="h-2 w-2 rounded-full bg-slate-200" />}
        </div>
        <div>
          <p className="text-sm font-sans font-medium text-slate-200">{label}</p>
          {description && <p className="text-xs font-sans text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
    )
  }

  /* ── MBTI dimension picker ── */
  function MBTIDimension({
    label,
    optionA,
    optionB,
    valueA,
    valueB,
    field,
    description,
  }: {
    label: string
    optionA: string
    optionB: string
    valueA: string
    valueB: string
    field: 'mbtiE' | 'mbtiS' | 'mbtiT' | 'mbtiJ'
    description: string
  }) {
    const current = formData[field]
    return (
      <div className="space-y-2">
        <Label className="text-slate-400 text-xs uppercase tracking-wider">{label}</Label>
        <p className="text-xs font-sans text-slate-600 -mt-1">{description}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update(field, valueA)}
            className={cn(
              'rounded-xl border px-4 py-3 text-sm font-sans transition-all duration-200 cursor-pointer',
              current === valueA
                ? 'border-slate-500 bg-white/[0.06] text-slate-200'
                : 'border-slate-800/60 text-slate-400 hover:border-slate-700 hover:bg-white/[0.03]',
            )}
          >
            {optionA}
          </button>
          <button
            type="button"
            onClick={() => update(field, valueB)}
            className={cn(
              'rounded-xl border px-4 py-3 text-sm font-sans transition-all duration-200 cursor-pointer',
              current === valueB
                ? 'border-slate-500 bg-white/[0.06] text-slate-200'
                : 'border-slate-800/60 text-slate-400 hover:border-slate-700 hover:bg-white/[0.03]',
            )}
          >
            {optionB}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 pt-24 pb-16 px-6">
      <div className="w-full max-w-lg mx-auto">
        {/* ── Progress indicator ── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  type="button"
                  className={cn(
                    'w-4 h-4 rounded-full transition-all duration-300 cursor-pointer hover:ring-4 hover:ring-slate-400/20',
                    index < currentStep
                      ? 'bg-slate-400'
                      : index === currentStep
                        ? 'bg-slate-200 ring-4 ring-slate-200/20'
                        : 'bg-slate-700 hover:bg-slate-600',
                  )}
                  onClick={() => setCurrentStep(index)}
                />
                <span
                  className={cn(
                    'text-[10px] font-sans mt-1.5 hidden sm:block',
                    index === currentStep ? 'text-slate-300 font-medium' : 'text-slate-600',
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-slate-400"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* ── Form card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                {/* ═══ STEP 1: About You ═══ */}
                {currentStep === 0 && (
                  <>
                    <CardHeader>
                      <CardTitle>Tell us about yourself</CardTitle>
                      <CardDescription>Basic info to get you started</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => update('name', e.target.value)}
                        />
                      </motion.div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.div variants={fadeIn} className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Select value={formData.age} onValueChange={(v) => update('age', v)}>
                            <SelectTrigger id="age">
                              <SelectValue placeholder="Age" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => i + 17).map((age) => (
                                <SelectItem key={age} value={String(age)}>
                                  {age}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div variants={fadeIn} className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={formData.gender} onValueChange={(v) => update('gender', v)}>
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="nonbinary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label htmlFor="university">University</Label>
                        <Input
                          id="university"
                          placeholder="e.g. Western University"
                          value={formData.university}
                          onChange={(e) => update('university', e.target.value)}
                        />
                      </motion.div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.div variants={fadeIn} className="space-y-2">
                          <Label htmlFor="program">Program</Label>
                          <Input
                            id="program"
                            placeholder="e.g. Business"
                            value={formData.program}
                            onChange={(e) => update('program', e.target.value)}
                          />
                        </motion.div>

                        <motion.div variants={fadeIn} className="space-y-2">
                          <Label htmlFor="year">Year</Label>
                          <Select value={formData.year} onValueChange={(v) => update('year', v)}>
                            <SelectTrigger id="year">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1st Year</SelectItem>
                              <SelectItem value="2">2nd Year</SelectItem>
                              <SelectItem value="3">3rd Year</SelectItem>
                              <SelectItem value="4">4th Year</SelectItem>
                              <SelectItem value="5">5th Year+</SelectItem>
                              <SelectItem value="grad">Graduate</SelectItem>
                              <SelectItem value="recent">Recent Grad</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>
                    </CardContent>
                  </>
                )}

                {/* ═══ STEP 2: Housing Preferences ═══ */}
                {currentStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle>Housing Preferences</CardTitle>
                      <CardDescription>What are you looking for in a place?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>Monthly Budget Range (CAD)</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                            <Input
                              type="number"
                              placeholder="Min (e.g. 600)"
                              value={formData.budgetMin}
                              onChange={(e) => update('budgetMin', e.target.value)}
                              className="pl-7"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                            <Input
                              type="number"
                              placeholder="Max (e.g. 1200)"
                              value={formData.budgetMax}
                              onChange={(e) => update('budgetMax', e.target.value)}
                              className="pl-7"
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>Lease Length</Label>
                        <RadioGroup
                          value={formData.leaseLength}
                          onValueChange={(v) => update('leaseLength', v)}
                          className="grid grid-cols-2 gap-2"
                        >
                          {[
                            { value: '4-month', label: '4 Months', desc: 'Co-op / Summer' },
                            { value: '8-month', label: '8 Months', desc: 'School year' },
                            { value: '12-month', label: '12 Months', desc: 'Full year' },
                            { value: 'flexible', label: 'Flexible', desc: 'Open to anything' },
                          ].map((opt, i) => (
                            <OptionCard
                              key={opt.value}
                              value={opt.value}
                              currentValue={formData.leaseLength}
                              label={opt.label}
                              description={opt.desc}
                              onSelect={() => update('leaseLength', opt.value)}
                              index={i}
                            />
                          ))}
                        </RadioGroup>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.div variants={fadeIn} className="space-y-2">
                          <Label>Roommates</Label>
                          <Select value={formData.roommateCount} onValueChange={(v) => update('roommateCount', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="How many?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 roommate</SelectItem>
                              <SelectItem value="2">2 roommates</SelectItem>
                              <SelectItem value="3">3 roommates</SelectItem>
                              <SelectItem value="4+">4+ roommates</SelectItem>
                              <SelectItem value="any">No preference</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div variants={fadeIn} className="space-y-2">
                          <Label>Preferred Gender</Label>
                          <Select value={formData.preferredGender} onValueChange={(v) => update('preferredGender', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="same">Same gender</SelectItem>
                              <SelectItem value="any">No preference</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label htmlFor="moveIn">Preferred Move-in Date</Label>
                        <Input
                          id="moveIn"
                          type="date"
                          value={formData.moveInDate}
                          onChange={(e) => update('moveInDate', e.target.value)}
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* ═══ STEP 3: Lifestyle ═══ */}
                {currentStep === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle>Lifestyle & Living Habits</CardTitle>
                      <CardDescription>
                        These details help the AI find roommates with compatible routines
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>Sleep Schedule</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-xs font-sans text-slate-500">I usually sleep at</span>
                            <Select value={formData.sleepTime} onValueChange={(v) => update('sleepTime', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Bedtime" />
                              </SelectTrigger>
                              <SelectContent>
                                {['9 PM', '10 PM', '11 PM', '12 AM', '1 AM', '2 AM', '3 AM+'].map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-sans text-slate-500">I usually wake at</span>
                            <Select value={formData.wakeTime} onValueChange={(v) => update('wakeTime', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Wake up" />
                              </SelectTrigger>
                              <SelectContent>
                                {['5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM+'].map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>Cleaning Habits</Label>
                        <RadioGroup
                          value={formData.cleaningFrequency}
                          onValueChange={(v) => update('cleaningFrequency', v)}
                        >
                          {[
                            { value: 'daily', label: 'Daily cleaner', desc: 'I clean up every day' },
                            { value: 'weekly', label: 'Weekly cleaner', desc: 'Deep clean once a week' },
                            { value: 'biweekly', label: 'Every couple weeks', desc: 'Clean when it\'s needed' },
                            { value: 'relaxed', label: 'Pretty relaxed', desc: 'I\'m not too fussed about mess' },
                          ].map((opt, i) => (
                            <OptionCard
                              key={opt.value}
                              value={opt.value}
                              currentValue={formData.cleaningFrequency}
                              label={opt.label}
                              description={opt.desc}
                              onSelect={() => update('cleaningFrequency', opt.value)}
                              index={i}
                            />
                          ))}
                        </RadioGroup>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>Room Temperature Preference</Label>
                        <RadioGroup
                          value={formData.temperature}
                          onValueChange={(v) => update('temperature', v)}
                          className="grid grid-cols-3 gap-2"
                        >
                          {[
                            { value: 'cool', label: 'Cool' },
                            { value: 'moderate', label: 'Moderate' },
                            { value: 'warm', label: 'Warm' },
                          ].map((opt, i) => (
                            <OptionCard
                              key={opt.value}
                              value={opt.value}
                              currentValue={formData.temperature}
                              label={opt.label}
                              onSelect={() => update('temperature', opt.value)}
                              index={i}
                            />
                          ))}
                        </RadioGroup>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-3">
                        <Label>Noise Tolerance</Label>
                        <div className="flex items-center justify-between text-xs font-sans text-slate-500 px-1">
                          <span>Need silence</span>
                          <span>Anything goes</span>
                        </div>
                        <Slider
                          value={[Number(formData.noiseTolerance) || 50]}
                          onValueChange={(v) => update('noiseTolerance', String(v[0]))}
                          min={0}
                          max={100}
                          step={10}
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* ═══ STEP 4: Social & Compatibility ═══ */}
                {currentStep === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle>Social & Compatibility</CardTitle>
                      <CardDescription>
                        These signals help the AI draw deeper inferences about your ideal match
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <motion.div variants={fadeIn} className="space-y-3">
                        <Label>How social are you at home?</Label>
                        <div className="flex items-center justify-between text-xs font-sans text-slate-500 px-1">
                          <span>Introvert — I need my space</span>
                          <span>Extrovert — the more the merrier</span>
                        </div>
                        <Slider
                          value={formData.socialScale}
                          onValueChange={(v) => update('socialScale', v)}
                          min={0}
                          max={100}
                          step={10}
                        />
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>How often do you have guests over?</Label>
                        <RadioGroup
                          value={formData.guestFrequency}
                          onValueChange={(v) => update('guestFrequency', v)}
                        >
                          {[
                            { value: 'rarely', label: 'Rarely', desc: 'Almost never' },
                            { value: 'occasionally', label: 'Occasionally', desc: 'Once or twice a month' },
                            { value: 'weekly', label: 'Weekly', desc: 'Friends over most weeks' },
                            { value: 'frequently', label: 'Frequently', desc: 'Multiple times a week' },
                          ].map((opt, i) => (
                            <OptionCard
                              key={opt.value}
                              value={opt.value}
                              currentValue={formData.guestFrequency}
                              label={opt.label}
                              description={opt.desc}
                              onSelect={() => update('guestFrequency', opt.value)}
                              index={i}
                            />
                          ))}
                        </RadioGroup>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>Where do you usually study?</Label>
                        <RadioGroup
                          value={formData.studyLocation}
                          onValueChange={(v) => update('studyLocation', v)}
                          className="grid grid-cols-2 gap-2"
                        >
                          {[
                            { value: 'home', label: 'At home', desc: 'Desk in my room' },
                            { value: 'library', label: 'Library', desc: 'Campus / public' },
                            { value: 'cafe', label: 'Coffee shops', desc: 'Need the buzz' },
                            { value: 'mix', label: 'Mix of both', desc: 'Depends on the day' },
                          ].map((opt, i) => (
                            <OptionCard
                              key={opt.value}
                              value={opt.value}
                              currentValue={formData.studyLocation}
                              label={opt.label}
                              description={opt.desc}
                              onSelect={() => update('studyLocation', opt.value)}
                              index={i}
                            />
                          ))}
                        </RadioGroup>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>Cooking habits</Label>
                        <Select value={formData.cookingFrequency} onValueChange={(v) => update('cookingFrequency', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="How often do you cook?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Cook daily</SelectItem>
                            <SelectItem value="few-times">A few times a week</SelectItem>
                            <SelectItem value="rarely">Rarely — mostly takeout</SelectItem>
                            <SelectItem value="never">Never cook</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>How do you handle conflict?</Label>
                        <Select value={formData.conflictStyle} onValueChange={(v) => update('conflictStyle', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Conflict resolution style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="direct">Direct — let's talk it out right away</SelectItem>
                            <SelectItem value="cool-off">Need to cool off first, then discuss</SelectItem>
                            <SelectItem value="avoid">Tend to avoid confrontation</SelectItem>
                            <SelectItem value="written">Prefer texting / written communication</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label>Deal-breakers (select all that apply)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            'Smoking',
                            'Pets',
                            'Loud Music',
                            'Overnight Guests',
                            'Drinking',
                            'Drug Use',
                            'Late Parties',
                            'No A/C',
                          ].map((item) => (
                            <div
                              key={item}
                              className={cn(
                                'flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition-all duration-200',
                                formData.dealBreakers.includes(item)
                                  ? 'border-red-900/60 bg-red-950/20'
                                  : 'border-slate-800/60 hover:border-slate-700 hover:bg-white/[0.03]',
                              )}
                              onClick={() => toggleDealBreaker(item)}
                            >
                              <Checkbox
                                checked={formData.dealBreakers.includes(item)}
                                onCheckedChange={() => toggleDealBreaker(item)}
                              />
                              <span className="text-sm font-sans text-slate-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* ═══ STEP 5: Personality (MBTI) ═══ */}
                {currentStep === 4 && (
                  <>
                    <CardHeader>
                      <CardTitle>Personality Profile</CardTitle>
                      <CardDescription>
                        Select your preference for each dimension — or take a quick guess
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <MBTIDimension
                        label="Energy"
                        optionA="E — Extraverted"
                        optionB="I — Introverted"
                        valueA="E"
                        valueB="I"
                        field="mbtiE"
                        description="Where do you get your energy from?"
                      />
                      <MBTIDimension
                        label="Information"
                        optionA="S — Sensing"
                        optionB="N — Intuition"
                        valueA="S"
                        valueB="N"
                        field="mbtiS"
                        description="How do you take in information?"
                      />
                      <MBTIDimension
                        label="Decisions"
                        optionA="T — Thinking"
                        optionB="F — Feeling"
                        valueA="T"
                        valueB="F"
                        field="mbtiT"
                        description="How do you make decisions?"
                      />
                      <MBTIDimension
                        label="Structure"
                        optionA="J — Judging"
                        optionB="P — Perceiving"
                        valueA="J"
                        valueB="P"
                        field="mbtiJ"
                        description="How do you organize your life?"
                      />

                      {formData.mbtiE && formData.mbtiS && formData.mbtiT && formData.mbtiJ && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-4 rounded-xl border border-slate-700 bg-white/[0.04]"
                        >
                          <p className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-1">Your Type</p>
                          <p className="text-3xl font-serif font-bold text-slate-100 tracking-widest">
                            {formData.mbtiE}{formData.mbtiS}{formData.mbtiT}{formData.mbtiJ}
                          </p>
                        </motion.div>
                      )}
                    </CardContent>
                  </>
                )}

                {/* ═══ STEP 6: Verification ═══ */}
                {currentStep === 5 && (
                  <>
                    <CardHeader>
                      <CardTitle>Verification</CardTitle>
                      <CardDescription>
                        Verify your identity to earn a trusted profile badge
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <motion.div variants={fadeIn} className="space-y-2">
                        <Label htmlFor="uniEmail">University Email</Label>
                        <Input
                          id="uniEmail"
                          type="email"
                          placeholder="yourname@university.edu"
                          value={formData.universityEmail}
                          onChange={(e) => update('universityEmail', e.target.value)}
                        />
                        <p className="text-xs font-sans text-slate-600">
                          We'll send a verification link to confirm your student status
                        </p>
                      </motion.div>

                      <motion.div variants={fadeIn} className="space-y-3">
                        <Label>ID Verification</Label>
                        <div
                          className={cn(
                            'rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200',
                            formData.idUploaded
                              ? 'border-slate-500 bg-white/[0.04]'
                              : 'border-slate-700 hover:border-slate-600 hover:bg-white/[0.02]',
                          )}
                          onClick={() => update('idUploaded', true)}
                        >
                          {formData.idUploaded ? (
                            <div className="space-y-1">
                              <Check className="w-6 h-6 text-emerald-500 mx-auto" />
                              <p className="text-sm font-sans text-slate-300">ID uploaded</p>
                              <p className="text-xs font-sans text-slate-600">student_id.jpg</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-sans text-slate-400">Click to upload your student ID</p>
                              <p className="text-xs font-sans text-slate-600">PNG, JPG up to 5MB (simulated)</p>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Badge Preview */}
                      <motion.div
                        variants={fadeIn}
                        className="rounded-xl border border-slate-800/60 bg-white/[0.03] p-4"
                      >
                        <p className="text-xs font-sans text-slate-500 uppercase tracking-wider mb-3">
                          Your Profile Badges
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-sans border transition-all duration-300',
                              formData.universityEmail.includes('@')
                                ? 'border-emerald-800 bg-emerald-950/30 text-emerald-400'
                                : 'border-slate-800 text-slate-600',
                            )}
                          >
                            {formData.universityEmail.includes('@') ? '&#10003; ' : ''}
                            .edu Verified
                          </span>
                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-sans border transition-all duration-300',
                              formData.idUploaded
                                ? 'border-emerald-800 bg-emerald-950/30 text-emerald-400'
                                : 'border-slate-800 text-slate-600',
                            )}
                          >
                            {formData.idUploaded ? '&#10003; ' : ''}
                            ID Verified
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-sans border border-slate-800 text-slate-600">
                            References
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        variants={fadeIn}
                        className="flex items-start gap-2 pt-2"
                      >
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => update('agreeToTerms', checked === true)}
                        />
                        <label
                          htmlFor="terms"
                          className="text-xs font-sans text-slate-400 leading-relaxed cursor-pointer"
                        >
                          I agree to the Terms of Service and Privacy Policy. My data will only be
                          used for roommate matching purposes.
                        </label>
                      </motion.div>
                    </CardContent>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Validation errors */}
            {validationErrors.length > 0 && currentStep === steps.length - 1 && (
              <div className="px-6 pb-2">
                <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-3 space-y-1">
                  <p className="text-xs font-sans font-medium text-red-400">Please complete the following:</p>
                  {validationErrors.map((err, i) => (
                    <p key={i} className="text-xs font-sans text-red-400/70">• {err}</p>
                  ))}
                </div>
              </div>
            )}

            <CardFooter className="flex justify-between pt-6 pb-6">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="rounded-2xl">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                data-demo="next-btn"
                onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                disabled={isSubmitting}
                className="rounded-2xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Finding matches...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Find My Match <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Step label */}
        <motion.p
          className="mt-4 text-center text-xs font-sans text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </motion.p>
      </div>
    </div>
  )
}
