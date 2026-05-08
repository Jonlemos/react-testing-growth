'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PackageSearch, LogOut, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/feature/auth/hooks/useAuth"

const navItems = [
  {
    label: "Início",
    href: "/portal/home",
    icon: LayoutDashboard,
  },
  {
    label: "Ofertas",
    href: "/portal/offers",
    icon: PackageSearch,
  },
]

export const PortalSidebar = () => {
  const pathname = usePathname()
  const { user, logout, isLoggingOut } = useAuth()
  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "U"

  return (
    <aside className="flex h-full w-64 flex-col bg-secondary border-r border-border/20 shrink-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/20">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">P</span>
        </div>
        <span className="text-lg font-semibold text-secondary-foreground tracking-tight">
          Portal PJ
        </span>
      </div>

      <nav aria-label="Navegação principal" className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-secondary-foreground/70 hover:bg-white/10 hover:text-secondary-foreground"
                  )}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.8} aria-hidden="true" />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto opacity-60" aria-hidden="true" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      <Separator className="bg-border/20" />
      <div className="px-3 py-4 space-y-2">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-secondary-foreground truncate">
              {user?.name ?? "Usuário"}
            </span>
            {user?.segment && (
              <Badge
                variant="outline"
                className="w-fit text-[10px] px-1.5 py-0 mt-0.5 border-primary/40 text-primary font-medium"
              >
                {user.segment}
              </Badge>
            )}
          </div>
        </div>
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-foreground/60 hover:bg-white/10 hover:text-secondary-foreground transition-all duration-150 disabled:opacity-50"
        >
          <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
        </button>
      </div>
    </aside>
  )
}
