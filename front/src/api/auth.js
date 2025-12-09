// front/src/api/auth.js
import axios from 'axios'

// On utilise directement axios avec le proxy Vite → pas besoin d'URL complète
const api = axios.create({
  baseURL: '/api/auth',   // grâce au proxy, ça va vers http://localhost:3000/api/auth
  headers: {
    'Content-Type': 'application/json',
  },
})

// Ajoute le token à chaque requête si il existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Connexion
export const signIn = async (data) => {
  const res = await api.post('/login', data)
  return res.data
}

// Récupère TOUS les utilisateurs de ta base SQLite
export const getUsers = async () => {
  const res = await api.get('/users')  // on va créer cette route dans 10 secondes
  return res.data
}

// Récupère l'utilisateur connecté (optionnel)
export const getMe = async () => {
  const res = await api.get('/me')
  return res.data
}

// Inscription (si tu veux l'utiliser ailleurs)
export const registerUser = async (data) => {
  const res = await api.post('/register', data)
  return res.data
}