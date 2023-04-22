import executeQuery, { IQueryParam } from "@/lib/db"
import { User } from "@/types/userType"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	const { userId } = req.query

	const user = await getUser( userId as string )

	if( !user ) {
		res.status( 500 ).json( { message: "User not found" } )
	}
	else {
		res.status( 200 ).json( { user } )
	}
}

export async function getUser( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId
	}]

	const results = await executeQuery( `
		SELECT U.UserId, U.Username, U.FirstName, U.LastName, U.ImageUrl
		FROM KSUConnect.Users U
		WHERE U.UserId = @userId;
	`, params )
	const result = results[0]

	if( !result ) {
		return undefined
	}

	const majors = await getMajors( userId )
	const categories = await getCategories( userId )

	const user: User = {
		userId: result.UserId,
		username: result.Username,
		firstName: result.FirstName,
		lastName: result.LastName,
		imageUrl: result.ImageUrl,
		majors,
		categories
	}

	return user
}

export async function getMajors( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId
	}]

	const results = await executeQuery( `
		SELECT M.Name
		FROM KSUConnect.UserMajors UM
			INNER JOIN KSUConnect.Majors M ON M.MajorId = UM.MajorId
		WHERE UM.UserId = @userId
	`, params )
	
	return results.map( result => result.Name ) as string[]
}

export async function getCategories( userId: string ) {
	const params: IQueryParam[] = [{
		name: "userId",
		value: userId
	}]

	const results = await executeQuery( `
		SELECT C.Name
		FROM KSUConnect.UserCategories UC
			INNER JOIN KSUConnect.Categories C ON C.CategoryId = UC.CategoryId
		WHERE UC.UserId = @userId
	`, params )

	return results.map( result => result.Name ) as string[]
}
