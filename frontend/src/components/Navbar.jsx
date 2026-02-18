import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path) => location.pathname === path

  return (
    <>
      <style>{`
        @keyframes scroll-right-to-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .scrolling-text-container {
          display: flex;
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .scrolling-text {
          display: inline-flex;
          white-space: nowrap;
          animation: scroll-right-to-left 20s linear infinite;
          will-change: transform;
        }
        .scrolling-text span {
          padding-right: 20px;
        }
      `}</style>
      <nav className="bg-yellow-500 text-black shadow-md sticky top-0 z-50 w-full">
        <div className="w-full">
        {/* Top Navigation Bar - Desktop Only */}
        <div className="hidden sm:flex items-center justify-center gap-2 md:gap-3 text-xs sm:text-sm font-semibold py-2 px-4 border-b border-yellow-600">
          <Link to="/" className="hover:text-yellow-900 transition-colors whitespace-nowrap">Dpboss</Link>
          <span className="text-yellow-800 hidden md:inline">|</span>
          <Link to="/" className="hover:text-yellow-900 transition-colors whitespace-nowrap">Satta Matka</Link>
          <span className="text-yellow-800 hidden lg:inline">|</span>
          <Link to="/" className="hover:text-yellow-900 transition-colors whitespace-nowrap hidden lg:inline">Kalyan Matka</Link>
          <span className="text-yellow-800 hidden lg:inline">|</span>
          <Link to="/results" className="hover:text-yellow-900 transition-colors whitespace-nowrap hidden md:inline">Online Matka Result</Link>
        </div>
        
        {/* Bottom Navigation Menu */}
        <div className="flex items-center justify-between px-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-black hover:bg-yellow-400 rounded transition-colors flex-shrink-0 z-10"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Scrolling Text - Mobile Only */}
          <div className="sm:hidden flex-1 overflow-hidden ml-2 mr-2 relative">
            <div className="scrolling-text-container">
              <div className="scrolling-text text-xs font-semibold text-black">
                <span>India's no.1 betting prediction site • </span>
                <span>India's no.1 betting prediction site • </span>
                <span>India's no.1 betting prediction site • </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center justify-center gap-3 md:gap-6 text-xs sm:text-sm font-medium py-2.5">
            <Link 
              to="/" 
              className={`px-3 py-1.5 rounded transition-colors ${
                isActive('/') 
                  ? 'bg-yellow-600 text-black font-semibold' 
                  : 'hover:bg-yellow-400'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/results" 
              className={`px-3 py-1.5 rounded transition-colors ${
                isActive('/results') 
                  ? 'bg-yellow-600 text-black font-semibold' 
                  : 'hover:bg-yellow-400'
              }`}
            >
              Results
            </Link>
            <Link 
              to="/tips" 
              className={`px-3 py-1.5 rounded transition-colors ${
                isActive('/tips') 
                  ? 'bg-yellow-600 text-black font-semibold' 
                  : 'hover:bg-yellow-400'
              }`}
            >
              Tips
            </Link>
            <Link 
              to="/charts" 
              className={`px-3 py-1.5 rounded transition-colors ${
                isActive('/charts') 
                  ? 'bg-yellow-600 text-black font-semibold' 
                  : 'hover:bg-yellow-400'
              }`}
            >
              Charts
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-1.5 rounded transition-colors ${
                isActive('/about') 
                  ? 'bg-yellow-600 text-black font-semibold' 
                  : 'hover:bg-yellow-400'
              }`}
            >
              About
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-yellow-600 bg-yellow-500">
            <div className="flex flex-col">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-yellow-600 text-black font-semibold' 
                    : 'hover:bg-yellow-400'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/results" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  isActive('/results') 
                    ? 'bg-yellow-600 text-black font-semibold' 
                    : 'hover:bg-yellow-400'
                }`}
              >
                Results
              </Link>
              <Link 
                to="/tips" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  isActive('/tips') 
                    ? 'bg-yellow-600 text-black font-semibold' 
                    : 'hover:bg-yellow-400'
                }`}
              >
                Tips
              </Link>
              <Link 
                to="/charts" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  isActive('/charts') 
                    ? 'bg-yellow-600 text-black font-semibold' 
                    : 'hover:bg-yellow-400'
                }`}
              >
                Charts
              </Link>
              <Link 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  isActive('/about') 
                    ? 'bg-yellow-600 text-black font-semibold' 
                    : 'hover:bg-yellow-400'
                }`}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  )
}
