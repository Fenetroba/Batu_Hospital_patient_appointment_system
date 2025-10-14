import React from 'react'
import { Button } from './Components/ui/button'
import HomePage from './Page/Gusts/HomePage'
import Login from './Page/Auth/Login'
import Registration from './Page/Auth/Registration'
import { Route, Routes } from 'react-router-dom'
import Location from './Page/Location'
import DoctorsLayer from './Page/Doctors/Layer/DoctorsLayer'
import Doctors from './Page/Doctors/HomePage'
const App = () => {
  return (
   <div className='bg-gradient-to-b from-[var(--one)] to-[var(--two)] h-[100dvh]'>
<Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/location" element={<Location />} />

 
    <Route path='/doctors/home' element={<DoctorsLayer/>} />
   
  


</Routes>   
   </div>
  )
}

export default App