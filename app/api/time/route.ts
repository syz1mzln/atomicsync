import { NextResponse } from 'next/server'

export async function GET() {
  const before = Date.now()

  // For local dev: return server time directly.
  // In production, replace with NTP pool query (pool.ntp.org → TimeAPI.io → fallback).
  let timestamp = Date.now()
  let source = 'server'
  let fallback_used = false

  // Attempt TimeAPI.io as a real external sync (HTTP-based, works from serverless)
  try {
    const res = await fetch('https://timeapi.io/api/time/current/zone?timeZone=Etc/UTC', {
      signal: AbortSignal.timeout(2000),
    })
    if (res.ok) {
      const data = await res.json()
      // TimeAPI returns: { dateTime: "2026-02-20T11:03:45.123", timeZone: "Etc/UTC", ... }
      if (data.dateTime) {
        timestamp = new Date(data.dateTime + 'Z').getTime()
        source = 'timeapi'
      }
    }
  } catch {
    // Fall through to server time
    fallback_used = true
  }

  const server_processing_ms = Date.now() - before

  return NextResponse.json({
    timestamp,
    iso: new Date(timestamp).toISOString(),
    source,
    fallback_used,
    server_processing_ms,
  })
}
