import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import usersReducer from "./slices/usersSlice"

/**
 * Configures the store with all the necessary reducers, including
 * the examReducer and the gradingReducer
 */
export const store = configureStore( {
	reducer: {
		users: usersReducer
	},
	middleware( getDefaultMiddleware ) {
		// Ensures that non JSON-serializable objects can be stored in the store
		return getDefaultMiddleware( {
			serializableCheck: false
		} )
	}
} )

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
