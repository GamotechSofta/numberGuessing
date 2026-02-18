import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_URL = `${API_BASE_URL}/api/markets`
const LIVE_RESULTS_URL = `${API_BASE_URL}/api/live-results`

export default function Dashboard() {
  const [stats, setStats] = useState({ markets: 0, liveResults: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [marketsRes, resultsRes] = await Promise.all([
        fetch(API_URL),
        fetch(LIVE_RESULTS_URL)
      ])
      const markets = await marketsRes.json()
      const results = await resultsRes.json()
      setStats({ markets: markets.length, liveResults: results.length })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Welcome to the Super Admin Control Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Markets</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.markets}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Live Results</p>
              <p className="text-3xl font-bold text-green-400">{stats.liveResults}</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Items</p>
              <p className="text-3xl font-bold text-blue-400">{stats.markets + stats.liveResults}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 border border-yellow-500/30">
            <h4 className="text-white font-semibold mb-2">Markets Management</h4>
            <p className="text-gray-400 text-sm">Add, edit, or delete markets</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 border border-yellow-500/30">
            <h4 className="text-white font-semibold mb-2">Live Results</h4>
            <p className="text-gray-400 text-sm">Manage live result updates</p>
          </div>
        </div>
      </div>
    </div>
  )
}
