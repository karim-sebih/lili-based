import { verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import env from "../config/env.js";
import authService from "../services/auth.service.js";

export function authGuard() {
	return createMiddleware(async (c, next) => {
		const [prefix, token] = c.req.header("Authorization")?.split(" ") || [
			null,
			undefined,
		];
		if (prefix !== "Bearer") {
			return c.json({ error: "No Bearer token" }, 401);
			//throw new Error("Invalid token prefix");
		}
		if (!token) {
			return c.json({ error: "You must be authenticated to access this resource" }, 401);
			//throw new Error(
			//	"You must be authenticated to access this resource"
			//);
		}
		try {
			const decoded = (await verify(token, env.JWT_SECRET));
			if (!decoded) {
				//throw new Error("Invalid Payload");
				return c.json({ error: "Invalid Payload" }, 401);
			}

			const user = await authService.findUserByEmail(decoded.email);
			if (user) {
				c.set("user", user);
				await next();

			} else {
				return c.json({ error: "Permission denied, you are not authorized to access this resource" }, 401);
				await next();
				//throw new Error(
				//"Permission denied, you are not authorized to access this resource");
			}
		} catch (error) {
			return c.json({
				error: "Internal server error"
			}, 401);
		}
	})
}
