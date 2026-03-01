'use client'

import { useEffect, useState } from 'react'
import { Watch as WatchIcon } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'
import { ManualSyncButton } from './ManualSyncButton'
import { SyncStatus } from '@/hooks/useNTPSync'
import type { Watch } from '@/types/watchlog'
import { STORAGE_KEYS } from '@/lib/storage-keys'

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
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, 'light')
      setIsDark(false)
    } else {
      html.classList.remove('light')
      html.classList.add('dark')
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, 'dark')
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
            className="p-2 rounded-md cursor-pointer transition-opacity hover:opacity-70 min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ color: 'var(--label-primary)' }}
          >
            <WatchIcon size={18} />
          </button>
        )}
        <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
        <ManualSyncButton status={syncStatus} onSync={manualSync} />
      </div>
    </div>
  )
}
