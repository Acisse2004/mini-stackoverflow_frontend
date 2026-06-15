import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../api/authApi'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    try {
      const data = await authApi.login(form.email, form.password)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#eff0f1',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-block', background: '#f48024', color: '#fff',
            padding: '6px 16px', borderRadius: 6, fontWeight: 800, fontSize: 22, marginBottom: 10,
          }}>S</div>
          <p style={{ fontSize: 13, color: '#525960' }}>Connectez-vous à Mini Stack Overflow</p>
        </div>

        {/* Carte */}
        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 8, padding: '24px 28px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: 14, marginTop: 4 }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Lien inscription */}
        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 8, padding: 14, marginTop: 12,
          textAlign: 'center', fontSize: 13,
        }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#0077cc', fontWeight: 500 }}>Créer un compte</Link>
        </div>
      </div>
    </div>
  )
}