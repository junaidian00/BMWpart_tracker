import MaintenanceClientPage from "./maintenance-client-page"
import type { Metadata } from "next"

// Server-only route config to avoid prerender errors
export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Maintenance",
  description: "Track and explore maintenance for your vehicles.",
}

export default function MaintenancePage() {
  return <MaintenanceClientPage />
}
