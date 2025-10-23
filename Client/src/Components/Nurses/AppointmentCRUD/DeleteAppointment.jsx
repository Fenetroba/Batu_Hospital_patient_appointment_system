import React from 'react'

const DeleteAppointment = ({ item, onConfirm, onCancel }) => {
  return (
    <div className="text-white">
      <h3 className="text-lg font-semibold mb-2">Delete Appointment</h3>
      <p className="text-white/80 mb-4">Are you sure you want to delete the appointment for <span className="font-semibold">{item?.patient}</span> on <span className="font-semibold">{item?.date}</span> at <span className="font-semibold">{item?.time}</span>?</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1 rounded bg-white/10">Cancel</button>
        <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-600/40 text-red-100">Delete</button>
      </div>
    </div>
  )
}

export default DeleteAppointment