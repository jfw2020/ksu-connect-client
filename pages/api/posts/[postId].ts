import executeQuery, { IQueryParam } from "@/lib/db"
import { Post } from "@/types/postType"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { postId } = req.query

	const params: IQueryParam[] = [{
		name: "postId",
		value: postId as string
	}]

	const results = await executeQuery( `
		SELECT P.PostId, P.UserId, P.Content, P.CreatedOn, P.UpdatedOn
		FROM KSUConnect.Posts P
		WHERE P.PostId = @postId;
	`, params )
	const result = results[0]

	if( result ) {
		const post: Post = {
			postId: result.PostId,
			userId: result.UserId,
			content: result.Content,
			createdOn: new Date( result.CreatedOn ),
			updatedOn: new Date( result.UpdatedOn )
		}

		res.status( 200 ).json( { post } )
	}
	else {
		res.status( 500 ).json( { message: "Post not found" } )
	}
}
