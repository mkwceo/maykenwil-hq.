# Maykenwil HQ

Dashboard de pilotage de **Maykenwil Holding** — design inspiré de l'esthétique
« Notis+ » (sidebar gauche, cards arrondies, palette neutre + accents colorés par
branche, typographie clean, vue d'ensemble + sections détaillées).

Site **100 % statique** (HTML / CSS / JS), sans build. Tout le contenu est dans
`data.json` : tu modifies les données sans jamais toucher au design.

## Structure

| Fichier        | Rôle                                                        |
| -------------- | ----------------------------------------------------------- |
| `index.html`   | Squelette de la page (sidebar + zone principale).           |
| `styles.css`   | Tout le design (palette, cards, animations, responsive).    |
| `app.js`       | Logique : charge `data.json` et génère les vues.            |
| `data.json`    | **Contenu éditable** : branches, score, phase, forces…      |

## Modifier le contenu

Édite **`data.json`** uniquement. Exemples :

- Changer le score GO / NO-GO → `overview.score`.
- Mettre à jour la phase → `overview.phase` / `overview.phaseNote`.
- Ajouter un point clé à une branche → ajoute une ligne dans son tableau `highlights`.
- Changer la couleur d'une branche → champ `accent` (code hex, ex. `"#10b981"`).

Chaque branche : `id`, `name`, `accent`, `icon`, `tagline` (optionnel), `summary`,
`status`, `highlights[]`. Recharge la page pour voir les changements.

## Lancer en local

`fetch` exige un serveur (l'ouverture directe du fichier ne fonctionne pas) :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Mise en ligne (GitHub Pages)

Le workflow `.github/workflows/deploy.yml` publie automatiquement le site à chaque
push. **Étape unique à faire une fois** : dans le dépôt GitHub →
*Settings → Pages → Build and deployment → Source* = **GitHub Actions**.

L'URL publique apparaît ensuite dans l'onglet *Actions* / *Settings → Pages*.
