import React from 'react'

const ReceptionistForm = ({ formData, onChange }) => {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
  )
}

export default ReceptionistForm
