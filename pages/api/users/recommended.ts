import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"
import { getCategories, getMajors } from "./[userId]"

/**
 * /api/users/recommended
 * 
 * GET:
 * Returns a list of users that are recommended for a given userId to follow.
 * The recommendation algorithm works in the following way:
 * 		A User is given 4 points for each major they share with the userId
 * 		A User is given 2 points for each category they share with the userId
 * 		A User is given 1 point for each User that both User and userId are following
 * These points are then totaled into a "Recommendedness" score, and the Users with the
 * highest scores are then recommended to the userId
 */
export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { userId } = req.body

	const params: IQueryParam[] = [{
		name: "userId",
		value: userId
	}]

	const results = await executeQuery( `
		SELECT TOP(5) U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl, SS.Status,
			4 * (
				SELECT COUNT(*) 
				FROM 
				( 
					SELECT UM1.MajorId 
					FROM KSUConnect.UserMajors UM1
					WHERE UM1.UserId = @UserId
					
					INTERSECT 
					
					SELECT UM2.MajorId 
					FROM KSUConnect.UserMajors UM2
					WHERE UM2.UserId = U.UserId
				) AS SimilarMajors
			) +
			2 * (
				SELECT COUNT(*)
				FROM 
				( 
					SELECT UC1.CategoryId
					FROM KSUConnect.UserCategories UC1
					WHERE UC1.UserId = @UserId
					
					INTERSECT 
					
					SELECT UC2.CategoryId
					FROM KSUConnect.UserCategories UC2
					WHERE UC2.UserId = U.UserId
				) AS SimilarCategories
			) +
			(
				SELECT COUNT(*) 
				FROM 
				( 
					SELECT F1.FollowingId 
					FROM KSUConnect.Followers F1 
					WHERE F1.FollowerId = @UserId
					
					INTERSECT 
					
					SELECT F2.FollowingId 
					FROM KSUConnect.Followers F2
					WHERE F2.FollowerId = U.UserId
				) AS SimilarFollowers 
			) AS Recommendedness
		FROM KSUConnect.Users U
			INNER JOIN KSUConnect.SchoolStatuses SS ON SS.SchoolStatusId = U.SchoolStatusId
		WHERE U.UserId <> @UserId
		AND U.UserId NOT IN
			(
				SELECT F.FollowingId
				FROM KSUConnect.Followers F
				WHERE F.FollowerId = @UserId
			)
		GROUP BY U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl, SS.Status
		ORDER BY Recommendedness DESC
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

	res.status( 200 ).json( { users } )
}
