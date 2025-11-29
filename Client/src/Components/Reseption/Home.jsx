import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAppointments } from "@/Stores/Appointment.slice";
import { fetchUsers } from "@/Stores/UserSlice";
import { fetchNotifications } from "@/Stores/notificationSlice";
import { Bell } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReseptionHome = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const { users } = useSelector((state) => state.user);
  const { appointments } = useSelector((state) => state.appointments);
  const { notifications = [], loading: notifLoading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAppointments());
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Active patients count (all patients regardless of month)
  const activePatients = useMemo(() => {
    return users.filter((u) => u.isActive && u.role === "Patient").length;
  }, [users]);

  // Today's patients (appointments today)
  const todayPatients = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter((apt) => {
      if (!apt.date) return false;
      const aptDate = new Date(apt.date).toISOString().split('T')[0];
      return aptDate === today;
    }).length;
  }, [appointments]);

  // Monthly registration stats (total, male, female) based on user.createdAt
  const monthlyStats = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map((m) => ({ name: m, total: 0, male: 0, female: 0 }));
    users
      .filter((u) => u.role === "Patient" && u.createdAt)
      .forEach((u) => {
        const date = new Date(u.createdAt);
        const idx = date.getMonth(); // 0-11
        if (idx >= 0 && idx < 12) {
          data[idx].total += 1;
          if (u.gender === "Male") data[idx].male += 1;
          else if (u.gender === "Female") data[idx].female += 1;
        }
      });
    return data;
  }, [users]);

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-[var(--six)] rounded-xl p-4">
          <h1 className="text-white border-1 px-3 py-1 rounded-xl">
            {currentUser?.gender === "Male"
              ? "Mr"
              : currentUser?.gender === "Female"
                ? "Ms"
                : "Mr/Ms"}{" "}{currentUser?.fullName}
          </h1>
          <h1 className="text-white">{currentUser?.role}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300"><h1>Active Patients</h1></div>
            <div className="text-3xl font-bold text-white mt-2">{activePatients}</div>
          </div>
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300"><h1>Today's Patients</h1></div>
            <div className="text-3xl font-bold text-white mt-2">{todayPatients}</div>
          </div>
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

        {/* Monthly gender registration chart */}
        <div className="bg-[var(--six)] rounded-xl p-5">
          <h2 className="text-white mb-4">Patient Registrations per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 2" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#ff7300" name="Total" />
              <Line type="monotone" dataKey="male" stroke="#0088fe" name="Male" />
              <Line type="monotone" dataKey="female" stroke="#ff4081" name="Female" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReseptionHome;
