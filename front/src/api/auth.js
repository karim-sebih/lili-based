// front/src/api/auth.js (updated with react-query/axios, for new DB)
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/auth',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const register = async (data) => (await api.post('/register', data)).data.data

export const login = async (credentials) => {
  const res = await api.post('/login', credentials)
  const { user, token } = res.data.data
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export const getMe = async () => (await api.get('/me')).data.user