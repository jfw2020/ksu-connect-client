import { useAppDispatch } from "@/hooks"
import { User } from "@/types/userType"
import { Stack, Typography, CircularProgress } from "@mui/material"
import axios from "axios"
import * as React from "react"
import UserRow from "./UserRow"

/**
 * Props for the RecommendedUsersCard component
 */
interface RecommendUsersCardProps {
	userId: number
}

/**
 * RecommendedUsersCard Component
 * 
 * This component displays all of the recommended users for a user to follow.
 */
export default function RecommendedUsersCard( props: RecommendUsersCardProps ) {
	/**
	 * Hooks
	 */
	// Dispatches an action to the store
	const dispatch = useAppDispatch()

	/**
	 * State
	 */
	// State that holds the list of recommended users
	const [ users, setUsers ] = React.useState( [] as User[] )
	// State that holds if the users are loading from the DB
	const [ loading, setLoading ] = React.useState( true )

	/**
	 * Effects
	 */
	// Initial render - initializes the users state
	React.useEffect( () => {
		const fetchUsers = async () => {
			const response = await axios.post( "/api/users/recommended", {
				userId: props.userId
			} )

			const newUsers: User[] = response.data.users

			setUsers( newUsers )
		}

		fetchUsers().then( () => {
			setLoading( false )
		} ) 
	}, [dispatch, props.userId] )

	/**
	 * Render
	 */
	return (
		<Stack
			sx={{
				padding: 2,
				borderRadius: 3,
				backgroundColor: "white",
			}}
			border="1px solid"
			borderColor="divider"
			gap={1}
		>
			<Typography variant="h6">Recommended Users</Typography>
			{loading && (
				<CircularProgress 
					sx={{ 
						alignSelf: "center" 
					}} 
				/>
			)}
			{!loading && users.length === 0 && (
				<Typography>No Users</Typography>
			)}
			{!loading && users.map( user => (
				<UserRow 
					user={user}
					key={user.userId}
				/>
			) )}
		</Stack>
	)
}


