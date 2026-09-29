import { useState } from 'react'
import { register, login, saveSession } from '../services/authApi'

const PARCOURS = [
  { value: 'INFORMATIQUE', label: 'Informatique' },
  { value: 'MANAGEMENT', label: 'Management' },
  { value: 'ICM', label: 'ICM' },
]

const CHAMPS_VIDES = {
  nom: '',
  email: '',
  mot_de_passe: '',
  parcours: '',
}

export default function EvaluateurAuth({ onInscriptionReussie, onRetour }) {
  const [form, setForm] = useState(CHAMPS_VIDES)
  const [status, setStatus] = useState(null) // null | 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')

    const { nom, email, mot_de_passe, parcours } = form
    if (!nom || !email || !mot_de_passe || !parcours) {
      setStatus('error')
      setErrorMsg('Tous les champs sont obligatoires.')
      return
    }

    setStatus('loading')

    try {
      await register({ nom, email, mot_de_passe, parcours })

      // Une fois le compte créé, on connecte directement l'évaluateur
      // pour qu'il entre dans son interface sans ressaisir ses identifiants.
      const data = await login(email, mot_de_passe)
      saveSession(data.token, data.utilisateur)
      setStatus(null)
      onInscriptionReussie(data.utilisateur)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || "Impossible de créer le compte.")
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="form__title">Espace Évaluateur</h1>
      <p className="form__subtitle">
        Créez votre compte évaluateur pour accéder à votre interface.
      </p>

      <label className="field" htmlFor="eval-nom">
        <span className="field__label">Nom complet</span>
        <div className="field__control">
          <input
            id="eval-nom"
            name="nom"
            type="text"
            autoComplete="name"
            placeholder="Rakoto Jean"
            value={form.nom}
            onChange={handleChange}
          />
        </div>
      </label>

      <label className="field" htmlFor="eval-email">
        <span className="field__label">Email</span>
        <div className="field__control">
          <input
            id="eval-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="evaluateur@gmail.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </label>

      <label className="field" htmlFor="eval-mdp">
        <span className="field__label">Mot de passe</span>
        <div className="field__control">
          <input
            id="eval-mdp"
            name="mot_de_passe"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.mot_de_passe}
            onChange={handleChange}
          />
        </div>
      </label>

      <label className="field" htmlFor="eval-parcours">
        <span className="field__label">Parcours</span>
        <div className="field__control">
          <select
            id="eval-parcours"
            name="parcours"
            value={form.parcours}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choisir un parcours
            </option>
            {PARCOURS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </label>

      {errorMsg && (
        <p className={`form__message ${status === 'error' ? 'form__message--error' : ''}`} role="status">
          {errorMsg}
        </p>
      )}

      <button type="submit" className="form__submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Création du compte…' : 'Créer mon compte'}
      </button>

      <button type="button" className="form__evaluateur" onClick={onRetour}>
        ← Retour à la connexion
      </button>
    </form>
  )
}
