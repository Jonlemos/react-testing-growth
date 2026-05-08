
import { describe, it, expect, beforeEach } from 'vitest'


import {
  clearAllSimulationDrafts,
} from '../simulation.store'

beforeEach(() => {
  Object.keys(localStorage).forEach((key) => localStorage.removeItem(key))
})

describe('simulation.store', () => {
  describe('clearAllSimulationDrafts', () => {
    it('removes local storage keys with userId prefix', () => {
      const userId = 'user-test-001'

      // Simulate persisted drafts of two offers
      localStorage.setItem(`simulation-draft-${userId}-offer-1`, '{"amount":10000}')
      localStorage.setItem(`simulation-draft-${userId}-offer-2`, '{"amount":50000}')
      // A key of another user — should NOT be removed
      localStorage.setItem('simulation-draft-outro-usuario-offer-1', '{"amount":99999}')

      clearAllSimulationDrafts(userId)

      expect(localStorage.getItem(`simulation-draft-${userId}-offer-1`)).toBeNull()
      expect(localStorage.getItem(`simulation-draft-${userId}-offer-2`)).toBeNull()
    })

    it('should not remove keys of other users', () => {
      const userId = 'user-abc'
      const otherKey = 'simulation-draft-outro-user-offer-x'
      localStorage.setItem(`simulation-draft-${userId}-offer-1`, '{}')
      localStorage.setItem(otherKey, '{"amount": 1}')

      clearAllSimulationDrafts(userId)

      expect(localStorage.getItem(otherKey)).not.toBeNull()
    })

    it('should not throw error when there are no keys to remove', () => {
      expect(() => clearAllSimulationDrafts('user-sem-rascunhos')).not.toThrow()
    })

    it('should be safe to call in an environment without window (SSR)', () => {
      Object.keys(localStorage).forEach((key) => localStorage.removeItem(key))
      expect(() => clearAllSimulationDrafts('user-ssr')).not.toThrow()
    })
  })
})
