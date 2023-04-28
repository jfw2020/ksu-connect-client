import { useAppSelector } from "@/hooks"
import { selectUserById } from "@/slices/usersSlice"
import { Post } from "@/types/postType"
import { Delete, Edit } from "@mui/icons-material"
import { Avatar, Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material"
import axios from "axios"
import * as React from "react"

/**
 * Props for the PostCard component
 */
interface PostCardProps {
	post: Post
	editable?: boolean
	handleDeleteClicked?: () => void
}

/**
 * PostCard
 * 
 * This component displays a post to the user. Each post
 * shows the user that created it and the actual content
 * within the post.
 */
export default function PostCard( props: PostCardProps ) {
	/**
	 * State
	 */
	// State to hold the content the user is typing
	const [content, setContent] = React.useState( props.post.content )
	// State that holds if the user is currently editing or not
	const [editing, setEditing] = React.useState( false )

	/**
	 * Callbacks
	 */
	// Cancels editing a post
	const handleCancelClicked = React.useCallback( () => {
		setEditing( false )
		setContent( props.post.content )
	}, [props.post.content] )

	// Updates the post in the DB with the new content
	const handleDoneClicked = React.useCallback( async () => {
		await axios.post( `/api/posts/${props.post.postId}`, {
			content
		} )

		setEditing( false )
	}, [props.post.postId, content] )

	/**
	 * Effects
	 */
	// Whenever props.post is changed, this updates the content to match it
	React.useEffect( () => {
		setContent( props.post.content )
	}, [props.post] )

	/**
	 * Render
	 */
	return (
		<Stack
			padding={2} 
			border="1px solid"
			borderColor="divider"
			borderRadius={3}
			sx={{
				backgroundColor: "white",
				width: "100%"
			}}
			gap={1}
		>
			<Header 
				post={props.post} 
				userId={props.post.userId} 
				editable={props.editable} 
				handleEditClicked={() => setEditing( true )}
				handleDeleteClicked={props.handleDeleteClicked}
				editing={editing}
			/>
			{editing && (
				<>
					<TextField 
						fullWidth
						value={content}
						onChange={e => setContent( e.target.value )}
						multiline
					/>
					<Box
						sx={{
							alignSelf: "flex-end",
							alignItems: "center",
							display: "flex",
							gap: 1
						}}
					>
						<Button variant="outlined" onClick={handleCancelClicked}>Cancel</Button>
						<Button variant="contained" onClick={handleDoneClicked}>Done</Button>
					</Box>
				</>
			)}
			{!editing && (
				<Typography variant="body1">{content}</Typography>
			)}
		</Stack>
	)
}

/**
 * Props for the Header component
 */
interface HeaderProps {
	post: Post
	userId: number
	editable?: boolean
	editing?: boolean
	handleEditClicked: () => void
	handleDeleteClicked?: () => void
}

/**
 * Header
 * 
 * This component displays a Post's creator's information
 * at the top of the PostCard.
 */
function Header( props: HeaderProps ) {
	/**
	 * Selectors
	 */
	// Selects the user from the store with the given userId
	const user = useAppSelector( state => selectUserById( state, props.userId ) )

	/**
	 * Render
	 */
	return (
		<Box display="flex" justifyContent="space-between">
			<Box display="flex" flexDirection="row" gap={1}>
				<Avatar 
					alt={`${user.firstName} ${user.lastName}`}
					src={user.imageUrl}
				/>
				<Box>
					<Typography variant="subtitle2">{user.firstName} {user.lastName} | {user.status}</Typography>
					<Typography variant="caption">Computer Science</Typography>
				</Box>
				{props.editable && !props.editing && (
					<IconButton
						onClick={props.handleEditClicked}
						sx={{
							height: 32,
							width: 32
						}}
					>
						<Edit
							sx={{
								height: 16,
								width: 16
							}}
						/>
					</IconButton>
				)}
				{props.editable && (
					<IconButton
						onClick={props.handleDeleteClicked}
						sx={{
							height: 32,
							width: 32
						}}
					>
						<Delete
							sx={{
								height: 16,
								width: 16
							}}
						/>
					</IconButton>
				)}
			</Box>
			<Typography variant="caption">{props.post.createdOn.toLocaleDateString()}</Typography>
		</Box>
	)
}
