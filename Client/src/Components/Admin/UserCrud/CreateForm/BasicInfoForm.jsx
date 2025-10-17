import React from 'react'

const BasicInfoForm = ({ formData, onChange }) => {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
          required
          className="w-full px-4 py-3 border text-white border-[var(--one)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
          placeholder="Enter full address"
        />
      </div>
    </div>
  )
}

export default BasicInfoForm
