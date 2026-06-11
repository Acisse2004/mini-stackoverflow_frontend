import { Link } from 'react-router-dom'
import TagBadge from './TagBadge'
import Avatar from '../ui/Avatar'

export default function QuestionCard({ question, onTagClick }) {
  const { id, title, excerpt, tags, votes, answersCount, author, createdAt, solved } = question

  return (
    <div className="post-card" style={{ cursor: 'pointer' }}>
      {/* Stats */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, minWidth: 52, fontSize: 12, color: '#525960', textAlign: 'center',
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#232629' }}>{votes}</div>
          <div>votes</div>
        </div>
        <div style={solved ? {
          background: '#2d7d32', color: '#fff',
          borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600,
        } : {}}>
          <div style={{ fontSize: 15, fontWeight: 700, color: solved ? 'inherit' : '#232629' }}>
            {answersCount}
          </div>
          <div>{solved ? '✓ rép.' : 'rép.'}</div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ flex: 1 }}>
        <Link to={`/question/${id}`} style={{ color: '#0077cc', fontSize: 14, fontWeight: 500 }}>
          {title}
        </Link>
        <p style={{ fontSize: 12, color: '#525960', margin: '5px 0 8px', lineHeight: 1.5 }}>
          {excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <TagBadge key={tag} label={tag} onClick={onTagClick} />
          ))}
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center',
            gap: 6, fontSize: 11, color: '#838c95',
          }}>
            <Avatar name={author.pseudo} size={16} src={author.avatar} />
            <Link to={`/user/${author.id}`} style={{ color: '#0077cc', fontSize: 11 }}>
              {author.pseudo}
            </Link>
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
