'use client'

import { useState } from 'react'
import { Bell, Settings as SettingsIcon, Download } from 'lucide-react'
import { NotificationsModal } from './NotificationsModal'
import { PreferencesModal } from './PreferencesModal'
import { DataExportModal } from './DataExportModal'

export function SettingsView() {
  const [activeModal, setActiveModal] = useState<'notifications' | 'preferences' | 'export' | null>(null)

  return (
    <>
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-4">Settings</h3>
        <div className="bg-[#F4F4F5] rounded-2xl overflow-hidden">
          <button 
            onClick={() => setActiveModal('notifications')}
            className="w-full text-left px-4 py-4 hover:bg-gray-200 transition flex items-center gap-3"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-900">Notifications</span>
          </button>
          <button 
            onClick={() => setActiveModal('preferences')}
            className="w-full text-left px-4 py-4 hover:bg-gray-200 transition flex items-center gap-3 border-t border-gray-200"
          >
            <SettingsIcon size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-900">Preferences</span>
          </button>
          <button 
            onClick={() => setActiveModal('export')}
            className="w-full text-left px-4 py-4 hover:bg-gray-200 transition flex items-center gap-3 border-t border-gray-200"
          >
            <Download size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-900">Data Export</span>
          </button>
        </div>
      </div>

      {activeModal === 'notifications' && <NotificationsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'preferences' && <PreferencesModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'export' && <DataExportModal onClose={() => setActiveModal(null)} />}
    </>
  )
}
