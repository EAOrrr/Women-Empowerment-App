import axios from "axios"

const baseUrl = 'http://localhost:3001/api/login'

const login = async credentials => {
  console.log('credentials', credentials)
  const response = await axios.post(`${baseUrl}/pwd`, credentials)
  console.log('response.data:', response.data)
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