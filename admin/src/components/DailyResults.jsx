import { useState, useEffect } from 'react'
import { getMarketResultDisplay } from '../utils/marketResult'
import MarketChartModal from './MarketChartModal'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const DAILY_RESULTS_URL = `${API_BASE_URL}/api/daily-results`
const MARKETS_URL = `${API_BASE_URL}/api/markets`

// Helper to get today's date in IST (YYYY-MM-DD format)
// Fixes timezone issue: ensures correct date after midnight IST
function getTodayIST() {
  const now = new Date()
  // IST offset is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000
  const istDate = new Date(now.getTime() + istOffset)
  return istDate.toISOString().split('T')[0]
}

export default function DailyResults() {
  const [dailyResults, setDailyResults] = useState([])
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ 
    date: '', 
    marketName: '', 
    open: '', 
    close: '',
    result: ''
  })
  const [selectedDate, setSelectedDate] = useState('')
  
  // Add Result modal state (same as Markets Management)
  const [addResultMarket, setAddResultMarket] = useState(null)
  const [addResultStep, setAddResultStep] = useState('open')
  const [openPatti, setOpenPatti] = useState('')
  const [closePatti, setClosePatti] = useState('')
  const [declaredOpenValue, setDeclaredOpenValue] = useState('')
  
  // Chart modal state - uses reusable MarketChartModal component
  const [chartMarket, setChartMarket] = useState(null)
  // Refresh trigger - increment to force chart data refetch after result changes
  const [chartRefreshTrigger, setChartRefreshTrigger] = useState(0)
  
  // Edit Result modal state
  const [editResultMarket, setEditResultMarket] = useState(null)
  const [editOpenPatti, setEditOpenPatti] = useState('')
  const [editClosePatti, setEditClosePatti] = useState('')

  useEffect(() => {
    fetchDailyResults()
    fetchMarkets()
    // Set default date to today (IST)
    const todayStr = getTodayIST()
    setSelectedDate(todayStr)
    setFormData(prev => ({ ...prev, date: todayStr }))
  }, [])

  const fetchMarkets = async () => {
    try {
      const response = await fetch(MARKETS_URL)
      const data = await response.json()
      setMarkets(data)
    } catch (error) {
      console.error('Error fetching markets:', error)
    }
  }

  const fetchDailyResults = async () => {
    try {
      const url = selectedDate 
        ? `${DAILY_RESULTS_URL}?date=${selectedDate}`
        : DAILY_RESULTS_URL
      const response = await fetch(url)
      const data = await response.json()
      setDailyResults(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching daily results:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchDailyResults()
    }
  }, [selectedDate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch(`${DAILY_RESULTS_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch(DAILY_RESULTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      setFormData({ date: selectedDate || '', marketName: '', open: '', close: '', result: '' })
      setEditingId(null)
      fetchDailyResults()
      // Trigger chart refresh after successful result add/update
      setChartRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error saving daily result:', error)
      alert('Error saving daily result. Please try again.')
    }
  }

  const handleEdit = (result) => {
    const dateStr = new Date(result.date).toISOString().split('T')[0]
    setFormData({ 
      date: dateStr, 
      marketName: result.marketName, 
      open: result.open, 
      close: result.close,
      result: result.result || ''
    })
    setEditingId(result._id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this daily result?')) return

    try {
      await fetch(`${DAILY_RESULTS_URL}/${id}`, { method: 'DELETE' })
      fetchDailyResults()
      // Trigger chart refresh after successful result delete
      setChartRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error deleting daily result:', error)
      alert('Error deleting daily result. Please try again.')
    }
  }

  const handleCancel = () => {
    setFormData({ date: selectedDate || '', marketName: '', open: '', close: '', result: '' })
    setEditingId(null)
  }

  // Add Result modal handlers (same as Markets Management)
  const openAddResultModal = (market) => {
    setAddResultMarket(market)
    const openDeclared = market.open && String(market.open).trim() !== '' && String(market.open).trim() !== '***'
    setAddResultStep(openDeclared ? 'close' : 'open')
    setOpenPatti('')
    setClosePatti('')
    setDeclaredOpenValue(openDeclared ? String(market.open).trim() : '')
  }

  const closeAddResultModal = () => {
    setAddResultMarket(null)
    setAddResultStep('open')
    setOpenPatti('')
    setClosePatti('')
    setDeclaredOpenValue('')
  }

  const handleDeclareOpen = async () => {
    if (!addResultMarket) return
    const value = openPatti.replace(/\D/g, '').slice(0, 3)
    if (value.length !== 3) {
      alert('Please enter 3 digits for Open Patti.')
      return
    }
    try {
      // Update market with open result
      await fetch(`${MARKETS_URL}/${addResultMarket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addResultMarket.name,
          open: value,
          close: addResultMarket.close && addResultMarket.close !== '***' ? addResultMarket.close : '***'
        })
      })
      
      // Also save to daily-results for chart history (with open only, close pending)
      const today = getTodayIST()
      const openDigits = String(value).replace(/\D/g, '')
      const openAnk = openDigits.split('').reduce((sum, d) => sum + parseInt(d, 10), 0) % 10
      
      await fetch(DAILY_RESULTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          marketName: addResultMarket.name,
          open: value,
          close: '',
          result: `${openAnk}*`
        })
      })
      
      closeAddResultModal()
      fetchMarkets()
      fetchDailyResults()
      // Trigger chart refresh after result change
      setChartRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error(err)
      alert('Error declaring open result.')
    }
  }

  const handleDeclareClose = async () => {
    if (!addResultMarket) return
    const value = closePatti.replace(/\D/g, '').slice(0, 3)
    if (value.length !== 3) {
      alert('Please enter 3 digits for Close Patti.')
      return
    }
    try {
      const openValue = declaredOpenValue || addResultMarket.open
      
      // Update market with close result
      await fetch(`${MARKETS_URL}/${addResultMarket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addResultMarket.name,
          open: openValue,
          close: value
        })
      })
      
      // Update daily-results for chart history
      const today = getTodayIST()
      const openDigits = String(openValue).replace(/\D/g, '')
      const closeDigits = String(value).replace(/\D/g, '')
      const openAnk = openDigits.split('').reduce((sum, d) => sum + parseInt(d, 10), 0) % 10
      const closeAnk = closeDigits.split('').reduce((sum, d) => sum + parseInt(d, 10), 0) % 10
      const jodi = `${openAnk}${closeAnk}`
      
      // First, find existing entry for today's date and market
      const existingRes = await fetch(`${DAILY_RESULTS_URL}?marketName=${encodeURIComponent(addResultMarket.name)}&date=${today}`)
      const existingData = await existingRes.json()
      const todayEntry = Array.isArray(existingData) ? existingData.find(r => r.date && r.date.startsWith(today)) : null
      
      if (todayEntry && todayEntry._id) {
        // Update existing entry with close result
        await fetch(`${DAILY_RESULTS_URL}/${todayEntry._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            marketName: addResultMarket.name,
            open: openValue,
            close: value,
            result: jodi
          })
        })
      } else {
        // Create new entry if none exists
        await fetch(DAILY_RESULTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            marketName: addResultMarket.name,
            open: openValue,
            close: value,
            result: jodi
          })
        })
      }
      
      closeAddResultModal()
      fetchMarkets()
      fetchDailyResults()
      // Trigger chart refresh after result change
      setChartRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error(err)
      alert('Error declaring close result.')
    }
  }

  const handleClearResult = async () => {
    if (!addResultMarket) return
    if (!confirm('Clear open and close result for this market?')) return
    try {
      await fetch(`${MARKETS_URL}/${addResultMarket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addResultMarket.name,
          open: '***',
          close: '***'
        })
      })
      closeAddResultModal()
      fetchMarkets()
      // Trigger chart refresh after result cleared
      setChartRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error(err)
      alert('Error clearing result.')
    }
  }

  // Chart modal handlers - open/close MarketChartModal
  const openChartModal = (market) => setChartMarket(market)
  const closeChartModal = () => setChartMarket(null)

  // Edit Result modal handlers
  const openEditResultModal = (market) => {
    setEditResultMarket(market)
    // Pre-fill with current values (extract digits only)
    const currentOpen = market.open && market.open !== '***' ? String(market.open).replace(/\D/g, '') : ''
    const currentClose = market.close && market.close !== '***' ? String(market.close).replace(/\D/g, '') : ''
    setEditOpenPatti(currentOpen)
    setEditClosePatti(currentClose)
  }

  const closeEditResultModal = () => {
    setEditResultMarket(null)
    setEditOpenPatti('')
    setEditClosePatti('')
  }

  const handleSaveEditResult = async () => {
    if (!editResultMarket) return
    
    const openValue = editOpenPatti.replace(/\D/g, '').slice(0, 3)
    const closeValue = editClosePatti.replace(/\D/g, '').slice(0, 3)
    
    // At least open should be provided
    if (!openValue) {
      alert('Please enter at least Open Patti (3 digits).')
      return
    }
    
    try {
      // Update market with edited results
      await fetch(`${MARKETS_URL}/${editResultMarket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editResultMarket.name,
          open: openValue || '***',
          close: closeValue || '***'
        })
      })
      
      // Update daily-results for chart history
      const today = getTodayIST()
      const openDigits = openValue || ''
      const closeDigits = closeValue || ''
      
      let resultJodi = ''
      if (openDigits.length === 3) {
        const openAnk = openDigits.split('').reduce((sum, d) => sum + parseInt(d, 10), 0) % 10
        if (closeDigits.length === 3) {
          const closeAnk = closeDigits.split('').reduce((sum, d) => sum + parseInt(d, 10), 0) % 10
          resultJodi = `${openAnk}${closeAnk}`
        } else {
          resultJodi = `${openAnk}*`
        }
      }
      
      // Find ALL entries for this market and update the most recent one
      const allEntriesRes = await fetch(`${DAILY_RESULTS_URL}?marketName=${encodeURIComponent(editResultMarket.name)}`)
      const allEntries = await allEntriesRes.json()
      
      // Sort by date descending and get the most recent entry
      const sortedEntries = Array.isArray(allEntries) ? allEntries.sort((a, b) => new Date(b.date) - new Date(a.date)) : []
      const mostRecentEntry = sortedEntries.length > 0 ? sortedEntries[0] : null
      
      // Also check if there's a today entry specifically
      const todayEntry = sortedEntries.find(r => r.date && r.date.startsWith(today))
      
      if (todayEntry && todayEntry._id) {
        // Update today's entry
        await fetch(`${DAILY_RESULTS_URL}/${todayEntry._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            marketName: editResultMarket.name,
            open: openValue || '',
            close: closeValue || '',
            result: resultJodi
          })
        })
      } else if (mostRecentEntry && mostRecentEntry._id) {
        // Update the most recent entry (keep its original date)
        await fetch(`${DAILY_RESULTS_URL}/${mostRecentEntry._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: mostRecentEntry.date,
            marketName: editResultMarket.name,
            open: openValue || '',
            close: closeValue || '',
            result: resultJodi
          })
        })
      } else if (openValue) {
        // No existing entry, create new one for today
        await fetch(DAILY_RESULTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            marketName: editResultMarket.name,
            open: openValue,
            close: closeValue || '',
            result: resultJodi
          })
        })
      }
      
      closeEditResultModal()
      fetchMarkets()
      fetchDailyResults()
      setChartRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error(err)
      alert('Error saving edited result.')
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading daily results...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Daily Results Management</h2>
        <p className="text-gray-400 text-sm sm:text-base">Add, edit, or delete opening and closing results for specific dates</p>
      </div>

      {/* Add Result Modal (same UI as Markets Management) */}
      {addResultMarket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeAddResultModal}>
          <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-xl border border-gray-600" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h3 className="text-lg font-bold text-white capitalize">
                {addResultMarket.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </h3>
              <button
                type="button"
                onClick={closeAddResultModal}
                className="text-gray-400 hover:text-white p-1 rounded"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-400 text-sm">
                ID: {addResultMarket._id}
              </p>

              {addResultStep === 'open' && (
                <>
                  <div>
                    <h4 className="text-white font-semibold mb-2">OPEN RESULT</h4>
                    <p className="text-gray-400 text-sm mb-3">Enter 3 digits → Declare Open</p>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Open Patti (3 digits)</label>
                    <input
                      type="text"
                      value={openPatti}
                      onChange={(e) => setOpenPatti(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. 156"
                      maxLength={3}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleDeclareOpen}
                      className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600"
                    >
                      Declare Open
                    </button>
                    <button
                      type="button"
                      onClick={closeAddResultModal}
                      className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}

              {addResultStep === 'close' && (
                <>
                  <div>
                    <h4 className="text-white font-semibold mb-2">CLOSE RESULT</h4>
                    <p className="text-gray-400 text-sm mb-3">Enter 3 digits → Declare Close</p>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Close Patti (3 digits)</label>
                    <input
                      type="text"
                      value={closePatti}
                      onChange={(e) => setClosePatti(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. 456"
                      maxLength={3}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleDeclareClose}
                      className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600"
                    >
                      Declare Close
                    </button>
                    <button
                      type="button"
                      onClick={handleClearResult}
                      className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500"
                    >
                      Clear Result
                    </button>
                    <button
                      type="button"
                      onClick={closeAddResultModal}
                      className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Market Cards Section - same UI as Markets Management */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">
          Markets ({markets.length})
        </h3>
        {markets.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No markets available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {markets.map((market) => (
              <div
                key={market._id}
                className="bg-slate-700/80 rounded-xl p-4 sm:p-5 border border-slate-600 relative"
              >
                {/* Result display - same format as Markets Management */}
                <p className="absolute top-3 right-3 font-mono text-amber-400 text-sm sm:text-base">
                  {getMarketResultDisplay(market)}
                </p>

                {/* Status pill */}
                <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold uppercase mb-3">
                  Closed
                </span>

                {/* Market name */}
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2 capitalize pr-24">
                  {market.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                </h4>

                {/* Opening / Closing times */}
                <div className="space-y-1 text-gray-300 text-sm mb-4">
                  <p>Opening: {(market.openingTime ?? market.opening_time ?? '').trim() || <span className="text-amber-400/80">—</span>}</p>
                  <p>Closing: {(market.closingTime ?? market.closing_time ?? '').trim() || <span className="text-amber-400/80">—</span>}</p>
                </div>

                {/* Add Result, Edit Result and Chart buttons */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => openAddResultModal(market)}
                    className="flex-1 min-w-0 px-2 py-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded text-xs"
                  >
                    Add Result
                  </button>
                  {/* Edit Result button */}
                  <button
                    type="button"
                    onClick={() => openEditResultModal(market)}
                    className="flex-1 min-w-0 px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded text-xs"
                  >
                    Edit Result
                  </button>
                  {/* Chart button - shows past results history */}
                  <button
                    type="button"
                    onClick={() => openChartModal(market)}
                    className="flex-1 min-w-0 px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xs"
                  >
                    View Chart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Modal - uses reusable MarketChartModal component (same UI as ChartManagement) */}
      {chartMarket && (
        <MarketChartModal 
          market={chartMarket} 
          onClose={closeChartModal} 
          refreshTrigger={chartRefreshTrigger}
        />
      )}

      {/* Edit Result Modal */}
      {editResultMarket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeEditResultModal}>
          <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-xl border border-gray-600" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h3 className="text-lg font-bold text-white capitalize">
                Edit Result - {editResultMarket.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </h3>
              <button
                type="button"
                onClick={closeEditResultModal}
                className="text-gray-400 hover:text-white p-1 rounded"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Open Patti (3 digits)</label>
                <input
                  type="text"
                  value={editOpenPatti}
                  onChange={(e) => setEditOpenPatti(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. 123"
                  maxLength={3}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Close Patti (3 digits)</label>
                <input
                  type="text"
                  value={editClosePatti}
                  onChange={(e) => setEditClosePatti(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. 456"
                  maxLength={3}
                />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEditResult}
                  className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeEditResultModal}
                  className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
