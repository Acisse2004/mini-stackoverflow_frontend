import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

export const usersApi = {
  getProfile: (id) =>
    API.get(`/users/${id}`).then(r => r.data),
}