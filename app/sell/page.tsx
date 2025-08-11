"use client"
import SellClient from "./sell-client"

const partCategories = [
  "Engine Components",
  "Forced Induction",
  "Transmission",
  "Suspension & Steering",
  "Brake System",
  "Electrical System",
  "Cooling System",
  "Exhaust System",
  "Fuel System",
  "Interior Parts",
  "Exterior Parts",
  "Wheels & Tires",
  "Performance Parts",
]

const compatibleModels = [
  "F30 3 Series Sedan",
  "F31 3 Series Touring",
  "F32 4 Series Coupe",
  "F33 4 Series Convertible",
  "F36 4 Series Gran Coupe",
  "F22 2 Series Coupe",
  "F23 2 Series Convertible",
  "E90 3 Series",
  "E92 3 Series",
  "Other BMW Models",
]

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default function SellPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sell a Part</h1>
      <SellClient />
    </main>
  )
}
