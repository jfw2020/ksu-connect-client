import { User } from "@/types/userType"
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select } from "@mui/material"
import axios from "axios"
import * as React from "react"

/**
 * Props for the AddCategoriesModal component
 */
interface AddCategoriesModalProps {
	open: boolean
	onClose: () => void
	user: User
	categories: string[]
	onAddCategories: ( categories: string[] ) => Promise<void>
}

/**
 * AddCategoriesModal
 * 
 * This component is a Modal that pops up and allows the user
 * to create a post.
 */
export default function AddCategoriesModal( props: AddCategoriesModalProps ) {
	/**
	 * State
	 */
	// State to hold the categories for the post
	const [ categories, setCategories ] = React.useState<string[]>( [] )
	// State to hold all the available categories
	const [ items, setItems ] = React.useState<string[]>( [] )

	/**
	 * Callbacks
	 */
	// Called when the modal is closed - clears the inputs
	const onClose = React.useCallback( () => {
		setCategories( [] )
		props.onClose()
	}, [props] )
	
	// Calls the parentss addCategories() function and closes the modal
	const handleAddCategories = React.useCallback( async () => {
		await props.onAddCategories( categories )

		onClose()
	}, [onClose, props, categories] )

	// Initializes the category filters on first render
	React.useEffect( () => {
		const fetchFilters = async () => {
			const response = await axios( "/api/filters" )
			
			const newCategories = response.data.categories.filter( ( category: string ) => (
				!props.categories.includes( category )
			) )

			setItems( newCategories )
		}

		fetchFilters()
	}, [props.categories] )	

	/**
	 * Render
	 */
	return (
		<Modal
			open={props.open}
			onClose={onClose}
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 500,
					backgroundColor: "white",
					borderRadius: 3,
					padding: 2,
					display: "flex",
					flexDirection: "column",
					gap: 2
				}}
			>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel id="category-select">Categories</InputLabel>
					<Select 
						labelId="category-select"
						label="Categories"
						value={categories}
						multiple
						onChange={e => setCategories( 
							typeof e.target.value === "string" 
								? e.target.value.split( "," ) 
								: e.target.value 
						)}
					>
						{items.map( item => (
							<MenuItem value={item} key={item}>{item}</MenuItem>
						) )}
					</Select>
				</FormControl>
				<Button variant="contained" onClick={handleAddCategories}>Done</Button>
			</Box>
		</Modal>
	)
}
