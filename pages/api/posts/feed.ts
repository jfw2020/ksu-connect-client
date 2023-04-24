import executeQuery, { IQueryParam } from "@/lib/db"
import { sessionOptions } from "@/lib/session"
import { Post } from "@/types/postType"
import { User } from "@/types/userType"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiRequest, NextApiResponse } from "next"

async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const userId = req.session.user?.userId.toString() || "0"

	const {
		posts,
		users
	} = await getFeed( userId )

	res.status( 200 ).json( { 
		posts,
		users
	} )
}

export async function getFeed( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId
	}]

	let results = await executeQuery( `
		SELECT P.PostId, P.UserId, P.Content, P.CreatedOn, P.UpdatedOn
		FROM KSUConnect.Followers F
			INNER JOIN KSUConnect.Posts P ON P.UserId = F.FollowingId
		WHERE F.FollowerId = @userId
			OR P.UserId = @userId
		ORDER BY P.UpdatedOn DESC
	`, params )

	const posts: Post[] = results.map( result => ( {
		postId: result.PostId,
		userId: result.UserId,
		content: result.Content,
		createdOn: result.CreatedOn,
		updatedOn: result.UpdatedOn
	} ) )

	results = await executeQuery( `
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl
		FROM KSUConnect.Followers F
			INNER JOIN KSUConnect.Users U ON U.UserId = F.FollowingId
		WHERE F.FollowerId = @userId
			OR U.UserId = @userId
	`, params )

	const users: User[] = results.map( result => ( {
		userId: result.UserId,
		username: result.Username,
		firstName: result.FirstName,
		lastName: result.LastName,
		imageUrl: result.ImageUrl,
		categories: [],
		majors: []
	} ) )

	return {
		posts,
		users
	}
}

export default withIronSessionApiRoute( handler, sessionOptions )
