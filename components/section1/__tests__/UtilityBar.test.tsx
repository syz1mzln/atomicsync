import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UtilityBar } from '../UtilityBar'
import type { Watch } from '@/types/watchlog'

const NOW = Date.now()

const watch: Watch = { id: 'w1', brand: 'Omega', model: 'Seamaster', addedAt: NOW }

const defaultProps = {
  syncStatus: 'synced' as const,
  manualSync: vi.fn(),
  watches: [],
  onOpenDrawer: vi.fn(),
}

describe('UtilityBar', () => {
  it('does not render MyWatchesIcon when watches is empty', () => {
    render(<UtilityBar {...defaultProps} watches={[]} />)
    expect(screen.queryByRole('button', { name: /my watch log/i })).not.toBeInTheDocument()
  })

  it('renders MyWatchesIcon when watches has entries', () => {
    render(<UtilityBar {...defaultProps} watches={[watch]} />)
    expect(screen.getByRole('button', { name: /my watch log/i })).toBeInTheDocument()
  })

  it('calls onOpenDrawer when MyWatchesIcon is clicked', async () => {
    const user = userEvent.setup()
    const mockOpenDrawer = vi.fn()
    render(<UtilityBar {...defaultProps} watches={[watch]} onOpenDrawer={mockOpenDrawer} />)
    await user.click(screen.getByRole('button', { name: /my watch log/i }))
    expect(mockOpenDrawer).toHaveBeenCalled()
  })

  it('does not render TimeFormatToggle', () => {
    render(<UtilityBar {...defaultProps} />)
    expect(screen.queryByRole('button', { name: /12h|24h/i })).not.toBeInTheDocument()
  })
})
