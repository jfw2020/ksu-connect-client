import { AppBar, Container, Toolbar, Box, Typography, InputBase } from "@mui/material"
import Link from "next/link"
import { styled, alpha } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import useUser from "@/lib/useUser"
import React from "react"
import axios from "axios"
import { User } from "@/types/userType"

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
	const { user, mutateUser } = useUser()

	const [ queryString, setQueryString ] = React.useState( "" )
	const [ users, setUsers ] = React.useState( [] as User[] )

	/**
	 * Callbacks
	 */
	const handleLogout = React.useCallback( async () => {
		const response = await axios( "/api/logout" )

		mutateUser( response.data )
	}, [mutateUser] )

	React.useEffect( () => {
		const fetchUsers = async () => {
			const response = await axios( "/api/users" )

			const newUsers: User[] = response.data.users
			setUsers( newUsers )
		}

		fetchUsers()
	}, [] )

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
								<Search>
									<SearchIconWrapper>
										<SearchIcon />
									</SearchIconWrapper>
									<StyledInputBase 
										placeholder="Search..."
										inputProps={{ "aria-label": "search" }}
									/>
								</Search>
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
