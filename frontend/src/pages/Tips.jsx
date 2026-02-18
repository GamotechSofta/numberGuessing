export default function Tips() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white w-full">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-8 text-center">
            Kalyan Matka Tips
          </h1>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border-2 border-yellow-600/50 shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Today's Expert Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-yellow-500/30 hover:border-yellow-500">
                <h3 className="text-yellow-400 font-semibold mb-3 text-lg">Golden Ank</h3>
                <p className="text-green-400 text-3xl font-bold">1-4-6-9</p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-yellow-500/30 hover:border-yellow-500">
                <h3 className="text-yellow-400 font-semibold mb-3 text-lg">Motor Patti</h3>
                <p className="text-green-400 text-3xl font-bold">12469</p>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 border border-yellow-500/30 hover:border-yellow-500">
                <h3 className="text-yellow-400 font-semibold mb-3 text-lg">Jodi</h3>
                <p className="text-green-400 text-3xl font-bold">--</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border-2 border-yellow-600/50 shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Tips & Strategies</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">•</span>
                <span className="text-lg">Always check the latest results before placing bets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">•</span>
                <span className="text-lg">Follow expert tips and analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">•</span>
                <span className="text-lg">Manage your budget wisely</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">•</span>
                <span className="text-lg">Stay updated with live results</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">•</span>
                <span className="text-lg">Use historical charts for better predictions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
