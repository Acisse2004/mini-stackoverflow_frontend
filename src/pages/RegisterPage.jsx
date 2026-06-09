import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../api/authApi'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ pseudo: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.pseudo.trim())         e.pseudo = 'Le pseudo est requis.'
    if (!form.email.includes('@'))   e.email = 'Email invalide.'
    if (form.password.length < 8)   e.password = 'Minimum 8 caractères.'
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const data = await authApi.register(form.pseudo, form.email, form.password)
      login(data.user)
      localStorage.setItem('mso_token', data.token)
      navigate('/')
    } catch (err) {
      setErrors({ global: err.message || "Erreur lors de l'inscription." })
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })}
      />
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#eff0f1',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-block', background: '#f48024',
            color: '#fff', padding: '6px 14px', borderRadius: 6,
            fontWeight: 700, fontSize: 20, marginBottom: 8,
          }}>S</div>
          <div style={{ fontSize: 13, color: '#525960' }}>
            Rejoignez Mini Stack Overflow
          </div>
        </div>

        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 8, padding: '24px 28px',
        }}>
          {errors.global && (
            <div style={{
              background: '#fde8e8', border: '1px solid #e89898',
              borderRadius: 4, padding: '8px 12px', fontSize: 13,
              color: '#a01f1f', marginBottom: 14,
            }}>{errors.global}</div>
          )}
          <form onSubmit={handleSubmit}>
            {field('pseudo',  'Pseudo',           'text',     'votre_pseudo')}
            {field('email',   'Email',            'email',    'vous@exemple.com')}
            {field('password','Mot de passe',     'password', 'min. 8 caractères')}
            {field('confirm', 'Confirmer le mot de passe', 'password', '••••••••')}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: 14 }}
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 8, padding: '14px', marginTop: 12,
          textAlign: 'center', fontSize: 13,
        }}>
          Déjà inscrit ? <Link to="/login">Connexion</Link>
        </div>
      </div>
    </div>
  )
}
