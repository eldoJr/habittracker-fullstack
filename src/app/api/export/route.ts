import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const format = request.nextUrl.searchParams.get('format') || 'json'

  // Fetch all user data
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)

  const { data: completions } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('user_id', user.id)

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const exportData = {
    user: {
      email: user.email,
      created_at: user.created_at
    },
    profile,
    habits: habits || [],
    completions: completions || [],
    exported_at: new Date().toISOString()
  }

  if (format === 'csv') {
    // Convert to CSV
    const csvRows = ['Date,Habit,Duration,Mood,Notes']
    completions?.forEach(c => {
      const habit = habits?.find(h => h.id === c.habit_id)
      csvRows.push([
        c.completed_date,
        habit?.name || 'Unknown',
        c.duration || '',
        c.mood_score || '',
        c.notes ? `"${c.notes.replace(/"/g, '""')}"` : ''
      ].join(','))
    })
    
    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="habit-data-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  }

  // JSON format
  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="habit-data-${new Date().toISOString().split('T')[0]}.json"`
    }
  })
}
