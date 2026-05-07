'use client'

import { createStore, useStore } from "zustand"
import type { StoreApi } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useAuthStore } from "@/feature/auth/store/auth.store"
import type { SimulateOfferResponse } from "../types"

export type SimulationStep = 1 | 2 | 3

export type SimulationDraft = {
  offerId: string
  amount: number
  termMonths: number
  currentStep: SimulationStep
  result: SimulateOfferResponse | null
}

type SimulationActions = {
  setAmount: (amount: number) => void
  setTermMonths: (termMonths: number) => void
  setStep: (step: SimulationStep) => void
  setResult: (result: SimulateOfferResponse) => void
  reset: () => void
}

type SimulationStore = SimulationDraft & SimulationActions

const makeInitial = (offerId: string, initialAmount: number): SimulationDraft => ({
  offerId,
  amount: initialAmount,
  termMonths: 24,
  currentStep: 1,
  result: null,
})

// Cache in store for performance
const storeCache = new Map<string, StoreApi<SimulationStore>>()

function getStoreCacheKey(userId: string, offerId: string) {
  return `${userId}::${offerId}`
}

function createSimulationStore(userId: string, offerId: string, initialAmount: number) {
  const localStorageKey = `simulation-draft-${userId}-${offerId}`
  const initial = makeInitial(offerId, initialAmount)

  return createStore<SimulationStore>()(
    persist(
      (set) => ({
        ...initial,
        setAmount: (amount) => set({ amount }),
        setTermMonths: (termMonths) => set({ termMonths }),
        setStep: (currentStep) => set({ currentStep }),
        setResult: (result) => set({ result }),
        reset: () => set(initial),
      }),
      {
        name: localStorageKey,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          offerId: state.offerId,
          amount: state.amount,
          termMonths: state.termMonths,
          currentStep: state.currentStep,
          result: state.result,
        }),
      }
    )
  )
}

function getOrCreateStore(userId: string, offerId: string, initialAmount: number): StoreApi<SimulationStore> {
  const cacheKey = getStoreCacheKey(userId, offerId)
  if (!storeCache.has(cacheKey)) {
    storeCache.set(cacheKey, createSimulationStore(userId, offerId, initialAmount))
  }
  return storeCache.get(cacheKey)!
}

// Public hook used in components
export function useSimulationStore(offerId: string, initialAmount: number): SimulationStore {
  const userId = useAuthStore.getState().user?.id ?? 'anonymous'
  const store = getOrCreateStore(userId, offerId, initialAmount)
  return useStore<StoreApi<SimulationStore>, SimulationStore>(store, (s) => s)
}

// Clear simulation drafts on logout. Called by useAuth.
export function clearAllSimulationDrafts(userId: string) {
  const prefix = `simulation-draft-${userId}-`

  if (typeof window !== 'undefined') {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(prefix)) localStorage.removeItem(key)
    })
  }

  storeCache.forEach((_, cacheKey) => {
    if (cacheKey.startsWith(`${userId}::`)) storeCache.delete(cacheKey)
  })
}
