import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Globe from './components/Globe.jsx'
import { useJSON } from './data.js'
import { Tasks, Health, Finance, Brainstorm, Learning, Links } from './components/modules/Modules.jsx'

const I = {
  globe:`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/>`,
  tasks:`<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 11l2.5 2.5L16 8"/>`,
  health:`<path d="M20.8 6.6a5 5 0 00-8.8-1.4A5 5 0 003.2 6.6c-1.5 2.6.3 5.6 8.8 11 8.5-5.4 10.3-8.4 8.8-11z"/>`,
  finance:`<path d="M3 17l5-5 4 3 8-8"/><path d="M16 7h5v5"/>`,
  brainstorm:`<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0012 3z"/>`,
  learning:`<path d="M3 7l9-4 9 4-9 4z"/><path d="M7 9v5c0 1.5 2.5 3 5 3s5-1.5 5-3V9"/>`,
  links:`<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>`,
}
const Icon = ({ n }) => <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: I[n] }} />
const MODULES = [
  ['tasks','Tâches'],['health','Santé'],['finance','Finances'],
  ['brainstorm','Brainstorm'],['learning','Apprentissage'],['links','Liens'],
]

function TopBar({ meta }) {
  const [, force] = useState(0)
  useEffect(() => { const t = setInterval(() => force(x => x + 1), 1000); return () => clearInterval(t) }, [])
  const days = meta?.launchTarget ? Math.max(0, Math.ceil((new Date(meta.launchTarget) - Date.now()) / 864e5)) : '—'
  return (
    <header className="topbar">
      <div className="brand">
        <div className="mk">MKW</div>
        <div><b>MAYKENWIL&nbsp;OS</b><span>{meta ? '— ' + meta.founder.toUpperCase() : '—'}</span></div>
      </div>
      {meta && (
        <div className="sys">
          <span><span className="led" />{meta.holding.toUpperCase()}</span>
          <span>GO/NO-GO · <span className="v">{meta.goNoGoScore}</span></span>
          <span>CIBLE · <span className="v">{(meta.launchCity||'').toUpperCase()}</span></span>
          <span>T- <span className="v">{days}J</span></span>
        </div>
      )}
    </header>
  )
}

function BranchPanel({ b, onClose }) {
  return (
    <div style={{ ['--c']: b.color }}>
      <div className="dock-h"><span className="t">{b.phase}</span><button className="x" onClick={onClose}>✕</button></div>
      <h2 style={{ fontSize: 26, fontFamily: 'var(--disp)' }}>{b.name}</h2>
      <div className="mono" style={{ fontSize: 11, color: 'var(--dim)' }}>{b.agency || '—'}</div>
      {b.slogan && <div style={{ fontStyle: 'italic', color: `color-mix(in srgb, ${b.color} 75%, white)`, fontSize: 13, marginTop: 12 }}>« {b.slogan} »</div>}
      <div className="rail" style={{ margin: '18px 0 6px' }}><i style={{ width: b.progress + '%' }} /></div>
      <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--faint)' }}><span>AVANCEMENT</span><b style={{ color: 'var(--bone)', fontWeight: 400 }}>{b.progress}%</b></div>
      <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[['Statut', { active:'Actif', planning:'Planification', dormant:'Dormant' }[b.status] || b.status], ['Responsable', b.lead], ['Jalon clé', b.keyMilestone]].map(([k, v]) => (
          <div key={k} style={{ borderBottom: '1px dashed var(--line)', paddingBottom: 11 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faint)' }}>{k}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.65 }}>{b.notes}</p>
    </div>
  )
}

const MODULE_CMP = { tasks: Tasks, health: Health, finance: Finance, brainstorm: Brainstorm, learning: Learning, links: Links }

export default function App() {
  const holding = useJSON('data/branches.json')
  const [selected, setSelected] = useState(null)
  const [module, setModule] = useState(null)
  const [paused, setPaused] = useState(false)

  const meta = holding.data?.meta || null
  const branches = holding.data?.branches || []

  const pickBranch = (id) => { setModule(null); setSelected(id) }
  const pickModule = (id) => { setSelected(null); setModule(m => m === id ? null : id) }
  const closeDock = () => { setSelected(null); setModule(null) }

  const branch = selected ? branches.find(b => b.id === selected) : null
  const ModuleCmp = module ? MODULE_CMP[module] : null
  const dockOpen = !!(branch || ModuleCmp)

  return (
    <div className="app">
      <TopBar meta={meta} />

      <nav className="sidebar">
        <button className={'nav' + (!module && !selected ? ' active' : '')} onClick={closeDock}><Icon n="globe" /><span className="tip">Globe</span></button>
        {MODULES.map(([id, label]) => (
          <button key={id} className={'nav' + (module === id ? ' active' : '')} onClick={() => pickModule(id)}>
            <Icon n={id} /><span className="tip">{label}</span>
          </button>
        ))}
      </nav>

      <section className="stage">
        <div className="title"><h1>Réseau des 6 branches</h1><p>{meta ? meta.holding.toUpperCase() + ' · ' + meta.globalPhase.toUpperCase() : 'CHARGEMENT…'}</p></div>
        {branches.length > 0 && <Globe branches={branches} selected={selected} onSelect={pickBranch} paused={paused} />}
        <div className="hint">Clique un nœud · glisse pour faire tourner</div>
        <button className="ctrl" onClick={() => setPaused(p => !p)} title="Pause">{paused ? '▶' : '⏸'}</button>

        <AnimatePresence>
          {dockOpen && (
            <motion.aside className="dock" key={selected || module}
              initial={{ x: '102%' }} animate={{ x: 0 }} exit={{ x: '102%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
              {branch
                ? <BranchPanel b={branch} onClose={closeDock} />
                : <ModuleCmp onClose={closeDock} />}
            </motion.aside>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
