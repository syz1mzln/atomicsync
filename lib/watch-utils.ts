import type { SyncLog } from '@/types/watchlog'

/**
 * Returns the most recent sync timestamp for a given watch, or null if never synced.
 */
export function getLastSyncedAt(watchId: string, syncLog: SyncLog[]): number | null {
  const entries = syncLog.filter((e) => e.watchId === watchId)
  return entries.length === 0 ? null : Math.max(...entries.map((e) => e.syncedAt))
}
