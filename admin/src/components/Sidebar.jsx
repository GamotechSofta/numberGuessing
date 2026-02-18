export default function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'markets', label: 'Markets', icon: '📈' },
    { id: 'live-results', label: 'Live Results', icon: '⚡' },
    { id: 'chart-data', label: 'Chart Data', icon: '📉' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-10">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-yellow-400">Super Admin</h1>
        <p className="text-gray-400 text-sm mt-1">Control Panel</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-yellow-600 text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center text-black font-bold">
            A
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Admin User</p>
            <p className="text-gray-400 text-xs">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
