import { describe, it, expect } from 'vitest'
import { render, screen, getMockOffer } from '@/test/utils'
import { OfferCard } from '../OfferCard'


describe('OfferCard', () => {
  describe('Basic rendering', () => {
    it('display the offer name and summary', () => {
      const offer = getMockOffer()
      render(<OfferCard offer={offer} />)

      expect(screen.getByText('Crédito Empresarial')).toBeInTheDocument()
      expect(screen.getByText('Capital de giro para sua empresa')).toBeInTheDocument()
    })

    it('display the offer value range', () => {
      const offer = getMockOffer({ minAmount: 10_000, maxAmount: 200_000 })
      render(<OfferCard offer={offer} />)

      expect(screen.getByText(/10\.000/)).toBeInTheDocument()
      expect(screen.getByText(/200\.000/)).toBeInTheDocument()
    })

    it('the link points to the correct offer route', () => {
      const offer = getMockOffer({ id: 'oferta-abc' })
      render(<OfferCard offer={offer} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/portal/offers/oferta-abc')
    })
  })

  describe('Eligibility badges (Feature Flags)', () => {
    it('display "Simular" badge when canSimulate is true', () => {
      const offer = getMockOffer({ flags: { canSimulate: true, canContract: false } })
      render(<OfferCard offer={offer} />)

      expect(screen.getAllByText('Simular').length).toBeGreaterThan(0)
    })

    it('display "Disponível" badge when canContract is true', () => {
      const offer = getMockOffer({ flags: { canSimulate: false, canContract: true } })
      render(<OfferCard offer={offer} />)

      expect(screen.getByText('Disponível')).toBeInTheDocument()
    })

    it('display "Indisponível" badge when both flags are false', () => {
      const offer = getMockOffer({ flags: { canSimulate: false, canContract: false } })
      render(<OfferCard offer={offer} />)

      expect(screen.getAllByText('Indisponível')).toHaveLength(2) // badge + botão
    })

    it('disables the button when the offer is unavailable', () => {
      const offer = getMockOffer({ flags: { canSimulate: false, canContract: false } })
      render(<OfferCard offer={offer} />)

      // Button asChild com disabled renderiza <a disabled> em vez de <button>
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('disabled')
    })
  })

  describe('Accessibility', () => {
    it('category icon is decorative (aria-hidden)', () => {
      const offer = getMockOffer({ category: 'credito' })
      const { container } = render(<OfferCard offer={offer} />)

      const hiddenSvgs = container.querySelectorAll('svg[aria-hidden="true"]')
      expect(hiddenSvgs.length).toBeGreaterThan(0)
    })
  })
})
