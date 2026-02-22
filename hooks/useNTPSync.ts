'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type SyncStatus = 'syncing' | 'synced' | 'failed'

interface NTPResponse {
  timestamp: number
  iso: string
  source: string
  fallback_used: boolean
  server_processing_ms: number
}

interface UseNTPSyncResult {
  getDisplayTime: () => number
  syncStatus: SyncStatus
  latencyMs: number | null
  manualSync: () => void
}

export function useNTPSync(): UseNTPSyncResult {
  const offsetRef = useRef<number>(0)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('syncing')
  const [latencyMs, setLatencyMs] = useState<number | null>(null)
  const isSyncingRef = useRef(false)
  const lastSyncRef = useRef<number>(0)

  const performSync = useCallback(async () => {
    if (isSyncingRef.current) return
    isSyncingRef.current = true
    setSyncStatus('syncing')

    try {
      const t1 = Date.now()
      const res = await fetch('/api/time', { cache: 'no-store' })
      const t2 = Date.now()

      if (!res.ok) throw new Error('sync failed')

      const data: NTPResponse = await res.json()
      const rtt = t2 - t1
      // offset = serverTimestamp - t1 + RTT/2
      // (accounts for one-way latency from server to client)
      offsetRef.current = data.timestamp - t1 + rtt / 2
      lastSyncRef.current = Date.now()

      setLatencyMs(rtt)
      setSyncStatus('synced')
    } catch {
      setSyncStatus('failed')
    } finally {
      isSyncingRef.current = false
    }
  }, [])

  // Initial sync
  useEffect(() => {
    performSync()
  }, [performSync])

  // Auto re-sync every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      performSync()
    }, 60_000)
    return () => clearInterval(interval)
  }, [performSync])

  // Re-sync on tab focus (Page Visibility API)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Only resync if last sync was >30s ago
        if (Date.now() - lastSyncRef.current > 30_000) {
          performSync()
        }
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [performSync])

  // Manual sync — debounced to max 1 per 2 seconds
  const manualSync = useCallback(() => {
    if (Date.now() - lastSyncRef.current < 2_000) return
    performSync()
  }, [performSync])

  // Returns current display time (device clock + NTP offset)
  const getDisplayTime = useCallback((): number => {
    return Date.now() + offsetRef.current
  }, [])

  return { getDisplayTime, syncStatus, latencyMs, manualSync }
}
