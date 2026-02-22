'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface LatencyWarningBannerProps {
  latencyMs: number | null
}

export function LatencyWarningBanner({ latencyMs }: LatencyWarningBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  // Reset dismissal when latency changes (new sync)
  useEffect(() => {
    setDismissed(false)
  }, [latencyMs])

  // Check sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem('atomictime_latency_dismissed') === 'true') {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('atomictime_latency_dismissed', 'true')
  }

  const show = !dismissed && latencyMs !== null && latencyMs > 200

  if (!show) return null

  return (
    <div
      className="w-full flex items-center justify-between px-4 py-2 text-xs font-mono"
      style={{
        backgroundColor: 'rgba(120, 53, 15, 0.8)',
        color: '#D97706',
        borderBottom: '1px solid rgba(217, 119, 6, 0.3)',
      }}
    >
      <span>Connection is slow ({latencyMs}ms) — time may be less accurate.</span>
      <button
        onClick={handleDismiss}
        className="ml-4 hover:opacity-70 cursor-pointer"
        aria-label="Dismiss latency warning"
      >
        <X size={14} />
      </button>
    </div>
  )
}
