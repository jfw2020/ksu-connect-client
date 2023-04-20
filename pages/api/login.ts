import type { NextApiRequest, NextApiResponse } from "next"
import executeQuery from "@/lib/db"
import { User } from "@/types/userType"
import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "@/lib/session"

async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const passwordHash = req.body.password

	const results = await executeQuery( `
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl
		FROM KSUConnect.Users U
		WHERE U.Username = N'${req.body.username}'
			AND U.PasswordHash = N'${passwordHash}';
	` )
	const result = results[0]

	if( !result ) {
		res.status( 500 ).json( { message: "Invalid username or password" } )
	}
	else {
		const user: User = {
			userId: result.UserId,
			username: result.Username,
			firstName: result.FirstName,
			lastName: result.LastName,
			imageUrl: result.ImageUrl,
			isLoggedIn: true
		}

		req.session.user = user
		await req.session.save()

		res.status( 200 ).json( { user } )
	}
}

export default withIronSessionApiRoute( handler, sessionOptions )
