'use client'

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, Shield, Wallet, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loading } from "@/components/shared/loading/loading"
import { useOnlyOffer } from "@/feature/Offers/hooks/useOnlyOffer"
import { SimulationFlow } from "@/feature/Offers/components/SimulationFlow"

const categoryConfig = {
  credito: { label: "Crédito", icon: Wallet },
  investimento: { label: "Investimento", icon: TrendingUp },
  seguros: { label: "Seguros", icon: Shield },
} as const

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: offer, isLoading, isError } = useOnlyOffer(id)

  if (isLoading) return <div className="flex justify-center py-24"><Loading /></div>

  if (isError || !offer) return (
    <div className="flex flex-col items-center gap-3 py-24">
      <p className="text-sm text-destructive">Oferta não encontrada</p>
      <Button variant="outline" size="sm" onClick={() => router.back()}>Voltar</Button>
    </div>
  )

  const category = categoryConfig[offer.category]
  const CategoryIcon = category.icon

  return (
    <div className="max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground -ml-2" onClick={() => router.back()}>
        <ArrowLeft size={16} /> Voltar
      </Button>

      {offer.whyThisOffer && (
            <div className="rounded-md bg-muted p-3 flex gap-2">
              <Lightbulb size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium mb-0.5">Por que esta oferta é para você</p>
                <p className="text-xs text-muted-foreground">{offer.whyThisOffer}</p>
              </div>
            </div>
        )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <CategoryIcon size={20} className="text-primary" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{offer.name}</CardTitle>
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{category.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{offer.summary}</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Faixa de valor</p>
              <p className="font-medium">R$ {offer.minAmount.toLocaleString('pt-BR')} – R$ {offer.maxAmount.toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Taxa a partir de</p>
              <p className="font-medium">{offer.conditions?.rateFrom}% a.m.</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Elegibilidade</p>
            <p>{offer.eligibility}</p>
          </div>
        </CardContent>
      </Card>

      {/* Painel de simulação / fluxo em etapas */}
      {offer.flags.canSimulate ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Simular e contratar</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <SimulationFlow offer={offer} />
          </CardContent>
        </Card>
      ) : !offer.flags.canContract && (
        <Card>
          <CardContent className="py-5 text-center text-sm text-muted-foreground">
            Esta oferta não está disponível para o seu perfil no momento.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
