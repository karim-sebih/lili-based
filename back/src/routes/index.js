import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import authRouter from './auth.router.js'
import { verify } from 'hono/jwt'
import authService from '../services/auth.service.js'
import env from '../config/env.js'
import { authGuard } from '../middlewares/authguard.js'
const app = new Hono()


app.get('/', (c) => c.text('Hello from Hono!'))
app.route('/api', authRouter)
app.get(
  '/authenticated',
  authGuard(),
  (c) => {
    const user = c.get('user')
    return c.text('Authenticated route, hi ' + user.email)
  }
)
export default app
