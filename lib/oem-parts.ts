import { supabase } from "./supabase"
import { COMPREHENSIVE_BMW_PARTS, type BMWOEMPart as ComprehensivePart } from "./oem-parts-comprehensive"

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

function comprehensiveFallbackFilter(list: ComprehensivePart[], params: SearchOEMPartsParams): BMWOEMPart[] {
  let parts = [...list]

  if (params.query) {
    const q = params.query.toLowerCase()
    parts = parts.filter(
      (p) =>
        p.part_name.toLowerCase().includes(q) ||
        p.part_number.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.category_name || "").toLowerCase().includes(q),
    )
  }

  if (params.partNumber) {
    const pn = params.partNumber.toLowerCase()
    parts = parts.filter((p) => p.part_number.toLowerCase().includes(pn))
  }

  if (params.categoryCode && params.categoryCode !== "all") {
    parts = parts.filter((p) => p.category_code === params.categoryCode)
  }

  const series = params.seriesCode ?? params.chassisCode
  if (series) {
    parts = parts.filter((p) => (p.compatible_chassis || []).includes(series))
  }

  if (params.engineCode) {
    parts = parts.filter((p) => (p.compatible_engines || []).includes(params.engineCode!))
  }

  if (params.bodyType) {
    const bt = (params.bodyType || "").toLowerCase()
    parts = parts.filter((p: any) => {
      const arr: string[] | undefined = p.compatible_body_types
      if (!arr || arr.length === 0) return true
      return arr.map((x) => x.toLowerCase()).includes(bt)
    })
  }

  if (!params.includeDiscontinued) {
    parts = parts.filter((p) => !p.is_discontinued)
  }

  const limited = params.limit ? parts.slice(0, params.limit) : parts
  return limited.map((p) => ({
    id: String(p.id),
    part_number: p.part_number,
    part_name: p.part_name,
    description: p.description ?? null,
    price_msrp: p.price_msrp ?? null,
    is_discontinued: !!p.is_discontinued,
    superseded_by: (p as any).superseded_by ?? null,
    category_name: p.category_name ?? null,
    category_code: p.category_code ?? null,
    compatible_chassis: p.compatible_chassis ?? [],
    compatible_engines: p.compatible_engines ?? [],
    compatible_body_types: (p as any).compatible_body_types ?? [],
    earliest_year: p.earliest_year ?? null,
    latest_year: p.latest_year ?? null,
  }))
}

export async function searchOEMParts(params: SearchOEMPartsParams): Promise<BMWOEMPart[]> {
  try {
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
    return comprehensiveFallbackFilter(COMPREHENSIVE_BMW_PARTS, params)
  }
}

export async function getPartByNumber(partNumber: string): Promise<BMWOEMPart | null> {
  try {
    const { data: viewData, error: viewError } = await supabase
      .from("bmw_parts_search_view")
      .select("*")
      .eq("part_number", partNumber)
      .limit(1)
      .maybeSingle()

    if (!viewError && viewData) {
      return {
        id: viewData.id ?? viewData.part_id ?? viewData.part_number,
        part_number: viewData.part_number,
        part_name: viewData.part_name,
        description: viewData.description ?? null,
        price_msrp: viewData.price_msrp ?? null,
        is_discontinued: !!viewData.is_discontinued,
        superseded_by: viewData.superseded_by ?? null,
        category_name: viewData.category_name ?? viewData.system_category ?? null,
        category_code: viewData.category_code ?? null,
        compatible_chassis: viewData.compatible_chassis ?? [],
        compatible_engines: viewData.compatible_engines ?? [],
        earliest_year: viewData.earliest_year ?? null,
        latest_year: viewData.latest_year ?? null,
      }
    }

    const c = COMPREHENSIVE_BMW_PARTS.find((p) => p.part_number === partNumber)
    if (!c) return null
    return {
      id: String(c.id),
      part_number: c.part_number,
      part_name: c.part_name,
      description: c.description ?? null,
      price_msrp: c.price_msrp ?? null,
      is_discontinued: !!c.is_discontinued,
      superseded_by: (c as any).superseded_by ?? null,
      category_name: c.category_name ?? null,
      category_code: c.category_code ?? null,
      compatible_chassis: c.compatible_chassis ?? [],
      compatible_engines: c.compatible_engines ?? [],
      compatible_body_types: (c as any).compatible_body_types ?? [],
      earliest_year: c.earliest_year ?? null,
      latest_year: c.latest_year ?? null,
    }
  } catch {
    const c = COMPREHENSIVE_BMW_PARTS.find((p) => p.part_number === partNumber)
    if (!c) return null
    return {
      id: String(c.id),
      part_number: c.part_number,
      part_name: c.part_name,
      description: c.description ?? null,
      price_msrp: c.price_msrp ?? null,
      is_discontinued: !!c.is_discontinued,
      superseded_by: (c as any).superseded_by ?? null,
      category_name: c.category_name ?? null,
      category_code: c.category_code ?? null,
      compatible_chassis: c.compatible_chassis ?? [],
      compatible_engines: c.compatible_engines ?? [],
      compatible_body_types: (c as any).compatible_body_types ?? [],
      earliest_year: c.earliest_year ?? null,
      latest_year: c.latest_year ?? null,
    }
  }
}

export async function getBMWModels(): Promise<BMWModel[]> {
  try {
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
    const { data, error } = await supabase.from("bmw_chassis").select("*").order("chassis_code")
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export async function getBMWEngines(): Promise<BMWEngine[]> {
  try {
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
