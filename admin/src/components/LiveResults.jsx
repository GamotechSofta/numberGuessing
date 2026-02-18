import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const LIVE_RESULTS_URL = `${API_BASE_URL}/api/live-results`

export default function LiveResults() {
  const [liveResults, setLiveResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingResultId, setEditingResultId] = useState(null)
  const [resultFormData, setResultFormData] = useState({ name: '', result: '', timeRange: '' })

  useEffect(() => {
    fetchLiveResults()
  }, [])

  const fetchLiveResults = async () => {
    try {
      const response = await fetch(LIVE_RESULTS_URL)
      const data = await response.json()
      setLiveResults(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching live results:', error)
      setLoading(false)
    }
  }

  const handleResultSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingResultId) {
        await fetch(`${LIVE_RESULTS_URL}/${editingResultId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resultFormData)
        })
      } else {
        await fetch(LIVE_RESULTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resultFormData)
        })
      }
      setResultFormData({ name: '', result: '', timeRange: '' })
      setEditingResultId(null)
      fetchLiveResults()
    } catch (error) {
      console.error('Error saving live result:', error)
      alert('Error saving live result. Please try again.')
    }
  }

  const handleResultEdit = (result) => {
    setResultFormData({ name: result.name, result: result.result, timeRange: result.timeRange })
    setEditingResultId(result._id)
  }

  const handleResultDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this live result?')) return
    
    try {
      await fetch(`${LIVE_RESULTS_URL}/${id}`, { method: 'DELETE' })
      fetchLiveResults()
    } catch (error) {
      console.error('Error deleting live result:', error)
      alert('Error deleting live result. Please try again.')
    }
  }

  const handleResultCancel = () => {
    setResultFormData({ name: '', result: '', timeRange: '' })
    setEditingResultId(null)
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading live results...</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Live Results Management</h2>
        <p className="text-gray-400 text-sm sm:text-base">Manage live result updates</p>
      </div>

      {/* Live Results Form */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">
          {editingResultId ? 'Edit Live Result' : 'Add New Live Result'}
        </h3>
        <form onSubmit={handleResultSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm sm:text-base">Result Name</label>
            <input
              type="text"
              value={resultFormData.name}
              onChange={(e) => setResultFormData({ ...resultFormData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
              required
              placeholder="e.g., BHOOTNATH NIGHT"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Result</label>
              <input
                type="text"
                value={resultFormData.result}
                onChange={(e) => setResultFormData({ ...resultFormData, result: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                placeholder="e.g., 390-2 or Loading..."
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">Time Range</label>
              <input
                type="text"
                value={resultFormData.timeRange}
                onChange={(e) => setResultFormData({ ...resultFormData, timeRange: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                required
                placeholder="e.g., (7:00 PM - 10:00 PM)"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 text-sm sm:text-base"
            >
              {editingResultId ? 'Update Result' : 'Add Result'}
            </button>
            {editingResultId && (
              <button
                type="button"
                onClick={handleResultCancel}
                className="px-4 sm:px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-500 text-sm sm:text-base"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Live Results List */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">Live Results List ({liveResults.length})</h3>
        {liveResults.length === 0 ? (
          <p className="text-gray-400 text-center py-8 text-sm sm:text-base">No live results found. Add your first live result above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {liveResults.map((result) => (
              <div
                key={result._id}
                className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-yellow-500/30"
              >
                <h4 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3">{result.name}</h4>
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-gray-400 text-xs sm:text-sm">Result: </span>
                    <span className="text-green-400 font-bold text-sm sm:text-base">{result.result}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs sm:text-sm">Time: </span>
                    <span className="text-gray-300 text-sm sm:text-base">{result.timeRange}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResultEdit(result)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleResultDelete(result._id)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
