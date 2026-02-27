export default function LuckyNumberSection({ goldenAnk = '', motorPatti = '' }) {
  const ga = (goldenAnk && String(goldenAnk).trim()) || '—'
  const mp = (motorPatti && String(motorPatti).trim()) || '—'

  return (
    <section className="w-full pt-6 pb-2 px-3 sm:px-4 md:px-6 bg-black">
      <div className="w-full overflow-hidden bg-black border-2 border-gold-500 rounded-none">
        {/* Header: same bg as Download App button */}
        <div className="bg-gradient-to-b from-gold-600 via-gold-400 to-gold-600 border-b border-gold-500 py-3 px-0">
          <h2 className="text-center text-white font-semibold text-base sm:text-lg">
            Today Lucky Number
          </h2>
        </div>
        {/* Content: two columns, subtle white vertical line */}
        <div className="grid grid-cols-2 divide-x divide-white/30">
          <div className="bg-black py-4 px-0 text-center">
            <h3 className="text-white text-sm font-medium mb-2">Golden Ank</h3>
            <p className="text-green-400 text-xl sm:text-2xl font-bold">{ga}</p>
          </div>
          <div className="bg-black py-4 px-0 text-center">
            <h3 className="text-white text-sm font-medium mb-2">Motor Patti</h3>
            <p className="text-green-400 text-xl sm:text-2xl font-bold">{mp}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
