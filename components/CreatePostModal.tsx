import { User } from "@/types/userType"
import { Avatar, Box, Button, Modal, Stack, TextField } from "@mui/material"
import * as React from "react"

/**
 * Props for the CreatePostModal component
 */
interface CreatePostModalProps {
	open: boolean
	onClose: () => void
	user: User
	onCreatePost: ( content: string ) => Promise<void>
}

/**
 * CreatePostModal
 * 
 * This component is a Modal that pops up and allows the user
 * to create a post.
 */
export default function CreatePostModal( props: CreatePostModalProps ) {
	/**
	 * State
	 */
	// State for holding the content the user is inputting
	const [ content, setContent ] = React.useState( "" )
	
	/**
	 * Callbacks
	 */
	const handleCreatePost = React.useCallback( async () => {
		await props.onCreatePost( content )

		setContent( "" )
		props.onClose()
	}, [content, props] )

	/**
	 * Render
	 */
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
						alt={`${props.user.firstName} ${props.user.lastName}`}
						src={props.user.imageUrl}
					/>
					<TextField 
						variant="standard"
						multiline
						rows={5}
						placeholder="What do you want to talk about?"
						value={content}
						onChange={e => setContent( e.target.value )}
					/>
					<Button variant="contained" onClick={handleCreatePost}>Post</Button>
				</Stack>
			</Box>
		</Modal>
	)
}
