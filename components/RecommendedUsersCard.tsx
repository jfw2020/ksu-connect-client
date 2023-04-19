import { useAppSelector } from "@/hooks"
import { selectUserById, selectUserIds } from "@/slices/usersSlice"
import { Stack, Typography, Box, Avatar } from "@mui/material"

export default function RecommendedUsersCard() {
	const userIds = useAppSelector( selectUserIds )

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
			{userIds.map( userId => (
				<UserRow 
					key={userId}
					userId={userId}
				/>
			) )}
		</Stack>
	)
}

interface UserRowProps {
	userId: number
}

function UserRow( props: UserRowProps ) {
	const user = useAppSelector( state => selectUserById( state, props.userId ) )

	return (
		<Box
			sx={{
				display: "flex",
				gap: 1
			}}
		>
			<Avatar 
				alt={`${user.firstName} ${user.lastName}`}
				src={user.imageUrl}
			/>
			<Typography variant="subtitle2">{user.firstName} {user.lastName}</Typography>
		</Box>
	)
}
