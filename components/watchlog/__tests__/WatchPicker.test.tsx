import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WatchPicker } from '../WatchPicker'
import { BRANDS } from '@/lib/brands'

describe('WatchPicker', () => {
  it('renders all 20 brands and Other in brand selector', () => {
    render(<WatchPicker onSave={vi.fn()} onCancel={vi.fn()} />)
    BRANDS.forEach((brand) => {
      expect(screen.getByText(brand)).toBeInTheDocument()
    })
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  it('Save watch button is disabled when model is empty', () => {
    render(<WatchPicker onSave={vi.fn()} onCancel={vi.fn()} />)
    // Simulate brand selection by clicking the Omega item
    fireEvent.click(screen.getByText('Omega'))
    const saveBtn = screen.getByRole('button', { name: 'Save watch' })
    expect(saveBtn).toBeDisabled()
  })

  it('Save watch enabled after model typed and calls onSave with correct data', async () => {
    const user = userEvent.setup()
    const mockSave = vi.fn()
    render(<WatchPicker onSave={mockSave} onCancel={vi.fn()} />)

    fireEvent.click(screen.getByText('Omega'))

    const modelInput = screen.getByPlaceholderText('Model (e.g. Aqua Terra)')
    await user.type(modelInput, 'Seamaster')

    const saveBtn = screen.getByRole('button', { name: 'Save watch' })
    expect(saveBtn).not.toBeDisabled()

    await user.click(saveBtn)
    expect(mockSave).toHaveBeenCalledWith({ brand: 'Omega', model: 'Seamaster' })
  })

  it('onSave includes nickname when provided', async () => {
    const user = userEvent.setup()
    const mockSave = vi.fn()
    render(<WatchPicker onSave={mockSave} onCancel={vi.fn()} />)

    fireEvent.click(screen.getByText('Rolex'))
    await user.type(screen.getByPlaceholderText('Model (e.g. Aqua Terra)'), 'Submariner')
    await user.type(screen.getByPlaceholderText('Nickname (e.g. Black Sub)'), 'Black Sub')
    await user.click(screen.getByRole('button', { name: 'Save watch' }))

    expect(mockSave).toHaveBeenCalledWith({
      brand: 'Rolex',
      model: 'Submariner',
      nickname: 'Black Sub',
    })
  })

  it('Other selection shows free-text brand input', () => {
    render(<WatchPicker onSave={vi.fn()} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByText('Other'))
    expect(screen.getByPlaceholderText('Brand name')).toBeInTheDocument()
  })

  it('Other brand + model enables Save watch', async () => {
    const user = userEvent.setup()
    const mockSave = vi.fn()
    render(<WatchPicker onSave={mockSave} onCancel={vi.fn()} />)

    fireEvent.click(screen.getByText('Other'))

    const brandInput = screen.getByPlaceholderText('Brand name')
    const modelInput = screen.getByPlaceholderText('Model (e.g. Aqua Terra)')

    await user.type(brandInput, 'Nomos')
    await user.type(modelInput, 'Tangente')

    const saveBtn = screen.getByRole('button', { name: 'Save watch' })
    expect(saveBtn).not.toBeDisabled()
    await user.click(saveBtn)
    expect(mockSave).toHaveBeenCalledWith({ brand: 'Nomos', model: 'Tangente' })
  })

  it('onCancel fires on Cancel click in brand phase', async () => {
    const user = userEvent.setup()
    const mockCancel = vi.fn()
    render(<WatchPicker onSave={vi.fn()} onCancel={mockCancel} />)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(mockCancel).toHaveBeenCalled()
  })

  it('onCancel fires on Cancel click in details phase', async () => {
    const user = userEvent.setup()
    const mockCancel = vi.fn()
    render(<WatchPicker onSave={vi.fn()} onCancel={mockCancel} />)
    fireEvent.click(screen.getByText('Seiko'))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(mockCancel).toHaveBeenCalled()
  })
})
