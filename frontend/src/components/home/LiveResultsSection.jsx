import { getMarketResultDisplay } from '../../utils/marketResult'

/**
 * Parse "10:30 AM" / "11:45 PM" to minutes since midnight for comparison.
 * @param {string} timeStr - e.g. "10:30 AM"
 * @returns {number|null} - minutes since midnight (0-1439) or null if invalid
 */
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null
  const m = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return null
  let hour = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (m[3].toUpperCase() === 'PM') hour = hour === 12 ? 12 : hour + 12
  else hour = hour === 12 ? 0 : hour
  return hour * 60 + min
}

/**
 * True if current system time is between market openingTime and closingTime + 10 min (inclusive).
 * Grace period: market remains visible for 10 minutes after closeTime.
 */
function isCurrentlyActive(market) {
  const openStr = market.openingTime != null ? String(market.openingTime).trim() : ''
  const closeStr = market.closingTime != null ? String(market.closingTime).trim() : ''
  const openMin = parseTimeToMinutes(openStr)
  const closeMin = parseTimeToMinutes(closeStr)
  if (openMin == null || closeMin == null) return true
  const now = new Date()
  const currentMin = now.getHours() * 60 + now.getMinutes()
  const closeMinWithGrace = (closeMin + 10) % 1440
  if (closeMinWithGrace >= openMin) return currentMin >= openMin && currentMin <= closeMinWithGrace
  return currentMin >= openMin || currentMin <= closeMinWithGrace
}

export default function LiveResultsSection({ markets, loading }) {
  const list = markets || []
  const activeList = list.filter(isCurrentlyActive)
  const displayList = activeList.length > 0 ? activeList : list

  return (
    <section className="w-full py-6 px-3 sm:px-4 md:px-6 bg-black">
      <style>{`
        @keyframes live-result-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .live-result-blink {
          animation: live-result-blink 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className="w-full mx-auto overflow-hidden bg-black rounded-none border-2 border-gold-500">
        {/* Header: same bg and border as Today Lucky Number - blink animation */}
        <div className="bg-gradient-to-b from-gold-600 via-gold-400 to-gold-600 border-b border-gold-500 py-3 px-4 flex items-center justify-center gap-2">
          <span className="text-white font-bold text-lg live-result-blink" aria-hidden="true">♠</span>
          <h2 className="text-white text-base sm:text-lg font-bold uppercase tracking-wide live-result-blink">
            Satta Matka Live Result
          </h2>
          <span className="text-white font-bold text-lg live-result-blink" aria-hidden="true">♠</span>
        </div>

        {/* Content - filter applied before render */}
        <div className="py-2">
          {loading ? (
            <div className="py-6 text-center">
              <p className="text-white/80 text-sm">Loading...</p>
            </div>
          ) : displayList.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-white/80 text-sm">No live results available</p>
            </div>
          ) : (
            <div className="divide-y divide-white/40">
              {displayList.map((market, index) => (
                <div key={market._id || market.id || index} className="py-4 px-4 flex flex-col items-center justify-center text-center">
                  <h3 className="text-amber-400 font-bold uppercase text-base sm:text-lg mb-1 w-full">
                    {market.name || '—'}
                  </h3>
                  <p className="text-green-400 text-xl sm:text-2xl font-bold mb-1 w-full flex items-center justify-center gap-1">
                    <span className="text-green-400" aria-hidden="true">▲</span>
                    {getMarketResultDisplay(market)}
                  </p>
                  {((market.openingTime && String(market.openingTime).trim()) || (market.closingTime && String(market.closingTime).trim())) && (
                    <p className="text-gray-400 text-xs sm:text-sm w-full text-center">
                      ( {[market.openingTime, market.closingTime].filter(Boolean).join(' - ')} )
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
