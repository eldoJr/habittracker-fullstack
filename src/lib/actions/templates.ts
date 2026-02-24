'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function applyTemplate(templateId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get template
  const { data: template, error: templateError } = await supabase
    .from('habit_templates')
    .select('*')
    .eq('id', templateId)
    .single()

  if (templateError || !template) {
    throw new Error('Template not found')
  }

  // Create habits from template
  const habits = (template.habits as string[]).map(habitName => ({
    user_id: user.id,
    name: habitName,
    description: `Part of ${template.name}`,
    frequency_type: 'daily' as const,
    frequency_config: {},
    color: template.color,
    icon: template.icon
  }))

  const { error: insertError } = await supabase
    .from('habits')
    .insert(habits)

  if (insertError) {
    throw new Error('Failed to create habits')
  }

  revalidatePath('/habits')
  revalidatePath('/')
  
  return { success: true }
}
