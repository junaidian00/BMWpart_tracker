"use client"

import { Suspense, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle, RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react'

// Dynamically import 3D components to avoid SSR issues
const Canvas = dynamic(() => import("@react-three/fiber").then(mod => ({ default: mod.Canvas })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>
})

const OrbitControls = dynamic(() => import("@react-three/drei").then(mod => ({ default: mod.OrbitControls })), { ssr: false })
const Environment = dynamic(() => import("@react-three/drei").then(mod => ({ default: mod.Environment })), { ssr: false })
const Text = dynamic(() => import("@react-three/drei").then(mod => ({ default: mod.Text })), { ssr: false })

// Mock BMW parts data
const bmwParts = [
  { id: 1, name: "Front Brake Disc", partNumber: "34116794300", price: 89.99, category: "Brakes", position: [-2, 0, 0] },
  { id: 2, name: "Air Filter", partNumber: "13717532754", price: 24.99, category: "Engine", position: [0, 1, 0] },
  { id: 3, name: "Headlight Assembly", partNumber: "63117182518", price: 299.99, category: "Lighting", position: [2, 0, 0] },
  { id: 4, name: "Door Handle", partNumber: "51217202143", price: 45.99, category: "Body", position: [0, -1, 0] },
  { id: 5, name: "Wheel Hub", partNumber: "31206850156", price: 125.99, category: "Suspension", position: [0, 0, 2] },
]

function PartMesh({ part, isSelected, onClick }: { part: any, isSelected: boolean, onClick: () => void }) {
  return (
    <group position={part.position} onClick={onClick}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={isSelected ? "#3b82f6" : "#64748b"} />
      </mesh>
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.ttf"
      >
        {part.name}
      </Text>
    </group>
  )
}

function Scene3D({ parts, selectedPart, onPartSelect }: { parts: any[], selectedPart: any, onPartSelect: (part: any) => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="studio" />
      
      {parts.map((part) => (
        <PartMesh
          key={part.id}
          part={part}
          isSelected={selectedPart?.id === part.id}
          onClick={() => onPartSelect(part)}
        />
      ))}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  )
}

function Fallback2D({ parts, selectedPart, onPartSelect }: { parts: any[], selectedPart: any, onPartSelect: (part: any) => void }) {
  return (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100" />
      <div className="relative z-10 grid grid-cols-3 gap-4 p-8">
        {parts.map((part, index) => (
          <div
            key={part.id}
            className={`w-16 h-16 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-medium ${
              selectedPart?.id === part.id
                ? "bg-blue-500 text-white shadow-lg scale-110"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
            }`}
            onClick={() => onPartSelect(part)}
          >
            {part.name.split(' ')[0]}
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
        2D Fallback View
      </div>
    </div>
  )
}

export default function Simulator3D() {
  const [selectedPart, setSelectedPart] = useState(bmwParts[0])
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const [use3D, setUse3D] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        setWebglSupported(!!gl)
      } catch (e) {
        setWebglSupported(false)
      }
    }

    checkWebGL()
    
    // Set loading timeout
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handlePartSelect = (part: any) => {
    setSelectedPart(part)
  }

  const canUse3D = webglSupported && use3D

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">BMW Parts 3D Simulator</h1>
        <p className="text-gray-600">Explore BMW parts in an interactive 3D environment</p>
      </div>

      {webglSupported === false && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            WebGL is not supported in your browser. Using 2D fallback view.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Viewer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Interactive Parts Viewer</CardTitle>
                <CardDescription>
                  {canUse3D ? "Click and drag to rotate, scroll to zoom" : "2D parts overview"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {webglSupported && (
                  <Button
                    variant={use3D ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUse3D(!use3D)}
                  >
                    <Move3D className="h-4 w-4 mr-2" />
                    {use3D ? "3D" : "2D"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : canUse3D ? (
                <Suspense fallback={
                  <div className="h-96 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }>
                  <div className="h-96 w-full">
                    <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                      <Scene3D
                        parts={bmwParts}
                        selectedPart={selectedPart}
                        onPartSelect={handlePartSelect}
                      />
                    </Canvas>
                  </div>
                </Suspense>
              ) : (
                <Fallback2D
                  parts={bmwParts}
                  selectedPart={selectedPart}
                  onPartSelect={handlePartSelect}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Part Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Part</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPart && (
                <>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedPart.name}</h3>
                    <p className="text-sm text-gray-600">Part #{selectedPart.partNumber}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedPart.category}</Badge>
                  </div>
                  
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedPart.price}
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full">Add to Cart</Button>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Parts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bmwParts.map((part) => (
                  <div
                    key={part.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPart?.id === part.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handlePartSelect(part)}
                  >
                    <div className="font-medium text-sm">{part.name}</div>
                    <div className="text-xs text-gray-500">{part.partNumber}</div>
                    <div className="text-sm font-semibold text-green-600">${part.price}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
