import { useAppSelector } from "@/hooks"
import { selectUserById } from "@/slices/usersSlice"
import { Post } from "@/types/postType"
import { Avatar, Box, Stack, Typography } from "@mui/material"
import * as React from "react"

/**
 * Props for the PostCard component
 */
interface PostCardProps {
	post: Post
}

/**
 * PostCard
 * 
 * This component displays a post the user. Each post
 * shows the user that created it and the actual content
 * within the post.
 */
export default function PostCard( props: PostCardProps ) {
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
			<Header post={props.post} userId={props.post.userId} />
			<Typography variant="body1">{props.post.content}</Typography>
		</Stack>
	)
}

/**
 * Props for the Header component
 */
interface HeaderProps {
	post: Post
	userId: number
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
			</Box>
			<Typography variant="caption">{props.post.updatedOn.toLocaleDateString()}</Typography>
		</Box>
	)
}
