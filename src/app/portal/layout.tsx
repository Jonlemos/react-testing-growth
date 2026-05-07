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
      {/* Hidrata a store de feature flags assim que o layout monta */}
      <FeatureFlagsHydrator />

      <PortalSidebar />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <PortalHeader />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
