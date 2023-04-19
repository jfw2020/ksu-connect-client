import { Avatar, Box, Typography } from "@mui/material"
import * as React from "react"

export default function PostCard() {
	return (
		<Box 
			padding={2} 
			border="1px solid"
			borderColor="divider"
			borderRadius={3}
			sx={{
				backgroundColor: "white"
			}}
		>
			<Box display="flex" flexDirection="row" gap={1}>
				<Avatar 
					alt="Profile Image"
					src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
				/>
				<Box>
					<Typography variant="subtitle2">Profile</Typography>
					<Typography variant="caption">Major</Typography>
				</Box>
			</Box>
			<Typography variant="body1">
				Had a great time representing Kiewit with my fellow campus ambassador at the T-Shirt Madness event last week.
			</Typography>
		</Box>
	)
}
