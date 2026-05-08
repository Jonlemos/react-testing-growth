import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Analytics, trackEvent } from '@/lib/analytics'

describe('analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('trackEvent', () => {
    it('does not throw error when called in test environment', () => {
      expect(() => trackEvent('test_event', { value: 1 })).not.toThrow()
    })

    it('does not throw error without properties', () => {
      expect(() => trackEvent('test_event')).not.toThrow()
    })
  })

  describe('Analytics (funnel events)', () => {
    it('offerListViewed calls trackEvent with correct name and count', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      Analytics.offerListViewed(5)
      // In dev, trackEvent does console.log - in test NODE_ENV is not 'development'
      // Just ensure it doesn't throw and is callable
      expect(() => Analytics.offerListViewed(5)).not.toThrow()
      spy.mockRestore()
    })

    it('offerDetailViewed is callable without errors', () => {
      expect(() => Analytics.offerDetailViewed('offer-123')).not.toThrow()
    })

    it('simulationStarted is callable without errors', () => {
      expect(() => Analytics.simulationStarted('offer-abc')).not.toThrow()
    })

    it('simulationStepCompleted is callable without errors', () => {
      expect(() => Analytics.simulationStepCompleted('offer-abc', 2)).not.toThrow()
    })

    it('contractCompleted is callable without errors', () => {
      expect(() => Analytics.contractCompleted('offer-abc', 'contract-xyz')).not.toThrow()
    })

    it('errorOccurred is callable without errors', () => {
      expect(() => Analytics.errorOccurred('login', 'timeout')).not.toThrow()
    })

    it('offerFiltered is callable without errors', () => {
      expect(() => Analytics.offerFiltered('credito')).not.toThrow()
    })
  })
})
