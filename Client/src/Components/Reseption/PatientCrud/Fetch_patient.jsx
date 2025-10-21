import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@/Context/LanguageContext'
import Language from '@/Components/Language/Language'
import Actions from './Actions'
import StatusSwitch from './status'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, UpdateUser, DeleteUser } from '@/Stores/UserSlice'

const Fetch_patient = () => {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  const { users, loading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const normalized = useMemo(() => {
    return (users || []).map(u => ({
      id: u._id || u.id,
      fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone || u.phoneNumber,
      gender: u.gender,
      active: typeof u.isActive === 'boolean' ? u.isActive : (u.active ?? true),
    }))
  }, [users])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return normalized
    return normalized.filter(p =>
      (p.fullName || '').toLowerCase().includes(q) ||
      (p.phone || '').toLowerCase().includes(q) ||
      (p.id || '').toString().toLowerCase().includes(q)
    )
  }, [query, normalized])

  
  const deletePatient = async (id) => {
    await dispatch(DeleteUser(id))
  }

  const toggleStatus = async (id) => {
    const user = normalized.find(x => x.id === id)
    if (!user) return
    await dispatch(UpdateUser({ id, userData: { isActive: !user.active } }))
  }

  return (
    <div className="bg-[var(--six)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{t('patients') || 'Patients'}</h2>
        <Language />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder={t('searchPatients') || 'Search by name, phone or ID'}
          className="flex-1 border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
        />
        <button
          className="bg-[var(--one)] text-black font-semibold px-4 py-2 rounded-md"
          onClick={()=>setQuery('')}
        >
          {t('clear') || 'Clear'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-300">
              <th className="py-2 pr-4">{t('patientId') || 'Patient ID'}</th>
              <th className="py-2 pr-4">{t('name') || 'Name'}</th>
              <th className="py-2 pr-4">{t('phoneNumber') || 'Phone Number'}</th>
              <th className="py-2 pr-4">{t('gender') || 'Gender'}</th>
              <th className="py-2 pr-4">{t('status') || 'Status'}</th>
              <th className="py-2 pr-4">{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="py-4 text-gray-300">{t('loading') || 'Loading...'}</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-gray-300">{t('noResults') || 'No results found.'}</td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-[var(--two)] text-white">
                <td className="py-2 pr-4">P_{p.id}</td>
                <td className="py-2 pr-4">{p.fullName || `${p.firstName || ''} ${p.lastName || ''}`}</td>
                <td className="py-2 pr-4">{p.phone || ''}</td>
                <td className="py-2 pr-4">{p.gender}</td>
                <td className="py-2 pr-4 ">
                  <StatusSwitch  checked={p.active} onChange={()=>toggleStatus(p.id)} />
                </td>
                <td className="py-2 pr-4">
                  <Actions
                    active={p.active}
                    onEdit={()=>{}}
                    onToggleStatus={()=>toggleStatus(p.id)}
                    onDelete={()=>deletePatient(p.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-gray-300 text-sm mt-3">
        { `Showing ${filtered.length} records`}
      </div>

      
    </div>
  )
}

export default Fetch_patient