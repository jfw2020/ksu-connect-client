import { useAppDispatch } from "@/hooks"
import { User } from "@/types/userType"
import { Stack, Typography, Box, Avatar, CircularProgress } from "@mui/material"
import axios from "axios"
import Link from "next/link"
import * as React from "react"

export default function RecommendedUsersCard() {
	/**
	 * Hooks
	 */
	const dispatch = useAppDispatch()

	/**
	 * State
	 */
	const [ users, setUsers ] = React.useState( [] as User[] )
	const [ loading, setLoading ] = React.useState( true )

	/**
	 * Effects
	 */
	// Initial render - initializes the users state
	React.useEffect( () => {
		const fetchUsers = async () => {
			const response = await axios( "/api/users" )

			const newUsers: User[] = response.data.users

			setUsers( newUsers )
		}

		fetchUsers().then( () => {
			setLoading( false )
		} ) 
	}, [ dispatch ] )
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
			{!loading && users.map( user => (
				<Link
					key={user.userId}
					href={`/user/${user.userId}`}
				>
					<UserRow 
						user={user}
					/>
				</Link>
			) )}
		</Stack>
	)
}

interface UserRowProps {
	user: User
}

function UserRow( props: UserRowProps ) {
	return (
		<Box
			sx={{
				display: "flex",
				gap: 1
			}}
		>
			<Avatar 
				alt={`${props.user.firstName} ${props.user.lastName}`}
				src={props.user.imageUrl}
			/>
			<Typography variant="subtitle2">{props.user.firstName} {props.user.lastName}</Typography>
		</Box>
	)
}
