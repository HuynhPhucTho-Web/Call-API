import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBorrows, deleteBorrow, updateBorrowStatus } from '../../services/borrowService'

const STATUS_LABEL = { DA_TRA: 'Đã trả', CHUA_TRA: 'Chưa trả' }

export default function BorrowList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('') 

  const [confirmId, setConfirmId] = useState(null)
  const [statusPickerFor, setStatusPickerFor] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await listBorrows(filter || undefined)
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter])

  const handleDelete = async () => {
    if (!confirmId) return
    await deleteBorrow(confirmId)
    setConfirmId(null)
    await load()
  }

  const handleChangeStatus = async (id, status) => {
    await updateBorrowStatus(id, status)
    setStatusPickerFor(null)
    await load()
  }

  if (loading) return <p>Đang tải...</p>
  if (error) return <p style={{color:'red'}}>Lỗi: {error}</p>

  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <h2>Quản lý mượn trả sách</h2>
        <div style={{display:'flex', gap:8}}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">-- Tất cả trạng thái --</option>
            <option value="DA_TRA">Đã trả</option>
            <option value="CHUA_TRA">Chưa trả</option>
          </select>
          <Link to="/borrows/new" className="btn">+ Thêm thông tin</Link>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người mượn</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.borrowerName}</td>
              <td>{row.bookTitle}</td>
              <td>{row.borrowDate}</td>
              <td>{row.returnDate}</td>
              <td>
                <button className="btn light" onClick={() => setStatusPickerFor(row.id)}>
                  {STATUS_LABEL[row.status] || row.status}
                </button>
                {statusPickerFor === row.id && (
                  <div className="card" style={{position:'absolute', zIndex:10, padding:8}}>
                    <div className="row">
                      <button className="btn" onClick={() => handleChangeStatus(row.id, 'DA_TRA')}>Đã trả</button>
                      <button className="btn light" onClick={() => handleChangeStatus(row.id, 'CHUA_TRA')}>Chưa trả</button>
                    </div>
                  </div>
                )}
              </td>
              <td className="actions">
                <Link to={`/borrows/${row.id}`} className="btn light">Sửa</Link>
                <button className="btn" onClick={() => setConfirmId(row.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal xác nhận xóa */}
      {confirmId && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Bạn có chắc muốn xóa bản ghi #{confirmId}?</h3>
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