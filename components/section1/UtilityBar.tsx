'use client'

import { useEffect, useState } from 'react'
import { DarkModeToggle } from './DarkModeToggle'
import { ManualSyncButton } from './ManualSyncButton'
import { TimeFormatToggle } from './TimeFormatToggle'
import { SyncStatus } from '@/hooks/useNTPSync'

const LS_KEY = 'atomictime_dark_mode'

interface UtilityBarProps {
  syncStatus: SyncStatus
  manualSync: () => void
  is24h: boolean
  onFormat: (is24h: boolean) => void
}

export function UtilityBar({ syncStatus, manualSync, is24h, onFormat }: UtilityBarProps) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleDark = () => {
    const html = document.documentElement
    if (isDark) {
      html.classList.remove('dark')
      html.classList.add('light')
      localStorage.setItem(LS_KEY, 'light')
      setIsDark(false)
    } else {
      html.classList.remove('light')
      html.classList.add('dark')
      localStorage.setItem(LS_KEY, 'dark')
      setIsDark(true)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* 12/24h toggle */}
      <TimeFormatToggle is24h={is24h} onChange={onFormat} />
      {/* Manual sync */}
      <ManualSyncButton status={syncStatus} onSync={manualSync} />
      {/* Dark/light mode */}
      <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
    </div>
  )
}
