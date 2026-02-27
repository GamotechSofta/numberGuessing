export default function TopMarketsSection({ markets, loading }) {
  // Get today's date formatted
  const today = new Date().toLocaleDateString('en-GB').split('/').join('-')

  // Helper: display guessing value with hyphen separator (admin enters space-separated)
  const displayValue = (val) => {
    if (!val || typeof val !== 'string' || val.trim() === '') return '—'
    // Convert space-separated to hyphen with spaces for display (e.g. "34 - 78")
    return val.trim().split(/\s+/).join(' - ')
  }

  return (
    <section className="w-full pt-2 pb-6 px-3 sm:px-4 md:px-6 bg-black">
      <style>{`
        @keyframes date-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .date-blink {
          animation: date-blink 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className="w-full overflow-hidden bg-black border-2 border-gold-500">
        {/* Section header - no borders */}
        <div className="text-center py-4">
          <h2 className="text-amber-400 text-2xl sm:text-3xl font-bold italic">Free Game Zone Open-Close</h2>
          <p className="text-white text-base sm:text-lg">⇨ Date : <span className="date-blink">{today}</span></p>
          <p className="text-white text-base sm:text-lg">Free Guessing Daily</p>
          <p className="text-amber-400 text-base sm:text-lg italic">Open To Close Fix Ank</p>
        </div>

        {loading ? (
          <div className="text-center text-neutral-400 py-8 text-sm">Loading markets...</div>
        ) : markets.length === 0 ? (
          <div className="text-center text-neutral-400 py-8 text-sm">No markets available</div>
        ) : (
          <div className="p-4">
            {/* Render guessing data per market - 5 cards per row grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {markets.map((market) => (
                <div
                  key={market._id || market.id}
                  className="bg-black p-4 border border-gold-500"
                >
                  {/* Market name */}
                  <h3 className="text-amber-400 font-bold text-center text-base sm:text-lg tracking-widest mb-3">
                    {market.name}
                  </h3>
                  {/* Guessing categories: Single, Jodi, Pana */}
                  <div className="text-center space-y-1 text-white text-sm italic">
                    <p>{displayValue(market.guessingSingle)}</p>
                    <p>{displayValue(market.guessingJodi)}</p>
                    <p>{displayValue(market.guessingPana)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
