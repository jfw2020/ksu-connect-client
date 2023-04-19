// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import sql from "mssql"

type Data = {
  name: string
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const config = {
		user: "sa",
		password: "GFuelGimmy1!guitaR",
		server: "localhost",
		database: "WideWorldImporters",
		port: 1401,
		options: {
			trustServerCertificate: true
		}
	}

	sql.connect( config, async ( err ) => {
		if ( err ) {
			console.log( err )
		}

		const request = new sql.Request()

		const records = await request.query( "SELECT * FROM [Application].Orders" )

		res.json( {test: "test"} )
	} )
}
