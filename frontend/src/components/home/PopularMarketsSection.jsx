const POPULAR_MARKETS = ['Kalyan', 'Milan Day', 'Milan Night', 'Rajdhani Day', 'Rajdhani Night']

export default function PopularMarketsSection() {
  return (
    <section className="w-full py-6 px-4 border-t border-gold-600 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-gold-400 text-lg font-semibold mb-4 text-center">
          Popular Markets
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {POPULAR_MARKETS.map((market) => (
            <div key={market} className="bg-black rounded-lg p-3 border border-gold-600 text-center">
              <h3 className="text-gold-400 font-semibold text-xs sm:text-sm">{market}</h3>
              <p className="text-neutral-400 text-xs mt-1">View Results</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
