'use client'

import { useEffect, useRef, useState } from 'react'
import { getDayDateLabel, getLocalTimezone, getTimezoneLabel } from '@/lib/timezone'

interface PrimaryTimezoneLabelProps {
  getDisplayTime: () => number
}

export function PrimaryTimezoneLabel({ getDisplayTime }: PrimaryTimezoneLabelProps) {
  const [label, setLabel] = useState('')
  const timezone = useRef<string>('UTC')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timezone.current = getLocalTimezone()

    const update = () => {
      const tz = timezone.current
      const tzLabel = getTimezoneLabel(tz)
      const dayDate = getDayDateLabel(getDisplayTime(), tz)
      setLabel(`${tzLabel} · ${dayDate}`)
    }

    update()
    intervalRef.current = setInterval(update, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [getDisplayTime])

  return (
    <p
      className="text-xs font-mono tracking-wide mt-1"
      style={{ color: 'var(--label-primary)' }}
    >
      {label}
    </p>
  )
}
