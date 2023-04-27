import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { getUser } from "../users/[userId]"
import { Post } from "@/types/postType"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const {
		body
	} = req

	// Querys the database for paginated results from a given status, major, or category
	const params: IQueryParam[] = [
		{
			name: "status",
			value: body.status,
		},
		{
			name: "content",
			value: body.content
		},
		{
			name: "category",
			value: body.category
		},
		{
			name: "pageSize",
			value: 10
		},
		{
			name: "page",
			value: body.page
		}
	]

	const results = await executeQuery( `
		SELECT P.PostId, P.Content, P.UserId
		FROM KSUConnect.Posts P
			INNER JOIN KSUConnect.Users U ON P.UserId = U.UserId
		WHERE (@status = N'' OR U.SchoolStatusId = @status)
		AND (@content = N'' OR P.Content LIKE '%' + @content + '%')
		AND (@category = N'' OR 
			@category IN
				(
					SELECT PC.CategoryId 
					FROM KSUConnect.PostCategories PC
					WHERE PC.PostId = P.PostId
				))
		ORDER BY P.CreatedOn DESC
	`, params )

	const posts: Post[] = []
	const users: User[] = []
	for( let i = 0; i < results.length; i++ ) {
		const result = results[i]

		const post: Post = {
			content: result.Content,
			postId: result.PostId,
			userId: result.UserId,
			createdOn: result.CreatedOn,
			updatedOn: result.UpdatedOn
		}

		const user = await getUser( result.UserId )

		if( user ) {
			users.push( user )
		}
		posts.push( post )
	}

	const pageCount = results.length > 0 ? results[0].PageCount : 0

	res.status( 200 ).json( { posts, users, pageCount } )
}
