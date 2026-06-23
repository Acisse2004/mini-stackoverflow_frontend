import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../api/authApi'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [pseudo, setPseudo]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)

  const validate = () => {
    const e = {}
    if (!pseudo.trim())              e.pseudo   = 'Le pseudo est requis.'
    if (!email.includes('@'))        e.email    = 'Email invalide.'
    if (password.length < 8)         e.password = 'Minimum 8 caracteres.'
    if (password !== confirm)        e.confirm  = 'Les mots de passe ne correspondent pas.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      
      const data = await authApi.register(pseudo, email, password, confirm)
      login(data.user, data.access, data.refresh)
      navigate('/')
    } catch (err) {
      setErrors({ global: err.message || "Erreur lors de l'inscription." })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 10px',
    border: '1px solid #d7e1ee', borderRadius: 4,
    fontSize: 13, outline: 'none', marginTop: 3,
    fontFamily: 'inherit',
  }

  const labelStyle = {
    display: 'block', fontSize: 15,
    fontWeight: 600, marginBottom: 3,
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#eef2f8',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-block', background: '#2563eb', color: '#fff',
            padding: '6px 16px', borderRadius: 6,
            fontWeight: 800, fontSize: 22, marginBottom: 10,
          }}>S</div>
          <p style={{ fontSize: 13, color: '#4b5d70' }}>Rejoignez Mini Stack Overflow</p>
        </div>

        {/* Carte */}
        <div style={{
          background: '#fff', border: '1px solid #d7e1ee',
          borderRadius: 8, padding: '24px 28px',
        }}>
          {errors.global && (
            <div style={{
              padding: '10px 14px', background: '#fdeaea',
              border: '1px solid #f0b8b8', borderRadius: 4,
              color: '#a01f1f', fontSize: 13, marginBottom: 14
            }}>
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Pseudo */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Pseudo</label>
              <input
                type="text"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                placeholder="votre_pseudo"
                style={inputStyle}
                autoFocus
              />
              {errors.pseudo && <div style={{ fontSize: 12, color: '#d23a3a', marginTop: 4 }}>{errors.pseudo}</div>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                style={inputStyle}
              />
              {errors.email && <div style={{ fontSize: 12, color: '#d23a3a', marginTop: 4 }}>{errors.email}</div>}
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="min. 8 caracteres"
                style={inputStyle}
              />
              {errors.password && <div style={{ fontSize: 12, color: '#d23a3a', marginTop: 4 }}>{errors.password}</div>}
            </div>

            {/* Confirmer */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
              {errors.confirm && <div style={{ fontSize: 12, color: '#d23a3a', marginTop: 4 }}>{errors.confirm}</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '9px',
                background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: 4,
                fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creation...' : 'Creer mon compte'}
            </button>
          </form>
        </div>

        {/* Lien connexion */}
        <div style={{
          background: '#fff', border: '1px solid #d7e1ee',
          borderRadius: 8, padding: 14, marginTop: 12,
          textAlign: 'center', fontSize: 13,
        }}>
          Deja inscrit ?{' '}
          <Link to="/login" style={{ color: '#0369a1', fontWeight: 500 }}>
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  )
}