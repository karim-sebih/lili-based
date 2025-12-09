// back/src/services/auth.service.js

import { hashPassword } from '../utils/password.js'
import { sign } from 'hono/jwt'
import env from '../config/env.js'
import { comparePassword } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'
import db from '../config/database.js'



async function findUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
  return stmt.get(email)
}


async function register(data) {
  console.log("AUTH SERVICE → register appelé avec :", data)

  const { firstname, lastname, email, password } = data

  // Vérif doublon
  if (await findUserByEmail(email)) {
    throw new Error('Cet email est déjà utilisé')
  }

  // Hash du mot de passe
  const hashedPassword = await hashPassword(password)

  // INSERT DIRECT (aucune ambiguïté)
  try {
    const result = db.prepare(`
      INSERT INTO users (first_name, last_name, email, password, role, verified)
      VALUES (?, ?, ?, ?, 'resto', 1)
    `).run(firstname, lastname, email, hashedPassword)

    console.log("INSERT RÉUSSI → Nouvel ID :", result.lastInsertRowid)

    const newUser = db.prepare('SELECT id, first_name, last_name, email, role FROM users WHERE id = ?')
                      .get(result.lastInsertRowid)

    return newUser
  } catch (err) {
    console.error("ERREUR SQL DANS REGISTER :", err)
    throw new Error('Impossible de créer l’utilisateur')
  }
}


async function login(email, password) {
  const user = await findUserByEmail(email)
  if (!user) throw new Error('Identifiants incorrects')

  const isValid = await comparePassword(password, user.password)
  if (!isValid) throw new Error('Identifiants incorrects')

  const token = await generateToken(user)

  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    },
    token
  }
}

async function forgotPassword() {}
async function resetPassword() {}
async function sendEmailVerification() {}
async function verifyEmail() {}

export default {
  register,
  findUserByEmail,
  login,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
}