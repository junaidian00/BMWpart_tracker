import puppeteer from "puppeteer"
import { createClient } from "@supabase/supabase-js"
import fs from "fs/promises"
import path from "path"

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Ultimate RealOEM scraper configuration
const REALOEM_BASE_URL = "https://www.realoem.com"
const BMW_CATALOG_URL = "https://www.realoem.com/bmw/"

// Comprehensive BMW part categories that exist in RealOEM
const REALOEM_CATEGORIES = [
  // Engine System
  {
    code: "11",
    name: "Engine",
    sections: [
      "engine-block",
      "cylinder-head",
      "oil-system",
      "cooling",
      "intake",
      "exhaust-manifold",
      "timing",
      "mounts",
    ],
  },
  {
    code: "12",
    name: "Fuel Preparation System",
    sections: ["fuel-injection", "throttle-body", "fuel-rail", "injectors", "fuel-pump", "fuel-filter"],
  },
  {
    code: "13",
    name: "Fuel Supply",
    sections: ["fuel-tank", "fuel-lines", "fuel-pump", "fuel-sender", "evap-system", "carbon-canister"],
  },
  {
    code: "17",
    name: "Cooling System",
    sections: ["radiator", "cooling-hoses", "thermostat", "water-pump", "cooling-fan", "expansion-tank"],
  },
  {
    code: "18",
    name: "Exhaust System",
    sections: ["exhaust-manifold", "catalytic-converter", "muffler", "exhaust-pipes", "heat-shields"],
  },

  // Transmission & Drivetrain
  {
    code: "21",
    name: "Clutch",
    sections: ["clutch-disc", "pressure-plate", "release-bearing", "clutch-fork", "slave-cylinder"],
  },
  { code: "22", name: "Engine/Transmission", sections: ["bell-housing", "flywheel", "starter", "transmission-mounts"] },
  {
    code: "23",
    name: "Manual Transmission",
    sections: ["gear-sets", "synchronizers", "shift-forks", "transmission-case", "shift-linkage"],
  },
  {
    code: "24",
    name: "Automatic Transmission",
    sections: ["valve-body", "torque-converter", "transmission-filter", "transmission-cooler", "shift-solenoids"],
  },
  {
    code: "25",
    name: "Rear Axle",
    sections: ["differential", "axle-shafts", "ring-pinion", "differential-mounts", "axle-seals"],
  },
  {
    code: "26",
    name: "Front Axle",
    sections: ["cv-joints", "drive-shafts", "wheel-bearings", "hub-assemblies", "axle-boots"],
  },

  // Brakes
  {
    code: "34",
    name: "Brakes",
    sections: [
      "brake-pads",
      "brake-rotors",
      "brake-calipers",
      "brake-lines",
      "master-cylinder",
      "brake-booster",
      "abs-system",
      "brake-sensors",
    ],
  },

  // Steering & Suspension
  {
    code: "32",
    name: "Steering",
    sections: [
      "steering-rack",
      "power-steering-pump",
      "steering-column",
      "steering-wheel",
      "tie-rods",
      "steering-damper",
    ],
  },
  {
    code: "31",
    name: "Front Suspension",
    sections: ["struts", "springs", "control-arms", "ball-joints", "sway-bar", "bushings", "shock-mounts"],
  },
  {
    code: "33",
    name: "Rear Suspension",
    sections: ["shocks", "springs", "control-arms", "trailing-arms", "sway-bar", "bushings", "subframe"],
  },

  // Wheels & Tires
  {
    code: "36",
    name: "Wheels/Tires",
    sections: ["wheels", "tires", "wheel-bolts", "center-caps", "valve-stems", "tpms-sensors"],
  },

  // Body Exterior
  { code: "41", name: "Body", sections: ["body-panels", "structural-components", "reinforcements", "body-seals"] },
  {
    code: "51",
    name: "Body Equipment/Exterior",
    sections: [
      "bumpers",
      "grilles",
      "fenders",
      "hood",
      "trunk-lid",
      "door-panels",
      "mirrors",
      "trim-pieces",
      "emblems",
      "spoilers",
    ],
  },

  // Interior
  {
    code: "52",
    name: "Seats",
    sections: ["seat-frames", "seat-cushions", "seat-covers", "seat-mechanisms", "headrests", "armrests"],
  },
  {
    code: "53",
    name: "Interior Equipment",
    sections: [
      "dashboard",
      "door-panels",
      "center-console",
      "trim-pieces",
      "cup-holders",
      "storage-compartments",
      "floor-mats",
    ],
  },
  {
    code: "54",
    name: "Pedals/Steering Column",
    sections: ["pedal-assembly", "steering-column", "steering-wheel", "column-switches", "ignition-switch"],
  },

  // Glass & Roof
  {
    code: "55",
    name: "Sliding Roof/Convertible Top",
    sections: ["sunroof-assembly", "sunroof-motor", "sunroof-tracks", "convertible-top", "top-motor", "top-hydraulics"],
  },
  {
    code: "56",
    name: "Exterior Mirrors",
    sections: ["mirror-assemblies", "mirror-glass", "mirror-motors", "mirror-housings", "mirror-switches"],
  },

  // Climate Control
  {
    code: "64",
    name: "Air Conditioning",
    sections: [
      "ac-compressor",
      "condenser",
      "evaporator",
      "ac-lines",
      "expansion-valve",
      "ac-controls",
      "blower-motor",
      "cabin-filter",
    ],
  },

  // Electrical System
  {
    code: "61",
    name: "Electrical System",
    sections: [
      "alternator",
      "starter",
      "battery",
      "wiring-harnesses",
      "fuse-boxes",
      "relays",
      "sensors",
      "control-modules",
    ],
  },
  {
    code: "62",
    name: "Instruments",
    sections: ["instrument-cluster", "gauges", "warning-lights", "display-screens", "switches", "buttons"],
  },
  {
    code: "63",
    name: "Lighting",
    sections: [
      "headlights",
      "taillights",
      "turn-signals",
      "fog-lights",
      "interior-lights",
      "bulbs",
      "ballasts",
      "led-modules",
    ],
  },

  // Additional Equipment
  {
    code: "65",
    name: "Radio/Navigation",
    sections: ["head-unit", "speakers", "amplifiers", "antennas", "navigation-system", "bluetooth-module"],
  },
  {
    code: "71",
    name: "Equipment/Individual Options",
    sections: ["special-equipment", "m-performance-parts", "individual-options", "comfort-access", "parking-sensors"],
  },
  { code: "72", name: "Retrofit Kits", sections: ["retrofit-parts", "upgrade-kits", "accessory-parts"] },

  // Service Parts
  {
    code: "81",
    name: "Service/Maintenance",
    sections: [
      "oil-filters",
      "air-filters",
      "cabin-filters",
      "spark-plugs",
      "ignition-coils",
      "belts",
      "hoses",
      "gaskets",
      "seals",
    ],
  },
  { code: "82", name: "Tools", sections: ["special-tools", "service-tools", "diagnostic-equipment"] },

  // Hardware & Fasteners
  {
    code: "91",
    name: "Hardware",
    sections: ["bolts", "screws", "nuts", "washers", "clips", "fasteners", "brackets", "mounting-hardware"],
  },
  {
    code: "92",
    name: "Seals/Gaskets",
    sections: [
      "engine-gaskets",
      "transmission-seals",
      "differential-seals",
      "door-seals",
      "window-seals",
      "weatherstripping",
    ],
  },
]

class UltimateRealOEMScraper {
  constructor() {
    this.browser = null
    this.page = null
    this.scrapedParts = new Map()
    this.scrapedModels = new Map()
    this.errors = []
    this.progress = {
      totalChassis: 0,
      processedChassis: 0,
      totalModels: 0,
      processedModels: 0,
      totalCategories: 0,
      processedCategories: 0,
      totalParts: 0,
      processedParts: 0,
      currentChassis: "",
      currentModel: "",
      currentCategory: "",
      startTime: new Date(),
      estimatedCompletion: null,
    }
  }

  async initialize() {
    console.log("🚀 Initializing Ultimate RealOEM BMW Parts Scraper...")
    console.log("📊 Target: Every single BMW part from every chassis (1970-2024)")

    this.browser = await puppeteer.launch({
      headless: false, // Keep visible for monitoring
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--window-size=1920,1080",
      ],
      defaultViewport: { width: 1920, height: 1080 },
    })

    this.page = await this.browser.newPage()

    // Enhanced user agent and headers
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    )

    await this.page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    })

    // Advanced request interception for rate limiting and error handling
    await this.page.setRequestInterception(true)
    this.page.on("request", (req) => {
      // Block unnecessary resources to speed up scraping
      if (req.resourceType() === "image" || req.resourceType() === "stylesheet" || req.resourceType() === "font") {
        req.abort()
      } else {
        // Add intelligent delay based on request type
        const delay = req.url().includes("realoem.com") ? Math.random() * 2000 + 1000 : 500
        setTimeout(() => {
          req.continue()
        }, delay)
      }
    })

    // Handle page errors gracefully
    this.page.on("error", (error) => {
      console.error("❌ Page error:", error.message)
      this.errors.push(`Page error: ${error.message}`)
    })

    this.page.on("pageerror", (error) => {
      console.error("❌ Page script error:", error.message)
    })

    console.log("✅ Browser initialized successfully")
  }

  async navigateToRealOEM() {
    console.log("🔍 Navigating to RealOEM BMW catalog...")

    try {
      await this.page.goto(REALOEM_BASE_URL, {
        waitUntil: "networkidle2",
        timeout: 60000,
      })

      // Wait for and click BMW catalog link
      await this.page.waitForSelector('a[href*="bmw"], .bmw-link, [title*="BMW"]', { timeout: 15000 })

      // Try multiple selectors for BMW link
      const bmwLinkSelectors = ['a[href*="/bmw/"]', 'a[href*="bmw"]', ".bmw-link", '[title*="BMW"]', 'img[alt*="BMW"]']

      let clicked = false
      for (const selector of bmwLinkSelectors) {
        try {
          const element = await this.page.$(selector)
          if (element) {
            await element.click()
            clicked = true
            break
          }
        } catch (e) {
          continue
        }
      }

      if (!clicked) {
        // Try direct navigation to BMW catalog
        await this.page.goto(BMW_CATALOG_URL, { waitUntil: "networkidle2", timeout: 60000 })
      } else {
        await this.page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 })
      }

      console.log("✅ Successfully navigated to BMW catalog")
      return true
    } catch (error) {
      console.error("❌ Failed to navigate to BMW catalog:", error.message)
      this.errors.push(`Navigation error: ${error.message}`)
      return false
    }
  }

  async extractAllBMWChassis() {
    console.log("📋 Extracting all BMW chassis codes from RealOEM...")

    try {
      // Wait for chassis selection interface
      await this.page.waitForSelector("select, .series-list, .model-list, .chassis-list", { timeout: 20000 })

      const chassisCodes = await this.page.evaluate(() => {
        const chassisData = []

        // Multiple strategies to find chassis codes
        const strategies = [
          // Strategy 1: Select dropdown options
          () => {
            const select = document.querySelector(
              'select[name*="series"], select[name*="model"], select[name*="chassis"]',
            )
            if (select) {
              const options = select.querySelectorAll("option")
              options.forEach((option) => {
                const text = option.textContent?.trim()
                const value = option.value
                if (text && value && text !== "Select" && text.length > 0) {
                  const chassisMatch = text.match(/([EFG]\d{2,3}|U\d{2})/i)
                  if (chassisMatch) {
                    chassisData.push({
                      chassisCode: chassisMatch[1].toUpperCase(),
                      fullText: text,
                      value: value,
                      url: value.startsWith("http") ? value : null,
                    })
                  }
                }
              })
            }
          },

          // Strategy 2: Links with chassis codes
          () => {
            const links = document.querySelectorAll('a[href*="/bmw/"], .chassis-link, .series-link')
            links.forEach((link) => {
              const text = link.textContent?.trim()
              const href = link.href
              if (text && href) {
                const chassisMatch = text.match(/([EFG]\d{2,3}|U\d{2})/i) || href.match(/([EFG]\d{2,3}|U\d{2})/i)
                if (chassisMatch) {
                  chassisData.push({
                    chassisCode: chassisMatch[1].toUpperCase(),
                    fullText: text,
                    value: href,
                    url: href,
                  })
                }
              }
            })
          },

          // Strategy 3: Text content scanning
          () => {
            const textElements = document.querySelectorAll("div, span, td, li")
            textElements.forEach((element) => {
              const text = element.textContent?.trim()
              if (text && text.length < 100) {
                // Avoid long paragraphs
                const chassisMatch = text.match(/([EFG]\d{2,3}|U\d{2})/gi)
                if (chassisMatch) {
                  chassisMatch.forEach((match) => {
                    chassisData.push({
                      chassisCode: match.toUpperCase(),
                      fullText: text,
                      value: text,
                      url: null,
                    })
                  })
                }
              }
            })
          },
        ]

        // Execute all strategies
        strategies.forEach((strategy) => {
          try {
            strategy()
          } catch (e) {
            console.log("Strategy failed:", e.message)
          }
        })

        // Remove duplicates and return
        const uniqueChassis = new Map()
        chassisData.forEach((item) => {
          if (!uniqueChassis.has(item.chassisCode)) {
            uniqueChassis.set(item.chassisCode, item)
          }
        })

        return Array.from(uniqueChassis.values())
      })

      console.log(`✅ Found ${chassisCodes.length} BMW chassis codes`)

      // Store chassis codes
      chassisCodes.forEach((chassis) => {
        this.scrapedModels.set(chassis.chassisCode, chassis)
      })

      this.progress.totalChassis = chassisCodes.length
      return chassisCodes
    } catch (error) {
      console.error("❌ Failed to extract BMW chassis codes:", error.message)
      this.errors.push(`Chassis extraction error: ${error.message}`)
      return []
    }
  }

  async scrapeChassisCompletely(chassisCode, chassisData) {
    console.log(`\n🔧 Starting complete scrape of ${chassisCode}...`)
    this.progress.currentChassis = chassisCode

    try {
      // Navigate to chassis-specific page
      if (chassisData.url) {
        await this.page.goto(chassisData.url, { waitUntil: "networkidle2", timeout: 60000 })
      }

      // Extract all model variants for this chassis
      const modelVariants = await this.extractModelVariants(chassisCode)
      console.log(`📊 Found ${modelVariants.length} model variants for ${chassisCode}`)

      this.progress.totalModels += modelVariants.length

      // Process each model variant
      for (const variant of modelVariants) {
        await this.scrapeModelVariantCompletely(chassisCode, variant)
        this.progress.processedModels++

        // Update progress
        this.updateProgress()

        // Save progress periodically
        if (this.progress.processedModels % 5 === 0) {
          await this.saveProgress()
        }

        // Rate limiting between models
        await this.delay(3000)
      }

      this.progress.processedChassis++
      console.log(`✅ Completed scraping ${chassisCode}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to scrape ${chassisCode}:`, error.message)
      this.errors.push(`${chassisCode} scraping error: ${error.message}`)
      return false
    }
  }

  async extractModelVariants(chassisCode) {
    console.log(`🚗 Extracting model variants for ${chassisCode}...`)

    try {
      const variants = await this.page.evaluate((chassis) => {
        const variantData = []

        // Look for model selection elements
        const selectors = [
          'select[name*="model"] option',
          'select[name*="variant"] option',
          'select[name*="engine"] option',
          ".model-list a",
          ".variant-list a",
          'a[href*="model"]',
        ]

        selectors.forEach((selector) => {
          try {
            const elements = document.querySelectorAll(selector)
            elements.forEach((element) => {
              const text = element.textContent?.trim()
              const value = element.value || element.href

              if (text && value && text !== "Select Model" && text.length > 0) {
                // Extract detailed information from text
                const engineMatch = text.match(/([A-Z]\d{2,3}[A-Z]?)/g)
                const bodyMatch = text.match(
                  /(Sedan|Coupe|Convertible|Touring|SAV|SAC|Roadster|Gran Coupe|Gran Turismo)/i,
                )
                const yearMatch = text.match(/(\d{4})-?(\d{4})?/)
                const horsepowerMatch = text.match(/(\d{2,3})\s*hp/i)
                const displacementMatch = text.match(/(\d\.\d)L?/i)

                variantData.push({
                  chassisCode: chassis,
                  modelName: text,
                  value: value,
                  url: value.startsWith("http") ? value : null,
                  engines: engineMatch || [],
                  bodyType: bodyMatch ? bodyMatch[1] : null,
                  yearStart: yearMatch ? Number.parseInt(yearMatch[1]) : null,
                  yearEnd: yearMatch && yearMatch[2] ? Number.parseInt(yearMatch[2]) : null,
                  horsepower: horsepowerMatch ? Number.parseInt(horsepowerMatch[1]) : null,
                  displacement: displacementMatch ? Number.parseFloat(displacementMatch[1]) : null,
                })
              }
            })
          } catch (e) {
            // Continue with other selectors
          }
        })

        return variantData
      }, chassisCode)

      console.log(`✅ Found ${variants.length} variants for ${chassisCode}`)
      return variants
    } catch (error) {
      console.error(`❌ Failed to extract variants for ${chassisCode}:`, error.message)
      return []
    }
  }

  async scrapeModelVariantCompletely(chassisCode, variant) {
    console.log(`🔍 Scraping ${chassisCode} ${variant.modelName}...`)
    this.progress.currentModel = variant.modelName

    try {
      // Navigate to specific variant if needed
      if (variant.url) {
        await this.page.goto(variant.url, { waitUntil: "networkidle2", timeout: 60000 })
      }

      // Process every single category for this variant
      for (const category of REALOEM_CATEGORIES) {
        await this.scrapeCategoryCompletely(chassisCode, variant, category)
        this.progress.processedCategories++

        // Rate limiting between categories
        await this.delay(2000)
      }

      return true
    } catch (error) {
      console.error(`❌ Failed to scrape variant ${variant.modelName}:`, error.message)
      return false
    }
  }

  async scrapeCategoryCompletely(chassisCode, variant, category) {
    console.log(`📋 Scraping ${category.name} for ${chassisCode} ${variant.modelName}...`)
    this.progress.currentCategory = category.name

    try {
      // Process each section within the category
      for (const section of category.sections) {
        await this.scrapeCategorySection(chassisCode, variant, category, section)

        // Rate limiting between sections
        await this.delay(1000)
      }

      return true
    } catch (error) {
      console.error(`❌ Failed to scrape ${category.name}:`, error.message)
      return false
    }
  }

  async scrapeCategorySection(chassisCode, variant, category, section) {
    try {
      // Construct RealOEM URL for this specific section
      const sectionUrl = this.buildRealOEMUrl(chassisCode, variant, category.code, section)

      if (sectionUrl) {
        await this.page.goto(sectionUrl, { waitUntil: "networkidle2", timeout: 60000 })

        // Extract all parts from this section
        const parts = await this.extractPartsFromSection(chassisCode, variant, category, section)

        // Store each part
        for (const part of parts) {
          await this.storePart(part)
          this.progress.processedParts++
        }

        this.progress.totalParts += parts.length
        console.log(`✅ Extracted ${parts.length} parts from ${section}`)
      }
    } catch (error) {
      console.error(`❌ Failed to scrape section ${section}:`, error.message)
    }
  }

  buildRealOEMUrl(chassisCode, variant, categoryCode, section) {
    // Build RealOEM URL based on their URL structure
    // This is a simplified version - actual implementation would need to handle RealOEM's specific URL patterns
    const baseUrl = "https://www.realoem.com/bmw"

    // RealOEM URLs typically follow patterns like:
    // /bmw/en/showparts?id=DT43-USA-03-2014-F22-BMW-228i&diagId=11_5534

    try {
      // Extract year from variant data
      const year = variant.yearStart || 2015
      const market = "USA" // Could be extracted from variant data
      const month = "03" // Default month

      // Build model identifier
      const modelId = `${chassisCode}-BMW-${variant.modelName.replace(/\s+/g, "")}`

      // Build diagram ID (category + section)
      const diagId = `${categoryCode}_${section}`

      const url = `${baseUrl}/en/showparts?id=DT43-${market}-${month}-${year}-${modelId}&diagId=${diagId}`

      return url
    } catch (error) {
      console.error(`Failed to build URL for ${chassisCode} ${section}:`, error.message)
      return null
    }
  }

  async extractPartsFromSection(chassisCode, variant, category, section) {
    console.log(`🔍 Extracting parts from ${section}...`)

    try {
      // Wait for parts content to load
      await this.page.waitForSelector("table, .parts-list, .diagram-parts, .part-table", { timeout: 15000 })

      const parts = await this.page.evaluate(
        (chassis, variantData, categoryData, sectionName) => {
          const partData = []

          // Multiple strategies to extract parts
          const strategies = [
            // Strategy 1: Parts table
            () => {
              const tables = document.querySelectorAll("table")
              tables.forEach((table) => {
                const rows = table.querySelectorAll("tr")
                rows.forEach((row, index) => {
                  if (index === 0) return // Skip header

                  const cells = row.querySelectorAll("td")
                  if (cells.length >= 2) {
                    const partNumber = cells[0]?.textContent?.trim()
                    const partName = cells[1]?.textContent?.trim()
                    const description = cells[2]?.textContent?.trim()
                    const price = cells[3]?.textContent?.trim()
                    const quantity = cells[4]?.textContent?.trim()
                    const position = cells[5]?.textContent?.trim()

                    if (partNumber && partName && partNumber.match(/^\d{8,}/)) {
                      partData.push({
                        partNumber: partNumber.replace(/[^\w-]/g, ""),
                        partName: partName,
                        description: description || "",
                        category: categoryData.name,
                        section: sectionName,
                        chassisCode: chassis,
                        modelName: variantData.modelName,
                        engines: variantData.engines,
                        bodyType: variantData.bodyType,
                        yearStart: variantData.yearStart,
                        yearEnd: variantData.yearEnd,
                        price: price ? Number.parseFloat(price.replace(/[^\d.]/g, "")) : null,
                        quantity: quantity ? Number.parseInt(quantity) : 1,
                        position: position || "",
                        diagramUrl: window.location.href,
                        extractionMethod: "table",
                      })
                    }
                  }
                })
              })
            },

            // Strategy 2: Diagram hotspots
            () => {
              const hotspots = document.querySelectorAll('area[title], .hotspot[data-part], [onclick*="part"]')
              hotspots.forEach((hotspot) => {
                const title = hotspot.title || hotspot.getAttribute("data-part") || hotspot.getAttribute("onclick")
                if (title) {
                  const partMatch = title.match(/(\d{8,})\s*[-–]\s*(.+?)(?:\s*\$|\s*€|\s*£|$)/i)
                  if (partMatch) {
                    partData.push({
                      partNumber: partMatch[1],
                      partName: partMatch[2].trim(),
                      description: "",
                      category: categoryData.name,
                      section: sectionName,
                      chassisCode: chassis,
                      modelName: variantData.modelName,
                      engines: variantData.engines,
                      bodyType: variantData.bodyType,
                      yearStart: variantData.yearStart,
                      yearEnd: variantData.yearEnd,
                      price: null,
                      quantity: 1,
                      position: hotspot.getAttribute("coords") || "",
                      diagramUrl: window.location.href,
                      extractionMethod: "hotspot",
                    })
                  }
                }
              })
            },

            // Strategy 3: Parts list
            () => {
              const partElements = document.querySelectorAll('.part-item, .part-row, [class*="part"]')
              partElements.forEach((element) => {
                const text = element.textContent?.trim()
                if (text) {
                  const partMatch = text.match(/(\d{8,})\s*[-–]\s*(.+?)(?:\s*\$|\s*€|\s*£|$)/i)
                  if (partMatch) {
                    partData.push({
                      partNumber: partMatch[1],
                      partName: partMatch[2].trim(),
                      description: "",
                      category: categoryData.name,
                      section: sectionName,
                      chassisCode: chassis,
                      modelName: variantData.modelName,
                      engines: variantData.engines,
                      bodyType: variantData.bodyType,
                      yearStart: variantData.yearStart,
                      yearEnd: variantData.yearEnd,
                      price: null,
                      quantity: 1,
                      position: "",
                      diagramUrl: window.location.href,
                      extractionMethod: "list",
                    })
                  }
                }
              })
            },
          ]

          // Execute all strategies
          strategies.forEach((strategy, index) => {
            try {
              strategy()
            } catch (e) {
              console.log(`Strategy ${index + 1} failed:`, e.message)
            }
          })

          return partData
        },
        chassisCode,
        variant,
        category,
        section,
      )

      console.log(`✅ Extracted ${parts.length} parts from ${section}`)
      return parts
    } catch (error) {
      console.error(`❌ Failed to extract parts from ${section}:`, error.message)
      return []
    }
  }

  async storePart(partData) {
    try {
      const key = `${partData.partNumber}-${partData.chassisCode}-${partData.section}`

      if (this.scrapedParts.has(key)) {
        // Update existing part with additional compatibility
        const existing = this.scrapedParts.get(key)
        existing.compatibility = existing.compatibility || []
        existing.compatibility.push({
          chassisCode: partData.chassisCode,
          modelName: partData.modelName,
          engines: partData.engines,
          bodyType: partData.bodyType,
          yearStart: partData.yearStart,
          yearEnd: partData.yearEnd,
          section: partData.section,
        })
      } else {
        // New part
        partData.compatibility = [
          {
            chassisCode: partData.chassisCode,
            modelName: partData.modelName,
            engines: partData.engines,
            bodyType: partData.bodyType,
            yearStart: partData.yearStart,
            yearEnd: partData.yearEnd,
            section: partData.section,
          },
        ]
        this.scrapedParts.set(key, partData)
      }
    } catch (error) {
      console.error("❌ Failed to store part:", error.message)
    }
  }

  async saveToDatabase() {
    console.log("💾 Saving ultimate BMW parts database...")

    try {
      const parts = Array.from(this.scrapedParts.values())
      console.log(`📊 Saving ${parts.length} unique BMW parts...`)

      let savedCount = 0
      const batchSize = 100

      // Process parts in batches
      for (let i = 0; i < parts.length; i += batchSize) {
        const batch = parts.slice(i, i + batchSize)

        for (const part of batch) {
          await this.savePartToDatabase(part)
          savedCount++

          if (savedCount % 1000 === 0) {
            console.log(`💾 Saved ${savedCount}/${parts.length} parts...`)
          }
        }

        // Rate limiting between batches
        await this.delay(1000)
      }

      console.log("✅ Successfully saved all parts to database")
    } catch (error) {
      console.error("❌ Failed to save to database:", error.message)
      this.errors.push(`Database save error: ${error.message}`)
    }
  }

  async savePartToDatabase(partData) {
    try {
      // First, ensure the chassis exists
      const { data: chassisData } = await supabase
        .from("bmw_chassis")
        .select("id")
        .eq("chassis_code", partData.chassisCode)
        .single()

      if (!chassisData) {
        console.log(`Creating chassis record for ${partData.chassisCode}`)
        await supabase.from("bmw_chassis").insert({
          chassis_code: partData.chassisCode,
          chassis_name: partData.chassisCode,
          generation: partData.chassisCode.charAt(0) + "-Series",
          production_start: partData.yearStart || 2000,
          production_end: partData.yearEnd || 2024,
        })
      }

      // Find or create category
      let categoryId = null
      const { data: categoryData } = await supabase
        .from("bmw_part_categories")
        .select("id")
        .eq("category_name", partData.category)
        .single()

      if (categoryData) {
        categoryId = categoryData.id
      } else {
        const { data: newCategory } = await supabase
          .from("bmw_part_categories")
          .insert({
            category_code: partData.category.replace(/\s+/g, "").toUpperCase().substring(0, 10),
            category_name: partData.category,
            description: `${partData.category} components`,
          })
          .select("id")
          .single()

        categoryId = newCategory?.id
      }

      // Save the part
      const { data: partResult, error: partError } = await supabase
        .from("bmw_oem_parts")
        .upsert(
          {
            part_number: partData.partNumber,
            part_name: partData.partName,
            description: partData.description,
            category_id: categoryId,
            price_msrp: partData.price,
            diagram_position: partData.position,
            system_category: partData.category,
            subsystem_category: partData.section,
            part_type: this.categorizePartType(partData.partName, partData.category),
            part_function: partData.partName,
            keywords: this.generateKeywords(partData.partName, partData.description),
            realoem_diagram_url: partData.diagramUrl,
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
        // Find chassis
        const { data: chassisRecord } = await supabase
          .from("bmw_chassis")
          .select("id")
          .eq("chassis_code", compat.chassisCode)
          .single()

        if (chassisRecord) {
          await supabase.from("bmw_part_compatibility").upsert(
            {
              part_id: partResult.id,
              chassis_id: chassisRecord.id,
              production_start: compat.yearStart,
              production_end: compat.yearEnd,
              engine_codes: compat.engines,
              installation_position: compat.section,
              notes: `Compatible with ${compat.modelName}`,
            },
            { onConflict: "part_id,chassis_id,installation_position" },
          )
        }
      }
    } catch (error) {
      console.error("Database save error:", error)
    }
  }

  categorizePartType(partName, category) {
    const name = partName.toLowerCase()

    if (name.includes("bolt") || name.includes("screw") || name.includes("nut") || name.includes("washer")) {
      return "Hardware"
    } else if (name.includes("gasket") || name.includes("seal") || name.includes("o-ring")) {
      return "Sealing"
    } else if (
      name.includes("sensor") ||
      name.includes("switch") ||
      name.includes("module") ||
      name.includes("control")
    ) {
      return "Electrical"
    } else if (name.includes("hose") || name.includes("line") || name.includes("tube")) {
      return "Fluid System"
    } else if (name.includes("filter") || name.includes("element")) {
      return "Filtration"
    } else if (name.includes("bearing") || name.includes("bushing") || name.includes("mount")) {
      return "Mechanical"
    } else if (name.includes("panel") || name.includes("cover") || name.includes("trim")) {
      return "Body"
    } else {
      return "Component"
    }
  }

  generateKeywords(partName, description) {
    const text = `${partName} ${description}`.toLowerCase()
    const keywords = []

    // Extract meaningful words
    const words = text.match(/\b\w{3,}\b/g) || []
    words.forEach((word) => {
      if (!["the", "and", "for", "with", "bmw", "part"].includes(word)) {
        keywords.push(word)
      }
    })

    return [...new Set(keywords)]
  }

  updateProgress() {
    const elapsed = new Date() - this.progress.startTime
    const rate = this.progress.processedParts / (elapsed / 1000 / 60) // parts per minute
    const remaining = this.progress.totalParts - this.progress.processedParts
    const estimatedMinutes = remaining / rate

    this.progress.estimatedCompletion = new Date(Date.now() + estimatedMinutes * 60 * 1000)

    console.log(`\n📊 PROGRESS UPDATE:`)
    console.log(`   Chassis: ${this.progress.processedChassis}/${this.progress.totalChassis}`)
    console.log(`   Models: ${this.progress.processedModels}/${this.progress.totalModels}`)
    console.log(`   Parts: ${this.progress.processedParts.toLocaleString()}`)
    console.log(`   Rate: ${Math.round(rate)} parts/min`)
    console.log(`   ETA: ${this.progress.estimatedCompletion?.toLocaleTimeString()}`)
    console.log(
      `   Current: ${this.progress.currentChassis} ${this.progress.currentModel} - ${this.progress.currentCategory}`,
    )
  }

  async saveProgress() {
    const progressData = {
      timestamp: new Date().toISOString(),
      progress: this.progress,
      errors: this.errors,
      totalParts: this.scrapedParts.size,
      partsBreakdown: this.getPartsBreakdown(),
      chassisProgress: this.getChassisProgress(),
    }

    await fs.writeFile(
      path.join(process.cwd(), "ultimate-scraping-progress.json"),
      JSON.stringify(progressData, null, 2),
    )
  }

  getPartsBreakdown() {
    const breakdown = {}
    for (const [key, part] of this.scrapedParts) {
      const chassis = part.chassisCode
      if (!breakdown[chassis]) {
        breakdown[chassis] = 0
      }
      breakdown[chassis]++
    }
    return breakdown
  }

  getChassisProgress() {
    const progress = {}
    for (const [chassisCode] of this.scrapedModels) {
      progress[chassisCode] = {
        started: this.progress.processedChassis > 0,
        completed: false, // Would need more detailed tracking
      }
    }
    return progress
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async run() {
    console.log("🚀 Starting ULTIMATE BMW Parts Scraping Operation")
    console.log("🎯 Target: Every single BMW part from every chassis (1970-2024)")
    console.log("📊 Expected: 500,000+ parts across 100+ chassis codes")

    try {
      // Initialize browser
      await this.initialize()

      // Navigate to RealOEM
      const navigationSuccess = await this.navigateToRealOEM()
      if (!navigationSuccess) {
        throw new Error("Failed to access RealOEM")
      }

      // Extract all BMW chassis codes
      const chassisCodes = await this.extractAllBMWChassis()
      if (chassisCodes.length === 0) {
        throw new Error("No BMW chassis codes found")
      }

      console.log(`\n🎯 SCRAPING PLAN:`)
      console.log(`   Total Chassis: ${chassisCodes.length}`)
      console.log(`   Categories per Model: ${REALOEM_CATEGORIES.length}`)
      console.log(`   Estimated Total Parts: 500,000+`)
      console.log(`   Estimated Duration: 48-72 hours`)

      // Process each chassis completely
      for (const [chassisCode, chassisData] of Object.entries(this.scrapedModels)) {
        console.log(`\n🔧 Processing ${chassisCode}...`)

        try {
          await this.scrapeChassisCompletely(chassisCode, chassisData)

          // Save progress after each chassis
          await this.saveProgress()

          // Extended break between chassis to avoid rate limiting
          await this.delay(5000)
        } catch (error) {
          console.error(`❌ Failed to process ${chassisCode}:`, error.message)
          this.errors.push(`${chassisCode}: ${error.message}`)
          continue
        }
      }

      // Save all data to database
      await this.saveToDatabase()

      // Final progress save
      await this.saveProgress()

      console.log("\n🎉 ULTIMATE BMW PARTS SCRAPING COMPLETED!")
      console.log(`📊 FINAL STATISTICS:`)
      console.log(`   Chassis Processed: ${this.progress.processedChassis}`)
      console.log(`   Models Processed: ${this.progress.processedModels}`)
      console.log(`   Parts Extracted: ${this.scrapedParts.size.toLocaleString()}`)
      console.log(`   Categories Covered: ${this.progress.processedCategories}`)
      console.log(`   Errors Encountered: ${this.errors.length}`)
      console.log(`   Duration: ${((new Date() - this.progress.startTime) / 1000 / 60 / 60).toFixed(1)} hours`)
    } catch (error) {
      console.error("❌ Ultimate scraping failed:", error.message)
      this.errors.push(`Fatal error: ${error.message}`)
    } finally {
      await this.cleanup()
    }
  }
}

// Run the ultimate scraper
if (import.meta.url === `file://${process.argv[1]}`) {
  const scraper = new UltimateRealOEMScraper()
  scraper.run().catch(console.error)
}

export { UltimateRealOEMScraper }
