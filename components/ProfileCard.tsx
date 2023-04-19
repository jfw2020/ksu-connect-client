import { User } from "@/types/userType"
import { Avatar, Divider, Stack, Typography } from "@mui/material"

export default function ProfileCard() {
	const user: User = {
		firstName: "Jacob",
		lastName: "Williams",
		username: "jfw2020",
		userId: 1,
		imageUrl: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
	}

	return (
		<Stack
			sx={{
				padding: 2,
				borderRadius: 3,
				backgroundColor: "white",
			}}
			border="1px solid"
			borderColor="divider"
			divider={<Divider />}
			gap={1}
		>
			<Stack alignItems="center">
				<Avatar 
					alt={`${user.firstName} ${user.lastName}`}
					src={user.imageUrl}
					sx={{
						width: 64,
						height: 64,
						justifySelf: "center"
					}}
				/>
				<Typography variant="h6">{user.firstName} {user.lastName}</Typography>
				<Typography variant="caption">Computer Science</Typography>
			</Stack>
			<Stack>
				<Typography variant="subtitle2">Network</Typography>
				<Typography variant="caption">10 followers</Typography>
				<Typography variant="caption">15 posts</Typography>
			</Stack>
		</Stack>
	)
}
