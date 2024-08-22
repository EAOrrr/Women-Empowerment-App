import axios from 'axios'
import storage from '../services/storage'

const baseUrl = 'http://localhost:3001/api/users'


const getInfo = async () => {
  console.log('token from storage in getInfo', storage.loadUser().token)
  const response = await axios.get(`${baseUrl}/me`)
  console.log(response)
  return response.data
}


export default {
  getInfo,
}
