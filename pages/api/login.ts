import type { NextApiRequest, NextApiResponse } from "next"
import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "@/lib/session"

async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const passwordHash = req.body.password // TODO hash this password

	const params: IQueryParam[] = [
		{
			name: "username",
			value: req.body.username as string,
		},
		{
			name: "passwordHash",
			value: passwordHash
		}
	]

	const results = await executeQuery( `
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl
		FROM KSUConnect.Users U
		WHERE U.Username = @username
			AND U.PasswordHash = @passwordHash;
	`, params )
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
