import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const DAILY_RESULTS_URL = `${API_BASE_URL}/api/daily-results`

/**
 * MarketChartModal - Reusable chart modal component
 * Uses same chart structure as ChartManagement (weekly grid format)
 * @param {Object} market - Market object with name property
 * @param {Function} onClose - Callback to close modal
 * @param {number} refreshTrigger - Optional trigger to force data refresh (increment to refetch)
 */
export default function MarketChartModal({ market, onClose, refreshTrigger = 0 }) {
  const [charts, setCharts] = useState([])
  const [loading, setLoading] = useState(true)

  // Refetch chart data when market changes or refreshTrigger is incremented
  useEffect(() => {
    if (market) {
      fetchChartData()
    }
  }, [market, refreshTrigger])

  // Fetch and transform data into weekly chart format (same logic as ChartManagement)
  const fetchChartData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${DAILY_RESULTS_URL}?marketName=${encodeURIComponent(market.name)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const dbResults = await response.json()
      
      // Transform database data into table format grouped by week
      const weekMap = {}
      
      dbResults.forEach(result => {
        const resultDate = new Date(result.date)
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][resultDate.getDay()]
        
        // Find the week this date belongs to (Monday to Sunday)
        const monday = new Date(resultDate)
        const day = resultDate.getDay()
        const diff = resultDate.getDate() - day + (day === 0 ? -6 : 1)
        monday.setDate(diff)
        monday.setHours(0, 0, 0, 0)
        
        const sunday = new Date(monday)
        sunday.setDate(sunday.getDate() + 6)
        
        const formatDate = (date) => {
          const dd = String(date.getDate()).padStart(2, '0')
          const mm = String(date.getMonth() + 1).padStart(2, '0')
          const yyyy = date.getFullYear()
          return `${dd}-${mm}-${yyyy}`
        }
        
        const weekKey = `${formatDate(monday)}to${formatDate(sunday)}`
        
        if (!weekMap[weekKey]) {
          weekMap[weekKey] = {
            week: weekKey,
            Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null
          }
        }
        
        weekMap[weekKey][dayOfWeek] = {
          _id: result._id,
          open: result.open,
          close: result.close,
          result: result.result || '',
          date: result.date,
          marketName: result.marketName
        }
      })
      
      // Convert to array and sort by date (newest first)
      const chartsData = Object.values(weekMap).sort((a, b) => {
        const parseWeekDate = (weekStr) => {
          const startDateStr = weekStr.split('to')[0]
          const [day, month, year] = startDateStr.split('-').map(Number)
          return new Date(year, month - 1, day)
        }
        return parseWeekDate(b.week) - parseWeekDate(a.week)
      })
      
      setCharts(chartsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setLoading(false)
    }
  }

  // Format week date string for display
  const formatWeekDate = (weekStr) => {
    return weekStr.replace(/(\d{2})-(\d{2})-(\d{4})to(\d{2})-(\d{2})-(\d{4})/, '$1/$2/$3 to $4/$5/$6')
  }

  // Format number with padding (same as ChartManagement)
  const formatNumber = (value, digits) => {
    if (!value) return '-'
    const cleaned = value.toString().replace(/[\s-]/g, '')
    if (!cleaned) return '-'
    return cleaned.padStart(digits, '0')
  }

  // Render day cell (same structure as ChartManagement)
  const renderDayCell = (dayData) => {
    if (!dayData) {
      return (
        <td className="border border-gray-400 bg-white h-16 w-20 text-center text-gray-400">
          <div className="h-full flex items-center justify-center">
            <span className="text-xs">-</span>
          </div>
        </td>
      )
    }

    const openFormatted = formatNumber(dayData.open, 3)
    const resultFormatted = formatNumber(dayData.result, 2)
    const closeFormatted = formatNumber(dayData.close, 3)

    const openDigits = openFormatted.split('')
    const closeDigits = closeFormatted.split('')

    return (
      <td className="border border-gray-400 bg-white p-1 h-16 w-20 align-top">
        <div className="h-full flex items-center justify-between px-1">
          {/* Open digits - vertical on left */}
          <div className="flex flex-col items-center justify-center gap-0.5">
            {openDigits.map((digit, idx) => (
              <div key={idx} className="text-[10px] font-semibold text-gray-700 leading-tight">{digit}</div>
            ))}
          </div>
          
          {/* Result - center, large and bold */}
          <div className="text-base font-bold text-black">{resultFormatted}</div>
          
          {/* Close digits - vertical on right */}
          <div className="flex flex-col items-center justify-center gap-0.5">
            {closeDigits.map((digit, idx) => (
              <div key={idx} className="text-[10px] font-semibold text-gray-700 leading-tight">{digit}</div>
            ))}
          </div>
        </div>
      </td>
    )
  }

  if (!market) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] shadow-xl border border-gray-600 flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h3 className="text-lg font-bold text-yellow-400 capitalize">
            {market.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} - Chart
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal content - chart table (same structure as ChartManagement) */}
        <div className="p-4 overflow-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-4"></div>
                <div className="text-gray-400">Loading chart data...</div>
              </div>
            </div>
          ) : charts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-700 rounded-lg p-6 border border-yellow-600">
                <div className="text-yellow-400 text-2xl mb-2">📊</div>
                <p className="text-gray-400">No chart data available for this market.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Chart table - same structure as ChartManagement */}
              <table className="w-full border-collapse bg-white min-w-[600px] mx-auto shadow-lg">
                <thead>
                  <tr className="bg-yellow-600">
                    <th className="border border-gray-400 px-2 py-2 text-black font-bold text-xs w-28">Date</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-xs w-20">Mon</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-xs w-20">Tue</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-xs w-20">Wed</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-xs w-20">Thu</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-xs w-20">Fri</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-xs w-20">Sat</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-xs w-20">Sun</th>
                  </tr>
                </thead>
                <tbody>
                  {charts.map((chart, index) => (
                    <tr key={`chart-${index}`}>
                      <td className="border border-gray-400 bg-white px-2 py-2 text-black font-semibold text-[9px] text-center align-middle whitespace-pre-line leading-tight w-28">
                        {formatWeekDate(chart.week).replace(' to ', '\nto\n')}
                      </td>
                      {renderDayCell(chart.Mon)}
                      {renderDayCell(chart.Tue)}
                      {renderDayCell(chart.Wed)}
                      {renderDayCell(chart.Thu)}
                      {renderDayCell(chart.Fri)}
                      {renderDayCell(chart.Sat)}
                      {renderDayCell(chart.Sun)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="p-4 border-t border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
