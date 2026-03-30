import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Removed '/report' to avoid duplicating the primary Call-To-Action button
const links = [
  { to: '/',       label: 'Home' },
  { to: '/track',  label: 'Track Status' },
  { to: '/map',    label: 'Safety Map' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Helper function to determine if a link is active
  const isActive = (path) => pathname === path

  return (
    <nav 
      aria-label="Main Navigation"
      className="sticky top-0 z-50 border-b border-purple-900/30 bg-gray-950/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
            S
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Safe<span className="text-purple-400">Chain</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={isActive(link.to) ? 'page' : undefined}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                isActive(link.to)
                  ? 'bg-purple-600/20 text-white border border-purple-500/30 shadow-[0_0_10px_rgba(147,51,234,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-purple-600/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 shadow-lg shadow-purple-900/20"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Report Incident
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-600/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger Icon */}
            {!isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-purple-900/30 bg-gray-950/95 backdrop-blur-xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive(link.to) ? 'page' : undefined}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.to)
                    ? 'bg-purple-600/20 text-white border-l-4 border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-purple-600/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile CTA */}
            <Link
              to="/report"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white text-base font-semibold rounded-lg transition-colors"
            >
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              Report Incident
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}