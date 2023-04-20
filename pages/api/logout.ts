import type { NextApiRequest, NextApiResponse } from "next"
import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "@/lib/session"

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
		userId: -1,
		username: ""
	} )
}

export default withIronSessionApiRoute( handler, sessionOptions )
