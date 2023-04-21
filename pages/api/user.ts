import { sessionOptions } from "@/lib/session"
import { User } from "@/types/userType"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiRequest, NextApiResponse } from "next"

async function handler( req: NextApiRequest, res: NextApiResponse<User> ) {
	if( req.session.user ) {
		res.json( {
			...req.session.user,
			isLoggedIn: true
		} )
	}
	else {
		res.json( {
			firstName: "",
			lastName: "",
			imageUrl: "",
			isLoggedIn: false,
			userId: -1,
			username: ""
		} )
	}
}

export default withIronSessionApiRoute( handler, sessionOptions )
