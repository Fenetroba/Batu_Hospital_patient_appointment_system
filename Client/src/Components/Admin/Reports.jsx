import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchUsers } from '../../Stores/UserSlice';
import { fetchAppointments } from '../../Stores/Appointment.slice';
import { format, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.user);
  const { appointments, loading: appointmentsLoading } = useSelector((state) => state.appointments);
  const [activeTab, setActiveTab] = useState('overview');
  const [weeksToShow, setWeeksToShow] = useState(4);
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(subWeeks(new Date(), 3)),
    end: endOfWeek(new Date())
  });

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Process weekly data for the specified number of weeks
  const weeklyData = useMemo(() => {
    const weeks = [];
    const now = new Date();

    for (let i = weeksToShow - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i));
      const weekEnd = endOfWeek(weekStart);
      const weekKey = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

      // Filter users created in this week
      const usersThisWeek = users.filter(user => {
        const userDate = new Date(user.createdAt);
        return isWithinInterval(userDate, { start: weekStart, end: weekEnd });
      });

      // Filter appointments for this week
      const appointmentsThisWeek = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return isWithinInterval(aptDate, { start: weekStart, end: weekEnd });
      });

      // Count appointments by status
      const statusCount = appointmentsThisWeek.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {});

      // Group appointments by day for the week
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
      const dailyData = daysInWeek.map(day => {
        const dayAppointments = appointmentsThisWeek.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate.toDateString() === day.toDateString();
        });

        return {
          name: format(day, 'EEE'),
          date: format(day, 'yyyy-MM-dd'),
          appointments: dayAppointments.length,
          completed: dayAppointments.filter(a => a.status === 'completed').length,
          pending: dayAppointments.filter(a => a.status === 'scheduled').length,
          cancelled: dayAppointments.filter(a => a.status === 'cancelled').length,
        };
      });

      weeks.push({
        name: weekKey,
        weekStart,
        weekEnd,
        users: usersThisWeek.length,
        appointments: appointmentsThisWeek.length,
        completed: statusCount.completed || 0,
        scheduled: statusCount.scheduled || 0,
        cancelled: statusCount.cancelled || 0,
        dailyData
      });
    }

    return weeks;
  }, [users, appointments, weeksToShow]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (weeklyData.length === 0) return [];

    const totalUsers = weeklyData.reduce((sum, week) => sum + week.users, 0);
    const totalAppointments = weeklyData.reduce((sum, week) => sum + week.appointments, 0);
    const totalCompleted = weeklyData.reduce((sum, week) => sum + week.completed, 0);
    const totalPending = weeklyData.reduce((sum, week) => sum + week.scheduled, 0);

    return [
      { name: 'Total Users', value: totalUsers, change: 0, icon: '👥' },
      { name: 'Total Appointments', value: totalAppointments, change: 0, icon: '📅' },
      { name: 'Completed', value: totalCompleted, change: 0, icon: '✅' },
      { name: 'Pending', value: totalPending, change: 0, icon: '⏳' },
    ];
  }, [weeklyData]);

  // Loading state
  if (usersLoading || appointmentsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  // Data for the latest week's daily breakdown
  const latestWeekData = weeklyData[0]?.dailyData || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Weekly Reports</h1>
          <p className="text-muted-foreground">
            {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={weeksToShow}
            onChange={(e) => setWeeksToShow(Number(e.target.value))}
            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={2}>Last 2 weeks</option>
            <option value={4}>Last 4 weeks</option>
            <option value={8}>Last 8 weeks</option>
            <option value={12}>Last 12 weeks</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.name} className="shadow-sm bg-[var(--three)] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                {stat.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change !== undefined && (
                <div className={`text-sm ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% from last period
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className='bg-[var(--six)] px-10 '>
          <TabsTrigger value="overview" className='text-[var(--three)] '>Overview</TabsTrigger>
          <TabsTrigger value="appointments" className='text-[var(--three)] '>Appointments</TabsTrigger>
          <TabsTrigger value="users" className='text-[var(--three)] '>Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Weekly Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis/>
                
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="appointments"
                    name="Appointments"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="New Users"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Appointment Status (This Week)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: weeklyData[0]?.completed || 0 },
                        { name: 'scheduled', value: weeklyData[0]?.scheduled || 0 },
                        { name: 'cancelled', value: weeklyData[0]?.cancelled || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={7}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {['#00C49F', '#5e640cff', '#ec1f1fff'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip  formatter={(value) => [`${value}  appointments`, 'Count']}  />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Daily Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Breakdown (This Week)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latestWeekData}>
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis tickCount={1}/>
                    <Tooltip formatter={(value) => [`${value}  appointments`, 'Count']} />
                    <Legend />
                    <Bar dataKey="appointments" name="Appointments" fill="#8884d8" />
                    <Bar dataKey="completed" name="Completed" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Appointments by Status</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickCount={1}/>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="#00C49F" />
                  <Bar dataKey="scheduled" name="scheduled" fill="#FFBB28" />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">New Users</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" name="New Users" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;