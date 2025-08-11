import { UltimateRealOEMScraper } from "./ultimate-realoem-scraper.js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

console.log("🚀 ULTIMATE BMW PARTS SCRAPING OPERATION")
console.log("=".repeat(60))
console.log("🎯 MISSION: Extract every single BMW part from RealOEM")
console.log("📊 TARGET: 500,000+ parts from 100+ chassis codes")
console.log("⏱️  DURATION: 48-72 hours estimated")
console.log("🔧 SCOPE: Every bolt, gasket, panel, and component")
console.log("=".repeat(60))

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables:")
  console.error("   - SUPABASE_URL")
  console.error("   - SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

console.log("✅ Environment variables validated")
console.log("🔗 Database:", process.env.SUPABASE_URL.substring(0, 30) + "...")

// Create and run the ultimate scraper
const scraper = new UltimateRealOEMScraper()

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Received shutdown signal...")
  console.log("💾 Saving progress before exit...")

  try {
    await scraper.saveProgress()
    await scraper.cleanup()
    console.log("✅ Progress saved successfully")
  } catch (error) {
    console.error("❌ Error during shutdown:", error.message)
  }

  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received termination signal...")
  await scraper.saveProgress()
  await scraper.cleanup()
  process.exit(0)
})

// Start the ultimate scraping operation
scraper
  .run()
  .then(() => {
    console.log("\n🎉 ULTIMATE SCRAPING OPERATION COMPLETED!")
    console.log("📊 Check ultimate-scraping-progress.json for detailed results")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ ULTIMATE SCRAPING OPERATION FAILED:")
    console.error(error.message)
    console.error("\n📊 Check ultimate-scraping-progress.json for partial results")
    process.exit(1)
  })
