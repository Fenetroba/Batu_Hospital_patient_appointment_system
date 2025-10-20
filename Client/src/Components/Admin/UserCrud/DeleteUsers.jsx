import React, { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const DeleteUsers = ({ onClose, users, onDelete }) => {
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleDeleteSelected = () => {
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    await onDelete(selectedUsers)
    setShowConfirmDialog(false)
    onClose()
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      Doctor: 'bg-blue-100 text-blue-700',
      Nurse: 'bg-green-100 text-green-700',
      Patient: 'bg-purple-100 text-purple-700',
      Admin: 'bg-orange-100 text-orange-700'
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  // Get user names for confirmation message
  const getUserNames = () => {
    const names = selectedUsers.map(id => {
      const user = users.find(u => u._id === id);
      return user?.fullName || user?.email || 'User';
    });
    
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names[0]}, ${names[1]}, and ${names.length - 2} others`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle>Confirm Deletion</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {selectedUsers.length === 1 ? (
                <span>Are you sure you want to delete <span className="font-medium text-foreground">{getUserNames()}</span>? This action cannot be undone.</span>
              ) : (
                <span>Are you sure you want to delete these <span className="font-medium text-foreground">{selectedUsers.length} users</span>? This action cannot be undone.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Delete Users</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedUsers.includes(user._id) ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleSelectUser(user._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="w-4 h-4 text-red-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle size={16} />
              <span className="font-medium">Delete {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''}?</span>
            </div>
            <p className="text-sm text-red-600 mb-3">
              This action cannot be undone. The selected users will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteSelected}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteUsers