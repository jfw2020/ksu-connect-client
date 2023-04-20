import { RootState } from "@/store"
import { User } from "@/types/userType"
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"

/**
 * Reducers
 */
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
export const selectUserIds = ( state: RootState ) => state.users.userIds
const selectUsers = ( state: RootState ) => state.users.users

export const selectAllUsers = createSelector(
	selectUserIds,
	selectUsers,
	( userIds, users ) => userIds.map( userId => users[userId] )
)

export const selectUserById = createSelector(
	selectUsers,
	( _: RootState, userId: number ) => userId,
	( users, userId ) => users[userId]
)

/**
 * Slice
 */
export interface UsersState {
	userIds: number[]
	users: {
		[userId: number]: User
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
