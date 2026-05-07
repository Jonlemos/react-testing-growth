'use client'

import { create } from "zustand"
import type { FeatureFlags } from "@/lib/feature-flags"

type FeatureFlagsState = {
  flags: FeatureFlags | null
  setFlags: (flags: FeatureFlags) => void
  clearFlags: () => void
  canSimulate: boolean
  canContract: boolean
}

export const useFeatureFlagsStore = create<FeatureFlagsState>()((set, get) => ({
  flags: null,
  canSimulate: false,
  canContract: false,

  setFlags: (flags: FeatureFlags) =>
    set({
      flags,
      canSimulate: flags['offers-simulation-enabled'],
      canContract: flags['offers-contract-enabled'],
    }),

  clearFlags: () =>
    set({ flags: null, canSimulate: false, canContract: false }),
}))
