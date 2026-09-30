
# -gestion-soutenance
Application web de gestion des soutenances
=======
# Interface de Login — EMIT (Front seul)

Ce paquet contient **uniquement** le code front-end de l'interface de connexion
(extrait du projet `GestionSoutenance-App/emit-login`). Il ne contient ni le
back-end, ni les tableaux de bord (Évaluateur / Informatique), ni la gestion
des salles/thèmes/soutenances.

## Contenu
- `src/App.jsx` — page qui affiche le formulaire de connexion et le
  formulaire d'inscription évaluateur (allégé, sans les dashboards)
- `src/components/LoginForm.jsx` — formulaire de connexion (email + code)
- `src/components/EvaluateurAuth.jsx` — inscription "Espace Évaluateur"
- `src/services/authApi.js` — appels vers `/api/auth/login` et `/api/auth/register`
- `src/App.css`, `src/index.css` — styles
- `src/assets/` — logos EMIT et Université de Fianarantsoa

## Lancer le projet

```bash
npm install
npm run dev
```

L'app se connecte par défaut à `http://localhost:5000` (voir `.env`,
variable `VITE_API_URL`) — adaptez cette valeur si votre back-end tourne
ailleurs.

## Identifiants de test (côté back-end)
- Email : `Info@gmail.com`
- Code d'accès : `INFORMATIQUE`
