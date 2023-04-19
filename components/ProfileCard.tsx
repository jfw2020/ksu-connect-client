import { Avatar, Divider, Stack, Typography } from "@mui/material"

export default function ProfileCard() {
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
					alt="Profile Image"
					src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
					sx={{
						width: 64,
						height: 64,
						justifySelf: "center"
					}}
				/>
				<Typography variant="h6">Jacob Williams</Typography>
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
