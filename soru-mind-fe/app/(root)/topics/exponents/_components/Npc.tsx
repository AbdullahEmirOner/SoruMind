import React, { useRef, useState, useEffect } from 'react'
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type NpcProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
  modelUrl: string
  name: string
  onInteract: (name: string) => void
  scale?: number
  animationName?: string
  mode?: 'idle' | 'chasing' | 'staring'
}

export default function Npc({ position, rotation = [0, 0, 0], modelUrl, name, onInteract, scale = 1, animationName = 'Idle', mode = 'idle' }: NpcProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const { scene, animations } = useGLTF(modelUrl)
  const { actions } = useAnimations(animations, groupRef)
  
  // Store initial state to return to
  const initialPosRef = useRef(new THREE.Vector3(...position))
  const initialRotRef = useRef(new THREE.Euler(...rotation))

  // Audio Logic
  useEffect(() => {
    if (mode === 'chasing') {
      const utterances = [
        "Soruyu çöz!",
        "Kaçamazsın, matematiği öğrenmelisin!",
        "Cevabı ver bana!",
        "Yanlış yapma!"
      ]
      
      const speak = () => {
         if (Math.random() > 0.3) {
             const text = utterances[Math.floor(Math.random() * utterances.length)]
             const msg = new SpeechSynthesisUtterance(text)
             msg.lang = 'tr-TR'
             msg.rate = 1.2
             window.speechSynthesis.speak(msg)
         }
      }
      
      const interval = setInterval(speak, 3000)
      speak() // Speak immediately
      return () => clearInterval(interval)
    }
  }, [mode])

  // Animation & Movement Logic
  useFrame((state, delta) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    
    // Staring Behavior (Hoca)
    if (mode === 'staring') {
        const targetPos = new THREE.Vector3()
        state.camera.getWorldPosition(targetPos)
        // Only rotate body on Y to look at player
        const lookTarget = targetPos.clone()
        lookTarget.y = groupRef.current.position.y
        groupRef.current.lookAt(lookTarget)
    }

    // Chasing Behavior
    if (mode === 'chasing') {
        const targetPos = new THREE.Vector3()
        state.camera.getWorldPosition(targetPos)
        
        // Move towards player
        const direction = targetPos.clone().sub(groupRef.current.position)
        direction.y = 0 // Don't fly
        const dist = direction.length()
        
        if (dist > 1.5) {
            direction.normalize()
            groupRef.current.position.addScaledVector(direction, 3 * delta) // Speed = 3
            
            // Look at player while chasing
            const lookTarget = targetPos.clone()
            lookTarget.y = groupRef.current.position.y
            groupRef.current.lookAt(lookTarget)
        }
    } else if (mode === 'idle') {
        // Return to Desk Logic
        const dist = groupRef.current.position.distanceTo(initialPosRef.current)
        if (dist > 0.1) {
            const direction = initialPosRef.current.clone().sub(groupRef.current.position).normalize()
            groupRef.current.position.addScaledVector(direction, 2 * delta) // Return speed
            
            // Look at home
            const lookTarget = initialPosRef.current.clone()
            lookTarget.y = groupRef.current.position.y
            groupRef.current.lookAt(lookTarget)
        } else {
            // Snap to exact pos and rotation
             if (dist > 0.01) {
                groupRef.current.position.copy(initialPosRef.current)
                groupRef.current.rotation.copy(initialRotRef.current)
             }
        }
    }
  })

  useEffect(() => {
    // Play the requested animation or the first available one
    // Override animation if chasing OR walking back
    let actionName = animationName
    
    if (mode === 'chasing') {
        actionName = 'Run'
    } else {
        // If returning home
        if (groupRef.current && groupRef.current.position.distanceTo(initialPosRef.current) > 0.1) {
             actionName = 'Walk'
        }
    }
    
    // Safety check if animation doesn't exist
    if (!actions[actionName]) {
         // Fallback logic
         if (actionName === 'Run') actionName = actions['Walk'] ? 'Walk' : 'Idle'
         else if (actionName === 'Walk') actionName = 'Idle'
    }

    const action = actions[actionName] || actions[Object.keys(actions)[0]]
    if (action) {
        action.reset().fadeIn(0.5).play()
    }
    return () => {
        action?.fadeOut(0.5)
    }
  }, [actions, animationName, mode])

  // Clone scene to avoid shared state issues if reusing same model url
  const clone = React.useMemo(() => scene.clone(), [scene])

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation}
      onClick={(e) => {
          e.stopPropagation()
          onInteract(name)
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={clone} scale={scale} />

      {/* Interaction Hint (Hover Effect) */}
      {hovered && (
          <mesh position={[0, 2.5, 0]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshBasicMaterial color="indigo" />
          </mesh>
      )}
      
      {/* Name Tag */}
      {hovered && (
         <Text position={[0, 2.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="bottom">
             {name}
         </Text>
      )}
    </group>
  )
}
