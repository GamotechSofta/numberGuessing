export default function TopMarketsSection({ markets, loading }) {
  return (
    <section className="w-full py-6 px-3 sm:px-4 md:px-6 bg-black">
      <div className="w-full overflow-hidden bg-black border-2 border-gold-500 rounded-none">
        <h2 className="text-amber-400 text-lg font-semibold mb-4 text-center py-3">
          Top 5 Markets Guessing
        </h2>
        {loading ? (
          <div className="text-center text-neutral-400 py-8 text-sm">Loading markets...</div>
        ) : markets.length === 0 ? (
          <div className="text-center text-neutral-400 py-8 text-sm">No markets available</div>
        ) : (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3 overflow-x-auto sm:overflow-visible p-4">
            {markets.map((market) => (
              <div
                key={market._id || market.id}
                className="bg-black rounded-lg p-3 sm:p-4 flex-shrink-0 w-[140px] sm:w-auto border border-gold-500"
              >
                <h3 className="text-amber-400 font-semibold mb-2 sm:mb-3 text-center text-xs sm:text-sm">
                  {market.name}
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div>
                    <p className="text-white text-[10px] sm:text-xs mb-0.5 sm:mb-1">Open</p>
                    <p className="text-amber-400 text-sm sm:text-lg font-bold">{market.open}</p>
                  </div>
                  <div>
                    <p className="text-white text-[10px] sm:text-xs mb-0.5 sm:mb-1">Close</p>
                    <p className="text-amber-400 text-sm sm:text-lg font-bold">{market.close}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
