'use client'

import { useEffect, useRef, useState } from 'react'
import { useNTPSync } from '@/hooks/useNTPSync'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useWatchLog } from '@/hooks/useWatchLog'
import { getLocalTimezone } from '@/lib/timezone'
import { UtilityBar } from '@/components/section1/UtilityBar'
import { LatencyWarningBanner } from '@/components/section1/LatencyWarningBanner'
import { TimeHMS } from '@/components/section1/TimeHMS'
import { AMPMIndicator } from '@/components/section1/AMPMIndicator'
import { PrimaryTimezoneLabel } from '@/components/section1/PrimaryTimezoneLabel'
import { SyncStatusIndicator } from '@/components/section1/SyncStatusIndicator'
import { TimeFormatToggle } from '@/components/section1/TimeFormatToggle'
import { TimezoneStrip } from '@/components/section1/TimezoneStrip'
import { WatchSettingTip } from '@/components/section1/WatchSettingTip'
import { ScrollCue } from '@/components/section1/ScrollCue'
import { WatchLogDrawer } from '@/components/watchlog/WatchLogDrawer'
import { TriggerCPrompt } from '@/components/watchlog/TriggerCPrompt'
import { PollSection } from '@/components/section2/PollSection'
import { STORAGE_KEYS } from '@/lib/storage-keys'
import type { TipBarMode } from '@/types/watchlog'

export default function Home() {
  const { getDisplayTime, syncStatus, latencyMs, manualSync } = useNTPSync()
  const [is24h, setIs24h] = useLocalStorage<boolean>(STORAGE_KEYS.TIME_FORMAT, true)
  const [isPM, setIsPM] = useState(false)
  const tzRef = useRef<string>('UTC')

  // Watch log
  const { watches, syncLog, addWatch, removeWatch, logSync, getLastSyncedFor } = useWatchLog()

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showTriggerC, setShowTriggerC] = useState(false)
  const [lastVisit, setLastVisit] = useState<number | null>(null)
  const triggerCFired = useRef(false)

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
        10,
      )
      setIsPM(h >= 12)
    }, 1000)
    return () => clearInterval(interval)
  }, [getDisplayTime])

  // Record last visit timestamp on mount (reads previous, writes current)
  useEffect(() => {
    const prevVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT)
    setLastVisit(prevVisit ? Number(prevVisit) : null)
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, Date.now().toString())
  }, [])

  // Tip bar mode (derived from visit history + watch count)
  const tipBarMode: TipBarMode =
    lastVisit === null
      ? 'tip'
      : watches.length === 0
        ? 'return-no-watches'
        : watches.length === 1
          ? 'return-one-watch'
          : 'return-multi-watches'

  // Most recent sync across all tracked watches (for WatchSettingTip "last set" label)
  const mostRecentSync =
    watches.length > 0
      ? watches.reduce(
          (max, w) => {
            const t = getLastSyncedFor(w.id)
            return t !== null && (max === null || t > max) ? t : max
          },
          null as number | null,
        )
      : null

  // Trigger C: fires once per session at :00 seconds, return visits only
  useEffect(() => {
    if (triggerCFired.current) return
    const interval = setInterval(() => {
      if (!lastVisit || triggerCFired.current || tipBarMode === 'tip') return
      const seconds = Math.floor(getDisplayTime() / 1000) % 60
      if (seconds === 0) {
        triggerCFired.current = true
        setShowTriggerC(true)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [lastVisit, tipBarMode, getDisplayTime])

  // Log sync for a specific watch with NTP/device fallback
  const handleLogSync = (watchId: string) => {
    const syncedAt = syncStatus === 'synced' ? getDisplayTime() : Date.now()
    const source: 'ntp' | 'device' = syncStatus === 'synced' ? 'ntp' : 'device'
    logSync({ watchId, syncedAt, source })
  }

  // TipBar onLog — mode-aware (no-watches opens drawer, one-watch logs directly)
  const handleTipBarLog = () => {
    if (tipBarMode === 'return-no-watches') {
      setDrawerOpen(true)
    } else if (tipBarMode === 'return-one-watch' && watches[0]) {
      handleLogSync(watches[0].id)
    }
  }

  // TriggerC onLog — routes by watch count
  const handleTriggerLog = () => {
    setShowTriggerC(false)
    if (watches.length === 0) {
      setDrawerOpen(true)
    } else if (watches.length === 1) {
      handleLogSync(watches[0].id)
    } else {
      setDrawerOpen(true)
    }
  }

  return (
    <main style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Latency warning — sticky at top of main, spans full viewport width */}
      <LatencyWarningBanner latencyMs={latencyMs} />

      {/* ── Section 1: Time Instrument ── */}
      <section
        className="relative flex flex-col items-center justify-center px-4"
        style={{ minHeight: '100dvh' }}
      >
        {/* Utility bar — top right (watch log | dark mode | sync) */}
        <div className="absolute top-4 right-4">
          <UtilityBar
            syncStatus={syncStatus}
            manualSync={manualSync}
            watches={watches}
            onOpenDrawer={() => setDrawerOpen(true)}
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

          {/* Sync status + time format toggle — Phase 1 layout */}
          <div className="flex items-center gap-2">
            <SyncStatusIndicator status={syncStatus} />
            <TimeFormatToggle is24h={is24h} onChange={setIs24h} />
          </div>

          {/* Secondary clocks strip */}
          <TimezoneStrip getDisplayTime={getDisplayTime} />

          {/* Trigger C: :00 prompt (return visits, once per session) */}
          {showTriggerC && (
            <TriggerCPrompt onLog={handleTriggerLog} onDismiss={() => setShowTriggerC(false)} />
          )}

          {/* Watch-setting tip / return-visit prompt */}
          <WatchSettingTip
            mode={tipBarMode}
            watches={watches}
            lastVisit={lastVisit}
            lastSyncedAt={mostRecentSync}
            onLog={handleTipBarLog}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
        </div>

        {/* Scroll cue */}
        <ScrollCue />
      </section>

      {/* ── Section 2: Poll + Waitlist ── */}
      <PollSection />

      {/* Watch log drawer — renders outside section to avoid stacking-context issues */}
      <WatchLogDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        watches={watches}
        syncLog={syncLog}
        onRemove={removeWatch}
        onAddWatch={addWatch}
        onLogSync={handleLogSync}
      />
    </main>
  )
}
