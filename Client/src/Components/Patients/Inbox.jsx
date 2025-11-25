import React, { useEffect, useMemo, useState } from 'react'
import { Mail, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '@/Stores/UserSlice'
import ChatField from './ChatField'

const Inbox = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((s) => s.user)
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const staff = useMemo(() => {
  
    return (users || []).filter(u => u.role === 'Receptionist')
  }, [users])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return staff
    return staff.filter(u =>
      (u.fullName || `${u.firstName || ''} ${u.lastName || ''}`).toLowerCase().includes(q) ||
      (u.phone || u.phoneNumber || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    )
  }, [staff, query])

  const activeUser = useMemo(() => filtered.find(u => (u._id || u.id) === activeId) || staff.find(u => (u._id || u.id) === activeId), [filtered, staff, activeId])

  useEffect(() => {
    if (!activeId && filtered.length > 0) {
      setActiveId(filtered[0]._id || filtered[0].id)
    }
  }, [filtered, activeId])

  return (
    <div className="p-4 md:p-6 bg-[var(--six)] rounded-xl min-h-[70vh] grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 border border-[var(--two)] rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 border-b border-[var(--two)] text-white flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span className="font-semibold">Inbox</span>
        </div>
        <div className="p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search staff..."
            className="w-full bg-transparent border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
          />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--two)]">
          {loading && <div className="p-3 text-gray-300">Loading...</div>}
          {!loading && filtered.map(u => {
            const id = u._id || u.id
            const name = u.fullName || `${u.firstName || ''} ${u.lastName || ''}`
            return (
              <button key={id} onClick={() => setActiveId(id)} className={`w-full text-left p-3 hover:bg-[var(--five)] ${activeId === id ? 'bg-[var(--four)]' : ''}`}>
                <div className="flex items-center gap-2 text-white">
                  <div className="h-8 w-8 rounded-full bg-[var(--one)] flex items-center justify-center text-black"><User className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{name}</div>
                    <div className="text-xs text-gray-300 truncate flex justify-between">
                      <span>{u.role}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
          {!loading && filtered.length === 0 && (
            <div className="p-3 text-gray-300">No Staff Found</div>
          )}
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 border border-[var(--four)] rounded-lg flex flex-col overflow-hidden bg-[var(--six)]">
        <div className="p-3 border-b border-[var(--four)] text-white flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="font-semibold">{activeUser ? (activeUser.fullName || `${activeUser.firstName || ''} ${activeUser.lastName || ''}`) : 'Select a User'}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatField user={activeUser} />
        </div>
      </div>
    </div>
  )
}

export default Inbox