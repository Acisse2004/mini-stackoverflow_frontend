const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

const MOCK_QUESTIONS = [
  { id:1, title:'Comment utiliser useEffect avec async/await ?', excerpt:'Je veux faire un appel API dans useEffect mais je ne sais pas comment gérer async...', tags:['react','javascript'], votes:24, answersCount:5, solved:true, author:{id:1, pseudo:'alice'}, createdAt:'il y a 2h' },
  { id:2, title:'Différence entre var, let et const en JavaScript', excerpt:'Quelle est la vraie différence entre ces trois déclarations de variables ?', tags:['javascript'], votes:18, answersCount:3, solved:false, author:{id:2, pseudo:'bob'}, createdAt:'il y a 5h' },
  { id:3, title:'PostgreSQL vs MongoDB pour une application SaaS ?', excerpt:'Je démarre un projet SaaS et je dois choisir entre une BDD relationnelle ou NoSQL.', tags:['python','django'], votes:31, answersCount:8, solved:true, author:{id:3, pseudo:'charlie'}, createdAt:'il y a 1j' },
  { id:4, title:'Comment implémenter JWT refresh tokens avec Express ?', excerpt:'Je veux sécuriser mon API avec des access tokens courte durée et des refresh tokens.', tags:['nodejs'], votes:12, answersCount:2, solved:false, author:{id:4, pseudo:'diana'}, createdAt:'il y a 2j' },
  { id:5, title:'Optimiser les requêtes N+1 avec Prisma ORM', excerpt:'Mon API est lente à cause de requêtes N+1. Comment les éviter avec Prisma ?', tags:['nodejs','react'], votes:9, answersCount:0, solved:false, author:{id:5, pseudo:'eric'}, createdAt:'il y a 3j' },
]

export const questionsApi = {
  getAll: async ({ sort, tag, search } = {}) => {
    try {
      const params = new URLSearchParams()
      if (sort) params.append('sort', sort)
      if (tag) params.append('tag', tag)
      if (search) params.append('search', search)
      const res = await fetch(`${BASE}/questions/?${params}`, {
        headers: getHeaders()
      })
      if (!res.ok) {
        let list = [...MOCK_QUESTIONS]
        if (search) list = list.filter(q =>
          q.title.toLowerCase().includes(search.toLowerCase()) ||
          q.tags.some(t => t.includes(search.toLowerCase()))
        )
        if (tag) list = list.filter(q => q.tags.includes(tag))
        if (sort === 'votes') list.sort((a,b) => b.votes - a.votes)
        else if (sort === 'unanswered') list = list.filter(q => q.answersCount === 0)
        return { questions: list, total: list.length }
      }
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.results || data.questions || [])
      return { questions: list, total: list.length }
    } catch {
      let list = [...MOCK_QUESTIONS]
      if (search) list = list.filter(q =>
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.tags.some(t => t.includes(search.toLowerCase()))
      )
      if (tag) list = list.filter(q => q.tags.includes(tag))
      if (sort === 'votes') list.sort((a,b) => b.votes - a.votes)
      else if (sort === 'unanswered') list = list.filter(q => q.answersCount === 0)
      return { questions: list, total: list.length }
    }
  },

  getById: async (id) => {
    try {
      const res = await fetch(`${BASE}/questions/${id}/`, {
        headers: getHeaders()
      })
      if (!res.ok) {
        return MOCK_QUESTIONS.find(q => q.id === parseInt(id)) || null
      }
      return res.json()
    } catch {
      return MOCK_QUESTIONS.find(q => q.id === parseInt(id)) || null
    }
  },

  vote: async (questionId, value) => {
    const res = await fetch(`${BASE}/questions/${questionId}/vote/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ value })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Erreur lors du vote.')
    }
    return res.json() // { vote_count } ou { message, vote_count }
  },

  create: async (form) => {
    try {
      // On envoie directement les noms de tags : le backend les cree
      // automatiquement s'ils n'existent pas encore.
      const res = await fetch(`${BASE}/questions/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title: form.title,
          description: form.body,
          tag_ids: form.tags
        })
      })
      if (!res.ok) {
        const newQuestion = {
          id: Date.now(),
          title: form.title,
          excerpt: form.body.substring(0, 100),
          tags: form.tags,
          votes: 0,
          answersCount: 0,
          solved: false,
          author: { id: 1, pseudo: 'moi' },
          created_at: new Date().toISOString()
        }
        MOCK_QUESTIONS.unshift(newQuestion)
        return newQuestion
      }
      return res.json()
    } catch {
      const newQuestion = {
        id: Date.now(),
        title: form.title,
        excerpt: form.body.substring(0, 100),
        tags: form.tags,
        votes: 0,
        answersCount: 0,
        solved: false,
        author: { id: 1, pseudo: 'moi' },
        created_at: new Date().toISOString()
      }
      MOCK_QUESTIONS.unshift(newQuestion)
      return newQuestion
    }
  }
}

export const answersApi = {
  getByQuestion: async (questionId) => {
    try {
      // URL corrigée selon le backend
      const res = await fetch(`${BASE}/questions/${questionId}/answers/`, {
        headers: getHeaders()
      })
      if (!res.ok) return []
      const data = await res.json()
      return Array.isArray(data) ? data : (data.results || [])
    } catch {
      return []
    }
  },

  create: async (questionId, content) => {
    try {
      const res = await fetch(`${BASE}/questions/${questionId}/answers/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content })
      })
      if (!res.ok) {
        return {
          id: Date.now(),
          content,
          vote_count: 0,
          is_best: false,
          author: { pseudo: 'moi' },
          created_at: new Date().toISOString()
        }
      }
      return res.json()
    } catch {
      return {
        id: Date.now(),
        content,
        vote_count: 0,
        is_best: false,
        author: { pseudo: 'moi' },
        created_at: new Date().toISOString()
      }
    }
  },

  update: async (answerId, content) => {
    const res = await fetch(`${BASE}/answers/${answerId}/`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Erreur lors de la modification.')
    }
    return res.json()
  },

  remove: async (answerId) => {
    const res = await fetch(`${BASE}/answers/${answerId}/`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Erreur lors de la suppression.')
    }
    return true
  },

  accept: async (answerId) => {
    try {
      const res = await fetch(`${BASE}/answers/${answerId}/best/`, {
        method: 'POST',
        headers: getHeaders()
      })
      if (!res.ok) return { success: true }
      return res.json()
    } catch {
      return { success: true }
    }
  },

  vote: async (answerId, value) => {
    try {
      const res = await fetch(`${BASE}/answers/${answerId}/vote/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ value })
      })
      if (!res.ok) return { success: true }
      return res.json()
    } catch {
      return { success: true }
    }
  },

  addComment: async (answerId, content) => {
    try {
      const res = await fetch(`${BASE}/answers/${answerId}/comments/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content })
      })
      if (!res.ok) {
        return {
          id: Date.now(),
          content,
          author: { pseudo: 'moi' },
          created_at: new Date().toISOString()
        }
      }
      return res.json()
    } catch {
      return {
        id: Date.now(),
        content,
        author: { pseudo: 'moi' },
        created_at: new Date().toISOString()
      }
    }
  }
}