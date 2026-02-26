export default function ExpertTipsSection() {
  return (
    <section className="w-full py-6 px-4 border-t border-gold-600 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-gold-400 text-lg font-semibold mb-4 text-center">
          Expert Tips & Guessing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-black rounded-lg p-4 border border-gold-600">
            <h3 className="text-gold-400 font-medium mb-2 text-sm">Best Jodi</h3>
            <p className="text-gold-400 text-xl font-bold mb-2">45-67</p>
            <p className="text-neutral-400 text-xs">High probability today</p>
          </div>
          <div className="bg-black rounded-lg p-4 border border-gold-600">
            <h3 className="text-gold-400 font-medium mb-2 text-sm">Top Patti</h3>
            <p className="text-gold-400 text-xl font-bold mb-2">234</p>
            <p className="text-neutral-400 text-xs">Recommended for betting</p>
          </div>
          <div className="bg-black rounded-lg p-4 border border-gold-600">
            <h3 className="text-gold-400 font-medium mb-2 text-sm">Single Ank</h3>
            <p className="text-gold-400 text-xl font-bold mb-2">7</p>
            <p className="text-neutral-400 text-xs">Today's lucky number</p>
          </div>
        </div>
      </div>
    </section>
  )
}
