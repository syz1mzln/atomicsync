'use client'

import { useEffect, useState } from 'react'
import { City } from '@/lib/cities'
import { SecondaryClockCell } from './SecondaryClockCell'
import { TimezoneSelector } from './TimezoneSelector'
import { STORAGE_KEYS } from '@/lib/storage-keys'

interface TimezoneStripProps {
  getDisplayTime: () => number
}

export function TimezoneStrip({ getDisplayTime }: TimezoneStripProps) {
  const [cities, setCities] = useState<City[]>([])

  // Load from localStorage + run migration on mount
  useEffect(() => {
    const legacy = localStorage.getItem(STORAGE_KEYS.TIMEZONES_LEGACY)
    const current = localStorage.getItem(STORAGE_KEYS.TIMEZONES)

    if (legacy && !current) {
      try {
        const parsed = JSON.parse(legacy)
        localStorage.setItem(STORAGE_KEYS.TIMEZONES, JSON.stringify([parsed]))
        localStorage.removeItem(STORAGE_KEYS.TIMEZONES_LEGACY)
        setCities([parsed])
        return
      } catch {
        // ignore
      }
    }

    if (current) {
      try {
        setCities(JSON.parse(current))
      } catch {
        // ignore
      }
    }
  }, [])

  const persist = (updated: City[]) => {
    setCities(updated)
    localStorage.setItem(STORAGE_KEYS.TIMEZONES, JSON.stringify(updated))
  }

  const addCity = (city: City) => {
    if (cities.length >= 4) return
    // Avoid duplicates
    if (cities.some((c) => c.city === city.city && c.utcOffset === city.utcOffset)) return
    persist([...cities, city])
  }

  const removeCity = (index: number) => {
    persist(cities.filter((_, i) => i !== index))
  }

  const changeCity = (index: number, city: City) => {
    const updated = [...cities]
    updated[index] = city
    persist(updated)
  }

  return (
    <div className="flex flex-col items-center gap-2 mt-3 w-full">
      {/* Horizontal strip of clocks */}
      {cities.length > 0 && (
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {cities.map((city, i) => (
            <SecondaryClockCell
              key={`${city.city}-${i}`}
              city={city}
              getDisplayTime={getDisplayTime}
              onRemove={() => removeCity(i)}
              onChange={(c) => changeCity(i, c)}
            />
          ))}
        </div>
      )}

      {/* Add button — hidden when 4 clocks active */}
      {cities.length < 4 && <TimezoneSelector onSelect={addCity} />}
    </div>
  )
}
