import { AppBar, Container, Toolbar, Box, Typography, InputBase, Popper, Fade, Paper, CircularProgress, ClickAwayListener } from "@mui/material"
import Link from "next/link"
import { styled, alpha } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import useUser from "@/lib/useUser"
import React from "react"
import axios from "axios"
import { User } from "@/types/userType"
import UserRow from "./UserRow"

/**
 * Style for the search bar shown in the Navbar
 */
const Search = styled( "div" )( ( { theme } ) => ( {
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha( theme.palette.common.white, 0.15 ),
	"&:hover": {
		backgroundColor: alpha( theme.palette.common.white, 0.25 ),
	},
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up( "sm" )]: {
		marginLeft: theme.spacing( 1 ),
		width: "auto",
	},
} ) )

/**
 * Style for the search icon inside the Search component
 */
const SearchIconWrapper = styled( "div" )( ( { theme } ) => ( {
	padding: theme.spacing( 0, 2 ),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
} ) )

/**
 * Style for the expanding input in the Navbar
 */
const StyledInputBase = styled( InputBase )( ( { theme } ) => ( {
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing( 1, 1, 1, 0 ),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing( 4 )})`,
		transition: theme.transitions.create( "width" ),
		width: "100%",
		[theme.breakpoints.up( "sm" )]: {
			width: "12ch",
			"&:focus": {
				width: "20ch",
			},
		},
	},
} ) )

/**
 * Navbar
 * 
 * This component presents the user with a Navbar to allow for easy
 * navigation between pages.
 */
export default function Navbar( ) {
	/**
	 * Hooks
	 */
	// Uses the currently logged in user
	const { user, mutateUser } = useUser()

	/**
	 * Callbacks
	 */
	// Logs the user out
	const handleLogout = React.useCallback( async () => {
		const response = await axios( "/api/logout" )

		mutateUser( response.data )
	}, [mutateUser] )

	/**
	 * Render
	 */
	return (
		<AppBar position="static">
			<Container>
				<Toolbar disableGutters>
					<Box
						display="flex"
						flexDirection="row"
						justifyContent="space-between"
						flex={1}
						alignItems="center"
					>
						<Box
							display="flex"
							flexDirection="row"
							gap={2}
							alignItems="center"
						>
							<Link href="/">
								<Typography variant="h6" noWrap>KSUConnect</Typography>
							</Link>
							{user?.isLoggedIn && (
								<SearchBox />
							)}
						</Box>
						<Box
							display="flex"
							flexDirection="row"
							gap={2}
						>
							{user?.isLoggedIn && (
								<>
									<Link href="/feed">
										<Typography noWrap >Feed</Typography>
									</Link>
									<Link href="/network">
										<Typography noWrap >My Network</Typography>
									</Link>
									<Link href="/" onClick={handleLogout}>
										<Typography noWrap >Logout</Typography>
									</Link>
								</>
							)}
						</Box>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}

/**
 * SearchBox Component
 * 
 * This component renders the search box in the Navbar. It allows the user
 * to search the DB for a specific user by name.
 */
function SearchBox() {
	/**
	 * State
	 */
	// State to hold the current anchor for the popper
	const [ anchor, setAnchor ] = React.useState<null | HTMLElement>( null )
	// State to hold if results are loading
	const [ loading, setLoading ] = React.useState( false )
	// State to hold the users that match the query
	const [ users, setUsers ] = React.useState<User[]>( [] )
	// State to hold the query string
	const [ query, setQuery ] = React.useState( "" )

	/**
	 * Callbacks
	 */
	// Shows the popover menu when the SearchBox is clicked
	const handleClick = React.useCallback( ( event: React.MouseEvent<HTMLElement> ) => {
		setAnchor( event.currentTarget )
		if( !anchor ) {
			setLoading( true )
		}
	}, [anchor] )

	// Empties the query string and stops showing the popper
	const handleUserClick = React.useCallback( () => {
		setAnchor( null )
		setQuery( "" )
	}, [] )

	/**
	 * Effects
	 */
	// Updates whenever the query changes - queries the DB for users that match the query string
	React.useEffect( () => {
		const fetchUsers = async () => {
			const response = await axios.post( "/api/users", { query } )

			const newUsers: User[] = response.data.users
			setUsers( newUsers )
		}

		if( anchor ) {
			fetchUsers().then( () => setLoading( false ) )
		}
	}, [anchor, query] )

	/**
	 * Render
	 */
	return (
		<ClickAwayListener onClickAway={() => setAnchor( null )}>
			<Box>
				<Search onClick={handleClick}>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase 
						placeholder="Search..."
						inputProps={{ "aria-label": "search" }}
						value={query}
						onChange={e => setQuery( e.target.value )}
					/>
				</Search>
				<Popper
					open={!!anchor}
					anchorEl={anchor}
					placement="bottom-start"
					transition
					sx={{
						zIndex: 999
					}}
				>
					{( { TransitionProps } ) => (
						<Fade {...TransitionProps} timeout={300}>
							<Paper 
								sx={{
									width: "40ch",
									display: "flex",
									flexDirection: "column",
									gap: 1,
									padding: 1,
									maxHeight: 300,
									overflowY: "auto"
								}}
								variant="outlined"
							>
								{loading && (
									<CircularProgress 
										sx={{
											alignSelf: "center",
										}}
									/>
								)}
								{!loading && users.length === 0 && (
									<Typography>No users</Typography>
								)}
								{!loading && users.map( user => (
									<UserRow 
										user={user}
										onClick={handleUserClick}
										key={user.userId}
									/>
								) )}
							</Paper>
						</Fade>
					)}
				</Popper>
			</Box>
		</ClickAwayListener>
	)
}
