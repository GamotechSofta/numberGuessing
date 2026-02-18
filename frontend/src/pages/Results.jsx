export default function Results() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white w-full">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-8 text-center">
            Live Matka Results
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kalyan Matka */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-600/50 hover:border-yellow-500">
              <h2 className="text-xl font-bold text-yellow-400 mb-5 text-center">Kalyan Matka</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Open</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Close</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Milan Day */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-600/50 hover:border-yellow-500">
              <h2 className="text-xl font-bold text-yellow-400 mb-5 text-center">Milan Day</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Open</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Close</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Milan Night */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-600/50 hover:border-yellow-500">
              <h2 className="text-xl font-bold text-yellow-400 mb-5 text-center">Milan Night</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Open</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Close</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Rajdhani Day */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-600/50 hover:border-yellow-500">
              <h2 className="text-xl font-bold text-yellow-400 mb-5 text-center">Rajdhani Day</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Open</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Close</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Rajdhani Night */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-600/50 hover:border-yellow-500">
              <h2 className="text-xl font-bold text-yellow-400 mb-5 text-center">Rajdhani Night</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Open</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Close</p>
                  <p className="text-green-400 text-3xl font-bold">--</p>
                </div>
              </div>
            </div>

            {/* Bhootnath Night */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-yellow-600/50 hover:border-yellow-500">
              <h2 className="text-xl font-bold text-yellow-400 mb-5 text-center">Bhootnath Night</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Result</p>
                  <p className="text-green-400 text-3xl font-bold">390-2</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Time</p>
                  <p className="text-gray-300 text-base">7:00 PM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
