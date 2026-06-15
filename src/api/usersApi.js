export const usersApi = {
  getProfile: async (id) => ({
    id, pseudo: 'John Doe', avatar: null,
    memberSince: 'janvier 2024',
    location: 'Dakar, Sénégal',
    views: 245,
    stats: { questions: 42, answers: 127, votes: 389 },
    questions: [
      { id:1, title:'Comment utiliser useEffect ?', votes:24 },
      { id:3, title:'PostgreSQL vs MongoDB ?', votes:31 },
    ],
    answers: [
      { questionId:2, questionTitle:'Différence entre var, let et const', accepted:true },
    ]
  })
}