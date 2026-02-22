'use client'

import { RefreshCw } from 'lucide-react'
import { SyncStatus } from '@/hooks/useNTPSync'

interface ManualSyncButtonProps {
  status: SyncStatus
  onSync: () => void
}

export function ManualSyncButton({ status, onSync }: ManualSyncButtonProps) {
  return (
    <button
      onClick={onSync}
      className="p-2 rounded-md cursor-pointer transition-opacity hover:opacity-70 min-w-[44px] min-h-[44px] flex items-center justify-center"
      style={{ color: 'var(--label-primary)' }}
      aria-label="Sync time"
      disabled={status === 'syncing'}
    >
      <RefreshCw
        size={18}
        className={status === 'syncing' ? 'animate-spin' : ''}
      />
    </button>
  )
}
