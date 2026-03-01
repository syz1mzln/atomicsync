'use client'

import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValue(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [key])

  const set = useCallback(
    (newValue: T) => {
      setValue(newValue)
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch {
        // ignore
      }
    },
    [key],
  )

  return [value, set]
}
