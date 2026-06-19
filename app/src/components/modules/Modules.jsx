import { useJSON } from '../../data.js'

function Shell({ title, color = 'var(--jade)', onClose, children }) {
  return (
    <div style={{ ['--c']: color }}>
      <div className="dock-h"><span className="t">{title}</span><button className="x" onClick={onClose}>✕</button></div>
      {children}
    </div>
  )
}
function Empty({ label, note }) {
  return (
    <div className="empty">
      <span className="dot" />
      <span className="big">{label}</span>
      <span>{note}</span>
    </div>
  )
}
const card = { border: '1px solid var(--line)', background: 'var(--panel)', padding: '12px 14px', borderRadius: 10, marginBottom: 10 }

/* ---- Tâches : pile de priorités (max 2 actives) ---- */
export function Tasks({ onClose }) {
  const { status, data } = useJSON('data/tasks.json')
  return (
    <Shell title="Tâches" color="var(--gold)" onClose={onClose}>
      {status === 'ok'
        ? data.map((t, i) => (
          <div key={i} style={{ ...card, borderLeft: `3px solid ${i < 2 ? 'var(--gold)' : 'var(--steel)'}`, opacity: t.done ? .5 : 1 }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--faint)', letterSpacing: '.12em' }}>{i < 2 ? 'PRIORITÉ ACTIVE' : 'EN FILE'} · {t.branch || '—'}</div>
            <div style={{ fontSize: 13, marginTop: 5 }}>{t.title}</div>
            {t.due && <div className="mono" style={{ fontSize: 10, color: 'var(--dim)', marginTop: 5 }}>⌁ {t.due}</div>}
          </div>))
        : <Empty label="Aucune tâche connectée" note="Dépose data/tasks.json — règle anti-dispersion : 2 priorités max." />}
    </Shell>
  )
}

/* ---- Santé : anneaux (privé) ---- */
export function Health({ onClose }) {
  const { status, data } = useJSON('data/health.json')
  return (
    <Shell title="Santé" color="#ff5c7a" onClose={onClose}>
      {status === 'ok'
        ? (data.rings || []).map((r, i) => (
          <div key={i} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: `conic-gradient(${r.color || '#ff5c7a'} ${Math.min(100, r.value / r.goal * 100)}%, rgba(255,255,255,.08) 0)` }} />
            <div><div style={{ fontSize: 13 }}>{r.label}</div><div className="mono" style={{ fontSize: 11, color: 'var(--dim)' }}>{r.value} / {r.goal}</div></div>
          </div>))
        : <Empty label="Santé non connectée · privé" note="Export Apple Health / Yazio → data/health.json (gitignoré, jamais publié)." />}
    </Shell>
  )
}

/* ---- Finances : runway (privé) ---- */
export function Finance({ onClose }) {
  const { status, data } = useJSON('data/finance.json')
  return (
    <Shell title="Finances" color="#8e9a3c" onClose={onClose}>
      {status === 'ok'
        ? (<>
          <div className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '.12em' }}>AUTONOMIE (RUNWAY)</div>
          <div style={{ fontSize: 34, fontFamily: 'var(--disp)', fontWeight: 700, margin: '6px 0 12px' }}>{data.runwayMonths ?? '—'} <span style={{ fontSize: 14, color: 'var(--dim)' }}>mois</span></div>
          <div className="rail" style={{ ['--c']: '#8e9a3c' }}><i style={{ width: Math.min(100, (data.runwayMonths || 0) / 18 * 100) + '%' }} /></div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--dim)', marginTop: 8 }}>Cible : 18 mois avant la holding parent</div>
        </>)
        : <Empty label="Finances non connectées · privé" note="Salaire / épargne → data/finance.json (gitignoré, jamais publié)." />}
    </Shell>
  )
}

/* ---- Brainstorm : flux d'idées ---- */
export function Brainstorm({ onClose }) {
  const { status, data } = useJSON('data/ideas.json')
  return (
    <Shell title="Brainstorm" color="#a78bfa" onClose={onClose}>
      {status === 'ok'
        ? data.map((it, i) => (
          <div key={i} style={{ ...card, borderLeft: '3px solid #a78bfa' }}>
            <div style={{ fontSize: 13 }}>{it.text}</div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--faint)', marginTop: 6 }}>{it.branch || 'libre'} · {it.date || ''}</div>
          </div>))
        : <Empty label="Aucune idée capturée" note="Flux brainstorm → data/ideas.json. Chaque idée rattachable à une branche." />}
    </Shell>
  )
}

/* ---- Apprentissage : chemin de compétences ---- */
export function Learning({ onClose }) {
  const { status, data } = useJSON('data/learning.json')
  return (
    <Shell title="Apprentissage" color="#5bc8ff" onClose={onClose}>
      {status === 'ok'
        ? data.map((s, i) => (
          <div key={i} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{s.skill}</span><span className="mono" style={{ color: 'var(--dim)' }}>{s.progress}%</span></div>
            <div className="rail" style={{ marginTop: 8, ['--c']: '#5bc8ff' }}><i style={{ width: s.progress + '%' }} /></div>
          </div>))
        : <Empty label="Parcours non connecté" note="Compétences (examen FFF, finance islamique…) → data/learning.json." />}
    </Shell>
  )
}

/* ---- Liens : lanceur d'apps (toujours actif) ---- */
const APPS = [
  ['Claude','https://claude.ai/new'],['Gmail','https://mail.google.com'],['Notion','https://notion.so'],
  ['Drive','https://drive.google.com'],['GitHub','https://github.com/mkwceo'],['X','https://x.com'],
  ['Instagram','https://instagram.com'],['YouTube','https://youtube.com'],['Netflix','https://netflix.com'],['Spotify','https://open.spotify.com'],
]
export function Links({ onClose }) {
  return (
    <Shell title="Liens · Stack" color="var(--gold)" onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {APPS.map(([n, u]) => (
          <a key={n} href={u} target="_blank" rel="noopener" style={{
            display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--bone)',
            border: '1px solid var(--line)', background: 'var(--panel)', padding: '11px 12px', borderRadius: 10 }}>
            <span className="mono" style={{ width: 26, height: 26, display: 'grid', placeItems: 'center', borderRadius: 7, fontSize: 12, fontWeight: 700, color: 'var(--gold)', background: 'rgba(194,162,78,.14)' }}>{n[0]}</span>
            <span style={{ fontSize: 12.5 }}>{n}</span>
          </a>))}
      </div>
    </Shell>
  )
}
