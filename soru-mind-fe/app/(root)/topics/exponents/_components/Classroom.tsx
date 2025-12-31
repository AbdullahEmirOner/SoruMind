'use client'

import React from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import Npc from './Npc'

type ClassroomProps = {
  onInteract: (name: string) => void
}

export default function Classroom({ onInteract }: ClassroomProps) {
  const [, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys()
    const speed = 5 * delta
    
    const direction = new THREE.Vector3()
    state.camera.getWorldDirection(direction)
    direction.y = 0
    direction.normalize()

    const side = new THREE.Vector3().crossVectors(state.camera.up, direction).normalize()

    if (forward) state.camera.position.addScaledVector(direction, speed)
    if (backward) state.camera.position.addScaledVector(direction, -speed)
    if (left) state.camera.position.addScaledVector(side, speed)
    if (right) state.camera.position.addScaledVector(side, -speed)
    
    state.camera.position.x = Math.max(-14, Math.min(14, state.camera.position.x))
    state.camera.position.z = Math.max(-14, Math.min(14, state.camera.position.z))
    state.camera.position.y = 1.7
  })

  // Furniture Helper
  const Desk = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      {[[-0.6, 0.35, 0.4], [0.6, 0.35, 0.4], [-0.6, 0.35, -0.4], [0.6, 0.35, -0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
           <boxGeometry args={[0.05, 0.7, 0.05]} />
           <meshStandardMaterial color="#451a03" />
        </mesh>
      ))}
      <group position={[0, 0, 0.8]}>
         <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.7, 0.1, 0.7]} />
            <meshStandardMaterial color="#1e293b" />
         </mesh>
         <mesh position={[0, 0.8, 0.3]}>
            <boxGeometry args={[0.7, 0.8, 0.1]} />
            <meshStandardMaterial color="#1e293b" />
         </mesh>
      </group>
    </group>
  )

  return (
    <group>
      {/* Floor & Walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5, -15]}>
        <boxGeometry args={[32, 10, 0.5]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Blackboard with Content */}
      <group position={[0, 4, -14.7]}>
          <mesh>
            <planeGeometry args={[14, 7]} />
            <meshStandardMaterial color="#064e3b" roughness={0.5} />
          </mesh>
          
          {/* Board Text */}
          <group position={[0, 2.5, 0.05]}>
              <Text fontSize={0.6} color="white" anchorX="center" anchorY="top">
                  ÜSLÜ SAYILAR KURALLARI
              </Text>
              <Text position={[-6, -1.2, 0]} fontSize={0.35} color="#fbbf24" anchorX="left" anchorY="top">
                  {"1.  aⁿ · aᵐ = aⁿ⁺ᵐ"}
              </Text>
              <Text position={[-6, -2.1, 0]} fontSize={0.35} color="#fbbf24" anchorX="left" anchorY="top">
                  {"2.  aⁿ / aᵐ = aⁿ⁻ᵐ"}
              </Text>
              <Text position={[-6, -3, 0]} fontSize={0.35} color="#fbbf24" anchorX="left" anchorY="top">
                  {"3.  (aⁿ)ᵐ = aⁿᵐ"}
              </Text>
              
              <Text position={[1, -1.2, 0]} fontSize={0.35} color="#fcd34d" anchorX="left" anchorY="top">
                  {"4.  a⁻ⁿ = 1/aⁿ"}
              </Text>
              <Text position={[1, -2.1, 0]} fontSize={0.35} color="#fcd34d" anchorX="left" anchorY="top">
                  {"5.  a⁰ = 1  (a≠0)"}
              </Text>
              <Text position={[1, -3, 0]} fontSize={0.35} color="#fcd34d" anchorX="left" anchorY="top">
                  {"6.  1ⁿ = 1"}
              </Text>
          </group>
      </group>

      {/* Furniture */}
      <Desk position={[-4, 0, 3]} />
      <Desk position={[4, 0, 3]} />
      <Desk position={[-4, 0, 7]} />
      <Desk position={[4, 0, 7]} />

      {/* Characters */}
      <Npc name="Hoca" position={[-5, 0, -10]} color="#1e40af" onInteract={onInteract} />
      <Npc name="Ali" position={[-4, 0, 3.8]} color="#15803d" isSitting onInteract={onInteract} />
      <Npc name="Zeynep" position={[4, 0, 3.8]} color="#be185d" isSitting onInteract={onInteract} />
      <Npc name="Can" position={[-4, 0, 7.8]} color="#7c3aed" isSitting onInteract={onInteract} />
      <Npc name="Merve" position={[4, 0, 7.8]} color="#0369a1" isSitting onInteract={onInteract} />

      {/* Lighting Refined */}
      <rectAreaLight 
          position={[0, 5, -14]} 
          width={14} 
          height={7} 
          intensity={2} 
          color="white" 
          rotation={[0, Math.PI, 0]} 
      />
      <pointLight position={[0, 8, 0]} intensity={2} distance={25} castShadow />
    </group>
  )
}
