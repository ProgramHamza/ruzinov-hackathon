"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface RoomVisualizationProps {
  temperature: number
  occupancy: number
  maxOccupancy: number
}

export function RoomVisualization({ temperature, occupancy, maxOccupancy }: RoomVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(5, 5, 5)
    cameraRef.current = camera

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controlsRef.current = controls

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Create room
    const roomGeometry = new THREE.BoxGeometry(10, 8, 10)
    const roomMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    })
    const room = new THREE.Mesh(roomGeometry, roomMaterial)
    scene.add(room)

    // Add temperature visualization
    const tempColor = new THREE.Color().setHSL(0.7 - (temperature - 15) / 15 * 0.7, 0.9, 0.6)
    const tempSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhongMaterial({
        color: tempColor,
        emissive: tempColor,
        emissiveIntensity: 0.2
      })
    )
    tempSphere.position.set(0, 0, 0)
    scene.add(tempSphere)

    // Add occupancy visualization
    for (let i = 0; i < occupancy; i++) {
      const person = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshPhongMaterial({
          color: 0x4ade80,
          emissive: 0x22c55e,
          emissiveIntensity: 0.2
        })
      )
      person.position.set(
        (Math.random() - 0.5) * 3.5,
        -1.3,
        (Math.random() - 0.5) * 3.5
      )
      scene.add(person)
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [temperature, occupancy])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  )
}
