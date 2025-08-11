export async function GET() {
  // Simple runtime version marker for production verification
  return Response.json({
    version: "v100",
    deployedAt: new Date().toISOString(),
  })
}
