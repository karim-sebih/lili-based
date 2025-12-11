// back/src/index.js  ← remplace tout le fichier
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from './routes/auth.router.js'

const app = new Hono()

// CORS large (on ouvre tout)
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.route('/api/auth', authRouter)

app.get('/', (c) => c.text('API LILI OK'))

console.log('Serveur démarré → http://localhost:3000')

serve({
  fetch: app.fetch,
  port: 3000
})