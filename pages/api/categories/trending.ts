import executeQuery from "@/lib/db"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const results = await executeQuery( `
		SELECT TOP(3) C.[Name], COUNT(*) AS NumPosts
		FROM KSUConnect.Categories C
			INNER JOIN KSUConnect.PostCategories PC ON PC.CategoryId = C.CategoryId
			INNER JOIN KSUConnect.Posts P ON P.PostId = PC.PostId
		GROUP BY C.CategoryId, C.[Name]
		ORDER BY COUNT(*) DESC
	` )

	const labels = []
	const data = []
	for( let i = 0; i < results.length; i++ ) {
		const result = results[i]

		labels.push( result.Name )
		data.push( result.NumPosts )
	}

	res.status( 200 ).json( {
		labels,
		data
	} )
}
