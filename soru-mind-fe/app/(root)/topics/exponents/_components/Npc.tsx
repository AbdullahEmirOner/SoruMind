'use client'

import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type NpcProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
  color: string
  name: string
  onInteract: (name: string) => void
  isSitting?: boolean
}

export default function Npc({ position, rotation = [0, 0, 0], color, name, onInteract, isSitting = false }: NpcProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    
    // 1. Idle Bobbing
    groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.04

    // 2. Gaze Tracking (Look at Camera)
    // We want the whole group to rotate on Y axis to face the player
    const targetPos = new THREE.Vector3()
    state.camera.getWorldPosition(targetPos)
    
    // Ignore Y for body rotation to prevent NPCs from leaning back/forward
    const bodyTarget = targetPos.clone()
    bodyTarget.y = groupRef.current.position.y
    groupRef.current.lookAt(bodyTarget)

    // Head can tilt slightly on X/Z for more life
    if (headRef.current) {
        headRef.current.rotation.z = Math.sin(time * 1.5) * 0.05
    }
  })

  return (
    <group 
      ref={groupRef} 
      position={position} 
      onClick={(e) => {
          e.stopPropagation()
          onInteract(name)
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 1, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.5} />
        
        {/* Face Details (Eyes & Mouth) */}
        <group position={[0, 0.05, 0.22]}>
             <mesh position={[-0.08, 0, 0]}>
                <sphereGeometry args={[0.03]} />
                <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[0.08, 0, 0]}>
                <sphereGeometry args={[0.03]} />
                <meshBasicMaterial color="black" />
            </mesh>
            {/* Mouth */}
            <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.1, 0.02, 0.01]} />
                <meshBasicMaterial color="#b45309" />
            </mesh>
        </group>
      </mesh>

      {/* Sitting Legs */}
      {isSitting && (
          <mesh position={[0, 0.2, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
              <meshStandardMaterial color={color} />
          </mesh>
      )}

      {/* Interaction Hint (Hover Effect) */}
      {hovered && (
          <mesh position={[0, 2.2, 0]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshBasicMaterial color="#indigo-400" emissive="blue" />
          </mesh>
      )}
    </group>
  )
}
