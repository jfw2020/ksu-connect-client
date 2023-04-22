import { NextApiRequest, NextApiResponse } from "next"
import { getPosts } from ".."
import executeQuery, { IQueryParam } from "@/lib/db"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { userId } = req.query

	const {
		posts,
		users
	} = await getPosts( userId as string )

	res.status( 200 ).json( { 
		posts,
		users
	} )
}

export async function getNumPosts( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId as string
	}]

	const results = await executeQuery( `
		SELECT COUNT(*) AS NumPosts
		FROM KSUConnect.Posts P
		WHERE P.UserId = @userId
	`, params )
	const result = parseInt( results[0].NumPosts )

	return result
}
