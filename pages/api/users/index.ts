import executeQuery from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const results = await executeQuery( `
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl
		FROM KSUConnect.Users U;
	` )

	const users: User[] = results.map( result => ( {
		userId: result.UserId,
		username: result.Username,
		firstName: result.FirstName,
		lastName: result.LastName,
		imageUrl: result.ImageUrl
	} ) )

	res.status( 200 ).json( { users } )
}
