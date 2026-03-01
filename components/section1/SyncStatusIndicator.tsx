'use client'

import { SyncStatus } from '@/hooks/useNTPSync'

interface SyncStatusIndicatorProps {
  status: SyncStatus
}

const DOT_COLOR: Record<SyncStatus, string> = {
  syncing: '#E6C699', // amber — pulsing
  synced: '#4CAF50', // green
  failed: '#E57373', // soft red
}

const STATUS_LABEL: Record<SyncStatus, string> = {
  syncing: 'Syncing…',
  synced: 'Synced to atomic time standards',
  failed: 'Using device time — accuracy may vary',
}

export function SyncStatusIndicator({ status }: SyncStatusIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <span
        className={status === 'syncing' ? 'animate-pulse' : ''}
        style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          flexShrink: 0,
          backgroundColor: DOT_COLOR[status],
        }}
      />
      <span className="text-xs font-mono" style={{ color: 'var(--label-primary)' }}>
        {STATUS_LABEL[status]}
      </span>
    </div>
  )
}
