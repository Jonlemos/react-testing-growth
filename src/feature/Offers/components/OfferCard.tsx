'use client'

import Link from "next/link"
import { ArrowRight, TrendingUp, Shield, Wallet } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Offer } from "../types"
import { useSimulationStore } from "../store/simulation.store"

const categoryConfig = {
  credito: { label: "Crédito", icon: Wallet, color: "text-blue-500" },
  investimento: { label: "Investimento", icon: TrendingUp, color: "text-emerald-500" },
  seguros: { label: "Seguros", icon: Shield, color: "text-violet-500" },
} as const

export const OfferCard = ({ offer }: { offer: Offer }) => {
  const { flags: { canContract: flagsCanContract, canSimulate: flagsCanSimulate } } = offer
  const category = categoryConfig[offer.category]
  const CategoryIcon = category.icon
  const store = useSimulationStore(offer.id, offer.minAmount)
  const isContinueSimulation = flagsCanContract && store.currentStep !== 1
  const isUnavailable = !flagsCanContract && !flagsCanSimulate

  return (
    <Card
      className={cn(
        "group flex flex-col transition-all duration-200",
        "hover:shadow-md hover:border-primary/30",
        !flagsCanContract && !flagsCanSimulate && "opacity-60"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className={cn("flex size-9 items-center justify-center rounded-lg bg-muted shrink-0", category.color)}>
            <CategoryIcon size={18} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <div className="flex gap-1.5 flex-wrap justify-end">
            {flagsCanSimulate && (
              <Badge variant="outline" className="text-[10px] px-1.5 border-primary/30 text-primary">
                Simular
              </Badge>
            )}
            {flagsCanContract && (
              <Badge className="text-[10px] px-1.5 bg-primary text-primary-foreground">
                Disponível
              </Badge>
            )}
            {!flagsCanContract && !flagsCanSimulate && (
              <Badge variant="outline" className="text-[10px] px-1.5 text-muted-foreground">
                Indisponível
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="text-base mt-2 leading-snug">{offer.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{offer.summary}</p>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 pb-2 space-y-2 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">De</span>
          <span className="text-sm font-semibold text-foreground">
            R$ {offer.minAmount.toLocaleString('pt-BR')}
          </span>
          <span className="text-[11px] text-muted-foreground">até</span>
          <span className="text-sm font-semibold text-foreground">
            R$ {offer.maxAmount.toLocaleString('pt-BR')}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Elegibilidade:</span> {offer.eligibility}
        </p>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          asChild
          variant={flagsCanContract ? "default" : "outline"}
          size="sm"
          className="w-full group-hover:gap-2 transition-all"
          disabled={isUnavailable}
        >
          <Link href={`/portal/offers/${offer.id}`} className="flex items-center justify-center gap-1.5">
            {isContinueSimulation ? 'Continuar simulação' : flagsCanContract ? 'Ver e contratar' : flagsCanSimulate ? "Simular" : "Indisponível"}
            {(flagsCanContract || flagsCanSimulate) && (
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}