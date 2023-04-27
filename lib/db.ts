import sql from "mssql"

// Configuration for the sql connection - pulls from the .env.local file
const config: sql.config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_HOST || "localhost",
	database: process.env.DB_DATABASE,
	port: parseInt( process.env.DB_PORT || "1433" ),
	options: {
		trustServerCertificate: true,
	},
}

// Interface for parameters that get passed into sql queries
export interface IQueryParam {
	name: string
	value: number | string
}

// Executes a given query with given params
export default async function executeQuery( query: string, params?: IQueryParam[] ) {
	// Connect to the DB
	const pool = await sql.connect( process.env.DB_CONNECTION_STRING || config )

	const request = pool.request()
	// If params exists, input them into the query
	params?.forEach( param => request.input( param.name, param.value ) )

	const results = await request.query( query )

	// Return the recordset from the query
	return results.recordset
}
