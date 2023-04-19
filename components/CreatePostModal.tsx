import { Avatar, Box, Button, Modal, Stack, TextField } from "@mui/material"
import * as React from "react"

interface CreatePostModalProps {
	open: boolean
	onClose?: () => void
}

export default function CreatePostModal( props: CreatePostModalProps ) {
	const [ text, setText ] = React.useState( "" )

	return (
		<Modal
			open={props.open}
			onClose={props.onClose}
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 500,
					backgroundColor: "white",
					borderRadius: 3,
					padding: 2
				}}
			>
				<Stack gap={1}>
					<Avatar 
						alt="Profile Image"
						src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
					/>
					<TextField 
						variant="standard"
						multiline
						rows={5}
						placeholder="What do you want to talk about?"
						value={text}
						onChange={e => setText( e.target.value )}
					/>
					<Button variant="contained">Post</Button>
				</Stack>
			</Box>
		</Modal>
	)
}
