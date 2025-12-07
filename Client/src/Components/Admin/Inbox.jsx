import React, { useEffect, useMemo, useState } from 'react'
import { Mail, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '@/Stores/UserSlice'
import { incrementUnreadCount, clearUnreadCount } from '@/Stores/messageSlice'
import { getSocket } from '../../Lib/Socket'
import Chatfield from './Chatfield'



const Inbox = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((s) => s.user)
  const { currentUser } = useSelector((s) => s.auth)
  const { unreadCounts } = useSelector((s) => s.messages)
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Global socket listener for notifications
  useEffect(() => {
    if (!currentUser) return
    const token = localStorage.getItem('token')
    const sock = getSocket(token)

    sock.on('new_message', (msg) => {
      const senderId = msg.sender?._id || msg.sender
      const receiverId = msg.receiver?._id || msg.receiver

      // If message is for me and I'm not viewing that chat, increment unread
      if (receiverId === currentUser.id && senderId !== activeId) {
        dispatch(incrementUnreadCount(senderId))
      }
    })

    return () => {
      sock.off('new_message')
    }
  }, [currentUser, activeId, dispatch])

  const patients = useMemo(() => {
    // Filter to show Patients (Receptionists mainly chat with patients)
    return (users || []).filter(u => u.role !== 'Admin' && u.role !== 'Patient')
  }, [users])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(u =>
      (u.fullName || `${u.firstName || ''} ${u.lastName || ''}`).toLowerCase().includes(q) ||
      (u.phone || u.phoneNumber || '').toLowerCase().includes(q)
    )
  }, [patients, query])

  const activeUser = useMemo(() => filtered.find(u => (u._id || u.id) === activeId) || patients.find(u => (u._id || u.id) === activeId), [filtered, patients, activeId])

  useEffect(() => {
    if (!activeId && filtered.length > 0) {
      setActiveId(filtered[0]._id || filtered[0].id)
    }
  }, [filtered, activeId])

  // Clear unread count when opening a chat
  const handleUserClick = (userId) => {
    setActiveId(userId)
    dispatch(clearUnreadCount(userId))
  }

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
            placeholder="Search patients..."
            className="w-full bg-transparent border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
          />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--two)]">
          {loading && <div className="p-3 text-gray-300">Loading...</div>}
          {!loading && filtered.map(u => {
            const id = u._id || u.id
            const name = u.fullName || `${u.firstName || ''} ${u.lastName || ''}`
            const unreadCount = unreadCounts[id] || 0
            return (
              <button key={id} onClick={() => handleUserClick(id)} className={`w-full text-left p-3 hover:bg-[var(--five)] ${activeId === id ? 'bg-[var(--four)]' : ''}`}>
                <div className="flex items-center gap-2 text-white">
                  <div className="h-8 w-8 rounded-full bg-[var(--one)] flex items-center justify-center text-black"><User className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{name}</div>
                    <div className="text-xs text-gray-300 truncate">{u.phone || u.phoneNumber || 'No phone'}</div>
                  </div>
                  {unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
          {!loading && filtered.length === 0 && (
            <div className="p-3 text-gray-300">No Patients Found</div>
          )}
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 border border-[var(--four)] rounded-lg flex flex-col overflow-hidden bg-[var(--six)]">
        <div className="p-3 border-b border-[var(--four)] text-white flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="font-semibold">{activeUser ? (activeUser.fullName || `${activeUser.firstName || ''} ${activeUser.lastName || ''}`) : 'Select a User'}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Chatfield user={activeUser} />
        </div>
      </div>
    </div>
  )
}

export default Inbox





