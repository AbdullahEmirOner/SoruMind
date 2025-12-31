'use client'

import React from 'react'
import { Text } from '@react-three/drei'

type DivisionCubeProps = {
  base: number
  exponent: number
}

export default function DivisionCube({ base, exponent }: DivisionCubeProps) {
  const visualExp = Math.min(Math.max(exponent, 1), 3)
  const scaleX = 1 / base
  const scaleY = visualExp >= 2 ? 1 / base : 1
  const scaleZ = visualExp >= 3 ? 1 / base : 1

  const posX = -0.5 + scaleX / 2
  const posY = visualExp >= 2 ? -0.5 + scaleY / 2 : 0
  const posZ = visualExp >= 3 ? -0.5 + scaleZ / 2 : 0

  return (
    <group>
      <mesh>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshBasicMaterial wireframe color="gray" opacity={0.3} transparent />
      </mesh>

      <mesh position={[posX, posY, posZ]} scale={[scaleX, scaleY, scaleZ]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={visualExp === 1 ? "#FF6347" : visualExp === 2 ? "#FF8C00" : "#FFD700"} 
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <group position={[0, -1.5, 0]}>
         {/* Fixed Glyph Issue for negative exponents */}
         <group>
            <Text fontSize={0.6} color="#334155" anchorX="right" anchorY="bottom">
                {base.toString()}
            </Text>
            <Text position={[0.05, 0.3, 0]} fontSize={0.3} color="#475569" anchorX="left" anchorY="bottom">
                {`-${exponent}`}
            </Text>
            <Text position={[0.5, 0, 0]} fontSize={0.6} color="#334155" anchorX="left" anchorY="bottom">
                {` = 1/${Math.pow(base, exponent)}`}
            </Text>
         </group>
         <Text position={[0, -0.6, 0]} fontSize={0.3} color="#64748b" anchorX="center" anchorY="top">
             {visualExp === 1 ? `1/${base} Parça (Dilim)` : 
              visualExp === 2 ? `1/${Math.pow(base, 2)} Parça (Kare Prizma)` : 
              `1/${Math.pow(base, 3)} Parça (Birim Küp)`}
         </Text>
      </group>
    </group>
  )
}
