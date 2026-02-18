export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white w-full">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-yellow-600">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-8 text-center">
            About Dpboss Online
          </h1>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border-2 border-yellow-600/50 shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Who We Are</h2>
            <p className="text-gray-300 leading-relaxed mb-4 text-lg">
              Dpbossonline.com is India's leading Satta Matka results website. We provide 
              fast and accurate results, expert tips, and comprehensive Matka information 
              to make your experience joyous and rewarding.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              Our platform offers live results, historical charts, expert tips, and all the 
              tools you need for a complete Matka experience.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border-2 border-yellow-600/50 shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Our Services</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3 text-lg">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Live Matka Results</span>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Expert Tips and Guessing</span>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Historical Charts</span>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Fast Result Updates</span>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Comprehensive Matka Information</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border-2 border-yellow-600/50 shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Contact</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              For any queries or support, please visit our website or contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
