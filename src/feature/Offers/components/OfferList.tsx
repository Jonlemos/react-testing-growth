'use client'

import { PackageSearch } from "lucide-react"
import { useOffers } from "../hooks/useOffers"
import { OfferCard } from "./OfferCard"
import { Loading } from "@/components/shared/loading/loading"

export const OfferList = () => {
  const { data, isLoading, isError, error } = useOffers()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loading />
        <p className="text-sm">Buscando ofertas disponíveis...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-destructive">
        <PackageSearch size={40} strokeWidth={1.2} />
        <p className="text-sm font-medium">Erro ao carregar ofertas</p>
        <p className="text-xs text-muted-foreground">{error?.message}</p>
      </div>
    )
  }

  const offers = data?.offers ?? []

  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <PackageSearch size={40} strokeWidth={1.2} />
        <p className="text-sm font-medium">Nenhuma oferta disponível para o seu perfil</p>
        <p className="text-xs">Volte em breve para conferir novas oportunidades</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {offers.length} {offers.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  )
}
