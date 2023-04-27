import { getMajorsText } from "@/lib/helpers"
import { User } from "@/types/userType"
import { Box, Avatar, Typography, Stack } from "@mui/material"
import Link from "next/link"

/**
 * Props for the UserRow component
 */
interface UserRowProps {
	user: User
	onClick?: () => void
}

/**
 * UserRow Component
 * 
 * This component shows an at-a-glance view of a user's information
 */
export default function UserRow( props: UserRowProps ) {
	/**
	 * Render
	 */
	return (
		<Link href={`/user/${props.user.userId}`} onClick={props.onClick}>
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
					<Typography variant="subtitle2">{props.user.firstName} {props.user.lastName} | {props.user.status}</Typography>
					<Typography variant="caption">{getMajorsText( props.user.majors )}</Typography>
				</Stack>
			</Box>
		</Link>
	)
}