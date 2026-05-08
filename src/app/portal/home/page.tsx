'use client'

import Link from "next/link"
import { PackageSearch, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/feature/auth/hooks/useAuth"

export default function PortalHomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">
          Olá, {user?.name?.split(" ")[0] ?? "bem-vindo"} 👋
        </h2>
        <p className="text-muted-foreground">
          Confira as ofertas disponíveis para o seu perfil e simule antes de contratar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="group hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer">
          <Link href="/portal/offers" className="block">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <PackageSearch size={20} className="text-primary" />
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                />
              </div>
              <CardTitle className="text-base mt-3">Explorar Ofertas</CardTitle>
              <CardDescription>
                Veja as opções de crédito e produtos disponíveis para você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="text-primary border-primary/40 hover:bg-primary hover:text-primary-foreground">
                Ver ofertas
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="bg-secondary border-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-secondary-foreground">
              Seu perfil
            </CardTitle>
            <CardDescription className="text-secondary-foreground/60">
              As ofertas são personalizadas de acordo com o seu segmento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground/70">Segmento:</span>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/20 font-semibold">
                {user?.segment ?? "—"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-foreground/70">Email:</span>
              <span className="text-sm text-secondary-foreground font-medium">
                {user?.email ?? "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
