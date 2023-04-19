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

export default function App( { Component, pageProps }: AppProps ) {
	const theme = createTheme( {
		palette: {
			mode: "light",
			primary: {
				main: "#8d4bf9",
			}
		}
	} )

	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<Navbar />
				<Component {...pageProps} />
			</Provider>
		</ThemeProvider>
	)
}
