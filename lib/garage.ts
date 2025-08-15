"use client"

import { supabase, isSupabaseConfigured } from "./supabase"
import { getUserVehicles, createVehicle, type Vehicle } from "./maintenance"
import { OfflineAuthSystem } from "./offline-auth"
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
    nickname: `${selection.year} ${selection.modelName} (${selection.chassisCode}) - ${selection.transmissionCode} - Built: ${selection.buildDate}`,
    mileage: 0, // Default mileage, user can update later
  }

  // Check if we're in offline mode
  const offlineUser = OfflineAuthSystem.getCurrentUser()
  if (offlineUser) {
    const vehicle = {
      ...vehicleInput,
      id: `vehicle_${Date.now()}`,
      user_id: offlineUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    OfflineAuthSystem.saveVehicle(vehicle)
    return vehicle
  }

  try {
    const newVehicle = await createVehicle(vehicleInput)
    return newVehicle
  } catch (error) {
    console.error("Error adding vehicle to garage:", error)
    // Fallback to offline mode if Supabase fails
    const vehicle = {
      ...vehicleInput,
      id: `vehicle_${Date.now()}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    OfflineAuthSystem.saveVehicle(vehicle)
    return vehicle
  }
}

export async function getGarageVehicles(userId: string): Promise<GarageVehicle[]> {
  // Check if we're in offline mode
  const offlineUser = OfflineAuthSystem.getCurrentUser()
  if (offlineUser) {
    return OfflineAuthSystem.getVehicles()
  }

  try {
    return await getUserVehicles(userId)
  } catch (error) {
    console.error("Error getting garage vehicles:", error)
    // Fallback to offline mode
    return OfflineAuthSystem.getVehicles()
  }
}

export async function removeVehicleFromGarage(vehicleId: string): Promise<void> {
  // Check if we're in offline mode
  const offlineUser = OfflineAuthSystem.getCurrentUser()
  if (offlineUser) {
    // Remove from localStorage
    const vehicles = OfflineAuthSystem.getVehicles()
    const updatedVehicles = vehicles.filter((v) => v.id !== vehicleId)
    localStorage.setItem("bmw_parts_offline_vehicles", JSON.stringify(updatedVehicles))
    return
  }

  if (!isSupabaseConfigured) {
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
  // Check if we're in offline mode
  const offlineUser = OfflineAuthSystem.getCurrentUser()
  if (offlineUser) {
    const vehicles = OfflineAuthSystem.getVehicles()
    const vehicleIndex = vehicles.findIndex((v) => v.id === vehicleId)
    if (vehicleIndex !== -1) {
      vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem("bmw_parts_offline_vehicles", JSON.stringify(vehicles))
      return vehicles[vehicleIndex]
    }
    return { ...updates, id: vehicleId } as Vehicle
  }

  if (!isSupabaseConfigured) {
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
