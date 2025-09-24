import api from '../api/axios'

// Shape: { id, borrowerName, bookTitle, borrowDate, returnDate, status } 
// status: 'DA_TRA' | 'CHUA_TRA'
export const listBorrows = (status) => api.get('/borrows', { params: { status } }).then(r => r.data)
export const getBorrow = (id) => api.get(`/borrows/${id}`).then(r => r.data)
export const createBorrow = (payload) => api.post('/borrows', payload).then(r => r.data)
export const updateBorrow = (id, payload) => api.put(`/borrows/${id}`, payload).then(r => r.data)
export const deleteBorrow = (id) => api.delete(`/borrows/${id}`).then(r => r.data)
export const updateBorrowStatus = (id, status) => api.patch(`/borrows/${id}/status`, null, { params: { status } }).then(r => r.data)