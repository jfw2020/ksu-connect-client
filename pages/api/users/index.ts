import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { getCategories, getMajors } from "./[userId]"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { query } = req.body

	const params: IQueryParam[] = [{
		name: "query",
		value: query
	}]

	const results = await executeQuery( `
		SELECT TOP(10) U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl, SS.Status 
		FROM KSUConnect.Users U
			INNER JOIN KSUConnect.SchoolStatuses SS ON SS.SchoolStatusId = U.SchoolStatusId
		WHERE U.FirstName + ' ' + U.LastName LIKE '%' + ISNULL(@query, '') + '%';
	`, params )

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
			status: result.Status,
			majors,
			categories
		}

		users.push( user )
	}

	res.status( 200 ).json( { users } )
}
