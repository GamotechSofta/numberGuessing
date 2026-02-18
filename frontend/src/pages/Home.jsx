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
    <div className="min-h-screen bg-gray-900 text-white w-full">
      {/* Hero Section */}
      <section className="w-full py-8 px-4 bg-gradient-to-b from-yellow-600/20 to-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-3">
            Welcome to Dpboss Online
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mb-4 max-w-2xl mx-auto">
            India's Most Trusted Satta Matka Platform - Get Fast Results, Expert Tips, and Accurate Predictions
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-yellow-400 text-xs mb-1">Live Results</p>
              <p className="text-white text-sm font-semibold">24/7 Updates</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-yellow-400 text-xs mb-1">Expert Tips</p>
              <p className="text-white text-sm font-semibold">Daily Predictions</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-yellow-400 text-xs mb-1">Accurate Charts</p>
              <p className="text-white text-sm font-semibold">Historical Data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4 text-center">
            Today's Quick Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Markets</p>
              <p className="text-green-400 text-xl font-bold">{markets.length > 0 ? markets.length : '--'}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
              <p className="text-gray-400 text-xs mb-1">Live Results</p>
              <p className="text-green-400 text-xl font-bold">{liveResults.length > 0 ? liveResults.length : '--'}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
              <p className="text-gray-400 text-xs mb-1">Today's Date</p>
              <p className="text-green-400 text-sm font-bold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
              <p className="text-gray-400 text-xs mb-1">Status</p>
              <p className="text-green-400 text-sm font-bold">Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Top Markets Guessing Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4 text-center">
            Top 5 Markets Guessing
          </h2>
          {loading ? (
            <div className="text-center text-gray-400 py-8 text-sm">Loading markets...</div>
          ) : markets.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">No markets available</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {markets.map((market) => (
                <div
                  key={market._id || market.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <h3 className="text-yellow-400 font-semibold mb-3 text-center text-sm">
                    {market.name}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-white text-xs mb-1">Open</p>
                      <p className="text-green-400 text-lg font-bold">{market.open}</p>
                    </div>
                    <div>
                      <p className="text-white text-xs mb-1">Close</p>
                      <p className="text-green-400 text-lg font-bold">{market.close}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Today Lucky Number Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4 text-center">
            Today Lucky Number
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-2 text-sm">Golden Ank</h3>
              <p className="text-green-400 text-2xl font-bold">1-4-6-9</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-2 text-sm">Motor Patti</h3>
              <p className="text-green-400 text-2xl font-bold">12469</p>
            </div>
          </div>
        </div>
      </section>

      {/* Satta Matka Live Result Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4 text-center">
            SATTA MATKA LIVE RESULT
          </h2>
          {resultsLoading ? (
            <div className="text-center text-gray-400 py-8 text-sm">Loading live results...</div>
          ) : liveResults.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">No live results available</div>
          ) : (
            <div className="space-y-3">
              {liveResults.map((result) => (
                <div key={result._id || result.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-yellow-400 font-semibold mb-2 text-sm">{result.name}</h3>
                  <p className="text-green-400 text-xl font-bold mb-1">{result.result}</p>
                  <p className="text-gray-400 text-xs">{result.timeRange}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gaming Platform Promotion */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-yellow-400 text-base font-semibold mb-2 text-center">
              JOIN WWW.OSGAMES.CO
            </h2>
            <p className="text-gray-300 text-center text-sm leading-relaxed">
              Play Sports, Betting Exchange, Worli Live Matka, Casino and Live Sport 
              India's No # 1 Gaming Platform to Play Games.
            </p>
          </div>
        </div>
      </section>

      {/* Keywords Section - Hidden on mobile */}
      <section className="hidden sm:block w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-xs text-center leading-relaxed">
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

      {/* Expert Tips Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4 text-center">
            Expert Tips & Guessing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-yellow-400 font-medium mb-2 text-sm">Best Jodi</h3>
              <p className="text-green-400 text-xl font-bold mb-2">45-67</p>
              <p className="text-gray-400 text-xs">High probability today</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-yellow-400 font-medium mb-2 text-sm">Top Patti</h3>
              <p className="text-green-400 text-xl font-bold mb-2">234</p>
              <p className="text-gray-400 text-xs">Recommended for betting</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-yellow-400 font-medium mb-2 text-sm">Single Ank</h3>
              <p className="text-green-400 text-xl font-bold mb-2">7</p>
              <p className="text-gray-400 text-xs">Today's lucky number</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4 text-center">
            How to Play Satta Matka
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-yellow-400 font-medium mb-2 text-sm">Step 1: Choose Market</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Select from popular markets like Kalyan, Milan Day, Rajdhani, etc.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-yellow-400 font-medium mb-2 text-sm">Step 2: Check Results</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                View live results and historical charts to make informed decisions.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-yellow-400 font-medium mb-2 text-sm">Step 3: Follow Tips</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Use expert tips and predictions to increase your winning chances.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-yellow-400 font-medium mb-2 text-sm">Step 4: Place Bets</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                Place your bets on selected numbers and wait for results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Markets Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4 text-center">
            Popular Markets
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {['Kalyan', 'Milan Day', 'Milan Night', 'Rajdhani Day', 'Rajdhani Night'].map((market) => (
              <div key={market} className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
                <h3 className="text-yellow-400 font-semibold text-xs sm:text-sm">{market}</h3>
                <p className="text-gray-400 text-xs mt-1">View Results</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4 text-center">
            Why Choose Dpboss Online?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
              <div className="text-yellow-400 text-2xl mb-2">⚡</div>
              <h3 className="text-white font-medium mb-1 text-sm">Fast Results</h3>
              <p className="text-gray-400 text-xs">Get instant updates</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
              <div className="text-yellow-400 text-2xl mb-2">🎯</div>
              <h3 className="text-white font-medium mb-1 text-sm">Accurate Tips</h3>
              <p className="text-gray-400 text-xs">Expert predictions</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
              <div className="text-yellow-400 text-2xl mb-2">📊</div>
              <h3 className="text-white font-medium mb-1 text-sm">Live Charts</h3>
              <p className="text-gray-400 text-xs">Historical data</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
              <div className="text-yellow-400 text-2xl mb-2">🔒</div>
              <h3 className="text-white font-medium mb-1 text-sm">Secure Platform</h3>
              <p className="text-gray-400 text-xs">Trusted & reliable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Playing Satta Matka Section */}
      <section className="w-full py-6 px-4 border-t border-yellow-600 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-yellow-400 text-base font-semibold mb-3 text-center">
              PLAYING SATTA MATKA WITH DPBOSS ONLINE
            </h2>
            <p className="text-gray-300 leading-relaxed text-center text-sm mb-3">
              Dpbossonline.com is a top-notch online Matka industry leader providing 
              fast and accurate results. We offer expert tips, live results, and a 
              comprehensive Matka experience.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="bg-gray-700 px-3 py-1 rounded text-xs text-gray-300">Kalyan Matka</span>
              <span className="bg-gray-700 px-3 py-1 rounded text-xs text-gray-300">Milan Day</span>
              <span className="bg-gray-700 px-3 py-1 rounded text-xs text-gray-300">Rajdhani Night</span>
              <span className="bg-gray-700 px-3 py-1 rounded text-xs text-gray-300">Satta Result</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
