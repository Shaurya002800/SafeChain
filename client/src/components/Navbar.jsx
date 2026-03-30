import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Shield, Menu, X, AlertTriangle } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function for active link styling
  const navLinkClasses = ({ isActive }) =>
    `transition-colors duration-200 font-medium ${
      isActive ? 'text-purple-400' : 'text-slate-300 hover:text-white'
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-purple-600/20 p-2 rounded-lg group-hover:bg-purple-600/30 transition-colors">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              SafeChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/map" className={navLinkClasses}>Safety Map</NavLink>
            <NavLink to="/track" className={navLinkClasses}>Track Status</NavLink>
            
            {/* Primary CTA */}
            <Link
              to="/report"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              <AlertTriangle className="w-4 h-4" />
              Report Incident
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            <NavLink 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={navLinkClasses}
            >
              Home
            </NavLink>
            <NavLink 
              to="/map" 
              onClick={() => setIsOpen(false)}
              className={navLinkClasses}
            >
              Safety Map
            </NavLink>
            <NavLink 
              to="/track" 
              onClick={() => setIsOpen(false)}
              className={navLinkClasses}
            >
              Track Status
            </NavLink>
            <Link
              to="/report"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-lg font-medium mt-4"
            >
              <AlertTriangle className="w-4 h-4" />
              Report Incident
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;