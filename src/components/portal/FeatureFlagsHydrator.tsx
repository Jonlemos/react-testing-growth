'use client'

import { useFeatureFlags } from "@/feature/offers/hooks/useFeatureFlags"


export function FeatureFlagsHydrator() {
  useFeatureFlags()
  return null
}
