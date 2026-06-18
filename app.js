/* ============================================================
   MKW — Command Center · logique des panneaux + horloge
   Contenu éditable : l'objet `panels` ci-dessous.
   ============================================================ */

const panels = {
  singapore: {
    flag: '🇸🇬', city: 'Singapour', title: 'MKW Holding HQ',
    desc: "Le siège social mondial de Maykenwil Holding. Choisi pour sa fiscalité optimale, sa stabilité juridique et son accès aux marchés MENA et Asie-Pacifique. Tout le flux financier de la holding transite par ici. Gouvernance 100% Halal — zéro Riba, zéro dette conventionnelle.",
    sections: [
      { title: 'Rôle', items: ['Hub financier central de la holding', 'Siège social légal de toutes les sous-branches', 'Contrôle du flux circulaire entre les 6 branches', 'Véhicules : Murabaha, Ijara, Moucharaka'] },
      { title: 'Pourquoi Singapour', items: ['Fiscalité optimale — impôt sur sociétés 17%', 'Neutralité géopolitique et stabilité juridique', 'Accès direct aux marchés MENA et APAC', 'Infrastructure fintech compatible finance islamique'] }
    ],
    badges: ['badge-gold', 'badge-gold'], badgeLabels: ['⬡ HEADQUARTERS', '∞ HALAL COMPLIANT']
  },
  marseille: {
    flag: '🇫🇷', city: 'Marseille · PACA', title: 'Base Opérationnelle Phase 1',
    desc: "Point de départ de l'empire. Retour de Samy en août 2026. C'est ici que tout commence : les premiers événements Jadeliane, le recrutement de joueurs NV15, le développement du réseau institutionnel PACA. Conquérir Marseille avant de conquérir le monde.",
    sections: [
      { title: 'Opérations actives', items: ['Jadeliane Events — événements PACA, réseau élus locaux', 'MKW Sport — premiers contrats joueurs, examen FFF mai 2027', 'MKW Beauté — salon sœur, 2-3 zones Marseille', 'Réseau clé : ami proche avec accès institutionnel PACA'] },
      { title: 'Objectif Phase 1', items: ['Générer les premiers revenus 0 → 500K€', 'Légitimité locale construite', 'Tous les frères et sœurs intégrés dans leurs branches'] }
    ],
    badges: ['badge-purple', 'badge-blue'], badgeLabels: ['▶ PHASE 1 ACTIF', '⚽ FFF MAI 2027']
  },
  europe: {
    flag: '🇫🇷🇬🇧', city: 'Paris / Londres', title: 'MKW Sport — Europe Hub',
    desc: "Le centre névralgique de l'agence de football NV15. L'Europe est là où se jouent la Champions League, les meilleurs transferts, les joueurs les plus bankables. Ce bureau gère les opérations sport au quotidien — distinct du siège financier à Singapour.",
    sections: [
      { title: 'Activités', items: ['Représentation de joueurs professionnels', "Formation interne d'agents et d'analystes vidéo", 'Scouting : FC Midtjylland, Sporting Braga, Genk, Vitória SC', 'Suivi data et performance des joueurs du portefeuille'] },
      { title: 'Modèle de rétention unique', items: ['Les collaborateurs sont formés par la holding', 'Accès au portefeuille joueurs MKW pour démarrer', "S'ils partent : renoncent au portefeuille, gardent les outils", "Accord de non-agression permanent — jamais d'ennemis"] }
    ],
    badges: ['badge-blue', 'badge-gold'], badgeLabels: ['⚽ NV15 · NORTH VISTA 15', '◑ MORE THAN KINGS WIN']
  },
  usa: {
    flag: '🇺🇸', city: 'États-Unis', title: 'Events — Expansion Future',
    desc: "La destination finale de Jadeliane Events. L'Amérique représente le plus grand marché événementiel au monde. Mais d'abord, on conquiert Marseille, puis la France, puis l'Europe. Les USA arrivent quand les fondations sont solides.",
    sections: [
      { title: 'Chemin vers les USA', items: ['Phase 1 : Conquérir Marseille et PACA', 'Phase 2 : Expansion France — Lyon, Paris, Nice', 'Phase 3 : Présence Europe + premiers contacts US', 'Phase 4 : Bureau opérationnel New York / Miami'] },
      { title: 'Avantages USA', items: ['Marché événementiel le plus grand au monde', 'Clientèle anglophone — Samy bilingue', 'Connexions via réseau international MENA', 'Revenus en USD — force de change pour la holding'] }
    ],
    badges: ['badge-green', 'badge-green'], badgeLabels: ['◌ PHASE 3+', '◌ VISION LONG TERME']
  },
  mena: {
    flag: '🇦🇪', city: 'Dubaï · MENA', title: 'Capital & Expansion MENA',
    desc: "La région MENA (Moyen-Orient et Afrique du Nord) est stratégique pour la finance islamique et l'expansion événementielle. Dubaï comme hub secondaire, complémentaire à Singapour.",
    sections: [
      { title: 'Rôle MENA', items: ["Accès aux fonds d'investissement Halal de la région", 'Réseau clientèle HNWI pour Jadeliane Events', "Développement North Vision dans les pays d'origine", 'Connexion avec les ligues de football africaines et arabes'] }
    ],
    badges: ['badge-green', 'badge-gold'], badgeLabels: ['◌ PHASE 3', '∞ FINANCE ISLAMIQUE']
  },
  sport: {
    flag: '⚽', city: 'MKW Sport · NV15', title: 'North Vista 15',
    desc: "L'agence football de Maykenwil. NV15 (North Vista 15) est une agence d'un nouveau genre — pas seulement de la représentation, mais un écosystème complet : formation, data, scouting, et un modèle de rétention des talents unique.",
    sections: [
      { title: 'Services', items: ['Représentation de joueurs professionnels', "Recrutement et formation d'agents internes", "Équipe d'analyse vidéo et data scouting", 'Négociation de contrats et transferts'] },
      { title: 'Modèle économique unique', items: ['CDI avec clause de loyauté patrimoniale', 'Agents formés → accès portefeuille MKW joueurs', 'Départ = renonciation au portefeuille, pas aux outils', 'Accord de non-agression permanent avec les partants'] },
      { title: 'Priorités 2026-2027', items: ['Retour Marseille août 2026', 'Examen FFF agent : mai 2027', 'Premiers 3-5 joueurs signés', 'Bureau Paris ou Londres opérationnel'] }
    ],
    badges: ['badge-blue', 'badge-blue'], badgeLabels: ['● PHASE 1 ACTIF', '⚽ FFF MAI 2027']
  },
  events: {
    flag: '🎭', city: 'Jadeliane Events', title: 'Événementiel PACA',
    desc: "La branche événementielle de Maykenwil. Jadeliane Events cible d'abord Marseille et la région PACA, avec un accès unique aux élus locaux et personnalités institutionnelles via un réseau clé déjà en place.",
    sections: [
      { title: 'Offre', items: ['Événements privés haut de gamme', 'Événements institutionnels et publics', 'Conventions, galas, soirées VIP', 'Production complète : traiteur, décor, logistique'] },
      { title: 'Réseau clé PACA', items: ['Ami proche avec accès aux élus locaux', 'Connexions personnalités publiques PACA', 'Mère : directrice nominale, polyvalente, exécutante née', 'Capacité de scaling vers Lyon, Nice, Paris dès Phase 2'] }
    ],
    badges: ['badge-purple', 'badge-purple'], badgeLabels: ['● PHASE 1 ACTIF', '◑ EXPANSION FRANCE P2']
  },
  beaute: {
    flag: '💎', city: 'MKW Beauté', title: 'Franchise Esthétique',
    desc: "La branche beauté, portée par la sœur de Samy — déjà opérationnelle avec son propre salon. La vision : construire une vraie marque esthétique, conquérir Marseille zone par zone, puis lancer une franchise nationale.",
    sections: [
      { title: 'Roadmap', items: ['Phase 1 : Salon existant sœur, SASU/micro-entreprise maintenant', 'Phase 1-2 : Conquête 2-3 zones de Marseille', 'Phase 2 : Génération capital → investissement franchise', 'Phase 2-3 : Création de la marque propre MKW Beauté'] },
      { title: 'Vision franchise', items: ['Modèle inspiré des grandes marques cosmétiques', 'Plusieurs salons en simultané sous la même marque', 'Marque propre développée après 5 ans de terrain', 'Extension nationale puis internationale'] }
    ],
    badges: ['badge-pink', 'badge-pink'], badgeLabels: ['◑ PHASE 2', '◌ FRANCHISE VISION']
  },
  logistique: {
    flag: '🚛', city: 'MKW Logistique', title: 'Transport & Supply Chain',
    desc: "La branche portée par le père — des capacités énormes que la famille a toujours sous-estimées. 53 ans, en excellente santé, permis poids lourds et multiples. MKW Logistique lui donne la reconnaissance qu'il mérite.",
    sections: [
      { title: 'Atouts du père', items: ['Permis poids lourds et multiples spécialisés', 'Expérience terrain comme chauffeur-livreur', 'Rigueur de travail, santé et endurance à 53 ans', 'Réseau de contacts dans le secteur transport'] },
      { title: 'Structure', items: ['Père comme directeur nominal — sa branche lui appartient', 'Démarrage progressif, financé par Sport + Beauté', 'SASU/micro-entreprise recommandée dès maintenant', 'Scaling avec des chauffeurs et partenaires en Phase 2'] }
    ],
    badges: ['badge-teal', 'badge-teal'], badgeLabels: ['◑ PHASE 2', '◌ STRUCTURE PÈRE']
  },
  capital: {
    flag: '⬡', city: 'MKW Capital', title: 'Bras Financier Halal',
    desc: "Le moteur d'investissement de la holding. Zéro Riba, zéro dette conventionnelle. Chaque euro investi par MKW Capital suit les principes de la finance islamique. Ce n'est pas une contrainte — c'est une force.",
    sections: [
      { title: 'Véhicules Halal', items: ['Murabaha — achat-revente avec marge fixe', 'Ijara — leasing islamique sans intérêt', 'Moucharaka — participation en capital', 'Sukuk — obligations islamiques'] },
      { title: 'Rôle dans la holding', items: ['Réinvestissement des profits de toutes les branches', 'Financement des acquisitions stratégiques', 'Fonds propre Maykenwil à horizon 10-15 ans', "Objectif final : financer l'acquisition OM"] }
    ],
    badges: ['badge-gold', 'badge-gold'], badgeLabels: ['◌ PHASE 3', '∞ ZÉRO RIBA']
  },
  nvd: {
    flag: '🌍', city: 'North Vision Development', title: 'Impact Social',
    desc: "La branche qui boucle le cercle. North Vision Development réinvestit dans les territoires qui ont formé Samy — les quartiers nord. Ce n'est pas de la philanthropie, c'est du réinvestissement humain.",
    sections: [
      { title: 'Mission', items: ['Formation de jeunes talents des quartiers nord', 'Développement communautaire Marseille', 'Soutien aux projets sportifs locaux', 'Connexion avec MKW Sport pour détecter les talents'] },
      { title: 'Activation', items: ['Active en Phase 2-3, financée par les profits', 'Partenariats avec collectivités locales', 'Vision : institution sociale Maykenwil reconnue', 'Outil de légitimité et de marque territoriale'] }
    ],
    badges: ['badge-green', 'badge-green'], badgeLabels: ['◌ PHASE 3', '◌ IMPACT LOCAL']
  }
};

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function openPanel(key) {
  const data = panels[key];
  if (!data) return;

  let html = `
    <div class="panel-flag">${data.flag}</div>
    <div class="panel-city">${esc(data.city)}</div>
    <div class="panel-title">${esc(data.title)}</div>
    <div class="panel-desc">${esc(data.desc)}</div>
  `;

  data.sections.forEach(section => {
    html += `
      <div class="panel-divider"></div>
      <div class="panel-section-title">${esc(section.title)}</div>
      <div class="panel-items">
        ${section.items.map(item => `
          <div class="panel-item">
            <div class="panel-item-dot" style="background:var(--gold)"></div>
            <span>${esc(item)}</span>
          </div>`).join('')}
      </div>`;
  });

  if (data.badges && data.badges.length) {
    html += `<div class="panel-badges">`;
    data.badges.forEach((badge, i) => {
      html += `<div class="b-badge ${esc(badge)}">${esc(data.badgeLabels[i])}</div>`;
    });
    html += `</div>`;
  }

  document.getElementById('panelContent').innerHTML = html;
  document.getElementById('panelOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel(e) {
  if (e.target === document.getElementById('panelOverlay')) closePanelDirect();
}
function closePanelDirect() {
  document.getElementById('panelOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
window.openPanel = openPanel;
window.closePanel = closePanel;
window.closePanelDirect = closePanelDirect;

document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanelDirect(); });

/* horloge live */
function tickClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
tickClock();
setInterval(tickClock, 1000);

/* animation des barres de phase au chargement */
requestAnimationFrame(() => {
  document.querySelectorAll('.phase-bar').forEach(bar => {
    if (bar.dataset.w) bar.style.width = bar.dataset.w;
  });
});
