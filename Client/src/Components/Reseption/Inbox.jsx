import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Mail, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '@/Stores/UserSlice'

const Inbox = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((s) => s.user)
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [text, setText] = useState('')
  const [threads, setThreads] = useState({})
  const endRef = useRef(null)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const patients = useMemo(() => {
    return (users || []).filter(u => (u.role === 'Patient') || (!u.role && (u.fullName || u.firstName)))
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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threads, activeId])

  const onSend = () => {
    const msg = text.trim()
    if (!msg || !activeId) return
    setThreads(prev => {
      const list = prev[activeId] || []
      return { ...prev, [activeId]: [...list, { id: Date.now(), sender: 'reception', text: msg, at: new Date().toISOString() }] }
    })
    setText('')
    setTimeout(() => {
      setThreads(prev => {
        const list = prev[activeId] || []
        return { ...prev, [activeId]: [...list, { id: Date.now() + 1, sender: 'patient', text: 'Received.', at: new Date().toISOString() }] }
      })
    }, 400)
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
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search patients"
            className="w-full bg-transparent border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
          />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--two)]">
          {loading && <div className="p-3 text-gray-300">Loading...</div>}
          {!loading && filtered.map(u => {
            const id = u._id || u.id
            const name = u.fullName || `${u.firstName || ''} ${u.lastName || ''}`
            const last = (threads[id] || [])[ (threads[id] || []).length - 1 ]
            return (
              <button key={id} onClick={()=>setActiveId(id)} className={`w-full text-left p-3 hover:bg-[var(--five)] ${activeId===id ? 'bg-[var(--four)]' : ''}`}>
                <div className="flex items-center gap-2 text-white">
                  <div className="h-8 w-8 rounded-full bg-[var(--one)] flex items-center justify-center text-black"><User className="h-4 w-4"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{name}</div>
                    <div className="text-xs text-gray-300 truncate">{last?.text || (u.phone || u.phoneNumber || '')}</div>
                  </div>
                </div>
              </button>
            )
          })}
          {!loading && filtered.length === 0 && (
            <div className="p-3 text-gray-300">No patients</div>
          )}
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 border border-[var(--four)] rounded-lg flex flex-col overflow-hidden">
        <div className="p-3 border-b border-[var(--four)] text-white flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="font-semibold">{activeUser ? (activeUser.fullName || `${activeUser.firstName || ''} ${activeUser.lastName || ''}`) : 'Select a patient'}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {(threads[activeId] || []).map(m => (
            <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-md ${m.sender==='reception' ? 'bg-[var(--one)] text-black ml-auto' : 'bg-gray-700 text-white'}`}>
              <div className="text-sm break-words">{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="p-3 border-t border-[var(--four)] flex gap-2">
          <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); onSend() } }}
            placeholder={activeUser ? 'Type a message...' : 'Select a patient to start chatting'}
            className="flex-1 bg-transparent border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
          />
          <button onClick={onSend} disabled={!activeUser || !text.trim()} className="px-4 py-2 rounded-md bg-[var(--one)] text-black disabled:opacity-50">Send</button>
        </div>
      </div>
    </div>
  )
}

export default Inbox