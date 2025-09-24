import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listDepartments, toggleDepartmentStatus } from '../../services/departmentService'

export default function DepartmentList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const handleToggle = async (id, current) => {
    await toggleDepartmentStatus(id, !current)
    await load()
  }

  if (loading) return <p>Đang tải...</p>
  if (error) return <p style={{color:'red'}}>Lỗi: {error}</p>

  return (
    <div className="card">
      <h2>Danh sách phòng ban</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Tên</th><th>Trạng thái</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td><span className={['badge', d.status ? 'active':'inactive'].join(' ')}>{d.status ? 'Hoạt động':'Ngừng'}</span></td>
              <td className="actions">
                <Link to={`/departments/${d.id}`} className="btn light">Sửa</Link>
                <button className="btn" onClick={() => handleToggle(d.id, d.status)}>
                  {d.status ? 'Tắt' : 'Bật'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}