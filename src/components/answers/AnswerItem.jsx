import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import VoteButtons from '../questions/VoteButtons'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../hooks/useAuth'
import { answersApi } from '../../api/questionsApi'

// Composant d'une réponse avec votes, commentaires, meilleure réponse
export default function AnswerItem({ answer, questionAuthorId, onAccept }) {
  const { user } = useAuth()
  const [comments, setComments]           = useState(answer.comments || [])
  const [newComment, setNewComment]       = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentLoading, setCommentLoading]   = useState(false)

  // L'auteur de la question peut marquer une réponse comme meilleure
  const canAccept = user && user.id === questionAuthorId && !answer.accepted

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setCommentLoading(true)
    try {
      const c = await answersApi.addComment(answer.id, newComment)
      setComments(prev => [...prev, c])
      setNewComment('')
      setShowCommentForm(false)
    } catch (e) {
      console.error(e)
    } finally {
      setCommentLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex', gap: 16,
      padding: '18px 0', borderBottom: '1px solid #e3e6e8',
      borderLeft: answer.accepted ? '3px solid #2d7d32' : 'none',
      paddingLeft: answer.accepted ? 14 : 0,
    }}>
      {/* Votes + coche accepté */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 38 }}>
        <VoteButtons
          initialVotes={answer.votes}
          onVote={dir => answersApi.vote(answer.id, dir)}
        />
        {/* Coche verte si accepté */}
        {answer.accepted && (
          <span title="Meilleure réponse" style={{ fontSize: 24, color: '#2d7d32', lineHeight: 1 }}>✓</span>
        )}
        {/* Bouton pour accepter (visible seulement à l'auteur de la question) */}
        {canAccept && (
          <button
            onClick={() => onAccept(answer.id)}
            title="Marquer comme meilleure réponse"
            style={{
              fontSize: 22, color: '#d6d9dc', background: 'none',
              border: 'none', cursor: 'pointer', lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = '#2d7d32'}
            onMouseLeave={e => e.target.style.color = '#d6d9dc'}
          >✓</button>
        )}
      </div>

      {/* Corps de la réponse */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {answer.accepted && (
          <div className="accepted-badge" style={{ marginBottom: 10 }}>✓ Meilleure réponse</div>
        )}

        <div className="md-body" style={{ marginBottom: 14 }}>
          <ReactMarkdown>{answer.body}</ReactMarkdown>
        </div>

        {/* Auteur + actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#525960' }}>
            <span style={{ cursor: 'pointer' }}>Partager</span>
            {user && user.id === answer.author?.id && (
              <span style={{ cursor: 'pointer', color: '#0077cc' }}>Modifier</span>
            )}
          </div>
          <div style={{
            background: '#e1ecf4', borderRadius: 4, padding: '8px 12px',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <div style={{ fontSize: 11, color: '#525960' }}>Répondu {answer.createdAt}</div>
            <Avatar name={answer.author?.pseudo || '?'} size={20} src={answer.author?.avatar} />
            <Link to={`/user/${answer.author?.id}`} style={{ fontSize: 12, color: '#0077cc' }}>
              {answer.author?.pseudo}
            </Link>
          </div>
        </div>

        {/* Commentaires */}
        {comments.length > 0 && (
          <div style={{ borderTop: '1px solid #e3e6e8', marginTop: 12, paddingTop: 8 }}>
            {comments.map((c, i) => (
              <div key={i} style={{ fontSize: 12, color: '#525960', padding: '4px 0', lineHeight: 1.5 }}>
                {c.text} —{' '}
                <Link to={`/user/${c.author?.id}`} style={{ color: '#0077cc', fontSize: 12 }}>
                  {c.author?.pseudo}
                </Link>
                <span style={{ color: '#838c95', marginLeft: 6 }}>{c.createdAt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire commentaire */}
        {user && (
          <div style={{ marginTop: 8 }}>
            {showCommentForm ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="form-input"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                  placeholder="Ajouter un commentaire..."
                  style={{ flex: 1, fontSize: 12, padding: '5px 8px' }}
                  autoFocus
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddComment}
                  disabled={commentLoading || !newComment.trim()}
                  style={{ fontSize: 12, padding: '5px 10px' }}
                >
                  {commentLoading ? '...' : 'Envoyer'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setShowCommentForm(false); setNewComment('') }}
                  style={{ fontSize: 12, padding: '5px 10px' }}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCommentForm(true)}
                style={{
                  fontSize: 12, color: '#838c95', background: 'none',
                  border: 'none', cursor: 'pointer', padding: 0,
                  marginTop: 4,
                }}
              >
                + Ajouter un commentaire
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}