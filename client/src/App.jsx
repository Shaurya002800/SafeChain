import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Report from './pages/Report';
import SafetyMap from './pages/SafetyMap';
import Track from './pages/Track';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans">
      <Navbar />
      
      {/* pt-20 ensures content isn't hidden behind a fixed navbar */}
      <main className="flex-grow pt-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/map" element={<SafetyMap />} />
          <Route path="/track" element={<Track />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;