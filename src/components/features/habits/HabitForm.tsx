'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import type { HabitFrequency } from '@/types/database-production'
import type { Database } from '@/types/database-production'
import { HABIT_ICONS, ICON_NAMES, type IconName } from '@/lib/constants/icons'
import { HABIT_COLORS } from '@/lib/constants/colors'

type Habit = Database['public']['Tables']['habits']['Row']

interface HabitFormProps {
  habit?: Habit
  onSuccess?: () => void
}

export function HabitForm({ habit, onSuccess }: HabitFormProps) {
  const [loading, setLoading] = useState(false)
  const [frequency, setFrequency] = useState<HabitFrequency>(habit?.frequency_type || 'daily')
  const [selectedColor, setSelectedColor] = useState(habit?.color || HABIT_COLORS[0])
  const [selectedIcon, setSelectedIcon] = useState<IconName>((habit?.icon as IconName) || 'target')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('Please log in')
        return
      }

      const data = {
        user_id: session.user.id,
        name,
        description: description || null,
        frequency_type: frequency,
        frequency_config: frequency === 'daily' ? {} : { days: [1, 2, 3, 4, 5] },
        color: selectedColor,
        icon: selectedIcon,
      }

      if (habit) {
        await supabase.from('habits').update(data).eq('id', habit.id)
        toast.success('Habit updated! ✨')
      } else {
        await supabase.from('habits').insert(data)
        toast.success('Habit created! 🎉')
      }
      
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save habit:', error)
      toast.error('Failed to save habit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        name="name"
        label="Habit Name"
        placeholder="e.g., Morning Exercise"
        defaultValue={habit?.name}
        required
        maxLength={100}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          name="description"
          defaultValue={habit?.description || ''}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Why is this habit important to you?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frequency
        </label>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'specific_days'] as HabitFrequency[]).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setFrequency(freq)}
              className={`px-4 py-2 rounded-lg border-2 transition ${
                frequency === freq
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {freq.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {HABIT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full transition ${
                selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon
        </label>
        <div className="flex gap-2 flex-wrap">
          {ICON_NAMES.map((iconName) => {
            const Icon = HABIT_ICONS[iconName]
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setSelectedIcon(iconName)}
                className={`p-3 rounded-lg border-2 transition ${
                  selectedIcon === iconName
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon size={20} />
              </button>
            )
          })}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : habit ? 'Update Habit' : 'Create Habit'}
      </Button>
    </form>
  )
}
