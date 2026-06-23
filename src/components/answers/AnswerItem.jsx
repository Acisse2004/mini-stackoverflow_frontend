import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import VoteButtons from '../questions/VoteButtons'
import MarkdownEditor from '../questions/MarkdownEditor'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../hooks/useAuth'
import { answersApi } from '../../api/questionsApi'

export default function AnswerItem({ answer, questionAuthorId, onAccept, onDelete, onUpdate }) {
  const { user } = useAuth()
  const [comments, setComments] = useState(answer.comments || [])
  const [newComment, setNewComment] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  const canAccept = user && user.id === questionAuthorId && !answer.accepted
  const isOwner = user && user.id === answer.author?.id

  // Normaliser les données de la réponse
  const voteCount = answer.vote_count ?? answer.votes ?? 0
  const isAccepted = answer.is_best ?? answer.accepted ?? false
  const authorName = answer.author?.pseudo || answer.author?.username || '?'
  const content = String(answer.content || answer.body || '')
  const date = answer.createdAt || answer.created_at || ''

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

  const handleShare = async () => {
    const url = `${window.location.origin}/question/${answer.question || answer.question_id || ''}#answer-${answer.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      console.error('Impossible de copier le lien.', e)
    }
  }

  const startEdit = () => {
    setEditContent(content)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditContent('')
  }

  const saveEdit = async () => {
    if (editContent.trim().length < 20) return
    setSavingEdit(true)
    try {
      const updated = await answersApi.update(answer.id, editContent)
      onUpdate?.(answer.id, updated)
      setIsEditing(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Supprimer definitivement cette reponse ?')) return
    setDeleting(true)
    try {
      await answersApi.remove(answer.id)
      onDelete?.(answer.id)
    } catch (e) {
      console.error(e)
      setDeleting(false)
    }
  }

  return (
    <div style={{
      display: 'flex', gap: 16,
      padding: '18px 0', borderBottom: '1px solid #e3e6e8',
      borderLeft: isAccepted ? '3px solid #2d7d32' : 'none',
      paddingLeft: isAccepted ? 14 : 0,
      opacity: deleting ? 0.5 : 1,
    }}>

      {/* Votes */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, minWidth:38 }}>
        <VoteButtons
          initialVotes={voteCount}
          onVote={dir => answersApi.vote(answer.id, dir)}
        />
        {isAccepted && (
          <span title="Meilleure reponse" style={{ fontSize:24, color:'#2d7d32', lineHeight:1 }}>✓</span>
        )}
        {canAccept && (
          <button
            onClick={() => onAccept(answer.id)}
            title="Marquer comme meilleure reponse"
            style={{
              fontSize:22, color:'#d6d9dc', background:'none',
              border:'none', cursor:'pointer', lineHeight:1,
            }}
            onMouseEnter={e => e.target.style.color = '#2d7d32'}
            onMouseLeave={e => e.target.style.color = '#d6d9dc'}
          >✓</button>
        )}
      </div>

      {/* Corps */}
      <div style={{ flex:1, minWidth:0 }}>
        {isAccepted && (
          <div className="accepted-badge" style={{ marginBottom:10 }}>✓ Meilleure reponse</div>
        )}

        {isEditing ? (
          <div style={{ marginBottom: 14 }}>
            <MarkdownEditor
              value={editContent}
              onChange={setEditContent}
              placeholder="Modifiez votre reponse..."
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                className="btn btn-primary"
                onClick={saveEdit}
                disabled={savingEdit || editContent.trim().length < 20}
                style={{ fontSize: 12, padding: '6px 14px' }}
              >
                {savingEdit ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={cancelEdit}
                style={{ fontSize: 12, padding: '6px 14px' }}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="md-body" style={{ marginBottom:14 }}>
            {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p style={{ color:'#838c95' }}>Pas de contenu.</p>}
          </div>
        )}

        {/* Auteur */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:8 }}>
          <div style={{ display:'flex', gap:12, fontSize:12, color:'#525960' }}>
            <span onClick={handleShare} style={{ cursor:'pointer', color: copied ? '#2d7d32' : '#525960' }}>
              {copied ? 'Lien copie !' : 'Partager'}
            </span>
            {isOwner && !isEditing && (
              <>
                <span onClick={startEdit} style={{ cursor:'pointer', color:'#0077cc' }}>
                  Modifier
                </span>
                <span onClick={handleDelete} style={{ cursor:'pointer', color:'#d63333' }}>
                  Supprimer
                </span>
              </>
            )}
          </div>
          <div style={{
            background:'#e1ecf4', borderRadius:4, padding:'8px 12px',
            display:'flex', gap:8, alignItems:'center',
          }}>
            <div style={{ fontSize:11, color:'#525960' }}>
              {date ? `Repondu ${date}` : 'Repondu'}
            </div>
            <Avatar name={authorName} size={20} src={answer.author?.avatar} />
            <Link
              to={`/user/${answer.author?.id}`}
              style={{ fontSize:12, color:'#0077cc' }}
            >
              {authorName}
            </Link>
          </div>
        </div>

        {/* Commentaires */}
        {comments.length > 0 && (
          <div style={{ borderTop:'1px solid #e3e6e8', marginTop:12, paddingTop:8 }}>
            {comments.map((c, i) => (
              <div key={i} style={{ fontSize:12, color:'#525960', padding:'4px 0', lineHeight:1.5 }}>
                {String(c.text || c.content || '')} —{' '}
                <Link to={`/user/${c.author?.id}`} style={{ color:'#0077cc', fontSize:12 }}>
                  {c.author?.pseudo || c.author?.username || '?'}
                </Link>
                <span style={{ color:'#838c95', marginLeft:6 }}>
                  {c.createdAt || c.created_at || ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire commentaire */}
        {user && (
          <div style={{ marginTop:8 }}>
            {showCommentForm ? (
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <input
                  className="form-input"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                  placeholder="Ajouter un commentaire..."
                  style={{ flex:1, fontSize:12, padding:'5px 8px' }}
                  autoFocus
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddComment}
                  disabled={commentLoading || !newComment.trim()}
                  style={{ fontSize:12, padding:'5px 10px' }}
                >
                  {commentLoading ? '...' : 'Envoyer'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setShowCommentForm(false); setNewComment('') }}
                  style={{ fontSize:12, padding:'5px 10px' }}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCommentForm(true)}
                style={{
                  fontSize:12, color:'#838c95', background:'none',
                  border:'none', cursor:'pointer', padding:0, marginTop:4,
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