import { Html, Head, Main, NextScript } from "next/document"

/**
 * Document Component
 * 
 * This component is for NextJS. Sets up all the necessary elements
 * to run the _app.tsx file.
 */
export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
