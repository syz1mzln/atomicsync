'use client'

import { useState, useRef } from 'react'
import type { TipBarMode, Watch } from '@/types/watchlog'

const STEPS = [
  '① Pull crown to position 2',
  '② Wait for seconds to reach :00',
  '③ Set hands to match display',
  '④ Push crown back in',
]

function formatDaysAgo(epochMs: number): string {
  const diffMs = Date.now() - epochMs
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  return `${diffDays} days ago`
}

interface WatchSettingTipProps {
  mode: TipBarMode
  watches: Watch[]
  lastVisit: number | null
  lastSyncedAt: number | null
  onLog: () => void
  onOpenMiniPicker: () => void
}

const TIP_BAR_STYLE = {
  borderTop: '1px solid var(--tip-border)',
  borderBottom: '1px solid var(--tip-border)',
}

export function WatchSettingTip({
  mode,
  watches,
  lastVisit,
  lastSyncedAt,
  onLog,
  onOpenMiniPicker,
}: WatchSettingTipProps) {
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [loggedConfirm, setLoggedConfirm] = useState(false)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleLog = () => {
    onLog()
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    setLoggedConfirm(true)
    confirmTimerRef.current = setTimeout(() => setLoggedConfirm(false), 1500)
  }

  const lastSetLabel = lastSyncedAt ? `last set ${formatDaysAgo(lastSyncedAt)}` : 'never set'

  if (mode === 'tip') {
    if (!expanded) {
      return (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setExpanded(true)}
            className="text-xs font-mono"
            style={{ color: 'var(--label-muted)' }}
          >
            How to set your watch ↑
          </button>
        </div>
      )
    }

    return (
      <div className="w-full max-w-xl mx-auto mt-3 px-4 py-3" style={TIP_BAR_STYLE}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            {STEPS.map((step) => (
              <span
                key={step}
                className="text-xs font-mono"
                style={{ color: 'var(--label-primary)' }}
              >
                {step}
              </span>
            ))}
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="text-xs font-mono shrink-0 leading-none mt-0.5"
            style={{ color: 'var(--label-muted)' }}
            aria-label="Close tip"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'return-no-watches') {
    if (dismissed) return null

    return (
      <div
        className="w-full max-w-xl mx-auto mt-3 px-4 py-2 flex items-center justify-between gap-4"
        style={TIP_BAR_STYLE}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--label-primary)' }}>
          Last visit: {lastVisit ? formatDaysAgo(lastVisit) : '—'}. Log your watch?
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleLog}
            className="text-xs font-mono min-h-[44px]"
            style={{ color: 'var(--label-primary)' }}
          >
            {loggedConfirm ? 'Logged ✓' : 'Log sync →'}
          </button>
          <button
            onClick={() => {
              sessionStorage.setItem('atomictime_log_prompt_dismissed', 'true')
              setDismissed(true)
            }}
            aria-label="Dismiss"
            className="text-xs font-mono min-h-[44px]"
            style={{ color: 'var(--label-muted)' }}
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'return-one-watch') {
    const watch = watches[0]
    const displayLabel = watch ? (watch.nickname ?? watch.model) : ''
    const buttonModel = watch?.model ?? ''

    return (
      <div
        className="w-full max-w-xl mx-auto mt-3 px-4 py-2 flex items-center justify-between gap-4"
        style={TIP_BAR_STYLE}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--label-primary)' }}>
          {displayLabel} · {lastSetLabel}
        </span>
        <button
          onClick={handleLog}
          className="text-xs font-mono shrink-0 min-h-[44px]"
          style={{ color: 'var(--label-primary)' }}
        >
          {loggedConfirm ? 'Logged ✓' : `Set ${buttonModel} →`}
        </button>
      </div>
    )
  }

  // return-multi-watches
  return (
    <div
      className="w-full max-w-xl mx-auto mt-3 px-4 py-2 flex items-center justify-between gap-4"
      style={TIP_BAR_STYLE}
    >
      <span className="text-xs font-mono" style={{ color: 'var(--label-primary)' }}>
        {watches.length} watches tracked · {lastSetLabel}
      </span>
      <button
        onClick={onOpenMiniPicker}
        className="text-xs font-mono shrink-0 min-h-[44px]"
        style={{ color: 'var(--label-primary)' }}
      >
        Mark as Set →
      </button>
    </div>
  )
}
