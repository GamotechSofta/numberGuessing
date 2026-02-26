export default function Tips() {
  return (
    <div className="min-h-screen bg-black text-white w-full">
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gold-400 mb-6 text-center">
            Kalyan Matka Tips
          </h1>
          
          <div className="bg-black rounded-lg p-4 sm:p-6 border border-gold-600 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gold-400 mb-4">Today's Expert Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gold-600/10 rounded-lg p-4 border border-gold-600/50">
                <h3 className="text-gold-400 font-medium mb-2 text-sm sm:text-base">Golden Ank</h3>
                <p className="text-gold-400 text-2xl sm:text-3xl font-bold">1-4-6-9</p>
              </div>
              <div className="bg-gold-600/10 rounded-lg p-4 border border-gold-600/50">
                <h3 className="text-gold-400 font-medium mb-2 text-sm sm:text-base">Motor Patti</h3>
                <p className="text-gold-400 text-2xl sm:text-3xl font-bold">12469</p>
              </div>
              <div className="bg-gold-600/10 rounded-lg p-4 border border-gold-600/50">
                <h3 className="text-gold-400 font-medium mb-2 text-sm sm:text-base">Jodi</h3>
                <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-lg p-4 sm:p-6 border border-gold-600">
            <h2 className="text-lg sm:text-xl font-semibold text-gold-400 mb-4">Tips & Strategies</h2>
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-start gap-3">
                <span className="text-gold-400 text-base">•</span>
                <span className="text-sm sm:text-base">Always check the latest results before placing bets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-400 text-base">•</span>
                <span className="text-sm sm:text-base">Follow expert tips and analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-400 text-base">•</span>
                <span className="text-sm sm:text-base">Manage your budget wisely</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-400 text-base">•</span>
                <span className="text-sm sm:text-base">Stay updated with live results</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-400 text-base">•</span>
                <span className="text-sm sm:text-base">Use historical charts for better predictions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
