import { NavLink } from 'react-router-dom'

const POPULAR_TAGS = ['javascript', 'python', 'react', 'css', 'node.js', 'sql', 'git', 'typescript']

export default function Sidebar({ onTagClick }) {
  const linkStyle = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 12px', fontSize: 13,
    color: isActive ? '#f48024' : '#525960',
    background: isActive ? '#fff8f2' : 'transparent',
    borderLeft: isActive ? '3px solid #f48024' : '3px solid transparent',
    textDecoration: 'none', fontWeight: isActive ? 600 : 400,
    transition: 'all 0.1s',
    borderRadius: '0 4px 4px 0',
  })

  return (
    <aside style={{
      width: 164,
      flexShrink: 0,
      padding: '16px 0',
      borderRight: '1px solid #e3e6e8',
    }}>
      <nav>
        <NavLink to="/" end style={linkStyle}>
          🏠 Accueil
        </NavLink>
        <NavLink to="/ask" style={linkStyle}>
          ✏️ Poser une question
        </NavLink>
      </nav>

      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
        textTransform: 'uppercase', color: '#838c95',
        padding: '16px 12px 6px',
      }}>
        Tags populaires
      </div>

      <div style={{ padding: '0 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {POPULAR_TAGS.map(tag => (
          <span
            key={tag}
            className="tag"
            onClick={() => onTagClick?.(tag)}
            style={{ fontSize: 11, cursor: 'pointer' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </aside>
  )
}