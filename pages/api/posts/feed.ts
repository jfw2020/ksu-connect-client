import executeQuery, { IQueryParam } from "@/lib/db"
import { sessionOptions } from "@/lib/session"
import { Post } from "@/types/postType"
import { User } from "@/types/userType"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * /api/posts/feed
 * 
 * GET:
 * Returns a feed for the currently logged in user. This consists of all the
 * posts from the users that the logged in user follows.
 */
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

// Returns a list of posts from all the users that a given userId follows
export async function getFeed( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId
	}]

	let results = await executeQuery( `
		SELECT P.PostId, P.UserId, P.Content, P.CreatedOn, P.UpdatedOn
		FROM KSUConnect.Posts P
		WHERE P.UserId = @userId
			OR P.UserId IN
			(
				SELECT F.FollowingId
				FROM KSUConnect.Followers F
				WHERE F.FollowerId = @userId
			)
		ORDER BY P.CreatedOn DESC
	`, params )

	const posts: Post[] = results.map( result => ( {
		postId: result.PostId,
		userId: result.UserId,
		content: result.Content,
		createdOn: result.CreatedOn,
		updatedOn: result.UpdatedOn
	} ) )

	results = await executeQuery( `
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl, SS.Status 
		FROM KSUConnect.Followers F
			INNER JOIN KSUConnect.Users U ON U.UserId = F.FollowingId
			INNER JOIN KSUConnect.SchoolStatuses SS ON SS.SchoolStatusId = U.SchoolStatusId
		WHERE F.FollowerId = @userId
			OR U.UserId = @userId
	`, params )

	const users: User[] = results.map( result => ( {
		userId: result.UserId,
		username: result.Username,
		firstName: result.FirstName,
		lastName: result.LastName,
		imageUrl: result.ImageUrl,
		status: result.Status,
		categories: [],
		majors: []
	} ) )

	return {
		posts,
		users
	}
}

export default withIronSessionApiRoute( handler, sessionOptions )
