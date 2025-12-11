// back/src/middlewares/authguard.js (updated to include org details)
import { verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import env from "../config/env.js";
import authService from "../services/auth.service.js";

export function authGuard() {
  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = await verify(token, env.JWT_SECRET);
      const fullUser = await authService.findUserWithOrg(decoded.id);
      if (!fullUser) {
        return c.json({ error: "User not found" }, 401);
      }

      c.set("user", fullUser);
      await next();
    } catch (error) {
      return c.json({ error: "Token invalid or expired" }, 401);
    }
  });
}