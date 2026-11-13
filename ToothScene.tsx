import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { TranslationCopy } from '../types'

function ProceduralTooth() {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.18, 0.035)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.08, 0.035)
  })
  const material = <meshPhysicalMaterial color="#f7fbfc" roughness={0.2} metalness={0.04} clearcoat={0.86} clearcoatRoughness={0.16} transmission={0.12} thickness={0.5} />
  return (
    <Float speed={0.8} rotationIntensity={0.11} floatIntensity={0.2}>
      <group ref={group} scale={hovered ? 1.035 : 1} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <mesh position={[0, -0.18, 0]} scale={[1.03, 1.18, .96]} castShadow receiveShadow>{material}<sphereGeometry args={[1, 48, 32]} /></mesh>
        <mesh position={[0, -0.95, 0]} scale={[.75, .5, .72]} castShadow>{material}<sphereGeometry args={[1, 40, 24]} /></mesh>
        {[[-.52, .25, .24], [.52, .25, .24], [-.4, .42, -.34], [.4, .42, -.34]].map(([x, y, z], index) => <mesh key={index} position={[x, y, z]} scale={[.45, .42, .42]} castShadow>{material}<sphereGeometry args={[1, 32, 20]} /></mesh>)}
        <mesh position={[0, .32, .02]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.48, .025, 12, 64]} /><meshBasicMaterial color="#57c7e8" transparent opacity={.38} /></mesh>
      </group>
    </Float>
  )
}

function OrbitDetails() {
  const dots = Array.from({ length: 14 }, (_, index) => {
    const angle = (index / 14) * Math.PI * 2
    const radius = index % 2 ? 1.82 : 1.56
    return [Math.cos(angle) * radius, Math.sin(angle) * radius * .56, (index % 3 - 1) * .12] as [number, number, number]
  })
  return <group>
    {[0, .35, -.35].map((rotation, index) => <mesh key={index} rotation={[rotation, rotation * .35, rotation]}><torusGeometry args={[1.54 + index * .2, .008, 8, 120]} /><meshBasicMaterial color="#57c7e8" transparent opacity={.28 - index * .05} /></mesh>)}
    {dots.map((position, index) => <mesh key={index} position={position}><sphereGeometry args={[index % 4 === 0 ? .035 : .018, 12, 8]} /><meshBasicMaterial color={index % 4 === 0 ? '#57c7e8' : '#b8e8f3'} transparent opacity={.68} /></mesh>)}
  </group>
}

function Scene({ reducedMotion, mobile }: { reducedMotion: boolean; mobile: boolean }) {
  return <>
    <ambientLight intensity={1.3} />
    <directionalLight position={[3, 4, 5]} intensity={4.2} color="#ffffff" castShadow />
    <pointLight position={[-3, 1, 2]} intensity={2.2} color="#57c7e8" />
    <pointLight position={[2, -2, -2]} intensity={1.2} color="#2878c7" />
    <ProceduralTooth />
    <OrbitDetails />
    <Environment preset="studio" environmentIntensity={.48} />
    <OrbitControls enablePan={false} enableZoom={false} autoRotate={!reducedMotion} autoRotateSpeed={.32} enableDamping={!reducedMotion} dampingFactor={.06} maxPolarAngle={Math.PI * .7} minPolarAngle={Math.PI * .3} />
  </>
}

export function ToothScene({ copy, reducedMotion = false }: { copy: TranslationCopy; reducedMotion?: boolean }) {
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches
  const canUseWebGL = useMemo(() => {
    if (typeof document === 'undefined') return false
    try {
      const canvas = document.createElement('canvas')
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    } catch {
      return false
    }
  }, [])
  const [webglReady, setWebglReady] = useState(canUseWebGL)
  return <div className="tooth-stage" aria-label={copy.hero.visualLabel} role="img">
    <div className="stage-grid" aria-hidden="true" />
    {webglReady ? <Canvas dpr={reducedMotion ? [1, 1] : mobile ? [.75, 1] : [1, 1.6]} camera={{ position: [0, 0, 4.8], fov: 36 }} frameloop={reducedMotion ? 'demand' : 'always'} shadows={!mobile} gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', () => setWebglReady(false), { once: true }) }}>
      <Scene reducedMotion={reducedMotion} mobile={mobile} />
    </Canvas> : <div className="tooth-fallback"><div className="fallback-tooth" /><span>{copy.hero.visualFallback}</span></div>}
    <div className="stage-caption"><span className="live-dot" /> <span>{copy.hero.visualLabel}</span></div>
  </div>
}
