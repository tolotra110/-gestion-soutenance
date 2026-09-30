import { useState } from 'react'
import logoEmit from './assets/logo-emit.png'
import logoUf from './assets/logo-uf.png'
import LoginForm from './components/LoginForm'
import EvaluateurAuth from './components/EvaluateurAuth'
import './App.css'

export default function App() {
  const [vue, setVue] = useState('connexion') // 'connexion' | 'evaluateur-inscription'
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null)

  function handleLoginSuccess(utilisateur) {
    // Ici, dans l'app complète, on redirige vers le dashboard correspondant.
    // Ce paquet ne contient que l'interface de connexion (front seul).
    setVue('connexion')
    setUtilisateurConnecte(utilisateur)
  }

  return (
    <div className="page">
      <section className="showcase" aria-hidden="false">
        <div className="showcase__facets" aria-hidden="true">
          <span className="facet facet--1" />
          <span className="facet facet--2" />
          <span className="facet facet--3" />
        </div>

        <img src={logoUf} alt="Université de Fianarantsoa" className="showcase__uf" />

        <div className="showcase__content">
          <img
            src={logoEmit}
            alt="EMIT — École de Management et d'Innovation Technologique"
            className="showcase__logo"
          />

          <div className="showcase__divider" aria-hidden="true" />

          <p className="showcase__headline">Planning de soutenance licence</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel__center">
          {vue === 'evaluateur-inscription' ? (
            <EvaluateurAuth
              onInscriptionReussie={handleLoginSuccess}
              onRetour={() => setVue('connexion')}
            />
          ) : (
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onShowEvaluateur={() => setVue('evaluateur-inscription')}
            />
          )}
        </div>
      </section>

      {utilisateurConnecte && (
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#666' }}>
          Connecté en tant que {utilisateurConnecte.nom || utilisateurConnecte.email}
          &nbsp;(la redirection vers le tableau de bord n'est pas incluse dans ce paquet front-only)
        </p>
      )}
    </div>
  )
}
