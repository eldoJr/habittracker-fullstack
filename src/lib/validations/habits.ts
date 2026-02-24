import { z } from 'zod'

export const frequencyConfigSchema = z.object({
  days: z.array(z.number().min(0).max(6)).optional(),
  times_per_week: z.number().min(1).max(7).optional(),
  times_per_day: z.number().min(1).optional(),
  custom_schedule: z.string().optional(),
})

export const habitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  frequency_type: z.enum(['daily', 'weekly', 'specific_days', 'custom']),
  frequency_config: frequencyConfigSchema,
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#6366f1'),
  icon: z.string().default('target'),
  target_duration: z.number().min(1).optional(),
  reminder_time: z.array(z.string()).optional(),
  timezone: z.string().default('UTC'),
})

export const completionSchema = z.object({
  habit_id: z.string().uuid(),
  completed_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
  mood_score: z.number().min(1).max(5).optional(),
})

export type HabitInput = z.infer<typeof habitSchema>
export type CompletionInput = z.infer<typeof completionSchema>
