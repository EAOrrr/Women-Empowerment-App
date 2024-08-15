/**
 * This file is used to store and retrieve user information from local storage.
 * Functions:
 * saveUser: save user information to local storage
 * loadUser: load user information from local storage
 * me: get the username of the current user
 * clearUser: clear user information from local storage
 */

const USER_KEY = 'useris23nfdokey'

const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const loadUser = () => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

const me = () => {
  const user = loadUser()
  return user? user.username : null
}

const clearUser = () => {
  localStorage.removeItem(USER_KEY)
}

export default {
  saveUser,
  loadUser,
  me,
  clearUser
}


