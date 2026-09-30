// Point d'entrée unique vers l'API du back-end existant
// (Routes/authRoutes.js -> POST /api/auth/login, POST /api/auth/register)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Connexion.
 * Le back-end (Controllers/authController.js) attend exactement
 * { email, mot_de_passe } et renvoie { message, token, utilisateur }
 * où utilisateur = { id_utilisateur, nom, email, role, parcours }.
 *
 * Dans notre formulaire, le champ affiché "Code d'accès" EST le mot de passe
 * du compte (ex: Info@gmail.com / INFORMATIQUE) : on ne renomme rien côté
 * back, on adapte juste le nom du champ envoyé.
 */
export async function login(email, codeAcces) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, mot_de_passe: codeAcces }),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // réponse vide / non-JSON (ex: serveur injoignable côté proxy)
  }

  if (!res.ok) {
    const message =
      data?.message ||
      (res.status === 0
        ? "Impossible de contacter le serveur."
        : `Erreur ${res.status}`)
    throw new Error(message)
  }

  return data // { message, token, utilisateur }
}

/**
 * Inscription (pour le moment utilisée par l'espace "Évaluateur").
 * Le back-end (Controllers/authController.js) attend
 * { nom, email, mot_de_passe, parcours } et fixe le rôle à "evaluateur".
 */
export async function register({ nom, email, mot_de_passe, parcours }) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, email, mot_de_passe, parcours, role: 'evaluateur' }),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // réponse vide / non-JSON
  }

  if (!res.ok) {
    throw new Error(data?.message || `Erreur ${res.status}`)
  }

  return data // { message, utilisateur }
}

/** Récupère le profil de l'utilisateur connecté ("Mon compte"). */
export async function getMonCompte(token) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || `Erreur ${res.status}`)
  }

  return data.utilisateur
}

/** Met à jour nom / email / parcours de l'utilisateur connecté ("Mon compte"). */
export async function updateMonCompte(token, { nom, email, parcours }) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nom, email, parcours }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || `Erreur ${res.status}`)
  }

  return data.utilisateur
}

export function saveSession(token, utilisateur) {
  localStorage.setItem('emit_token', token)
  localStorage.setItem('emit_utilisateur', JSON.stringify(utilisateur))
}

export function getSession() {
  const token = localStorage.getItem('emit_token')
  const raw = localStorage.getItem('emit_utilisateur')
  if (!token || !raw) return null
  try {
    return { token, utilisateur: JSON.parse(raw) }
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem('emit_token')
  localStorage.removeItem('emit_utilisateur')
}

/** Normalise "Informatique", "INFO", "informatique " ... -> true/false */
export function estParcoursInformatique(parcours) {
  if (!parcours) return false
  const p = parcours.trim().toUpperCase()
  return p === 'INFORMATIQUE' || p === 'INFO'
}

/** true si le compte connecté est un compte évaluateur. */
export function estEvaluateur(role) {
  if (!role) return false
  return role.trim().toLowerCase() === 'evaluateur'
}
