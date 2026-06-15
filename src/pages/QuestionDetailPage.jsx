import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import PageLayout from '../components/layout/PageLayout'
import VoteButtons from '../components/questions/VoteButtons'
import TagBadge from '../components/questions/TagBadge'
import AnswerItem from '../components/answers/AnswerItem'
import MarkdownEditor from '../components/questions/MarkdownEditor'
import Avatar from '../components/ui/Avatar'
import { useAuth } from '../hooks/useAuth'
import { questionsApi, answersApi } from '../api/questionsApi'

export default function QuestionDetailPage() {
  const { id }   = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [question, setQuestion]     = useState(null)
  const [answers, setAnswers]       = useState([])
  const [newAnswer, setNewAnswer]   = useState('')
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      questionsApi.getById(id),
      answersApi.getByQuestion(id),
    ])
      .then(([q, a]) => {
        setQuestion(q)
        setAnswers(Array.isArray(a) ? a : [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  // Soumettre une réponse
  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!newAnswer.trim()) return
    if (newAnswer.trim().length < 20) {
      setError('La réponse doit faire au moins 20 caractères.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const created = await answersApi.create(id, newAnswer)
      setAnswers(prev => [...prev, created])
      setNewAnswer('')
      // Mise à jour du compteur dans la question
      setQuestion(q => ({ ...q, answersCount: (q.answersCount || 0) + 1 }))
    } catch (e) {
      setError('Erreur lors de la publication de votre réponse.')
    } finally {
      setSubmitting(false)
    }
  }

  // Marquer une réponse comme meilleure
  const handleAccept = async (answerId) => {
    try {
      await answersApi.accept(answerId)
      setAnswers(prev => prev.map(a => ({ ...a, accepted: a.id === answerId })))
      setQuestion(q => ({ ...q, solved: true }))
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <PageLayout><div className="spinner" /></PageLayout>
  if (!question) return (
    <PageLayout>
      <div className="empty-state">
        <h3>Question introuvable</h3>
        <p>Cette question n'existe pas ou a été supprimée.</p>
        <Link to="/"><button className="btn btn-primary">Retour à l'accueil</button></Link>
      </div>
    </PageLayout>
  )

  return (
    <PageLayout>
      {/* Bouton retour */}
      <button
        className="btn btn-ghost"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 14, fontSize: 12 }}
      >
        ← Retour
      </button>

      {/* Titre de la question */}
      <div style={{ paddingBottom: 14, borderBottom: '1px solid #e3e6e8', marginBottom: 18 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>
          {question.title}
        </h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#525960', flexWrap: 'wrap' }}>
          <span>Posée {question.createdAt}</span>
          <span>{question.views || 0} vues</span>
          <span>{answers.length} réponse{answers.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Corps de la question */}
      <div style={{ display: 'flex', gap: 16, paddingBottom: 18, borderBottom: '1px solid #e3e6e8' }}>
        <VoteButtons
          initialVotes={question.votes || 0}
          onVote={dir => questionsApi.vote(id, dir)}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="md-body" style={{ marginBottom: 14 }}>
            <ReactMarkdown>{question.body}</ReactMarkdown>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {(question.tags || []).map(t => <TagBadge key={t} label={t} />)}
          </div>

          {/* Actions + auteur */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#525960' }}>
              <span style={{ cursor: 'pointer' }}>Partager</span>
              {user && user.id === question.author?.id && (
                <>
                  <span style={{ cursor: 'pointer', color: '#0077cc' }}>Modifier</span>
                  <span style={{ cursor: 'pointer', color: '#c32525' }}>Supprimer</span>
                </>
              )}
            </div>
            <div style={{
              background: '#e1ecf4', borderRadius: 4, padding: '8px 12px',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, color: '#525960' }}>Posée par</div>
              <Avatar name={question.author?.pseudo || '?'} size={22} src={question.author?.avatar} />
              <Link to={`/user/${question.author?.id}`} style={{ fontSize: 12, color: '#0077cc' }}>
                {question.author?.pseudo}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section des réponses */}
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: '22px 0 10px' }}>
        {answers.length} réponse{answers.length !== 1 ? 's' : ''}
      </h2>

      {answers.length === 0 && (
        <p style={{ color: '#838c95', fontSize: 14, marginBottom: 20 }}>
          Aucune réponse pour l'instant. Soyez le premier à répondre !
        </p>
      )}

      {answers.map(a => (
        <AnswerItem
          key={a.id}
          answer={a}
          questionAuthorId={question.author?.id}
          onAccept={handleAccept}
        />
      ))}

      {/* Formulaire pour répondre */}
      {user ? (
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #e3e6e8' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Votre réponse</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmitAnswer}>
            <MarkdownEditor
              value={newAnswer}
              onChange={setNewAnswer}
              placeholder="Rédigez votre réponse en Markdown..."
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || newAnswer.trim().length < 20}
              style={{ marginTop: 12 }}
            >
              {submitting ? 'Publication...' : 'Publier ma réponse'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{
          marginTop: 28, background: '#fff8f2',
          border: '1px solid #f1d4b5', borderRadius: 6,
          padding: 18, textAlign: 'center', fontSize: 14,
        }}>
          <Link to="/login" style={{ color: '#f48024', fontWeight: 600 }}>Connectez-vous</Link>
          {' '}ou{' '}
          <Link to="/register" style={{ color: '#f48024', fontWeight: 600 }}>créez un compte</Link>
          {' '}pour poster une réponse.
        </div>
      )}
    </PageLayout>
  )
}