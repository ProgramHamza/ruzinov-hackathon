"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Sphere } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"

interface RoomVisualizationProps {
  temperature: number
  occupancy: number
  maxOccupancy: number
}

function Room({ temperature, occupancy, maxOccupancy }: RoomVisualizationProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Enhanced temperature color mapping
  const getTemperatureColor = (temp: number) => {
    const normalizedTemp = Math.max(0, Math.min(1, (temp - 15) / 15))
    return new THREE.Color().setHSL(0.7 - normalizedTemp * 0.7, 0.9, 0.6)
  }

  // Occupancy visualization
  const occupancyPositions = useMemo(() => {
    return Array.from({ length: occupancy }, () => ({
      x: (Math.random() - 0.5) * 3.5,
      z: (Math.random() - 0.5) * 3.5,
      y: -1.3,
    }))
  }, [occupancy])

  const temperatureColor = getTemperatureColor(temperature)

  return (
    <group>
      {/* Room walls with glass effect */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[4, 3, 4]} />
        <meshPhysicalMaterial
          color={temperatureColor}
          transparent
          opacity={0.2}
          transmission={0.9}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Floor with gradient */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color={new THREE.Color().setHSL(0.6, 0.5, 0.3)} transparent opacity={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.9} />
      </mesh>

      {/* Temperature display */}
      <Text
        position={[0, 2.2, 2.1]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`${temperature.toFixed(1)}°C`}
      </Text>

      {/* Occupancy display */}
      <Text
        position={[0, 1.7, 2.1]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`${occupancy}/${maxOccupancy} people`}
      </Text>

      {/* People visualization */}
      {occupancyPositions.map((pos, index) => (
        <Sphere key={index} position={[pos.x, pos.y, pos.z]} args={[0.15, 16, 16]}>
          <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={0.2} />
        </Sphere>
      ))}

      {/* Ambient lighting effects */}
      <pointLight position={[0, 1, 0]} intensity={0.5} color={temperatureColor} />
      <pointLight position={[2, 0.5, 2]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-2, 0.5, -2]} intensity={0.3} color="#ffffff" />
    </group>
  )
}

export function RoomVisualization(props: RoomVisualizationProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden">
      <Canvas camera={{ position: [6, 4, 6], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        <Room {...props} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={12}
          minDistance={4}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />

        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
