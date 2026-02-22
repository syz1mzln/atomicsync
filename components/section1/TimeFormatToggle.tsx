'use client'

interface TimeFormatToggleProps {
  is24h: boolean
  onChange: (is24h: boolean) => void
}

export function TimeFormatToggle({ is24h, onChange }: TimeFormatToggleProps) {
  const activeStyle = {
    border: '1px solid var(--digit-primary)',
    color: 'var(--digit-primary)',
    background: 'transparent',
  }
  const inactiveStyle = {
    border: '1px solid transparent',
    color: 'var(--label-muted)',
    background: 'transparent',
  }

  return (
    <div className="flex items-center gap-1 min-h-[44px]">
      <button
        onClick={() => onChange(true)}
        className="text-xs font-mono px-2 py-0.5 rounded cursor-pointer transition-colors"
        style={is24h ? activeStyle : inactiveStyle}
        aria-pressed={is24h}
      >
        24h
      </button>
      <button
        onClick={() => onChange(false)}
        className="text-xs font-mono px-2 py-0.5 rounded cursor-pointer transition-colors"
        style={!is24h ? activeStyle : inactiveStyle}
        aria-pressed={!is24h}
      >
        12h
      </button>
    </div>
  )
}
