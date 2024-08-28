import axios from 'axios'

const baseURL = '/api/posts'

const getAll = async () => {
  const response = await axios.get(baseURL)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseURL, newObject)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseURL}/${id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseURL}/${id}`)
  return response.data
}

export default { getAll, create, update, remove }