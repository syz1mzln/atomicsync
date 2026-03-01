import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useState } from 'react'
import { useWatchLog } from '../useWatchLog'

// Mock useLocalStorage with useState so state updates work in tests
vi.mock('../useLocalStorage', () => ({
  useLocalStorage: <T>(key: string, defaultValue: T) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<T>(defaultValue)
    return [value, setValue] as const
  },
}))

describe('useWatchLog', () => {
  it('addWatch appends a new watch with id and addedAt', () => {
    const { result } = renderHook(() => useWatchLog())

    act(() => {
      result.current.addWatch({ brand: 'Rolex', model: 'Submariner' })
    })

    expect(result.current.watches).toHaveLength(1)
    const watch = result.current.watches[0]
    expect(watch.brand).toBe('Rolex')
    expect(watch.model).toBe('Submariner')
    expect(typeof watch.id).toBe('string')
    expect(watch.id.length).toBeGreaterThan(0)
    expect(typeof watch.addedAt).toBe('number')
    expect(watch.addedAt).toBeGreaterThan(0)
  })

  it('addWatch preserves optional nickname', () => {
    const { result } = renderHook(() => useWatchLog())

    act(() => {
      result.current.addWatch({ brand: 'Seiko', model: 'SKX007', nickname: 'Black Sub' })
    })

    expect(result.current.watches[0].nickname).toBe('Black Sub')
  })

  it('removeWatch removes by id, leaves other watches intact', () => {
    const { result } = renderHook(() => useWatchLog())

    act(() => {
      result.current.addWatch({ brand: 'Rolex', model: 'Sub' })
    })
    act(() => {
      result.current.addWatch({ brand: 'Omega', model: 'Speedmaster' })
    })

    expect(result.current.watches).toHaveLength(2)
    const idToRemove = result.current.watches[0].id

    act(() => {
      result.current.removeWatch(idToRemove)
    })

    expect(result.current.watches).toHaveLength(1)
    expect(result.current.watches[0].brand).toBe('Omega')
  })

  it('logSync appends a SyncLog entry', () => {
    const { result } = renderHook(() => useWatchLog())

    act(() => {
      result.current.logSync({ watchId: 'watch-1', syncedAt: 1000, source: 'ntp' })
    })

    expect(result.current.syncLog).toHaveLength(1)
    expect(result.current.syncLog[0]).toEqual({
      watchId: 'watch-1',
      syncedAt: 1000,
      source: 'ntp',
    })
  })

  it('getLastSyncedFor returns most recent syncedAt for a watchId', () => {
    const { result } = renderHook(() => useWatchLog())

    act(() => {
      result.current.logSync({ watchId: 'watch-1', syncedAt: 1000 })
    })
    act(() => {
      result.current.logSync({ watchId: 'watch-1', syncedAt: 3000 })
    })
    act(() => {
      result.current.logSync({ watchId: 'watch-1', syncedAt: 2000 })
    })

    expect(result.current.getLastSyncedFor('watch-1')).toBe(3000)
  })

  it('getLastSyncedFor returns null when no entries for watchId', () => {
    const { result } = renderHook(() => useWatchLog())

    expect(result.current.getLastSyncedFor('nonexistent')).toBeNull()
  })

  it('getLastSyncedFor returns null when only other watches have entries', () => {
    const { result } = renderHook(() => useWatchLog())

    act(() => {
      result.current.logSync({ watchId: 'watch-2', syncedAt: 5000 })
    })

    expect(result.current.getLastSyncedFor('watch-1')).toBeNull()
  })
})
