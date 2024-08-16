import axios from "axios"

const baseUrl = 'http://localhost:3001/api/login/pwd'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  console.log('response.data:', response.data)
  return response.data
}

export default { login }