import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { DemoProvider } from '@/context/DemoContext'
import { DemoOverlay } from '@/components/DemoOverlay'
import Landing from '@/pages/Landing'
import Questionnaire from '@/pages/Questionnaire'
import HowItWorks from '@/pages/HowItWorks'

function App() {
  return (
    <BrowserRouter basename="/LIT">
      <DemoProvider>
        <Navbar />
        <DemoOverlay />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/results" element={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 pt-20 p-8 text-center text-slate-500 font-sans">Results — Coming Soon</div>} />
          <Route path="/landlord" element={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 pt-20 p-8 text-center text-slate-500 font-sans">Landlord Portal — Coming Soon</div>} />
          <Route path="/reviews" element={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 pt-20 p-8 text-center text-slate-500 font-sans">Reviews — Coming Soon</div>} />
        </Routes>
      </DemoProvider>
    </BrowserRouter>
  )
}

export default App
