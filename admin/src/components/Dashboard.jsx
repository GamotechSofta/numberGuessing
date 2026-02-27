import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_URL = `${API_BASE_URL}/api/markets`
const DAILY_RESULTS_URL = `${API_BASE_URL}/api/daily-results`

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    markets: 0, 
    dailyResults: 0,
    // Market counts by type
    regularCount: 0,
    starlineCount: 0,
    kingCount: 0,
    // Pending results by type (where result is not declared)
    regularPending: 0,
    starlinePending: 0,
    kingPending: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [marketsRes, dailyResultsRes] = await Promise.all([
        fetch(API_URL),
        fetch(DAILY_RESULTS_URL)
      ])
      const markets = await marketsRes.json()
      const dailyResults = await dailyResultsRes.json()

      // Filter markets by type
      const regularMarkets = markets.filter(m => (m.marketType || 'regular') === 'regular')
      const starlineMarkets = markets.filter(m => m.marketType === 'starline')
      const kingMarkets = markets.filter(m => m.marketType === 'king')

      // Check if result is pending (open or close contains '***')
      const isPending = (m) => m.open?.includes('***') || m.close?.includes('***')

      setStats({
        markets: markets.length,
        dailyResults: dailyResults.length,
        // Total counts by type
        regularCount: regularMarkets.length,
        starlineCount: starlineMarkets.length,
        kingCount: kingMarkets.length,
        // Pending results by type
        regularPending: regularMarkets.filter(isPending).length,
        starlinePending: starlineMarkets.filter(isPending).length,
        kingPending: kingMarkets.filter(isPending).length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400 text-sm sm:text-base">Welcome to the Super Admin Control Panel</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Markets</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.markets}</p>
            </div>
            <div className="text-3xl sm:text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Daily Results</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.dailyResults}</p>
            </div>
            <div className="text-3xl sm:text-4xl">📅</div>
          </div>
        </div>
      </div>

      {/* Market Statistics by Type */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">Market Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Regular Markets */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📊</span>
              <span className="text-white font-semibold">Regular Markets</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-white font-bold">{stats.regularCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Pending Results</span>
                <span className="text-orange-400 font-bold">{stats.regularPending}</span>
              </div>
            </div>
          </div>

          {/* Starline Markets */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⭐</span>
              <span className="text-white font-semibold">Starline Markets</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-white font-bold">{stats.starlineCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Pending Results</span>
                <span className="text-orange-400 font-bold">{stats.starlinePending}</span>
              </div>
            </div>
          </div>

          {/* King Bazaar Markets */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👑</span>
              <span className="text-white font-semibold">King Bazaar Markets</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-white font-bold">{stats.kingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Pending Results</span>
                <span className="text-orange-400 font-bold">{stats.kingPending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-yellow-500/30">
            <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Markets Management</h4>
            <p className="text-gray-400 text-xs sm:text-sm">Add, edit, or delete markets</p>
          </div>
        </div>
      </div>
    </div>
  )
}
