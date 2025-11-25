import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAppointments } from '../../Stores/Appointment.slice'
import { parseISO, isSameDay, isAfter } from 'date-fns'
import { logoutUser } from '@/Stores/UserAuthslicer'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'

const NurseHome = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.auth)
  const { appointments = [], loading } = useSelector((state) => state.appointments || {})
  const LogoutHandler = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  // Load appointments if not present
  useEffect(() => {
    if (!appointments || appointments.length === 0) dispatch(fetchAppointments())
  }, [appointments, dispatch])

  // Helper to parse appointment date
  const toDate = (d) => {
    if (!d) return null
    if (typeof d === 'string') {
      try {
        return parseISO(d)
      } catch (e) {
        return new Date(d)
      }
    }
    return new Date(d)
  }

  const today = new Date()

  // Analytics derived from appointments
  const analytics = useMemo(() => {
    const totals = { totalAppointments: 0, todayAppointments: 0, patientsToday: new Set(), scheduled: 0, completed: 0, cancelled: 0 }

    for (const apt of appointments) {
      totals.totalAppointments += 1
      const aptDate = toDate(apt.date)
      if (!aptDate) continue

      // today's appointments
      if (isSameDay(aptDate, today)) {
        totals.todayAppointments += 1
        if (apt.patient) totals.patientsToday.add(String(apt.patient))
      }

      const status = (apt.status || 'scheduled').toLowerCase()
      if (status === 'completed') totals.completed += 1
      else if (status === 'cancelled' || status === 'rejected') totals.cancelled += 1
      else totals.scheduled += 1
    }

    return {
      totalAppointments: totals.totalAppointments,
      todayAppointments: totals.todayAppointments,
      patientsToday: totals.patientsToday.size,
      scheduled: totals.scheduled,
      completed: totals.completed,
      cancelled: totals.cancelled
    }
  }, [appointments])

  // upcoming next 5 appointments (future dates)
  const upcoming = useMemo(() => {
    return appointments
      .map(a => ({ ...a, _parsedDate: toDate(a.date) }))
      .filter(a => a._parsedDate && (isAfter(a._parsedDate, today) || isSameDay(a._parsedDate, today)))
      .sort((a, b) => a._parsedDate - b._parsedDate)
      .slice(0, 5)
  }, [appointments])

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-[var(--three)] rounded-xl p-4">
          <h1 className="text-white border-1 px-3 py-1 rounded-xl">
            {currentUser?.gender === 'Male' ? 'Mr' : currentUser?.gender === 'Female' ? 'Ms' : 'Mr/Ms'} {currentUser?.fullName}
          </h1>
          <h1 className="text-white">{currentUser?.role}</h1>
          <Button className='cursor-pointer px-10 hover:bg-[var(--five)]' onClick={LogoutHandler}>LogOut <LogOut/></Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--three)] rounded-xl p-5">
            <div className="text-sm text-gray-300">Patients Today</div>
            <div className="text-3xl font-bold text-white mt-2">{analytics.patientsToday}</div>
          </div>

          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">Today's Appointments</div>
            <div className="text-3xl font-bold text-white mt-2">{analytics.todayAppointments}</div>
          </div>

          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">Total Appointments</div>
            <div className="text-3xl font-bold text-white mt-2">{analytics.totalAppointments}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">Scheduled</div>
            <div className="text-2xl font-bold text-white mt-2">{analytics.scheduled}</div>
          </div>
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">Completed</div>
            <div className="text-2xl font-bold text-white mt-2">{analytics.completed}</div>
          </div>
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">Cancelled</div>
            <div className="text-2xl font-bold text-white mt-2">{analytics.cancelled}</div>
          </div>
        </div>

        <div className="mt-8 bg-[var(--four)] rounded-xl p-4">
          <h3 className="text-white mb-3">Next appointments</h3>
          {upcoming.length === 0 ? (
            <div className="text-gray-200">No upcoming appointments</div>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((apt) => (
                <li key={apt._id} className="bg-[var(--one)]/10 p-3 rounded">
                  <div className="text-white font-medium">{apt.PatientName || apt.patientName || 'Patient'}</div>
                  <div className="text-sm text-gray-300">{toDate(apt.date)?.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Status: {(apt.status || 'scheduled')}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default NurseHome