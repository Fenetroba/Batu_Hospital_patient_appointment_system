import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Users, UserPlus, UserCheck, Shield, Search, Trash2, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'react-toastify'
import CreateUser from './UserCrud/CreateUser'
import DeleteUsers from './UserCrud/DeleteUsers'
import FindUsers from './UserCrud/FindUsers'
import UpdateUserStatus from './UserCrud/CreateForm/UpdateUserStatus'
import { CreateUser as CreateUserAction, fetchUsers, UpdateUser, DeleteUser, setCurrentUser } from '../../Stores/UserSlice'

const User = () => {
  const dispatch = useDispatch()
  const { users, loading, error, currentUser } = useSelector((state) => state.user)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFindModal, setShowFindModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false)
  const [pendingDeletions, setPendingDeletions] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

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

  // Calculate stats from Redux state
  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Active Users', value: users.filter(u => u.isActive === true).length.toString(), icon: UserCheck, color: 'bg-green-500' },
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
    // Ensure we have valid user IDs
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      toast.error('No users selected for deletion');
      return;
    }
    
    // Store the user IDs for deletion and show confirmation dialog
    setPendingDeletions(userIds);
    setShowConfirmDialog(true);
  }

  const confirmDeleteUsers = async () => {
    if (!pendingDeletions.length) return;
    
    const userIds = [...pendingDeletions];
    setShowConfirmDialog(false);
    setIsDeleting(true);
    
    try {
      // Show loading state
      const toastId = toast.loading('Deleting user(s)...');

      // Delete users one by one and wait for all to complete
      const results = await Promise.allSettled(
        userIds.map(id => dispatch(DeleteUser(id)).unwrap())
      );

      // Check results
      const successfulDeletions = results.filter(r => r.status === 'fulfilled');
      const failedDeletions = results.filter(r => r.status === 'rejected');

      // Update UI
      if (successfulDeletions.length > 0) {
        // Refresh the users list to reflect changes
        await dispatch(fetchUsers());
        
        toast.success(
          successfulDeletions.length === 1 
            ? 'User deleted successfully' 
            : `${successfulDeletions.length} users deleted successfully`
        );
      }

      // Show any errors
      if (failedDeletions.length > 0) {
        console.error('Failed to delete some users:', failedDeletions);
        toast.error(
          failedDeletions.length === 1
            ? 'Failed to delete 1 user. Please try again.'
            : `Failed to delete ${failedDeletions.length} users. Please try again.`
        );
      }
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error in confirmDeleteUsers:', error);
      toast.error(error?.message || 'An error occurred while deleting users');
    } finally {
      setIsDeleting(false);
      setPendingDeletions([]);
      toast.dismiss();
    } 
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


  // Get user names for confirmation message
  const getUserNames = (ids) => {
    const names = ids.map(id => {
      const user = users.find(u => u._id === id);
      return user?.fullName || user?.email || 'User';
    });
    
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names[0]}, ${names[1]}, and ${names.length - 2} others`;
  };

  return (
    <div className="p-6">
      {/* Single User Deletion Dialog */}
      <Dialog open={showSingleDeleteDialog} onOpenChange={setShowSingleDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle>Confirm Deletion</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <span className="font-medium text-foreground">{userToDelete?.name || 'this user'}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowSingleDeleteDialog(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!userToDelete) return;
                setIsDeleting(true);
                try {
                  const result = await dispatch(DeleteUser(userToDelete._id)).unwrap();
                  if (result?.id) {
                    toast.success('User deleted successfully');
                    await dispatch(fetchUsers());
                  } else {
                    throw new Error('Unexpected response from server');
                  }
                } catch (error) {
                  console.error('Failed to delete user:', error);
                  if (!error?.message?.includes('successfully')) {
                    toast.error(error.message || 'Failed to delete user');
                  }
                } finally {
                  setIsDeleting(false);
                  setShowSingleDeleteDialog(false);
                  setUserToDelete(null);
                }
              }}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : 'Delete'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Multiple Users Deletion Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle>Confirm Deletion</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {pendingDeletions.length === 1 ? (
                <span>Are you sure you want to delete <span className="font-medium text-foreground">{getUserNames(pendingDeletions)}</span>? This action cannot be undone.</span>
              ) : (
                <span>Are you sure you want to delete these <span className="font-medium text-foreground">{pendingDeletions.length} users</span>? This action cannot be undone.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowConfirmDialog(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteUsers}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : 'Delete'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <UpdateUserStatus 
                      userId={user._id} 
                      isActive={user.status === 'Active'}
                      onStatusUpdate={(newStatus) => {
                        // Update the user's status in the Redux store
                        dispatch(UpdateUser({ ...user, status: newStatus ? 'Active' : 'Inactive' }));
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          // Handle edit action
                          console.log('Edit user:', user._id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUserToDelete(user);
                          setShowSingleDeleteDialog(true);
                        }}
                        disabled={loading}
                        title="Delete user"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
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