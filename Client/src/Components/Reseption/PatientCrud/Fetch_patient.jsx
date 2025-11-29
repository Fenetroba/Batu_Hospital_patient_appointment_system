import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@/Context/LanguageContext'
import Language from '@/Components/Language/Language'
import Actions from './Actions'
import StatusSwitch from './status'
import EditPatientData from './EditPatientData'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, UpdateUser, DeleteUser } from '@/Stores/UserSlice'
import ResetPassword from '@/Components/Admin/ResetPassword'

const Fetch_patient = () => {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const dispatch = useDispatch()
  const { users, loading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const normalized = useMemo(() => {
    const patientsOnly = (users || []).filter(u => u.role === 'Patient')
    return patientsOnly.map(u => ({
      id: u._id || u.id,
      fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone || u.phoneNumber,
      gender: u.gender,
      email: u.email,
      emergencyContact: u.emergencyContact,
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

  const editPatient = (patient) => {
    setSelectedPatient(patient)
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setSelectedPatient(null)
  }

  const handleEditSubmit = () => {
    dispatch(fetchUsers()) // Refresh the list after edit
  }

  const toggleStatus = async (id) => {
    try {
      const patient = users.find(p => (p._id || p.id) === id);
      if (patient) {
        const updatedStatus = !(patient.isActive ?? patient.active);
        console.log(updatedStatus)

        await dispatch(UpdateUser({
          id,
          userData: { isActive: updatedStatus }
        }));
        dispatch(fetchUsers()); // Refresh the list
      }
    } catch (error) {
      console.error('Error toggling patient status:', error);
    }
  }

  return (
    <div className="bg-[var(--three)] rounded-xl p-5 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{t('patients') || 'Patients'}</h2>
        <Language />
      </div>

      <div className="flex w-[90vw] gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPatients') || 'Search by name, phone or ID'}
          className="flex-1 border  bg-transparent border-gray-300  rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
        />
        <button
          className="bg-[var(--one)] text-black font-semibold px-4 py-2 rounded-md"
          onClick={() => setQuery('')}
        >
          {t('clear') || 'Clear'}
        </button>
      </div>

      <div className=" ">
        <table className=" text-left overflow-y-auto w-[90vw]">
          <thead>
            <tr className="text-gray-300 ">
              <th className="py-2 pr-4">{t('patientId') || 'Patient ID'}</th>
              <th className="py-2 pr-4">{t('name') || 'Name'}</th>
              <th className="py-2 pr-4">{t('phoneNumber') || 'Phone Number'}</th>
              <th className="py-2 pr-4">{t('gender') || 'Gender'}</th>
              <th className="py-2 pr-4">{t('email') || 'Email'}</th>
              <th className="py-2 pr-4">{t('emergencyContact') || 'Emergency Contact'}</th>
              <th className="py-2 pr-4">{t('status') || 'Status'}</th>
              <th className="py-2 pr-4">{t('actions') || 'Actions'}</th>
              <th className="py-2 pr-4">Reset Password</th>
            </tr>
          </thead>
          <tbody>

            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-[var(--two)] text-gray-300 hover:bg-[var(--three)]">
                <td className="py-2 pr-4">P_{p.id}</td>
                <td className="py-2 pr-4">{p.fullName || `${p.firstName || ''} ${p.lastName || ''}`}</td>
                <td className="py-2 pr-4">{p.phone || ''}</td>
                <td className="py-2 pr-4">{p.gender}</td>
                <td className="py-2 pr-4">{p.email}</td>
                <td className="py-2 pr-4">{p.emergencyContact}</td>
                <td className="py-2 pr-4 ">
                  <StatusSwitch checked={p.active} onChange={() => toggleStatus(p.id)} />
                </td>
                <td className="py-2 pr-4">
                  <Actions
                    active={p.active}
                    onEdit={() => editPatient(p)}
                    onToggleStatus={() => toggleStatus(p.id)}
                    onDelete={() => deletePatient(p.id)}
                  />
                </td>
                <td>
                  {console.log(p.id)}
                  <ResetPassword userId={p.id}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-gray-300 text-sm mt-3">
        {`Showing ${filtered.length} records`}
      </div>

      {showEditModal && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <EditPatientData
              patient={selectedPatient}
              onClose={closeEditModal}
              onSubmit={handleEditSubmit}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Fetch_patient