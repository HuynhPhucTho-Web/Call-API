// src/components/departments/DepartmentList.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listDepartments, toggleDepartmentStatus, deleteDepartment } from '../../services/departmentService'

export default function DepartmentList() {
  const [items, setItems] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const [searchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? ''

  const load = async () => {
    setLoading(true)
    try {
      const data = await listDepartments()   
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])            

  const filteredItems = useMemo(() => {
    if (statusFilter === '') return items
    const want = statusFilter === 'true'      
    return items.filter(d => d.status === want)
  }, [items, statusFilter])

  const handleToggle = async (id, current) => {
    await toggleDepartmentStatus(id, !current)
    await load()
  }

  const handleDelete = async () => {
    if (!confirmId) return
    await deleteDepartment(confirmId)
    setConfirmId(null)
    await load()
  }

  if (loading) return <p>Đang tải...</p>
  if (error)   return <p style={{ color: 'red' }}>Lỗi: {error}</p>

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Danh sách phòng ban</h2>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Tên</th><th>Trạng thái</th><th>Chức Năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>
                <span className={['badge', d.status ? 'active' : 'inactive'].join(' ')}>
                  {d.status ? 'Hoạt động' : 'Ngừng'}
                </span>
              </td>
              <td className="actions">
                <Link to={`/departments/${d.id}`} className="btn light">Sửa</Link>
                <button className="btn" onClick={() => handleToggle(d.id, d.status)}>
                  {d.status ? 'Tắt' : 'Bật'}
                </button>
                <button className="btn" onClick={() => setConfirmId(d.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmId && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Bạn có chắc muốn xóa phòng ban #{confirmId}?</h3>
            <div className="row">
              <button className="btn" onClick={handleDelete}>Xóa</button>
              <button className="btn light" onClick={() => setConfirmId(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
