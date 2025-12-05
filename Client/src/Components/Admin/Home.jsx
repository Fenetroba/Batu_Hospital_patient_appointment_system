import React from "react";
import { Users, Calendar, FileText, Activity } from "lucide-react";
import { useSelector } from "react-redux";

import Chart from "./Chart";


const AdminHome = () => {
  const { users } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.auth);

  const { appointments } = useSelector((state) => state.appointments);
  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Appointments",
      value: appointments.length.toString(),
      icon: Calendar,
      color: "bg-green-500",
    },
   
    {
      title: "Active Now",
      value: users
        .filter(
          (u) =>
            u.isActive === true &&
            u.role !== "Patient" &&
            u._id !== currentUser.id
        )
        .length.toString(),
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[var(--six)]">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
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

     <Chart/>
        
      </div>
    </div>
  );
};

export default AdminHome;
