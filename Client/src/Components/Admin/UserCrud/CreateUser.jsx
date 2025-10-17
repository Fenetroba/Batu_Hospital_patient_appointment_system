import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { X, User, Stethoscope, UserCheck, Building2, Shield } from 'lucide-react'

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

  // Role options based on current user's role
  const getRoleOptions = () => {
    if (!currentUser) return []

    switch (currentUser.role) {
      case 'Admin':
        return [
          { id: 'Doctor', label: 'Doctor', icon: Stethoscope, color: 'bg-blue-500' },
          { id: 'Nurse', label: 'Nurse', icon: UserCheck, color: 'bg-green-500' },
          { id: 'Receptionist', label: 'Receptionist', icon: Building2, color: 'bg-orange-500' },
          { id: 'Admin', label: 'Admin', icon: Shield, color: 'bg-purple-500' }
        ]
      case 'Receptionist':
        return [
          { id: 'Patient', label: 'Patient', icon: User, color: 'bg-purple-500' }
        ]
      default:
        return []
    }
  }

  const roleOptions = getRoleOptions()

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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
              Select User Role
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roleOptions.map((role) => {
                const Icon = role.icon
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      selectedRole === role.id
                        ? `${role.color} border-white text-white shadow-lg scale-105`
                        : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="font-medium">{role.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Basic Information (Always Visible) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Medical Information (For Patients) */}
          {selectedRole === 'Patient' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Medical Information (Patient)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border text-white bg-[var(--three)] border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="1"
                    max="150"
                    className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                    placeholder="Enter age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Blood Group *</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border text-white bg-[var(--three)] border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Information */}
          {selectedRole === 'Doctor' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Doctor Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Speciality *</label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                    placeholder="e.g., Cardiology, Pediatrics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Doctor License Number *</label>
                  <input
                    type="text"
                    name="doctorLicense"
                    value={formData.doctorLicense}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Years of Experience *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                  placeholder="Enter years of experience"
                />
              </div>
            </div>
          )}

          {/* Nurse Information */}
          {selectedRole === 'Nurse' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Nurse Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Nurse License Number *</label>
                  <input
                    type="text"
                    name="nurseLicense"
                    value={formData.nurseLicense}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                    placeholder="Enter license number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Work Shift *</label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border text-white bg-[var(--three)] border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Shift</option>
                    <option value="Morning">Morning (8 AM - 4 PM)</option>
                    <option value="Evening">Evening (4 PM - 12 AM)</option>
                    <option value="Night">Night (12 AM - 8 AM)</option>
                    <option value="Rotating">Rotating</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Receptionist Information */}
          {selectedRole === 'Receptionist' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Receptionist Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
                    placeholder="e.g., Front Desk, Emergency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Working Hours *</label>
                  <select
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border text-white bg-[var(--three)] border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Hours</option>
                    <option value="Full-time">Full-time (40 hours/week)</option>
                    <option value="Part-time">Part-time (20-30 hours/week)</option>
                    <option value="Flexible">Flexible Schedule</option>
                  </select>
                </div>
              </div>
            </div>
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