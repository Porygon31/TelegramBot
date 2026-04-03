# Utilise une image Node.js moderne compatible avec node:sqlite.
FROM node:24-bookworm-slim AS build

# Définit le dossier de travail pour la compilation.
WORKDIR /app

# Copie les manifestes afin de tirer parti du cache Docker.
COPY package*.json ./

# Installe toutes les dépendances nécessaires à la compilation.
RUN npm ci

# Copie les fichiers de configuration et le code source.
COPY tsconfig.json ./
COPY src ./src

# Compile l'application TypeScript.
RUN npm run build

# Prépare l'image d'exécution plus légère.
FROM node:24-bookworm-slim AS runtime

# Définit les variables de contexte de production.
ENV NODE_ENV=production
WORKDIR /app

# Copie les manifestes puis installe uniquement les dépendances runtime.
COPY package*.json ./
RUN npm ci --omit=dev

# Copie le build généré depuis l'étape précédente.
COPY --from=build /app/dist ./dist

# Prépare les dossiers utilisés par la base SQLite et les uploads.
RUN mkdir -p /app/data /app/uploads

# Expose le port HTTP utilisé par l'application.
EXPOSE 8080

# Démarre l'application compilée.
CMD ["npm", "start"]
