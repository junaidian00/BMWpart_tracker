import { supabase } from "./supabase"

export type BMWModel = {
  id: string
  series_code: string
  series_name: string
  model_name: string
  body_type: string | null
  production_start: number | null
  production_end: number | null
  engine_codes: string[] | null
  market_region: string
  created_at: string
}

export type BMWPartCategory = {
  id: string
  category_code: string
  category_name: string
  parent_category_id: string | null
  description: string | null
  diagram_section: string | null
  created_at: string
}

export type BMWOEMPart = {
  id: string
  part_number: string
  part_name: string
  description: string | null
  category_id: string | null
  superseded_by: string | null
  is_discontinued: boolean
  weight_kg: number | null
  price_msrp: number | null
  diagram_position: string | null
  notes: string | null
  created_at: string
  updated_at: string
  category?: BMWPartCategory
  compatible_models?: BMWModel[]
  alternatives?: BMWOEMPart[]
}

export type PartCompatibility = {
  id: string
  part_id: string
  model_id: string
  production_start: number | null
  production_end: number | null
  engine_specific: string[] | null
  transmission_specific: string[] | null
  market_specific: string[] | null
  notes: string | null
  created_at: string
}

// Enhanced search with full-text search capabilities
export async function searchOEMParts(params: {
  query?: string
  partNumber?: string
  categoryCode?: string
  seriesCode?: string
  modelName?: string
  yearFrom?: number
  yearTo?: number
  engineCode?: string
  bodyType?: string
  includeDiscontinued?: boolean
  limit?: number
  offset?: number
}) {
  console.log("Enhanced OEM parts search with params:", params)

  let query = supabase.from("bmw_oem_parts").select(`
      *,
      category:bmw_part_categories(*),
      compatibility:bmw_part_compatibility(
        *,
        model:bmw_models(*)
      )
    `)

  // Full-text search across multiple fields
  if (params.query) {
    const searchTerms = params.query.trim().split(/\s+/).join(" | ")
    query = query.or(
      `part_name.ilike.%${params.query}%,description.ilike.%${params.query}%,part_number.ilike.%${params.query}%,notes.ilike.%${params.query}%`,
    )
  }

  // Exact part number search
  if (params.partNumber) {
    query = query.eq("part_number", params.partNumber)
  }

  // Category filter
  if (params.categoryCode && params.categoryCode !== "all") {
    const { data: categoryData } = await supabase
      .from("bmw_part_categories")
      .select("id")
      .eq("category_code", params.categoryCode)
      .single()

    if (categoryData) {
      query = query.eq("category_id", categoryData.id)
    }
  }

  // Series code filter with compatibility check
  if (params.seriesCode && params.seriesCode !== "all") {
    const { data: compatibleParts } = await supabase
      .from("bmw_part_compatibility")
      .select("part_id")
      .eq("model.series_code", params.seriesCode)

    if (compatibleParts && compatibleParts.length > 0) {
      const partIds = compatibleParts.map((cp) => cp.part_id)
      query = query.in("id", partIds)
    }
  }

  // Model name filter
  if (params.modelName) {
    const { data: compatibleParts } = await supabase
      .from("bmw_part_compatibility")
      .select("part_id")
      .eq("model.model_name", params.modelName)

    if (compatibleParts && compatibleParts.length > 0) {
      const partIds = compatibleParts.map((cp) => cp.part_id)
      query = query.in("id", partIds)
    }
  }

  // Engine code filter
  if (params.engineCode) {
    const { data: compatibleParts } = await supabase
      .from("bmw_part_compatibility")
      .select("part_id")
      .contains("engine_specific", [params.engineCode])

    if (compatibleParts && compatibleParts.length > 0) {
      const partIds = compatibleParts.map((cp) => cp.part_id)
      query = query.in("id", partIds)
    }
  }

  // Body type filter
  if (params.bodyType) {
    const { data: compatibleParts } = await supabase
      .from("bmw_part_compatibility")
      .select("part_id")
      .eq("model.body_type", params.bodyType)

    if (compatibleParts && compatibleParts.length > 0) {
      const partIds = compatibleParts.map((cp) => cp.part_id)
      query = query.in("id", partIds)
    }
  }

  // Year range filter
  if (params.yearFrom || params.yearTo) {
    const { data: compatibleParts } = await supabase
      .from("bmw_part_compatibility")
      .select("part_id")
      .gte("production_start", params.yearFrom || 1970)
      .lte("production_end", params.yearTo || 2024)

    if (compatibleParts && compatibleParts.length > 0) {
      const partIds = compatibleParts.map((cp) => cp.part_id)
      query = query.in("id", partIds)
    }
  }

  // Include/exclude discontinued parts
  if (!params.includeDiscontinued) {
    query = query.eq("is_discontinued", false)
  }

  // Pagination
  const limit = params.limit || 100
  const offset = params.offset || 0
  query = query.range(offset, offset + limit - 1)

  // Order by relevance and part name
  query = query.order("part_name")

  const { data, error } = await query

  if (error) {
    console.error("Enhanced OEM parts search error:", error)
    throw error
  }

  console.log(`Enhanced search found ${data?.length || 0} parts`)
  return data || []
}

// Get parts for specific vehicle with enhanced compatibility
export async function getVehicleSpecificParts(
  year: number,
  make: string,
  model: string,
  engine?: string,
  category?: string,
  searchQuery?: string,
): Promise<BMWOEMPart[]> {
  console.log(`Getting parts for ${year} ${make} ${model} ${engine || ""}`)

  // First find the BMW model
  let modelQuery = supabase
    .from("bmw_models")
    .select("*")
    .eq("model_name", model)
    .lte("production_start", year)
    .gte("production_end", year)

  if (engine) {
    modelQuery = modelQuery.contains("engine_codes", [engine])
  }

  const { data: bmwModels, error: modelError } = await modelQuery

  if (modelError || !bmwModels || bmwModels.length === 0) {
    console.log("No matching BMW models found")
    return []
  }

  // Get compatible parts for all matching models
  const modelIds = bmwModels.map((m) => m.id)

  let partsQuery = supabase
    .from("bmw_part_compatibility")
    .select(`
      part:bmw_oem_parts(
        *,
        category:bmw_part_categories(*)
      ),
      model:bmw_models(*)
    `)
    .in("model_id", modelIds)
    .lte("production_start", year)
    .gte("production_end", year)

  // Filter by category if specified
  if (category && category !== "all") {
    const { data: categoryData } = await supabase
      .from("bmw_part_categories")
      .select("id")
      .eq("category_code", category)
      .single()

    if (categoryData) {
      partsQuery = partsQuery.eq("part.category_id", categoryData.id)
    }
  }

  // Text search if specified
  if (searchQuery) {
    partsQuery = partsQuery.or(
      `part.part_name.ilike.%${searchQuery}%,part.description.ilike.%${searchQuery}%,part.part_number.ilike.%${searchQuery}%`,
      { foreignTable: "part" },
    )
  }

  const { data, error } = await partsQuery.limit(200)

  if (error) {
    console.error("Vehicle-specific parts lookup error:", error)
    throw error
  }

  // Extract unique parts
  const uniqueParts = new Map()
  data?.forEach((item) => {
    if (item.part && !uniqueParts.has(item.part.id)) {
      uniqueParts.set(item.part.id, item.part)
    }
  })

  return Array.from(uniqueParts.values())
}

// Get all BMW models with enhanced filtering
export async function getBMWModels(params?: {
  seriesCode?: string
  yearFrom?: number
  yearTo?: number
  engineCode?: string
  bodyType?: string
}) {
  let query = supabase.from("bmw_models").select("*")

  if (params?.seriesCode) {
    query = query.eq("series_code", params.seriesCode)
  }

  if (params?.yearFrom) {
    query = query.gte("production_end", params.yearFrom)
  }

  if (params?.yearTo) {
    query = query.lte("production_start", params.yearTo)
  }

  if (params?.engineCode) {
    query = query.contains("engine_codes", [params.engineCode])
  }

  if (params?.bodyType) {
    query = query.eq("body_type", params.bodyType)
  }

  const { data, error } = await query.order("series_code, model_name")

  if (error) {
    console.error("Get BMW models error:", error)
    throw error
  }

  return data || []
}

// Get all part categories with hierarchy
export async function getPartCategories() {
  const { data, error } = await supabase.from("bmw_part_categories").select("*").order("category_name")

  if (error) {
    console.error("Get part categories error:", error)
    throw error
  }

  return data || []
}

// Get maintenance parts for specific vehicle
export async function getMaintenanceParts(
  year: number,
  make: string,
  model: string,
  engine?: string,
  mileage?: number,
) {
  const maintenanceCategories = [
    "ENG003A", // Oil Filters
    "BRK001A", // Front Brake Pads
    "BRK001B", // Rear Brake Pads
    "ENG005A", // Air Filters
    "ELE001A", // Spark Plugs
    "ELE001B", // Ignition Coils
    "ENG004D", // Cooling Hoses
    "SUS001A", // Front Shocks
    "SUS001B", // Rear Shocks
  ]

  const maintenanceParts = await Promise.all(
    maintenanceCategories.map(async (categoryCode) => {
      const parts = await getVehicleSpecificParts(year, make, model, engine, categoryCode)
      return {
        category: categoryCode,
        parts: parts.slice(0, 5), // Limit to top 5 per category
      }
    }),
  )

  return maintenanceParts.filter((category) => category.parts.length > 0)
}

// Advanced search with AI-powered suggestions
export async function searchPartsWithSuggestions(query: string) {
  // First try exact search
  const exactResults = await searchOEMParts({ query, limit: 50 })

  if (exactResults.length > 0) {
    return {
      results: exactResults,
      suggestions: [],
    }
  }

  // If no exact results, try fuzzy search with individual terms
  const terms = query.toLowerCase().split(/\s+/)
  const fuzzyResults = await Promise.all(terms.map((term) => searchOEMParts({ query: term, limit: 20 })))

  const combinedResults = fuzzyResults.flat()
  const uniqueResults = new Map()
  combinedResults.forEach((part) => {
    if (!uniqueResults.has(part.id)) {
      uniqueResults.set(part.id, part)
    }
  })

  return {
    results: Array.from(uniqueResults.values()).slice(0, 50),
    suggestions: [
      "Try searching by part number (e.g., 11427566327)",
      "Search by category (e.g., oil filter, brake pads)",
      "Include BMW model (e.g., F30 oil filter)",
      "Try engine code (e.g., N55 spark plugs)",
    ],
  }
}
