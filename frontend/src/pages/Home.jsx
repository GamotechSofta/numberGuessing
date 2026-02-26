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
const LUCKY_NUMBER_URL = `${API_BASE_URL}/api/lucky-number`

export default function Home() {
  const [markets, setMarkets] = useState([])
  const [allMarkets, setAllMarkets] = useState([])
  const [loading, setLoading] = useState(false)
  const [luckyNumber, setLuckyNumber] = useState({ goldenAnk: '', motorPatti: '' })

  useEffect(() => {
    fetchMarkets()
    fetchLuckyNumber()
    const interval = setInterval(fetchLuckyNumber, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchLuckyNumber = async () => {
    try {
      const res = await fetch(LUCKY_NUMBER_URL)
      if (!res.ok) return
      const data = await res.json()
      const ga = (data.goldenAnk != null && String(data.goldenAnk).trim() !== '') ? String(data.goldenAnk).trim() : ''
      const mp = (data.motorPatti != null && String(data.motorPatti).trim() !== '') ? String(data.motorPatti).trim() : ''
      setLuckyNumber({ goldenAnk: ga, motorPatti: mp })
    } catch (_err) {
      // keep previous state if fetch fails
    }
  }

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

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <HeroSection />
      <DpbossIntroSection />
      <LuckyNumberSection goldenAnk={luckyNumber.goldenAnk} motorPatti={luckyNumber.motorPatti} />
      <TopMarketsSection markets={markets} loading={loading} />
      <LiveResultsSection markets={allMarkets} loading={loading} />
      <GamingPlatformPromo />
      <KeywordsSection />
      <AllMarketsSection markets={allMarkets} loading={loading} />
      <HowToPlaySection />
      <PopularMarketsSection />
      <PlayingMatkaSection />
    </div>
  )
}
