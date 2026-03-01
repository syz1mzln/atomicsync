'use client'

import { useEffect, useRef } from 'react'

interface TriggerCPromptProps {
  onLog: () => void
  onDismiss: () => void
}

export function TriggerCPrompt({ onLog, onDismiss }: TriggerCPromptProps) {
  const dismissedRef = useRef(false)

  const dismiss = () => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    onDismiss()
  }

  useEffect(() => {
    const autoId = setTimeout(dismiss, 5000)
    return () => clearTimeout(autoId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="flex items-center justify-between px-4 py-2 mt-2"
      style={{ color: 'var(--label-primary)' }}
    >
      <span className="text-xs font-mono">Just set your watch?</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onLog}
          className="text-xs font-mono"
          style={{ color: 'var(--label-primary)' }}
        >
          Log it →
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-xs font-mono"
          style={{ color: 'var(--label-muted)' }}
        >
          ×
        </button>
      </div>
    </div>
  )
}
