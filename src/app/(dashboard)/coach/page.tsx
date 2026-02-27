'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Send, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import Link from 'next/link'

export default function CoachPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI Habit Coach. I can help you:\n\n• Analyze your habit patterns\n• Suggest optimal habit timing\n• Provide motivation and tips\n• Create personalized habit plans\n\nWhat would you like to know?'
    }
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!message.trim() || loading) return

    const userMessage = message.trim()
    setMessage('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'AI Coach is coming soon! We\'re working hard to bring you personalized habit coaching powered by advanced AI. Stay tuned! 🚀'
      }])
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft size={20} />
          </Link>
          <Sparkles size={20} className="text-yellow-300" />
          <h1 className="text-lg sm:text-xl font-extrabold">AI Habit Coach</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-[#F4F4F5] text-gray-900'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-purple-600" />
                    <span className="text-xs font-bold text-purple-600">AI Coach</span>
                  </div>
                )}
                <p className="text-sm sm:text-base whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#F4F4F5] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="px-4 sm:px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </main>
  )
}
