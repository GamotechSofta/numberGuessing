export default function HowToPlaySection() {
  const steps = [
    {
      title: 'Step 1: Choose Market',
      desc: 'Select from popular markets like Kalyan, Milan Day, Rajdhani, etc.',
    },
    {
      title: 'Step 2: Check Results',
      desc: 'View live results and historical charts to make informed decisions.',
    },
    {
      title: 'Step 3: Follow Tips',
      desc: 'Use expert tips and predictions to increase your winning chances.',
    },
    {
      title: 'Step 4: Place Bets',
      desc: 'Place your bets on selected numbers and wait for results.',
    },
  ]

  return (
    <section className="w-full py-6 px-4 border-t border-gold-600 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-gold-400 text-lg font-semibold mb-4 text-center">
          How to Play Satta Matka
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {steps.map((step) => (
            <div key={step.title} className="bg-black rounded-lg p-4 border border-gold-600">
              <h3 className="text-gold-400 font-medium mb-2 text-sm">{step.title}</h3>
              <p className="text-neutral-300 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
