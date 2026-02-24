import { Target, Flame, Star, Heart, Zap, Book, Dumbbell, Coffee, Brain, Moon, Sun, Music, Camera, Palette, Droplet, Wind } from 'lucide-react'

export const HABIT_ICONS = {
  target: Target,
  flame: Flame,
  star: Star,
  heart: Heart,
  zap: Zap,
  book: Book,
  dumbbell: Dumbbell,
  coffee: Coffee,
  brain: Brain,
  moon: Moon,
  sun: Sun,
  music: Music,
  camera: Camera,
  palette: Palette,
  droplet: Droplet,
  wind: Wind,
} as const

export type IconName = keyof typeof HABIT_ICONS

export const ICON_NAMES = Object.keys(HABIT_ICONS) as IconName[]
