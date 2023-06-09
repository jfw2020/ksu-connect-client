import type { NextApiRequest, NextApiResponse } from "next"
import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "@/lib/session"
import { getCategories, getMajors } from "./users/[userId]"

/**
 * /api/login
 * 
 * POST:
 * Logs in a user with a given username and password. Makes sure to update the req.session object
 * to show that a user is currently logged in.
 */
async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const passwordHash = req.body.password // For our purposes, we don't actually need to hash this, but we would in a production environment

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
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl, SS.Status 
		FROM KSUConnect.Users U
			INNER JOIN KSUConnect.SchoolStatuses SS ON SS.SchoolStatusId = U.SchoolStatusId
		WHERE U.Username = @username
			AND U.PasswordHash = @passwordHash;
	`, params )
	const result = results[0]

	if( !result ) {
		res.status( 500 ).json( { message: "Invalid username or password" } )
	}
	else {
		const userId = result.UserId

		const majors = await getMajors( userId )
		const categories = await getCategories( userId )

		const user: User = {
			userId,
			username: result.Username,
			firstName: result.FirstName,
			lastName: result.LastName,
			imageUrl: result.ImageUrl,
			status: result.Status,
			isLoggedIn: true,
			majors,
			categories
		}

		req.session.user = user
		await req.session.save()

		res.status( 200 ).json( { user } )
	}
}

export default withIronSessionApiRoute( handler, sessionOptions )
