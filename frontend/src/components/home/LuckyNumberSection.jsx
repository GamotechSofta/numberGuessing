export default function LuckyNumberSection() {
  return (
    <section className="w-full py-6 px-3 sm:px-4 md:px-6 bg-black border-t border-b border-amber-700/80">
      <div className="w-full overflow-hidden bg-black border-2 border-gold-500 rounded-none">
        {/* Header: gold gradient - lighter middle, darker edges */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 py-3 px-0">
          <h2 className="text-center text-amber-900 font-semibold text-base sm:text-lg">
            Today Lucky Number
          </h2>
        </div>
        {/* Separator */}
        <div className="h-px bg-amber-100/60" />
        {/* Content: two columns, subtle white vertical line */}
        <div className="grid grid-cols-2 divide-x divide-white/30">
          <div className="bg-black py-4 px-0 text-center">
            <h3 className="text-white text-sm font-medium mb-2">Golden Ank</h3>
            <p className="text-green-400 text-xl sm:text-2xl font-bold">1-4-6-9</p>
          </div>
          <div className="bg-black py-4 px-0 text-center">
            <h3 className="text-white text-sm font-medium mb-2">Motor Patti</h3>
            <p className="text-green-400 text-xl sm:text-2xl font-bold">12469</p>
          </div>
        </div>
      </div>
    </section>
  )
}
