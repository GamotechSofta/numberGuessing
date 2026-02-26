import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const LUCKY_NUMBER_URL = `${API_BASE_URL}/api/lucky-number`

export default function LuckyNumber() {
  const [goldenAnk, setGoldenAnk] = useState('')
  const [motorPatti, setMotorPatti] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLuckyNumber()
  }, [])

  const fetchLuckyNumber = async () => {
    try {
      const response = await fetch(LUCKY_NUMBER_URL)
      const data = await response.json()
      setGoldenAnk(data.goldenAnk ?? '')
      setMotorPatti(data.motorPatti ?? '')
    } catch (error) {
      console.error('Error fetching lucky number:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(LUCKY_NUMBER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goldenAnk: goldenAnk.trim() || '-', motorPatti: motorPatti.trim() || '-' })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || `Save failed (${res.status})`)
      }
      setGoldenAnk(data.goldenAnk ?? '')
      setMotorPatti(data.motorPatti ?? '')
    } catch (err) {
      console.error(err)
      const msg = err.message || 'Failed to save. Please try again.'
      alert(msg.includes('fetch') || err.name === 'TypeError' ? 'Cannot reach server. Is backend running on ' + (API_BASE_URL) + '?' : msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">Loading...</div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Lucky Number</h2>
      <p className="text-gray-400 text-sm">Set site-wide Today Lucky Number (Golden Ank & Motor Patti). Single value for the whole website.</p>

      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Golden Ank</label>
          <input
            type="text"
            value={goldenAnk}
            onChange={(e) => setGoldenAnk(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
            placeholder="e.g. 1-4-6-9"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Motor Patti</label>
          <input
            type="text"
            value={motorPatti}
            onChange={(e) => setMotorPatti(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none"
            placeholder="e.g. 12469"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-lg text-sm"
        >
          {saving ? 'Saving...' : 'Save Lucky Number'}
        </button>
      </form>
    </div>
  )
}
