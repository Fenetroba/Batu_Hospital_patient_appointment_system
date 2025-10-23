import React from 'react'
import { useSelector } from "react-redux";
import { LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const Userss=[
  {date:'2022-01-01',value:10,numberUser:1, Appointments:30 ,Nopatient:34},
  {date:'2022-01-02',value:20,numberUser:2, Appointments:73,Nopatient:54},
  {date:'2022-01-03',value:30,numberUser:3, Appointments:43,Nopatient:94},
  {date:'2022-01-04',value:40,numberUser:4, Appointments:23,Nopatient:74},
  {date:'2022-01-05',value:50,numberUser:5, Appointments:58,Nopatient:94},
  {date:'2022-01-06',value:60,numberUser:6, Appointments:62,Nopatient:34},
  {date:'2022-01-07',value:70,numberUser:7, Appointments:72,Nopatient:64},
  {date:'2022-01-08',value:80,numberUser:8, Appointments:82,Nopatient:74},
  {date:'2022-01-09',value:90,numberUser:9, Appointments:92,Nopatient:124},
  {date:'2022-01-10',value:100,numberUser:10, Appointments:102,Nopatient:84},
]
const NurseHome = () => {
  const { currentUser } = useSelector((state) => state.auth);
  

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-[var(--six)] rounded-xl p-4">
          <h1 className="text-white border-1 px-3 py-1 rounded-xl">
            {currentUser?.gender === "Male"
              ? "Mr"
              : currentUser?.gender === "Female"
              ? "Ms"
              : "Mr/Ms"}{" "}
            {currentUser?.fullName}
          </h1>
          <h1 className="text-white">{currentUser?.role}</h1>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">
          Patients Today
            </div>
            <div className="text-3xl font-bold text-white mt-2">0</div>
          </div>

          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">
           ToDay Appointed
            </div>
            <div className="text-3xl font-bold text-white mt-2">0</div>
          </div>
        </div>
        <div className='bg-[var(--six)] p-4 mt-10' > 

        <LineChart width='100%' height={300} data={Userss}>
                <Line type="monotone" dataKey="numberUser" stroke="blue" strokeWidth={2} />
                <Line type="monotone" dataKey="value" stroke="red" strokeWidth={2} />
                <Line type="monotone" dataKey="Appointments" stroke="green" strokeWidth={2} />         
                <XAxis dataKey="date" />
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend/>
               </LineChart>
               </div>
      </div>
    </div>
  )
}

export default NurseHome