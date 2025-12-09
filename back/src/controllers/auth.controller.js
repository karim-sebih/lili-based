// back/src/controllers/auth.controller.js
import authService from '../services/auth.service.js'

export const register = async (c) => {
  try {
    const data = await c.req.json()
    console.log("CONTROLLER → reçu :", data)

    const user = await authService.register(data)

    return c.json({
      message: 'Inscription réussie !',
      data: {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        }
      }
    }, 201)

  } catch (error) {
    console.error("ERREUR REGISTER :", error.message)
    return c.json({ message: error.message || 'Erreur inscription' }, 400)
  }
}

export const login = async (c) => {
  try {
    const { email, password } = await c.req.json()
    console.log("LOGIN → tentative pour :", email)

    const result = await authService.login(email, password)

    return c.json({
      message: 'Connexion réussie',
      data: result
    }, 200)

  } catch (error) {
    console.log("LOGIN ÉCHOUÉ :", error.message)
    return c.json({ message: error.message }, 401)
  }
}

// Les autres fonctions (forgot, reset, etc.) restent vides pour l'instant
export const forgotPassword = async (c) => c.json({ message: 'Pas encore implémenté' }, 501)
export const resetPassword = async (c) => c.json({ message: 'Pas encore implémenté' }, 501)
export const sendVerification = async (c) => c.json({ message: 'Pas encore implémenté' }, 501)
export const verifyUserEmail = async (c) => c.json({ message: 'Pas encore implémenté' }, 501)