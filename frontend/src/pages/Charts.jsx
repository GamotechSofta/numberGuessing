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
    if (!dayData) return <td className="border border-gray-700 px-2 sm:px-3 py-2 text-center align-middle bg-white text-xs">-</td>
    
    // Check if it's the new object format or old string format
    if (typeof dayData === 'object' && dayData !== null && 'mainNumber' in dayData) {
      const { mainNumber, isHighlighted, leftNumbers = [], rightNumbers = [], hasAsterisk, asteriskCount = 0 } = dayData
      
      return (
        <td className="border border-gray-700 px-2 sm:px-3 py-2 text-center align-middle bg-white">
          <div className="flex items-center justify-center gap-0.5 sm:gap-1">
            {/* Left numbers */}
            <div className="flex flex-col items-end gap-0.5 text-[9px] sm:text-[10px] text-gray-600">
              {leftNumbers.map((num, idx) => (
                <span key={`left-${idx}`}>{num}</span>
              ))}
              {hasAsterisk && Array(asteriskCount).fill(0).map((_, idx) => (
                <span key={`left-ast-${idx}`} className="text-gray-400">*</span>
              ))}
            </div>
            
            {/* Main number */}
            <div className={`text-base sm:text-lg md:text-xl font-bold mx-1 ${isHighlighted ? 'text-red-500' : 'text-gray-900'}`}>
              {mainNumber || (hasAsterisk ? '**' : '-')}
            </div>
            
            {/* Right numbers */}
            <div className="flex flex-col items-start gap-0.5 text-[9px] sm:text-[10px] text-gray-600">
              {rightNumbers.map((num, idx) => (
                <span key={`right-${idx}`}>{num}</span>
              ))}
              {hasAsterisk && Array(asteriskCount).fill(0).map((_, idx) => (
                <span key={`right-ast-${idx}`} className="text-gray-400">*</span>
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
        <td className="border border-gray-700 px-2 sm:px-3 py-2 text-center text-gray-900 font-semibold bg-white text-xs">
          {lines.length > 0 ? (
            <div className="flex flex-col gap-0.5">
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
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="w-full py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-yellow-400 mb-6 text-center">
            Market Analysis Charts
          </h1>

          {/* HTML Data */}
          {htmlMarkets.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
              <p className="text-center text-gray-400 py-8 text-sm sm:text-base">No HTML chart data available</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {htmlMarkets.map((market) => {
                const isExpanded = expandedMarkets[market.name] || false
                return (
                  <div key={market.name} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    {/* Market Header - Clickable */}
                    <button
                      onClick={() => toggleMarket(market.name)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-gray-800 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-base sm:text-lg">{isExpanded ? '▼' : '▶'}</span>
                        <span className="text-gray-400 text-sm sm:text-base font-medium">Panel</span>
                        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-yellow-400">{market.name}</h2>
                      </div>
                    </button>
                    
                    {/* Market Table - Collapsible */}
                    {isExpanded && (
                      <div className="p-3 sm:p-4 border-t border-gray-700 overflow-x-auto">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse min-w-[600px]">
                            <thead>
                              <tr className="bg-yellow-500">
                                <th className="border border-gray-600 px-2 sm:px-3 py-2 text-black font-semibold text-left text-xs">Date</th>
                                <th className="border border-gray-600 px-2 sm:px-3 py-2 text-black font-semibold text-xs">Mon</th>
                                <th className="border border-gray-600 px-2 sm:px-3 py-2 text-black font-semibold text-xs">Tue</th>
                                <th className="border border-gray-600 px-2 sm:px-3 py-2 text-black font-semibold text-xs">Wed</th>
                                <th className="border border-gray-600 px-2 sm:px-3 py-2 text-black font-semibold text-xs">Thu</th>
                                <th className="border border-gray-600 px-2 sm:px-3 py-2 text-black font-semibold text-xs">Fri</th>
                                <th className="border border-gray-600 px-2 sm:px-3 py-2 text-black font-semibold text-xs">Sat</th>
                                <th className="border border-gray-600 px-2 sm:px-3 py-2 text-black font-semibold text-xs">Sun</th>
                              </tr>
                            </thead>
                            <tbody>
                              {market.charts.map((chart, index) => (
                                <tr key={`${market.name}-${index}`} className="bg-gray-800 hover:bg-gray-750 transition-colors">
                                  <td className="border border-gray-700 px-2 sm:px-3 py-2 text-white font-medium bg-gray-800 text-xs">
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

          <div className="mt-6 bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-yellow-400 mb-3">How to Analyze</h2>
            <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-2">
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
