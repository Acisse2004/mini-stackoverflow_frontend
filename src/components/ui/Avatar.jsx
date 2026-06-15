export default function Avatar({ name = '?', size = 32, src }) {
  const initials = name.split(' ').map(x => x[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#f48024','#1a73e8','#2d7d32','#6200ea','#c62828']
  const color = colors[name.charCodeAt(0) % colors.length]

  if (src) return (
    <img src={src} alt={name} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover' }} />
  )

  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:color, color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:size*0.35, fontWeight:700, flexShrink:0
    }}>
      {initials}
    </div>
  )
}