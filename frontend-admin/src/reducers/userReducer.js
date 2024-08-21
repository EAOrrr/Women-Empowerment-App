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
  initialState: {
    info: null,
    loading: true
  },
  reducers: {
    setUser(state, action) {
      return {
        ...state,
        info: action.payload
      }
    },
    clearUser(state) {
      return {
        info: null,
        loading: false
      }
    },
    setUserStatus(state, action) {
      return {
        ...state,
        loading: action.payload
      }
    }
  }
})

export const login = ( credential ) => {
  return async dispatch => {
    try {
      dispatch(setUserStatus(true))
      const user = await loginService.login(credential)
      storage.saveUser(user)
      dispatch(setUser(user))
      dispatch(setUserStatus(false))
      console.log('login success')
    }
    catch (exception) {
      console.log('wrong credentials')
    }
  }
}

export const logout = () => {
  return async dispatch => {
    storage.clearUser()
    dispatch(clearUser())
    dispatch(setUserStatus(false))
  }
}

export const initializeUser = () => {
  return async dispatch => {
    const userWithOldToken = storage.loadUser()
    if (!userWithOldToken) {
      return
    }
    try {
      dispatch(setUserStatus(true))
      const response = await loginService.refreshToken({
        refreshToken: userWithOldToken.refreshToken
      })
      const user = { ...userWithOldToken,
        token: response.token,
        refreshToken: response.refreshToken
      }
      dispatch(setUser(user))
      dispatch(setUserStatus(false))
    } catch (exception) {
      storage.clearUser()
      dispatch(clearUser())
    }
  }
}

export const { setUser, clearUser, setUserStatus } = userSlice.actions
export default userSlice.reducer