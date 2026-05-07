import { useQuery } from "@tanstack/react-query"
import { OffersApi } from "../services/offersApi"
import type { OfferDetail } from "../types"

export const useOnlyOffer = (id: string) => {
  return useQuery<OfferDetail>({
    queryKey: ['offer', id],
    queryFn: () => OffersApi.getOnlyOffer(id),
    enabled: !!id,
  })
}