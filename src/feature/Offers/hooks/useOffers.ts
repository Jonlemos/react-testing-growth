import { useQuery } from "@tanstack/react-query"
import { OffersApi } from "@/feature/offers/services/offersApi"
import type { OffersResponse } from "@/feature/offers/types"

export const useOffers = () => {
  return useQuery<OffersResponse>({
    queryKey: ['offers'],
    queryFn: () => OffersApi.listOffers(),
  })
}