'use client'

import { useLocalStorage } from './useLocalStorage'
import type { Watch, SyncLog } from '@/types/watchlog'

export function useWatchLog() {
  const [watches, setWatches] = useLocalStorage<Watch[]>('atomictime_watches', [])
  const [syncLog, setSyncLog] = useLocalStorage<SyncLog[]>('atomictime_sync_log', [])

  const addWatch = (data: Omit<Watch, 'id' | 'addedAt'>) => {
    const newWatch: Watch = {
      ...data,
      id: crypto.randomUUID(),
      addedAt: Date.now(),
    }
    setWatches([...watches, newWatch])
    return newWatch
  }

  const removeWatch = (id: string) => {
    setWatches(watches.filter((w) => w.id !== id))
  }

  const logSync = (entry: SyncLog) => {
    setSyncLog([...syncLog, entry])
  }

  const getLastSyncedFor = (watchId: string): number | null => {
    const entries = syncLog.filter((e) => e.watchId === watchId)
    if (entries.length === 0) return null
    return Math.max(...entries.map((e) => e.syncedAt))
  }

  return { watches, syncLog, addWatch, removeWatch, logSync, getLastSyncedFor }
}
