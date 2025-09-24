import api from '../api/axios'

export const listDepartments = () => api.get('/departments').then(r => r.data)
// export const listDepartments = (status) => api.get('/departments', { params: status === undefined || status === '' ? {} : { status } }) .then(r => r.data)
export const getDepartment = (id) => api.get(`/departments/${id}`).then(r => r.data)
export const createDepartment = (payload) => api.post('/departments', payload).then(r => r.data)
export const updateDepartment = (id, payload) => api.put(`/departments/${id}`, payload).then(r => r.data)
export const toggleDepartmentStatus = (id, status) => api.patch(`/departments/${id}/status`, null, { params: { status } }).then(r => r.data)
export const deleteDepartment = (id) => api.delete(`/departments/${id}`).then(r => r.data)