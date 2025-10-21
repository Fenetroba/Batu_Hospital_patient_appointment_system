import React, { useState } from 'react'
import Language from '@/Components/Language/Language'
import { useLanguage } from '@/Context/LanguageContext'
import Create_patient from './PatientCrud/Create_patient'
import Fetch_patient from './PatientCrud/Fetch_patient'
import Actions from './PatientCrud/Actions'

const Patients = () => {
  const { t } = useLanguage()
  const [tab, setTab] = useState('create')

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-2">
      <div className="">
        

        <div className="bg-[var(--six)] rounded-xl p-2 mb-4 flex gap-2">
          <button onClick={() => setTab('create')} className={`px-4 py-2 rounded-md ${tab==='create' ? 'bg-[var(--one)] text-black' : 'text-white'}`}>{t('Create') || 'Create'}</button>
          <button onClick={() => setTab('fetch')} className={`px-4 py-2 rounded-md ${tab==='fetch' ? 'bg-[var(--one)] text-black' : 'text-white'}`}>{t('Fetch') || 'Fetch'}</button>
        
        </div>

        <div>
          {tab === 'create' && <Create_patient />}
          {tab === 'fetch' && <Fetch_patient />}
          {tab === 'deletes' && <Actions />}
        </div>
      </div>
    </div>
  )
}

export default Patients