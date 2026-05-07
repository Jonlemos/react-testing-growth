'use client'

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useSimulationStore } from "../store/simulation.store"
import { useSimulateOffer } from "../hooks/useSimulateOffer"
import { useContractOffer } from "../hooks/useContractOffer"
import type { OfferDetail } from "../types"

const STEPS = ["Dados", "Revisão", "Confirmação"]
const TERM_OPTIONS = [12, 24, 36, 48, 60]

type Props = { offer: OfferDetail }

export const SimulationFlow = ({ offer }: Props) => {
  const store = useSimulationStore(offer.id, offer.minAmount)
  const simulateMutation = useSimulateOffer(offer.id)
  const contractMutation = useContractOffer(offer.id)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [contractId, setContractId] = useState<string | null>(null)

  const handleSimulate = () => {
    simulateMutation.mutate(
      { amount: store.amount, termMonths: store.termMonths },
      {
        onSuccess: (data) => {
          store.setResult(data)
          store.setStep(2)
        },
      }
    )
  }

  const handleContract = () => {
    if (!store.result?.simulationId) return
    contractMutation.mutate(
      { simulationId: store.result.simulationId, acceptTerms },
      {
        onSuccess: (data) => {
          setContractId(data.contractId)
          store.setStep(3)
        },
      }
    )
  }

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-4">
      {STEPS.map((label, i) => {
        const stepNum = (i + 1) as 1 | 2 | 3
        const isActive = store.currentStep === stepNum
        const isDone = store.currentStep > stepNum
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              "flex size-6 items-center justify-center rounded-full text-xs font-semibold border",
              isDone && "bg-primary border-primary text-primary-foreground",
              isActive && "border-primary text-primary",
              !isActive && !isDone && "border-muted-foreground/30 text-muted-foreground"
            )}>
              {isDone ? <CheckCircle2 size={12} /> : stepNum}
            </div>
            <span className={cn(
              "text-xs",
              isActive ? "text-foreground font-medium" : "text-muted-foreground"
            )}>{label}</span>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        )
      })}
    </div>
  )

  if (store.currentStep === 1) return (
    <div className="space-y-4">
      <StepIndicator />
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Valor desejado</span>
          <span className="font-semibold text-primary">R$ {store.amount.toLocaleString('pt-BR')}</span>
        </div>
        <input
          type="range"
          min={offer.minAmount}
          max={offer.maxAmount}
          step={1000}
          value={store.amount}
          onChange={(e) => store.setAmount(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>R$ {offer.minAmount.toLocaleString('pt-BR')}</span>
          <span>R$ {offer.maxAmount.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm">Prazo</span>
        <div className="flex gap-2 flex-wrap">
          {TERM_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => store.setTermMonths(t)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm border transition-colors",
                store.termMonths === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >{t}x</button>
          ))}
        </div>
      </div>

      <Button onClick={handleSimulate} disabled={simulateMutation.isPending} className="w-full">
        {simulateMutation.isPending ? "Calculando..." : "Simular →"}
      </Button>
    </div>
  )

  if (store.currentStep === 2 && store.result) return (
    <div className="space-y-4">
      <StepIndicator />
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm font-medium">Resultado da simulação</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Parcela mensal</p>
            <p className="font-bold text-primary">
              R$ {store.result.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total a pagar</p>
            <p className="font-semibold">
              R$ {store.result.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor solicitado</p>
            <p>R$ {store.amount.toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prazo</p>
            <p>{store.termMonths} meses</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => store.setStep(1)}>← Ajustar</Button>
        {store.result.flags.canContract && (
          <Button className="flex-1" onClick={() => store.setStep(3)}>Prosseguir →</Button>
        )}
      </div>
    </div>
  )

  if (store.currentStep === 3) {
    if (contractId) return (
      <div className="space-y-3 text-center py-6">
        <CheckCircle2 size={40} className="text-primary mx-auto" />
        <p className="font-semibold">Contratação realizada!</p>
        <p className="text-sm text-muted-foreground">Protocolo: <span className="font-mono">{contractId}</span></p>
        <Button variant="outline" size="sm" onClick={() => store.reset()}>Nova simulação</Button>
      </div>
    )

    return (
      <div className="space-y-4">
        <StepIndicator />
        <div className="rounded-lg border p-4 space-y-2 text-sm">
          <p className="font-medium">Resumo final</p>
          <Separator />
          <div className="flex justify-between"><span className="text-muted-foreground">Oferta</span><span>{offer.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Valor</span><span>R$ {store.amount.toLocaleString('pt-BR')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Prazo</span><span>{store.termMonths}x</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Parcela</span><span className="font-semibold text-primary">R$ {store.result?.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
        </div>

        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 accent-primary"
          />
          <span className="text-muted-foreground">Li e aceito os termos e condições desta contratação</span>
        </label>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => store.setStep(2)}>← Voltar</Button>
          <Button
            className="flex-1"
            disabled={!acceptTerms || contractMutation.isPending}
            onClick={handleContract}
          >
            {contractMutation.isPending ? "Processando..." : "Confirmar contratação"}
          </Button>
        </div>
      </div>
    )
  }

  return null
}
