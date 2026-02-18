import { useState, useEffect } from 'react'

const CHART_DATA_URL = 'http://localhost:5000/api/chart-data'

export default function ChartData() {
  const [charts, setCharts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    dateRange: '',
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
    sun: ''
  })

  useEffect(() => {
    fetchCharts()
  }, [])

  const fetchCharts = async () => {
    try {
      const response = await fetch(CHART_DATA_URL)
      const data = await response.json()
      setCharts(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch(`${CHART_DATA_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch(CHART_DATA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      setFormData({
        dateRange: '',
        mon: '',
        tue: '',
        wed: '',
        thu: '',
        fri: '',
        sat: '',
        sun: ''
      })
      setEditingId(null)
      fetchCharts()
    } catch (error) {
      console.error('Error saving chart data:', error)
      alert('Error saving chart data. Please try again.')
    }
  }

  const handleEdit = (chart) => {
    setFormData({
      dateRange: chart.dateRange || '',
      mon: chart.mon || '',
      tue: chart.tue || '',
      wed: chart.wed || '',
      thu: chart.thu || '',
      fri: chart.fri || '',
      sat: chart.sat || '',
      sun: chart.sun || ''
    })
    setEditingId(chart._id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this chart data?')) return
    
    try {
      await fetch(`${CHART_DATA_URL}/${id}`, { method: 'DELETE' })
      fetchCharts()
    } catch (error) {
      console.error('Error deleting chart data:', error)
      alert('Error deleting chart data. Please try again.')
    }
  }

  const handleCancel = () => {
    setFormData({
      dateRange: '',
      mon: '',
      tue: '',
      wed: '',
      thu: '',
      fri: '',
      sat: '',
      sun: ''
    })
    setEditingId(null)
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading chart data...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Chart Data Management</h2>
        <p className="text-gray-400">Add, edit, or delete market analysis chart data</p>
      </div>

      {/* Form */}
      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">
          {editingId ? 'Edit Chart Data' : 'Add New Chart Data'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Date Range (use \n for new line)</label>
            <input
              type="text"
              value={formData.dateRange}
              onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
              placeholder="e.g., 28-09-2020\nto\n04-10-2020"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Monday</label>
              <input
                type="text"
                value={formData.mon}
                onChange={(e) => setFormData({ ...formData, mon: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="e.g., 2\n4\n5"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Tuesday</label>
              <input
                type="text"
                value={formData.tue}
                onChange={(e) => setFormData({ ...formData, tue: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="e.g., 14"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Wednesday</label>
              <input
                type="text"
                value={formData.wed}
                onChange={(e) => setFormData({ ...formData, wed: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="e.g., 1\n6\n7"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Thursday</label>
              <input
                type="text"
                value={formData.thu}
                onChange={(e) => setFormData({ ...formData, thu: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="e.g., 1\n5\n7"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Friday</label>
              <input
                type="text"
                value={formData.fri}
                onChange={(e) => setFormData({ ...formData, fri: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="e.g., 37"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Saturday</label>
              <input
                type="text"
                value={formData.sat}
                onChange={(e) => setFormData({ ...formData, sat: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="e.g., 1\n8\n8"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Sunday</label>
              <input
                type="text"
                value={formData.sun}
                onChange={(e) => setFormData({ ...formData, sun: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="e.g., 5\n9\n0"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500"
            >
              {editingId ? 'Update Chart' : 'Add Chart'}
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

      {/* Charts List */}
      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Chart Data List ({charts.length})</h3>
        {charts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No chart data found. Add your first chart above.</p>
        ) : (
          <div className="space-y-4">
            {charts.map((chart) => (
              <div
                key={chart._id}
                className="bg-gray-700 rounded-lg p-4 border border-yellow-500/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-yellow-400">
                    {chart.dateRange.split('\n').map((line, index) => (
                      <span key={index} className="block">{line}</span>
                    ))}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(chart)}
                      className="px-4 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(chart._id)}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Mon: </span>
                    <span className="text-green-400 font-bold">{chart.mon || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Tue: </span>
                    <span className="text-green-400 font-bold">{chart.tue || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Wed: </span>
                    <span className="text-green-400 font-bold">{chart.wed || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Thu: </span>
                    <span className="text-green-400 font-bold">{chart.thu || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Fri: </span>
                    <span className="text-green-400 font-bold">{chart.fri || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Sat: </span>
                    <span className="text-green-400 font-bold">{chart.sat || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Sun: </span>
                    <span className="text-green-400 font-bold">{chart.sun || '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
