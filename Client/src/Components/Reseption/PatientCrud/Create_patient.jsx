import React, { useState } from 'react'
import { useLanguage } from '@/Context/LanguageContext'
import Language from '@/Components/Language/Language'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { CreateUser } from '@/Stores/UserSlice'

const Create_patient = () => {
  const { t } = useLanguage()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    bloodGroup: '',
    email: '',
    phoneNumber: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceNumber: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.gender || !formData.dateOfBirth || !formData.age || !formData.phoneNumber || !formData.address) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        // Required by backend controller
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: 'password',
        role: 'Patient',
        // Patient-specific expectations
        address: formData.address,
        phone: formData.phoneNumber,
        // Extra fields that backend may accept or ignore
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        bloodGroup: formData.bloodGroup,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
      }
      const result = await dispatch(CreateUser(payload))
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(result.payload?.message || 'Patient registered')
      } else {
        const msg = result.payload?.message || result.error?.message || 'Registration failed'
        toast.error(msg)
        return
      }
      setFormData({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        age: '',
        bloodGroup: '',
        email: '',
        phoneNumber: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
      })
    } catch (err) {
      toast.error('Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-2">
      <div className="">
        <div className="flex items-center justify-between mb-6 bg-[var(--six)] rounded-xl p-4">
          <h1 className="text-2xl font-bold text-white">{t('registerTitle') || 'Register Patient'}</h1>
          <Language />
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--six)] rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder={t('firstName') || 'First Name'}
            required
          />
          <input
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder={t('lastName') || 'Last Name'}
            required
          />
          <select
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="" className="text-black">{t('gender') || 'Gender'}</option>
            <option value="Male" className="text-black">{t('male') || 'Male'}</option>
            <option value="Female" className="text-black">{t('female') || 'Female'}</option>
            <option value="Other" className="text-black">{t('other') || 'Other'}</option>
          </select>
          <input
            type="date"
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            placeholder={t('dateOfBirth') || 'Date of Birth'}
            required
          />
          <input
            type="number"
            min="0"
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder={t('age') || 'Age'}
            required
          />
          <select
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
          >
            <option value="" className="text-black">{t('bloodGroup') || 'Blood Group'}</option>
            <option value="A+" className="text-black">A+</option>
            <option value="A-" className="text-black">A-</option>
            <option value="B+" className="text-black">B+</option>
            <option value="B-" className="text-black">B-</option>
            <option value="AB+" className="text-black">AB+</option>
            <option value="AB-" className="text-black">AB-</option>
            <option value="O+" className="text-black">O+</option>
            <option value="O-" className="text-black">O-</option>
          </select>
          <input
            type="email"
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('email') || 'Email'}
          />
          <input
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder={t('phoneNumber') || 'Phone Number'}
            required
          />
          <input
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)] md:col-span-2"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={t('address') || 'Address'}
            required
          />
          <input
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            placeholder={t('emergencyContactName') || 'Emergency Contact Name'}
          />
          <input
            className="border text-white bg-transparent border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            placeholder={t('emergencyContactPhone') || 'Emergency Contact Phone'}
          />
        
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--one)] text-black font-bold px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (t('register') || 'Register') + '...' : t('register') || 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Create_patient