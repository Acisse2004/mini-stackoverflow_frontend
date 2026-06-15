import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../api/authApi'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ pseudo: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.pseudo.trim())              e.pseudo   = 'Le pseudo est requis.'
    if (!form.email.includes('@'))        e.email    = 'Email invalide.'
    if (form.password.length < 8)        e.password = 'Minimum 8 caractères.'
    if (form.password !== form.confirm)  e.confirm  = 'Les mots de passe ne correspondent pas.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const data = await authApi.register(form.pseudo, form.email, form.password)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setErrors({ global: err.response?.data?.message || "Erreur lors de l'inscription." })
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, type = 'text', placeholder }) => (
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
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-block', background: '#f48024', color: '#fff',
            padding: '6px 16px', borderRadius: 6, fontWeight: 800, fontSize: 22, marginBottom: 10,
          }}>S</div>
          <p style={{ fontSize: 13, color: '#525960' }}>Rejoignez Mini Stack Overflow</p>
        </div>

        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 8, padding: '24px 28px',
        }}>
          {errors.global && <div className="alert alert-error">{errors.global}</div>}

          <form onSubmit={handleSubmit}>
            <Field name="pseudo"   label="Pseudo"                       placeholder="votre_pseudo" />
            <Field name="email"    label="Email"       type="email"      placeholder="vous@exemple.com" />
            <Field name="password" label="Mot de passe" type="password"  placeholder="min. 8 caractères" />
            <Field name="confirm"  label="Confirmer le mot de passe" type="password" placeholder="••••••••" />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: 14, marginTop: 4 }}
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 8, padding: 14, marginTop: 12,
          textAlign: 'center', fontSize: 13,
        }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color: '#0077cc', fontWeight: 500 }}>Se connecter</Link>
        </div>
      </div>
    </div>
  )
}