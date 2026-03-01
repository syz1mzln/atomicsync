'use client'

import { useEffect, useState } from 'react'
import { VoteOptionCard, Feature } from './VoteOptionCard'
import { EmailRevealSection } from './EmailRevealSection'

const LS_VOTE_KEY = 'atomictime_vote'
const LS_OTHER_KEY = 'atomictime_vote_other'

interface VoteCounts {
  rotation: number | null
  accuracy: number | null
  service: number | null
  other: number | null
}

const VOTE_OPTIONS: {
  feature: Feature
  emoji: string
  title: string
  description: string
}[] = [
  {
    feature: 'rotation',
    emoji: '🔄',
    title: 'Watch rotation tracker',
    description: 'Reminders before your watch stops. Never reset the date again.',
  },
  {
    feature: 'accuracy',
    emoji: '📊',
    title: 'Accuracy drift logger',
    description: 'Log gain/loss per day. Know if your movement is running normally.',
  },
  {
    feature: 'service',
    emoji: '🔧',
    title: 'Service logbook',
    description: 'Track service history, costs, and when each watch is next due.',
  },
  {
    feature: 'other',
    emoji: '✏️',
    title: 'Other',
    description: 'Something else? Tell us what bothers you most.',
  },
]

export function PollSection() {
  // selected: which card is highlighted (UI state — not yet confirmed)
  const [selected, setSelected] = useState<Feature | null>(null)
  // voted: confirmed vote (triggers API + localStorage)
  const [voted, setVoted] = useState<Feature | null>(null)
  const [otherText, setOtherText] = useState<string>('')
  const [counts, setCounts] = useState<VoteCounts>({
    rotation: null,
    accuracy: null,
    service: null,
    other: null,
  })
  const [mounted, setMounted] = useState(false)

  // Load persisted vote on mount
  useEffect(() => {
    setMounted(true)
    const savedVote = localStorage.getItem(LS_VOTE_KEY) as Feature | null
    const savedOther = localStorage.getItem(LS_OTHER_KEY) ?? ''

    if (savedVote) {
      setVoted(savedVote)
      setSelected(savedVote)
      setOtherText(savedOther)
      // Fetch existing counts
      fetch('/api/vote')
        .then((r) => r.json())
        .then((data) => setCounts(data))
        .catch(() => {})
    }
  }, [])

  const handleSelect = (feature: Feature) => {
    setSelected(feature)
  }

  // Called only when Submit button is clicked
  const handleSubmit = async () => {
    if (!selected || voted) return

    const text = selected === 'other' ? otherText : ''
    localStorage.setItem(LS_VOTE_KEY, selected)
    if (selected === 'other' && text) {
      localStorage.setItem(LS_OTHER_KEY, text)
    }
    setVoted(selected)

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: selected, other_text: text || undefined }),
      })
      const data = await res.json()
      setCounts(data)
    } catch {
      // Degraded — counts stay null
    }
  }

  const submitDisabled = selected === 'other' && !otherText.trim()

  const totalVotes = voted ? Object.values(counts).reduce<number>((acc, v) => acc + (v ?? 0), 0) : 0

  if (!mounted) return null

  return (
    <section
      className="flex flex-col items-center justify-center px-4 py-12 md:px-6 md:py-16"
      style={{ minHeight: '100dvh' }}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-lg">
        {/* Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-mono font-medium" style={{ color: 'var(--label-primary)' }}>
            What should we build next?
          </h2>
          <p className="text-sm font-mono" style={{ color: 'var(--label-muted)' }}>
            Vote for the feature you&apos;d use most.
          </p>
        </div>

        {/* Vote cards — always vertical */}
        <div className="flex flex-col gap-3 w-full">
          {VOTE_OPTIONS.map((opt) => (
            <VoteOptionCard
              key={opt.feature}
              feature={opt.feature}
              emoji={opt.emoji}
              title={opt.title}
              description={opt.description}
              selected={selected === opt.feature}
              voted={voted}
              count={counts[opt.feature]}
              totalVotes={totalVotes}
              onSelect={handleSelect}
              onOtherTextChange={opt.feature === 'other' ? setOtherText : undefined}
            />
          ))}
        </div>

        {/* Global Submit — appears when a card is selected, before vote is confirmed */}
        {selected && !voted && (
          <div className="flex flex-col items-stretch gap-2 w-full">
            {selected === 'other' && (
              <span
                className="text-xs font-mono text-right"
                style={{ color: 'var(--label-muted)' }}
              >
                {140 - otherText.length} chars left
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitDisabled}
              className="w-full text-sm font-mono px-4 py-3 rounded-lg transition-opacity"
              style={{
                backgroundColor: 'var(--digit-primary)',
                color: 'var(--bg-base)',
                opacity: submitDisabled ? 0.4 : 1,
                cursor: submitDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              Submit vote →
            </button>
          </div>
        )}

        {/* Email reveal — shown post-vote */}
        {voted && <EmailRevealSection voted={voted} otherText={otherText || undefined} />}
      </div>
    </section>
  )
}
