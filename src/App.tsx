import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import Landing from '@/pages/Landing'
import Questionnaire from '@/pages/Questionnaire'

function App() {
  return (
    <BrowserRouter basename="/LIT">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/results" element={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 pt-20 p-8 text-center text-slate-500 font-sans">Results — Coming Soon</div>} />
        <Route path="/landlord" element={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 pt-20 p-8 text-center text-slate-500 font-sans">Landlord Portal — Coming Soon</div>} />
        <Route path="/reviews" element={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 pt-20 p-8 text-center text-slate-500 font-sans">Reviews — Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
