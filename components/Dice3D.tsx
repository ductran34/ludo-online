'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

type Props = {
  onRollComplete?: (value: number) => void
}

export default function Dice3D({ onRollComplete }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const cubeRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(120, 120)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    mountRef.current?.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const cube = new THREE.Mesh(geometry, material)
    cubeRef.current = cube
    scene.add(cube)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 5, 5)
    scene.add(light)

    camera.position.z = 3

    const animate = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      renderer.dispose()
    }
  }, [])

  const rollDice = () => {
    const value = Math.floor(Math.random() * 6) + 1

    const rotations = {
      1: [0, 0],
      2: [Math.PI / 2, 0],
      3: [0, Math.PI / 2],
      4: [0, -Math.PI / 2],
      5: [-Math.PI / 2, 0],
      6: [Math.PI, 0]
    }

    const [x, y] = rotations[value as keyof typeof rotations]

    gsap.to(cubeRef.current!.rotation, {
      x: x + Math.PI * 4,
      y: y + Math.PI * 4,
      duration: 1.2,
      ease: 'power4.out',
      onComplete: () => {
        onRollComplete?.(value)
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={mountRef} />
      <button
        onClick={rollDice}
        className="bg-white text-black px-4 py-1 rounded"
      >
        Roll
      </button>
    </div>
  )
}