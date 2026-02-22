'use client'

import { useEffect, useRef, useState } from 'react'
import { useNTPSync } from '@/hooks/useNTPSync'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { getLocalTimezone } from '@/lib/timezone'
import { UtilityBar } from '@/components/section1/UtilityBar'
import { LatencyWarningBanner } from '@/components/section1/LatencyWarningBanner'
import { TimeHMS } from '@/components/section1/TimeHMS'
import { AMPMIndicator } from '@/components/section1/AMPMIndicator'
import { PrimaryTimezoneLabel } from '@/components/section1/PrimaryTimezoneLabel'
import { SyncStatusIndicator } from '@/components/section1/SyncStatusIndicator'
import { TimezoneStrip } from '@/components/section1/TimezoneStrip'
import { WatchSettingTip } from '@/components/section1/WatchSettingTip'
import { ScrollCue } from '@/components/section1/ScrollCue'
import { PollSection } from '@/components/section2/PollSection'

export default function Home() {
  const { getDisplayTime, syncStatus, latencyMs, manualSync } = useNTPSync()
  const [is24h, setIs24h] = useLocalStorage<boolean>('atomictime_time_format_24h', true)
  const [isPM, setIsPM] = useState(false)
  const tzRef = useRef<string>('UTC')

  // Track AM/PM for AMPMIndicator when in 12h mode
  useEffect(() => {
    tzRef.current = getLocalTimezone()
    const interval = setInterval(() => {
      const now = new Date(getDisplayTime())
      const h = parseInt(
        new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          hour12: false,
          timeZone: tzRef.current,
        }).format(now),
        10
      )
      setIsPM(h >= 12)
    }, 1000)
    return () => clearInterval(interval)
  }, [getDisplayTime])

  return (
    <main style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Latency warning — sticky at top of main, spans full viewport width */}
      <LatencyWarningBanner latencyMs={latencyMs} />

      {/* ── Section 1: Time Instrument ── */}
      <section
        className="relative flex flex-col items-center justify-center px-4"
        style={{ minHeight: '100dvh' }}
      >
        {/* Utility bar — top right (12/24h | sync | dark mode) */}
        <div className="absolute top-4 right-4">
          <UtilityBar
            syncStatus={syncStatus}
            manualSync={manualSync}
            is24h={is24h}
            onFormat={setIs24h}
          />
        </div>

        {/* Core time display */}
        <div className="flex flex-col items-center gap-3">
          {/* HH:MM:SS + AM/PM */}
          <div className="flex items-end gap-2">
            <TimeHMS getDisplayTime={getDisplayTime} is24h={is24h} />
            {!is24h && <AMPMIndicator isPM={isPM} />}
          </div>

          {/* Timezone label */}
          <PrimaryTimezoneLabel getDisplayTime={getDisplayTime} />

          {/* Sync status */}
          <SyncStatusIndicator status={syncStatus} />

          {/* Secondary clocks strip */}
          <TimezoneStrip getDisplayTime={getDisplayTime} />

          {/* Watch-setting tip */}
          <WatchSettingTip />
        </div>

        {/* Scroll cue */}
        <ScrollCue />
      </section>

      {/* ── Section 2: Poll + Waitlist ── */}
      <PollSection />
    </main>
  )
}
