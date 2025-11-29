import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SPECIALTIES = [
    'General',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology'
];

const DoctorForm = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
        Doctor Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Speciality *</label>
          <Select
            value={formData.speciality}
            onValueChange={(value) => onChange({ target: { name: 'speciality', value } })}
          >
            <SelectTrigger className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm">
              <SelectValue placeholder="Select speciality" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((speciality) => (
                <SelectItem key={speciality} value={speciality}>
                  {speciality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Doctor License Number *</label>
          <input
            type="text"
            name="doctorLicense"
            value={formData.doctorLicense}
            onChange={onChange}
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
          onChange={onChange}
          required
          min="0"
          className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
          placeholder="Enter years of experience"
        />
      </div>
    </div>
  )
}

export default DoctorForm
