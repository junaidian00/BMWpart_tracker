import SellClient from "./sell-client"

// Server-only route config to avoid prerender crashes
export const dynamic = "force-dynamic"

export default function SellPage() {
  return (
    <main className="min-h-[60vh] mx-auto max-w-5xl p-6">
      <SellClient />
    </main>
  )
}
