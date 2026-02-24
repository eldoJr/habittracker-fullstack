'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database-production'

type HabitInsert = Database['public']['Tables']['habits']['Insert']
type HabitUpdate = Database['public']['Tables']['habits']['Update']

export async function createHabit(data: Omit<HabitInsert, 'user_id'>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: habit, error } = await supabase
    .from('habits')
    .insert({ ...data, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  
  revalidatePath('/habits')
  return habit
}

export async function updateHabit(id: string, data: HabitUpdate) {
  const supabase = await createClient()
  
  const { data: habit, error } = await supabase
    .from('habits')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  
  revalidatePath('/habits')
  return habit
}

export async function deleteHabit(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/habits')
}

export async function archiveHabit(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('habits')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/habits')
}

export async function completeHabit(habitId: string, data?: {
  duration?: number
  notes?: string
  mood_score?: number
  completed_date?: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const completedDate = data?.completed_date || new Date().toISOString().split('T')[0]

  const { data: completion, error } = await supabase
    .from('habit_completions')
    .insert({
      habit_id: habitId,
      user_id: user.id,
      completed_date: completedDate,
      completed_at: new Date().toISOString(),
      duration: data?.duration || null,
      notes: data?.notes || null,
      mood_score: data?.mood_score || null,
    })
    .select()
    .single()

  if (error) throw error
  
  revalidatePath('/habits')
  return completion
}

export async function uncompleteHabit(habitId: string, date: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('habit_completions')
    .delete()
    .eq('habit_id', habitId)
    .eq('completed_date', date)

  if (error) throw error
  
  revalidatePath('/habits')
}
