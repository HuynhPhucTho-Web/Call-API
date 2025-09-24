import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBorrow, getBorrow, updateBorrow } from '../../services/borrowService'

const todayStr = () => new Date().toISOString().slice(0,10)

export default function BorrowForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const nav = useNavigate()
  const [form, setForm] = useState({
    borrowerName: '',
    bookTitle: '',
    borrowDate: todayStr(),
    returnDate: todayStr(),
    status: 'CHUA_TRA'
  })
  const [error, setError] = useState(null)
  const [vErr, setVErr] = useState({})

  useEffect(() => {
    if (isEdit) {
      getBorrow(id).then(setForm).catch(e => setError(e?.response?.data?.message || e.message))
    }
  }, [id])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const errs = {}
    const required = ['borrowerName', 'bookTitle', 'borrowDate', 'returnDate', 'status']
    required.forEach(k => {
      if (!String(form[k] || '').trim()) errs[k] = 'Không được để trống'
    })
    const today = todayStr()
    if (form.borrowDate && form.borrowDate < today) errs.borrowDate = 'Ngày mượn không được bé hơn hôm nay'
    if (form.returnDate && form.returnDate < today) errs.returnDate = 'Ngày trả không được bé hơn hôm nay'
    if (!errs.borrowDate && !errs.returnDate && form.returnDate < form.borrowDate) errs.returnDate = 'Ngày trả phải sau hoặc bằng ngày mượn'
    setVErr(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      if (isEdit) await updateBorrow(id, form)
      else await createBorrow(form)
      nav('/borrows')
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div className="card">
      <h2>{isEdit ? 'Sửa thông tin mượn/trả' : 'Thêm thông tin mượn/trả'}</h2>
      {error && <p style={{color:'red'}}>Lỗi: {error}</p>}
      <form onSubmit={onSubmit} className="grid">
        <div>
          <label>Người mượn</label>
          <input name="borrowerName" value={form.borrowerName} onChange={onChange} />
          {vErr.borrowerName && <small style={{color:'red'}}>{vErr.borrowerName}</small>}
        </div>
        <div>
          <label>Tên sách</label>
          <input name="bookTitle" value={form.bookTitle} onChange={onChange} />
          {vErr.bookTitle && <small style={{color:'red'}}>{vErr.bookTitle}</small>}
        </div>
        <div>
          <label>Ngày mượn</label>
          <input type="date" name="borrowDate" value={form.borrowDate} onChange={onChange} min={todayStr()} />
          {vErr.borrowDate && <small style={{color:'red'}}>{vErr.borrowDate}</small>}
        </div>
        <div>
          <label>Ngày trả</label>
          <input type="date" name="returnDate" value={form.returnDate} onChange={onChange} min={todayStr()} />
          {vErr.returnDate && <small style={{color:'red'}}>{vErr.returnDate}</small>}
        </div>
        <div>
          <label>Trạng thái</label>
          <select name="status" value={form.status} onChange={onChange}>
            <option value="CHUA_TRA">Chưa trả</option>
            <option value="DA_TRA">Đã trả</option>
          </select>
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <button className="btn" type="submit">{isEdit ? 'Cập nhật' : 'Thêm'}</button>
        </div>
      </form>
    </div>
  )
}