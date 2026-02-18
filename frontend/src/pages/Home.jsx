import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_URL = `${API_BASE_URL}/api/markets`
const LIVE_RESULTS_URL = `${API_BASE_URL}/api/live-results`

export default function Home() {
  const [markets, setMarkets] = useState([])
  const [liveResults, setLiveResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [resultsLoading, setResultsLoading] = useState(true)

  useEffect(() => {
    fetchMarkets()
    fetchLiveResults()
  }, [])

  const fetchMarkets = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      // Get top 5 markets
      setMarkets(data.slice(0, 5))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching markets:', error)
      setLoading(false)
    }
  }

  const fetchLiveResults = async () => {
    try {
      const response = await fetch(LIVE_RESULTS_URL)
      const data = await response.json()
      setLiveResults(data)
      setResultsLoading(false)
    } catch (error) {
      console.error('Error fetching live results:', error)
      setResultsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white w-full">
      {/* 5 Top Markets Guessing Section */}
      <section className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-2 border-yellow-600 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-6 text-center">
              Top 5 Markets Guessing
            </h2>
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading markets...</div>
            ) : markets.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No markets available</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {markets.map((market) => (
                  <div
                    key={market._id || market.id}
                    className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-yellow-500/30 hover:border-yellow-500"
                  >
                    <h3 className="text-yellow-400 font-semibold mb-3 text-center text-sm sm:text-base">
                      {market.name}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Open</p>
                        <p className="text-green-400 text-xl font-bold">{market.open}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Close</p>
                        <p className="text-green-400 text-xl font-bold">{market.close}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Today Lucky Number Section */}
      <section className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-2 border-yellow-600 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-6 text-center">
              Today Lucky Number
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-500">
                <h3 className="text-yellow-400 font-semibold mb-3 text-lg">Golden Ank</h3>
                <p className="text-green-400 text-4xl font-bold tracking-wider">1-4-6-9</p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-500">
                <h3 className="text-yellow-400 font-semibold mb-3 text-lg">Motor Patti</h3>
                <p className="text-green-400 text-4xl font-bold tracking-wider">12469</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Satta Matka Live Result Section */}
      <section className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-2 border-yellow-600 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-3">
              <span className="text-yellow-500">◆</span> 
              <span>SATTA MATKA LIVE RESULT</span>
              <span className="text-yellow-500">◆</span>
            </h2>
            {resultsLoading ? (
              <div className="text-center text-gray-400 py-8">Loading live results...</div>
            ) : liveResults.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No live results available</div>
            ) : (
              <div className="space-y-4">
                {liveResults.map((result) => (
                  <div key={result._id || result.id} className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-5 border border-yellow-500/30 hover:border-yellow-500">
                    <h3 className="text-yellow-400 font-semibold mb-3 text-lg">{result.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 text-3xl font-bold">{result.result}</span>
                      <span className="text-green-400 text-2xl">📊</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-3">{result.timeRange}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gaming Platform Promotion */}
      <section className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 rounded-xl p-6 sm:p-8 border border-yellow-600 shadow-xl">
            <h2 className="text-yellow-400 text-2xl sm:text-3xl font-bold mb-3 text-center">
              JOIN WWW.OSGAMES.CO
            </h2>
            <p className="text-gray-200 text-center text-lg leading-relaxed">
              Play Sports, Betting Exchange, Worli Live Matka, Casino and Live Sport 
              India's No # 1 Gaming Platform to Play Games.
            </p>
          </div>
        </div>
      </section>

      {/* Keywords Section */}
      <section className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-yellow-600/50 shadow-xl">
            <div className="text-gray-300 text-xs sm:text-sm text-center leading-relaxed">
              KALYAN MATKA | MATKA RESULT | MADHURI NIGHT RESULT | MATKA PANA JODI TODAY | 
              TODAY SATTA MATKA RESULT | MATKA PATTI JODI NUMBER | MATKA RESULTS | MATKA CHART | 
              MATKA JODI | SATTA COM | FULL RATE GAME | MATKA GAME | ALL MATKA RESULT LIVE ONLINE | 
              MATKA RESULT | KALYAN MATKA RESULT | DPBOSS MATKA 143 | MATKA TIPS | FIX MATKA NUMBER | 
              SATTA GUESSING | 220 PATTI | JANTA MATKA RESULT | MILAN NIGHT RESULT | 
              MADHURI DAY RESULT | KALYAN OPEN | DPBOSS MATKA | MATKA GUESSING | 
              SATTA MATKA RESULT | DPBOSS SATTA MATKA | KALYAN DPBOSS | DP BOSS MATKA | 
              KALYAN MATKA OPEN | DPBOSS SATTA | MILAN DAY | MILAN NIGHT
            </div>
          </div>
        </div>
      </section>

      {/* Playing Satta Matka Section */}
      <section className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 border-2 border-yellow-600 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 text-center">
              PLAYING SATTA MATKA WITH DPBOSS ONLINE
            </h2>
            <p className="text-gray-300 leading-relaxed text-center text-lg">
              Dpbossonline.com is a top-notch online Matka industry leader providing 
              fast and accurate results. We offer expert tips, live results, and a 
              comprehensive Matka experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
