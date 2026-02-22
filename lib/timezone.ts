/**
 * Returns the user's local IANA timezone.
 * Never returns UTC unless the user is actually in UTC.
 */
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Formats a timestamp into HH, MM, SS components in the given timezone.
 */
export function formatTimeComponents(
  timestamp: number,
  timezone: string
): { hours: number; minutes: number; seconds: number; isPM: boolean } {
  const date = new Date(timestamp)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10)

  const hours24 = get('hour')
  return {
    hours: hours24,
    minutes: get('minute'),
    seconds: get('second'),
    isPM: hours24 >= 12,
  }
}

/**
 * Formats HH:MM for a secondary clock given UTC offset in minutes.
 */
export function formatSecondaryHHMM(
  timestamp: number,
  offsetMinutes: number
): { hours: number; minutes: number } {
  // Apply UTC offset: timestamp is already in UTC ms
  const utcMs = timestamp + offsetMinutes * 60 * 1000
  const d = new Date(utcMs)
  return {
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
  }
}

/**
 * Returns a display label for a timezone: e.g. "SGT · UTC+8"
 */
export function getTimezoneLabel(timezone: string): string {
  const date = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  }).formatToParts(date)

  const abbr = parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone

  // Get UTC offset
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset',
  })
  const offsetPart = formatter
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value ?? ''

  // offsetPart is like "GMT+08:00" or "GMT-05:00"
  const match = offsetPart.match(/GMT([+-]\d{2}:\d{2})/)
  const offset = match ? `UTC${match[1]}` : ''

  return `${abbr} · ${offset}`
}

/**
 * Returns day + date string: e.g. "Wed, 19 Feb"
 */
export function getDayDateLabel(timestamp: number, timezone: string): string {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}
