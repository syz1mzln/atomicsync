import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

type Feature = 'rotation' | 'accuracy' | 'service' | 'other'
const VALID_FEATURES: Feature[] = ['rotation', 'accuracy', 'service', 'other']

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { feature, other_text } = body

  if (!VALID_FEATURES.includes(feature)) {
    return NextResponse.json({ error: 'Invalid feature' }, { status: 400 })
  }

  const supabase = getSupabaseClient()

  if (!supabase) {
    // No Supabase — return the user's own vote as the only known count
    const localCounts: Record<Feature, number> = { rotation: 0, accuracy: 0, service: 0, other: 0 }
    localCounts[feature as Feature] = 1
    return NextResponse.json(localCounts)
  }

  // Insert vote
  const insertData: { feature: Feature; other_text?: string } = { feature }
  if (feature === 'other' && other_text) {
    insertData.other_text = String(other_text).slice(0, 140)
  }

  await supabase.from('votes').insert(insertData)

  // Return aggregate counts
  const { data } = await supabase
    .from('votes')
    .select('feature')

  const counts: Record<Feature, number> = {
    rotation: 0,
    accuracy: 0,
    service: 0,
    other: 0,
  }

  if (data) {
    for (const row of data) {
      if (VALID_FEATURES.includes(row.feature)) {
        counts[row.feature as Feature]++
      }
    }
  }

  return NextResponse.json(counts)
}

export async function GET() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return NextResponse.json({
      rotation: null,
      accuracy: null,
      service: null,
      other: null,
    })
  }

  const { data } = await supabase.from('votes').select('feature')

  const counts: Record<Feature, number> = {
    rotation: 0,
    accuracy: 0,
    service: 0,
    other: 0,
  }

  if (data) {
    for (const row of data) {
      if (VALID_FEATURES.includes(row.feature)) {
        counts[row.feature as Feature]++
      }
    }
  }

  return NextResponse.json(counts)
}
