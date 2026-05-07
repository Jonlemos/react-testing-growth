import { useMutation } from "@tanstack/react-query"
import { OffersApi } from "@/feature/Offers/services/offersApi"
import type { SimulateOfferResponse } from "@/feature/Offers/types"

export const useSimulateOffer = (id: string) => {
  return useMutation<SimulateOfferResponse, Error, { amount: number; termMonths: number }>({
    mutationFn: (data) => OffersApi.simulateOffer(id, data),
  })
}