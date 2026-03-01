import { describe, it, expect } from 'vitest'
import { BRANDS } from '../brands'

describe('BRANDS', () => {
  it('has exactly 20 items', () => {
    expect(BRANDS).toHaveLength(20)
  })

  it('is alphabetically sorted', () => {
    const sorted = [...BRANDS].sort((a, b) => a.localeCompare(b))
    expect(BRANDS).toEqual(sorted)
  })

  it('contains key watch brands', () => {
    expect(BRANDS).toContain('Rolex')
    expect(BRANDS).toContain('Omega')
    expect(BRANDS).toContain('Seiko')
    expect(BRANDS).toContain('Grand Seiko')
    expect(BRANDS).toContain('Tudor')
    expect(BRANDS).toContain('Ball')
    expect(BRANDS).toContain('Oris')
    expect(BRANDS).toContain('Rado')
  })

  it('contains only strings', () => {
    BRANDS.forEach((brand) => {
      expect(typeof brand).toBe('string')
      expect(brand.length).toBeGreaterThan(0)
    })
  })
})
