import React from 'react'

const NurseForm = ({ formData, onChange }) => {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
  )
}

export default NurseForm
