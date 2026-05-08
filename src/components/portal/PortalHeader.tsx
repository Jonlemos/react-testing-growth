'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PackageSearch } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const routeTitles: Record<string, string> = {
  "/portal/home": "Início",
  "/portal/offers": "Ofertas disponíveis",
}

const mobileNav = [
  { href: "/portal/home", label: "Início", icon: LayoutDashboard },
  { href: "/portal/offers", label: "Ofertas", icon: PackageSearch },
]

export function PortalHeader() {
  const pathname = usePathname()

  const title =
    routeTitles[pathname] ??
    (pathname.includes("/portal/offers/") ? "Detalhes da Oferta" : "Portal")

  return (
    <>
      <header className="flex flex-col shrink-0">
        <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Gerencie suas contratações e simulações
            </p>
          </div>
        </div>
        <Separator />
      </header>

      <nav aria-label="Navegação mobile" className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-background border-t border-border">
        {mobileNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
