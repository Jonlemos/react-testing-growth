'use client'

import { useFeatureFlags } from "@/feature/Offers/hooks/useFeatureFlags"


export function FeatureFlagsHydrator() {
  useFeatureFlags()
  return null
}
