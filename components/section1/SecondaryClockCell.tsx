'use client'

import { useEffect, useRef, useState } from 'react'
import { formatSecondaryHHMM } from '@/lib/timezone'
import { City } from '@/lib/cities'
import { TimezoneSelector } from './TimezoneSelector'

interface SecondaryClockCellProps {
  city: City
  getDisplayTime: () => number
  onRemove: () => void
  onChange: (city: City) => void
}

export function SecondaryClockCell({ city, getDisplayTime, onRemove, onChange }: SecondaryClockCellProps) {
  const [time, setTime] = useState({ hours: 0, minutes: 0 })
  const [selectorOpen, setSelectorOpen] = useState(false)
  const rafRef = useRef<number>(0)
  const lastMinute = useRef<number>(-1)

  useEffect(() => {
    const tick = () => {
      const { hours, minutes } = formatSecondaryHHMM(getDisplayTime(), city.offsetMinutes)
      if (minutes !== lastMinute.current) {
        lastMinute.current = minutes
        setTime({ hours, minutes })
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [getDisplayTime, city.offsetMinutes])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2">
      {/* Time + controls row */}
      <div className="flex items-start gap-1.5">
        {/* Time display — large tap target, opens selector */}
        <TimezoneSelector
          open={selectorOpen}
          onOpenChange={setSelectorOpen}
          onSelect={onChange}
          selectedCity={city.city}
          trigger={
            <div
              className="text-3xl font-bold leading-none select-none cursor-pointer hover:opacity-70 transition-opacity"
              role="button"
              title="Change timezone"
              style={{
                fontFamily: "'DSEG7Classic', 'Courier New', monospace",
                color: 'var(--digit-primary)',
                opacity: 0.5,
              }}
            >
              {pad(time.hours)}
              <span style={{ color: 'var(--digit-colon)' }}>:</span>
              {pad(time.minutes)}
            </div>
          }
        />

        {/* Vertically stacked: ↺ above × */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          <button
            onClick={() => setSelectorOpen(true)}
            className="text-xs cursor-pointer hover:opacity-70 transition-opacity leading-none"
            style={{ color: 'var(--label-muted)' }}
            title="Change timezone"
          >
            ↺
          </button>
          <button
            onClick={onRemove}
            className="text-xs cursor-pointer hover:opacity-70 transition-opacity leading-none"
            style={{ color: 'var(--label-muted)' }}
            title="Remove"
          >
            ×
          </button>
        </div>
      </div>

      {/* City label — centered below */}
      <span className="text-xs font-mono text-center" style={{ color: 'var(--label-muted)' }}>
        {city.city} {city.utcOffset}
      </span>
    </div>
  )
}
