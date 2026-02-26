export default function QuickStatsSection({ markets, liveResults }) {
  return (
    <section className="w-full py-6 px-4 border-t border-gold-600 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-gold-400 text-lg font-semibold mb-4 text-center">
          Today's Quick Stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-black rounded-lg p-4 border border-gold-600 text-center">
            <p className="text-neutral-400 text-xs mb-1">Total Markets</p>
            <p className="text-gold-400 text-xl font-bold">{markets.length > 0 ? markets.length : '--'}</p>
          </div>
          <div className="bg-black rounded-lg p-4 border border-gold-600 text-center">
            <p className="text-neutral-400 text-xs mb-1">Live Results</p>
            <p className="text-gold-400 text-xl font-bold">{liveResults.length > 0 ? liveResults.length : '--'}</p>
          </div>
          <div className="bg-black rounded-lg p-4 border border-gold-600 text-center">
            <p className="text-neutral-400 text-xs mb-1">Today's Date</p>
            <p className="text-gold-400 text-sm font-bold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
          </div>
          <div className="bg-black rounded-lg p-4 border border-gold-600 text-center">
            <p className="text-neutral-400 text-xs mb-1">Status</p>
            <p className="text-gold-400 text-sm font-bold">Active</p>
          </div>
        </div>
      </div>
    </section>
  )
}
