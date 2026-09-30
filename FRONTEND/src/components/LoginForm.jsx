import { useState } from 'react'
import {
  login,
  saveSession,
  clearSession,
  estParcoursInformatique,
  estEvaluateur,
} from '../services/authApi'

export default function LoginForm({ onLoginSuccess, onShowEvaluateur }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [status, setStatus] = useState(null) // null | 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !code) {
      setStatus('error')
      setErrorMsg('Renseignez votre email et votre code pour continuer.')
      return
    }

    setStatus('loading')

    try {
      // Appel réel au back-end : POST /api/auth/login { email, mot_de_passe }
      const data = await login(email, code)
      const estUnEvaluateur = estEvaluateur(data.utilisateur.role)

      if (!estUnEvaluateur && !estParcoursInformatique(data.utilisateur.parcours)) {
        clearSession()
        setStatus('error')
        setErrorMsg(
          `Connexion réussie, mais l'interface "${data.utilisateur.parcours || 'inconnue'}" ` +
            `n'est pas encore disponible (seul le côté Informatique est en ligne pour le moment).`
        )
        return
      }

      saveSession(data.token, data.utilisateur)
      setStatus(null)
      onLoginSuccess(data.utilisateur)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Email ou code incorrect.')
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="form__title">Connexion</h1>
      <p className="form__subtitle">
        Accédez à votre espace EMIT avec votre email et votre code.
      </p>

      <label className="field" htmlFor="email">
        <span className="field__label">Email</span>
        <div className="field__control">
          <svg className="field__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M4 6.5l8 6 8-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Info@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </label>

      <label className="field" htmlFor="code">
        <span className="field__label">Code d'accès</span>
        <div className="field__control">
          <svg className="field__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
              x="5"
              y="10.5"
              width="14"
              height="9"
              rx="1.6"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M8 10.5V7.8a4 4 0 1 1 8 0v2.7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="code"
            name="code"
            type={showCode ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="INFORMATIQUE"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShowCode((v) => !v)}
            aria-pressed={showCode}
            aria-label={showCode ? 'Masquer le code' : 'Afficher le code'}
          >
            {showCode ? 'Masquer' : 'Afficher'}
          </button>
        </div>
      </label>

      <div className="form__row">
        <label className="checkbox">
          <input type="checkbox" name="remember" />
          <span>Se souvenir de moi</span>
        </label>
      </div>

      {errorMsg && (
        <p className={`form__message ${status === 'error' ? 'form__message--error' : ''}`} role="status">
          {errorMsg}
        </p>
      )}

      <button type="submit" className="form__submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Connexion…' : 'Se connecter'}
      </button>

      <p className="form__hint">
        Exemple (mention Informatique) : <strong>Info@gmail.com</strong> / <strong>INFORMATIQUE</strong>
      </p>
   
      <button
        type="button"
        className="form__evaluateur"
        onClick={onShowEvaluateur}
      >
        Espace Évaluateur
      </button>
    </form>
  )
}
