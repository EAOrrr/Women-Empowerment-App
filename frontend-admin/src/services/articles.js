import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/articles';

const getAll = (query) => {
  const request = axios.get(`${baseUrl}?${query}`)
  return request.then(response => response.data)
}

const getOne = async (id) => {
  return axios.get(`${baseUrl}/${id}`).then(response => response.data)
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default {
  getAll,
  getOne,
  create,
  update,
  remove
}