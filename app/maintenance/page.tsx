// Server wrapper for /maintenance. Do NOT mark as "use client".
import MaintenanceClient from "./maintenance-client"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default function MaintenancePage() {
  return (
    <main className="min-h-[60vh] mx-auto max-w-5xl p-6">
      <MaintenanceClient />
    </main>
  )
}
