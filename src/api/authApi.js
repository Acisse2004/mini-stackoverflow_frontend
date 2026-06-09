import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

export const authApi = {
  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    return res.data  // { user: { id, pseudo, avatar }, token }
  },

  register: async (pseudo, email, password) => {
    const res = await API.post('/auth/register', { pseudo, email, password })
    return res.data  // { user: { id, pseudo, avatar }, token }
  },
}