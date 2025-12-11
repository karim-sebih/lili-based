// back/src/routes/index.js
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from './auth.router.js'
import { authGuard } from '../middlewares/authguard.js'

const app = new Hono()

// CORS
app.use('/api/*', cors({
  origin: 'http://localhost:5173',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

// TES ROUTES AUTH
app.route('/api/auth', authRouter)   // ← CETTE LIGNE EST CRUCIALE

// Route test protégée
app.get('/api/me', authGuard(), (c) => {
  return c.json({ user: c.get('user') })
})

app.get('/', (c) => c.text('API Lili OK'))

export default app