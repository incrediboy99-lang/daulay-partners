import axios from 'axios'

const isProd = window.location.hostname !== 'localhost'
const api = axios.create({
  baseURL: isProd ? '/api/v1' : 'http://localhost:8080/api/v1',
  headers: { 'Accept': 'application/json' }
})

export default {
  getDecisions(params = {}) {
    return api.get('/decisions', { params })
  },
  getDecision(id) {
    return api.get(`/decisions/${id}`)
  },
  getStats() {
    return api.get('/stats')
  },
  createDecision(formData) {
    return api.post('/admin/decisions', formData)
  },
  updateDecision(id, formData) {
    return api.put(`/admin/decisions/${id}`, formData)
  },
  deleteDecision(id) {
    return api.delete(`/admin/decisions/${id}`)
  }
}
