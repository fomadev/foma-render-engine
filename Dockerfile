# Utilisation de Node 22 (ta version locale) sur Alpine pour la légèreté
FROM node:22-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installation propre
RUN npm install

# Copier le reste du code
COPY . .

# Compiler le projet
RUN npm run build

# Par défaut, on lance les tests pour vérifier que le moteur est stable
CMD ["npm", "run", "test"]