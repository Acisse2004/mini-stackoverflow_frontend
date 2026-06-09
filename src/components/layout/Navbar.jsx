import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim())
      navigate('/')
    }
  }

  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #e3e6e8',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 12px',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          textDecoration: 'none', flexShrink: 0,
        }}>
          <span style={{
            background: '#f48024', color: '#fff',
            padding: '2px 8px', borderRadius: 4,
            fontWeight: 700, fontSize: 14,
          }}>S</span>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#232629' }}>
            Mini<span style={{ color: '#f48024' }}>SO</span>
          </span>
        </Link>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 560 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid #d6d9dc',
            borderRadius: 4, padding: '5px 10px',
          }}>
            <svg width="15" height="15" fill="none" stroke="#838c95" strokeWidth="2">
              <circle cx="6" cy="6" r="5"/><line x1="10" y1="10" x2="14" y2="14"/>
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher des questions..."
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                width: '100%', fontSize: 13,
              }}
            />
          </div>
        </form>

        {/* Actions droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <Link to="/ask">
                <button className="btn btn-primary" style={{ fontSize: 12 }}>
                  + Poser une question
                </button>
              </Link>
              <Link to={`/user/${user.id}`}>
                <Avatar name={user.pseudo} size={28} />
              </Link>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-ghost" style={{ fontSize: 12 }}>Connexion</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary" style={{ fontSize: 12 }}>Inscription</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}