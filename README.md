# Telegram Mini App Manager

Ce projet met en place un bot Telegram avec :

- une mini app web premium pour afficher le menu disponible ;
- une galerie videos / photos ;
- une section tarifs ;
- un panel d'administration protege ;
- une base SQLite locale ;
- un systeme d'upload direct pour les medias ;
- des contenus publiables, triables et "featured".

## Lancement

1. Installez les dépendances :

```bash
npm install
```

2. Copiez `.env.example` vers `.env` puis renseignez vos valeurs.

3. Démarrez le projet en développement :

```bash
npm run dev
```

4. Exposez votre serveur avec une URL HTTPS publique, puis renseignez `PUBLIC_BASE_URL`.

## Commandes Telegram

- `/start` : affiche l'accueil et les accès principaux ;
- `/menu` : affiche le menu disponible ;
- `/photos` : affiche les médias ;
- `/tarifs` : affiche les tarifs ;
- `/contact` : affiche les liens de contact ;
- `/admin` : envoie le lien du panel aux administrateurs déclarés.

## URLs utiles

- Mini app : `/app`
- Connexion admin : `/admin/login`
- Panel admin : `/admin`
- Uploads publics : `/uploads/<fichier>`
- Healthcheck : `/health`

## Mise en production

Cette application est mieux adaptee a une plateforme qui supporte :

- un processus Node.js long vivant ;
- un stockage persistant pour SQLite ;
- un stockage persistant pour les uploads ;
- une URL publique HTTPS.

### Docker

Le projet contient maintenant un `Dockerfile`. Vous pouvez donc le deployer comme service Docker sur une plateforme de votre choix.

### Railway

Le projet contient aussi un `railway.json` pret pour Railway.

Configuration incluse :

- build via `Dockerfile`
- healthcheck sur `/health`
- `numReplicas` a `1`
- restart policy sur `ALWAYS`

### Exemple de chemins persistants

Si votre hebergeur monte un volume sur `/data`, vous pouvez utiliser :

- `DATABASE_FILE_PATH=/data/telegram-premium.sqlite`
- `DATA_FILE_PATH=/data/content.json`
- `UPLOADS_DIRECTORY_PATH=/data/uploads`

Si votre hebergeur monte un disque ailleurs, adaptez ces trois variables pour qu'elles pointent toutes dans le meme espace persistant.

### Variables Railway conseillees

Si vous utilisez un volume Railway monte sur `/data`, configurez :

- `BOT_TOKEN`
- `PUBLIC_BASE_URL`
- `PORT=3000`
- `SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_IDS`
- `DATABASE_FILE_PATH=/data/telegram-premium.sqlite`
- `DATA_FILE_PATH=/data/content.json`
- `UPLOADS_DIRECTORY_PATH=/data/uploads`
- `MAX_UPLOAD_SIZE_MB=25`

## Remarque

Le stockage principal repose maintenant sur SQLite via `node:sqlite`. Au premier demarrage, si `DATA_FILE_PATH` existe encore, le contenu legacy JSON est migre automatiquement vers `DATABASE_FILE_PATH`.
