import { User } from "@/types/userType"
import Router from "next/router"
import React from "react"
import useSWR from "swr"

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

		if( ( redirectTo && !redirectIfFound && !user.isLoggedIn ) || ( redirectIfFound && user.isLoggedIn ) ) {
			Router.push( redirectTo )
		}
	}, [user, redirectIfFound, redirectTo] )

	return {
		user,
		mutateUser
	}
}
