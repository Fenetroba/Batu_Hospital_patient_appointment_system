import React from 'react'
import { Users, Calendar, FileText, Activity } from 'lucide-react'
import { useSelector } from 'react-redux'
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
const AdminHome = () => {
  const { users } = useSelector((state) => state.user)
  const { appointments } = useSelector((state) => state.appointments)
console.log(appointments)
  const stats = [
    { title: 'Total Users', value: users.length.toString(), icon: Users, color: 'bg-blue-500' },
    { title: 'Appointments', value: appointments.length.toString(), icon: Calendar, color: 'bg-green-500' },
    { title: 'Reports', value: '89', icon: FileText, color: 'bg-purple-500' },
    { title: 'Active Now', value: '42', icon: Activity, color: 'bg-orange-500' }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[var(--six)]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[var(--six)] rounded-lg shadow p-6">
        
        <div className='flex gap-6'>
         <LineChart width='100%' height={300} data={Userss}>
          <Line type="monotone" dataKey="numberUser" stroke="blue" strokeWidth={2} />
          <Line type="monotone" dataKey="value" stroke="red" strokeWidth={2} />
          <Line type="monotone" dataKey="Appointments" stroke="green" strokeWidth={2} />
          <Line type="monotone" dataKey="Nopatient" stroke="yellow" strokeWidth={2} />
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

export default AdminHome