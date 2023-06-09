// Fetches JSON for SWR
export default async function fetchJson( input: RequestInfo | URL, init: RequestInit | undefined ) {
	const response = await fetch( input, init )

	// If the server replies, there's always some data in json
	// If there's a network error, it will throw at the previous line
	const data = await response.json()

	// response.ok is true when res.status is 2xx
	// https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
	if ( response.ok ) {
		return data
	}

	throw new FetchError( {
		message: response.statusText,
		response,
		data,
	} )
}

// Class for throwing a custom error
export class FetchError extends Error {
	response
	data
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	constructor( { message, response, data } ) {
		// Pass remaining arguments (including vendor specific ones) to parent constructor
		super( message )

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if ( Error.captureStackTrace ) {
			Error.captureStackTrace( this, FetchError )
		}

		this.name = "FetchError"
		this.response = response
		this.data = data ?? { message: message }
	}
}
