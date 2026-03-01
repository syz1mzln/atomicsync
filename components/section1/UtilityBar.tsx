'use client'

import { useEffect, useState } from 'react'
import { Watch as WatchIcon } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'
import { ManualSyncButton } from './ManualSyncButton'
import { SyncStatus } from '@/hooks/useNTPSync'
import type { Watch } from '@/types/watchlog'

const LS_KEY = 'atomictime_dark_mode'

interface UtilityBarProps {
  syncStatus: SyncStatus
  manualSync: () => void
  watches: Watch[]
  onOpenDrawer: () => void
}

export function UtilityBar({ syncStatus, manualSync, watches, onOpenDrawer }: UtilityBarProps) {
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
    <div className="flex items-center justify-between">
      <div /> {/* reserved for future nav */}
      <div className="flex items-center gap-1">
        {watches.length > 0 && (
          <button
            onClick={onOpenDrawer}
            aria-label="My watch log"
            title="My watch log"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ color: 'var(--label-muted)' }}
          >
            <WatchIcon size={16} />
          </button>
        )}
        <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
        <ManualSyncButton status={syncStatus} onSync={manualSync} />
      </div>
    </div>
  )
}
