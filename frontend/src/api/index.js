import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api')

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Inject token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fe_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const getMe = () => api.get('/auth/me')

// Events
export const getEvents = (params) => api.get('/events', { params })
export const createEvent = (data) => api.post('/events', data)
export const updateEvent = (id, data) => api.put(`/events/${id}`, data)
export const deleteEvent = (id) => api.delete(`/events/${id}`)

// Analytics
export const getAnalyticsSummary = () => api.get('/analytics/summary')
export const getEngagementTrend = () => api.get('/analytics/engagement')
export const getTopEvents = () => api.get('/analytics/top-events')

// Alerts
export const getAlerts = () => api.get('/alerts')
export const createAlert = (data) => api.post('/alerts', data)
export const resolveAlert = (id) => api.patch(`/alerts/${id}/resolve`)

// Fans
export const getFans = () => api.get('/fans')
export const deleteFan = (id) => api.delete(`/fans/${id}`)

export default api
