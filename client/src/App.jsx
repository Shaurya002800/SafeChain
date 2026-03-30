import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Routes>
        <Route path="/"       element={<Home />} />
        <Route path="/report" element={<p className="p-8 text-gray-400">Report coming soon</p>} />
        <Route path="/track"  element={<p className="p-8 text-gray-400">Track coming soon</p>} />
        <Route path="/map"    element={<p className="p-8 text-gray-400">Map coming soon</p>} />
      </Routes>
    </div>
  )
}