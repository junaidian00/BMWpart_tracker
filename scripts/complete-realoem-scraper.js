import puppeteer from "puppeteer"
import { createClient } from "@supabase/supabase-js"
import fs from "fs/promises"
import path from "path"

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// RealOEM BMW catalog structure
const REALOEM_BASE_URL = "https://www.realoem.com"
const BMW_CATALOG_URL = "https://www.realoem.com/bmw/"

// Comprehensive BMW model mapping from RealOEM
const BMW_MODEL_SERIES = {
  // Classic BMW (1970s-1980s)
  E3: { name: "2500/2800/3.0S/3.3L", years: [1970, 1977], type: "sedan" },
  E9: { name: "2800CS/3.0CS/3.0CSL", years: [1970, 1975], type: "coupe" },
  E12: { name: "5 Series", years: [1972, 1981], type: "sedan" },
  E21: { name: "3 Series", years: [1975, 1983], type: "sedan" },
  E23: { name: "7 Series", years: [1977, 1987], type: "sedan" },
  E24: { name: "6 Series", years: [1976, 1989], type: "coupe" },
  E28: { name: "5 Series", years: [1981, 1988], type: "sedan" },
  E30: { name: "3 Series", years: [1982, 1994], type: "multiple" },
  E32: { name: "7 Series", years: [1986, 1994], type: "sedan" },
  E34: { name: "5 Series", years: [1988, 1996], type: "multiple" },

  // 1990s BMW
  E36: { name: "3 Series", years: [1990, 2000], type: "multiple" },
  E38: { name: "7 Series", years: [1994, 2001], type: "sedan" },
  E39: { name: "5 Series", years: [1995, 2003], type: "multiple" },
  E46: { name: "3 Series", years: [1998, 2006], type: "multiple" },
  E52: { name: "Z8", years: [2000, 2003], type: "roadster" },
  E53: { name: "X5", years: [1999, 2006], type: "sav" },

  // 2000s BMW
  E60: { name: "5 Series", years: [2003, 2010], type: "sedan" },
  E61: { name: "5 Series Touring", years: [2004, 2010], type: "touring" },
  E63: { name: "6 Series", years: [2003, 2010], type: "coupe" },
  E64: { name: "6 Series", years: [2004, 2010], type: "convertible" },
  E65: { name: "7 Series", years: [2001, 2008], type: "sedan" },
  E66: { name: "7 Series L", years: [2001, 2008], type: "sedan" },
  E70: { name: "X5", years: [2007, 2013], type: "sav" },
  E71: { name: "X6", years: [2008, 2014], type: "sac" },
  E72: { name: "X6 ActiveHybrid", years: [2010, 2014], type: "sac" },
  E81: { name: "1 Series", years: [2007, 2013], type: "3-door" },
  E82: { name: "1 Series", years: [2008, 2013], type: "coupe" },
  E83: { name: "X3", years: [2003, 2010], type: "sav" },
  E84: { name: "X1", years: [2009, 2015], type: "sav" },
  E85: { name: "Z4", years: [2002, 2008], type: "roadster" },
  E86: { name: "Z4", years: [2006, 2008], type: "coupe" },
  E87: { name: "1 Series", years: [2004, 2013], type: "5-door" },
  E88: { name: "1 Series", years: [2008, 2013], type: "convertible" },
  E89: { name: "Z4", years: [2009, 2016], type: "roadster" },
  E90: { name: "3 Series", years: [2005, 2013], type: "sedan" },
  E91: { name: "3 Series", years: [2005, 2013], type: "touring" },
  E92: { name: "3 Series", years: [2007, 2013], type: "coupe" },
  E93: { name: "3 Series", years: [2007, 2013], type: "convertible" },

  // F-Series (2010s)
  F01: { name: "7 Series", years: [2008, 2015], type: "sedan" },
  F02: { name: "7 Series L", years: [2008, 2015], type: "sedan" },
  F03: { name: "7 Series L Security", years: [2009, 2015], type: "sedan" },
  F04: { name: "7 Series L Hybrid", years: [2010, 2015], type: "sedan" },
  F06: { name: "6 Series", years: [2012, 2018], type: "gran-coupe" },
  F07: { name: "5 Series", years: [2009, 2017], type: "gran-turismo" },
  F10: { name: "5 Series", years: [2010, 2017], type: "sedan" },
  F11: { name: "5 Series", years: [2010, 2017], type: "touring" },
  F12: { name: "6 Series", years: [2011, 2018], type: "convertible" },
  F13: { name: "6 Series", years: [2011, 2018], type: "coupe" },
  F15: { name: "X5", years: [2013, 2018], type: "sav" },
  F16: { name: "X6", years: [2014, 2019], type: "sac" },
  F18: { name: "7 Series L", years: [2012, 2015], type: "sedan" },
  F20: { name: "1 Series", years: [2011, 2019], type: "5-door" },
  F21: { name: "1 Series", years: [2012, 2019], type: "3-door" },
  F22: { name: "2 Series", years: [2014, 2021], type: "coupe" },
  F23: { name: "2 Series", years: [2015, 2021], type: "convertible" },
  F25: { name: "X3", years: [2010, 2017], type: "sav" },
  F26: { name: "X4", years: [2014, 2018], type: "sac" },
  F30: { name: "3 Series", years: [2012, 2019], type: "sedan" },
  F31: { name: "3 Series", years: [2012, 2019], type: "touring" },
  F32: { name: "4 Series", years: [2013, 2020], type: "coupe" },
  F33: { name: "4 Series", years: [2014, 2020], type: "convertible" },
  F34: { name: "3 Series", years: [2013, 2019], type: "gran-turismo" },
  F36: { name: "4 Series", years: [2014, 2020], type: "gran-coupe" },
  F39: { name: "X2", years: [2018, 2021], type: "sac" },
  F40: { name: "1 Series", years: [2019, 2023], type: "5-door" },
  F44: { name: "2 Series", years: [2019, 2023], type: "gran-coupe" },
  F45: { name: "2 Series", years: [2014, 2021], type: "active-tourer" },
  F46: { name: "2 Series", years: [2015, 2021], type: "gran-tourer" },
  F48: { name: "X1", years: [2015, 2022], type: "sav" },
  F49: { name: "X1 LWB", years: [2016, 2022], type: "sav" },
  F52: { name: "1 Series", years: [2017, 2021], type: "sedan" },
  F54: { name: "MINI Clubman", years: [2015, 2023], type: "clubman" },
  F55: { name: "MINI 5-door", years: [2014, 2023], type: "5-door" },
  F56: { name: "MINI 3-door", years: [2014, 2023], type: "3-door" },
  F57: { name: "MINI Convertible", years: [2016, 2023], type: "convertible" },
  F60: { name: "MINI Countryman", years: [2017, 2023], type: "countryman" },

  // M-Cars F-Series
  F80: { name: "M3", years: [2014, 2018], type: "sedan" },
  F82: { name: "M4", years: [2014, 2020], type: "coupe" },
  F83: { name: "M4", years: [2014, 2020], type: "convertible" },
  F85: { name: "X5 M", years: [2015, 2018], type: "sav" },
  F86: { name: "X6 M", years: [2015, 2019], type: "sac" },
  F87: { name: "M2", years: [2016, 2020], type: "coupe" },
  F90: { name: "M5", years: [2017, 2023], type: "sedan" },
  F91: { name: "M8", years: [2019, 2023], type: "gran-coupe" },
  F92: { name: "M8", years: [2019, 2023], type: "coupe" },
  F93: { name: "M8", years: [2019, 2023], type: "convertible" },
  F95: { name: "X5 M", years: [2019, 2023], type: "sav" },
  F96: { name: "X6 M", years: [2019, 2023], type: "sac" },
  F97: { name: "X3 M", years: [2019, 2023], type: "sav" },
  F98: { name: "X4 M", years: [2019, 2023], type: "sac" },

  // G-Series (2017+)
  G01: { name: "X3", years: [2017, 2024], type: "sav" },
  G02: { name: "X4", years: [2018, 2024], type: "sac" },
  G05: { name: "X5", years: [2018, 2024], type: "sav" },
  G06: { name: "X6", years: [2019, 2024], type: "sac" },
  G07: { name: "X7", years: [2018, 2024], type: "sav" },
  G08: { name: "X2", years: [2021, 2024], type: "sac" },
  G09: { name: "XM", years: [2022, 2024], type: "sav" },
  G11: { name: "7 Series", years: [2015, 2022], type: "sedan" },
  G12: { name: "7 Series L", years: [2015, 2022], type: "sedan" },
  G14: { name: "8 Series", years: [2019, 2024], type: "gran-coupe" },
  G15: { name: "8 Series", years: [2018, 2024], type: "coupe" },
  G16: { name: "8 Series", years: [2019, 2024], type: "convertible" },
  G20: { name: "3 Series", years: [2019, 2024], type: "sedan" },
  G21: { name: "3 Series", years: [2019, 2024], type: "touring" },
  G22: { name: "4 Series", years: [2020, 2024], type: "coupe" },
  G23: { name: "4 Series", years: [2021, 2024], type: "convertible" },
  G26: { name: "4 Series", years: [2021, 2024], type: "gran-coupe" },
  G29: { name: "Z4", years: [2018, 2024], type: "roadster" },
  G30: { name: "5 Series", years: [2017, 2024], type: "sedan" },
  G31: { name: "5 Series", years: [2017, 2024], type: "touring" },
  G32: { name: "6 Series", years: [2017, 2023], type: "gran-turismo" },
  G38: { name: "7 Series L", years: [2019, 2022], type: "sedan" },
  G42: { name: "2 Series", years: [2021, 2024], type: "coupe" },
  G43: { name: "2 Series", years: [2022, 2024], type: "convertible" },
  G70: { name: "7 Series", years: [2022, 2024], type: "sedan" },
  G71: { name: "7 Series L", years: [2022, 2024], type: "sedan" },

  // G-Series M-Cars
  G80: { name: "M3", years: [2021, 2024], type: "sedan" },
  G81: { name: "M3", years: [2022, 2024], type: "touring" },
  G82: { name: "M4", years: [2021, 2024], type: "coupe" },
  G83: { name: "M4", years: [2021, 2024], type: "convertible" },
  G87: { name: "M2", years: [2023, 2024], type: "coupe" },

  // U-Series (Latest)
  U06: { name: "2 Series", years: [2022, 2024], type: "active-tourer" },
  U11: { name: "X1", years: [2022, 2024], type: "sav" },
  U12: { name: "X1 LWB", years: [2022, 2024], type: "sav" },
}

// RealOEM diagram categories that contain parts
const DIAGRAM_CATEGORIES = [
  "engine",
  "engine-electrical-system",
  "fuel-preparation-system",
  "fuel-supply",
  "cooling-system",
  "exhaust-system",
  "clutch",
  "manual-transmission",
  "automatic-transmission",
  "rear-axle",
  "front-axle",
  "brakes",
  "pedals-steering-column",
  "steering",
  "suspension",
  "wheels-tires",
  "body",
  "seats",
  "door",
  "sliding-roof-convertible-top",
  "exterior-equipment",
  "interior-equipment",
  "air-conditioning",
  "electrical-system",
  "instruments",
  "additional-equipment",
  "engine-compartment",
  "luggage-compartment",
  "individual-options",
]

class RealOEMScraper {
  constructor() {
    this.browser = null
    this.page = null
    this.scrapedParts = new Map()
    this.scrapedModels = new Map()
    this.errors = []
    this.progress = {
      totalModels: 0,
      processedModels: 0,
      totalParts: 0,
      processedParts: 0,
    }
  }

  async initialize() {
    console.log("🚀 Initializing RealOEM scraper...")

    this.browser = await puppeteer.launch({
      headless: false, // Set to true for production
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    })

    this.page = await this.browser.newPage()

    // Set user agent to avoid detection
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    )

    // Set viewport
    await this.page.setViewport({ width: 1920, height: 1080 })

    // Add request interception to handle rate limiting
    await this.page.setRequestInterception(true)
    this.page.on("request", (req) => {
      // Add delay between requests
      setTimeout(
        () => {
          req.continue()
        },
        Math.random() * 1000 + 500,
      ) // 500-1500ms delay
    })

    console.log("✅ Browser initialized successfully")
  }

  async navigateToBMWCatalog() {
    console.log("🔍 Navigating to BMW catalog...")

    try {
      await this.page.goto(REALOEM_BASE_URL, { waitUntil: "networkidle2", timeout: 30000 })

      // Click on BMW catalog link
      await this.page.waitForSelector('a[href*="bmw"]', { timeout: 10000 })
      await this.page.click('a[href*="bmw"]')

      await this.page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 })

      console.log("✅ Successfully navigated to BMW catalog")
      return true
    } catch (error) {
      console.error("❌ Failed to navigate to BMW catalog:", error.message)
      this.errors.push(`Navigation error: ${error.message}`)
      return false
    }
  }

  async extractAllBMWModels() {
    console.log("📋 Extracting all BMW models from catalog...")

    try {
      // Wait for the model selection page to load
      await this.page.waitForSelector("select, .model-list, .series-list", { timeout: 15000 })

      const models = await this.page.evaluate(() => {
        const modelData = []

        // Try different selectors for model information
        const selectors = ['select[name="series"] option', ".series-list a", ".model-link", 'a[href*="/bmw/"]']

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector)
          if (elements.length > 0) {
            elements.forEach((element) => {
              const text = element.textContent?.trim()
              const href = element.href || element.value

              if (text && href && text !== "Select Series") {
                // Extract series code and model info
                const seriesMatch = text.match(/([EFG]\d{2,3}|U\d{2})/i)
                const yearMatch = text.match(/$$(\d{4})-?(\d{4})?$$/)

                if (seriesMatch) {
                  modelData.push({
                    seriesCode: seriesMatch[1].toUpperCase(),
                    fullText: text,
                    href: href,
                    yearStart: yearMatch ? Number.parseInt(yearMatch[1]) : null,
                    yearEnd: yearMatch && yearMatch[2] ? Number.parseInt(yearMatch[2]) : null,
                  })
                }
              }
            })
            break // Use first successful selector
          }
        }

        return modelData
      })

      console.log(`✅ Found ${models.length} BMW model series`)

      // Store models for processing
      models.forEach((model) => {
        this.scrapedModels.set(model.seriesCode, model)
      })

      this.progress.totalModels = models.length
      return models
    } catch (error) {
      console.error("❌ Failed to extract BMW models:", error.message)
      this.errors.push(`Model extraction error: ${error.message}`)
      return []
    }
  }

  async scrapeModelSeries(seriesCode, modelData) {
    console.log(`🔧 Scraping ${seriesCode} series...`)

    try {
      // Navigate to specific model series
      if (modelData.href) {
        await this.page.goto(modelData.href, { waitUntil: "networkidle2", timeout: 30000 })
      }

      // Extract all variants for this series
      const variants = await this.extractModelVariants(seriesCode)

      // Process each variant
      for (const variant of variants) {
        await this.scrapeModelVariant(seriesCode, variant)

        // Progress update
        this.progress.processedModels++
        console.log(`📊 Progress: ${this.progress.processedModels}/${this.progress.totalModels} models processed`)
      }

      return true
    } catch (error) {
      console.error(`❌ Failed to scrape ${seriesCode}:`, error.message)
      this.errors.push(`${seriesCode} scraping error: ${error.message}`)
      return false
    }
  }

  async extractModelVariants(seriesCode) {
    console.log(`🚗 Extracting variants for ${seriesCode}...`)

    try {
      // Wait for variant selection elements
      await this.page.waitForSelector("select, .variant-list, .model-variants", { timeout: 10000 })

      const variants = await this.page.evaluate((series) => {
        const variantData = []

        // Look for model/engine variants
        const selectors = [
          'select[name="model"] option',
          'select[name="variant"] option',
          ".variant-list a",
          ".model-variant",
        ]

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector)
          if (elements.length > 0) {
            elements.forEach((element) => {
              const text = element.textContent?.trim()
              const value = element.value || element.href

              if (text && value && text !== "Select Model") {
                // Extract engine code, body type, etc.
                const engineMatch = text.match(/([A-Z]\d{2,3}[A-Z]?)/g)
                const bodyMatch = text.match(/(Sedan|Coupe|Convertible|Touring|SAV|SAC|Roadster)/i)
                const yearMatch = text.match(/$$(\d{4})-?(\d{4})?$$/)

                variantData.push({
                  seriesCode: series,
                  modelName: text,
                  value: value,
                  engines: engineMatch || [],
                  bodyType: bodyMatch ? bodyMatch[1] : null,
                  yearStart: yearMatch ? Number.parseInt(yearMatch[1]) : null,
                  yearEnd: yearMatch && yearMatch[2] ? Number.parseInt(yearMatch[2]) : null,
                })
              }
            })
            break
          }
        }

        return variantData
      }, seriesCode)

      console.log(`✅ Found ${variants.length} variants for ${seriesCode}`)
      return variants
    } catch (error) {
      console.error(`❌ Failed to extract variants for ${seriesCode}:`, error.message)
      return []
    }
  }

  async scrapeModelVariant(seriesCode, variant) {
    console.log(`🔍 Scraping ${seriesCode} ${variant.modelName}...`)

    try {
      // Navigate to specific variant if needed
      if (variant.value && variant.value.startsWith("http")) {
        await this.page.goto(variant.value, { waitUntil: "networkidle2", timeout: 30000 })
      }

      // Get all diagram categories for this variant
      const categories = await this.extractDiagramCategories()

      // Process each category
      for (const category of categories) {
        await this.scrapeDiagramCategory(seriesCode, variant, category)
      }

      return true
    } catch (error) {
      console.error(`❌ Failed to scrape variant ${variant.modelName}:`, error.message)
      return false
    }
  }

  async extractDiagramCategories() {
    console.log("📋 Extracting diagram categories...")

    try {
      const categories = await this.page.evaluate(() => {
        const categoryData = []

        // Look for diagram category links
        const selectors = [".diagram-category a", ".category-list a", 'a[href*="diagram"]', ".parts-category a"]

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector)
          if (elements.length > 0) {
            elements.forEach((element) => {
              const text = element.textContent?.trim()
              const href = element.href

              if (text && href && href.includes("diagram")) {
                categoryData.push({
                  name: text,
                  href: href,
                  slug: href.split("/").pop(),
                })
              }
            })
            break
          }
        }

        return categoryData
      })

      console.log(`✅ Found ${categories.length} diagram categories`)
      return categories
    } catch (error) {
      console.error("❌ Failed to extract diagram categories:", error.message)
      return []
    }
  }

  async scrapeDiagramCategory(seriesCode, variant, category) {
    console.log(`🔧 Scraping ${category.name} for ${seriesCode}...`)

    try {
      // Navigate to category diagram
      await this.page.goto(category.href, { waitUntil: "networkidle2", timeout: 30000 })

      // Extract all parts from this diagram
      const parts = await this.extractPartsFromDiagram(seriesCode, variant, category)

      // Store parts in database
      for (const part of parts) {
        await this.storePart(part)
        this.progress.processedParts++
      }

      this.progress.totalParts += parts.length
      console.log(`✅ Extracted ${parts.length} parts from ${category.name}`)

      return parts
    } catch (error) {
      console.error(`❌ Failed to scrape ${category.name}:`, error.message)
      return []
    }
  }

  async extractPartsFromDiagram(seriesCode, variant, category) {
    console.log(`🔍 Extracting parts from diagram...`)

    try {
      // Wait for parts table or diagram to load
      await this.page.waitForSelector(".parts-table, .diagram-parts, table", { timeout: 15000 })

      const parts = await this.page.evaluate(
        (series, variantData, categoryData) => {
          const partData = []

          // Look for parts in different table formats
          const tableSelectors = [".parts-table tr", ".diagram-parts tr", "table tr", ".part-row"]

          for (const selector of tableSelectors) {
            const rows = document.querySelectorAll(selector)
            if (rows.length > 1) {
              // Skip header row
              rows.forEach((row, index) => {
                if (index === 0) return // Skip header

                const cells = row.querySelectorAll("td, .part-cell")
                if (cells.length >= 3) {
                  // Extract part information
                  const partNumber = cells[0]?.textContent?.trim()
                  const partName = cells[1]?.textContent?.trim()
                  const description = cells[2]?.textContent?.trim()
                  const price = cells[3]?.textContent?.trim()
                  const notes = cells[4]?.textContent?.trim()

                  // Additional part details
                  const quantity = row.querySelector(".qty, .quantity")?.textContent?.trim()
                  const position = row.querySelector(".pos, .position")?.textContent?.trim()
                  const superseded = row.querySelector(".superseded, .replaced")?.textContent?.trim()

                  if (partNumber && partName) {
                    partData.push({
                      partNumber: partNumber.replace(/[^\w-]/g, ""),
                      partName: partName,
                      description: description || "",
                      category: categoryData.name,
                      categorySlug: categoryData.slug,
                      seriesCode: series,
                      modelName: variantData.modelName,
                      engines: variantData.engines,
                      bodyType: variantData.bodyType,
                      yearStart: variantData.yearStart,
                      yearEnd: variantData.yearEnd,
                      price: price ? Number.parseFloat(price.replace(/[^\d.]/g, "")) : null,
                      quantity: quantity ? Number.parseInt(quantity) : 1,
                      position: position || "",
                      notes: notes || "",
                      superseded: superseded || null,
                      diagramUrl: window.location.href,
                    })
                  }
                }
              })
              break // Use first successful table format
            }
          }

          // Also look for parts in diagram hotspots/clickable areas
          const hotspots = document.querySelectorAll("area[title], .hotspot[data-part]")
          hotspots.forEach((hotspot) => {
            const title = hotspot.title || hotspot.getAttribute("data-part")
            const partMatch = title?.match(/(\d{11,})\s*-\s*(.+)/)

            if (partMatch) {
              partData.push({
                partNumber: partMatch[1],
                partName: partMatch[2],
                description: "",
                category: categoryData.name,
                categorySlug: categoryData.slug,
                seriesCode: series,
                modelName: variantData.modelName,
                engines: variantData.engines,
                bodyType: variantData.bodyType,
                yearStart: variantData.yearStart,
                yearEnd: variantData.yearEnd,
                price: null,
                quantity: 1,
                position: "",
                notes: "From diagram hotspot",
                superseded: null,
                diagramUrl: window.location.href,
              })
            }
          })

          return partData
        },
        seriesCode,
        variant,
        category,
      )

      console.log(`✅ Extracted ${parts.length} parts from diagram`)
      return parts
    } catch (error) {
      console.error("❌ Failed to extract parts from diagram:", error.message)
      return []
    }
  }

  async storePart(partData) {
    try {
      // Store in local map first
      const key = `${partData.partNumber}-${partData.seriesCode}`
      if (this.scrapedParts.has(key)) {
        // Update compatibility for existing part
        const existing = this.scrapedParts.get(key)
        existing.compatibility = existing.compatibility || []
        existing.compatibility.push({
          seriesCode: partData.seriesCode,
          modelName: partData.modelName,
          engines: partData.engines,
          bodyType: partData.bodyType,
          yearStart: partData.yearStart,
          yearEnd: partData.yearEnd,
        })
      } else {
        // New part
        partData.compatibility = [
          {
            seriesCode: partData.seriesCode,
            modelName: partData.modelName,
            engines: partData.engines,
            bodyType: partData.bodyType,
            yearStart: partData.yearStart,
            yearEnd: partData.yearEnd,
          },
        ]
        this.scrapedParts.set(key, partData)
      }
    } catch (error) {
      console.error("❌ Failed to store part:", error.message)
    }
  }

  async saveToDatabase() {
    console.log("💾 Saving scraped data to database...")

    try {
      // Convert maps to arrays
      const parts = Array.from(this.scrapedParts.values())
      const models = Array.from(this.scrapedModels.values())

      console.log(`📊 Saving ${parts.length} parts and ${models.length} models...`)

      // Save models first
      for (const model of models) {
        await this.saveModel(model)
      }

      // Save parts with compatibility
      for (const part of parts) {
        await this.savePartWithCompatibility(part)
      }

      console.log("✅ Successfully saved all data to database")
    } catch (error) {
      console.error("❌ Failed to save to database:", error.message)
      this.errors.push(`Database save error: ${error.message}`)
    }
  }

  async saveModel(modelData) {
    try {
      const { error } = await supabase.from("bmw_models").upsert(
        {
          series_code: modelData.seriesCode,
          series_name: BMW_MODEL_SERIES[modelData.seriesCode]?.name || "Unknown",
          model_name: modelData.fullText,
          production_start: modelData.yearStart,
          production_end: modelData.yearEnd,
          market_region: "Global",
        },
        { onConflict: "series_code,model_name" },
      )

      if (error) {
        console.error("Model save error:", error)
      }
    } catch (error) {
      console.error("Model save exception:", error)
    }
  }

  async savePartWithCompatibility(partData) {
    try {
      // First save the part
      const { data: partResult, error: partError } = await supabase
        .from("bmw_oem_parts")
        .upsert(
          {
            part_number: partData.partNumber,
            part_name: partData.partName,
            description: partData.description,
            price_msrp: partData.price,
            notes: partData.notes,
            diagram_position: partData.position,
            superseded_by: partData.superseded,
          },
          { onConflict: "part_number" },
        )
        .select()
        .single()

      if (partError) {
        console.error("Part save error:", partError)
        return
      }

      // Save compatibility records
      for (const compat of partData.compatibility) {
        // Find model ID
        const { data: modelData } = await supabase
          .from("bmw_models")
          .select("id")
          .eq("series_code", compat.seriesCode)
          .single()

        if (modelData) {
          await supabase.from("bmw_part_compatibility").upsert(
            {
              part_id: partResult.id,
              model_id: modelData.id,
              production_start: compat.yearStart,
              production_end: compat.yearEnd,
              engine_specific: compat.engines,
              notes: `Compatible with ${compat.modelName}`,
            },
            { onConflict: "part_id,model_id" },
          )
        }
      }
    } catch (error) {
      console.error("Part with compatibility save error:", error)
    }
  }

  async saveProgress() {
    const progressData = {
      timestamp: new Date().toISOString(),
      progress: this.progress,
      errors: this.errors,
      totalParts: this.scrapedParts.size,
      totalModels: this.scrapedModels.size,
    }

    await fs.writeFile(path.join(process.cwd(), "scraping-progress.json"), JSON.stringify(progressData, null, 2))
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async run() {
    console.log("🚀 Starting comprehensive RealOEM BMW scraping...")

    try {
      // Initialize browser
      await this.initialize()

      // Navigate to BMW catalog
      const catalogSuccess = await this.navigateToBMWCatalog()
      if (!catalogSuccess) {
        throw new Error("Failed to access BMW catalog")
      }

      // Extract all BMW models
      const models = await this.extractAllBMWModels()
      if (models.length === 0) {
        throw new Error("No BMW models found")
      }

      // Process each model series
      for (const [seriesCode, modelData] of Object.entries(BMW_MODEL_SERIES)) {
        console.log(`\n🔧 Processing ${seriesCode} - ${modelData.name}...`)

        try {
          await this.scrapeModelSeries(seriesCode, modelData)

          // Save progress periodically
          if (this.progress.processedModels % 10 === 0) {
            await this.saveProgress()
          }

          // Rate limiting - wait between series
          await new Promise((resolve) => setTimeout(resolve, 2000))
        } catch (error) {
          console.error(`❌ Failed to process ${seriesCode}:`, error.message)
          this.errors.push(`${seriesCode}: ${error.message}`)
          continue
        }
      }

      // Save all data to database
      await this.saveToDatabase()

      // Final progress save
      await this.saveProgress()

      console.log("\n🎉 Scraping completed successfully!")
      console.log(`📊 Final Stats:`)
      console.log(`   - Models processed: ${this.progress.processedModels}`)
      console.log(`   - Parts extracted: ${this.scrapedParts.size}`)
      console.log(`   - Errors encountered: ${this.errors.length}`)
    } catch (error) {
      console.error("❌ Scraping failed:", error.message)
      this.errors.push(`Fatal error: ${error.message}`)
    } finally {
      await this.cleanup()
    }
  }
}

// Run the scraper
if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new RealOEMScraper()
  scraper.run().catch(console.error)
}

export { RealOEMScraper }
