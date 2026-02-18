import { useState, useEffect } from 'react'
import { parseHtmlChart } from '../utils/parseHtmlChart'

export default function Charts() {
  const [htmlCharts, setHtmlCharts] = useState([])
  const [htmlMarkets, setHtmlMarkets] = useState([]) // Market data with name and charts
  const [expandedMarkets, setExpandedMarkets] = useState({}) // Track which markets are expanded
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHtmlData()
  }, [])


  const fetchHtmlData = async () => {
    try {
      const response = await fetch('/full-page.html')
      const htmlContent = await response.text()
      const parsedCharts = parseHtmlChart(htmlContent)
      setHtmlCharts(parsedCharts)
      
      // Group charts by market (for now, all are Kalyan Market)
      // In the future, this can be extended to support multiple markets
      const markets = [
        {
          name: 'Kalyan Market',
          charts: parsedCharts
        }
      ]
      setHtmlMarkets(markets)
      setLoading(false)
      
      // Markets are closed by default (no expansion)
    } catch (error) {
      console.error('Error fetching HTML data:', error)
      setLoading(false)
    }
  }

  const toggleMarket = (marketName) => {
    setExpandedMarkets(prev => ({
      ...prev,
      [marketName]: !prev[marketName]
    }))
  }

  const renderDayCell = (dayData) => {
    if (!dayData) return <td className="border-2 border-yellow-600/50 px-4 py-3 text-center align-middle bg-gray-800/50">-</td>
    
    // Check if it's the new object format or old string format
    if (typeof dayData === 'object' && dayData !== null && 'mainNumber' in dayData) {
      const { mainNumber, isHighlighted, leftNumbers = [], rightNumbers = [], hasAsterisk, asteriskCount = 0 } = dayData
      
      return (
        <td className="border-2 border-yellow-600/50 px-4 py-3 text-center align-middle bg-gray-800/50">
          <div className="flex items-center justify-center gap-1 relative">
            {/* Left numbers */}
            <div className="flex flex-col items-end gap-0.5 text-xs text-gray-400">
              {leftNumbers.map((num, idx) => (
                <span key={`left-${idx}`}>{num}</span>
              ))}
              {hasAsterisk && Array(asteriskCount).fill(0).map((_, idx) => (
                <span key={`left-ast-${idx}`} className="text-yellow-400">*</span>
              ))}
            </div>
            
            {/* Main number */}
            <div className={`text-2xl font-bold mx-2 ${isHighlighted ? 'text-red-400' : 'text-green-400'}`}>
              {mainNumber || (hasAsterisk ? '**' : '-')}
            </div>
            
            {/* Right numbers */}
            <div className="flex flex-col items-start gap-0.5 text-xs text-gray-400">
              {rightNumbers.map((num, idx) => (
                <span key={`right-${idx}`}>{num}</span>
              ))}
              {hasAsterisk && Array(asteriskCount).fill(0).map((_, idx) => (
                <span key={`right-ast-${idx}`} className="text-yellow-400">*</span>
              ))}
            </div>
          </div>
        </td>
      )
    } else {
      // Old string format - handle backward compatibility
      const value = dayData || ''
      const lines = value.split('\n').filter(line => line.trim())
      
      return (
        <td className="border-2 border-yellow-600/50 px-4 py-3 text-center text-green-400 font-bold bg-gray-800/50">
          {lines.length > 0 ? (
            <div className="flex flex-col gap-1">
              {lines.map((line, index) => (
                <span key={index} className="block">{line}</span>
              ))}
            </div>
          ) : '-'}
        </td>
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white w-full">
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-gray-400 py-8">Loading chart data...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white w-full">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-8 text-center">
            Market Analysis Charts
          </h1>

          {/* HTML Data */}
          {htmlMarkets.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-600/50 shadow-xl">
              <p className="text-center text-gray-400 py-8">No HTML chart data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {htmlMarkets.map((market) => {
                const isExpanded = expandedMarkets[market.name] || false
                return (
                  <div key={market.name} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-yellow-600/50 shadow-xl overflow-hidden">
                    {/* Market Header - Clickable */}
                    <button
                      onClick={() => toggleMarket(market.name)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-gray-800/70 hover:bg-gray-800/90 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{isExpanded ? '▼' : '▶'}</span>
                        <span className="text-gray-400 text-lg font-semibold">Panel</span>
                        <h2 className="text-2xl font-bold text-yellow-400">{market.name}</h2>
                      </div>
                    </button>
                    
                    {/* Market Table - Collapsible */}
                    {isExpanded && (
                      <div className="p-6 border-t border-yellow-600/30 overflow-x-auto">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-yellow-600/80">
                                <th className="border-2 border-yellow-600/50 px-4 py-3 text-black font-bold text-left">Date</th>
                                <th className="border-2 border-yellow-600/50 px-4 py-3 text-black font-bold">Mon</th>
                                <th className="border-2 border-yellow-600/50 px-4 py-3 text-black font-bold">Tue</th>
                                <th className="border-2 border-yellow-600/50 px-4 py-3 text-black font-bold">Wed</th>
                                <th className="border-2 border-yellow-600/50 px-4 py-3 text-black font-bold">Thu</th>
                                <th className="border-2 border-yellow-600/50 px-4 py-3 text-black font-bold">Fri</th>
                                <th className="border-2 border-yellow-600/50 px-4 py-3 text-black font-bold">Sat</th>
                                <th className="border-2 border-yellow-600/50 px-4 py-3 text-black font-bold">Sun</th>
                              </tr>
                            </thead>
                            <tbody>
                              {market.charts.map((chart, index) => (
                                <tr key={`${market.name}-${index}`} className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                                  <td className="border-2 border-yellow-600/50 px-4 py-3 text-white font-semibold bg-gray-800/50">
                                    {chart.Date || '-'}
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
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border-2 border-yellow-600/50 shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">How to Analyze</h2>
            <div className="text-gray-300 text-lg leading-relaxed space-y-2">
              <p>• Review the main numbers (large center numbers) for each day</p>
              <p>• Check the small numbers on the left and right sides</p>
              <p>• Red highlighted numbers indicate special significance</p>
              <p>• Look for patterns and trends across different dates</p>
              <p>• Use this data to make informed predictions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
