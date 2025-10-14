import DoctorsSidebar from '@/Components/Doctors/Sider'
import React from 'react'
import { Outlet } from 'react-router-dom'

const DoctorsLayer = () => {
  return (
    <div>
        <DoctorsSidebar/>
       
    </div>
  )
}

export default DoctorsLayer