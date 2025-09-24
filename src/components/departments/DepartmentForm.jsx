import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createDepartment, getDepartment, updateDepartment } from '../../services/departmentService'

export default function DepartmentForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', status: true })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      getDepartment(id).then(setForm).catch(e => setError(e?.response?.data?.message || e.message))
    }
  }, [id])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEdit) await updateDepartment(id, form)
      else await createDepartment(form)
      nav('/departments')
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div className="card">
      <h2>{isEdit ? 'Sửa phòng ban' : 'Thêm phòng ban'}</h2>
      {error && <p style={{color:'red'}}>Lỗi: {error}</p>}
      <form onSubmit={onSubmit} className="grid">
        <div>
          <label>Tên phòng ban</label>
          <input name="name" value={form.name || ''} onChange={onChange} placeholder="VD: Nhân sự" required />
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