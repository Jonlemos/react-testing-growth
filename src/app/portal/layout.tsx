import { PortalSidebar } from "@/components/portal/PortalSidebar"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { FeatureFlagsHydrator } from "@/components/portal/FeatureFlagsHydrator"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <FeatureFlagsHydrator />

      <div className="hidden md:flex">
        <PortalSidebar />
      </div>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <PortalHeader />
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-20 md:px-8 md:py-6 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
