import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WatchLogDrawer } from '../WatchLogDrawer'
import type { Watch, SyncLog } from '@/types/watchlog'

// Mock Sheet so portal doesn't interfere with jsdom
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}))

const NOW = Date.now()
const DAY = 24 * 60 * 60 * 1000

const watches: Watch[] = [
  { id: 'w1', brand: 'Omega', model: 'Seamaster', addedAt: NOW - DAY * 3 },
  { id: 'w2', brand: 'Rolex', model: 'Submariner', nickname: 'Black Sub', addedAt: NOW - DAY * 10 },
]

const syncLog: SyncLog[] = [
  { watchId: 'w1', syncedAt: NOW - 1000 * 60 * 60 * 2, source: 'ntp' }, // 2 hours ago → today
  { watchId: 'w2', syncedAt: NOW - DAY * 1.5, source: 'ntp' }, // 36 hours ago → yesterday
]

describe('WatchLogDrawer', () => {
  it('renders empty state when watches is empty', () => {
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={[]}
        syncLog={[]}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    expect(screen.getByText(/add your first watch/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add a watch/i })).toBeInTheDocument()
  })

  it('renders correct number of watch rows', () => {
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={watches}
        syncLog={syncLog}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    expect(screen.getByText('Seamaster')).toBeInTheDocument()
    expect(screen.getByText('Black Sub')).toBeInTheDocument()
  })

  it('shows "today" for a sync within 24 hours', () => {
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={watches}
        syncLog={syncLog}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    expect(screen.getByText('set today')).toBeInTheDocument()
  })

  it('shows "yesterday" for a sync 24-48h ago', () => {
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={watches}
        syncLog={syncLog}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    expect(screen.getByText('set yesterday')).toBeInTheDocument()
  })

  it('shows "N days ago" for older syncs', () => {
    const oldSyncLog: SyncLog[] = [{ watchId: 'w1', syncedAt: NOW - DAY * 5, source: 'ntp' }]
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={[watches[0]]}
        syncLog={oldSyncLog}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    expect(screen.getByText('set 5 days ago')).toBeInTheDocument()
  })

  it('shows "never" when no sync logged for a watch', () => {
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={[watches[0]]}
        syncLog={[]}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    expect(screen.getByText('never set')).toBeInTheDocument()
  })

  it('remove button calls onRemove with correct id', async () => {
    const user = userEvent.setup()
    const mockRemove = vi.fn()
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={watches}
        syncLog={syncLog}
        onRemove={mockRemove}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons[0])
    expect(mockRemove).toHaveBeenCalledWith('w1')
  })

  it('shows add watch button in header in populated state', () => {
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={watches}
        syncLog={syncLog}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /add a watch/i })).toBeInTheDocument()
  })

  it('opens WatchPicker when "+" header button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={[]}
        syncLog={[]}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: /add a watch/i }))
    expect(screen.getByPlaceholderText('Search brand…')).toBeInTheDocument()
  })

  it('shows Mark as set → button for each watch row', () => {
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={watches}
        syncLog={syncLog}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={vi.fn()}
      />,
    )
    const markButtons = screen.getAllByText('Mark as set →')
    expect(markButtons).toHaveLength(2)
  })

  it('Mark as set → calls onLogSync with correct watch id', async () => {
    const user = userEvent.setup()
    const mockLogSync = vi.fn()
    render(
      <WatchLogDrawer
        open={true}
        onClose={vi.fn()}
        watches={watches}
        syncLog={syncLog}
        onRemove={vi.fn()}
        onAddWatch={vi.fn()}
        onLogSync={mockLogSync}
      />,
    )
    const markButtons = screen.getAllByText('Mark as set →')
    await user.click(markButtons[0])
    expect(mockLogSync).toHaveBeenCalledWith('w1')
  })
})
