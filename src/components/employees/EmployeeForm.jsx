import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEmployee, getEmployee, updateEmployee } from '../../services/employeeService'
import { listDepartments } from '../../services/departmentService'

export default function EmployeeForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm] = useState({ fullName: '', address: '', phone: '', status: true, department: null })
  const [depts, setDepts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    listDepartments().then(setDepts).catch(console.error)
    if (isEdit) {
      getEmployee(id).then(setForm).catch(e => setError(e?.response?.data?.message || e.message))
    }
  }, [id])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const onChangeDept = (e) => {
    const deptId = e.target.value
    const dept = depts.find(d => String(d.id) === String(deptId))
    setForm(prev => ({ ...prev, department: dept ? { id: dept.id } : null }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      // If department is only id, backend will bind it to entity via JPA
      if (isEdit) await updateEmployee(id, payload)
      else await createEmployee(payload)
      nav('/employees')
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div className="card">
      <h2>{isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h2>
      {error && <p style={{color:'red'}}>Lỗi: {error}</p>}
      <form onSubmit={onSubmit} className="grid">
        <div>
          <label>Họ tên</label>
          <input name="fullName" value={form.fullName || ''} onChange={onChange} placeholder="VD: Nguyễn Văn A" required />
        </div>
        <div>
          <label>Điện thoại</label>
          <input name="phone" value={form.phone || ''} onChange={onChange} placeholder="+84901234567" />
        </div>
        <div>
          <label>Địa chỉ</label>
          <input name="address" value={form.address || ''} onChange={onChange} placeholder="Số nhà, đường, ..." />
        </div>
        <div>
          <label>Phòng ban</label>
          <select value={form.department?.id || ''} onChange={onChangeDept}>
            <option value="">-- Không --</option>
            {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label>
            <input type="checkbox" name="status" checked={!!form.status} onChange={onChange} />
            {' '}Hoạt động
          </label>
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <button className="btn" type="submit">{isEdit ? 'Cập nhật' : 'Tạo mới'}</button>
        </div>
      </form>
    </div>
  )
}