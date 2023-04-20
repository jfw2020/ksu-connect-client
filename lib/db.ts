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

export default async function executeQuery( query: string ) {
	const pool = await sql.connect( config )

	const results = await pool.query( query )

	return results.recordset
}
