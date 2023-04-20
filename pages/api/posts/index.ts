import executeQuery from "@/lib/db"
import { Post } from "@/types/postType"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const results = await executeQuery( `
		SELECT P.PostId, P.UserId, P.Content, P.CreatedOn, P.UpdatedOn
		FROM KSUConnect.Posts P;
	` )

	const posts: Post[] = results.map( result => ( {
		postId: result.PostId,
		userId: result.UserId,
		content: result.Content,
		createdOn: new Date( result.CreatedOn ),
		updatedOn: new Date( result.UpdatedOn )
	} ) )

	res.status( 200 ).json( { posts } )
}
