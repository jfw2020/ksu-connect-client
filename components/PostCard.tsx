import { useAppSelector } from "@/hooks"
import { selectUserById } from "@/slices/usersSlice"
import { Post } from "@/types/postType"
import { Avatar, Box, Stack, Typography } from "@mui/material"
import * as React from "react"

interface PostCardProps {
	post: Post
}

export default function PostCard( props: PostCardProps ) {
	return (
		<Stack
			padding={2} 
			border="1px solid"
			borderColor="divider"
			borderRadius={3}
			sx={{
				backgroundColor: "white"
			}}
			gap={1}
		>
			<Header userId={props.post.userId} />
			<Typography variant="body1">{props.post.content}</Typography>
		</Stack>
	)
}

interface HeaderProps {
	userId: number
}

function Header( props: HeaderProps ) {
	const user = useAppSelector( state => selectUserById( state, props.userId ) )

	return (
		<Box display="flex" flexDirection="row" gap={1}>
			<Avatar 
				alt={`${user.firstName} ${user.lastName}`}
				src={user.imageUrl}
			/>
			<Box>
				<Typography variant="subtitle2">{user.firstName} {user.lastName}</Typography>
				<Typography variant="caption">Computer Science</Typography>
			</Box>
		</Box>
	)
}
