import { useState, useEffect } from 'react'
import { getMarketResultDisplay } from '../utils/marketResult'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_URL = `${API_BASE_URL}/api/markets`

const MARKET_TYPES = [
  { id: 'regular', label: 'Regular Market', icon: '📊' },
  { id: 'starline', label: 'Starline Market', icon: '⭐' },
  { id: 'king', label: 'King Bazaar Market', icon: '👑' },
]

export default function Markets() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    open: '',
    close: '',
    marketType: 'main',
    startHour: '10',
    startMin: '30',
    startAmPm: 'AM',
    endHour: '11',
    endMin: '30',
    endAmPm: 'AM'
  })
  const [activeTab, setActiveTab] = useState('regular')
  const [showModal, setShowModal] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [addResultMarket, setAddResultMarket] = useState(null)
  const [addResultStep, setAddResultStep] = useState('open') // 'open' | 'close'
  const [openPatti, setOpenPatti] = useState('')
  const [closePatti, setClosePatti] = useState('')
  const [declaredOpenValue, setDeclaredOpenValue] = useState('') // after Declare Open, to send with Declare Close

  useEffect(() => {
    fetchMarkets()
  }, [])

  useEffect(() => {
    if (!loading && markets.length === 0) setShowModal(true)
  }, [loading, markets.length])

  const defaultFormData = () => ({
    name: '',
    open: '',
    close: '',
    marketType: 'main',
    startHour: '10',
    startMin: '30',
    startAmPm: 'AM',
    endHour: '11',
    endMin: '30',
    endAmPm: 'AM'
  })

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
    const formatTime = (h, m, amPm) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${amPm}`
    const openingTime = formatTime(formData.startHour, formData.startMin, formData.startAmPm)
    const closingTime = formatTime(formData.endHour, formData.endMin, formData.endAmPm)
    try {
      const isFromModal = showModal && !editingId
      const payload = {
        name: formData.name.trim().toUpperCase(),
        open: formData.open || (isFromModal ? '***' : openingTime),
        close: formData.close || (isFromModal ? '***' : closingTime),
        openingTime,
        closingTime
      }
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Update failed')
        setFormData(defaultFormData())
        setEditingId(null)
        setShowForm(false)
        setShowModal(false)
        await fetchMarkets()
        return
      }
      const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Create failed')
      const created = await res.json()
      setFormData(defaultFormData())
      setShowModal(false)
      setShowForm(false)
      setEditingId(null)
      // Show created market with opening/closing time immediately on card
      if (created && created._id) {
        const withTimes = {
          ...created,
          openingTime: (created.openingTime != null && String(created.openingTime).trim()) ? String(created.openingTime).trim() : openingTime,
          closingTime: (created.closingTime != null && String(created.closingTime).trim()) ? String(created.closingTime).trim() : closingTime
        }
        setMarkets((prev) => [withTimes, ...prev.filter((m) => m._id !== created._id)])
      }
      await fetchMarkets()
    } catch (error) {
      console.error('Error saving market:', error)
      alert('Error saving market. Please try again.')
    }
  }

  const handleEdit = (market) => {
    const parseTime = (str) => {
      if (!str || typeof str !== 'string') return { hour: '10', min: '30', amPm: 'AM' }
      const m = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
      if (!m) return { hour: '10', min: '30', amPm: 'AM' }
      return { hour: String(parseInt(m[1], 10)), min: m[2], amPm: m[3].toUpperCase() }
    }
    const start = parseTime(market.openingTime)
    const end = parseTime(market.closingTime)
    setFormData({
      name: market.name,
      open: market.open,
      close: market.close,
      marketType: 'main',
      startHour: start.hour,
      startMin: start.min,
      startAmPm: start.amPm,
      endHour: end.hour,
      endMin: end.min,
      endAmPm: end.amPm
    })
    setEditingId(market._id)
    setShowForm(true)
    setShowModal(false)
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
    setFormData(defaultFormData())
    setEditingId(null)
    setShowForm(false)
    setShowModal(false)
  }

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
      await fetch(`${API_URL}/${addResultMarket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addResultMarket.name,
          open: value,
          close: addResultMarket.close && addResultMarket.close !== '***' ? addResultMarket.close : '***'
        })
      })
      closeAddResultModal()
      setOpenPatti('')
      fetchMarkets()
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
      await fetch(`${API_URL}/${addResultMarket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addResultMarket.name,
          open: declaredOpenValue || addResultMarket.open,
          close: value
        })
      })
      closeAddResultModal()
      fetchMarkets()
    } catch (err) {
      console.error(err)
      alert('Error declaring close result.')
    }
  }

  const handleClearResult = async () => {
    if (!addResultMarket) return
    if (!confirm('Clear open and close result for this market?')) return
    try {
      await fetch(`${API_URL}/${addResultMarket._id}`, {
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
    } catch (err) {
      console.error(err)
      alert('Error clearing result.')
    }
  }

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">Loading markets...</div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Markets Management</h2>

      {/* Market type tabs */}
      <div className="flex flex-wrap gap-2">
        {MARKET_TYPES.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main / Daily Markets + Add Market */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-white">Main / Daily Markets</h3>
        <button
          type="button"
          onClick={() => { setEditingId(null); setFormData(defaultFormData()); setShowModal(true); setShowForm(false) }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-lg text-sm shrink-0"
        >
          + Add Market
        </button>
      </div>

      {/* Create New Market Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-xl border border-gray-600" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h3 className="text-lg font-bold text-white">Create New Market</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Market Type */}
              <div>
                <p className="text-gray-300 text-sm font-medium mb-2">Market Type</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="marketType"
                      checked={formData.marketType === 'main'}
                      onChange={() => setFormData({ ...formData, marketType: 'main' })}
                      className="text-amber-500"
                    />
                    <span className="text-white text-sm">Main / Daily Market</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="marketType"
                      checked={formData.marketType === 'starline'}
                      onChange={() => setFormData({ ...formData, marketType: 'starline' })}
                      className="text-amber-500"
                    />
                    <span className="text-white text-sm">Startline</span>
                  </label>
                </div>
              </div>
              {/* Market Name */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Market Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  placeholder="e.g., Rudraksh Morning"
                  required
                />
              </div>
              {/* Starting Time */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Starting Time</label>
                <div className="flex gap-2">
                  <select
                    value={formData.startHour}
                    onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={String(n)}>{n}</option>
                    ))}
                  </select>
                  <select
                    value={formData.startMin}
                    onChange={(e) => setFormData({ ...formData, startMin: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  >
                    {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={formData.startAmPm}
                    onChange={(e) => setFormData({ ...formData, startAmPm: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              {/* Closing Time */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Closing Time</label>
                <div className="flex gap-2">
                  <select
                    value={formData.endHour}
                    onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={String(n)}>{n}</option>
                    ))}
                  </select>
                  <select
                    value={formData.endMin}
                    onChange={(e) => setFormData({ ...formData, endMin: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  >
                    {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={formData.endAmPm}
                    onChange={(e) => setFormData({ ...formData, endAmPm: e.target.value })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Result Modal (Open → Close) */}
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
                ID: {addResultMarket._id} <button type="button" className="text-amber-400 hover:underline ml-1">View details</button>
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

      {/* Add/Edit form (inline for Edit) */}
      {showForm && (
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-600">
        <h3 className="text-lg font-bold text-amber-400 mb-4">
          {editingId ? 'Edit Market' : 'Add New Market'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Market Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
              required
              placeholder="e.g., Milan Morning"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Open</label>
              <input
                type="text"
                value={formData.open}
                onChange={(e) => setFormData({ ...formData, open: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                required
                placeholder="e.g., 2-5-8"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Close</label>
              <input
                type="text"
                value={formData.close}
                onChange={(e) => setFormData({ ...formData, close: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                required
                placeholder="e.g., 3-6-9"
              />
            </div>
          </div>
          {/* Starting Time & Closing Time - so Edit can set/update them */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Starting Time</label>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={formData.startHour}
                  onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
                <select
                  value={formData.startMin}
                  onChange={(e) => setFormData({ ...formData, startMin: e.target.value })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                >
                  {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={formData.startAmPm}
                  onChange={(e) => setFormData({ ...formData, startAmPm: e.target.value })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Closing Time</label>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={formData.endHour}
                  onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
                <select
                  value={formData.endMin}
                  onChange={(e) => setFormData({ ...formData, endMin: e.target.value })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                >
                  {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={formData.endAmPm}
                  onChange={(e) => setFormData({ ...formData, endAmPm: e.target.value })}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600"
            >
              {editingId ? 'Update Market' : 'Add Market'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500"
              >
                Close
              </button>
            )}
          </div>
        </form>
      </div>
      )}

      {/* Market cards grid */}
      <div>
        {markets.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No markets found. Add your first market above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {markets.map((market) => (
              <div
                key={market._id}
                className="bg-slate-700/80 rounded-xl p-4 sm:p-5 border border-slate-600 relative"
              >
                {/* Result - pana format: openPana_openAnkCloseAnk_closePana */}
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

                {/* Opening / Closing - from API; show hint when empty */}
                <div className="space-y-1 text-gray-300 text-sm mb-4">
                  <p>Opening: {(market.openingTime ?? market.opening_time ?? '').trim() || <span className="text-amber-400/80">— <span className="text-xs">(Edit to set)</span></span>}</p>
                  <p>Closing: {(market.closingTime ?? market.closing_time ?? '').trim() || <span className="text-amber-400/80">— <span className="text-xs">(Edit to set)</span></span>}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleEdit(market)}
                    className="flex-1 min-w-0 px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(market._id)}
                    className="flex-1 min-w-0 px-2 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded text-xs"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => openAddResultModal(market)}
                    className="flex-1 min-w-0 px-2 py-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded text-xs"
                  >
                    Add Result
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
