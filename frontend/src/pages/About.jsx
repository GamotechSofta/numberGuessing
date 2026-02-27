export default function About() {
  return (
    <div className="min-h-screen bg-black text-white w-full">
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gold-400 mb-6 text-center">
            About Dpbossking
          </h1>
          
          <div className="bg-black rounded-lg p-4 sm:p-6 border border-gold-600 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gold-400 mb-3">Who We Are</h2>
            <p className="text-neutral-300 leading-relaxed mb-3 text-sm sm:text-base">
              dpbossking.com is India's leading Satta Matka results website. We provide 
              fast and accurate results, expert tips, and comprehensive Matka information 
              to make your experience joyous and rewarding.
            </p>
            <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
              Our platform offers live results, historical charts, expert tips, and all the 
              tools you need for a complete Matka experience.
            </p>
          </div>

          <div className="bg-black rounded-lg p-4 sm:p-6 border border-gold-600 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gold-400 mb-4">Our Services</h2>
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-center gap-3 text-sm sm:text-base">
                <span className="text-gold-400 text-base">✓</span>
                <span>Live Matka Results</span>
              </li>
              <li className="flex items-center gap-3 text-sm sm:text-base">
                <span className="text-gold-400 text-base">✓</span>
                <span>Expert Tips and Guessing</span>
              </li>
              <li className="flex items-center gap-3 text-sm sm:text-base">
                <span className="text-gold-400 text-base">✓</span>
                <span>Historical Charts</span>
              </li>
              <li className="flex items-center gap-3 text-sm sm:text-base">
                <span className="text-gold-400 text-base">✓</span>
                <span>Fast Result Updates</span>
              </li>
              <li className="flex items-center gap-3 text-sm sm:text-base">
                <span className="text-gold-400 text-base">✓</span>
                <span>Comprehensive Matka Information</span>
              </li>
            </ul>
          </div>

          <div className="bg-black rounded-lg p-4 sm:p-6 border border-gold-600">
            <h2 className="text-lg sm:text-xl font-semibold text-gold-400 mb-3">Contact</h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              For any queries or support, please visit our website or contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
