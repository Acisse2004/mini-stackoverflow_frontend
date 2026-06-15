import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Boutons de vote ▲ / ▼ avec état local
export default function VoteButtons({ initialVotes = 0, onVote }) {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [votes, setVotes]       = useState(initialVotes)
  const [userVote, setUserVote] = useState(0) // -1, 0 ou 1

  const handleVote = (dir) => {
    // Non connecté → rediriger vers login
    if (!user) { navigate('/login'); return }

    // Cliquer deux fois sur le même bouton annule le vote
    const newDir = userVote === dir ? 0 : dir
    const diff   = newDir - userVote
    setVotes(v => v + diff)
    setUserVote(newDir)
    onVote?.(newDir)
  }

  return (
    <div className="vote-block">
      <button
        className={`vote-btn ${userVote === 1 ? 'voted-up' : ''}`}
        onClick={() => handleVote(1)}
        title={user ? 'Vote positif' : 'Connectez-vous pour voter'}
      >▲</button>

      <span className="vote-count">{votes}</span>

      <button
        className={`vote-btn ${userVote === -1 ? 'voted-down' : ''}`}
        onClick={() => handleVote(-1)}
        title={user ? 'Vote négatif' : 'Connectez-vous pour voter'}
      >▼</button>
    </div>
  )
}