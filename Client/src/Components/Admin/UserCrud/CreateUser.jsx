import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { X } from 'lucide-react'
import RoleSelector from './CreateForm/RoleSelector'
import BasicInfoForm from './CreateForm/BasicInfoForm'
import PatientForm from './CreateForm/PatientForm'
import DoctorForm from './CreateForm/DoctorForm'
import NurseForm from './CreateForm/NurseForm'
import ReceptionistForm from './CreateForm/ReceptionistForm'

const CreateUser = ({ onClose, onSubmit }) => {
  const { currentUser } = useSelector((state) => state.user)
  const [selectedRole, setSelectedRole] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    password: '',
    gender: '',
    age: '',
    bloodGroup: '',
    address: '',
    phone: '',
    speciality: '',
    profileImage: '',
    // Doctor specific fields
    doctorLicense: '',
    experience: '',
    // Nurse specific fields
    nurseLicense: '',
    shift: '',
    // Receptionist specific fields
    department: '',
    workingHours: ''
  })

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setFormData({
      ...formData,
      role: role,
      // Reset role-specific fields when changing roles
      gender: role === 'Patient' ? formData.gender : '',
      age: role === 'Patient' ? formData.age : '',
      bloodGroup: role === 'Patient' ? formData.bloodGroup : '',
      speciality: role === 'Doctor' ? formData.speciality : '',
      doctorLicense: role === 'Doctor' ? formData.doctorLicense : '',
      experience: role === 'Doctor' ? formData.experience : '',
      nurseLicense: role === 'Nurse' ? formData.nurseLicense : '',
      shift: role === 'Nurse' ? formData.shift : '',
      department: role === 'Receptionist' ? formData.department : '',
      workingHours: role === 'Receptionist' ? formData.workingHours : ''
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Remove role-specific fields that aren't needed for the selected role
    const submitData = { ...formData }

    // Always include basic fields
    // Remove fields that are not relevant for the selected role
    if (selectedRole !== 'Doctor') {
      delete submitData.doctorLicense
      delete submitData.experience
    }
    if (selectedRole !== 'Nurse') {
      delete submitData.nurseLicense
      delete submitData.shift
    }
    if (selectedRole !== 'Receptionist') {
      delete submitData.department
      delete submitData.workingHours
    }

    // For Patient role, we need to include the medical fields
    // The medical fields are already in formData, so no need to delete them

    onSubmit(submitData)
    onClose()
  }

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--six)] rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New User</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <RoleSelector
            currentUser={currentUser}
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
          />

          {/* Basic Information (Always Visible) */}
          <BasicInfoForm
            formData={formData}
            onChange={handleChange}
          />

          {/* Role-specific Forms */}
          {selectedRole === 'Patient' && (
            <PatientForm
              formData={formData}
              onChange={handleChange}
            />
          )}

          {selectedRole === 'Doctor' && (
            <DoctorForm
              formData={formData}
              onChange={handleChange}
            />
          )}

          {selectedRole === 'Nurse' && (
            <NurseForm
              formData={formData}
              onChange={handleChange}
            />
          )}

          {selectedRole === 'Receptionist' && (
            <ReceptionistForm
              formData={formData}
              onChange={handleChange}
            />
          )}

          {/* Profile Image (Optional for all roles) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
              Additional Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Profile Image URL (Optional)</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                placeholder="Enter profile image URL"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/20">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
            >
              Create User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUser