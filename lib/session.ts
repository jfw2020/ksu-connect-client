import { User } from "@/types/userType"
import { IronSessionOptions } from "iron-session"

// Options to give to API routes that need to access session.user
export const sessionOptions: IronSessionOptions = {
	password: process.env.SECRET_COOKIE_PASSWORD as string,
	cookieName: "iron-session/ksuconnect",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production"
	}
}

// Adds the user property to req.session in API routes
declare module "iron-session" {
	interface IronSessionData {
		user?: User
	}
}
