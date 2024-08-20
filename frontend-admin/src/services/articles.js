import axios from 'axios'
import storage from '../services/storage'

const baseUrl = 'http://localhost:3001/api/articles';
const articlesPerPage = 12

const getConfig = () => ({
  headers: { Authorization: `bearer ${storage.loadUser().token}` },
})

const getAll = (query) => {
  const request = axios.get(`${baseUrl}?${query}`, getConfig())
  return request.then(response => response.data)
}

export default { getAll }