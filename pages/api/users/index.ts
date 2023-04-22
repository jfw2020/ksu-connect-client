import executeQuery from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { getCategories, getMajors } from "./[userId]"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const results = await executeQuery( `
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl
		FROM KSUConnect.Users U;
	` )

	const users: User[] = []
	for( let i = 0; i < results.length; i++ ) {
		const result = results[i]
		const userId = result.UserId

		const majors = await getMajors( userId )
		const categories = await getCategories( userId )

		const user: User = {
			userId,
			username: result.Username,
			firstName: result.FirstName,
			lastName: result.LastName,
			imageUrl: result.ImageUrl,
			majors,
			categories
		}

		users.push( user )
	}

	res.status( 200 ).json( { users } )
}
