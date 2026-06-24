const BASE = 'https://mini-stackoverflow-backend-8kcy.onrender.com/api'

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export const usersApi = {
  getProfile: async (id) => {
    // Si id est "me" → utiliser l'endpoint du profil connecté
    const url = id === 'me'
      ? `${BASE}/auth/me/`
      : `${BASE}/users/${id}/`
    const res = await fetch(url, {
      headers: getHeaders()
    })
    if (!res.ok) throw await res.json()
    return res.json()
  }
}
