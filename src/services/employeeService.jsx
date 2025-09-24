import api from '../api/axios'

export const listEmployees = () => api.get('/employees').then(r => r.data)

// export const listEmployees = (status) => api.get('/employees', { params: status === undefined || status === '' ? {} : { status } }) .then(r => r.data);

export const getEmployee = (id) => api.get(`/employees/${id}`).then(r => r.data)
export const createEmployee = (payload) => api.post('/employees', payload).then(r => r.data)
export const updateEmployee = (id, payload) => api.put(`/employees/${id}`, payload).then(r => r.data)
export const toggleEmployeeStatus = (id, status) =>
  api.patch(`/employees/${id}/status`, null, { params: { status } }).then(r => r.data)

export const assignDepartment = (empId, deptId) =>
  api.patch(`/employees/${empId}/assign/${deptId}`).then(r => r.data)
export const removeDepartment = (empId) =>
  api.patch(`/employees/${empId}/remove-department`).then(r => r.data)
export const deleteEmployee = (id) => api.delete(`/employees/${id}`).then(r => r.data)