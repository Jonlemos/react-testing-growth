import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getMockOffer } from '@/test/utils'

// Mock hook data
vi.mock('@/feature/Offers/hooks/useOffers')
vi.mock('@/lib/analytics', () => ({
  Analytics: {
    offerListViewed: vi.fn(),
    offerFiltered: vi.fn(),
  },
}))

import { useOffers } from '@/feature/offers/hooks/useOffers'
import { Analytics } from '@/lib/analytics'
import { OfferList } from '../OfferList'

const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

const mockUseOffers = vi.mocked(useOffers)

describe('OfferList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading and error states', () => {
    it('displays loading message', () => {
      mockUseOffers.mockReturnValue({
        data: undefined, isLoading: true, isError: false, error: null,
      } as ReturnType<typeof useOffers>)

      renderWithQuery(<OfferList />)
      expect(screen.getByText(/Buscando ofertas/i)).toBeInTheDocument()
    })

    it('displays error message', () => {
      mockUseOffers.mockReturnValue({
        data: undefined, isLoading: false, isError: true,
        error: new Error('Falha na API'),
      } as ReturnType<typeof useOffers>)

      renderWithQuery(<OfferList />)
      expect(screen.getByText(/Erro ao carregar ofertas/i)).toBeInTheDocument()
    })
  })

  describe('Rendering and filters', () => {
    const offers = [
      getMockOffer({ id: '1', name: 'Oferta Crédito', category: 'credito', maxAmount: 10000, eligibility: 'VAREJO' }),
      getMockOffer({ id: '2', name: 'Oferta Invest', category: 'investimento', maxAmount: 100000, eligibility: 'PRIVATE' }),
    ]

    beforeEach(() => {
      mockUseOffers.mockReturnValue({
        data: { offers }, isLoading: false, isError: false, error: null,
      } as ReturnType<typeof useOffers>)
    })

    it('displays the count and fires analytics', async () => {
      renderWithQuery(<OfferList />)
      expect(screen.getByText(/2 ofertas encontradas/i)).toBeInTheDocument()
      await waitFor(() => {
        expect(Analytics.offerListViewed).toHaveBeenCalledWith(2)
      })
    })

    it('filters by category', async () => {
      const user = userEvent.setup()
      renderWithQuery(<OfferList />)

      // Clicks the Credit filter
      await user.click(screen.getByRole('button', { name: 'Crédito' }))

      expect(screen.getByText('Oferta Crédito')).toBeInTheDocument()
      expect(screen.queryByText('Oferta Invest')).not.toBeInTheDocument()
      expect(Analytics.offerFiltered).toHaveBeenCalledWith('credito')
    })

    it('filters by value range', async () => {
      const user = userEvent.setup()
      renderWithQuery(<OfferList />)

      // Clicks in "Até 50k"
      await user.click(screen.getByRole('button', { name: 'Até 50k' }))

      expect(screen.getByText('Oferta Crédito')).toBeInTheDocument()
      expect(screen.queryByText('Oferta Invest')).not.toBeInTheDocument()
    })

    it('filters by segment', async () => {
      const user = userEvent.setup()
      renderWithQuery(<OfferList />)

      // Clicks in "Private"
      await user.click(screen.getByRole('button', { name: 'Private' }))

      expect(screen.queryByText('Oferta Crédito')).not.toBeInTheDocument()
      expect(screen.getByText('Oferta Invest')).toBeInTheDocument()
    })

    it('displays empty state when no filters match', async () => {
      const user = userEvent.setup()
      renderWithQuery(<OfferList />)

      // Impossible combination: Credit Category + Private Segment
      await user.click(screen.getByRole('button', { name: 'Crédito' }))
      await user.click(screen.getByRole('button', { name: 'Private' }))

      expect(screen.getByText(/Nenhuma oferta corresponde aos filtros/i)).toBeInTheDocument()
    })
  })
})
