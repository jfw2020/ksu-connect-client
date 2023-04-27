import { Avatar, Box, Button } from "@mui/material"
import * as React from "react"
import CreatePostModal from "./CreatePostModal"
import { User } from "@/types/userType"

/**
 * Props for the CreatePostCard component
 */
interface CreatePostCardProps {
	user: User
	onCreatePost: ( content: string, categories: string[] ) => Promise<void>
}

/**
 * CreatePostCard
 * 
 * This component is a small card that displays the user's avatar and allows
 * them to open the CreatePostModal.
 */
export default function CreatePostCard( props: CreatePostCardProps ) {
	/**
	 * State
	 */
	// State for determining if the CreatePostModal is open or not
	const [ modalOpen, setModalOpen ] = React.useState( false )

	/**
	 * Render
	 */
	return (
		<Box
			padding={2} 
			border="1px solid" 
			borderRadius={3}
			borderColor="divider"
			sx={{
				backgroundColor: "white",
				mb: 2
			}}
		>
			<CreatePostModal 
				open={modalOpen} 
				onClose={() => setModalOpen( false )} 
				user={props.user}
				onCreatePost={props.onCreatePost}
			/>
			<Box display="flex" flexDirection="row" gap={1} alignItems="center">
				<Avatar 
					alt={`${props.user.firstName} ${props.user.lastName}`}
					src={props.user.imageUrl}
				/>
				<Button variant="outlined" onClick={() => setModalOpen( true )}>Create a post...</Button>
			</Box>
		</Box>
	)
}
