import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import VoteButtons from '../questions/VoteButtons'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../hooks/useAuth'
import { answersApi } from '../../api/questionsApi'

export default function AnswerItem({ answer, questionAuthorId, onAccept }) {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [comments, setComments] = useState(answer.comments || [])

  const canAccept = user && user.id === questionAuthorId && !answer.accepted

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const c = await answersApi.addComment(answer.id, newComment)
      setComments(prev => [...prev, c])
      setNewComment('')
      setShowCommentForm(false)
    } catch (e) { console.error(e) }
  }

  return (
    <div style={{
      display: 'flex', gap: 14,
      padding: '16px 0', borderBottom: '1px solid #e3e6e8',
      borderLeft: answer.accepted ? '3px solid #2d7d32' : 'none',
      paddingLeft: answer.accepted ? 12 : 0,
    }}>
      {/* Votes */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <VoteButtons initialVotes={answer.votes}
          onVote={dir => answersApi.vote(answer.id, dir)} />
        {answer.accepted && (
          <span title="Meilleure réponse" style={{ fontSize: 22, color: '#2d7d32' }}>✓</span>
        )}
        {canAccept && (
          <button onClick={() => onAccept(answer.id)} title="Marquer comme meilleure réponse"
            style={{
              fontSize: 20, color: '#838c95', background: 'none',
              border: 'none', cursor: 'pointer',
            }}>✓</button>
        )}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1 }}>
        {answer.accepted && (
          <div className="accepted-badge" style={{ marginBottom: 8 }}>✓ Meilleure réponse</div>
        )}

        <div style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>
          <ReactMarkdown>{answer.body}</ReactMarkdown>
        </div>

        {/* Auteur */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            background: '#e1ecf4', borderRadius: 4, padding: '8px 12px',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <Avatar name={answer.author.pseudo} size={20} src={answer.author.avatar} />
            <div style={{ fontSize: 12 }}>
              <div style={{ color: '#0077cc' }}>{answer.author.pseudo}</div>
              <div style={{ color: '#525960' }}>{answer.createdAt}</div>
            </div>
          </div>
        </div>

        {/* Commentaires */}
        {comments.length > 0 && (
          <div style={{
            borderTop: '1px solid #e3e6e8',
            marginTop: 10, paddingTop: 8,
          }}>
            {comments.map((c, i) => (
              <div key={i} style={{ fontSize: 12, color: '#525960', padding: '4px 0' }}>
                {c.text} —{' '}
                <span style={{ color: '#0077cc' }}>{c.author.pseudo}</span>
              </div>
            ))}
          </div>
        )}

        {/* Ajouter un commentaire */}
        {user && (
          <div style={{ marginTop: 8 }}>
            {showCommentForm ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="form-input"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  style={{ flex: 1, fontSize: 12 }}
                />
                <button className="btn btn-primary" onClick={handleAddComment}
                  style={{ fontSize: 12 }}>
                  Envoyer
                </button>
                <button className="btn btn-ghost" onClick={() => setShowCommentForm(false)}
                  style={{ fontSize: 12 }}>
                  Annuler
                </button>
              </div>
            ) : (
              <button onClick={() => setShowCommentForm(true)}
                style={{ fontSize: 12, color: '#0077cc', background: 'none', border: 'none', cursor: 'pointer' }}>
                + Ajouter un commentaire
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
