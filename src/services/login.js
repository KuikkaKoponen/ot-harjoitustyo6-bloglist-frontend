import axios from 'axios'
//const baseUrl = '/api/login'
const baseUrl = 'http://localhost:3001/api/login'

// lähetetään käyttis ja passu. Vastauksena saadaa user olio, jossa token
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }