import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const SETTINGS_URL = `${API_BASE_URL}/api/settings`

export default function Settings() {
  const [settings, setSettings] = useState({
    SITE_NAME: '',
    API_ENDPOINT: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch(SETTINGS_URL)
      const data = await response.json()
      setSettings(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setLoading(false)
      setMessage({ type: 'error', text: 'Failed to load settings' })
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async (key) => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await fetch(`${SETTINGS_URL}/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: settings[key] })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Setting saved successfully!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        throw new Error('Failed to save setting')
      }
    } catch (error) {
      console.error('Error saving setting:', error)
      setMessage({ type: 'error', text: 'Failed to save setting' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const promises = Object.keys(settings).map(key =>
        fetch(`${SETTINGS_URL}/${key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: settings[key] })
        })
      )

      await Promise.all(promises)
      setMessage({ type: 'success', text: 'All settings saved successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
          <p className="text-gray-400">Configure system settings</p>
        </div>
        <div className="text-center text-gray-400 py-8">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Configure system settings</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border-2 ${
          message.type === 'success' 
            ? 'bg-green-900/30 border-green-600 text-green-400' 
            : 'bg-red-900/30 border-red-600 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-yellow-400">General Settings</h3>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-4 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Site Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.SITE_NAME || ''}
                onChange={(e) => handleChange('SITE_NAME', e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="Enter site name"
              />
              <button
                onClick={() => handleSave('SITE_NAME')}
                disabled={saving}
                className="px-4 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">API Endpoint</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.API_ENDPOINT || ''}
                onChange={(e) => handleChange('API_ENDPOINT', e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="Enter API endpoint"
              />
              <button
                onClick={() => handleSave('API_ENDPOINT')}
                disabled={saving}
                className="px-4 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">Database Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">MongoDB Connection</label>
            <input
              type="text"
              value="Connected"
              disabled
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 opacity-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-600">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">System Information</h3>
        <div className="space-y-2 text-gray-300">
          <p><span className="text-gray-400">Version:</span> 1.0.0</p>
          <p><span className="text-gray-400">Environment:</span> Development</p>
          <p><span className="text-gray-400">Last Updated:</span> {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
