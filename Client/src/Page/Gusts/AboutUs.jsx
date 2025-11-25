import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AboutUs = () => {
  // Health professionals data
  const healthProfessionalsData = [
    { name: "Nurses", value: 40 },
    { name: "Pharmacy", value: 10 },
    { name: "Lab", value: 12 },
    { name: "Midwife", value: 18 },
    { name: "Health Workers", value: 65 },
    { name: "MPH/MSc", value: 7 },
    { name: "Other", value: 24 },
  ];

  // Admin staff by education level
  const adminStaffData = [
    { name: "MSC/MBA", value: 9 },
    { name: "BA/BSc", value: 23 },
    { name: "IV/Diploma", value: 18 },
    { name: "Level III", value: 12 },
    { name: "Certificate", value: 1 },
    { name: "Grade 12", value: 37 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"];

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hospital Info */}
          <h1 className="text-2xl font-bold mb-4">About Batu Hospital</h1>
        <div className="bg-[var(--three)] p-15 flex rounded-xl text-white mb-6">
        <div>
            <h2 className="text-xl font-bold mb-2">Vision</h2>
          <p>    We inspire seeing Batu Hospital being center of excellence in
            the country in quality health care service delivery, and having
            healthy, productive and prosperous community.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Mission</h2>
          <p>   To reduce  morbidity , mortality, disability  and improve  the health  status of the people  through  provision  of quality curative, rehabilitative, promotive  and preventive  health  services.
          </p>
        </div>

        </div>

        {/* Health Professionals Chart */}
        <div className="bg-[var(--six)] rounded-xl p-5 mb-6">
          <h2 className="text-white text-xl font-bold mb-4">Number of Health Professionals by Profession</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={healthProfessionalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Admin Staff Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-[var(--six)] rounded-xl p-5">
            <h2 className="text-white text-xl font-bold mb-4">Admin Staff by Educational Level</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminStaffData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#00C49F" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-[var(--six)] rounded-xl p-5">
            <h2 className="text-white text-xl font-bold mb-4">Admin Staff Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={adminStaffData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {adminStaffData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

