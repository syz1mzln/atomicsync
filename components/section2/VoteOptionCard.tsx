'use client'

import { useState } from 'react'

export type Feature = 'rotation' | 'accuracy' | 'service' | 'other'

interface VoteOptionCardProps {
  feature: Feature
  emoji: string
  title: string
  description: string
  // selected = card is highlighted (UI state)
  selected: boolean
  // voted = a vote has been confirmed (locks all cards)
  voted: Feature | null
  // count and total for inline vote bar (shown post-vote)
  count: number | null
  totalVotes: number
  onSelect: (feature: Feature) => void
  // Notifies parent of textarea content changes (Other card only)
  onOtherTextChange?: (text: string) => void
}

export function VoteOptionCard({
  feature,
  emoji,
  title,
  description,
  selected,
  voted,
  count,
  totalVotes,
  onSelect,
  onOtherTextChange,
}: VoteOptionCardProps) {
  const [otherText, setOtherText] = useState('')

  const hasVoted = voted !== null
  const isThisVoted = voted === feature
  const isDimmed = hasVoted && !isThisVoted

  const handleCardClick = () => {
    if (hasVoted) return
    // All cards: click selects only — no direct submission
    onSelect(feature)
  }

  // Inline vote bar percentage
  const pct =
    hasVoted && count !== null && totalVotes > 0 ? Math.round((count / totalVotes) * 100) : null

  return (
    <div
      className="rounded-lg border p-4 cursor-pointer transition-all duration-200 flex flex-col gap-2 w-full"
      style={{
        borderColor: selected || isThisVoted ? 'var(--digit-primary)' : 'var(--tip-border)',
        backgroundColor:
          selected || isThisVoted
            ? 'color-mix(in srgb, var(--digit-primary) 8%, transparent)'
            : 'transparent',
        opacity: isDimmed ? 0.4 : 1,
        cursor: hasVoted ? 'default' : 'pointer',
      }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!hasVoted && (e.key === 'Enter' || e.key === ' ')) handleCardClick()
      }}
      aria-pressed={selected || isThisVoted}
    >
      {/* Card header */}
      <div className="flex items-start gap-2">
        <span className="text-base leading-none mt-0.5">{emoji}</span>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span
            className="text-sm font-mono font-medium"
            style={{
              color: selected || isThisVoted ? 'var(--digit-primary)' : 'var(--label-primary)',
            }}
          >
            {(selected || isThisVoted) && '✓ '}
            {title}
          </span>
          <span className="text-xs font-mono" style={{ color: 'var(--label-muted)' }}>
            {description}
          </span>

          {/* Inline vote bar — shown after voting, inside text column */}
          {hasVoted && (
            <div
              className="rounded-full overflow-hidden mt-1"
              style={{
                height: '3px',
                backgroundColor: 'color-mix(in srgb, var(--label-muted) 20%, transparent)',
              }}
            >
              {pct !== null ? (
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isThisVoted ? 'var(--digit-primary)' : 'var(--label-muted)',
                  }}
                />
              ) : null}
            </div>
          )}
        </div>

        {/* Vote stats — right column, shown after voting */}
        {hasVoted && (
          <div className="flex flex-col items-end shrink-0 gap-0.5 ml-2">
            <span
              className="text-sm font-mono font-medium leading-none"
              style={{ color: isThisVoted ? 'var(--digit-primary)' : 'var(--label-muted)' }}
            >
              {count === null ? '—' : pct !== null ? `${pct}%` : '0%'}
            </span>
            {count !== null && (
              <span
                className="text-xs font-mono leading-none"
                style={{ color: 'var(--label-muted)' }}
              >
                {count === 1 ? '1 vote' : `${count} votes`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Other — textarea when selected, before vote is cast */}
      {feature === 'other' && selected && !hasVoted && (
        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
          <textarea
            autoFocus
            maxLength={140}
            value={otherText}
            onChange={(e) => {
              setOtherText(e.target.value)
              onOtherTextChange?.(e.target.value)
            }}
            placeholder="What bothers you most about managing your watches?"
            className="w-full text-xs font-mono resize-none rounded p-2 outline-none"
            rows={3}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--digit-primary) 5%, transparent)',
              border: '1px solid var(--tip-border)',
              color: 'var(--label-primary)',
            }}
          />
        </div>
      )}
    </div>
  )
}
