const COLORS = ['#f48024','#1a73e8','#2d7d32','#6200ea','#c2185b','#0097a7']

function getColor(name = '') {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % COLORS.length
  return COLORS[hash]
}

export default function Avatar({ name = '?', size = 32, src = null }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const bg = getColor(name)

  if (src) {
    return (
      <img src={src} alt={name} style={{
        width: size, height: size, borderRadius: '50%', objectFit: 'cover',
      }} />
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700,
      flexShrink: 0, userSelect: 'none',
    }}>
      {initials}
    </div>
  )
}