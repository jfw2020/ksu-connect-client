import { User } from "@/types/userType"
import { IronSessionOptions } from "iron-session"

export const sessionOptions: IronSessionOptions = {
	password: process.env.SECRET_COOKIE_PASSWORD as string,
	cookieName: "iron-session/ksuconnect",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production"
	}
}

declare module "iron-session" {
	interface IronSessionData {
		user?: User
	}
}
