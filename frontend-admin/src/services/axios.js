/**
 * Axios configuration
 * @module services/axios
 * @requires axios
 * @requires storage
 * @description This module configures axios to use the token stored in the local storage
 * for all requests. It also refreshes the token if it has expired.
 */
import axios from 'axios'
import storage from '../services/storage'

axios.interceptors.request.use((config) => {

  const token = storage.getAccessToken()
  console.log(token)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  const originalRequest = error.config
  if (error.response.status === 401 && originalRequest.url === 'http://localhost:3001/api/login/refresh') {
    storage.clearUser()
    window.location.reload()
    return Promise.reject(error)
  }
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const user = storage.loadUser()
    if (!user) {
      return Promise.reject(error)
    }
    return axios.post('http://localhost:3001/api/login/refresh',
      { refreshToken: user.refreshToken },
    ).then(res => {
      console.log(res)
      console.log('oldToken', localStorage.getItem('token'))
      console.log('new token from refresh', res.data.token)

      if (res.status === 200) {
        storage.saveUser(res.data)
        console.log('token refreshed')
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
        return axios(originalRequest)
      }
    })
  }
  if (originalRequest._retry) {
    console.log('token now is', localStorage.getItem('token'))
    console.log('retry failed')
  }
  return Promise.reject(error)
})
axios.interceptors.request.use((config) => {

  const token = storage.getAccessToken()
  console.log(token)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  const originalRequest = error.config
  if (error.response.status === 401 && originalRequest.url === 'http://localhost:3001/api/login/refresh') {
    storage.clearUser()
    window.location.reload()
    return Promise.reject(error)
  }
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    return axios.post('http://localhost:3001/api/login/refresh',
      { refreshToken: storage.loadUser().refreshToken },
    ).then(res => {
      console.log(res)
      console.log('oldToken', localStorage.getItem('token'))
      console.log('new token from refresh', res.data.token)

      if (res.status === 200) {
        storage.saveUser(res.data)
        console.log('token refreshed')
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
        return axios(originalRequest)
      }
    })
  }
  if (originalRequest._retry) {
    console.log('token now is', localStorage.getItem('token'))
    console.log('retry failed')
  }
  return Promise.reject(error)
})