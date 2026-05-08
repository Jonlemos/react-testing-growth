import { Suspense } from "react"
import { OfferList } from "@/feature/offers/components/OfferList"
import { Loading } from "@/components/shared/loading/loading"

export default function OffersPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">Ofertas disponíveis</h2>
        <p className="text-sm text-muted-foreground">
          Selecione uma oferta para simular ou contratar conforme o seu perfil
        </p>
      </div>
      
      <Suspense fallback={<Loading />}>
        <OfferList />
      </Suspense>
    </div>
  )
}