const BASE = 'http://localhost:8000/api'

const MOCK_QUESTIONS = [
  { id:1, title:'Comment utiliser useEffect avec async/await ?', excerpt:'Je veux faire un appel API dans useEffect...', tags:['react','javascript'], votes:24, answersCount:5, solved:true,  author:{pseudo:'alice'}, createdAt:'il y a 2h' },
  { id:2, title:'Différence entre var, let et const',            excerpt:'Quelle est la vraie différence ?',              tags:['javascript'],        votes:18, answersCount:3, solved:false, author:{pseudo:'bob'},   createdAt:'il y a 5h' },
  { id:3, title:'PostgreSQL vs MongoDB pour SaaS ?',             excerpt:'Je dois choisir une base de données...',        tags:['python','django'],   votes:31, answersCount:8, solved:true,  author:{pseudo:'charlie'},createdAt:'il y a 1j' },
  { id:4, title:'JWT refresh tokens avec Express ?',             excerpt:'Je veux sécuriser mon API...',                  tags:['nodejs'],            votes:12, answersCount:2, solved:false, author:{pseudo:'diana'}, createdAt:'il y a 2j' },
  { id:5, title:'Optimiser les requêtes N+1 avec Prisma',        excerpt:'Mon API est lente à cause de N+1...',           tags:['nodejs','react'],    votes:9,  answersCount:0, solved:false, author:{pseudo:'eric'},  createdAt:'il y a 3j' },
]

export const questionsApi = {
  getAll: async ({ sort, tag, search } = {}) => {
    let list = [...MOCK_QUESTIONS]
    if (search) list = list.filter(q =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some(t => t.includes(search.toLowerCase()))
    )
    if (tag) list = list.filter(q => q.tags.includes(tag))
    if (sort === 'votes') list.sort((a,b) => b.votes - a.votes)
    else if (sort === 'unanswered') list = list.filter(q => q.answersCount === 0)
    return { questions: list, total: list.length }
  },
  getById: async (id) => MOCK_QUESTIONS.find(q => q.id === parseInt(id)) || null,
  create: async (form) => ({ id: Date.now(), ...form, votes:0, answersCount:0, solved:false }),
}

export const answersApi = {
  getByQuestion: async (id) => [],
  create: async (questionId, body) => ({
    id: Date.now(), body, votes:0, accepted:false,
    author:{ pseudo:'moi' }, createdAt:'à l\'instant'
  }),
  accept: async (answerId) => ({ success: true }),
}