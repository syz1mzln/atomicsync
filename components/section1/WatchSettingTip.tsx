'use client'

import { useState } from 'react'

const STEPS = [
  '① Pull crown to position 2',
  '② Wait for seconds to reach :00',
  '③ Set hands to match display',
  '④ Push crown back in',
]

export function WatchSettingTip() {
  const [expanded, setExpanded] = useState(false)

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
    <div
      className="w-full max-w-xl mx-auto mt-3 px-4 py-3"
      style={{
        borderTop: '1px solid var(--tip-border)',
        borderBottom: '1px solid var(--tip-border)',
      }}
    >
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
