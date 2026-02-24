'use client'

import { useState } from 'react'
import { X, Download, FileJson, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

export function DataExportModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleExport(format: 'json' | 'csv') {
    setLoading(true)
    try {
      const response = await fetch(`/api/export?format=${format}`)
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `habit-data-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success(`Data exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[60] pt-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 animate-slide-down" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-extrabold">Export Data</h2>
          <button onClick={onClose} className="p-2 bg-[#F4F4F5] rounded-full hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Download all your habit data including completions, streaks, and analytics.
          </p>

          <button
            onClick={() => handleExport('json')}
            disabled={loading}
            className="w-full p-4 bg-[#F4F4F5] rounded-2xl hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileJson size={24} className="text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900">Export as JSON</div>
              <div className="text-xs text-gray-600">Machine-readable format</div>
            </div>
            <Download size={20} className="text-gray-400" />
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={loading}
            className="w-full p-4 bg-[#F4F4F5] rounded-2xl hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900">Export as CSV</div>
              <div className="text-xs text-gray-600">Spreadsheet compatible</div>
            </div>
            <Download size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
