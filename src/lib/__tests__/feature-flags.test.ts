import { describe, it, expect } from 'vitest'
import { getFeatureFlagsForSegment } from '@/lib/feature-flags'

describe('getFeatureFlagsForSegment', () => {
  describe('VAREJO segment', () => {
    it('enables simulation', () => {
      const flags = getFeatureFlagsForSegment('VAREJO')
      expect(flags['offers-simulation-enabled']).toBe(true)
    })

    it('enables contract', () => {
      const flags = getFeatureFlagsForSegment('VAREJO')
      expect(flags['offers-contract-enabled']).toBe(true)
    })
  })

  describe('PRIVATE segment', () => {
    it('enables simulation', () => {
      const flags = getFeatureFlagsForSegment('PRIVATE')
      expect(flags['offers-simulation-enabled']).toBe(true)
    })

    it('disables direct contract (only through manager)', () => {
      const flags = getFeatureFlagsForSegment('PRIVATE')
      expect(flags['offers-contract-enabled']).toBe(false)
    })
  })

  describe('CORPORATE segment', () => {
    it('enables simulation', () => {
      const flags = getFeatureFlagsForSegment('CORPORATE')
      expect(flags['offers-simulation-enabled']).toBe(true)
    })

    it('enables contract', () => {
      const flags = getFeatureFlagsForSegment('CORPORATE')
      expect(flags['offers-contract-enabled']).toBe(true)
    })
  })

  describe('UNKNOWN segment (fallback)', () => {
    it('returns default segment flags (VAREJO) without throwing error', () => {
      // @ts-expect-error — testing invalid segment intentionally
      const flags = getFeatureFlagsForSegment('UNKNOWN')
      expect(flags['offers-simulation-enabled']).toBe(true)
    })
  })
})
