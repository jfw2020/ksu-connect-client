import { User } from "@/types/userType"
import { Box, Avatar, Typography, Stack } from "@mui/material"

interface UserRowProps {
	user: User
}

export default function UserRow( props: UserRowProps ) {
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
			<Stack>
				<Typography variant="subtitle2">{props.user.firstName} {props.user.lastName}</Typography>
				<Typography variant="caption">Computer Science</Typography>
			</Stack>
		</Box>
	)
}