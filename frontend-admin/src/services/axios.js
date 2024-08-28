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
  if (error.response.status === 401 && originalRequest.url === '/api/login/refresh') {
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
    return axios.post('/api/login/refresh',
      { refreshToken: user.refreshToken },
    ).then(res => {

      if (res.status === 200) {
        storage.saveUser(res.data)
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
        return axios(originalRequest)
      }
    })
  }
  if (originalRequest._retry) {
  }
  return Promise.reject(error)
})

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
    async ({ url, method, body: data, params, headers }) => {
      try {
        const result = await axios({
          url: `${baseUrl}/${url}`,
          method,
          data,
          params,
          headers,
        })
        return { data: result.data }
      } catch (axiosError) {
        const err = axiosError
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        }
      }
    }
