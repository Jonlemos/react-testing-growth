'use client'

import { useState, useTransition, useDeferredValue, useEffect, useRef } from "react"
import { PackageSearch } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOffers } from "../hooks/useOffers"
import { OfferCard } from "./OfferCard"
import { Loading } from "@/components/shared/loading/loading"
import { Analytics } from "@/lib/analytics"
import type { Offer } from "../types"

type Category = 'todos' | Offer['category']

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'credito', label: 'Crédito' },
  { value: 'investimento', label: 'Investimento' },
  { value: 'seguros', label: 'Seguros' },
]

export const OfferList = () => {
  const { data, isLoading, isError, error } = useOffers()

  const [isPending, startTransition] = useTransition()
  
  const [activeCategory, setActiveCategory] = useState<Category>('todos')
  const [activeRange, setActiveRange] = useState<'todos' | 'small' | 'medium' | 'large'>('todos')
  const [activeSegment, setActiveSegment] = useState<'todos' | 'VAREJO' | 'PRIVATE' | 'CORPORATE'>('todos')

  // useDeferredValue: the grid uses the "delayed" values, allowing the
  // React to prioritize updating the buttons before re-filtering the list.
  const deferredCategory = useDeferredValue(activeCategory)
  const deferredRange = useDeferredValue(activeRange)
  const deferredSegment = useDeferredValue(activeSegment)

  const offers = data?.offers ?? []
  
  const filtered = offers.filter((o) => {
    const matchCategory = deferredCategory === 'todos' || o.category === deferredCategory
    const matchSegment = deferredSegment === 'todos' || o.eligibility === deferredSegment
    
    let matchRange = true
    if (deferredRange === 'small') matchRange = o.maxAmount <= 50000
    if (deferredRange === 'medium') matchRange = o.maxAmount > 50000 && o.maxAmount <= 200000
    if (deferredRange === 'large') matchRange = o.maxAmount > 200000

    return matchCategory && matchSegment && matchRange
  })

  const trackedRef = useRef(false)
  useEffect(() => {
    if (offers.length > 0 && !trackedRef.current) {
      trackedRef.current = true
      Analytics.offerListViewed(offers.length)
    }
  }, [offers.length])

  const handleFilterCategory = (cat: Category) => {
    startTransition(() => setActiveCategory(cat))
    Analytics.offerFiltered(cat)
  }

  const handleFilterRange = (range: typeof activeRange) => {
    startTransition(() => setActiveRange(range))
    Analytics.offerFiltered(`range_${range}` as any)
  }

  const handleFilterSegment = (seg: typeof activeSegment) => {
    startTransition(() => setActiveSegment(seg))
    Analytics.offerFiltered(`seg_${seg}` as any)
  }

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
    <div className="space-y-6">

      {isPending && (
        <div className="flex items-center gap-2 px-3 py-2 text-[11px] bg-amber-50 border border-amber-100 text-amber-700 rounded-lg animate-pulse">
          <div className="size-1.5 rounded-full bg-amber-500" />
          Sistema processando filtros... A resposta pode ser ligeiramente mais lenta.
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Categoria</span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleFilterCategory(cat.value)}
                aria-pressed={activeCategory === cat.value}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Valor Máximo</span>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 'todos', l: 'Todos' },
                { v: 'small', l: 'Até 50k' },
                { v: 'medium', l: '50k - 200k' },
                { v: 'large', l: '200k+' }
              ].map((r) => (
                <button
                  key={r.v}
                  onClick={() => handleFilterRange(r.v as any)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] border transition-all",
                    activeRange === r.v ? "bg-secondary text-secondary-foreground border-secondary" : "border-border text-muted-foreground"
                  )}
                >
                  {r.l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Segmento</span>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 'todos', l: 'Todos' },
                { v: 'VAREJO', l: 'Varejo' },
                { v: 'PRIVATE', l: 'Private' },
                { v: 'CORPORATE', l: 'Corporate' }
              ].map((s) => (
                <button
                  key={s.v}
                  onClick={() => handleFilterSegment(s.v as any)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] border transition-all",
                    activeSegment === s.v ? "bg-secondary text-secondary-foreground border-secondary" : "border-border text-muted-foreground"
                  )}
                >
                  {s.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground border border-dashed rounded-xl">
          <PackageSearch size={32} strokeWidth={1.2} />
          <p className="text-sm">Nenhuma oferta corresponde aos filtros selecionados</p>
        </div>
      ) : (
        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-150",
          isPending && "opacity-50"
        )}>
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  )
}
