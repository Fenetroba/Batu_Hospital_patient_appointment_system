import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '@/Stores/notificationSlice';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import MyAppointment from './MyAppointment';
import Reports from './Reports';

const PatientHome = () => {
  const dispatch = useDispatch();
  const { notifications = [], loading: notifLoading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Dashboard</h1>

      <div>
        <Reports/>
      </div>
      {/* Notification Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2"><Bell className="inline-block mr-2" />Announcements</h2>
        {notifLoading && <p className="text-gray-500">Loading notifications...</p>}
        {!notifLoading && notifications.length === 0 && (
          <p className="text-gray-500">No announcements at the moment.</p>
        )}
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n._id} className={`border rounded-lg p-4 ${n.type === 'alert' ? 'bg-red-100/10 border-red-200' : n.type === 'announcement' ? 'bg-blue-100/10 border-blue-200' : 'bg-green-100/10 border-green-200'}`}>
              <h3 className="text-lg font-semibold text-gray-800">{n.title}</h3>
              <p className="text-gray-600 mt-1">{n.message}</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
     <MyAppointment/>

    </div>
  );
};

export default PatientHome;