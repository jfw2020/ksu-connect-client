import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { getUser } from "../users/[userId]"

/**
 * /api/followers/[userId]
 * 
 * GET:
 * Returns a list of all the followerIds that the given [userId] is followed by
 */
export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { userId } = req.query

	const followerIds = await getFollowerIds( userId as string )

	const users: User[] = []
	for( let i = 0; i < followerIds.length; i++ ) {
		const user = await getUser( followerIds[i] )

		if( user ) {
			users.push( user )
		}
	}

	res.status( 200 ).json( { users } )
}

// Returns the number of followers of a given userId
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

// Returns a list of followerIds that follow a given userId
export async function getFollowerIds( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId as string
	}]

	const results = await executeQuery( `
		SELECT F.FollowerId
		FROM KSUConnect.Followers F
		WHERE F.FollowingId = @userId
	`, params )

	return results.map( result => result.FollowerId )
}
