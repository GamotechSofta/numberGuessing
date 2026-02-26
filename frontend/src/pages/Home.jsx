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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_URL = `${API_BASE_URL}/api/markets`
const LIVE_RESULTS_URL = `${API_BASE_URL}/api/live-results`

export default function Home() {
  const [markets, setMarkets] = useState([])
  const [allMarkets, setAllMarkets] = useState([])
  const [liveResults, setLiveResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [resultsLoading, setResultsLoading] = useState(true)

  useEffect(() => {
    fetchMarkets()
    fetchLiveResults()
  }, [])

  const fetchMarkets = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setMarkets(data.slice(0, 5))
      setAllMarkets(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching markets:', error)
      setLoading(false)
    }
  }

  const fetchLiveResults = async () => {
    try {
      const response = await fetch(LIVE_RESULTS_URL)
      const data = await response.json()
      setLiveResults(data)
      setResultsLoading(false)
    } catch (error) {
      console.error('Error fetching live results:', error)
      setResultsLoading(false)
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
