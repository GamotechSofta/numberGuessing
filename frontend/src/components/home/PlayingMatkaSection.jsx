const TAGS = ['Kalyan Matka', 'Milan Day', 'Rajdhani Night', 'Satta Result']

export default function PlayingMatkaSection() {
  return (
    <section className="w-full py-6 px-4 border-t border-gold-600 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black rounded-lg p-4 border border-gold-600">
          <h2 className="text-gold-400 text-base font-semibold mb-3 text-center">
            PLAYING SATTA MATKA WITH DPBOSSKING
          </h2>
          <p className="text-neutral-300 leading-relaxed text-center text-sm mb-3">
            Dpbossking is a top-notch online Matka industry leader providing 
            fast and accurate results. We offer expert tips, live results, and a 
            comprehensive Matka experience.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {TAGS.map((tag) => (
              <span key={tag} className="bg-gold-600/20 border border-gold-600 px-3 py-1 rounded text-xs text-gold-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
