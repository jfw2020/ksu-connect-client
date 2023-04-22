export type User = {
	userId: number
	username: string
	firstName: string
	lastName: string
	imageUrl: string
	isLoggedIn?: boolean
	majors: string[]
	categories: string[]
}