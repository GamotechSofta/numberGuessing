const FEATURES = [
  { icon: '⚡', title: 'Fast Results', desc: 'Get instant updates' },
  { icon: '🎯', title: 'Accurate Tips', desc: 'Expert predictions' },
  { icon: '📊', title: 'Live Charts', desc: 'Historical data' },
  { icon: '🔒', title: 'Secure Platform', desc: 'Trusted & reliable' },
]

export default function FeaturesSection() {
  return (
    <section className="w-full py-6 px-4 border-t border-gold-600 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-gold-400 text-lg font-semibold mb-4 text-center">
          Why Choose DpBoss King?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-black rounded-lg p-4 border border-gold-600 text-center">
              <div className="text-gold-400 text-2xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-medium mb-1 text-sm">{feature.title}</h3>
              <p className="text-neutral-400 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
