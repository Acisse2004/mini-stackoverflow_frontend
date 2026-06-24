const BASE = 'https://mini-stackoverflow-backend-8kcy.onrender.com/api'

export const authApi = {
  login: async (email, password) => {
    const res = await fetch(`${BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      throw new Error('Email ou mot de passe incorrect.')
    }
    return res.json() // { user, access, refresh }
  },

  register: async (username, email, password, password2) => {
    const res = await fetch(`${BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, password2 })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.password?.[0] || err.email?.[0] || 'Erreur lors de l\'inscription.')
    }
    return res.json() // { user, access, refresh }
  },

  logout: async (refreshToken) => {
    const token = localStorage.getItem('token')
    try {
      await fetch(`${BASE}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ refresh: refreshToken })
      })
    } catch {
      // Pas grave si ça échoue, on nettoie le localStorage côté front quand même
    }
  }
}
