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
import AddCategoriesModal from "@/components/AddCategoriesModal"

/**
 * Props for the UserPage component
 */
interface UserPageProps {
	user: User
	followingIds: number[]
	followerIds: number[]
}

// Gets props before the page is rendered to ensure there are no nulls
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

/**
 * UserPage Component
 * 
 * This component shows a User's information to the user. This includes all
 * of their posts and the User's that they are recommended to follow.
 */
export default function UserPage( props: UserPageProps ) {
	/**
	 * Hooks
	 */
	// Dispatches an action to the store
	const dispatch = useAppDispatch()
	// Uses the currently logged in user
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
	// State to hold the categories the user is interested in
	const [categories, setCategories] = React.useState( props.user.categories )
	// State to hold if the modal is open
	const [modalOpen, setModalOpen] = React.useState( false )

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

	// Deletes a post from the DB
	const handleDeletePost = React.useCallback( async ( postId: number ) => {
		await axios.delete( `/api/posts/${postId}` )

		setPosts( prevState => prevState.filter( post => post.postId !== postId ) )
	}, [] )

	// Adds categories to a user's profile
	const handleAddCategories = React.useCallback( async ( newCategories: string[] ) => {
		await axios.post( "/api/categories", {
			categories: newCategories
		} )

		setCategories( [...categories, ...newCategories] )
	}, [categories] )

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

	// Whenever props.followerIds or props.categories changes, we need to update the followerIds and categories states
	React.useEffect( () => {
		setFollowerIds( props.followerIds )
		setCategories( props.user.categories )
	}, [props.followerIds, props.user.categories] )

	/**
	 * Render Variables
	 */
	// Title of the webpage
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
					<AddCategoriesModal 
						open={modalOpen}
						onClose={() => setModalOpen( false )}
						user={props.user}
						onAddCategories={handleAddCategories}
						categories={categories}
					/>
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
									<Typography variant="caption">{posts.length} posts</Typography>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between"
										}}
									>
										<Typography variant="h6">Interests</Typography>
										{props.user.userId === user?.userId && (
											<Button variant="contained" onClick={() => setModalOpen( true )}>Add</Button>
										)}
									</Box>
									<Stack>
										{categories.map( category => (
											<Typography variant="caption" key={category}>{category}</Typography>
										) )}
									</Stack>
								</Stack>
							</Box>
							<Divider />
							<Stack spacing={1} alignItems="center">
								{loading && (
									<CircularProgress />
								)}
								{!loading && posts.map( ( post, index ) => (
									<PostCard 
										editable={post.userId === user?.userId} 
										post={post} 
										key={index}  
										handleDeleteClicked={() => handleDeletePost( post.postId )}
									/>
								) )}
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={4} >
						<RecommendedUsersCard 
							userId={props.user.userId}
						/>
					</Grid>
				</Grid>
			</main>
		</Container>
	)
}

/**
 * Props for the FollowButton component
 */
interface FollowButtonProps {
	following?: boolean
	onClick: () => void
}

/**
 * FollowButton Component
 * 
 * Displays either Follow or Unfollow depending on if the user is following
 * this user
 */
function FollowButton( props: FollowButtonProps ) {
	/**
	 * Render Variables
	 */
	// Whether the button appears filled in or outlined
	const variant = props.following ? "outlined" : "contained"
	// Whether the button says Follow or Unfollow
	const text = props.following ? "Unfollow" : "Follow"

	/**
	 * Render
	 */
	return (
		<Button onClick={props.onClick} variant={variant}>{text}</Button>
	)
}
