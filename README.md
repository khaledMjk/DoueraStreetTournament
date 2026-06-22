# Tournoi de Douéra / بطولة دويرة

Site web bilingue (français / arabe) pour le tournoi de football de rue de Douéra : équipes, groupes, calendrier, résultats, classements et statistiques. Le site est en lecture seule — les données sont mises à jour à la main dans les fichiers JSON.

## Structure du projet

- `server/` — API Express (Node.js, ESM) en lecture seule, données stockées dans des fichiers JSON (`server/data/`)
- `client/` — Application React (Vite) avec Tailwind CSS, i18next pour le FR/AR

## Mise à jour des données

Toutes les données (équipes, matchs, scores, groupes, actualités, paramètres) se modifient directement dans `server/data/*.json`. Il n'y a pas d'interface d'administration ; pour publier les changements, voir la section « Déploiement ».

## Démarrage — API (server)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

L'API (lecture seule) est disponible sur `http://localhost:4000`.

## Démarrage — Client (frontend)

```bash
cd client
npm install
npm run dev
```

Le site est disponible sur `http://localhost:5173` (les requêtes `/api` sont redirigées vers l'API sur le port 4000).

## Build de production

```bash
cd client
npm run build
```

Les fichiers générés (`client/dist`) sont servis automatiquement par l'API Express (`server/server.js`) en production.

## Déploiement (GitHub Pages)

Le site public est déployé sur GitHub Pages par `.github/workflows/deploy-pages.yml`. Le workflow exporte les données de `server/data/` en JSON statique (`server/scripts/export-static.mjs`) puis construit le client. **Le déploiement n'est autorisé que depuis la branche `main`** : pour mettre le site à jour, fusionnez vos changements dans `main` et poussez.

Site en ligne : https://khaledmjk.github.io/DoueraStreetTournament/

## Pages principales

- Accueil, Équipes, Détail équipe, Classements, Matchs, Statistiques (FR/AR)
