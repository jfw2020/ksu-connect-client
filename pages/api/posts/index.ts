import executeQuery, { IQueryParam } from "@/lib/db"
import { Post } from "@/types/postType"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "@/lib/session"

async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { 
		method, 
		body 
	} = req

	switch( method ) {
		case "GET": {
			const {
				posts,
				users
			} = await getPosts()

			res.status( 200 ).json( { 
				posts,
				users
			} )
			break
		}
		case "POST": {
			const userId = req.session.user?.userId || 0

			const params: IQueryParam[] = [
				{
					name: "userId",
					value: userId
				},
				{
					name: "content",
					value: body.content as string
				}
			]

			const results = await executeQuery( `
                INSERT KSUConnect.Posts(UserId, Content)
				OUTPUT INSERTED.*
                VALUES(@userId, @content);
            `, params )
			const result = results[0]

			if( result ) {
				const post: Post = {
					postId: result.PostId,
					userId: result.UserId,
					content: result.Content,
					createdOn: result.CreatedOn,
					updatedOn: result.UpdatedOn
				}

				res.status( 200 ).json( { post } )
			}
			else {
				res.status( 500 ).json( { message: "Unable to create post" } )
			}
		}
	}
	
}

export async function getPosts( userId?: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId || ""
	}]

	let query = `
		SELECT P.PostId, P.UserId, P.Content, P.CreatedOn, P.UpdatedOn
		FROM KSUConnect.Posts P
		ORDER BY P.UpdatedOn DESC;
	`
	if( userId ) {
		query = `
			SELECT P.PostId, P.UserId, P.Content, P.CreatedOn, P.UpdatedOn
			FROM KSUConnect.Posts P
			WHERE P.UserId = @userId
			ORDER BY P.UpdatedOn DESC;
		`
	}

	let results = await executeQuery( query, params )

	const posts: Post[] = results.map( result => ( {
		postId: result.PostId,
		userId: result.UserId,
		content: result.Content,
		createdOn: result.CreatedOn,
		updatedOn: result.UpdatedOn
	} ) )

	results = await executeQuery( `
		SELECT DISTINCT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl, SS.Status 
		FROM KSUConnect.Posts P
			INNER JOIN KSUConnect.Users U ON U.UserId = P.UserId
			INNER JOIN KSUConnect.SchoolStatuses SS ON SS.SchoolStatusId = U.SchoolStatusId
	` )

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
