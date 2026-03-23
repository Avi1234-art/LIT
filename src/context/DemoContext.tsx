import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'

interface FormControl {
  setField: (field: string, value: unknown) => void
  setStep: (step: number) => void
  submit: () => void
}

interface DemoContextType {
  isDemoActive: boolean
  startDemo: () => void
  stopDemo: () => void
  cursorPos: { x: number; y: number } | null
  setCursorPos: (pos: { x: number; y: number } | null) => void
  demoPhase: 'landing' | 'navigating' | 'form' | 'processing' | 'results' | null
  setDemoPhase: (phase: DemoContextType['demoPhase']) => void
  registerFormControl: (control: FormControl) => void
  formControl: FormControl | null
}

const DemoContext = createContext<DemoContextType | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoActive, setIsDemoActive] = useState(false)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)
  const [demoPhase, setDemoPhase] = useState<DemoContextType['demoPhase']>(null)
  const formControlRef = useRef<FormControl | null>(null)

  const startDemo = useCallback(() => {
    setIsDemoActive(true)
    setDemoPhase('landing')
    setCursorPos(null)
  }, [])

  const stopDemo = useCallback(() => {
    setIsDemoActive(false)
    setDemoPhase(null)
    setCursorPos(null)
    formControlRef.current = null
  }, [])

  const registerFormControl = useCallback((control: FormControl) => {
    formControlRef.current = control
  }, [])

  return (
    <DemoContext.Provider
      value={{
        isDemoActive,
        startDemo,
        stopDemo,
        cursorPos,
        setCursorPos,
        demoPhase,
        setDemoPhase,
        registerFormControl,
        formControl: formControlRef.current,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider')
  return ctx
}
