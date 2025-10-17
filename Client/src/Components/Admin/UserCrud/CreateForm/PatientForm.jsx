import React from 'react'

const PatientForm = ({ formData, onChange }) => {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
  )
}

export default PatientForm
