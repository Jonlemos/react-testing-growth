import { useQuery } from "@tanstack/react-query"
import { OffersApi } from "@/feature/Offers/services/offersApi"
import type { OffersResponse } from "@/feature/Offers/types"

export const useOffers = () => {
  return useQuery<OffersResponse>({
    queryKey: ['offers'],
    queryFn: () => OffersApi.listOffers(),
  })
}