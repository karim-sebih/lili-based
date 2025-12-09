import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import db from "../config/database.js";
import { forgotPassword, login, register, resetPassword, sendVerification, verifyUserEmail } from "../controllers/auth.controller.js";
const authRouter = new Hono()
console.log("ROUTE /users appelée !")
// Liste tous les utilisateurs (protégée ou pas selon toi)
authRouter.get('/users', async (c) => {
  try {
    console.log("ROUTE /users appelée !")

    // VERSION QUI MARCHE À 100000% AVEC TON WRAPPER LIBSQL
    const stmt = db.prepare('SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC')
    const result = stmt.all()   // .all() retourne directement un tableau d'objets

    console.log("Utilisateurs trouvés :", result.length)
    console.log("Premier utilisateur :", result[0])

    return c.json({
      success: true,
      count: result.length,
      data: result
    }, 200)

  } catch (error) {
    console.error("ERREUR /users :", error)
    return c.json({ 
      success: false, 
      message: "Erreur serveur",
      error: error.message 
    }, 500)
  }
})

authRouter.post(
  "/register",
  zValidator('json', z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Minimum 8 caractères"),
    firstname: z.string().min(2),
    lastname: z.string().min(2),
  })),
  register   // ← ton contrôleur qui appelle authService.register
)

authRouter.post(
  "/login",
  zValidator('json',
    z.object({
      email: z.string().email("Invalid email"),
      password: z.string().min(8),
    })
  ),
  login
);

authRouter.post(
  "/forgot-password",
  zValidator('json',
    z.object({
      email: z.string().email("Invalid email"),
    })
  ),
  forgotPassword
);

authRouter.post(
  "/reset-password",
  zValidator('json',
    z.object({
      token: z.string(),
      password: z.string().min(8),
    })
  ),
  resetPassword
);

authRouter.post(
  "/send-verification",
  zValidator('json',
    z.object({
      email: z.string().email("Invalid email"),
    })
  ),
  sendVerification
);

authRouter.get(
  "/verify/:token",
  verifyUserEmail
);

export default authRouter;
