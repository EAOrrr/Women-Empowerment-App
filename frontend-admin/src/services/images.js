import axios from 'axios'

const baseUrl = '/api/images'

const create = async (data, header) => {
  const response = await axios.post(baseUrl, data, header)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

const deleteBatch = async (data) => {
  const response = await axios.post(`${baseUrl}/deletebatch`,  data)
  return response.data
}

export default { create, remove, deleteBatch }