/**
 * This file is used to store and retrieve user information from local storage.
 * Functions:
 * saveUser: save user information to local storage
 * loadUser: load user information from local storage
 * me: get the username of the current user
 * clearUser: clear user information from local storage
 */


const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'
const saveUser = (user) => {
  localStorage.setItem(TOKEN_KEY, user.token)
  localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken)
}

const loadUser = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  return token && refreshToken ? { token, refreshToken } : null
}

const getAccessToken = () => {
  const user = loadUser()
  return user ? user.token : null
}

const getRefreshToken = () => {
  const user = loadUser()
  return user ? user.refreshToken : null
}


const clearUser = () => {
  // localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export default {
  saveUser,
  loadUser,
  clearUser,
  getAccessToken,
  getRefreshToken,
}


