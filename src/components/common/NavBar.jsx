// src/components/common/NavBar.jsx
import React from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isDepartments = location.pathname.startsWith('/departments')
  const isEmployees   = location.pathname.startsWith('/employees')

  const params = new URLSearchParams(location.search)
  const status = params.get('status') ?? '' // '', 'true', 'false'

  const onChangeStatus = (e) => {
    const val = e.target.value
    const next = new URLSearchParams(location.search)
    if (!val) next.delete('status'); else next.set('status', val)

    // Điều hướng đúng trang hiện tại với query ?status=...
    navigate({
      pathname: isEmployees ? '/employees' : '/departments',
      search: next.toString() ? `?${next.toString()}` : ''
    })
  }

  return (
    <div className="nav">
      <NavLink to="/departments" className={({isActive}) => isActive ? 'active' : ''}>
        Phòng ban
      </NavLink>
      <NavLink to="/employees" className={({isActive}) => isActive ? 'active' : ''}>
        Nhân viên
      </NavLink>

      {/* Filter trạng thái: hiện khi đang ở trang tương ứng */}
      {(isDepartments || isEmployees) && (
        <div style={{ marginLeft: 16 }}>
          <select value={status} onChange={onChangeStatus} aria-label="Lọc theo trạng thái">
            <option value="">All</option>
            <option value="true">Hoạt động</option>
            <option value="false">Ngừng</option>
          </select>
        </div>
      )}

      <div style={{ marginLeft: 'auto' }}>
        <Link to="/departments/new" className="btn">+ Thêm phòng ban</Link>
        <Link to="/employees/new" className="btn light" style={{ marginLeft: 8 }}>+ Thêm nhân viên</Link>
      </div>
    </div>
  )
}
