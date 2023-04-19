import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Box, Button, Container, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import Head from "next/head"
import * as React from "react"

export default function Home() {
	/**
	 * State
	 */
	// State that determines if the password should be shown
	const [ showPassword, setShowPassword ] = React.useState( false )
	// State that holds the email
	const [ email, setEmail ] = React.useState( "" )
	// State that holds the password
	const [ password, setPassword ] = React.useState( "" )

	return (
		<Container
			sx={{
				pt: 3
			}}
		>
			<Head>
				<title>KSUConnect | Log In or Sign up</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
				>
					<Stack
						gap={2}
						sx={{
							borderRadius: 3,
							backgroundColor: "white",
							padding: 2
						}}
					>
						<Typography variant="h6">Welcome to KSUConnect!</Typography>
						<Stack
							sx={{
								width: "50ch",
							}} 
							component="form" 
							autoComplete="off"
							gap={2}
						>
							<FormControl>
								<TextField 
									label="Email" 
									variant="outlined" 
									type="email" 
									fullWidth
									value={email}
									onChange={e => setEmail( e.target.value )}
								/>
							</FormControl>
							<FormControl>
								<InputLabel htmlFor="password-input">Password</InputLabel>
								<OutlinedInput
									id="password-input"
									type={showPassword ? "text" : "password"} 
									fullWidth 
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												edge="end"
												onClick={() => setShowPassword( prevState => !prevState )}
												onMouseDown={e => e.preventDefault()}
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Password"
									value={password}
									onChange={e => setPassword( e.target.value )}
								/>
							</FormControl>
							<Button variant="contained">Sign In</Button>
							<Divider />
							<Button variant="outlined">Sign Up</Button>
						</Stack>
					</Stack>
				</Box>
			</main>
		</Container>
	)
}
