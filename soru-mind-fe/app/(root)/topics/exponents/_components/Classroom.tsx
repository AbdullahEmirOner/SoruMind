'use client'

import React from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import Npc from './Npc'

type ClassroomProps = {
  onInteract: (name: string) => void
  activeChaser: string | null
  isLightning?: boolean
}

export default function Classroom({ onInteract, activeChaser, isLightning }: ClassroomProps) {
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

  // Furniture Helper - Table Only (No Chair)
  const Desk = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      {/* Legs */}
      {[[-0.6, 0.35, 0.4], [0.6, 0.35, 0.4], [-0.6, 0.35, -0.4], [0.6, 0.35, -0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
           <boxGeometry args={[0.05, 0.7, 0.05]} />
           <meshStandardMaterial color="#451a03" />
        </mesh>
      ))}
    </group>
  )

  return (
    <group>
      {/* Lightened Fog - Less scary, more "Spooky but seeable" */}
      <fog attach="fog" args={['#270707', 5, 40]} />
      
      {/* Lightning Effect */}
      {isLightning && (
          <ambientLight intensity={20} color="white" />
      )}

      {/* Floor & Walls - Dark Horror Style but slightly lighter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#291010" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2d1212" roughness={0.9} />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 5, -15]}>
        <boxGeometry args={[40, 10, 0.5]} />
        <meshStandardMaterial color="#451a1a" />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-20, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[40, 10, 0.5]} />
        <meshStandardMaterial color="#451a1a" />
      </mesh>
      {/* Right Wall */}
      <mesh position={[20, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[40, 10, 0.5]} />
        <meshStandardMaterial color="#451a1a" />
      </mesh>

      {/* Blackboard with Content */}
      <group position={[0, 4, -14.7]}>
          <mesh>
            <planeGeometry args={[14, 7]} />
            <meshStandardMaterial color="#000000" roughness={0.2} />
          </mesh>
          <mesh position={[0, 3.6, 0]}>
             <boxGeometry args={[14.2, 0.2, 0.2]} />
             <meshStandardMaterial color="#4a0404" />
          </mesh>
          
          {/* Board Text - Reverted to default font for safety */}
          <group position={[0, 2.5, 0.05]}>
              <Text fontSize={0.6} color="red" anchorX="center" anchorY="top" characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.^/()">
                  ÜSLÜ SAYILAR (ÖLÜMCÜL)
              </Text>
              <Text position={[-6, -1.2, 0]} fontSize={0.35} color="#d1d5db" anchorX="left" anchorY="top">
                  {"1.  a^n . a^m = a^(n+m)"}
              </Text>
              <Text position={[-6, -2.1, 0]} fontSize={0.35} color="#d1d5db" anchorX="left" anchorY="top">
                  {"2.  a^n / a^m = a^(n-m)"}
              </Text>
              <Text position={[-6, -3, 0]} fontSize={0.35} color="#d1d5db" anchorX="left" anchorY="top">
                  {"3.  (a^n)^m = a^(nm)"}
              </Text>
              
              <Text position={[1, -1.2, 0]} fontSize={0.35} color="#9ca3af" anchorX="left" anchorY="top">
                  {"4.  a^(-n) = 1 / a^n"}
              </Text>
              <Text position={[1, -2.1, 0]} fontSize={0.35} color="#9ca3af" anchorX="left" anchorY="top">
                  {"5.  a^0 = 1  (a!=0)"}
              </Text>
              <Text position={[1, -3, 0]} fontSize={0.35} color="#9ca3af" anchorX="left" anchorY="top">
                  {"6.  1^n = 1"}
              </Text>
          </group>
      </group>

      {/* Furniture - Tables Only */}
      <Desk position={[-4, 0, 3]} />
      <Desk position={[4, 0, 3]} />
      <Desk position={[-4, 0, 7]} />
      <Desk position={[4, 0, 7]} />

      {/* Characters - 3D Models */}
      {/* Hoca - RobotExpressive (Different Animation/Size) - Always Staring */}
      <Npc 
        name="Hoca" 
        position={[-5, 0, -10]} 
        modelUrl="/models/RobotExpressive.glb" 
        scale={0.6} // Slightly larger than students (0.4)
        animationName="Idle"
        mode="staring"
        onInteract={onInteract} 
      />
      
      {/* Students - RobotExpressive */}
      <Npc 
        name="Ali" 
        position={[-4, 0, 4]} 
        rotation={[0, Math.PI, 0]}
        modelUrl="/models/RobotExpressive.glb" 
        scale={0.4} 
        animationName="Idle"
        mode={activeChaser === 'Ali' ? 'chasing' : 'idle'}
        onInteract={onInteract} 
      />
      <Npc 
        name="Zeynep" 
        position={[4, 0, 4]} 
        rotation={[0, Math.PI, 0]}
        modelUrl="/models/RobotExpressive.glb" 
        scale={0.4} 
        animationName="Dance"
        mode={activeChaser === 'Zeynep' ? 'chasing' : 'idle'}
        onInteract={onInteract} 
      />
      <Npc 
        name="Can" 
        position={[-4, 0, 8]} 
        rotation={[0, Math.PI, 0]}
        modelUrl="/models/RobotExpressive.glb" 
        scale={0.4} 
        animationName="Idle"
        mode={activeChaser === 'Can' ? 'chasing' : 'idle'}
        onInteract={onInteract} 
      />
      <Npc 
        name="Merve" 
        position={[4, 0, 8]} 
        rotation={[0, Math.PI, 0]}
        modelUrl="/models/RobotExpressive.glb" 
        scale={0.4} 
        animationName="Jump"
        mode={activeChaser === 'Merve' ? 'chasing' : 'idle'}
        onInteract={onInteract} 
      />

      {/* Lighting Refined - Horror Mode */}
      <rectAreaLight 
          position={[0, 5, -14]} 
          width={14} 
          height={7} 
          intensity={5} 
          color="#ff0000" // Red glow from board
          rotation={[0, Math.PI, 0]} 
      />
      {/* General dim spooky light - Increased visibility */}
      <ambientLight intensity={0.8} color="#202030" /> 
      <spotLight position={[0, 10, 0]} intensity={2} angle={0.8} penumbra={1} color="#3b82f6" castShadow />
      
      {/* Spotlight on Hoca - Removed risky target-position */}
      <spotLight 
        position={[-5, 8, -8]} 
        intensity={5} 
        color="red" 
        angle={0.3} 
        penumbra={0.5} 
        castShadow 
        // To properly target, we recall Hoca is at [-5, 0, -10]. 
        // We can just rely on angle or add a target object if needed, but for safety removing target prop to point default (0,0,0) or similar.
        // Actually, let's just let it point down by default or use rotation if it was a primitive (but it's a light).
        // A safe bet is using the default target (0,0,0).
      />
    </group>
  )
}
