import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../ui/Avatar'

const TAG_COLORS = {
  javascript: { bg:'#fff8e1', color:'#c7811f' },
  react:      { bg:'#fff8e1', color:'#c7811f' },
  hooks:      { bg:'#fff8e1', color:'#c7811f' },
  python:     { bg:'#e8f5e9', color:'#2d7d32' },
  django:     { bg:'#e8f5e9', color:'#2d7d32' },
  http:       { bg:'#e8f5e9', color:'#2d7d32' },
  api:        { bg:'#e8f5e9', color:'#2d7d32' },
  css:        { bg:'#e3f2fd', color:'#1565c0' },
  flexbox:    { bg:'#e3f2fd', color:'#1565c0' },
  html:       { bg:'#e3f2fd', color:'#1565c0' },
  nodejs:     { bg:'#fce4ec', color:'#c62828' },
  types:      { bg:'#ede7f6', color:'#4527a0' },
  typescript: { bg:'#ede7f6', color:'#4527a0' },
  default:    { bg:'#e1ecf4', color:'#39739d' },
}

export default function QuestionCard({ question }) {
  const navigate = useNavigate()
  const {
    id, title, excerpt, tags = [],
    votes, answersCount, author,
    createdAt, solved
  } = question

  return (
    <div style={{
      display: 'flex', gap: 16,
      padding: '16px', marginBottom: 8,
      background: '#fff',
      border: '1px solid #e3e6e8',
      borderRadius: 6,
      transition: 'border-color .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#c8ccd0'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#e3e6e8'}
    >
      {/* Stats votes / réponses */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 8,
        minWidth: 50, fontSize: 12,
        color: '#525960', textAlign: 'center', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#232629' }}>{votes}</div>
          <div style={{ fontSize: 11 }}>votes</div>
        </div>
        <div style={{
          background: solved ? '#2d7d32' : 'transparent',
          color: solved ? '#fff' : '#232629',
          border: solved ? 'none' : '1px solid #d6d9dc',
          borderRadius: 4, padding: '2px 6px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{answersCount}</div>
          <div style={{ fontSize: 11 }}>{solved ? '✓ rép.' : 'rép.'}</div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          to={`/question/${id}`}
          style={{
            color: '#0077cc', fontSize: 15,
            fontWeight: 500, lineHeight: 1.4,
            textDecoration: 'none',
          }}
        >
          {title}
        </Link>
        <p style={{
          fontSize: 13, color: '#525960',
          margin: '5px 0 10px', lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {excerpt}
        </p>

        {/* Tags + auteur */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 6, flexWrap: 'wrap',
        }}>
          {tags.map(tag => {
            const c = TAG_COLORS[tag] || TAG_COLORS.default
            return (
              <span
                key={tag}
                onClick={() => navigate(`/?tag=${tag}`)}
                style={{
                  fontSize: 12, padding: '2px 8px',
                  borderRadius: 4, cursor: 'pointer',
                  background: c.bg, color: c.color,
                  transition: 'opacity .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {tag}
              </span>
            )
          })}

          {/* Auteur */}
          <div style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center',
            gap: 5, fontSize: 11, color: '#838c95',
            flexShrink: 0,
          }}>
            <Avatar name={author?.pseudo || '?'} size={18} src={author?.avatar} />
            <Link
              to={`/user/${author?.id}`}
              style={{ color: '#0077cc', fontSize: 11, textDecoration: 'none' }}
            >
              {author?.pseudo}
            </Link>
            <span>· {createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 