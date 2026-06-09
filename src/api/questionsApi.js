import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Injecter le token JWT dans chaque requête
API.interceptors.request.use(config => {
  const token = localStorage.getItem('mso_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const questionsApi = {
  // GET /questions?sort=recent&tag=&search=&page=1
  getAll: (params = {}) =>
    API.get('/questions', { params }).then(r => r.data),

  // GET /questions/:id
  getById: (id) =>
    API.get(`/questions/${id}`).then(r => r.data),

  // POST /questions
  create: (payload) =>
    API.post('/questions', payload).then(r => r.data),

  // PUT /questions/:id/vote
  vote: (id, direction) =>
    API.put(`/questions/${id}/vote`, { direction }).then(r => r.data),
}

export const answersApi = {
  // GET /questions/:questionId/answers
  getByQuestion: (questionId) =>
    API.get(`/questions/${questionId}/answers`).then(r => r.data),

  // POST /questions/:questionId/answers
  create: (questionId, body) =>
    API.post(`/questions/${questionId}/answers`, { body }).then(r => r.data),

  // PUT /answers/:id/vote
  vote: (id, direction) =>
    API.put(`/answers/${id}/vote`, { direction }).then(r => r.data),

  // PUT /answers/:id/accept
  accept: (id) =>
    API.put(`/answers/${id}/accept`).then(r => r.data),

  // POST /answers/:id/comments
  addComment: (id, text) =>
    API.post(`/answers/${id}/comments`, { text }).then(r => r.data),
}