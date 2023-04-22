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
		SELECT F.FollowerId
		FROM KSUConnect.Followers F
		WHERE F.FollowingId = @userId
	`, params )

	const users: User[] = []
	for( let i = 0; i < results.length; i++ ) {
		const result = results[i]
		const userId = result.FollowerId

		const user = await getUser( userId )

		if( user ) {
			users.push( user )
		}
	}

	res.status( 200 ).json( { users } )
}

export async function getNumFollowers( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId as string
	}]

	const results = await executeQuery( `
		SELECT COUNT(*) AS NumFollowers
		FROM KSUConnect.Followers F
		WHERE F.FollowingId = @userId
	`, params )
	const result = parseInt( results[0].NumFollowers )

	return result
}
