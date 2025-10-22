import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/Context/LanguageContext'
import { useDispatch } from 'react-redux'
import { UpdateUser } from '@/Stores/UserSlice'
import { toast } from 'react-toastify'

const EditPatientData = ({ patient, onClose, onSubmit }) => {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    phone: patient?.phone || '',
    gender: patient?.gender || '',
    email: patient?.email || '',
    emergencyContact: patient?.emergencyContact || '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(UpdateUser({
        id: patient.id,
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          gender: formData.gender,
          email: formData.email,
          emergencyContact: formData.emergencyContact,
        }
      })).unwrap()
      toast.success(t('patientUpdated') || 'Patient updated successfully')
      onSubmit?.()
      onClose?.()
    } catch (error) {
      toast.error(error.message || 'Failed to update patient')
    }
  }

  return (
    <div className="p-6 bg-[var(--six)] rounded-xl">
      <h2 className="text-xl font-semibold text-white mb-4">
        {t('editPatient') || 'Edit Patient'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t('firstName') || 'First Name'}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-transparent text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t('lastName') || 'Last Name'}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-transparent text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t('phoneNumber') || 'Phone Number'}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-transparent text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t('gender') || 'Gender'}
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-transparent text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            required
          >
            <option value="">{t('selectGender') || 'Select Gender'}</option>
            <option value="Male">{t('male') || 'Male'}</option>
            <option value="Female">{t('female') || 'Female'}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t('email') || 'Email'}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-transparent text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t('emergencyContact') || 'Emergency Contact'}
          </label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-transparent text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-500 text-white rounded-md hover:bg-gray-500"
          >
            {t('cancel') || 'Cancel'}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--one)] text-black rounded-md hover:bg-[var(--one)]/90"
          >
            {t('update') || 'Update'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPatientData