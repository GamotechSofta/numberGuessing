import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const DAILY_RESULTS_URL = `${API_BASE_URL}/api/daily-results`
const MARKETS_URL = `${API_BASE_URL}/api/markets`

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

  useEffect(() => {
    fetchDailyResults()
    fetchMarkets()
    // Set default date to today
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
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
    } catch (error) {
      console.error('Error deleting daily result:', error)
      alert('Error deleting daily result. Please try again.')
    }
  }

  const handleCancel = () => {
    setFormData({ date: selectedDate || '', marketName: '', open: '', close: '', result: '' })
    setEditingId(null)
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

      {/* Date Filter */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <label className="block text-gray-300 mb-2 text-sm sm:text-base">Filter by Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value)
            setFormData(prev => ({ ...prev, date: e.target.value }))
          }}
          className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
        />
      </div>

      {/* Form */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">
          {editingId ? 'Edit Daily Result' : 'Add New Daily Result'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Market Name</label>
              <select
                value={formData.marketName}
                onChange={(e) => setFormData({ ...formData, marketName: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                required
              >
                <option value="">Select Market</option>
                {markets.map((market) => (
                  <option key={market._id} value={market.name}>
                    {market.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Open</label>
              <input
                type="text"
                value={formData.open}
                onChange={(e) => setFormData({ ...formData, open: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                required
                placeholder="e.g., 380"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Result</label>
              <input
                type="text"
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                placeholder="e.g., 19"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Close</label>
              <input
                type="text"
                value={formData.close}
                onChange={(e) => setFormData({ ...formData, close: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                required
                placeholder="e.g., 180"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 text-sm sm:text-base"
            >
              {editingId ? 'Update Result' : 'Add Result'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 sm:px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-500 text-sm sm:text-base"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daily Results List */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">
          Daily Results List ({dailyResults.length})
        </h3>
        {dailyResults.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No daily results found for the selected date. Add your first result above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-600">
                  <th className="border border-yellow-600/50 px-3 sm:px-4 py-2 text-black font-bold text-left text-xs sm:text-sm">Date</th>
                  <th className="border border-yellow-600/50 px-3 sm:px-4 py-2 text-black font-bold text-xs sm:text-sm">Market</th>
                  <th className="border border-yellow-600/50 px-3 sm:px-4 py-2 text-black font-bold text-xs sm:text-sm">Open</th>
                  <th className="border border-yellow-600/50 px-3 sm:px-4 py-2 text-black font-bold text-xs sm:text-sm">Result</th>
                  <th className="border border-yellow-600/50 px-3 sm:px-4 py-2 text-black font-bold text-xs sm:text-sm">Close</th>
                  <th className="border border-yellow-600/50 px-3 sm:px-4 py-2 text-black font-bold text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dailyResults.map((result) => {
                  const dateStr = new Date(result.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                  return (
                    <tr key={result._id} className="bg-gray-700 hover:bg-gray-600 transition-colors">
                      <td className="border border-gray-600 px-3 sm:px-4 py-2 text-white text-xs sm:text-sm">{dateStr}</td>
                      <td className="border border-gray-600 px-3 sm:px-4 py-2 text-yellow-400 font-semibold text-xs sm:text-sm">{result.marketName}</td>
                      <td className="border border-gray-600 px-3 sm:px-4 py-2 text-green-400 font-bold text-xs sm:text-sm">{result.open}</td>
                      <td className="border border-gray-600 px-3 sm:px-4 py-2 text-green-400 font-bold text-xs sm:text-sm">{result.result || '-'}</td>
                      <td className="border border-gray-600 px-3 sm:px-4 py-2 text-green-400 font-bold text-xs sm:text-sm">{result.close}</td>
                      <td className="border border-gray-600 px-3 sm:px-4 py-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleEdit(result)}
                            className="px-2 sm:px-3 py-1 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 text-xs sm:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(result._id)}
                            className="px-2 sm:px-3 py-1 bg-red-600 text-white font-semibold rounded hover:bg-red-500 text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
