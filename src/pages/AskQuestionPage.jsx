import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import MarkdownEditor from '../components/questions/MarkdownEditor'
import { questionsApi } from '../api/questionsApi'

export default function AskQuestionPage() {
  const navigate = useNavigate()

  // ── Chaque champ a son propre state totalement isolé ──
  const [title,    setTitle]    = useState('')
  const [body,     setBody]     = useState('')
  const [tags,     setTags]     = useState([])
  const [tagInput, setTagInput] = useState('')
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && tags.length < 5 && !tags.includes(t)) setTags(p => [...p, t])
    setTagInput('')
  }

  const removeTag = (t) => setTags(p => p.filter(x => x !== t))

  const validate = () => {
    const e = {}
    if (title.trim().length < 10) e.title = 'Le titre doit faire au moins 10 caractères.'
    if (body.trim().length  < 20) e.body  = 'La description doit faire au moins 20 caractères.'
    if (tags.length === 0)        e.tags  = 'Ajoutez au moins 1 tag.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const q = await questionsApi.create({ title, body, tags })
      navigate(`/question/${q.id}`)
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Erreur lors de la publication.' })
    } finally {
      setLoading(false)
    }
  }

  // Style de carte partagé
  const card = {
    background: '#fff', border: '1px solid #d6d9dc',
    borderRadius: 8, padding: 20, marginBottom: 14,
  }

  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="page-title">Poser une question</h1>
      </div>

      {/* Conseils */}
      <div className="alert alert-warning" style={{ marginBottom: 20 }}>
        <strong>Conseils pour une bonne question :</strong>
        <ul style={{ marginTop: 6, marginLeft: 18, lineHeight: 1.9, fontSize: 13 }}>
          <li>Résumez le problème dans le titre</li>
          <li>Partagez le code ou le message d'erreur exact</li>
          <li>Expliquez ce que vous avez déjà essayé</li>
        </ul>
      </div>

      {errors.global && <div className="alert alert-error">{errors.global}</div>}

      <form onSubmit={handleSubmit}>

        {/* ─── TITRE ─── */}
        <div style={card}>
          <label className="form-label">Titre</label>
          <div className="form-hint">Résumez votre problème en une phrase claire et précise</div>
          <input
            className="form-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex : Comment centrer un div verticalement avec Flexbox ?"
            maxLength={200}
            autoComplete="off"
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {errors.title
              ? <span className="form-error">{errors.title}</span>
              : <span />}
            <span style={{ fontSize: 11, color: '#838c95' }}>{title.length}/200</span>
          </div>
        </div>

        {/* ─── DESCRIPTION ─── */}
        <div style={card}>
          <label className="form-label">Description</label>
          <div className="form-hint">
            Expliquez en détail votre problème. Utilisez la barre d'outils ou écrivez en Markdown directement.
          </div>

          {/*
            ⚠️  IMPORTANT : MarkdownEditor utilise son propre ref interne.
            Il ne partage RIEN avec le champ Titre.
            onChange={setBody} met à jour uniquement "body".
          */}
          <MarkdownEditor
            value={body}
            onChange={setBody}
            placeholder={'Décrivez votre problème...\n\nExemple :\n```javascript\nconsole.log("mon code")\n```'}
          />

          {errors.body && <div className="form-error" style={{ marginTop: 6 }}>{errors.body}</div>}
        </div>

        {/* ─── TAGS ─── */}
        <div style={card}>
          <label className="form-label">Tags</label>
          <div className="form-hint">
            Ajoutez jusqu'à 5 tags. Appuyez sur <kbd style={{ background: '#f6f6f6', border: '1px solid #d6d9dc', borderRadius: 3, padding: '1px 5px', fontSize: 11 }}>Entrée</kbd> ou virgule pour valider chaque tag.
          </div>

          {/* Zone des tags */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
            border: '1px solid #d6d9dc', borderRadius: 4,
            padding: '6px 10px', minHeight: 42, background: '#fff',
          }}>
            {tags.map(t => (
              <span key={t} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 9px', background: '#e1ecf4',
                color: '#39739d', fontSize: 12, borderRadius: 4,
                userSelect: 'none',
              }}>
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#39739d', fontSize: 16, lineHeight: 1, padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}
                >×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
                if (e.key === 'Backspace' && !tagInput && tags.length) removeTag(tags[tags.length - 1])
              }}
              placeholder={tags.length < 5 ? 'ex: javascript, react…' : 'Maximum 5 tags atteint'}
              disabled={tags.length >= 5}
              style={{
                border: 'none', outline: 'none',
                fontSize: 13, flexGrow: 1, minWidth: 120,
                background: 'transparent', color: '#232629',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, alignItems: 'center' }}>
            <button
              type="button" onClick={addTag}
              style={{ fontSize: 12, color: '#0077cc', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              + Ajouter ce tag
            </button>
            <span style={{ fontSize: 11, color: '#838c95' }}>{tags.length}/5</span>
          </div>
          {errors.tags && <div className="form-error">{errors.tags}</div>}
        </div>

        {/* ─── PUBLIER ─── */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ fontSize: 14, padding: '10px 24px' }}
        >
          {loading ? 'Publication en cours...' : 'Publier la question'}
        </button>

      </form>
    </PageLayout>
  )
}