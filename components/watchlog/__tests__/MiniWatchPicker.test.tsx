import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MiniWatchPicker } from '../MiniWatchPicker'
import type { Watch } from '@/types/watchlog'

const watches: Watch[] = [
  { id: 'w1', brand: 'Omega', model: 'Seamaster', addedAt: Date.now() },
  { id: 'w2', brand: 'Rolex', model: 'Submariner', nickname: 'Black Sub', addedAt: Date.now() },
]

describe('MiniWatchPicker', () => {
  it('renders a row for each watch', () => {
    render(
      <MiniWatchPicker
        watches={watches}
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
        onAddNew={vi.fn()}
      />,
    )
    expect(screen.getByText('Seamaster')).toBeInTheDocument()
    expect(screen.getByText('Black Sub')).toBeInTheDocument()
  })

  it('renders brand labels in uppercase', () => {
    render(
      <MiniWatchPicker
        watches={watches}
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
        onAddNew={vi.fn()}
      />,
    )
    expect(screen.getByText('OMEGA')).toBeInTheDocument()
    expect(screen.getByText('ROLEX')).toBeInTheDocument()
  })

  it('calls onSelect with correct id when a row is clicked', async () => {
    const user = userEvent.setup()
    const mockSelect = vi.fn()
    render(
      <MiniWatchPicker
        watches={watches}
        open={true}
        onOpenChange={vi.fn()}
        onSelect={mockSelect}
        onAddNew={vi.fn()}
      />,
    )
    await user.click(screen.getByText('Seamaster'))
    expect(mockSelect).toHaveBeenCalledWith('w1')
  })

  it('calls onAddNew when "+ Add a different watch →" is clicked', async () => {
    const user = userEvent.setup()
    const mockAddNew = vi.fn()
    render(
      <MiniWatchPicker
        watches={watches}
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
        onAddNew={mockAddNew}
      />,
    )
    await user.click(screen.getByText('+ Add a different watch →'))
    expect(mockAddNew).toHaveBeenCalled()
  })

  it('shows model when no nickname; shows nickname when present', () => {
    render(
      <MiniWatchPicker
        watches={watches}
        open={true}
        onOpenChange={vi.fn()}
        onSelect={vi.fn()}
        onAddNew={vi.fn()}
      />,
    )
    // w1: no nickname → shows model
    expect(screen.getByText('Seamaster')).toBeInTheDocument()
    // w2: has nickname → shows nickname (not model)
    expect(screen.getByText('Black Sub')).toBeInTheDocument()
    expect(screen.queryByText('Submariner')).not.toBeInTheDocument()
  })
})
