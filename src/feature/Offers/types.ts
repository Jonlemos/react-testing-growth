export type OfferFlags = {
  canSimulate: boolean
  canContract: boolean
}

export type Offer = {
  id: string
  name: string
  summary: string
  category: 'credito' | 'investimento' | 'seguros'
  minAmount: number
  maxAmount: number
  eligibility: string
  flags: OfferFlags
}

export type OffersResponse = {
  offers: Offer[]
}

export type OfferDetail = Offer & {
  description: string
  whyThisOffer: string
  conditions: {
    rateFrom: number
    termMonths: number[]
  }
}

export type SimulateOfferResponse = Offer & {
  simulationId: string
  steps: string[]
  currentStep: string
  monthlyPayment: number
  totalAmount: number
  flags: Pick<OfferFlags, 'canContract'>
}

export type ContractOfferResponse = {
  contractId: string
}