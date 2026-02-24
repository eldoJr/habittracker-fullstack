'use client'

import { useRouter } from 'next/navigation'
import { HabitForm } from './HabitForm'
import type { Database } from '@/types/database-production'

type Habit = Database['public']['Tables']['habits']['Row']

export function EditHabitForm({ habit, habitId }: { habit: Habit; habitId: string }) {
  const router = useRouter()

  return <HabitForm habit={habit} onSuccess={() => router.push(`/habits/${habitId}`)} />
}
