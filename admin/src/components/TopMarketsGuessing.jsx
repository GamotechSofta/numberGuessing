import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_URL = `${API_BASE_URL}/api/markets`

// Individual market card with guessing inputs
function MarketGuessingCard({ market, onToggle, onSaveGuessing }) {
  // Local state for guessing inputs per market card
  const [single, setSingle] = useState(market.guessingSingle || '')
  const [jodi, setJodi] = useState(market.guessingJodi || '')
  const [pana, setPana] = useState(market.guessingPana || '')
  const [saving, setSaving] = useState(false)
  // Track saved state - hide button after save, show when values change
  const [saved, setSaved] = useState(
    Boolean(market.guessingSingle || market.guessingJodi || market.guessingPana)
  )

  // Handle save guessing values
  const handleSave = async () => {
    setSaving(true)
    await onSaveGuessing(market._id, { guessingSingle: single, guessingJodi: jodi, guessingPana: pana })
    setSaving(false)
    setSaved(true) // Hide button after successful save
  }

  // Show button when user edits any field
  const handleChange = (setter) => (e) => {
    setter(e.target.value)
    setSaved(false) // Show button when value changes
  }

  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-green-500">
      {/* Header with market info and remove button */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">✅</span>
          <div>
            <h3 className="text-white font-semibold text-sm">{market.name}</h3>
            <p className="text-gray-400 text-xs">
              {market.openingTime || '—'} - {market.closingTime || '—'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggle(market)}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
        >
          Remove
        </button>
      </div>

      {/* Guessing input fields - space separated values */}
      <div className="space-y-2">
        <div>
          <label className="block text-gray-400 text-[10px] mb-0.5">Single Digit</label>
          <input
            type="text"
            value={single}
            onChange={handleChange(setSingle)}
            className="w-full px-2 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-amber-500 focus:outline-none text-xs"
            placeholder="1 2 3 4 5"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-[10px] mb-0.5">Jodi</label>
          <input
            type="text"
            value={jodi}
            onChange={handleChange(setJodi)}
            className="w-full px-2 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-amber-500 focus:outline-none text-xs"
            placeholder="12 34 56 78 90"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-[10px] mb-0.5">Pana</label>
          <input
            type="text"
            value={pana}
            onChange={handleChange(setPana)}
            className="w-full px-2 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-amber-500 focus:outline-none text-xs"
            placeholder="123 456 789"
          />
        </div>
        {/* Show Save button only when not saved or values changed */}
        {!saved && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded text-xs"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function TopMarketsGuessing() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarkets()
  }, [])

  // Fetch all markets and filter only regular type
  const fetchMarkets = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      // Filter markets where type is 'regular' (excludes starline and king)
      const regularMarkets = data.filter(m => (m.marketType || 'regular') === 'regular')
      setMarkets(regularMarkets)
    } catch (error) {
      console.error('Error fetching markets:', error)
    } finally {
      setLoading(false)
    }
  }

  // Toggle isTopMarket flag for a market
  const toggleTopMarket = async (market) => {
    try {
      const newValue = !market.isTopMarket
      const res = await fetch(`${API_URL}/${market._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTopMarket: newValue })
      })
      if (!res.ok) throw new Error('Update failed')
      // Update local state
      setMarkets(prev => prev.map(m => 
        m._id === market._id ? { ...m, isTopMarket: newValue } : m
      ))
    } catch (error) {
      console.error('Error updating market:', error)
      alert('Failed to update. Please try again.')
    }
  }

  // Save guessing values for a market
  const saveGuessing = async (marketId, guessingData) => {
    try {
      const res = await fetch(`${API_URL}/${marketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guessingData)
      })
      if (!res.ok) throw new Error('Save failed')
      // Update local state with new guessing values
      setMarkets(prev => prev.map(m => 
        m._id === marketId ? { ...m, ...guessingData } : m
      ))
      alert('Guessing values saved!')
    } catch (error) {
      console.error('Error saving guessing:', error)
      alert('Failed to save. Please try again.')
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>
  }

  // Separate selected and available markets
  const selectedMarkets = markets.filter(m => m.isTopMarket)
  const availableMarkets = markets.filter(m => !m.isTopMarket)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Top Markets Guessing</h2>
        <p className="text-gray-400 text-sm mt-1">Select Regular markets and enter guessing values</p>
      </div>

      {/* Two column layout: Selected (left) | Available (right) */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Selected markets with guessing inputs */}
        <div className="lg:w-2/3">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">Selected Markets ({selectedMarkets.length})</h3>
          {selectedMarkets.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No markets selected. Add markets from right.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedMarkets.map((market) => (
                <MarketGuessingCard
                  key={market._id}
                  market={market}
                  onToggle={toggleTopMarket}
                  onSaveGuessing={saveGuessing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Available markets */}
        <div className="lg:w-1/3">
          <h3 className="text-lg font-semibold text-white mb-3">Available Markets ({availableMarkets.length})</h3>
          {availableMarkets.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">All regular markets are selected.</p>
          ) : (
            <div className="space-y-1.5 max-h-[70vh] overflow-y-auto max-w-md ml-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent" style={{ scrollbarWidth: 'thin' }}>
              {availableMarkets.map((market) => (
                <div
                  key={market._id}
                  className="bg-gray-800 rounded px-3 py-2.5 border border-gray-700 hover:border-amber-500 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">📊</span>
                      <div>
                        <h3 className="text-white font-medium text-xs">{market.name}</h3>
                        <p className="text-gray-400 text-[10px]">
                          {market.openingTime || '—'} - {market.closingTime || '—'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTopMarket(market)}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
