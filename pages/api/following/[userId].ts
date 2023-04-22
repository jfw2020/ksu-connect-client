import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { getUser } from "../users/[userId]"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { userId } = req.query

	const params: IQueryParam[] = [{
		name: "userId",
		value: userId as string
	}]

	const results = await executeQuery( `
		SELECT F.FollowingId
		FROM KSUConnect.Followers F
		WHERE F.FollowerId = @userId
	`, params )

	const users: User[] = []
	for( let i = 0; i < results.length; i++ ) {
		const result = results[i]
		const userId = result.FollowingId

		const user = await getUser( userId )

		if( user ) {
			users.push( user )
		}
	}

	res.status( 200 ).json( { users } )
}
