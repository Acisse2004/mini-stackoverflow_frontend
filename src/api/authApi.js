export const authApi = {
  login: async (email, password) => {
    return {
      user: { id:1, pseudo: email.split('@')[0], email },
      token: 'mock-token-123'
    }
  },
  register: async (pseudo, email, password) => {
    return {
      user: { id: Date.now(), pseudo, email },
      token: 'mock-token-' + Date.now()
    }
  }
}