/**
 * @description: This file contains the user reducer which is responsible for handling the user state in the redux store.
 * The user reducer is responsible for handling the following actions:
 * 1. SET_USER: This action is dispatched when the user logs in and the user details are stored in the redux store.
 * 2. CLEAR_USER: This action is dispatched when the user logs out and the user details are removed from the redux store.
 */

import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import storage from '../services/storage'


const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser(state) {
      return null
    }
  }
})

export const login = ( credential ) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credential)
      storage.saveUser(user)
      dispatch(setUser(user))
    }
    catch (exception) {
      console.log('wrong credentials')
    }
  }
}

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer