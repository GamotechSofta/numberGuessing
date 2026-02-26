export default function Results() {
  return (
    <div className="min-h-screen bg-black text-white w-full">
      <div className="w-full py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gold-400 mb-6 text-center">
            Live Matka Results
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Kalyan Matka */}
            <div className="bg-black rounded-lg p-4 border border-gold-600">
              <h2 className="text-base sm:text-lg font-semibold text-gold-400 mb-4 text-center">Kalyan Matka</h2>
              <div className="space-y-3">
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Open</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Close</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Milan Day */}
            <div className="bg-black rounded-lg p-4 border border-gold-600">
              <h2 className="text-base sm:text-lg font-semibold text-gold-400 mb-4 text-center">Milan Day</h2>
              <div className="space-y-3">
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Open</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Close</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Milan Night */}
            <div className="bg-black rounded-lg p-4 border border-gold-600">
              <h2 className="text-base sm:text-lg font-semibold text-gold-400 mb-4 text-center">Milan Night</h2>
              <div className="space-y-3">
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Open</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Close</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Rajdhani Day */}
            <div className="bg-black rounded-lg p-4 border border-gold-600">
              <h2 className="text-base sm:text-lg font-semibold text-gold-400 mb-4 text-center">Rajdhani Day</h2>
              <div className="space-y-3">
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Open</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Close</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Rajdhani Night */}
            <div className="bg-black rounded-lg p-4 border border-gold-600">
              <h2 className="text-base sm:text-lg font-semibold text-gold-400 mb-4 text-center">Rajdhani Night</h2>
              <div className="space-y-3">
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Open</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Close</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Bhootnath Night */}
            <div className="bg-black rounded-lg p-4 border border-gold-600">
              <h2 className="text-base sm:text-lg font-semibold text-gold-400 mb-4 text-center">Bhootnath Night</h2>
              <div className="space-y-3">
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Result</p>
                  <p className="text-gold-400 text-2xl sm:text-3xl font-bold">390-2</p>
                </div>
                <div className="bg-gold-600/10 rounded-lg p-3 border border-gold-600/50">
                  <p className="text-white text-xs mb-1">Time</p>
                  <p className="text-neutral-300 text-sm sm:text-base">7:00 PM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
