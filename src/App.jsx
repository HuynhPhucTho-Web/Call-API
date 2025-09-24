import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/common/NavBar.jsx'
import DepartmentList from './components/departments/DepartmentList.jsx'
import DepartmentForm from './components/departments/DepartmentForm.jsx'
import EmployeeList from './components/employees/EmployeeList.jsx'
import EmployeeForm from './components/employees/EmployeeForm.jsx'
import BorrowList from './components/borrows/BorrowList.jsx'
import BorrowForm from './components/borrows/BorrowForm.jsx'

export default function App() {
  return (
    <div className="container">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/departments" replace />} />
        <Route path="/departments" element={<DepartmentList />} />
        <Route path="/departments/new" element={<DepartmentForm />} />
        <Route path="/departments/:id" element={<DepartmentForm />} />

        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
        <Route path="/employees/:id" element={<EmployeeForm />} />

            <Route path="/borrows" element={<BorrowList />} />
            <Route path="/borrows/new" element={<BorrowForm />} />
            <Route path="/borrows/:id" element={<BorrowForm />} />

        <Route path="*" element={<p>Không tìm thấy trang</p>} />
      </Routes>
    </div>
  )
}