'use client'

import { useRouter } from 'next/navigation'
import { HabitForm } from '@/components/features/habits/HabitForm'

export function NewHabitForm() {
  const router = useRouter()

  return <HabitForm onSuccess={() => router.push('/habits')} />
}
