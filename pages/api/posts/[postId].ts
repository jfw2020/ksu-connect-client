import executeQuery, { IQueryParam } from "@/lib/db"
import { Post } from "@/types/postType"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { 
		query, 
		method,
		body
	} = req

	switch( method ) {
		case "GET": {
			const params: IQueryParam[] = [{
				name: "postId",
				value: query.postId as string
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
					createdOn: result.CreatedOn,
					updatedOn: result.UpdatedOn
				}

				res.status( 200 ).json( { post } )
			}
			else {
				res.status( 500 ).json( { message: "Post not found" } )
			}
			break
		}
		case "POST": {
			const params: IQueryParam[] = [
				{
					name: "postId",
					value: query.postId as string
				},
				{
					name: "content",
					value: body.content as string
				}
			]

			await executeQuery( `
                UPDATE P
				SET
					Content = @content,
					UpdatedOn = SYSDATETIMEOFFSET()
				FROM KSUConnect.Posts P
				WHERE P.PostId = @postId
					AND P.Content <> @content
            `, params )

			res.status( 200 ).json( { message: "Success" } )
			break
		}
		case "DELETE": {
			const params: IQueryParam[] = [{
				name: "postId",
				value: query.postId as string
			}]

			await executeQuery( `
				DELETE PC
				FROM KSUConnect.PostCategories PC
				WHERE PC.PostId = @postId;

				DELETE P
				FROM KSUConnect.Posts P
				WHERE P.PostId = @postId;
			`, params )

			res.status( 200 ).json( { message: "Success"} )
		}
	}
}
