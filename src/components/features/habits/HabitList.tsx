import { HabitCard } from './HabitCard'
import { getHabits, getTodayCompletions, getHabitStreak } from '@/lib/queries/habits'

export async function HabitList() {
  const habits = await getHabits()
  const completedToday = await getTodayCompletions()

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No habits yet</p>
        <p className="text-gray-400">Create your first habit to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {habits.map(async (habit) => {
        const streak = await getHabitStreak(habit.id)
        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            isCompletedToday={completedToday.includes(habit.id)}
            streak={streak?.current_streak || 0}
          />
        )
      })}
    </div>
  )
}
