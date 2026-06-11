import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import MarkdownEditor from '../components/questions/MarkdownEditor'
import TagBadge from '../components/questions/TagBadge'
import { questionsApi } from '../api/questionsApi'

export default function AskQuestionPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', body: '', tags: [] })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && form.tags.length < 5 && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }

  const removeTag = (t) =>
    setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))

  const validate = () => {
    const e = {}
    if (form.title.trim().length < 10) e.title = 'Le titre doit faire au moins 10 caractères.'
    if (form.body.trim().length < 20)  e.body = 'La description doit faire au moins 20 caractères.'
    if (form.tags.length === 0)        e.tags = 'Ajoutez au moins 1 tag.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const q = await questionsApi.create(form)
      navigate(`/question/${q.id}`)
    } catch (err) {
      setErrors({ global: 'Erreur lors de la publication.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Poser une question</h1>
      <p style={{ fontSize: 13, color: '#525960', marginBottom: 20 }}>
        Partagez votre problème clairement pour obtenir de l'aide rapidement.
      </p>

      {/* Conseils */}
      <div style={{
        background: '#fdf7f2', border: '1px solid #f1d4b5',
        borderRadius: 6, padding: '14px 16px', marginBottom: 24, fontSize: 13,
      }}>
        <strong>Conseils pour une bonne question :</strong>
        <ul style={{ marginTop: 6, marginLeft: 20, lineHeight: 1.8, color: '#525960' }}>
          <li>Décrivez le problème précisément</li>
          <li>Partagez le code ou les messages d'erreur</li>
          <li>Expliquez ce que vous avez déjà essayé</li>
        </ul>
      </div>

      {errors.global && (
        <div style={{
          background: '#fde8e8', border: '1px solid #e89898',
          borderRadius: 4, padding: '8px 12px', fontSize: 13,
          color: '#a01f1f', marginBottom: 14,
        }}>{errors.global}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Titre */}
        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 6, padding: '16px', marginBottom: 14,
        }}>
          <label className="form-label">Titre</label>
          <div className="form-hint">Soyez spécifique et imaginez que vous posez la question à quelqu'un en face</div>
          <input
            className="form-input"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Comment centrer un div verticalement avec Flexbox ?"
          />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>

        {/* Description */}
        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 6, padding: '16px', marginBottom: 14,
        }}>
          <label className="form-label">Description</label>
          <div className="form-hint">Expliquez en détail le problème, incluez le code si nécessaire (Markdown supporté)</div>
          <MarkdownEditor
            value={form.body}
            onChange={body => setForm({ ...form, body })}
            placeholder={'Décrivez votre problème...\n\n```javascript\n// votre code ici\n```'}
          />
          {errors.body && <div className="form-error">{errors.body}</div>}
        </div>

        {/* Tags */}
        <div style={{
          background: '#fff', border: '1px solid #d6d9dc',
          borderRadius: 6, padding: '16px', marginBottom: 20,
        }}>
          <label className="form-label">Tags</label>
          <div className="form-hint">Ajoutez jusqu'à 5 tags pour décrire votre question</div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
            border: '1px solid #d6d9dc', borderRadius: 4, padding: '6px 8px',
            minHeight: 38,
          }}>
            {form.tags.map(t => (
              <span key={t} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', background: '#e1ecf4',
                color: '#39739d', fontSize: 12, borderRadius: 4,
              }}>
                {t}
                <button type="button" onClick={() => removeTag(t)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#39739d', fontSize: 14, lineHeight: 1, padding: 0,
                }}>×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder={form.tags.length < 5 ? 'ex: python, react…' : 'Maximum 5 tags'}
              disabled={form.tags.length >= 5}
              style={{ border: 'none', outline: 'none', fontSize: 13, flexGrow: 1, minWidth: 80 }}
            />
          </div>
          <button type="button" onClick={addTag} style={{
            marginTop: 6, fontSize: 12, color: '#0077cc',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>+ Ajouter ce tag</button>
          {errors.tags && <div className="form-error">{errors.tags}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontSize: 14 }}>
          {loading ? 'Publication...' : 'Publier la question'}
        </button>
      </form>
    </PageLayout>
  )
}
