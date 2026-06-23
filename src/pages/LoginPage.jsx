import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../api/authApi'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
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
      login(data.user, data.access, data.refresh)
      navigate('/')
    } catch (err) {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#eef2f8',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-block', background: '#2563eb', color: '#fff',
            padding: '6px 16px', borderRadius: 6, fontWeight: 800, fontSize: 22, marginBottom: 10,
          }}>S</div>
          <p style={{ fontSize: 13, color: '#4b5d70' }}>Connectez-vous a Mini Stack Overflow</p>
        </div>

        {/* Carte */}
        <div style={{
          background: '#fff', border: '1px solid #d7e1ee',
          borderRadius: 8, padding: '24px 28px',
          boxShadow: '0 1px 4px rgba(37,99,235,0.08)',
        }}>
          {error && (
            <div style={{
              padding: '10px 14px', background: '#fdeaea',
              border: '1px solid #f0b8b8', borderRadius: 4,
              color: '#a01f1f', fontSize: 13, marginBottom: 14
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>
                Email
              </label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                autoFocus
                style={{
                  width: '100%', padding: '8px 10px',
                  border: '1px solid #d7e1ee', borderRadius: 4,
                  fontSize: 13, outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{
                  width: '100%', padding: '8px 10px',
                  border: '1px solid #d7e1ee', borderRadius: 4,
                  fontSize: 13, outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '9px',
                background: '#2563eb', color: '#fff',
                border: 'none', borderRadius: 4,
                fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Lien inscription */}
        <div style={{
          background: '#fff', border: '1px solid #d7e1ee',
          borderRadius: 8, padding: 14, marginTop: 12,
          textAlign: 'center', fontSize: 13,
        }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#0369a1', fontWeight: 500 }}>
            Creer un compte
          </Link>
        </div>

      </div>
    </div>
  )
}