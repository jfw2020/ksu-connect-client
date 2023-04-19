import { Avatar, Box, Button } from "@mui/material"
import * as React from "react"
import CreatePostModal from "./CreatePostModal"

export default function CreatePostCard() {
	const [ modalOpen, setModalOpen ] = React.useState( false )

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
			<CreatePostModal open={modalOpen} onClose={() => setModalOpen( false )} />
			<Box display="flex" flexDirection="row" gap={1} alignItems="center">
				<Avatar 
					alt="Profile Image"
					src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
				/>
				<Button variant="outlined" onClick={() => setModalOpen( true )}>Start post...</Button>
			</Box>
		</Box>
	)
}
