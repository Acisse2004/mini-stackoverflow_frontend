import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../api/authApi'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Tous les champs sont obligatoires.'); return }
    setLoading(true)
    try {
      const data = await authApi.login(form.email, form.password)
      login(data.user)
      localStorage.setItem('mso_token', data.token)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#eff0f1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-block', background: '#f48024',
            color: '#fff', padding: '6px 14px', borderRadius: 6,
            fontWeight: 700, fontSize: 20, marginBottom: 8,
          }}>S</div>
          <div style={{ fontSize: 13, color: '#525960' }}>
            Connectez-vous à Mini Stack Overflow
          </div>
        </div>

        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 8, padding: '24px 28px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {error && (
            <div style={{
              background: '#fde8e8', border: '1px solid #e89898',
              borderRadius: 4, padding: '8px 12px',
              fontSize: 13, color: '#a01f1f', marginBottom: 14,
            }}>
              {error}
            </div>
          )}

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
              style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: 14 }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 8, padding: '14px', marginTop: 12,
          textAlign: 'center', fontSize: 13,
        }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#0077cc' }}>Inscription</Link>
        </div>
      </div>
    </div>
  )
}
