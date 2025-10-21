import React, { useEffect, useMemo } from 'react'
import { FileText, Users, Activity, Calendar } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '@/Stores/UserSlice'
// import { CartesianGrid, LineChart, XAxis, YAxis } from 'recharts'

const Reports = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((s) => s.user)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const patients = useMemo(() => (users || []).filter(u => u.role === 'Patient' || !u.role), [users])

  const stats = useMemo(() => {
    const totalPatients = patients.length
    const activePatients = patients.filter(u => (typeof u.isActive === 'boolean' ? u.isActive : true)).length
    const todayStr = new Date().toISOString().slice(0,10)
    const todayRegistrations = patients.filter(u => {
      const d = u.createdAt || u.created_at || u.registrationDate
      if (!d) return false
      const day = new Date(d).toISOString().slice(0,10)
      return day === todayStr
    }).length
    return { totalPatients, activePatients, todayRegistrations }
  }, [patients])

  const recent = useMemo(() => {
    const mapName = (u) => u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown'
    return [...patients]
      .map(u => ({
        id: u._id || u.id,
        name: mapName(u),
        date: (() => {
          const d = u.createdAt || u.created_at || u.registrationDate
          return d ? new Date(d).toISOString().slice(0,10) : ''
        })()
      }))
      .sort((a,b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0,5)
  }, [patients])

  return (
    <div className="p-6 bg-[var(--six)] rounded-xl">
      <div className="flex items-center gap-2 text-white mb-5">
        <FileText className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-[var(--four)] rounded-lg p-4 text-white flex items-center gap-3">
          <Users className="h-6 w-6 text-[var(--one)]" />
          <div>
            <div className="text-sm text-gray-300">Total Patients</div>
            <div className="text-2xl font-semibold">{stats.totalPatients}</div>
          </div>
        </div>
        <div className="border border-[var(--four)] rounded-lg p-4 text-white flex items-center gap-3">
          <Activity className="h-6 w-6 text-[var(--one)]" />
          <div>
            <div className="text-sm text-gray-300">Active Patients</div>
            <div className="text-2xl font-semibold">{stats.activePatients}</div>
          </div>
        </div>
        <div className="border border-[var(--four)] rounded-lg p-4 text-white flex items-center gap-3">
          <Calendar className="h-6 w-6 text-[var(--one)]" />
          <div>
            <div className="text-sm text-gray-300">Today Registrations</div>
            <div className="text-2xl font-semibold">{stats.todayRegistrations}</div>
          </div>
        </div>
      </div>

      <div className="border border-[var(--four)] rounded-lg p-4">
        <div className="text-white font-medium mb-3">Recent Registrations</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-300">
                <th className="py-2 pr-4">Patient ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id} className="border-t border-[var(--four)] text-white">
                  <td className="py-2 pr-4">P_{r.id}</td>
                  <td className="py-2 pr-4">{r.name}</td>
                  <td className="py-2 pr-4">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
    </div>
  )
}

export default Reports