export default function LiveResultsSection({ liveResults, loading }) {
  return (
    <section className="w-full py-6 px-3 sm:px-4 md:px-6 bg-black">
      <div className="w-full mx-auto border-2 border-gold-500 overflow-hidden bg-black rounded-none">
        {/* Golden header bar */}
        <div className="bg-gold-500 py-3 px-4 flex items-center justify-center gap-2">
          <span className="text-white text-lg" aria-hidden="true">♠</span>
          <h2 className="text-white text-base sm:text-lg font-bold uppercase tracking-wide">
            Satta Matka Live Result
          </h2>
          <span className="text-white text-lg" aria-hidden="true">♠</span>
        </div>

        {/* Content */}
        <div className="py-2">
          {loading ? (
            <div className="py-6 text-center">
              <p className="text-white/80 text-sm">Loading...</p>
            </div>
          ) : liveResults.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-white/80 text-sm">No live results available</p>
            </div>
          ) : (
            <div className="divide-y divide-white/40">
              {liveResults.map((result, index) => (
                <div key={result._id || result.id || index} className="py-4 px-4 text-center">
                  <h3 className="text-amber-400 font-bold uppercase text-sm mb-1">
                    {result.name}
                  </h3>
                  <p className="text-green-400 text-lg sm:text-xl font-bold mb-1 inline-flex items-center justify-center gap-1">
                    <span className="text-green-400" aria-hidden="true">▲</span>
                    {result.result}
                  </p>
                  <p className="text-white text-xs sm:text-sm">
                    {result.timeRange ? `( ${result.timeRange} )` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
