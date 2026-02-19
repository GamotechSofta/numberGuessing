import { useState, useEffect } from 'react'

export default function Charts() {
  const [charts, setCharts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchChartData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchChartData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchChartData = async () => {
    try {
      setLoading(true)
      setError(null)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      
      // Fetch all daily results from database
      const response = await fetch(`${API_BASE_URL}/api/daily-results`)
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
        const diff = resultDate.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
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
            Mon: null,
            Tue: null,
            Wed: null,
            Thu: null,
            Fri: null,
            Sat: null,
            Sun: null
          }
        }
        
        // Store the day data
        weekMap[weekKey][dayOfWeek] = {
          open: result.open,
          close: result.close,
          result: result.result || ''
        }
      })
      
      // Convert to array and sort by date
      const charts = Object.values(weekMap).sort((a, b) => {
        // Parse the start date from week string (format: "DD-MM-YYYYtoDD-MM-YYYY")
        const parseWeekDate = (weekStr) => {
          const startDateStr = weekStr.split('to')[0] // Get first part: "DD-MM-YYYY"
          const [day, month, year] = startDateStr.split('-').map(Number)
          return new Date(year, month - 1, day) // month is 0-indexed in Date
        }
        
        const dateA = parseWeekDate(a.week)
        const dateB = parseWeekDate(b.week)
        
        // Sort descending (newest first)
        return dateB - dateA
      })
      
      setCharts(charts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setError('Failed to load chart data. Please try again later.')
      setLoading(false)
    }
  }

  const formatWeekDate = (weekStr) => {
    // Convert "28-09-2020to04-10-2020" to "28/09/2020 to 04/10/2020"
    return weekStr.replace(/(\d{2})-(\d{2})-(\d{4})to(\d{2})-(\d{2})-(\d{4})/, '$1/$2/$3 to $4/$5/$6')
  }

  const formatNumber = (value, digits) => {
    if (!value) return '-'
    // Remove spaces and hyphens, then pad with leading zeros
    const cleaned = value.toString().replace(/[\s-]/g, '')
    if (!cleaned) return '-'
    return cleaned.padStart(digits, '0')
  }

  const renderDayCell = (dayData) => {
    if (!dayData) {
      return <td className="border border-gray-400 bg-white h-20 w-24 text-center text-gray-500">-</td>
    }

    const openFormatted = formatNumber(dayData.open, 3)
    const resultFormatted = formatNumber(dayData.result, 2)
    const closeFormatted = formatNumber(dayData.close, 3)

    // Split into individual digits
    const openDigits = openFormatted.split('')
    const closeDigits = closeFormatted.split('')

    return (
      <td className="border border-gray-400 bg-white p-1 h-20 w-24 align-top relative">
        <div className="h-full flex items-center justify-between px-1">
          {/* Open digits - vertical on left */}
          <div className="flex flex-col items-center justify-center gap-0.5">
            {openDigits.map((digit, idx) => (
              <div key={idx} className="text-xs font-semibold text-gray-700 leading-tight">{digit}</div>
            ))}
          </div>
          
          {/* Result - center, large and bold */}
          <div className="text-xl font-bold text-black">{resultFormatted}</div>
          
          {/* Close digits - vertical on right */}
          <div className="flex flex-col items-center justify-center gap-0.5">
            {closeDigits.map((digit, idx) => (
              <div key={idx} className="text-xs font-semibold text-gray-700 leading-tight">{digit}</div>
            ))}
          </div>
        </div>
      </td>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
          <div className="text-gray-400 font-bold text-xl">Loading chart data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">⚠️</div>
          <div className="text-red-400 font-bold text-xl mb-2">{error}</div>
          <button
            onClick={fetchChartData}
            className="px-6 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="w-full py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-yellow-400 mb-2 text-center">
            Market Analysis Charts
          </h1>
          <p className="text-gray-400 text-sm text-center mb-6">KALYAN Market</p>

          {charts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800 rounded-lg p-8 border-2 border-yellow-600">
                <div className="text-yellow-400 text-2xl mb-4">📊</div>
                <h2 className="text-xl font-semibold text-white mb-2">No Chart Data Available</h2>
                <p className="text-gray-400 text-sm">
                  Chart data will appear here once it's added from admin panel.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse bg-white min-w-[600px] max-w-[800px] mx-auto shadow-lg">
                  <thead>
                    <tr className="bg-yellow-600">
                      <th className="border border-gray-400 px-2 py-2 text-black font-bold text-sm w-32">Date</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm w-24">Mon</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm w-24">Tue</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm w-24">Wed</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm w-24">Thu</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm w-24">Fri</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm w-24">Sat</th>
                    <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm w-24">Sun</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charts.map((chart, index) => (
                      <tr key={`chart-${index}`}>
                        {/* Date Column */}
                        <td className="border border-gray-400 bg-white px-2 py-2 text-black font-semibold text-[10px] text-center align-middle whitespace-pre-line leading-tight w-32">
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

              <div className="mt-6 p-4 border border-yellow-600 bg-gray-800 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-400 mb-2">Chart Guide</h2>
                <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                  <li><strong>O:</strong> Opening number</li>
                  <li><strong>Center Number:</strong> Result number</li>
                  <li><strong>C:</strong> Closing number</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
