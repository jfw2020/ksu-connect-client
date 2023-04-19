import { Post } from "@/types/postType"
import { User } from "@/types/userType"
import { Avatar, Box, Typography } from "@mui/material"
import * as React from "react"

interface PostCardProps {
	post: Post
}

export default function PostCard( props: PostCardProps ) {
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
			<Header userId={props.post.userId} />
			<Typography variant="body1">{props.post.content}</Typography>
		</Box>
	)
}

interface HeaderProps {
	userId: number
}

function Header( props: HeaderProps ) {
	const user: User = {
		userId: props.userId,
		username: "jacob_williams",
		firstName: "Jacob",
		lastName: "Williams",
		imageUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
	}

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
