import executeQuery, { IQueryParam } from "@/lib/db"
import { sessionOptions } from "@/lib/session"
import { withIronSessionApiRoute } from "iron-session/next"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * /api/categories
 * 
 * POST:
 * Adds categories to the currently logged in user
 */
async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const userId = req.session.user?.userId || 0
	const { categories } = req.body

	for( let i = 0; i < categories.length; i++ ) {
		const params: IQueryParam[] = [
			{
				name: "userId",
				value: userId
			},
			{
				name: "category",
				value: categories[i]
			}
		]
	
		await executeQuery( `
			INSERT KSUConnect.UserCategories(UserId, CategoryId)
			SELECT @userId, C.CategoryId
			FROM KSUConnect.Categories C
			WHERE C.[Name] = @category
		`, params )
	}

	res.status( 200 ).json( { message: "Success" } )
}

export default withIronSessionApiRoute( handler, sessionOptions )
