import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

type Feature = 'rotation' | 'accuracy' | 'service' | 'other'
const VALID_FEATURES: Feature[] = ['rotation', 'accuracy', 'service', 'other']

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { email, voted_feature, other_text } = body

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const supabase = getSupabaseClient()

  if (!supabase) {
    // Graceful degradation
    return NextResponse.json({ success: true })
  }

  const insertData: {
    email: string
    voted_feature?: Feature
    other_text?: string
  } = { email: email.trim().toLowerCase() }

  if (voted_feature && VALID_FEATURES.includes(voted_feature)) {
    insertData.voted_feature = voted_feature
  }

  if (voted_feature === 'other' && other_text) {
    insertData.other_text = String(other_text).slice(0, 140)
  }

  const { error } = await supabase.from('waitlist').insert(insertData)

  // Treat duplicate email as success (unique constraint violation)
  if (error && !error.message.includes('unique')) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
