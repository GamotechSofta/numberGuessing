import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Markets from './components/Markets'
import LuckyNumber from './components/LuckyNumber'
import DailyResults from './components/DailyResults'
import ChartManagement from './components/ChartManagement'
import Settings from './components/Settings'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'markets':
        return <Markets />
      case 'lucky-number':
        return <LuckyNumber />
      case 'daily-results':
        return <DailyResults />
      case 'chart-management':
        return <ChartManagement />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
        {renderContent()}
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      </div>
  )
}

export default App
