/**
 * Post type
 * 
 * Represents a Post object that gets pulled in from the 
 * DB.
 */
export type Post = {
	postId: number
	userId: number
	content: string
	createdOn: Date,
	updatedOn: Date,
}