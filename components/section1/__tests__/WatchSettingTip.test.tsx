import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { WatchSettingTip } from '../WatchSettingTip'
import type { Watch } from '@/types/watchlog'

const NOW = Date.now()
const DAY = 24 * 60 * 60 * 1000

const watches: Watch[] = [
  { id: 'w1', brand: 'Omega', model: 'Seamaster', addedAt: NOW - DAY * 3 },
  { id: 'w2', brand: 'Rolex', model: 'Submariner', nickname: 'Black Sub', addedAt: NOW - DAY * 10 },
]

const defaultProps = {
  watches: [],
  lastVisit: null,
  lastSyncedAt: null,
  onLog: vi.fn(),
  onOpenMiniPicker: vi.fn(),
}

describe('WatchSettingTip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('tip mode', () => {
    it('shows collapsed button initially', () => {
      render(<WatchSettingTip {...defaultProps} mode="tip" />)
      expect(screen.getByText(/How to set your watch/)).toBeInTheDocument()
    })

    it('expands to show 4 steps when button is clicked', () => {
      render(<WatchSettingTip {...defaultProps} mode="tip" />)
      fireEvent.click(screen.getByText(/How to set your watch/))
      expect(screen.getByText(/Pull crown/)).toBeInTheDocument()
      expect(screen.getByText(/Set hands/)).toBeInTheDocument()
    })

    it('collapses when Close tip button is clicked', () => {
      render(<WatchSettingTip {...defaultProps} mode="tip" />)
      fireEvent.click(screen.getByText(/How to set your watch/))
      fireEvent.click(screen.getByRole('button', { name: /close tip/i }))
      expect(screen.queryByText(/Pull crown/)).not.toBeInTheDocument()
    })
  })

  describe('return-no-watches mode', () => {
    it('shows last visit text and Log sync button', () => {
      render(
        <WatchSettingTip {...defaultProps} mode="return-no-watches" lastVisit={NOW - DAY * 3} />,
      )
      expect(screen.getByText(/Last visit/)).toBeInTheDocument()
      expect(screen.getByText(/Log sync/)).toBeInTheDocument()
    })

    it('shows Dismiss button', () => {
      render(<WatchSettingTip {...defaultProps} mode="return-no-watches" lastVisit={NOW - DAY} />)
      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument()
    })

    it('hides the bar when Dismiss is clicked', () => {
      render(<WatchSettingTip {...defaultProps} mode="return-no-watches" lastVisit={NOW - DAY} />)
      fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
      expect(screen.queryByText(/Last visit/)).not.toBeInTheDocument()
    })

    it('calls onLog when Log sync → is clicked', () => {
      const mockLog = vi.fn()
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-no-watches"
          lastVisit={NOW - DAY}
          onLog={mockLog}
        />,
      )
      fireEvent.click(screen.getByText(/Log sync/))
      expect(mockLog).toHaveBeenCalled()
    })
  })

  describe('return-one-watch mode', () => {
    it('shows watch model and last set info', () => {
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-one-watch"
          watches={[watches[0]]}
          lastSyncedAt={NOW - DAY * 2}
        />,
      )
      expect(screen.getByText(/Seamaster · last set/)).toBeInTheDocument()
    })

    it('shows nickname in left content when available', () => {
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-one-watch"
          watches={[watches[1]]}
          lastSyncedAt={null}
        />,
      )
      expect(screen.getByText(/Black Sub/)).toBeInTheDocument()
    })

    it('shows Set {model} → button', () => {
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-one-watch"
          watches={[watches[0]]}
          lastSyncedAt={null}
        />,
      )
      expect(screen.getByRole('button', { name: /Set Seamaster →/ })).toBeInTheDocument()
    })

    it('uses model name for button even when nickname exists', () => {
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-one-watch"
          watches={[watches[1]]}
          lastSyncedAt={null}
        />,
      )
      expect(screen.getByRole('button', { name: /Set Submariner →/ })).toBeInTheDocument()
    })

    it('calls onLog when Set button is clicked', () => {
      const mockLog = vi.fn()
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-one-watch"
          watches={[watches[0]]}
          lastSyncedAt={null}
          onLog={mockLog}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: /Set Seamaster →/ }))
      expect(mockLog).toHaveBeenCalled()
    })
  })

  describe('return-multi-watches mode', () => {
    it('shows watch count and last set info', () => {
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-multi-watches"
          watches={watches}
          lastSyncedAt={NOW - DAY * 2}
        />,
      )
      expect(screen.getByText(/2 watches tracked/)).toBeInTheDocument()
      expect(screen.getByText(/last set/)).toBeInTheDocument()
    })

    it('shows Mark as Set → button', () => {
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-multi-watches"
          watches={watches}
          lastSyncedAt={null}
        />,
      )
      expect(screen.getByRole('button', { name: /Mark as Set →/ })).toBeInTheDocument()
    })

    it('calls onOpenMiniPicker when Mark as Set → is clicked', () => {
      const mockMiniPicker = vi.fn()
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-multi-watches"
          watches={watches}
          lastSyncedAt={null}
          onOpenMiniPicker={mockMiniPicker}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: /Mark as Set →/ }))
      expect(mockMiniPicker).toHaveBeenCalled()
    })
  })

  describe('Logged ✓ confirmation', () => {
    it('shows Logged ✓ after Log sync → click', () => {
      render(<WatchSettingTip {...defaultProps} mode="return-no-watches" lastVisit={NOW - DAY} />)
      fireEvent.click(screen.getByText(/Log sync/))
      expect(screen.getByText('Logged ✓')).toBeInTheDocument()
    })

    it('reverts to Log sync → after 1.5s', () => {
      render(<WatchSettingTip {...defaultProps} mode="return-no-watches" lastVisit={NOW - DAY} />)
      fireEvent.click(screen.getByText(/Log sync/))
      act(() => {
        vi.advanceTimersByTime(1600)
      })
      expect(screen.getByText(/Log sync/)).toBeInTheDocument()
    })

    it('shows Logged ✓ after Set button click in one-watch mode', () => {
      render(
        <WatchSettingTip
          {...defaultProps}
          mode="return-one-watch"
          watches={[watches[0]]}
          lastSyncedAt={null}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: /Set Seamaster →/ }))
      expect(screen.getByText('Logged ✓')).toBeInTheDocument()
    })
  })
})
