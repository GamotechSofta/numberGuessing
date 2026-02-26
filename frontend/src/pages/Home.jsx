import { useState, useEffect } from 'react'
import {
  HeroSection,
  DpbossIntroSection,
  TopMarketsSection,
  LuckyNumberSection,
  LiveResultsSection,
  GamingPlatformPromo,
  KeywordsSection,
  AllMarketsSection,
  HowToPlaySection,
  PopularMarketsSection,
  PlayingMatkaSection,
} from '../components/home'
import { STATIC_LIVE_RESULTS } from '../data/staticData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_URL = `${API_BASE_URL}/api/markets`
const LIVE_RESULTS_URL = `${API_BASE_URL}/api/live-results`

export default function Home() {
  const [markets, setMarkets] = useState([])
  const [allMarkets, setAllMarkets] = useState([])
  const [liveResults, setLiveResults] = useState(STATIC_LIVE_RESULTS)
  const [loading, setLoading] = useState(false)
  const [resultsLoading, setResultsLoading] = useState(false)

  useEffect(() => {
    fetchMarkets()
    fetchLiveResults()
  }, [])

  const fetchMarkets = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setMarkets(data.slice(0, 5))
        setAllMarkets(data)
      }
    } catch (_err) {
      // keep existing state (empty or previous fetch)
    }
  }

  const fetchLiveResults = async () => {
    try {
      const response = await fetch(LIVE_RESULTS_URL)
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) setLiveResults(data)
    } catch (_err) {
      // use static data already set
    }
  }

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <HeroSection />
      <DpbossIntroSection />
      <LuckyNumberSection />
      <TopMarketsSection markets={markets} loading={loading} />
      <LiveResultsSection liveResults={liveResults} loading={resultsLoading} />
      <GamingPlatformPromo />
      <KeywordsSection />
      <AllMarketsSection markets={allMarkets} loading={loading} />
      <HowToPlaySection />
      <PopularMarketsSection />
      <PlayingMatkaSection />
    </div>
  )
}
