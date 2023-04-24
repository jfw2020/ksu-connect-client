import { Avatar, Box, Button, CircularProgress, Container, Divider, Grid, Stack, Typography } from "@mui/material"
import Head from "next/head"
import * as React from "react"
import { getUser } from "../api/users/[userId]"
import { User } from "@/types/userType"
import { getMajorsText } from "@/lib/helpers"
import RecommendedUsersCard from "@/components/RecommendedUsersCard"
import useUser from "@/lib/useUser"
import { Post } from "@/types/postType"
import { usersActions } from "@/slices/usersSlice"
import axios from "axios"
import { useAppDispatch } from "@/hooks"
import PostCard from "@/components/PostCard"
import { getFollowingIds } from "../api/following/[userId]"
import { withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "@/lib/session"
import { getFollowerIds } from "../api/followers/[userId]"

interface UserPageProps {
	user: User
	followingIds: number[]
	followerIds: number[]
}

export const getServerSideProps = withIronSessionSsr( async function( { req, query } ) {
	const currentUserId = req.session.user?.userId.toString() || "0"
	const userId = query.userId as string

	const user = await getUser( userId )
	const followingIds = await getFollowingIds( currentUserId )
	const followerIds = await getFollowerIds( userId )

	if( !user ) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	return { 
		props: {
			user,
			followingIds,
			followerIds
		}
	}
}, sessionOptions )

export default function UserPage( props: UserPageProps ) {
	/**
	 * Hooks
	 */
	const dispatch = useAppDispatch()
	const { user } = useUser()

	/**
	 * State
	 */
	// State to hold a list of posts for the user's feed
	const [posts, setPosts] = React.useState( [] as Post[] )
	// State to hold if the feed is loading
	const [ loading, setLoading] = React.useState( true )
	// State to hold the id's that the current user is following
	const [followingIds, setFollowingIds] = React.useState( props.followingIds )
	// State to hold the ids that that follow the user
	const [followerIds, setFollowerIds] = React.useState( props.followerIds )

	/**
	 * Callbacks
	 */
	// Toggles whether the logged in user is following the current user
	const handleToggleFollow = React.useCallback( async () => {
		const userId = props.user.userId

		if( !followingIds.includes( userId ) ) {
			await axios.post( `/api/following/${props.user.userId}` )

			setFollowingIds( prevState => [...prevState, userId] )
			setFollowerIds( prevState => [...prevState, user?.userId || 0] )
		}
		else {
			await axios.delete( `/api/following/${props.user.userId}` )

			setFollowingIds( prevState => prevState.filter( followingId => followingId !== userId ) )
			setFollowerIds( prevState => prevState.filter( followerId => followerId !== user?.userId ) )
		}
	}, [followingIds, props.user.userId, user?.userId] )

	/**
	 * Effects
	 */
	// Initial render - initializes the users in the Redux store and fetches the user's feed from the API
	React.useEffect( () => {
		const fetchPosts = async () => {
			const response = await axios( `/api/posts/user/${props.user.userId}` )

			const newPosts: Post[] = response.data.posts.map( ( post: Post ) => ( {
				...post,
				createdOn: new Date( post.createdOn ),
				updatedOn: new Date( post.updatedOn )
			} ) )
			const newUsers: User[] = response.data.users

			dispatch( usersActions.updateUsers( newUsers ) )
			setPosts( newPosts )
		}

		fetchPosts().then( () => {
			setLoading( false )
		} )
	}, [dispatch, props.user.userId] )

	React.useEffect( () => {
		setFollowerIds( props.followerIds )
	}, [props.followerIds] )

	/**
	 * Render Variables
	 */
	const title = `KSUConnect | ${props.user.firstName} ${props.user.lastName}`

	/**
	 * Render
	 */
	return (
		<Container
			sx={{
				pt: 3
			}}
		>
			<Head>
				<title>{title}</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Grid container columnSpacing={2}>
					<Grid item xs={8}>
						<Stack gap={2}>
							<Box
								border="1px solid"
								borderColor="divider"
								borderRadius={3}
								bgcolor="white"
								p={2}
							>
								<Stack gap={1}>
									<Box 
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start"
										}}
									>
										<Avatar 
											alt={`${props.user.firstName} ${props.user.lastName}`}
											src={props.user.imageUrl}
											sx={{
												height: 128,
												width: 128
											}}
										/>
										{user?.userId !== props.user.userId && (
											<FollowButton 
												onClick={handleToggleFollow}
												following={followingIds.includes( props.user.userId )} 
											/>
										)}
									</Box>
									<Typography variant="h4">{props.user.firstName} {props.user.lastName}</Typography>
									<Typography variant="subtitle1">{getMajorsText( props.user.majors )}</Typography>
									<Typography variant="caption">{followerIds.length} followers</Typography>
								</Stack>
							</Box>
							<Divider />
							<Stack spacing={1} alignItems="center">
								{loading && (
									<CircularProgress />
								)}
								{!loading && posts.map( ( post, index ) => (
									<PostCard post={post} key={index} />
								) )}
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={4} >
						<RecommendedUsersCard />
					</Grid>
				</Grid>
			</main>
		</Container>
	)
}

interface FollowButtonProps {
	following?: boolean
	onClick: () => void
}

function FollowButton( props: FollowButtonProps ) {
	const variant = props.following ? "outlined" : "contained"
	const text = props.following ? "Unfollow" : "Follow"

	return (
		<Button onClick={props.onClick} variant={variant}>{text}</Button>
	)
}
