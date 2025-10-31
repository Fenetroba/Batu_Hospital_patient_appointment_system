import React from 'react';
import { useSelector } from 'react-redux';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'scheduled': { bg: 'bg-yellow-600/20', text: 'text-yellow-300' },
    'checked-in': { bg: 'bg-green-600/20', text: 'text-green-300' },
    'completed': { bg: 'bg-blue-600/20', text: 'text-blue-300' },
    'cancelled': { bg: 'bg-red-600/20', text: 'text-red-300' },
  };
  
  const { bg, text } = statusConfig[status?.toLowerCase()] || { bg: 'bg-gray-600/20', text: 'text-gray-300' };
  const displayStatus = status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending';
  
  return <span className={`px-2 py-1 text-xs rounded-full ${bg} ${text}`}>{displayStatus}</span>;
};

const FetchAppointment = ({appointments, onEdit, onDelete, loading = false }) => {

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-white/60">Loading appointments...</div>
      </div>
    );
  }


  return (
    <div className="bg-[#1a1a2e] rounded-lg overflow-hidden border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-black/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {appointments.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-white/50" colSpan={6}>
                  No appointments scheduled yet
                </td>
              </tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt.id || apt._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{apt.patientName || apt.patient || 'N/A'}</div>
                    {apt.phone && <div className="text-xs text-white/60">{apt.phone}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90">
                    {formatDate(apt.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90">
                    {apt.time || apt.timeSlot || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90">
                    {apt.department || 'General'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={apt.status || 'scheduled'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(apt)}
                          className="px-3 py-1 rounded bg-blue-600/30 text-blue-300 hover:bg-blue-600/40 text-xs transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(apt)}
                          className="px-3 py-1 rounded bg-red-600/30 text-red-300 hover:bg-red-600/40 text-xs transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FetchAppointment;
