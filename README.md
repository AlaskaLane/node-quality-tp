# node-quality-tp

Mini-projet Node.js/Express pour apprendre à industrialiser un code API REST avec qualité logicielle, tests automatiques et CI/CD.

## Démarrage rapide

```bash
npm install
npm run dev
```

## Scripts disponibles

```bash
npm run lint
npm run lint:fix
npm run format
npm run test
npm run test:cov
```

## API

- GET `/health` : vérifie le statut du service
- GET `/todos` : retourne la liste des tâches
- POST `/todos` : ajoute une tâche
- DELETE `/todos/:id` : supprime une tâche

## Qualité

Le projet est préparé pour les outils suivants :

- ESLint
- Prettier
- Jest + Supertest
- SonarQube
- GitHub Actions
