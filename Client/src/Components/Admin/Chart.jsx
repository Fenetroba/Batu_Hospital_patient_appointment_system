import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LineChart,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Cell
} from 'recharts';
import { fetchUsers } from '../../Stores/UserSlice';
import { fetchAppointments } from '../../Stores/Appointment.slice';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';

const Chart = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.user);
  const { appointments, loading: appointmentsLoading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Process data for the last 6 months
  const chartData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthKey = format(monthStart, 'MMM yyyy');
      
      // Filter users created in this month
      const usersThisMonth = users.filter(user => {
        const userDate = new Date(user.createdAt);
        return isWithinInterval(userDate, { start: monthStart, end: monthEnd });
      });
      
      // Filter appointments for this month
      const appointmentsThisMonth = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return isWithinInterval(aptDate, { start: monthStart, end: monthEnd });
      });
      
      // Count appointments by status
      const statusCount = appointmentsThisMonth.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {});
      
      months.push({
        name: monthKey,
        users: usersThisMonth.length,
        appointments: appointmentsThisMonth.length,
        completed: statusCount.completed || 0,
        pending: statusCount.pending || 0,
        cancelled: statusCount.cancelled || 0,
      });
    }
    
    return months;
  }, [users, appointments]);

  // Data for the last 7 days
  const weeklyData = useMemo(() => {
    const days = [];
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    
    const dateRange = eachDayOfInterval({
      start: weekAgo,
      end: now
    });
    
    return dateRange.map(date => {
      const dateKey = format(date, 'EEE, MMM d');
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === date.toDateString();
      });
      
      return {
        name: dateKey,
        appointments: dayAppointments.length,
        completed: dayAppointments.filter(a => a.status === 'completed').length,
      };
    });
  }, [appointments]);

  if (usersLoading || appointmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Overview (Last 6 Months)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <RechartsXAxis dataKey="name" />
              <RechartsYAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" name="Appointments" fill="#194e60" />
              <Bar dataKey="users" name="New Users" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Appointment Status (This Month)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[chartData[chartData.length - 1]]}>
                <CartesianGrid strokeDasharray="3 3" />
                <RechartsXAxis dataKey="name" />
                <RechartsYAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#00C49F" />
                <Bar dataKey="pending" name="Pending" fill="#FFBB28" />
                <Bar dataKey="cancelled" name="Cancelled" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  name="Appointments" 
                  stroke="#194e60" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  name="Completed" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;