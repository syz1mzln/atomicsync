'use client'

import { useEffect, useRef, useState } from 'react'
import { formatTimeComponents, getLocalTimezone } from '@/lib/timezone'

interface TimeHMSProps {
  getDisplayTime: () => number
  is24h: boolean
}

interface TimeState {
  hours: number
  minutes: number
  seconds: number
  isPM: boolean
}

const DIGIT_FONT: React.CSSProperties = {
  fontFamily: "'DSEG7Classic', 'Courier New', monospace",
  color: 'var(--digit-primary)',
  letterSpacing: '-0.02em',
}

const COLON_FONT: React.CSSProperties = {
  fontFamily: "'DSEG7Classic', 'Courier New', monospace",
  color: 'var(--digit-colon)',
}

// Mobile: 13vw scales clock with screen width (≈50px at 390px, ≈83px at 640px).
// md–lg: fixed 11rem (safe on 1024px laptops). xl+: fixed 14rem for large displays.
const SIZE_CLASS = 'text-[13vw] md:text-[11rem] xl:text-[14rem] font-bold'

export function TimeHMS({ getDisplayTime, is24h }: TimeHMSProps) {
  const [time, setTime] = useState<TimeState>({ hours: 0, minutes: 0, seconds: 0, isPM: false })
  const timezone = useRef<string>('UTC')
  const rafRef = useRef<number>(0)
  const lastSecond = useRef<number>(-1)

  useEffect(() => {
    timezone.current = getLocalTimezone()
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = getDisplayTime()
      const components = formatTimeComponents(now, timezone.current)

      if (components.seconds !== lastSecond.current) {
        lastSecond.current = components.seconds
        setTime(components)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [getDisplayTime])

  const displayHours = is24h ? time.hours : time.hours % 12 === 0 ? 12 : time.hours % 12

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center leading-none select-none">
      <span className={SIZE_CLASS} style={DIGIT_FONT}>
        {pad(displayHours)}
      </span>
      <span className={`${SIZE_CLASS} pb-1`} style={COLON_FONT}>
        :
      </span>
      <span className={SIZE_CLASS} style={DIGIT_FONT}>
        {pad(time.minutes)}
      </span>
      <span className={`${SIZE_CLASS} pb-1`} style={COLON_FONT}>
        :
      </span>
      <span className={SIZE_CLASS} style={DIGIT_FONT}>
        {pad(time.seconds)}
      </span>
    </div>
  )
}
