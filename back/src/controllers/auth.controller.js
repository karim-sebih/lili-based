// back/src/controllers/auth.controller.js
import authService from '../services/auth.service.js'

export const register = async (c) => {
  try {
    const data = await c.req.json()
    console.log("CONTROLLER → reçu :", data)

    const user = await authService.register(data)
    return c.json({ message: "OK", data: { user } }, 201)
  } catch (error) {
    console.error("REGISTER ERROR:", error.message)
    return c.json({ message: error.message }, 400)
  }
}

export const login = async (c) => {
  try {
    const { email, password } = await c.req.json()
    const result = await authService.login(email, password)
    return c.json({ message: 'Login successful', data: result }, 200)
  } catch (error) {
    return c.json({ message: error.message }, 401)
  }
}

// Les autres fonctions (forgot, reset, etc.) restent vides pour l'instant
export const forgotPassword = async (c) => c.json({ message: 'Pas encore implémenté' }, 501)
export const resetPassword = async (c) => c.json({ message: 'Pas encore implémenté' }, 501)
export const sendVerification = async (c) => c.json({ message: 'Pas encore implémenté' }, 501)
export const verifyUserEmail = async (c) => c.json({ message: 'Pas encore implémenté' }, 501)