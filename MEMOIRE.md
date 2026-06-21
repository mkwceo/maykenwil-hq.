# MEMOIRE.md — Contexte Maykenwil pour Claude Code

> **À lire au début de chaque session.** Ce fichier évite à Samy de recoller son contexte.
> ⚠️ Repo **public** : ici **uniquement** le contexte projet non sensible. Les données
> personnelles, identifiants (Notion/Drive), finances et routine **ne doivent jamais**
> être écrits dans ce fichier ni commités (voir `.gitignore`).

---

## 1. Qui
- **Samy Zertit** (alias Razeen), fondateur de **Maykenwil Holding**.
- Holding familial multi-branches, vision **40 ans**, jalon ultime : propriété de l'**OM**.
- Bascule exécution réelle : **retour à Marseille — Août 2026**. Examen agent **FFF/FIFA — Mai 2027**.
- Phase globale actuelle : **Phase 0 — Préparation**. Score GO/NO-GO : **61/100** (GO conditionnel).

## 2. Les 6 branches
| Branche | Entité | Statut | Avancement |
|---|---|---|---|
| **Sport** (pivot) | North Vision 15 (NV15) — agence d'agents FIFA, joueurs 18-23 | Active | 28 % |
| **Events** | Jadeliane Events (PACA) | Actif | 45 % |
| **North Vision Development** | NV15 (terrain) | Planification | 18 % |
| **Capital** | Finance 100 % halal (zéro riba — Mourabaha / Musharaka / Sukuk) | Planification | 12 % |
| **Beauté** | Franchise esthétique | Dormant | 0 % |
| **Logistique** | Transport & supply chain | Dormant | 0 % |
- Slogan Sport : « More Than Kings Win ».

## 3. Principes (constitution — à faire respecter)
- **Anti-dispersion** : maximum **2 priorités actives** à la fois.
- **Anti-vide** (audit récurrent validé par Samy) : *« je construis des infrastructures
  impressionnantes mais vides plus vite que je ne les remplis »* → ne pas empiler de l'infra,
  remplir de réel. Pas de fausses données : un état non connecté s'affiche « à connecter ».
- **Silent founder** : exécuter d'abord, laisser les résultats parler.
- **Halal-only** : conformité finance islamique comme principe de design, pas un patch.
- Faiblesse n°1 du GO/NO-GO : **zéro revenu consolidé**, branches dormantes — c'est là que se joue la progression, pas dans le design.

## 4. Maykenwil OS — état actuel (déjà construit, en ligne)
Site statique **PWA** déployé sur **GitHub Pages**. Single-file `index.html`. Vues réelles
via nav latérale :
- **Accueil** : KPIs, hero **3D** (Three.js : cœur + 6 branches en orbite, cliquables), priorités, en cours.
- **Branches** : grille des 6 → panneau détail.
- **Agence IA** : **217 agents** (16 départements, recherche) — depuis `agents.json`.
- **Cowork** : **top 10 agents réels** + Daily Brief + bannière anti-dispersion. Bouton
  « Lancer » = copie une invocation prête à coller dans Claude Code. 3 garde-fous
  (Chief of Staff, Senior Project Manager, Business Strategist).
- **Connecteurs** : centre de contrôle (connecteurs IA + launchpad apps).
- **Calendrier** : agenda **privé** (PIN + localStorage), données jamais publiées.

## 5. Conventions techniques (pour Claude Code)
- **Branche de dev** : `claude/behance-project-review-dfnm4k`. Ne jamais pousser ailleurs sans accord.
- **Déploiement** : Pages déploie depuis `main` uniquement. Workflow : développer sur la branche
  feature → merger dans `main` (`-X theirs`) → push `main`. Le service worker (`sw.js`) se
  purge et recharge seul ; bump la constante `C` à chaque déploiement.
- **Vérification avant déploiement** : screenshots headless Playwright + capture des
  erreurs JS. Serveur local `python3 -m http.server`. **Toujours vérifier avant de livrer.**
- **Three.js** : vendoré en local (`three.module.min.js`) + importmap. Respecter
  `prefers-reduced-motion`, pause hors-onglet.
- **Confidentialité** : `data/calendar.json`, `app/public/data/health.json`,
  `app/public/data/finance.json` sont **gitignorés**. Données perso = appareil de Samy
  uniquement (mode privé). **Ne jamais** commiter de données perso ou d'identifiants.
- **Agents** : 217 agents The Agency installés dans `.claude/agents/the-agency` + `agents.json`.
- **Esthétique** : verre chaud relevé (beige) + hero cinématique sombre, serif display
  (Newsreader), accents or, grain. Niveau visé : Awwwards / premium.
- **Fichiers clés** : `index.html` (le produit), `agents.json`, `sw.js`, `manifest.webmanifest`,
  `three.module.min.js`.

## 6. Priorités actuelles & rythme
- **Priorité 1** : préparation examen **FFF** (Mai 2027) — 1 bloc révision/jour.
- **Priorité 2** : **premier revenu** (emploi Marseille / une branche) — 1 action/semaine.
- **Boucles quotidiennes** : matin → Cowork « Chief of Staff » (brief) ; soir → « Executive Summary » (rapport).
- **Cap du moment** : arrêter de reconstruire, faire tourner les boucles, remplir de réel.

## 7. Style de collaboration attendu
Claude agit comme **second cerveau** : mémoire, garde-fou anti-dispersion, designer du
dashboard, orchestrateur d'agents. Sincère et pragmatique. Vérifier son travail avant de
livrer. Scoper les demandes floues plutôt que tout reconstruire.

---
*Mettre à jour ce fichier quand une décision structurante change (phase, branche, conventions).*
