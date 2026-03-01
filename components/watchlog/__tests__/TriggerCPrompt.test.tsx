import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { TriggerCPrompt } from '../TriggerCPrompt'

describe('TriggerCPrompt', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the prompt text and buttons', () => {
    render(<TriggerCPrompt onLog={vi.fn()} onDismiss={vi.fn()} />)
    expect(screen.getByText(/Just set your watch\?/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log it/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument()
  })

  it('calls onDismiss after 5 seconds', () => {
    const mockDismiss = vi.fn()
    render(<TriggerCPrompt onLog={vi.fn()} onDismiss={mockDismiss} />)
    expect(mockDismiss).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(5100)
    })
    expect(mockDismiss).toHaveBeenCalledOnce()
  })

  it('calls onDismiss when × is clicked', () => {
    const mockDismiss = vi.fn()
    render(<TriggerCPrompt onLog={vi.fn()} onDismiss={mockDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(mockDismiss).toHaveBeenCalled()
  })

  it('does not call onDismiss twice when × clicked then timer fires', () => {
    const mockDismiss = vi.fn()
    render(<TriggerCPrompt onLog={vi.fn()} onDismiss={mockDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    act(() => {
      vi.advanceTimersByTime(5100)
    })
    expect(mockDismiss).toHaveBeenCalledOnce()
  })

  it('calls onLog when "Log it →" is clicked', () => {
    const mockLog = vi.fn()
    render(<TriggerCPrompt onLog={mockLog} onDismiss={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /Log it/i }))
    expect(mockLog).toHaveBeenCalled()
  })
})
