import React from "react";
import Language from "@/Components/Language/Language";
import { useLanguage } from "@/Context/LanguageContext";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", patient: 10, Active: 5 },
  { name: "Feb", patient: 17, Active: 12 },
  { name: "Mar", patient: 49, Active: 25 },
];
const Color = ["#0088fe", "#00c4ff", "#000000"];
const ReseptionHome = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { t } = useLanguage();
  const { users } = useSelector((state) => state.user);
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
          <Language />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">
              <h1>Active Patients</h1>
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              {users.filter((user) => user.isActive && user.role === "Patient").length}
              
            </div>
          </div>

          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">
              <h1>ToDay Patients</h1>
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              {users.filter((user) => user.role === "Patient" && user.isActive).length}
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex justify-between items-center bg-gradient-to-b from-[var(--six)] to-[var(--five)] rounded-xl p-5">
            <LineChart width="100%" height={300} data={data}>
              <Line dataKey="patient" stroke="#ffffdd" strokeWidth={3} />
              <Line dataKey="Active" stroke="#64e" strokeWidth={2} />
              <CartesianGrid strokeDasharray="3 2" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>

            <PieChart width={300} height={300}>
              <Pie data={data} dataKey="patient" label>
                {data.map((item, i) => (
                  <Cell key={i} fill={Color[i]} />
                ))}
                <Tooltip />
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReseptionHome;
