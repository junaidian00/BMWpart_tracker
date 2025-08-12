import { getSupabaseClient } from "./supabase"
import { REALOEM_PARTS_DATABASE, type RealOEMPart } from "./realoem-parts-database"

export interface BMWOEMPart {
  id: string
  part_number: string
  part_name: string
  description: string | null
  price_msrp: number | null
  is_discontinued: boolean
  superseded_by: string | null

  category_name?: string | null
  category_code?: string | null

  compatible_chassis?: string[]
  compatible_engines?: string[]
  compatible_body_types?: string[]
  earliest_year?: number | null
  latest_year?: number | null

  category?: {
    category_name: string
    category_code: string
  }
}

export interface BMWModel {
  id: string
  model_name: string
  chassis_code: string
  production_start: number
  production_end: number | null
  series_name: string
}

export interface BMWPartCategory {
  id: string
  category_name: string
  category_code: string
  description: string | null
}

export interface BMWChassis {
  id: string
  chassis_code: string
  chassis_name: string
  production_start: number
  production_end: number | null
}

export interface BMWEngine {
  id: string
  engine_code: string
  engine_name: string
  displacement: number | null
  fuel_type: string | null
}

export interface SearchOEMPartsParams {
  query?: string
  partNumber?: string
  categoryCode?: string
  chassisCode?: string
  seriesCode?: string
  engineCode?: string
  bodyType?: string
  includeDiscontinued?: boolean
  limit?: number
  offset?: number
}

export type SearchFilters = SearchOEMPartsParams

function convertRealOEMToBMWOEM(realOEMPart: RealOEMPart): BMWOEMPart {
  return {
    id: realOEMPart.id,
    part_number: realOEMPart.partNumber,
    part_name: realOEMPart.name,
    description: realOEMPart.description,
    price_msrp: realOEMPart.price,
    is_discontinued: realOEMPart.availability === "Discontinued",
    superseded_by: null,
    category_name: realOEMPart.category,
    category_code: realOEMPart.category.toUpperCase().replace(/\s+/g, "_"),
    compatible_chassis: realOEMPart.compatibility.chassisCodes,
    compatible_engines: realOEMPart.compatibility.engineCodes,
    compatible_body_types: realOEMPart.compatibility.bodyTypes || [],
    earliest_year: Math.min(...realOEMPart.compatibility.years),
    latest_year: Math.max(...realOEMPart.compatibility.years),
  }
}

function comprehensiveFallbackFilter(list: RealOEMPart[], params: SearchOEMPartsParams): BMWOEMPart[] {
  let parts = [...list]

  if (params.query) {
    const q = params.query.toLowerCase()
    parts = parts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }

  if (params.partNumber) {
    const pn = params.partNumber.toLowerCase()
    parts = parts.filter((p) => p.partNumber.toLowerCase().includes(pn))
  }

  if (params.categoryCode && params.categoryCode !== "all") {
    const categoryName = params.categoryCode.toLowerCase().replace(/_/g, " ")
    parts = parts.filter((p) => p.category.toLowerCase() === categoryName)
  }

  const series = params.seriesCode ?? params.chassisCode
  if (series) {
    parts = parts.filter(
      (p) => p.compatibility.chassisCodes.includes("ALL") || p.compatibility.chassisCodes.includes(series),
    )
  }

  if (params.engineCode) {
    parts = parts.filter(
      (p) => p.compatibility.engineCodes.includes("ALL") || p.compatibility.engineCodes.includes(params.engineCode!),
    )
  }

  if (params.bodyType) {
    const bt = (params.bodyType || "").toLowerCase()
    parts = parts.filter((p) => {
      const arr = p.compatibility.bodyTypes
      if (!arr || arr.length === 0) return true
      return arr.map((x) => x.toLowerCase()).includes(bt)
    })
  }

  if (!params.includeDiscontinued) {
    parts = parts.filter((p) => p.availability !== "Discontinued")
  }

  const limited = params.limit ? parts.slice(0, params.limit) : parts
  return limited.map(convertRealOEMToBMWOEM)
}

export async function searchOEMParts(params: SearchOEMPartsParams): Promise<BMWOEMPart[]> {
  try {
    const supabase = getSupabaseClient()
    const limit = params.limit ?? 50
    const offset = params.offset ?? 0

    let query = supabase
      .from("bmw_parts_search_view")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)

    if (params.query) {
      const term = params.query.trim()
      query = query.or(
        `part_name.ilike.%${term}%,description.ilike.%${term}%,part_number.ilike.%${term}%,category_name.ilike.%${term}%`,
      )
    }

    if (params.partNumber) query = query.eq("part_number", params.partNumber)
    if (params.categoryCode) query = query.eq("category_code", params.categoryCode)

    const series = params.seriesCode ?? params.chassisCode
    if (series) query = query.contains("compatible_chassis", [series])

    if (params.engineCode) query = query.contains("compatible_engines", [params.engineCode])

    if (!params.includeDiscontinued) query = query.eq("is_discontinued", false)

    const { data, error } = await query.order("part_name", { ascending: true })
    if (error) throw error

    return (data || []).map((row: any) => ({
      id: row.id ?? row.part_id ?? row.part_number,
      part_number: row.part_number,
      part_name: row.part_name,
      description: row.description ?? null,
      price_msrp: row.price_msrp ?? null,
      is_discontinued: !!row.is_discontinued,
      superseded_by: row.superseded_by ?? null,
      category_name: row.category_name ?? row.system_category ?? null,
      category_code: row.category_code ?? null,
      compatible_chassis: row.compatible_chassis ?? [],
      compatible_engines: row.compatible_engines ?? [],
      earliest_year: row.earliest_year ?? null,
      latest_year: row.latest_year ?? null,
    }))
  } catch {
    return comprehensiveFallbackFilter(REALOEM_PARTS_DATABASE, params)
  }
}

export async function getPartByNumber(partNumber: string): Promise<BMWOEMPart | null> {
  try {
    const supabase = getSupabaseClient()
    const { data: row, error } = await supabase
      .from("bmw_parts_search_view")
      .select("*")
      .eq("part_number", partNumber)
      .maybeSingle()

    if (error) throw error
    if (row) {
      return {
        id: row.id ?? row.part_id ?? row.part_number,
        part_number: row.part_number,
        part_name: row.part_name,
        description: row.description ?? null,
        price_msrp: row.price_msrp ?? null,
        is_discontinued: !!row.is_discontinued,
        superseded_by: row.superseded_by ?? null,
        category_name: row.category_name ?? row.system_category ?? null,
        category_code: row.category_code ?? null,
        compatible_chassis: row.compatible_chassis ?? [],
        compatible_engines: row.compatible_engines ?? [],
        earliest_year: row.earliest_year ?? null,
        latest_year: row.latest_year ?? null,
      }
    }

    const realOEMPart = REALOEM_PARTS_DATABASE.find((p) => p.partNumber === partNumber)
    if (!realOEMPart) return null
    return convertRealOEMToBMWOEM(realOEMPart)
  } catch {
    const realOEMPart = REALOEM_PARTS_DATABASE.find((p) => p.partNumber === partNumber)
    if (!realOEMPart) return null
    return convertRealOEMToBMWOEM(realOEMPart)
  }
}

export async function getBMWModels(): Promise<BMWModel[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("bmw_model_variants").select(
      `
        id,
        model_name,
        bmw_chassis!inner(
          chassis_code,
          chassis_name,
          production_start,
          production_end
        )
      `,
    )
    if (error) throw error
    return (
      data?.map((variant: any) => ({
        id: variant.id,
        model_name: variant.model_name,
        chassis_code: variant.bmw_chassis.chassis_code,
        production_start: variant.bmw_chassis.production_start,
        production_end: variant.bmw_chassis.production_end,
        series_name: variant.bmw_chassis.chassis_name,
      })) || []
    )
  } catch {
    return []
  }
}

export async function getPartCategories(): Promise<BMWPartCategory[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("bmw_part_categories").select("*").order("category_name")
    if (error) throw error
    return data || []
  } catch {
    return [
      { id: "ENGINE", category_name: "Engine Components", category_code: "ENGINE", description: "Engine components" },
      { id: "BRAKES", category_name: "Brake System", category_code: "BRAKES", description: "Brake system parts" },
      {
        id: "SUSPENSION",
        category_name: "Suspension & Steering",
        category_code: "SUSPENSION",
        description: "Suspension parts",
      },
      { id: "COOLING", category_name: "Cooling System", category_code: "COOLING", description: "Cooling system parts" },
      { id: "EXTERIOR", category_name: "Exterior Parts", category_code: "EXTERIOR", description: "Exterior parts" },
    ]
  }
}

export async function getBMWChassis(): Promise<BMWChassis[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("bmw_chassis").select("*").order("chassis_code")
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export async function getBMWEngines(): Promise<BMWEngine[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("bmw_engines").select("*").order("engine_code")
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export type VehiclePartFilters = {
  chassisCode?: string
  seriesCode?: string
  engineCode?: string
  bodyType?: string
  categoryCode?: string
  query?: string
  includeDiscontinued?: boolean
  limit?: number
  offset?: number
}

export async function getVehicleSpecificParts(filters: VehiclePartFilters): Promise<BMWOEMPart[]> {
  return searchOEMParts({
    query: filters.query,
    categoryCode: filters.categoryCode,
    chassisCode: filters.chassisCode,
    seriesCode: filters.seriesCode,
    engineCode: filters.engineCode,
    bodyType: filters.bodyType,
    includeDiscontinued: filters.includeDiscontinued,
    limit: filters.limit,
    offset: filters.offset,
  })
}
