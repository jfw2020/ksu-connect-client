import type { NextApiRequest, NextApiResponse } from "next"
import executeQuery from "@/lib/db"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const results = await executeQuery( `
		SELECT *
		FROM KSUConnect.Users;
	` )

	res.status( 200 ).json( results )
}
