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

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!newAnswer.trim()) return
    if (newAnswer.trim().length < 20) {
      setError('La reponse doit faire au moins 20 caracteres.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const created = await answersApi.create(id, newAnswer)
      setAnswers(prev => [...prev, created])
      setNewAnswer('')
      setQuestion(q => ({ ...q, answersCount: (q.answersCount || 0) + 1 }))
    } catch (e) {
      setError('Erreur lors de la publication de votre reponse.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAccept = async (answerId) => {
    try {
      await answersApi.accept(answerId)
      setAnswers(prev => prev.map(a => ({ ...a, accepted: a.id === answerId })))
      setQuestion(q => ({ ...q, solved: true }))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteAnswer = (answerId) => {
    setAnswers(prev => prev.filter(a => a.id !== answerId))
    setQuestion(q => ({ ...q, answersCount: Math.max((q.answersCount || answers.length) - 1, 0) }))
  }

  const handleUpdateAnswer = (answerId, updated) => {
    setAnswers(prev => prev.map(a => (a.id === answerId ? updated : a)))
  }

  if (loading) return <PageLayout><div className="spinner" /></PageLayout>

  if (!question) return (
    <PageLayout>
      <div className="empty-state">
        <h3>Question introuvable</h3>
        <p>Cette question n'existe pas ou a ete supprimee.</p>
        <Link to="/"><button className="btn btn-primary">Retour a l'accueil</button></Link>
      </div>
    </PageLayout>
  )

  const tags = question.tags || []
  const authorName = question.author?.pseudo || question.author?.username || '?'

  return (
    <PageLayout>

      {/* Bouton retour */}
      <button
        className="btn btn-ghost"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 14, fontSize: 12 }}
      >
        &larr; Retour
      </button>

      {/* En-tete question */}
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e3e6e8' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>
          {question.title}
        </h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#838c95', flexWrap: 'wrap' }}>
          <span>Posee le {question.createdAt || question.created_at}</span>
          <span>Modifiee {question.updatedAt || question.updated_at}</span>
          <span>{question.answersCount || answers.length} reponse(s)</span>
        </div>
      </div>

      {/* Corps question + votes */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <VoteButtons
          initialVotes={question.vote_count || question.votes || 0}
          onVote={dir => questionsApi.vote(id, dir)}
        />
        <div style={{ flex: 1 }}>
          <div className="md-body" style={{ marginBottom: 16 }}>
            <ReactMarkdown>{question.description || question.body || ''}</ReactMarkdown>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {tags.map(tag => (
              <TagBadge
                key={typeof tag === 'object' ? tag.id : tag}
                label={typeof tag === 'object' ? tag.name : tag}
              />
            ))}
          </div>

          {/* Auteur */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              background: '#e1ecf4', borderRadius: 4,
              padding: '8px 12px', display: 'flex',
              gap: 8, alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, color: '#525960' }}>
                Posee par
              </div>
              <Avatar name={authorName} size={20} src={question.author?.avatar} />
              <Link
                to={`/user/${question.author?.id}`}
                style={{ fontSize: 12, color: '#0077cc' }}
              >
                {authorName}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reponses */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
          {answers.length} reponse{answers.length !== 1 ? 's' : ''}
        </h2>
        {answers.length === 0 ? (
          <p style={{ color: '#838c95', fontSize: 13 }}>
            Aucune reponse pour l'instant. Soyez le premier a repondre !
          </p>
        ) : (
          answers.map(answer => (
            <AnswerItem
              key={answer.id}
              answer={answer}
              questionAuthorId={question.author?.id}
              onAccept={handleAccept}
              onDelete={handleDeleteAnswer}
              onUpdate={handleUpdateAnswer}
            />
          ))
        )}
      </div>

      {/* Formulaire reponse */}
      {user ? (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
            Votre reponse
          </h2>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 12 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmitAnswer}>
            <MarkdownEditor
              value={newAnswer}
              onChange={setNewAnswer}
              placeholder="Ecrivez votre reponse ici... (minimum 20 caracteres)"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || newAnswer.trim().length < 20}
              style={{ marginTop: 12, fontSize: 14, padding: '10px 20px' }}
            >
              {submitting ? 'Publication...' : 'Publier votre reponse'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{
          marginTop: 24, padding: 16,
          background: '#f8f9fa', border: '1px solid #e3e6e8',
          borderRadius: 6, textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, color: '#525960', marginBottom: 10 }}>
            Vous devez etre connecte pour repondre.
          </p>
          <Link to="/login">
            <button className="btn btn-primary">Se connecter</button>
          </Link>
        </div>
      )}

    </PageLayout>
  )
}