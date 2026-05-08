import { useMutation } from "@tanstack/react-query"
import { OffersApi } from "@/feature/offers/services/offersApi"
import type { ContractOfferResponse } from "@/feature/offers/types"

export const useContractOffer = (id: string) => {
  return useMutation<ContractOfferResponse, Error, { simulationId: string; acceptTerms: boolean }>({
    mutationFn: (data) => OffersApi.contractOffer(id, data),
  })
}