

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAppointments } from '../../Stores/Appointment.slice'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import { format, subDays, isSameDay, parseISO, isWithinInterval } from 'date-fns'

const Reports = () => {
  const dispatch = useDispatch()
  const { appointments = [], loading } = useSelector((state) => state.appointments || {})
  const [weeks, setWeeks] = useState(1)

  // Ensure appointments are loaded
  useEffect(() => {
    if (!appointments || appointments.length === 0) {
      dispatch(fetchAppointments())
    }
  }, [appointments, dispatch])

  // Prepare last N weeks (N * 7 days) labels and counts
  const weeklyData = useMemo(() => {
    const daysCount = Math.max(1, Math.min(4, Number(weeks))) * 7
    const days = Array.from({ length: daysCount }).map((_, i) => {
      const date = subDays(new Date(), daysCount - 1 - i) // oldest -> newest
      return {
        date,
        label: format(date, daysCount > 14 ? 'MM/dd' : 'EEE') // shorter label for lots of points
      }
    })

    // initialize counts
    const counts = days.map(d => ({ name: d.label, date: d.date, count: 0 }))

    // appointments' date field in the model is `date` (ISO). Use parseISO if string.
    for (const apt of appointments) {
      let aptDate = apt?.date
      if (!aptDate) continue
      if (typeof aptDate === 'string') {
        try {
          aptDate = parseISO(aptDate)
        } catch (e) {
          continue
        }
      } else {
        aptDate = new Date(aptDate)
      }

      for (const day of counts) {
        if (isSameDay(aptDate, day.date)) {
          day.count += 1
          break
        }
      }
    }

    return counts.map(c => ({ name: c.name, count: c.count }))
  }, [appointments, weeks])

  const totalThisWeek = weeklyData.reduce((s, d) => s + d.count, 0)

  // Status breakdown for the selected date range
  const statusData = useMemo(() => {
    const daysCount = Math.max(1, Math.min(4, Number(weeks))) * 7
    const start = subDays(new Date(), daysCount - 1)

    const counts = { scheduled: 0, completed: 0, cancelled: 0 }

    for (const apt of appointments) {
      let aptDate = apt?.date
      if (!aptDate) continue
      if (typeof aptDate === 'string') {
        try {
          aptDate = parseISO(aptDate)
        } catch (e) {
          continue
        }
      } else {
        aptDate = new Date(aptDate)
      }

      if (isWithinInterval(aptDate, { start, end: new Date() })) {
        const s = (apt.status || 'scheduled').toLowerCase()
        if (s === 'completed') counts.completed += 1
        else if (s === 'cancelled' || s === 'rejected') counts.cancelled += 1
        else counts.scheduled += 1
      }
    }

    return [
      { name: 'Scheduled', value: counts.scheduled },
      { name: 'Completed', value: counts.completed },
      { name: 'Cancelled', value: counts.cancelled }
    ]
  }, [appointments, weeks])

  const STATUS_COLORS = ['#60A5FA', '#34D399', '#F87171']

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Weekly Appointments</h3>
          <p className="text-sm text-muted-foreground">Last {weeks} week{weeks > 1 ? 's' : ''} ({weeks * 7} days)</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold">{totalThisWeek}</div>
            <div className="text-sm text-gray-500">Total appointments</div>
          </div>

          <div>
            <label className="text-sm block mb-1">Range</label>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={1}>1 week</option>
              <option value={2}>2 weeks</option>
              <option value={3}>3 weeks</option>
              <option value={4}>4 weeks</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-1 bg-white p-4 rounded">
          <h4 className="text-sm font-medium mb-2">Status Breakdown</h4>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={4}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-3 text-sm text-gray-600">Loading latest appointments...</div>
      )}
    </div>
  )
}

export default Reports