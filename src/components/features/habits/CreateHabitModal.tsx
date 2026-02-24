'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { HabitForm } from '@/components/features/habits/HabitForm'

export function CreateHabitModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="p-3 bg-[#F4F4F5] rounded-[32px] hover:bg-gray-200 transition">
          <Plus size={20} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <HabitForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
