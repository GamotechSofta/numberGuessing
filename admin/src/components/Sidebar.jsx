export default function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'markets', label: 'Markets', icon: '📈' },
    { id: 'live-results', label: 'Live Results', icon: '⚡' },
    { id: 'chart-data', label: 'Chart Data', icon: '📉' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const handleItemClick = (id) => {
    setActiveSection(id)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">Super Admin</h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Control Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-white"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <nav className="p-2 sm:p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                    activeSection === item.id
                      ? 'bg-yellow-600 text-black font-semibold'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg sm:text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-600 flex items-center justify-center text-black font-bold text-sm sm:text-base">
              A
            </div>
            <div>
              <p className="text-white font-semibold text-xs sm:text-sm">Admin User</p>
              <p className="text-gray-400 text-xs">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
