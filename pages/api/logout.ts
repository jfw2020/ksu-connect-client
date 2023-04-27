import type { NextApiRequest, NextApiResponse } from "next"
import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "@/lib/session"

/**
 * /api/logout
 * 
 * GET:
 * Logs the current user out of the system.
 */
async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	req.session.destroy()

	res.status( 200 ).json( {
		firstName: "",
		lastName: "",
		imageUrl: "",
		isLoggedIn: false,
		userId: 0,
		username: ""
	} )
}

export default withIronSessionApiRoute( handler, sessionOptions )
