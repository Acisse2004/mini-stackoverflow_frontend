import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function VoteButtons({ initialVotes = 0, onVote, vertical = true }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [votes, setVotes] = useState(initialVotes)
  const [userVote, setUserVote] = useState(0) // -1, 0 ou 1

  const handleVote = (dir) => {
    if (!user) { navigate('/login'); return }
    const newDir = userVote === dir ? 0 : dir
    const diff = newDir - userVote
    setVotes(v => v + diff)
    setUserVote(newDir)
    onVote?.(newDir)
  }

  return (
    <div className="vote-block" style={{ flexDirection: vertical ? 'column' : 'row' }}>
      <button
        className={`vote-btn ${userVote === 1 ? 'active' : ''}`}
        onClick={() => handleVote(1)}
        title="Vote positif"
      >▲</button>

      <span className="vote-count">{votes}</span>

      <button
        className={`vote-btn ${userVote === -1 ? 'active' : ''}`}
        onClick={() => handleVote(-1)}
        title="Vote négatif"
      >▼</button>
    </div>
  )
}
