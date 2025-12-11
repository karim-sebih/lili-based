// back/src/routes/auth.router.js  ← remplace tout
import { Hono } from "hono"
import { register, login } from "../controllers/auth.controller.js"

const authRouter = new Hono()

// ON DÉSACTIVE ZOD POUR VOIR SI ÇA PASSE
authRouter.post("/register", async (c) => {
  try {
    const data = await c.req.json()
    console.log("RECEIVED:", data)  // ← TU VAS VOIR ÇA DANS LA CONSOLE
    return await register(c)
  } catch (err) {
    console.error("ERREUR:", err)
    return c.json({ message: err.message || "Erreur inconnue" }, 400)
  }
})

authRouter.post("/login", login)

export default authRouter