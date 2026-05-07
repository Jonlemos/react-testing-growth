'use client'

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"

const routeTitles: Record<string, string> = {
  "/portal/home": "Início",
  "/portal/offers": "Ofertas disponíveis",
}

export function PortalHeader() {
  const pathname = usePathname()

  const title =
    routeTitles[pathname] ??
    (pathname.includes("/portal/offers/") ? "Detalhes da Oferta" : "Portal")

  return (
    <header className="flex flex-col shrink-0">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie suas contratações e simulações
          </p>
        </div>
      </div>
      <Separator />
    </header>
  )
}
