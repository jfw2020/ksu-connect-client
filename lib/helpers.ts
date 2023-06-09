// Given a list of majors, concatenates them together in a readable format
export function getMajorsText( majors: string[] ) {
	let majorsText = ""
	majors.forEach( ( major, index ) => {
		majorsText += major

		if( index < majors.length - 1 ) {
			majorsText += " | "
		}
	} )

	return majorsText
}