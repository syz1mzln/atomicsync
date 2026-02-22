'use client'

import { Moon, Sun } from 'lucide-react'

interface DarkModeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export function DarkModeToggle({ isDark, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-md cursor-pointer transition-opacity hover:opacity-70 min-w-[44px] min-h-[44px] flex items-center justify-center"
      style={{ color: 'var(--label-primary)' }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
