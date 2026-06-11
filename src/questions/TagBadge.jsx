export default function TagBadge({ label, hot = false, onClick }) {
  return (
    <span
      className={`tag ${hot ? 'tag-hot' : ''}`}
      onClick={() => onClick?.(label)}
    >
      {label}
    </span>
  )
}
