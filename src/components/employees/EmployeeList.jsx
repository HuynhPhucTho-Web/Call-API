import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEmployees, toggleEmployeeStatus, assignDepartment, removeDepartment } from '../../services/employeeService'
import { listDepartments } from '../../services/departmentService'

export default function EmployeeList() {
  const [items, setItems] = useState([])
  const [depts, setDepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [assignMap, setAssignMap] = useState({}) // empId -> deptId

  const load = async () => {
    setLoading(true)
    try {
      const [emp, dps] = await Promise.all([listEmployees(), listDepartments()])
      setItems(emp)
      setDepts(dps)
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (id, current) => {
    await toggleEmployeeStatus(id, !current)
    await load()
  }

  const handleAssign = async (empId) => {
    const deptId = assignMap[empId]
    if (!deptId) return
    await assignDepartment(empId, deptId)
    await load()
  }

  const handleRemove = async (empId) => {
    await removeDepartment(empId)
    await load()
  }

  if (loading) return <p>Đang tải...</p>
  if (error) return <p style={{color:'red'}}>Lỗi: {error}</p>

  return (
    <div className="card">
      <h2>Danh sách nhân viên</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Phòng ban</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.fullName}</td>
              <td>{e.address}</td>
              <td>{e.phone}</td>
              <td>{e.department ? e.department.name : 'N/A'}</td>
              <td><span className={['badge', e.status ? 'active':'inactive'].join(' ')}>{e.status ? 'Hoạt động':'Ngừng'}</span></td>
              <td className="actions">
                <Link to={`/employees/${e.id}`} className="btn light">Sửa</Link>
                <button className="btn" onClick={() => handleToggle(e.id, e.status)}>{e.status ? 'Tắt' : 'Bật'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card">
        <h3>Phân phòng ban nhanh</h3>
        {items.map(e => (
          <div className="row" key={'assign-'+e.id}>
            <div><b>{e.fullName}</b>{' '}<small>(ID: {e.id})</small></div>
            <select value={assignMap[e.id] || ''} onChange={(ev) => setAssignMap(s => ({...s, [e.id]: ev.target.value}))}>
              <option value="">-- Chọn phòng ban --</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <button className="btn" onClick={() => handleAssign(e.id)}>Gán</button>
            <button className="btn light" onClick={() => handleRemove(e.id)}>Bỏ khỏi phòng</button>
          </div>
        ))}
      </div>
    </div>
  )
}