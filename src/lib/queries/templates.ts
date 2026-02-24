import { createClient } from '@/lib/supabase/server'

export async function getHabitTemplates() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('habit_templates')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }

  return data || []
}
