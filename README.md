# Tournoi de Douéra / بطولة دويرة

Site web bilingue (français / arabe) pour le tournoi de football de rue de Douéra : équipes, groupes, calendrier, résultats, classements et statistiques, avec une interface d'administration pour gérer le contenu.

## Structure du projet

- `server/` — API Express (Node.js, ESM) avec stockage de données dans des fichiers JSON (`server/data/`)
- `client/` — Application React (Vite) avec Tailwind CSS, i18next pour le FR/AR

## Démarrage — API (server)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

L'API est disponible sur `http://localhost:4000`.

### Identifiants admin par défaut

- Utilisateur : `admin`
- Mot de passe : `douera2026`

Pour changer le mot de passe, générez un nouveau hash et mettez à jour `server/data/admin.json` :

```bash
cd server
npm run hash-password -- "nouveau_mot_de_passe"
```

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

## Pages principales

- Accueil, Équipes, Détail équipe, Classements, Matchs, Statistiques (FR/AR)
- `/admin/login` — connexion administrateur
- `/admin` — tableau de bord (équipes, matchs, groupes, actualités, paramètres)
