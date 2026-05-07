'use client'

import { useEffect } from "react"
import { useAuth } from "@/feature/auth/hooks/useAuth"
import { useFeatureFlagsStore } from "@/store/feature-flags.store"
import { getFeatureFlagsForSegment } from "@/lib/feature-flags"
import type { ClientSegment } from "@/lib/constants"

export const useFeatureFlags = () => {
  const { user } = useAuth()
  const { setFlags, clearFlags, flags, canSimulate, canContract } = useFeatureFlagsStore()

  useEffect(() => {
    if (user?.segment) {
      const computed = getFeatureFlagsForSegment(user.segment as ClientSegment)
      setFlags(computed)
    } else {
      clearFlags()
    }
  }, [user?.segment])

  return { flags, canSimulate, canContract }
}
