import { RootState } from "@/store"
import { User } from "@/types/userType"
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"

/**
 * Reducers
 */
// Takes a list of Users and adds them all to state
const updateUsers = ( state: UsersState, action: PayloadAction<User[]> ) => {
	const users = action.payload

	users.forEach( user => {
		if( !state.userIds.includes( user.userId ) ) {
			state.userIds = [...state.userIds, user.userId]
		}

		state.users = {
			...state.users,
			[user.userId]: user
		}
	} )
}

/**
 * Selectors
 */
// Selects all the userIds in the state
export const selectUserIds = ( state: RootState ) => state.users.userIds
// Selects all the users in the state
const selectUsers = ( state: RootState ) => state.users.users

// Maps each userId in state to its corresponding user and returns the list of Users
export const selectAllUsers = createSelector(
	selectUserIds,
	selectUsers,
	( userIds, users ) => userIds.map( userId => users[userId] )
)

// Selects a user from state with the given userId
export const selectUserById = createSelector(
	selectUsers,
	( _: RootState, userId: number ) => userId,
	( users, userId ) => users[userId]
)

/**
 * Slice
 */
export interface UsersState {
	userIds: number[] // Holds all of the userIds
	users: {
		[userId: number]: User // Maps each userId to a User
	}
}

const initialState: UsersState = {
	userIds: [],
	users: []
}

export const usersSlice = createSlice( {
	name: "users",
	initialState,
	reducers: {
		updateUsers
	}
} )

export const usersActions = usersSlice.actions
export default usersSlice.reducer
