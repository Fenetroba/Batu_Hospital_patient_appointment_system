import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Users, UserPlus, UserCheck, Shield, Search, Trash2 } from 'lucide-react'
import CreateUser from './UserCrud/CreateUser'
import DeleteUsers from './UserCrud/DeleteUsers'
import FindUsers from './UserCrud/FindUsers'
import { CreateUser as CreateUserAction, fetchUsers, UpdateUser, DeleteUser, setCurrentUser } from '../../Stores/UserSlice'

const User = () => {
  const dispatch = useDispatch()
  const { users, loading, error, currentUser } = useSelector((state) => state.user)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFindModal, setShowFindModal] = useState(false)

  // Set current user (for demo purposes, you would get this from authentication)
  useEffect(() => {
    // For demo purposes, set current user as Admin
    // In a real app, this would come from authentication
    dispatch(setCurrentUser({ role: 'Admin' }))
  }, [dispatch])

  const handleRoleSwitch = (newRole) => {
    dispatch(setCurrentUser({ role: newRole }))
  }

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Calculate stats from Redux stategf
  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Active Users', value: users.filter(u => u.status === 'Active').length.toString(), icon: UserCheck, color: 'bg-green-500' },
    { label: 'New This Month', value: '45', icon: UserPlus, color: 'bg-purple-500' },
    { label: 'Admins', value: users.filter(u => u.role === 'Admin').length.toString(), icon: Shield, color: 'bg-orange-500' }
  ]

  const getRoleBadgeColor = (role) => {
    const colors = {
      Doctor: 'bg-blue-100 text-blue-700',
      Nurse: 'bg-green-100 text-green-700',
      Patient: 'bg-purple-100 text-purple-700',
      Admin: 'bg-orange-100 text-orange-700'
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  const handleCreateUser = (newUser) => {
    dispatch(CreateUserAction(newUser))
    setShowCreateModal(false)
  }

  const handleDeleteUsers = (userIds) => {
    userIds.forEach(id => {
      dispatch(DeleteUser(id))
    })
    setShowDeleteModal(false)
  }

  const handleSelectUser = (user) => {
    // Handle user selection from search results
    console.log('Selected user:', user)
    setShowFindModal(false)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--six)]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchUsers())}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--six)]">Users Management</h1>

        {/* Role Switcher for Testing */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Current Role:</span>
          <div className="flex gap-1">
            <button
              onClick={() => handleRoleSwitch('Admin')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                currentUser?.role === 'Admin'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleSwitch('Receptionist')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                currentUser?.role === 'Receptionist'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Receptionist
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--one)] text-white rounded-lg shadow ">
        <div className="p-4 bg-[var(--six)] border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold ">All Users</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFindModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Search size={16} />
              <span>Find</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <UserPlus size={16} />
              <span>Add User</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateUser
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {showDeleteModal && (
        <DeleteUsers
          onClose={() => setShowDeleteModal(false)}
          users={users}
          onDelete={handleDeleteUsers}
        />
      )}

      {showFindModal && (
        <FindUsers
          onClose={() => setShowFindModal(false)}
          users={users}
          onSelectUser={handleSelectUser}
        />
      )}
    </div>
  )
}

export default User