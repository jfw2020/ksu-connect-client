import { User } from "@/types/userType"
import Router from "next/router"
import React from "react"
import useSWR from "swr"

// Allows access to the user that is currently logged in
export default function useUser( {
	redirectTo = "",
	redirectIfFound = false
} = {} ) {
	const {
		data: user,
		mutate: mutateUser
	} = useSWR<User>( "/api/user",  )

	React.useEffect( () => {
		if ( !redirectTo || !user ) {
			return
		}

		// Redirect if the user's session is invalid or if we want to redirect if it is valid
		if( ( redirectTo && !redirectIfFound && !user.isLoggedIn ) || ( redirectIfFound && user.isLoggedIn ) ) {
			Router.push( redirectTo )
		}
	}, [user, redirectIfFound, redirectTo] )

	return {
		user,
		mutateUser
	}
}
