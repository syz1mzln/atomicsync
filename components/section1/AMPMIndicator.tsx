'use client'

interface AMPMIndicatorProps {
  isPM: boolean
}

export function AMPMIndicator({ isPM }: AMPMIndicatorProps) {
  return (
    <span
      className="text-sm self-start mt-4 ml-1 font-mono"
      style={{ color: 'var(--label-primary)' }}
    >
      {isPM ? 'PM' : 'AM'}
    </span>
  )
}
