import { User } from "@/types/userType"
import { Avatar, Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField } from "@mui/material"
import axios from "axios"
import * as React from "react"

/**
 * Props for the CreatePostModal component
 */
interface CreatePostModalProps {
	open: boolean
	onClose: () => void
	user: User
	onCreatePost: ( content: string, categories: string[] ) => Promise<void>
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
	// State to hold the categories for the post
	const [ categories, setCategories ] = React.useState<string[]>( [] )
	const [ items, setItems ] = React.useState<string[]>( [] )

	/**
	 * Callbacks
	 */
	const onClose = React.useCallback( () => {
		setContent( "" )
		setCategories( [] )
		props.onClose()
	}, [props] )
	
	const handleCreatePost = React.useCallback( async () => {
		await props.onCreatePost( content, categories )

		onClose()
	}, [content, onClose, props, categories] )

	React.useEffect( () => {
		const fetchFilters = async () => {
			const response = await axios( "/api/filters" )
			
			setItems( response.data.categories )
		}

		fetchFilters()
	}, [] )	

	/**
	 * Render
	 */
	return (
		<Modal
			open={props.open}
			onClose={onClose}
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
					<FormControl sx={{ minWidth: 200 }}>
						<InputLabel id="category-select">Category</InputLabel>
						<Select 
							labelId="category-select"
							label="Categories"
							value={categories}
							multiple
							onChange={e => setCategories( 
								typeof e.target.value === "string" 
									? e.target.value.split( "," ) 
									: e.target.value 
							)}
						>
							{items.map( item => (
								<MenuItem value={item} key={item}>{item}</MenuItem>
							) )}
						</Select>
					</FormControl>
					<Button variant="contained" onClick={handleCreatePost}>Post</Button>
				</Stack>
			</Box>
		</Modal>
	)
}
