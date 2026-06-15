import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const TAGS = ['javascript', 'python', 'react', 'css', 'nodejs', 'sql', 'typescript', 'git', 'html', 'php']

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const linkStyle = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '7px 16px', fontSize: 13,
    color: isActive ? '#f48024' : '#525960',
    background: isActive ? '#fff8f2' : 'transparent',
    borderLeft: `3px solid ${isActive ? '#f48024' : 'transparent'}`,
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
  })

  const tagIcon = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#838c95" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )

  return (
    <aside style={{
      width: 180, flexShrink: 0,
      padding: '12px 0',
      borderRight: '1px solid #e3e6e8',
      minHeight: 'calc(100vh - 52px)',
    }}>

      <nav>
        <NavLink to="/" end style={linkStyle}>Accueil</NavLink>
        <NavLink to="/ask" style={linkStyle}>Poser</NavLink>
      </nav>

      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
        textTransform: 'uppercase', color: '#838c95',
        padding: '16px 16px 6px',
      }}>
        Tags
      </div>

      <nav>
        {TAGS.map(tag => (
          <div
            key={tag}
            onClick={() => navigate(`/?tag=${tag}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', fontSize: 13,
              color: '#525960', cursor: 'pointer',
              borderLeft: '3px solid transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {tagIcon}
            {tag}
          </div>
        ))}
      </nav>

      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
        textTransform: 'uppercase', color: '#838c95',
        padding: '16px 16px 6px',
      }}>
        Compte
      </div>

      <nav>
        <NavLink to="/user/me" style={linkStyle}>Mon profil</NavLink>
        {user ? (
          <div
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', fontSize: 13,
              color: '#525960', cursor: 'pointer',
              borderLeft: '3px solid transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Deconnexion
          </div>
        ) : (
          <NavLink to="/login" style={linkStyle}>Connexion</NavLink>
        )}
      </nav>

    </aside>
  )
}