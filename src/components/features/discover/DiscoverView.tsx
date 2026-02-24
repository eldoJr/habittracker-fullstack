'use client'

import { Sparkles, TrendingUp, Brain, Zap, Dumbbell, Book, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { applyTemplate } from '@/lib/actions/templates'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const ICON_MAP: Record<string, any> = {
  sun: Sun,
  dumbbell: Dumbbell,
  book: Book,
  brain: Brain,
  zap: Zap,
  moon: Moon
}

const AI_INSIGHTS = [
  {
    title: 'Personalized Recommendations',
    description: 'AI analyzes your patterns to suggest optimal habits',
    icon: Brain,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Smart Scheduling',
    description: 'Find the best times for your habits based on your data',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Predictive Insights',
    description: 'Forecast your progress and identify potential challenges',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  }
]

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  habits: string[]
}

export function DiscoverView({ templates }: { templates: Template[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  
  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))]

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  async function handleApplyTemplate(templateId: string) {
    setLoading(templateId)
    try {
      await applyTemplate(templateId)
      toast.success('Habits created successfully!')
      router.push('/habits')
    } catch (error) {
      toast.error('Failed to apply template')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* AI-Powered Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={24} className="text-yellow-400" />
          <h2 className="text-xl font-extrabold">AI-Powered Insights</h2>
        </div>
        <p className="text-sm text-gray-300 mb-4">
          Leverage artificial intelligence to optimize your habit formation journey
        </p>
        <div className="grid gap-3">
          {AI_INSIGHTS.map((insight, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0`}>
                  <insight.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm mb-1">{insight.title}</div>
                  <div className="text-xs text-gray-300">{insight.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h2 className="text-xl font-extrabold mb-3">Habit Templates</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-[#F4F4F5] text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4">
        {filteredTemplates.map(template => {
          const Icon = ICON_MAP[template.icon] || Brain
          const isLoading = loading === template.id
          
          return (
            <div key={template.id} className="bg-[#F4F4F5] p-5 rounded-2xl">
              <div className="flex items-start gap-4 mb-3">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${template.color}20` }}
                >
                  <Icon size={24} style={{ color: template.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-white rounded-full text-gray-600">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {template.habits.map((habit, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-white rounded-lg text-gray-700">
                        {habit}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleApplyTemplate(template.id)}
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Creating...' : 'Start Template'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Coming Soon */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} />
          <span className="text-sm font-semibold">Coming Soon</span>
        </div>
        <h3 className="text-xl font-bold mb-2">AI Habit Coach</h3>
        <p className="text-sm opacity-90">
          Get personalized coaching, real-time feedback, and adaptive recommendations powered by advanced AI
        </p>
      </div>
    </div>
  )
}
