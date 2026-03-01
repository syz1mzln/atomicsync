/**
 * Formats elapsed days from an epoch timestamp.
 * Returns 'today', 'yesterday', or 'N days ago'.
 */
export function formatDaysAgo(epochMs: number): string {
  const diffDays = Math.floor((Date.now() - epochMs) / 86_400_000)
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  return `${diffDays} days ago`
}

/**
 * Formats a nullable sync timestamp for watch log display.
 * Returns 'never set', 'set today', 'set yesterday', or 'set N days ago'.
 */
export function formatLastSet(syncedAt: number | null): string {
  if (syncedAt === null) return 'never set'
  const diffDays = Math.floor((Date.now() - syncedAt) / 86_400_000)
  if (diffDays === 0) return 'set today'
  if (diffDays === 1) return 'set yesterday'
  return `set ${diffDays} days ago`
}
