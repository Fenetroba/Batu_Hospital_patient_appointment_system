import React from 'react'
import Language from '@/Components/Language/Language'
import { useLanguage } from '@/Context/LanguageContext'

const DoctorHome = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-[var(--six)]">
          
          <Language />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">{t('patientsToday') || 'Patients Today'}</div>
            <div className="text-3xl font-bold text-white mt-2">0</div>
          </div>
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">{t('upcomingAppointments') || 'Upcoming Appointments'}</div>
            <div className="text-3xl font-bold text-white mt-2">0</div>
          </div>
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">{t('pendingTasks') || 'Pending Tasks'}</div>
            <div className="text-3xl font-bold text-white mt-2">0</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{t('todaySchedule') || 'Today\'s Schedule'}</h2>
              <a href="#" className="text-[var(--one)] text-sm">{t('viewAll') || 'View all'}</a>
            </div>
            <div className="text-gray-300 text-sm">{t('noAppointments') || 'No appointments scheduled.'}</div>
          </div>

          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{t('quickActions') || 'Quick Actions'}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="bg-[var(--one)] text-black font-semibold px-4 py-2 rounded-md">{t('createAppointment') || 'Create Appointment'}</a>
              <a href="#" className="bg-[var(--one)] text-black font-semibold px-4 py-2 rounded-md">{t('writePrescription') || 'Write Prescription'}</a>
              <a href="#" className="bg-[var(--one)] text-black font-semibold px-4 py-2 rounded-md">{t('viewPatients') || 'View Patients'}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorHome