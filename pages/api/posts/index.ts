import executeQuery from "@/lib/db"
import { Post } from "@/types/postType"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
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
			await executeQuery( `
                INSERT KSUConnect.Posts(UserId, Content)
                VALUES(1, N'${body.content}');
            ` )

			res.status( 200 ).json( { message: "Success" } )
		}
	}
	
}

async function getPosts() {
	let results = await executeQuery( `
		SELECT P.PostId, P.UserId, P.Content, P.CreatedOn, P.UpdatedOn
		FROM KSUConnect.Posts P
		ORDER BY P.UpdatedOn DESC;
	` )

	const posts: Post[] = results.map( result => ( {
		postId: result.PostId,
		userId: result.UserId,
		content: result.Content,
		createdOn: new Date( result.CreatedOn ),
		updatedOn: new Date( result.UpdatedOn )
	} ) )

	results = await executeQuery( `
		SELECT DISTINCT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl
		FROM KSUConnect.Posts P
			INNER JOIN KSUConnect.Users U ON U.UserId = P.UserId
	` )

	const users: User[] = results.map( result => ( {
		userId: result.UserId,
		username: result.Username,
		firstName: result.FirstName,
		lastName: result.LastName,
		imageUrl: result.ImageUrl
	} ) )

	return {
		posts,
		users
	}
}
