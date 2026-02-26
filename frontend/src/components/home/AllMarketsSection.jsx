import { Link } from 'react-router-dom'

export default function AllMarketsSection({ markets, loading }) {
  return (
    <section className="w-full py-6 px-3 sm:px-4 md:px-6 bg-black border-t border-b border-amber-700/80">
      <div className="w-full mx-auto border-2 border-gold-500 overflow-hidden bg-black rounded-none">
        {/* Header */}
        <div className="border-t border-b border-amber-700/80 py-3 px-4">
          <h2 className="text-amber-100 text-center text-sm sm:text-base italic">
            World ka Live and Fastest Satta Matka Result Website
          </h2>
        </div>

        {/* Market list */}
        {loading ? (
          <div className="py-8 text-center text-white text-sm">Loading markets...</div>
        ) : !markets || markets.length === 0 ? (
          <div className="py-8 text-center text-white text-sm">No markets available</div>
        ) : (
          <div className="divide-y divide-neutral-700 min-h-[120px]">
            {markets.map((market) => (
              <div
                key={market._id || market.id}
                className="flex items-center justify-between gap-4 py-5 px-4 w-full"
              >
                <Link
                  to="/charts"
                  className="flex-shrink-0 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase px-4 py-2.5 rounded transition-colors"
                >
                  Panel
                </Link>

                <div className="flex-1 min-w-0 text-center px-2">
                  {/* 1. MARKET NAME - italic yellow, uppercase */}
                  <p className="text-amber-400 italic uppercase text-base sm:text-lg font-medium tracking-wide mb-1 block">
                    {market.name || '—'}
                  </p>
                  {/* 2. Result - bold bright yellow, largest */}
                  <p className="text-yellow-400 text-xl sm:text-2xl font-bold mb-1 block min-h-[1.5rem]">
                    {(() => {
                      const o = market.open != null ? String(market.open).trim() : ''
                      const c = market.close != null ? String(market.close).trim() : ''
                      const isPlaceholder = !o || !c || o === '***' || c === '***'
                      if (isPlaceholder) return '***_**_***'
                      if (market.result) return String(market.result)
                      return `${o}-${c}`
                    })()}
                  </p>
                  {/* 3. Starting Time & Closing Time - two lines, italic yellow */}
                  <div className="text-amber-400 italic text-xs space-y-0.5 block min-h-[2rem]">
                    {(() => {
                      const start = (market.openingTime && String(market.openingTime).trim()) || ''
                      const end = (market.closingTime && String(market.closingTime).trim()) || ''
                      if (start || end) {
                        return (
                          <>
                            <p className="block">Starting Time: {start || '—'}</p>
                            <p className="block">Closing Time: {end || '—'}</p>
                          </>
                        )
                      }
                      if (market.timing && String(market.timing).trim()) {
                        const parts = String(market.timing).split(/\s*-\s*/).map((s) => s.trim())
                        if (parts.length >= 2) {
                          return (
                            <>
                              <p className="block">Starting Time: {parts[0]}</p>
                              <p className="block">Closing Time: {parts[1]}</p>
                            </>
                          )
                        }
                        return <p className="block">({market.timing})</p>
                      }
                      return <p className="block">(-)</p>
                    })()}
                  </div>
                </div>

                <Link
                  to="/charts"
                  className="flex-shrink-0 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase px-4 py-2.5 rounded transition-colors"
                >
                  Jodi
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
