import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black shadow-lg sticky top-0 z-50 w-full">
      <div className="w-full">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-center gap-3 text-sm font-bold py-2 px-4 border-b border-yellow-700">
          <span className="text-lg">👑</span>
          <Link to="/" className="hover:text-yellow-900 transition-colors duration-200">Dpboss</Link>
          <span className="text-yellow-800">|</span>
          <Link to="/" className="hover:text-yellow-900 transition-colors duration-200">Satta Matka</Link>
          <span className="text-yellow-800">|</span>
          <Link to="/" className="hover:text-yellow-900 transition-colors duration-200">Kalyan Matka</Link>
          <span className="text-yellow-800">|</span>
          <Link to="/results" className="hover:text-yellow-900 transition-colors duration-200">Online Matka Result</Link>
          <span className="text-lg">👑</span>
        </div>
        
        {/* Bottom Navigation Menu */}
        <div className="flex items-center justify-center gap-6 text-sm font-semibold py-2.5 px-4">
          <Link 
            to="/" 
            className={`px-3 py-1 rounded transition-all duration-200 ${
              isActive('/') 
                ? 'bg-yellow-700 text-white shadow-md' 
                : 'hover:bg-yellow-400 hover:text-yellow-900'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/results" 
            className={`px-3 py-1 rounded transition-all duration-200 ${
              isActive('/results') 
                ? 'bg-yellow-700 text-white shadow-md' 
                : 'hover:bg-yellow-400 hover:text-yellow-900'
            }`}
          >
            Results
          </Link>
          <Link 
            to="/tips" 
            className={`px-3 py-1 rounded transition-all duration-200 ${
              isActive('/tips') 
                ? 'bg-yellow-700 text-white shadow-md' 
                : 'hover:bg-yellow-400 hover:text-yellow-900'
            }`}
          >
            Tips
          </Link>
          <Link 
            to="/charts" 
            className={`px-3 py-1 rounded transition-all duration-200 ${
              isActive('/charts') 
                ? 'bg-yellow-700 text-white shadow-md' 
                : 'hover:bg-yellow-400 hover:text-yellow-900'
            }`}
          >
            Charts
          </Link>
          <Link 
            to="/about" 
            className={`px-3 py-1 rounded transition-all duration-200 ${
              isActive('/about') 
                ? 'bg-yellow-700 text-white shadow-md' 
                : 'hover:bg-yellow-400 hover:text-yellow-900'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}
