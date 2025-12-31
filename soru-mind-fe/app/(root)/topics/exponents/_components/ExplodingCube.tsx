'use client'

import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three-stdlib'

extend({ RoundedBoxGeometry })

type ExplodingCubeProps = {
  base: number
  exponent: number
  gap: number
}

function getDimensionInfo(exponent: number) {
  switch (exponent) {
    case 0: return { color: '#FF69B4', label: '0D Nokta (Point)' }
    case 1: return { color: '#00FFFF', label: '1D Doğru (Line)' }
    case 2: return { color: '#FFA500', label: '2D Düzlem (Plane)' }
    case 3: return { color: '#9370DB', label: '3D Hacim (Cube)' }
    default: return { color: '#FF0000', label: `${exponent}D Hiperküp (Hypercube)` }
  }
}

export default function ExplodingCube({ base, exponent, gap }: ExplodingCubeProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = Math.pow(base, exponent)
  
  const targetPositions = useMemo(() => new Float32Array(MAX_INSTANCES * 3), [])
  const currentPositions = useRef(new Float32Array(MAX_INSTANCES * 3))
  
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colorObj = useMemo(() => new THREE.Color(), [])

  const { color: baseColorHex, label: dimensionLabel } = getDimensionInfo(exponent)

  useEffect(() => {
    targetPositions.fill(0)
    const centerOffset = (base - 1) / 2
    const spacing = 1 + gap
    const clusterSpacing = (base * spacing) + 2

    for (let i = 0; i < count; i++) {
        let temp = i
        let x = 0, y = 0, z = 0

        if (exponent === 0) {} 
        else if (exponent === 1) {
            x = (temp % base - centerOffset) * spacing
        }
        else if (exponent === 2) {
            x = (temp % base - centerOffset) * spacing
            y = (Math.floor(temp / base) % base - centerOffset) * spacing
        }
        else if (exponent === 3) {
            x = (temp % base - centerOffset) * spacing
            y = (Math.floor(temp / base) % base - centerOffset) * spacing
            z = (Math.floor(temp / (base * base)) % base - centerOffset) * spacing
        }
        else {
             x = (temp % base - centerOffset) * spacing
             y = (Math.floor(temp / base) % base - centerOffset) * spacing
             z = (Math.floor(temp / (base * base)) % base - centerOffset) * spacing
             
             let dIndex = Math.floor(temp / (base * base * base))
             if (exponent > 3) x += (dIndex % base - centerOffset) * clusterSpacing
             if (exponent > 4) y += (Math.floor(dIndex / base) % base - centerOffset) * clusterSpacing
             if (exponent > 5) z += (Math.floor(dIndex / (base * base)) % base - centerOffset) * clusterSpacing
        }

        targetPositions[i * 3] = x
        targetPositions[i * 3 + 1] = y
        targetPositions[i * 3 + 2] = z
    }
  }, [base, exponent, gap, count, targetPositions])

  useFrame((state, delta) => {
      if (!meshRef.current) return
      const lerpFactor = Math.min(delta * 8, 1)
      let needsUpdate = false;

      for (let i = 0; i < count; i++) {
          const ix = i * 3
          const tx = targetPositions[ix], ty = targetPositions[ix+1], tz = targetPositions[ix+2]
          const cx = currentPositions.current[ix], cy = currentPositions.current[ix+1], cz = currentPositions.current[ix+2]

          if (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001 || Math.abs(cz - tz) > 0.001) {
             currentPositions.current[ix] = THREE.MathUtils.lerp(cx, tx, lerpFactor)
             currentPositions.current[ix+1] = THREE.MathUtils.lerp(cy, ty, lerpFactor)
             currentPositions.current[ix+2] = THREE.MathUtils.lerp(cz, tz, lerpFactor)
             
             dummy.position.set(currentPositions.current[ix], currentPositions.current[ix+1], currentPositions.current[ix+2])
             dummy.updateMatrix()
             meshRef.current.setMatrixAt(i, dummy.matrix)
             needsUpdate = true
          }
      }
      if(needsUpdate) meshRef.current.instanceMatrix.needsUpdate = true
  })

  useEffect(() => {
     if (!meshRef.current) return
     for(let i=0; i<count; i++) {
        colorObj.set(baseColorHex)
        if (exponent >= 3) colorObj.offsetHSL(0, 0, -(i / count) * 0.2)
        meshRef.current.setColorAt(i, colorObj)
     }
     if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [base, exponent, count, baseColorHex, colorObj])

  const bounds = Math.max(base, 1) * (1 + gap) * (exponent > 3 ? 2 : 1)

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        {/* @ts-ignore */}
        <roundedBoxGeometry args={[0.9, 0.9, 0.9, 2, 0.05]} /> 
        <meshStandardMaterial roughness={0.3} metalness={0.4} />
      </instancedMesh>
      
      <group position={[0, -bounds/2 - 2, 0]}>
         {/* Fixed Glyph Issue by using normal text for base and exponent separately */}
         <group>
            <Text fontSize={1.2} color="#334155" anchorX="right" anchorY="bottom">
                {base.toString()}
            </Text>
            <Text position={[0.1, 0.6, 0]} fontSize={0.6} color="#475569" anchorX="left" anchorY="bottom">
                {exponent.toString()}
            </Text>
            <Text position={[0.8, 0, 0]} fontSize={1.2} color="#334155" anchorX="left" anchorY="bottom">
                {` = ${count}`}
            </Text>
         </group>
         <Text position={[0, -1.2, 0]} fontSize={0.6} color="#64748b" anchorX="center" anchorY="top">
             {dimensionLabel}
         </Text>
      </group>
    </group>
  )
}

const MAX_INSTANCES = 5000
