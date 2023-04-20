import { User } from "@/types/userType"
import { Avatar, Divider, Stack, Typography } from "@mui/material"

interface ProfileCardProps {
	user: User
}

export default function ProfileCard( props: ProfileCardProps ) {
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
					alt={`${props.user.firstName} ${props.user.lastName}`}
					src={props.user.imageUrl}
					sx={{
						width: 64,
						height: 64,
						justifySelf: "center"
					}}
				/>
				<Typography variant="h6">{props.user.firstName} {props.user.lastName}</Typography>
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
