#!/usr/bin/env python3
"""Vérificateur de progression Maykenwil.

Lit learning/parcours.json, vérifie la preuve de chaque étape dans le repo,
calcule le pourcentage et écrit data/progression.json (affiché par le cockpit).

Usage :  python3 learning/check.py

Une étape n'est validée que si sa preuve existe RÉELLEMENT. Rien ne se déclare.
"""

import glob
import json
import os
import subprocess
import sys
from datetime import datetime, timezone

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARCOURS = os.path.join(RACINE, "learning", "parcours.json")
SORTIE = os.path.join(RACINE, "data", "progression.json")

INTERPRETEURS = {".py": ["python3"], ".js": ["node"], ".mjs": ["node"], ".sh": ["bash"]}


def resoudre(chemin):
    """Résout un chemin, avec joker éventuel (ex. learning/02_lire.*)."""
    absolu = os.path.join(RACINE, chemin)
    if "*" in chemin:
        trouves = sorted(g for g in glob.glob(absolu) if os.path.isfile(g))
        return trouves[0] if trouves else None
    return absolu if os.path.isfile(absolu) else None


def v_fichier(preuve):
    cible = resoudre(preuve["chemin"])
    if not cible:
        return False, "fichier absent"
    taille = os.path.getsize(cible)
    mini = preuve.get("min_octets", 1)
    if taille < mini:
        return False, f"trop court ({taille} o, il en faut {mini})"
    return True, f"{os.path.relpath(cible, RACINE)} — {taille} o"


def v_fichier_json(preuve):
    cible = resoudre(preuve["chemin"])
    if not cible:
        return False, "fichier absent"
    try:
        with open(cible, encoding="utf-8") as f:
            donnees = json.load(f)
    except json.JSONDecodeError as e:
        return False, f"JSON invalide ligne {e.lineno} : {e.msg}"

    if isinstance(donnees, dict):
        listes = [v for v in donnees.values() if isinstance(v, list)]
        donnees = listes[0] if listes else []
    if not isinstance(donnees, list):
        return False, "le fichier doit contenir une liste"

    mini = preuve.get("min_items", 1)
    if len(donnees) < mini:
        return False, f"{len(donnees)} entrée(s), il en faut {mini}"

    champs = preuve.get("champs_requis", [])
    for i, item in enumerate(donnees[:mini], 1):
        if not isinstance(item, dict):
            return False, f"entrée {i} : ce n'est pas un objet"
        manquants = [c for c in champs if not str(item.get(c, "")).strip()]
        if manquants:
            return False, f"entrée {i} : champ(s) vide(s) → {', '.join(manquants)}"
    return True, f"{len(donnees)} entrée(s) valides"


def v_script(preuve):
    cible = resoudre(preuve["chemin"])
    if not cible:
        return False, "script absent"
    ext = os.path.splitext(cible)[1]
    cmd = INTERPRETEURS.get(ext)
    if not cmd:
        return False, f"extension non gérée ({ext})"
    try:
        r = subprocess.run(
            cmd + [cible], cwd=RACINE, capture_output=True, text=True, timeout=20
        )
    except subprocess.TimeoutExpired:
        return False, "le script tourne toujours après 20 s (boucle infinie ?)"
    except FileNotFoundError:
        return False, f"{cmd[0]} introuvable sur cette machine"

    if r.returncode != 0:
        derniere = (r.stderr or "").strip().splitlines()
        detail = derniere[-1][:140] if derniere else f"code de sortie {r.returncode}"
        return False, f"le script plante → {detail}"

    lignes = [l for l in (r.stdout or "").splitlines() if l.strip()]
    mini = preuve.get("min_lignes_sortie", 0)
    if len(lignes) < mini:
        return False, f"{len(lignes)} ligne(s) affichée(s), il en faut {mini}"
    return True, f"tourne — {len(lignes)} ligne(s) affichée(s)"


def v_declaratif(preuve):
    ok, detail = v_fichier(preuve)
    return ok, (detail + " (déclaratif)" if ok else detail)


VERIFS = {
    "fichier": v_fichier,
    "fichier_json": v_fichier_json,
    "script": v_script,
    "declaratif": v_declaratif,
}


def main():
    with open(PARCOURS, encoding="utf-8") as f:
        parcours = json.load(f)

    etapes, acquis, total = [], 0, 0
    for etape in parcours["etapes"]:
        preuve = etape["preuve"]
        verif = VERIFS.get(preuve["type"])
        if verif is None:
            valide, detail = False, f"type de preuve inconnu : {preuve['type']}"
        else:
            valide, detail = verif(preuve)

        total += etape["poids"]
        if valide:
            acquis += etape["poids"]

        etapes.append(
            {
                "id": etape["id"],
                "titre": etape["titre"],
                "tu_construis": etape["tu_construis"],
                "competence": etape["competence"],
                "pourquoi": etape["pourquoi"],
                "poids": etape["poids"],
                "valide": valide,
                "detail": detail,
                "preuve_attendue": preuve["chemin"],
                "declaratif": preuve["type"] == "declaratif",
            }
        )

    pourcentage = round(acquis * 100 / total) if total else 0
    restantes = [e for e in etapes if not e["valide"]]
    prochaine = restantes[0] if restantes else None

    progression = {
        "genere_le": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "pourcentage": pourcentage,
        "poids_acquis": acquis,
        "poids_total": total,
        "etapes_validees": len(etapes) - len(restantes),
        "etapes_total": len(etapes),
        "regle": parcours["regle"],
        "prochaine_etape": prochaine,
        "palier_suivant": (pourcentage + prochaine["poids"]) if prochaine else 100,
        "etapes": etapes,
    }

    os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
    with open(SORTIE, "w", encoding="utf-8") as f:
        json.dump(progression, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"\n  Progression Maykenwil : {pourcentage}%"
          f"  ({len(etapes) - len(restantes)}/{len(etapes)} étapes)\n")
    for e in etapes:
        marque = "✔" if e["valide"] else "·"
        print(f"  {marque} [{e['poids']:>2}%] {e['titre']}")
        print(f"      {e['detail']}")
    if prochaine:
        print(f"\n  → Prochaine étape : {prochaine['titre']}")
        print(f"    Tu construis : {prochaine['tu_construis']}")
        print(f"    Preuve attendue : {prochaine['preuve_attendue']}")
        print(f"    Elle te fait passer à {progression['palier_suivant']}%.\n")
    else:
        print("\n  Parcours terminé.\n")

    print(f"  Écrit → {os.path.relpath(SORTIE, RACINE)}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
