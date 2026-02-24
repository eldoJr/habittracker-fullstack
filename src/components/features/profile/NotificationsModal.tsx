'use client'

import { useState } from 'react'
import { X, Bell, BellOff } from 'lucide-react'
import toast from 'react-hot-toast'

export function NotificationsModal({ onClose }: { onClose: () => void }) {
  const [dailyReminder, setDailyReminder] = useState(true)
  const [streakAlert, setStreakAlert] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)

  function handleSave() {
    toast.success('Notification settings saved')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[60] pt-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 animate-slide-down" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-extrabold">Notifications</h2>
          <button onClick={onClose} className="p-2 bg-[#F4F4F5] rounded-full hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F4F4F5] rounded-2xl">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-600" />
              <div>
                <div className="font-semibold text-gray-900">Daily Reminder</div>
                <div className="text-xs text-gray-600">Get reminded to complete habits</div>
              </div>
            </div>
            <button
              onClick={() => setDailyReminder(!dailyReminder)}
              className={`w-12 h-6 rounded-full transition ${
                dailyReminder ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                dailyReminder ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F4F4F5] rounded-2xl">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-600" />
              <div>
                <div className="font-semibold text-gray-900">Streak Alert</div>
                <div className="text-xs text-gray-600">Alert when streak is at risk</div>
              </div>
            </div>
            <button
              onClick={() => setStreakAlert(!streakAlert)}
              className={`w-12 h-6 rounded-full transition ${
                streakAlert ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                streakAlert ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F4F4F5] rounded-2xl">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-600" />
              <div>
                <div className="font-semibold text-gray-900">Weekly Report</div>
                <div className="text-xs text-gray-600">Summary of your progress</div>
              </div>
            </div>
            <button
              onClick={() => setWeeklyReport(!weeklyReport)}
              className={`w-12 h-6 rounded-full transition ${
                weeklyReport ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                weeklyReport ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
