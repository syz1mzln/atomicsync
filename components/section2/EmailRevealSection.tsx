'use client'

import { useState } from 'react'
import { Feature } from './VoteOptionCard'

const FEATURE_NAMES: Record<Feature, string> = {
  rotation: 'Watch rotation tracker',
  accuracy: 'Accuracy drift logger',
  service: 'Service logbook',
  other: 'your idea',
}

interface EmailRevealSectionProps {
  voted: Feature
  otherText?: string
}

type EmailState = 'idle' | 'loading' | 'success' | 'skipped'

export function EmailRevealSection({ voted, otherText }: EmailRevealSectionProps) {
  const [email, setEmail] = useState('')
  const [emailState, setEmailState] = useState<EmailState>('idle')
  const [error, setError] = useState('')

  const featureName = FEATURE_NAMES[voted]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || emailState === 'loading') return

    setEmailState('loading')
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          voted_feature: voted,
          other_text: voted === 'other' ? otherText : undefined,
        }),
      })

      if (!res.ok) throw new Error('Failed')
      setEmailState('success')
    } catch {
      setError('Something went wrong. Try again.')
      setEmailState('idle')
    }
  }

  const handleSkip = () => {
    setEmailState('skipped')
  }

  if (emailState === 'skipped') {
    return (
      <p className="text-sm font-mono text-center mt-6" style={{ color: 'var(--label-muted)' }}>
        Vote counted. Thanks.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-sm mx-auto">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--label-primary)' }}>
        Get notified when <span style={{ color: 'var(--digit-primary)' }}>{featureName}</span>{' '}
        ships.
      </p>

      {emailState === 'success' ? (
        <p className="text-sm font-mono text-center" style={{ color: 'var(--digit-primary)' }}>
          You&apos;re in.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={emailState === 'loading'}
              className="flex-1 text-sm font-mono rounded px-3 py-2 outline-none"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--digit-primary) 5%, transparent)',
                border: '1px solid var(--tip-border)',
                color: 'var(--label-primary)',
              }}
            />
            <button
              type="submit"
              disabled={emailState === 'loading' || !email.trim()}
              className="text-sm font-mono px-4 py-2 rounded transition-opacity"
              style={{
                backgroundColor: 'var(--digit-primary)',
                color: 'var(--bg-base)',
                opacity: emailState === 'loading' || !email.trim() ? 0.6 : 1,
              }}
            >
              {emailState === 'loading' ? '...' : 'Notify me'}
            </button>
          </div>

          {error && (
            <p className="text-xs font-mono" style={{ color: 'var(--label-muted)' }}>
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-mono text-center underline underline-offset-2"
            style={{ color: 'var(--label-muted)' }}
          >
            No thanks
          </button>

          <p className="text-xs font-mono text-center" style={{ color: 'var(--label-muted)' }}>
            No spam. One email when it ships.
          </p>
        </form>
      )}
    </div>
  )
}
