import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import Landing from '@/pages/Landing'

function App() {
  return (
    <BrowserRouter basename="/LIT">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/questionnaire" element={<div className="pt-20 p-8 text-center text-slate-500">Questionnaire — Coming Soon</div>} />
        <Route path="/results" element={<div className="pt-20 p-8 text-center text-slate-500">Results — Coming Soon</div>} />
        <Route path="/landlord" element={<div className="pt-20 p-8 text-center text-slate-500">Landlord Portal — Coming Soon</div>} />
        <Route path="/reviews" element={<div className="pt-20 p-8 text-center text-slate-500">Reviews — Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
