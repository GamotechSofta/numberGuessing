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
          <div className="py-8 text-center text-amber-100/80 text-sm">Loading markets...</div>
        ) : !markets || markets.length === 0 ? (
          <div className="py-8 text-center text-amber-100/80 text-sm">No markets available</div>
        ) : (
          <div className="divide-y divide-neutral-700">
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
                  <p className="text-neutral-200 uppercase text-sm font-medium tracking-wide mb-1">
                    {market.name}
                  </p>
                  <p className="text-amber-400 text-xl sm:text-2xl font-bold mb-1">
                    {market.open}-{market.close}
                  </p>
                  <p className="text-neutral-300 text-xs">
                    ({market.timing ?? ' - '})
                  </p>
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
