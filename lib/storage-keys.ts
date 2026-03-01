/**
 * Centralized localStorage / sessionStorage key registry.
 * Import STORAGE_KEYS instead of using raw string literals.
 */
export const STORAGE_KEYS = {
  DARK_MODE: 'atomictime_dark_mode',
  LATENCY_DISMISSED: 'atomictime_latency_dismissed',
  TIMEZONES: 'atomictime_timezones',
  TIMEZONES_LEGACY: 'atomictime_tz2',
  VOTE: 'atomictime_vote',
  VOTE_OTHER: 'atomictime_vote_other',
  WATCHES: 'atomictime_watches',
  SYNC_LOG: 'atomictime_sync_log',
  LAST_VISIT: 'atomictime_last_visit',
  TIME_FORMAT: 'atomictime_time_format_24h',
} as const
