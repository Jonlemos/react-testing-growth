import type { OfferDetail, OffersResponse, SimulateOfferResponse, ContractOfferResponse } from "../types";

const BASE_URL = '/api/portal/offers'


async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: 'include', // manda cookie de sessão/JWT
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })

  if (!res.ok) {
    // aqui você pode padronizar tratamento de erro
    const text = await res.text()
    throw new Error(text || `Erro HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const OffersApi = {
 listOffers: () => http<OffersResponse>(BASE_URL),
 getOnlyOffer: (id: string) => http<OfferDetail>(`${BASE_URL}/${id}`),
 simulateOffer: (id: string, data: {amount: number, termMonths: number}) => http<SimulateOfferResponse>(`${BASE_URL}/${id}/simulate`, {
  method: 'POST',
  body: JSON.stringify(data),
 }),
 contractOffer: (id: string, data: {simulationId: string, acceptTerms: boolean}) => http<ContractOfferResponse>(`${BASE_URL}/${id}/contract`, {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Idempotency-Key': `req-${Date.now()}`,
  },
 }),
}