import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { getUser } from "../users/[userId]"
import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "@/lib/session"

async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { 
		method,
		session,
		query
	} = req

	switch( method ) {
		case "GET": {
			const { userId } = query

			const followingIds = await getFollowingIds( userId as string )

			const users: User[] = []
			for( let i = 0; i < followingIds.length; i++ ) {
				const user = await getUser( followingIds[i] )

				if( user ) {
					users.push( user )
				}
			}

			res.status( 200 ).json( { users } )
			break
		}
		case "POST": {
			const followerId = session.user?.userId.toString() || "0"
			const followingId = query.userId as string

			const params: IQueryParam[] = [
				{
					name: "followerId",
					value: followerId
				},
				{
					name: "followingId",
					value: followingId
				}
			]

			await executeQuery( `
				INSERT KSUConnect.Followers(FollowerId, FollowingId)
				VALUES
					(@followerId, @followingId)
			`, params )

			res.status( 200 ).json( { message: "Success" } )
			break
		}
		case "DELETE": {
			const followerId = session.user?.userId.toString() || "0"
			const followingId = query.userId as string

			const params: IQueryParam[] = [
				{
					name: "followerId",
					value: followerId
				},
				{
					name: "followingId",
					value: followingId
				}
			]

			await executeQuery( `
				DELETE KSUConnect.Followers
				WHERE FollowerId = @followerId 
					AND FollowingId = @followingId
			`, params )

			res.status( 200 ).json( { message: "Success" } )
			break
		}
	}

	
}

export async function getFollowingIds( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId as string
	}]

	const results = await executeQuery( `
		SELECT F.FollowingId
		FROM KSUConnect.Followers F
		WHERE F.FollowerId = @userId
	`, params )

	return results.map( result => result.FollowingId )
}

export default withIronSessionApiRoute( handler, sessionOptions )
