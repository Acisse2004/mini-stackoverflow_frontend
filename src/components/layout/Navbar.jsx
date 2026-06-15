import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #e3e6e8',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 16px',
        height: 52, display: 'flex', alignItems: 'center', gap: 12,
      }}>

        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none', flexShrink: 0,
        }}>
          <span style={{
            background: '#f48024', color: '#fff',
            padding: '3px 9px', borderRadius: 4,
            fontWeight: 800, fontSize: 15,
          }}>S</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#232629' }}>
            Mini StackOverflow
          </span>
        </Link>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid #d6d9dc',
            borderRadius: 4, padding: '5px 10px',
          }}>
            <svg width="14" height="14" fill="none" stroke="#838c95" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="6" cy="6" r="5"/>
              <line x1="10" y1="10" x2="13" y2="13"/>
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher..."
              style={{
                border: 'none', outline: 'none',
                background: 'transparent',
                width: '100%', fontSize: 13,
              }}
            />
          </div>
        </form>

        {/* Boutons droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <Link to={`/user/${user.id}`}>
                <Avatar name={user.pseudo} size={30} src={user.avatar} />
              </Link>
              <span style={{ fontSize: 13, color: '#525960' }}>{user.pseudo}</span>
              <button
                onClick={logout}
                style={{
                  fontSize: 12, padding: '5px 12px',
                  border: '1px solid #d6d9dc', borderRadius: 4,
                  background: 'transparent', cursor: 'pointer', color: '#525960',
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button style={{
                  fontSize: 12, padding: '5px 12px',
                  border: '1px solid #0077cc', borderRadius: 4,
                  background: 'transparent', cursor: 'pointer', color: '#0077cc',
                }}>
                  Connexion
                </button>
              </Link>
              <Link to="/register">
                <button style={{
                  fontSize: 12, padding: '5px 12px',
                  border: 'none', borderRadius: 4,
                  background: '#f48024', cursor: 'pointer', color: '#fff',
                }}>
                  Inscription
                </button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}