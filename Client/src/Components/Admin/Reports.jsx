import React from 'react'
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react'

const Reports = () => {
  const stats = [
    { label: 'Total Reports', value: '156', icon: FileText, color: 'bg-purple-500' },
    { label: 'This Month', value: '24', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'bg-green-500' }
  ]

  const reports = [
    { id: 1, title: 'Monthly Appointments Report', date: 'Oct 15, 2025', type: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Patient Statistics Summary', date: 'Oct 10, 2025', type: 'PDF', size: '1.8 MB' },
    { id: 3, title: 'Doctor Performance Report', date: 'Oct 5, 2025', type: 'PDF', size: '3.2 MB' },
    { id: 4, title: 'Revenue Analysis Report', date: 'Oct 1, 2025', type: 'PDF', size: '2.1 MB' },
    { id: 5, title: 'Department Activity Report', date: 'Sep 28, 2025', type: 'PDF', size: '1.5 MB' }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[var(--six)]">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Reports</h2>
        </div>
        <div className="divide-y">
          {reports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{report.title}</p>
                    <p className="text-sm text-gray-500">
                      {report.date} • {report.type} • {report.size}
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports