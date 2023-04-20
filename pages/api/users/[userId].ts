import executeQuery from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { userId } = req.query

	const results = await executeQuery( `
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl
		FROM KSUConnect.Users U
		WHERE U.UserId = ${userId};
	` )
	const result = results[0]

	if( result ) {
		const user: User = {
			userId: result.UserId,
			username: result.Username,
			firstName: result.FirstName,
			lastName: result.LastName,
			imageUrl: result.ImageUrl
		}

		res.status( 200 ).json( { user } )
	}
	else {
		res.status( 500 ).json( { message: "User not found" } )
	}
}
