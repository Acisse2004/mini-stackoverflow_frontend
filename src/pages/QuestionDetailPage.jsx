import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
  const { id } = useParams()
  const { user } = useAuth()
  const [question, setQuestion]   = useState(null)
  const [answers, setAnswers]     = useState([])
  const [newAnswer, setNewAnswer] = useState('')
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      questionsApi.getById(id),
      answersApi.getByQuestion(id),
    ]).then(([q, a]) => { setQuestion(q); setAnswers(a) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!newAnswer.trim()) return
    setSubmitting(true)
    try {
      const created = await answersApi.create(id, newAnswer)
      setAnswers(prev => [...prev, created])
      setNewAnswer('')
    } catch (e) { console.error(e) }
    finally { setSubmitting(false) }
  }

  const handleAccept = async (answerId) => {
    try {
      await answersApi.accept(answerId)
      setAnswers(prev => prev.map(a => ({ ...a, accepted: a.id === answerId })))
    } catch (e) { console.error(e) }
  }

  if (loading) return <PageLayout><div className="spinner" /></PageLayout>
  if (!question) return <PageLayout><div className="empty-state"><h3>Question introuvable</h3></div></PageLayout>

  return (
    <PageLayout>
      {/* Titre + méta */}
      <div style={{ paddingBottom: 14, borderBottom: '1px solid #e3e6e8', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>
          {question.title}
        </h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#525960' }}>
          <span>Posée {question.createdAt}</span>
          <span>{question.views} vues</span>
          <span>{answers.length} réponse(s)</span>
        </div>
      </div>

      {/* Corps de la question */}
      <div style={{ display: 'flex', gap: 14, paddingBottom: 16, borderBottom: '1px solid #e3e6e8' }}>
        <VoteButtons initialVotes={question.votes}
          onVote={dir => questionsApi.vote(id, dir)} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 14 }}>
            <ReactMarkdown>{question.body}</ReactMarkdown>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {question.tags.map(t => <TagBadge key={t} label={t} />)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              background: '#e1ecf4', borderRadius: 4, padding: '8px 12px',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, color: '#525960' }}>Posée par</div>
              <Avatar name={question.author.pseudo} size={20} src={question.author.avatar} />
              <Link to={`/user/${question.author.id}`} style={{ fontSize: 12, color: '#0077cc' }}>
                {question.author.pseudo}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Réponses */}
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: '20px 0 8px' }}>
        {answers.length} réponse(s)
      </h2>

      {answers.map(a => (
        <AnswerItem key={a.id} answer={a}
          questionAuthorId={question.author.id}
          onAccept={handleAccept} />
      ))}

      {/* Formulaire de réponse */}
      {user ? (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Votre réponse</h2>
          <form onSubmit={handleSubmitAnswer}>
            <MarkdownEditor
              value={newAnswer}
              onChange={setNewAnswer}
              placeholder="Rédigez votre réponse en Markdown..."
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !newAnswer.trim()}
              style={{ marginTop: 12 }}
            >
              {submitting ? 'Publication...' : 'Publier ma réponse'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{
          marginTop: 24, background: '#fdf7f2',
          border: '1px solid #f1d4b5', borderRadius: 6, padding: '16px',
          textAlign: 'center', fontSize: 14,
        }}>
          <Link to="/login">Connectez-vous</Link> pour poster une réponse.
        </div>
      )}
    </PageLayout>
  )
}
