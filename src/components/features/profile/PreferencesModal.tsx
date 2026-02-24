'use client'

import { useState } from 'react'
import { X, Palette, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

export function PreferencesModal({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')

  function handleSave() {
    toast.success('Preferences saved')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[60] pt-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 animate-slide-down" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-extrabold">Preferences</h2>
          <button onClick={onClose} className="p-2 bg-[#F4F4F5] rounded-full hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <Palette size={16} />
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 transition ${
                  theme === 'light'
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 bg-[#F4F4F5] hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Light</div>
                <div className="text-xs text-gray-600 mt-1">Default theme</div>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 transition ${
                  theme === 'dark'
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 bg-[#F4F4F5] hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Dark</div>
                <div className="text-xs text-gray-600 mt-1">Coming soon</div>
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <Globe size={16} />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-[#F4F4F5] border-0 rounded-2xl focus:ring-2 focus:ring-gray-900 font-medium"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
