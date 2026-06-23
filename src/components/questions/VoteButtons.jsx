import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function VoteButtons({ initialVotes = 0, onVote }) {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [votes, setVotes]       = useState(initialVotes)
  const [userVote, setUserVote] = useState(0)

  const handleVote = async (dir) => {
    if (!user) { navigate('/login'); return }
    try {
      const result = await onVote?.(dir)
      if (result && typeof result.vote_count === 'number') {
        setVotes(result.vote_count)
      }
      setUserVote(prev => (prev === dir ? 0 : dir))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="vote-block">
      <button
        className={`vote-btn ${userVote === 1 ? 'voted-up' : ''}`}
        onClick={() => handleVote(1)}
        title={user ? 'Vote positif' : 'Connectez-vous pour voter'}
        style={{ fontSize: 18 }}
      >
        ▲
      </button>
      <span className="vote-count">{votes}</span>
      <button
        className={`vote-btn ${userVote === -1 ? 'voted-down' : ''}`}
        onClick={() => handleVote(-1)}
        title={user ? 'Vote negatif' : 'Connectez-vous pour voter'}
        style={{ fontSize: 18 }}
      >
        ▼
      </button>
    </div>
  )
}