import axios from "axios"

const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(`${baseUrl}/pwd`, credentials)
  return response.data
}

const refreshToken = async token => {
  const response = await axios.post(`${baseUrl}/refresh`, token)
  return response.data
}

export default {
  login,
  refreshToken
 }