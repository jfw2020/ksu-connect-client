import sql from "mssql"

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

export interface IQueryParam {
	name: string
	value: number | string
}

export default async function executeQuery( query: string, params?: IQueryParam[] ) {
	const pool = await sql.connect( config )

	const request = pool.request()
	params?.forEach( param => request.input( param.name, param.value ) )

	const results = await request.query( query )

	return results.recordset
}
