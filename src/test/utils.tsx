import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement, ReactNode } from 'react'

// ── Query client without retry for fast tests ────────────────────────────
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

// ── Global wrapper with necessary providers ──────────────────────────────
function AllProviders({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// ── Custom render — replaces RTL's default render ────────────────────
const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

// Re-export everything from RTL so tests import only from here
export * from '@testing-library/react'
export { customRender as render }

// ── Data factories ────────────────────────────────────────────────────

import type { Offer, OfferDetail } from '@/feature/offers/types'

export const getMockOffer = (overrides?: Partial<Offer>): Offer => ({
  id: 'offer-1',
  name: 'Crédito Empresarial',
  summary: 'Capital de giro para sua empresa',
  category: 'credito',
  minAmount: 10_000,
  maxAmount: 500_000,
  eligibility: 'VAREJO',
  flags: { canSimulate: true, canContract: true },
  ...overrides,
})

export const getMockOfferDetail = (overrides?: Partial<OfferDetail>): OfferDetail => ({
  ...getMockOffer(),
  description: 'Descrição completa da oferta',
  whyThisOffer: 'Porque seu perfil é elegível',
  conditions: { rateFrom: 1.2, termMonths: [12, 24, 36, 48, 60] },
  ...overrides,
})
