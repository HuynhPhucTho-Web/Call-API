import React from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <div className="nav">
      <NavLink to="/departments" className={({isActive}) => isActive ? 'active' : ''}>Phòng ban</NavLink>
      <NavLink to="/employees" className={({isActive}) => isActive ? 'active' : ''}>Nhân viên</NavLink>
      <div style={{marginLeft:'auto'}}>
        <Link to="/departments/new" className="btn">+ Thêm phòng ban</Link>
        <Link to="/employees/new" className="btn light" style={{marginLeft:8}}>+ Thêm nhân viên</Link>
      </div>
    </div>
  )
}