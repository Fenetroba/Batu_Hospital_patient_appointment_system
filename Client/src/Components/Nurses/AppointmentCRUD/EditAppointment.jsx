import React, { useEffect, useState } from 'react'

const EditAppointment = ({ item, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ patient: '', date: '', time: '', department: 'General', status: 'Pending' });

  useEffect(() => {
    if (item) {
      setForm({
        patient: item.patient || '',
        date: item.date || new Date().toISOString().slice(0,10),
        time: item.time || '',
        department: item.department || 'General',
        status: item.status || 'Pending',
      });
    }
  }, [item]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!form.patient || !form.time) return;
    onSubmit?.({ ...item, ...form });
  };

  return (
    <form onSubmit={submit} className="space-y-3 text-white">
      <h3 className="text-lg font-semibold mb-2">Edit Appointment</h3>
      <div className="grid grid-cols-1 gap-3">
        <input name="patient" value={form.patient} onChange={change} placeholder="Patient name" className="bg-black/30 rounded px-3 py-2 outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <input type="date" name="date" value={form.date} onChange={change} className="bg-black/30 rounded px-3 py-2 outline-none" />
          <input type="time" name="time" value={form.time} onChange={change} className="bg-black/30 rounded px-3 py-2 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select name="department" value={form.department} onChange={change} className="bg-black/30 rounded px-3 py-2 outline-none">
            <option>General</option>
            <option>Cardiology</option>
            <option>Dermatology</option>
            <option>Pediatrics</option>
          </select>
          <select name="status" value={form.status} onChange={change} className="bg-black/30 rounded px-3 py-2 outline-none">
            <option>Pending</option>
            <option>Checked In</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded bg-white/10">Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-blue-600/40 text-blue-100">Save</button>
      </div>
    </form>
  )
}

export default EditAppointment