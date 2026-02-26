export default function HeroSection() {
  return (
    <section className="w-full py-3 px-3 sm:px-4 md:px-6 bg-black">
      <style>{`
        @keyframes hero-scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .hero-scroll-wrap {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .hero-scroll-text {
          display: inline-block;
          padding-left: 100%;
          animation: hero-scroll 28s linear infinite;
        }
        .hero-scroll-text span { padding-right: 2rem; }
      `}</style>
      <div className="w-full border-2 border-gold-500 rounded-none py-4 sm:py-5 px-4 sm:px-6 relative overflow-hidden">
        {/* Top: Logo */}
        <div className="text-center mb-2">
          <img
            src="https://res.cloudinary.com/dnyp5jknp/image/upload/v1771571553/Brown_Mascot_Lion_Free_Logo_sfqwsj.png"
            alt="DPBoss Logo"
            className="mx-auto h-12 w-auto sm:h-16 object-contain"
          />
        </div>

        {/* Play & Win */}
        <h1 className="text-gold-400 text-lg sm:text-xl font-bold text-center mb-2">
          Play & Win
        </h1>

        {/* Tagline message */}
        <div className="text-gold-400 text-center leading-snug mb-3 space-y-1">
          <p className="text-sm sm:text-base md:text-lg">अब Guessing का असली मज़ा मोबाइल पर! घर बैठे खेलो, रोज़ जीतने का मौका पाओ</p>
          <p className="text-sm sm:text-base md:text-lg">अपनी स्किल दिखाओ और बनो Guessing स्टार</p>
        </div>

        {/* Download App button */}
        <div className="flex justify-center mb-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-gradient-to-b from-gold-600 via-gold-400 to-gold-600 hover:from-gold-500 hover:via-gold-300 hover:to-gold-500 text-white font-bold py-2 px-5 rounded-lg border border-gold-500 transition-all shadow-md text-sm sm:text-base"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download App</span>
          </button>
        </div>

        {/* Scrolling: Welcome DPboss King */}
        <div className="hero-scroll-wrap">
          <div className="hero-scroll-text text-gold-400 font-semibold text-sm sm:text-base inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-gold-300" aria-hidden="true">👑</span>
              Welcome DPboss King
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-gold-300" aria-hidden="true">👑</span>
              Welcome DPboss King
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-gold-300" aria-hidden="true">👑</span>
              Welcome DPboss King
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-gold-300" aria-hidden="true">👑</span>
              Welcome DPboss King
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-gold-300" aria-hidden="true">👑</span>
              Welcome DPboss King
            </span>
          </div>
        </div>

        {/* Decorative: Om icon bottom-left */}
        <div className="absolute bottom-2 left-2 w-12 h-12 rounded border-2 border-gold-500 bg-gold-600 flex items-center justify-center text-gold-300 text-xl" aria-hidden="true">
          ॐ
        </div>
      </div>
    </section>
  )
}
