import axios from 'axios'

// Base points to /api so Vite proxy forwards to Spring Boot on 8080
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err?.response?.data?.error || err.message
    console.error('API error:', msg)
    return Promise.reject(err)
  }
)

export default api