import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/markets'

export default function Markets() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', open: '', close: '' })

  useEffect(() => {
    fetchMarkets()
  }, [])

  const fetchMarkets = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setMarkets(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching markets:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      setFormData({ name: '', open: '', close: '' })
      setEditingId(null)
      fetchMarkets()
    } catch (error) {
      console.error('Error saving market:', error)
      alert('Error saving market. Please try again.')
    }
  }

  const handleEdit = (market) => {
    setFormData({ name: market.name, open: market.open, close: market.close })
    setEditingId(market._id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this market?')) return
    
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      fetchMarkets()
    } catch (error) {
      console.error('Error deleting market:', error)
      alert('Error deleting market. Please try again.')
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', open: '', close: '' })
    setEditingId(null)
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading markets...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Markets Management</h2>
        <p className="text-gray-400">Add, edit, or delete markets</p>
      </div>

      {/* Form */}
      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">
          {editingId ? 'Edit Market' : 'Add New Market'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Market Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
              placeholder="e.g., KALYAN"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Open</label>
              <input
                type="text"
                value={formData.open}
                onChange={(e) => setFormData({ ...formData, open: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                required
                placeholder="e.g., 2-5-8"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Close</label>
              <input
                type="text"
                value={formData.close}
                onChange={(e) => setFormData({ ...formData, close: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                required
                placeholder="e.g., 3-6-9"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500"
            >
              {editingId ? 'Update Market' : 'Add Market'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Markets List */}
      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Markets List ({markets.length})</h3>
        {markets.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No markets found. Add your first market above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markets.map((market) => (
              <div
                key={market._id}
                className="bg-gray-700 rounded-lg p-4 border border-yellow-500/30"
              >
                <h4 className="text-xl font-bold text-yellow-400 mb-3">{market.name}</h4>
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">Open: </span>
                    <span className="text-green-400 font-bold">{market.open}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Close: </span>
                    <span className="text-green-400 font-bold">{market.close}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(market)}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(market._id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 text-sm"
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
