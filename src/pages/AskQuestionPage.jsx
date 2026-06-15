import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import MarkdownEditor from '../components/questions/MarkdownEditor'
import { questionsApi } from '../api/questionsApi'

export default function AskQuestionPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', body: '', tags: [] })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && form.tags.length < 5 && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }

  const removeTag = (t) =>
    setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))

  const validate = () => {
    const e = {}
    if (form.title.trim().length < 10)
      e.title = 'Le titre doit faire au moins 10 caracteres.'
    if (form.body.trim().length < 20)
      e.body = 'La description doit faire au moins 20 caracteres.'
    if (form.tags.length === 0)
      e.tags = 'Ajoutez au moins 1 tag.'
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

  const Card = ({ children }) => (
    <div style={{
      background: '#fff', border: '1px solid #d6d9dc',
      borderRadius: 8, padding: 20, marginBottom: 14,
    }}>
      {children}
    </div>
  )

  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="page-title">Poser une question</h1>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: 20 }}>
        <strong>Conseils pour une bonne question :</strong>
        <ul style={{ marginTop: 6, marginLeft: 18, lineHeight: 1.8, fontSize: 13 }}>
          <li>Resumez le probleme dans le titre</li>
          <li>Partagez le code ou le message d'erreur exact</li>
          <li>Expliquez ce que vous avez deja essaye</li>
        </ul>
      </div>

      {errors.global && <div className="alert alert-error">{errors.global}</div>}

      <form onSubmit={handleSubmit}>

        {/* Titre */}
        <Card>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Titre</label>
            <div className="form-hint">
              Soyez precis et imaginez que vous posez la question a quelqu'un
            </div>
            <input
              className="form-input"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Ex : Comment centrer un div verticalement avec Flexbox ?"
              maxLength={200}
              autoFocus
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
            <div style={{ fontSize: 11, color: '#838c95', marginTop: 4, textAlign: 'right' }}>
              {form.title.length}/200
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <div className="form-hint">
              Expliquez en detail votre probleme. Markdown supporte.
            </div>
            <MarkdownEditor
              value={form.body}
              onChange={body => setForm({ ...form, body })}
              placeholder="Decrivez votre probleme..."
            />
            {errors.body && <div className="form-error">{errors.body}</div>}
          </div>
        </Card>

        {/* Tags */}
        <Card>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Etiquettes</label>
            <div className="form-hint">
              Ajoutez jusqu'a 5 tags pour categoriser votre question
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
              border: '1px solid #d6d9dc', borderRadius: 4,
              padding: '6px 10px', minHeight: 40, background: '#fff',
            }}>
              {form.tags.map(t => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '2px 9px', background: '#e1ecf4',
                  color: '#39739d', fontSize: 12, borderRadius: 4,
                }}>
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#39739d', fontSize: 15, lineHeight: 1, padding: 0,
                    }}
                  >×</button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
                  if (e.key === 'Backspace' && !tagInput && form.tags.length) {
                    removeTag(form.tags[form.tags.length - 1])
                  }
                }}
                placeholder={form.tags.length < 5 ? 'ex: javascript, react...' : 'Maximum atteint'}
                disabled={form.tags.length >= 5}
                style={{
                  border: 'none', outline: 'none', fontSize: 13,
                  flexGrow: 1, minWidth: 100, background: 'transparent',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <button
                type="button" onClick={addTag}
                style={{ fontSize: 12, color: '#0077cc', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                + Ajouter ce tag
              </button>
              <span style={{ fontSize: 11, color: '#838c95' }}>{form.tags.length}/5 tags</span>
            </div>
            {errors.tags && <div className="form-error">{errors.tags}</div>}
          </div>

          {/* Bouton publier */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ fontSize: 14, padding: '10px 20px' }}
          >
            {loading ? 'Publication en cours...' : 'Publier la question'}
          </button>
        </Card>

      </form>
    </PageLayout>
  )
}