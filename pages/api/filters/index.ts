import executeQuery from "@/lib/db"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * /api/filters
 * 
 * GET:
 * Returns a list of all the SchoolStatuses, Majors, and Categories from the DB
 */
export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	// Gets all the filters from the DB
	const statuses = await executeQuery( `
		SELECT SS.Status
		FROM KSUConnect.SchoolStatuses SS
		ORDER BY SS.SchoolStatusId ASC;
	` )

	const majors = await executeQuery( `
		SELECT M.[Name]
		FROM KSUConnect.Majors M
		ORDER BY M.[Name] ASC;
	` )

	const categories = await executeQuery( `
		SELECT C.[Name]
		FROM KSUConnect.Categories C
		ORDER BY C.[Name] ASC;
	` )

	res.status( 200 ).json( {
		statuses: statuses.map( status => status.Status ),
		majors: majors.map( major => major.Name ),
		categories: categories.map( category => category.Name )
	} )
}
