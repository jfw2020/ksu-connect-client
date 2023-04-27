import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { getMajors, getCategories } from "../users/[userId]"

/**
 * /api/filters
 * 
 * GET:
 * Returns a list of all the SchoolStatuses, Majors, and Categories from the DB
 * 
 * POST:
 * Allows the user to send any combination of status, major, and category and returns
 * a list of Users that matches that query
 */
export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const {
		method,
		body
	} = req

	switch( method ) {
		case "GET": {
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
			break
		}
		case "POST": {
			// Querys the database for paginated results from a given status, major, or category
			const params: IQueryParam[] = [
				{
					name: "status",
					value: body.status,
				},
				{
					name: "major",
					value: body.major
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
				SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl, SS.Status,
					(
						SELECT ROUND(COUNT(*) / 10, 0) + 1
						FROM KSUConnect.Users U
							INNER JOIN KSUConnect.SchoolStatuses SS ON SS.SchoolStatusId = U.SchoolStatusId
						WHERE (@status = N'' OR SS.[Status] = @status)
							AND (@major = N'' OR @major IN 
								(
									SELECT M.[Name]
									FROM KSUConnect.UserMajors UM
										INNER JOIN KSUConnect.Majors M ON M.MajorId = UM.MajorId
									WHERE UM.UserId = U.UserId
								))
							AND (@category = N'' OR @category IN 
								(
									SELECT C.[Name]
									FROM KSUConnect.UserCategories UC
										INNER JOIN KSUConnect.Categories C ON C.CategoryId = UC.CategoryId
									WHERE UC.UserId = U.UserId
								))
					) AS PageCount
				FROM KSUConnect.Users U
					INNER JOIN KSUConnect.SchoolStatuses SS ON SS.SchoolStatusId = U.SchoolStatusId
				WHERE (@status = N'' OR SS.[Status] = @status)
					AND (@major = N'' OR @major IN 
						(
							SELECT M.[Name]
							FROM KSUConnect.UserMajors UM
								INNER JOIN KSUConnect.Majors M ON M.MajorId = UM.MajorId
							WHERE UM.UserId = U.UserId
						))
					AND (@category = N'' OR @category IN 
						(
							SELECT C.[Name]
							FROM KSUConnect.UserCategories UC
								INNER JOIN KSUConnect.Categories C ON C.CategoryId = UC.CategoryId
							WHERE UC.UserId = U.UserId
						))
				ORDER BY U.LastName ASC, U.FirstName ASC
				OFFSET ((@page - 1) * @pageSize) ROWS FETCH NEXT 10 ROWS ONLY;
			`, params )

			const users: User[] = []
			for( let i = 0; i < results.length; i++ ) {
				const result = results[i]
				const userId = result.UserId

				const majors = await getMajors( userId )
				const categories = await getCategories( userId )

				const user: User = {
					userId,
					username: result.Username,
					firstName: result.FirstName,
					lastName: result.LastName,
					imageUrl: result.ImageUrl,
					status: result.Status,
					majors,
					categories
				}

				users.push( user )
			}

			const pageCount = results.length > 0 ? results[0].PageCount : 0

			res.status( 200 ).json( { users, pageCount } )
		}
	}

	
}
