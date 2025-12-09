// back/src/routes/index.js
import { Hono } from 'hono'
import { cors } from 'hono/cors'           // AJOUTÉ ICI
import authRouter from './auth.router.js'
import { authGuard } from '../middlewares/authguard.js'

const app = new Hono()

// CORS activé pour toutes les routes /api/*
app.use('/api/*', cors({
  origin: 'http://localhost:5173',     // ton front Vite
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))

// Routes d'authentification
app.route('/api/auth', authRouter)

// Route protégée de test
app.get('/api/authenticated', authGuard(), (c) => {
  const user = c.get('user')
  return c.json({ message: 'Authenticated !', email: user.email })
})

// Route de santé
app.get('/', (c) => c.text('API Lili is alive !'))

export default app