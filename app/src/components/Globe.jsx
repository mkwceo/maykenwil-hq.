import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Line, Html } from '@react-three/drei'
import * as THREE from 'three'

const R = 1.6
const POS = {
  sport: [18, 0], events: [48, 58], northvision: [-12, 128],
  capital: [-38, -158], beaute: [38, -104], logistique: [-28, -52],
}
const LINKS = [
  ['sport','events'],['events','capital'],['capital','northvision'],
  ['sport','capital'],['sport','northvision'],['logistique','sport'],['events','beaute'],
]
function ll(lat, lng, r = R) {
  const phi = (90 - lat) * Math.PI / 180, th = (lng + 180) * Math.PI / 180
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(th), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(th))
}
function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64,64,0,64,64,64)
  g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.25,'rgba(255,255,255,.55)'); g.addColorStop(1,'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0,0,128,128)
  return new THREE.CanvasTexture(c)
}
function arcPoints(a, b) {
  const va = ll(POS[a][0],POS[a][1]).normalize().multiplyScalar(R)
  const vb = ll(POS[b][0],POS[b][1]).normalize().multiplyScalar(R)
  const mid = va.clone().add(vb).normalize().multiplyScalar(R*1.34)
  return new THREE.QuadraticBezierCurve3(va, mid, vb).getPoints(50)
}

function Scene({ branches, selected, onSelect, paused }) {
  const grp = useRef()
  const glow = useMemo(glowTexture, [])
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const byId = useMemo(() => Object.fromEntries(branches.map(b => [b.id, b])), [branches])
  const target = useMemo(() => new THREE.Quaternion(), [])

  useEffect(() => {
    if (grp.current) {
      const s = POS.sport
      grp.current.quaternion.setFromUnitVectors(ll(s[0],s[1]).normalize(), new THREE.Vector3(0,0,1))
    }
  }, [])

  useFrame((_, dt) => {
    const g = grp.current; if (!g) return
    if (selected && POS[selected]) {
      target.setFromUnitVectors(ll(POS[selected][0],POS[selected][1]).normalize(), new THREE.Vector3(0,0,1))
      g.quaternion.slerp(target, 0.07)
    } else if (!paused && !reduced) {
      g.rotation.y += dt * 0.12
    }
  })

  const flux = useMemo(() => LINKS.filter(([a,b]) => POS[a] && POS[b]), [])

  return (
    <>
      <Stars radius={28} depth={22} count={900} factor={3} saturation={0} fade speed={0} />
      <group ref={grp}>
        <mesh><sphereGeometry args={[R*0.99,48,48]} /><meshBasicMaterial color="#0a121a" /></mesh>
        <mesh><sphereGeometry args={[R,30,30]} /><meshBasicMaterial color="#2e9e78" wireframe transparent opacity={0.16} /></mesh>

        {flux.map(([a,b],i) => {
          const col = byId[a]?.color || '#c2a24e'
          return <Line key={i} points={arcPoints(a,b)} color={col} transparent opacity={0.32} lineWidth={1} />
        })}

        {branches.map(b => {
          if (!POS[b.id]) return null
          const p = ll(POS[b.id][0], POS[b.id][1])
          const dormant = b.status === 'dormant'
          const size = 0.04 + (b.progress/100)*0.05 + (b.status==='active'?0.02:0)
          const hs = size * (dormant ? 5 : 9)
          const dim = selected && selected !== b.id
          return (
            <group key={b.id} position={[p.x,p.y,p.z]}>
              {/* zone de clic invisible (large, facile à viser) */}
              <mesh
                onClick={(e)=>{ e.stopPropagation(); onSelect(b.id) }}
                onPointerOver={()=>document.body.style.cursor='pointer'}
                onPointerOut={()=>document.body.style.cursor='default'}>
                <sphereGeometry args={[Math.max(size*2.6, 0.17),14,14]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
              <mesh raycast={()=>null}>
                <sphereGeometry args={[size,18,18]} />
                <meshBasicMaterial color={dormant ? new THREE.Color(b.color).multiplyScalar(0.5) : b.color} />
              </mesh>
              <sprite scale={[hs,hs,1]} raycast={()=>null}>
                <spriteMaterial map={glow} color={b.color} transparent depthWrite={false}
                  blending={THREE.AdditiveBlending} opacity={dormant?0.25:(dim?0.4:0.85)} />
              </sprite>
              <Html center distanceFactor={8} zIndexRange={[10,0]} style={{ pointerEvents: 'none' }}>
                <div className="lbl" style={{ opacity: dim ? 0.3 : 1, pointerEvents: 'none' }}>
                  <i style={{ background:b.color, boxShadow:`0 0 8px ${b.color}` }} />{b.name} <small>{b.progress}%</small>
                </div>
              </Html>
            </group>
          )
        })}
      </group>
      <sprite scale={[R*5,R*5,1]}>
        <spriteMaterial map={glow} color="#2e9e78" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </>
  )
}

export default function Globe({ branches, selected, onSelect, paused }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 5.2], fov: 42 }}
      onPointerMissed={() => onSelect(null)}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene branches={branches} selected={selected} onSelect={onSelect} paused={paused} />
    </Canvas>
  )
}
