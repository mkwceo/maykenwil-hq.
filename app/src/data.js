import { useState, useEffect } from 'react'

const BASE = import.meta.env.BASE_URL

/* Lit un JSON dans /public/data. États : loading | ok | empty | missing.
   "missing" = fichier absent → on affiche « non connecté » (jamais de fausse donnée). */
export function useJSON(path) {
  const [state, setState] = useState({ status: 'loading', data: null })
  useEffect(() => {
    let alive = true
    fetch(BASE + path, { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error('404'); return r.json() })
      .then(d => {
        if (!alive) return
        const empty = Array.isArray(d) ? d.length === 0 : (!d || d.empty === true)
        setState({ status: empty ? 'empty' : 'ok', data: d })
      })
      .catch(() => alive && setState({ status: 'missing', data: null }))
    return () => { alive = false }
  }, [path])
  return state
}
