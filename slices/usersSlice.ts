import { RootState } from "@/store"
import { User } from "@/types/userType"
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"

/**
 * Reducers
 */
const updateUser = ( state: UsersState, action: PayloadAction<User> ) => {
	const userId = action.payload.userId

	if( !state.userIds.includes( userId ) ) {
		state.userIds = [...state.userIds, userId]
	}

	state.users = {
		...state.users,
		[userId]: action.payload
	}
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
		updateUser
	}
} )

export const usersActions = usersSlice.actions
export default usersSlice.reducer
