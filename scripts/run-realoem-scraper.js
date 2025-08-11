import { RealOEMScraper } from "./complete-realoem-scraper.js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

console.log("🚀 BMW RealOEM Complete Database Scraper")
console.log("==========================================")
console.log("")
console.log("This scraper will extract EVERY BMW part from RealOEM.com including:")
console.log("✅ Every BMW chassis from 1970-2024 (E, F, G, U series)")
console.log("✅ Every single part with exact BMW part numbers")
console.log("✅ Complete compatibility information")
console.log("✅ Pricing and availability data")
console.log("✅ Diagram positions and technical details")
console.log("✅ Supersession and alternative part information")
console.log("")
console.log("Expected results:")
console.log("📊 500,000+ individual BMW parts")
console.log("🚗 200+ BMW model variants")
console.log("🔧 50+ part categories")
console.log("📋 Complete cross-reference database")
console.log("")
console.log("⚠️  WARNING: This is a comprehensive scraping operation that will:")
console.log("   - Take several hours to complete")
console.log("   - Make thousands of requests to RealOEM.com")
console.log("   - Require stable internet connection")
console.log("   - Use significant system resources")
console.log("")

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables:")
  console.error("   - SUPABASE_URL")
  console.error("   - SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

// Confirm before starting
const readline = await import("readline")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const confirm = await new Promise((resolve) => {
  rl.question("Do you want to proceed with the complete RealOEM scraping? (yes/no): ", resolve)
})

rl.close()

if (confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "y") {
  console.log("❌ Scraping cancelled by user")
  process.exit(0)
}

console.log("")
console.log("🚀 Starting RealOEM scraping...")
console.log("📊 Progress will be saved periodically to scraping-progress.json")
console.log("⏱️  Estimated completion time: 4-8 hours")
console.log("")

// Start the scraper
const scraper = new RealOEMScraper()

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n⚠️  Received interrupt signal. Saving progress and shutting down...")
  await scraper.saveProgress()
  await scraper.cleanup()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("\n⚠️  Received termination signal. Saving progress and shutting down...")
  await scraper.saveProgress()
  await scraper.cleanup()
  process.exit(0)
})

// Run the scraper
try {
  await scraper.run()
  console.log("\n🎉 RealOEM scraping completed successfully!")
  console.log("📊 Check your database for the complete BMW parts catalog")
} catch (error) {
  console.error("\n❌ Scraping failed:", error.message)
  await scraper.saveProgress()
  process.exit(1)
}
