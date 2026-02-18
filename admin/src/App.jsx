import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Markets from './components/Markets'
import LiveResults from './components/LiveResults'
import ChartData from './components/ChartData'
import Settings from './components/Settings'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'markets':
        return <Markets />
      case 'live-results':
        return <LiveResults />
      case 'chart-data':
        return <ChartData />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 ml-64 p-8">
        {renderContent()}
      </div>
    </div>
  )
}

export default App
