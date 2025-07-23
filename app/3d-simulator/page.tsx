"use client"

import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Package, Wrench, Camera, Play, Settings } from "lucide-react"

export default function Simulator3DPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">3D Car Simulator</h1>
          <p className="text-gray-600">Visualize modifications before you buy</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 3D Viewer */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">3D Simulator Coming Soon</h3>
                    <p className="text-gray-600 mb-4">Interactive 3D visualization for BMW modifications</p>
                    <Badge variant="secondary">In Development</Badge>
                  </div>

                  {/* Placeholder controls */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Button size="sm" variant="outline" className="bg-white/80">
                      <Camera className="h-4 w-4 mr-2" />
                      Screenshot
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/80">
                      <Settings className="h-4 w-4 mr-2" />
                      View Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modification Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Your BMW</CardTitle>
                <CardDescription>Choose your model to start customizing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">2023 BMW 335i</div>
                      <div className="text-xs text-gray-500">F30 Series</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">2020 BMW M3</div>
                      <div className="text-xs text-gray-500">F80 Series</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">Add New Vehicle</div>
                      <div className="text-xs text-gray-500">From maintenance tracker</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="exterior" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="exterior">Exterior</TabsTrigger>
                <TabsTrigger value="interior">Interior</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="exterior" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Palette className="h-4 w-4" />
                      Paint & Wraps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="w-full h-8 bg-red-500 rounded cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                      <div className="w-full h-8 bg-blue-600 rounded cursor-pointer border-2 border-gray-400"></div>
                      <div className="w-full h-8 bg-black rounded cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                      <div className="w-full h-8 bg-white rounded cursor-pointer border-2 border-gray-300 hover:border-gray-400"></div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Custom Color
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Package className="h-4 w-4" />
                      Body Kits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      M Performance Kit
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      Vorsteiner Kit
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      Custom Front Lip
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Wrench className="h-4 w-4" />
                      Wheels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      BBS CH-R 19"
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      Apex ARC-8 18"
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      OEM Style 437
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interior" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500 text-center">Interior customization options coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-500 text-center">Performance visualization coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Coming Soon Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Photo-Realistic Rendering
                </CardTitle>
                <CardDescription>
                  See exactly how modifications will look with ray-traced lighting and materials
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Real Parts Integration
                </CardTitle>
                <CardDescription>
                  Visualize actual parts from our marketplace with accurate dimensions and fitment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  AR Preview
                </CardTitle>
                <CardDescription>Use your phone camera to see modifications on your actual vehicle</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
