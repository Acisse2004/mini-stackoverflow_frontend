import { useNavigate } from 'react-router-dom'

// Badge de tag cliquable — navigue vers /?tag=xxx
export default function TagBadge({ label, hot = false, onClick }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) {
      onClick(label)
    } else {
      navigate(`/?tag=${encodeURIComponent(label)}`)
    }
  }

  return (
    <span
      className={`tag ${hot ? 'tag-hot' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick(e)}
    >
      {label}
    </span>
  )
}