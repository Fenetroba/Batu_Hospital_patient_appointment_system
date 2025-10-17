import React from 'react'
import { User, Stethoscope, UserCheck, Building2, Shield } from 'lucide-react'

const RoleSelector = ({ currentUser, selectedRole, onRoleSelect }) => {
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

  if (roleOptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">No roles available for your user type</p>
      </div>
    )
  }

  return (
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
              onClick={() => onRoleSelect(role.id)}
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
  )
}

export default RoleSelector
