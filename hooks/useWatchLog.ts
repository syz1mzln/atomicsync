'use client'

import { useLocalStorage } from './useLocalStorage'
import type { Watch, SyncLog } from '@/types/watchlog'
import { getLastSyncedAt } from '@/lib/watch-utils'
import { STORAGE_KEYS } from '@/lib/storage-keys'

export function useWatchLog() {
  const [watches, setWatches] = useLocalStorage<Watch[]>(STORAGE_KEYS.WATCHES, [])
  const [syncLog, setSyncLog] = useLocalStorage<SyncLog[]>(STORAGE_KEYS.SYNC_LOG, [])

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

  const getLastSyncedFor = (watchId: string): number | null => getLastSyncedAt(watchId, syncLog)

  return { watches, syncLog, addWatch, removeWatch, logSync, getLastSyncedFor }
}
