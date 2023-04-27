import Navbar from "@/components/Navbar"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { ThemeProvider, createTheme } from "@mui/material"
import { Provider } from "react-redux"
import { store } from "@/store"
import { SWRConfig } from "swr"
import fetchJson from "@/lib/fetchJSON"

/**
 * App Component
 * 
 * This is the main entry point for the app. This is where we set up
 * the providers for the Redux store and the Theme.
 */
export default function App( { Component, pageProps }: AppProps ) {
	/**
	 * Theme
	 */
	// Creates the purple theme for the website
	const theme = createTheme( {
		palette: {
			mode: "light",
			primary: {
				main: "#8d4bf9",
			}
		}
	} )

	/**
	 * Render
	 */
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<SWRConfig
					value={{
						fetcher: fetchJson
					}}
				>
					<Navbar />
					<Component {...pageProps} />
				</SWRConfig>
			</Provider>
		</ThemeProvider>
	)
}
