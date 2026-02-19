import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const DAILY_RESULTS_URL = `${API_BASE_URL}/api/daily-results`

export default function ChartManagement() {
  const [charts, setCharts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingCell, setEditingCell] = useState(null) // { weekKey, day, result }
  const [showAddModal, setShowAddModal] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    date: '',
    marketName: 'KALYAN',
    open: '',
    close: '',
    result: ''
  })

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      setLoading(true)
      const response = await fetch(DAILY_RESULTS_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const dbResults = await response.json()
      
      // Transform database data into table format grouped by week
      const weekMap = {}
      
      dbResults.forEach(result => {
        const resultDate = new Date(result.date)
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][resultDate.getDay()]
        
        // Find the week this date belongs to (Monday to Sunday)
        const monday = new Date(resultDate)
        const day = resultDate.getDay()
        const diff = resultDate.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
        monday.setDate(diff)
        monday.setHours(0, 0, 0, 0)
        
        const sunday = new Date(monday)
        sunday.setDate(sunday.getDate() + 6)
        
        const formatDate = (date) => {
          const dd = String(date.getDate()).padStart(2, '0')
          const mm = String(date.getMonth() + 1).padStart(2, '0')
          const yyyy = date.getFullYear()
          return `${dd}-${mm}-${yyyy}`
        }
        
        const weekKey = `${formatDate(monday)}to${formatDate(sunday)}`
        
        if (!weekMap[weekKey]) {
          weekMap[weekKey] = {
            week: weekKey,
            Mon: null,
            Tue: null,
            Wed: null,
            Thu: null,
            Fri: null,
            Sat: null,
            Sun: null
          }
        }
        
        // Store the day data with ID for editing/deleting
        weekMap[weekKey][dayOfWeek] = {
          _id: result._id,
          open: result.open,
          close: result.close,
          result: result.result || '',
          date: result.date,
          marketName: result.marketName
        }
      })
      
      // Convert to array and sort by date
      const charts = Object.values(weekMap).sort((a, b) => {
        const parseWeekDate = (weekStr) => {
          const startDateStr = weekStr.split('to')[0]
          const [day, month, year] = startDateStr.split('-').map(Number)
          return new Date(year, month - 1, day)
        }
        
        const dateA = parseWeekDate(a.week)
        const dateB = parseWeekDate(b.week)
        
        return dateB - dateA // Newest first
      })
      
      setCharts(charts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setMessage({ type: 'error', text: 'Failed to load chart data. Please refresh the page.' })
      setLoading(false)
    }
  }

  const formatWeekDate = (weekStr) => {
    return weekStr.replace(/(\d{2})-(\d{2})-(\d{4})to(\d{2})-(\d{2})-(\d{4})/, '$1/$2/$3 to $4/$5/$6')
  }

  const handleCellClick = (weekKey, day, dayData) => {
    if (dayData) {
      setEditingCell({ weekKey, day, result: dayData })
      const dateStr = new Date(dayData.date).toISOString().split('T')[0]
      setFormData({
        date: dateStr,
        marketName: 'KALYAN',
        open: dayData.open,
        close: dayData.close,
        result: dayData.result || ''
      })
      setShowAddModal(true)
    } else {
      // Empty cell - add new entry
      // Calculate date for this day in this week
      const [startDateStr] = weekKey.split('to')
      const [dayNum, monthNum, yearNum] = startDateStr.split('-').map(Number)
      const monday = new Date(yearNum, monthNum - 1, dayNum)
      const dayMap = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 }
      const offset = dayMap[day] || 0
      const targetDate = new Date(monday)
      targetDate.setDate(targetDate.getDate() + offset)
      
      setEditingCell({ weekKey, day, result: null })
      setFormData({
        date: targetDate.toISOString().split('T')[0],
        marketName: 'KALYAN',
        open: '',
        close: '',
        result: ''
      })
      setShowAddModal(true)
    }
    setMessage({ type: '', text: '' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage({ type: '', text: '' })
      
      // Ensure marketName is always KALYAN
      const dataToSave = {
        ...formData,
        marketName: 'KALYAN'
      }
      
      let response
      if (editingCell && editingCell.result && editingCell.result._id) {
        // Update existing
        response = await fetch(`${DAILY_RESULTS_URL}/${editingCell.result._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
      } else {
        // Create new
        response = await fetch(DAILY_RESULTS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save result')
      }

      setMessage({ type: 'success', text: editingCell && editingCell.result ? 'Entry updated successfully!' : 'Entry added successfully!' })
      setShowAddModal(false)
      setEditingCell(null)
      setFormData({ date: '', marketName: 'KALYAN', open: '', close: '', result: '' })
      
      // Refresh data after a short delay to show success message
      setTimeout(() => {
        fetchChartData()
        setMessage({ type: '', text: '' })
      }, 1000)
    } catch (error) {
      console.error('Error saving result:', error)
      setMessage({ type: 'error', text: error.message || 'Error saving result. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    try {
      setMessage({ type: '', text: '' })
      const response = await fetch(`${DAILY_RESULTS_URL}/${id}`, { method: 'DELETE' })
      
      if (!response.ok) {
        throw new Error('Failed to delete entry')
      }

      setMessage({ type: 'success', text: 'Entry deleted successfully!' })
      setTimeout(() => {
        fetchChartData()
        setMessage({ type: '', text: '' })
      }, 1000)
    } catch (error) {
      console.error('Error deleting result:', error)
      setMessage({ type: 'error', text: 'Error deleting result. Please try again.' })
    }
  }

  const formatNumber = (value, digits) => {
    if (!value) return '-'
    // Remove spaces and hyphens, then pad with leading zeros
    const cleaned = value.toString().replace(/[\s-]/g, '')
    if (!cleaned) return '-'
    return cleaned.padStart(digits, '0')
  }

  const renderDayCell = (dayData, weekKey, day) => {
    if (!dayData) {
      return (
        <td 
          className="border border-gray-400 bg-white h-16 w-11 text-center text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleCellClick(weekKey, day, null)}
        >
          <div className="h-full flex items-center justify-center">
            <span className="text-xs text-gray-400">+ Add</span>
          </div>
        </td>
      )
    }

    const openFormatted = formatNumber(dayData.open, 3)
    const resultFormatted = formatNumber(dayData.result, 2)
    const closeFormatted = formatNumber(dayData.close, 3)

    return (
      <td 
        className="border border-gray-400 bg-white p-1 h-16 w-11 align-top relative cursor-pointer hover:bg-gray-100 transition-colors group"
        onClick={() => handleCellClick(weekKey, day, dayData)}
      >
        <div className="h-full flex flex-col justify-center items-center text-center">
          <div className="text-[8px] text-gray-600 mb-0.5">O: {openFormatted}</div>
          <div className="text-lg font-bold text-black">{resultFormatted}</div>
          <div className="text-[8px] text-gray-600 mt-0.5">C: {closeFormatted}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(dayData._id)
          }}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded transition-opacity hover:bg-red-700"
          title="Delete"
        >
          ×
        </button>
      </td>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
          <div className="text-gray-400 font-semibold">Loading chart data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Chart Management</h2>
        <p className="text-gray-400 text-sm sm:text-base">Click on any cell to edit or add new entries. Hover over cells to see delete option.</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg border-2 ${
          message.type === 'success' 
            ? 'bg-green-900/30 border-green-600 text-green-300' 
            : 'bg-red-900/30 border-red-600 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border-2 border-yellow-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-400">Market Analysis Charts - KALYAN</h3>
          <button
            onClick={() => {
              const today = new Date()
              setEditingCell(null)
              setFormData({
                date: today.toISOString().split('T')[0],
                marketName: 'KALYAN',
                open: '',
                close: '',
                result: ''
              })
              setShowAddModal(true)
              setMessage({ type: '', text: '' })
            }}
            className="px-4 sm:px-6 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            + Add New Entry
          </button>
        </div>

        {charts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-700 rounded-lg p-8 border border-yellow-600">
              <div className="text-yellow-400 text-2xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-white mb-2">No Chart Data Available</h2>
              <p className="text-gray-400 text-sm mb-4">
                Click "Add New Entry" or click on any empty cell to add data.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white min-w-[600px] max-w-[800px] mx-auto shadow-lg">
              <thead>
                <tr className="bg-yellow-600">
                  <th className="border border-gray-400 px-2 py-2 text-black font-bold text-sm w-32">Date</th>
                  <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm">Mon</th>
                  <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm">Tue</th>
                  <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm">Wed</th>
                  <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm">Thu</th>
                  <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm">Fri</th>
                  <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm">Sat</th>
                  <th className="border border-gray-400 px-1 py-2 text-black font-bold text-sm">Sun</th>
                </tr>
              </thead>
              <tbody>
                {charts.map((chart, index) => (
                  <tr key={`chart-${index}`}>
                    <td className="border border-gray-400 bg-white px-2 py-2 text-black font-semibold text-[10px] text-center align-middle whitespace-pre-line leading-tight w-32">
                      {formatWeekDate(chart.week).replace(' to ', '\nto\n')}
                    </td>
                    {renderDayCell(chart.Mon, chart.week, 'Mon')}
                    {renderDayCell(chart.Tue, chart.week, 'Tue')}
                    {renderDayCell(chart.Wed, chart.week, 'Wed')}
                    {renderDayCell(chart.Thu, chart.week, 'Thu')}
                    {renderDayCell(chart.Fri, chart.week, 'Fri')}
                    {renderDayCell(chart.Sat, chart.week, 'Sat')}
                    {renderDayCell(chart.Sun, chart.week, 'Sun')}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => {
          if (!saving) {
            setShowAddModal(false)
            setEditingCell(null)
            setFormData({ date: '', marketName: 'KALYAN', open: '', close: '', result: '' })
            setMessage({ type: '', text: '' })
          }
        }}>
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">
              {editingCell && editingCell.result ? 'Edit Entry' : 'Add New Entry'}
            </h3>
            
            {message.text && (
              <div className={`mb-4 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-900/30 border border-green-600 text-green-300' 
                  : 'bg-red-900/30 border border-red-600 text-red-300'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm sm:text-base font-semibold">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm sm:text-base"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base font-semibold">Open</label>
                  <input
                    type="text"
                    value={formData.open}
                    onChange={(e) => setFormData({ ...formData, open: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm sm:text-base"
                    required
                    placeholder="e.g., 380"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base font-semibold">Result</label>
                  <input
                    type="text"
                    value={formData.result}
                    onChange={(e) => {
                      const value = e.target.value
                      // Allow numbers only
                      if (value === '' || /^\d*$/.test(value)) {
                        setFormData({ ...formData, result: value })
                      }
                    }}
                    className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm sm:text-base"
                    placeholder="e.g., 19"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base font-semibold">Close</label>
                  <input
                    type="text"
                    value={formData.close}
                    onChange={(e) => setFormData({ ...formData, close: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm sm:text-base"
                    required
                    placeholder="e.g., 180"
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 sm:px-6 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base flex-1"
                >
                  {saving ? 'Saving...' : (editingCell && editingCell.result ? 'Update' : 'Add')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingCell(null)
                    setFormData({ date: '', marketName: 'KALYAN', open: '', close: '', result: '' })
                    setMessage({ type: '', text: '' })
                  }}
                  disabled={saving}
                  className="px-4 sm:px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                {editingCell && editingCell.result && editingCell.result._id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this entry?')) {
                        handleDelete(editingCell.result._id)
                        setShowAddModal(false)
                        setEditingCell(null)
                      }
                    }}
                    disabled={saving}
                    className="px-4 sm:px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
