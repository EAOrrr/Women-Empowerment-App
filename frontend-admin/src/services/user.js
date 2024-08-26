import axios from 'axios'
import storage from '../services/storage'

const baseUrl = 'http://localhost:3001/api/users'


const getInfo = async () => {
  const response = await axios.get(`${baseUrl}/me`)
  return response.data
}


export default {
  getInfo,
}
