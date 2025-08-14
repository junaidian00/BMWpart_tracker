"use client"

import { supabase, isSupabaseConfigured } from "./supabase"
import { getUserVehicles, createVehicle, type Vehicle } from "./maintenance"
import type { CarSelection } from "@/components/maintenance/hierarchical-car-selector"

export interface GarageVehicle extends Vehicle {
  // Additional garage-specific properties can be added here
}

export async function addVehicleToGarage(selection: CarSelection, userId: string): Promise<Vehicle> {
  if (
    !selection.year ||
    !selection.modelName ||
    !selection.chassisCode ||
    !selection.engineCode ||
    !selection.transmissionCode ||
    !selection.buildDate
  ) {
    throw new Error("Complete vehicle selection required")
  }

  const vehicleInput = {
    make: "BMW",
    model: selection.modelName,
    year: selection.year,
    engine: selection.engineCode,
    vin: "", // Will be filled by user later if needed
    // Store additional BMW info in nickname field
    nickname: `${selection.year} ${selection.modelName} (${selection.chassisCode}) - ${selection.transmissionCode}`,
    mileage: 0, // Default mileage, user can update later
  }

  try {
    const newVehicle = await createVehicle(vehicleInput)

    // The vehicle is successfully created with all the essential information
    // Additional BMW-specific details are stored in the nickname field

    return newVehicle
  } catch (error) {
    console.error("Error adding vehicle to garage:", error)
    throw error
  }
}

export async function getGarageVehicles(userId: string): Promise<GarageVehicle[]> {
  return getUserVehicles(userId)
}

export async function removeVehicleFromGarage(vehicleId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    // In demo mode, just return success
    return
  }

  try {
    const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId)

    if (error) throw error
  } catch (error) {
    console.error("Error removing vehicle from garage:", error)
    throw error
  }
}

export async function updateVehicleInGarage(vehicleId: string, updates: Partial<Vehicle>): Promise<Vehicle> {
  if (!isSupabaseConfigured) {
    // In demo mode, return a mock updated vehicle
    return { ...updates, id: vehicleId } as Vehicle
  }

  try {
    const { data, error } = await supabase.from("vehicles").update(updates).eq("id", vehicleId).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating vehicle in garage:", error)
    throw error
  }
}
