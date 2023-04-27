import { getMajorsText } from "@/lib/helpers"
import { User } from "@/types/userType"
import { Avatar, Divider, Link, Stack, Typography } from "@mui/material"

/**
 * Props for the ProfileCard component
 */
interface ProfileCardProps {
	user: User
	numFollowers: number
	numPosts: number
}

/**
 * ProfileCard Component
 * 
 * This component shows the currently logged in user's profile information
 */
export default function ProfileCard( props: ProfileCardProps ) {
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
			divider={<Divider />}
			gap={1}
		>
			<Link
				href={`/user/${props.user.userId}`}
				style={{
					color: "black",
					textDecoration: "none"
				}}
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
					<Typography variant="subtitle1">{props.user.status}</Typography>
					<Typography variant="caption">{getMajorsText( props.user.majors )}</Typography>
				</Stack>
			</Link>
			<Stack>
				<Typography variant="subtitle2">Network</Typography>
				<Typography variant="caption">{props.numFollowers} followers</Typography>
				<Typography variant="caption">{props.numPosts} posts</Typography>
			</Stack>
		</Stack>
	)
}
