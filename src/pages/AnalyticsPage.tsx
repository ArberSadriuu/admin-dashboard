import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();

  // Admin view (already implemented above)
  if (user?.role === 'admin') {
    // Demo KPI data
    const kpis = [
      { label: 'Total Users', value: 1200 },
      { label: 'Active Users', value: 875 },
      { label: 'Revenue', value: '$4,200' },
    ];

    // Demo Bar Chart data
    const barData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'New Users',
          data: [120, 190, 170, 210, 250, 300],
          backgroundColor: 'rgba(37, 99, 235, 0.6)', // blue-600
          borderRadius: 8,
        },
      ],
    };

    // Demo Line Chart data
    const lineData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [800, 1200, 1500, 2000, 3200, 4200],
          borderColor: 'rgba(37, 99, 235, 1)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
        },
      ],
    };

    // Chart options (for a clean look)
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#e5e7eb' } },
      },
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Analytics</h1>
          <p className="text-gray-500 text-base mb-8 text-center">
            Visualize your data and track key metrics with interactive charts.
          </p>
          {/* KPIs */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-xl p-4">
                <span className="text-2xl font-bold text-blue-700">{kpi.value}</span>
                <span className="text-gray-600 text-sm">{kpi.label}</span>
              </div>
            ))}
          </div>
          {/* Charts */}
          <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-64 flex items-center justify-center bg-blue-50 rounded-xl border border-blue-100 mb-2">
                <Bar data={barData} options={chartOptions} />
              </div>
              <span className="text-gray-600 text-sm">Monthly New Users</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-64 flex items-center justify-center bg-blue-50 rounded-xl border border-blue-100 mb-2">
                <Line data={lineData} options={chartOptions} />
              </div>
              <span className="text-gray-600 text-sm">Revenue Growth</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User view: simple line chart and personal stats
  // Demo personal stats
  const stats = [
    { label: 'Logins This Month', value: 14 },
    { label: 'Profile Complete', value: '80%' },
    { label: 'Tasks Completed', value: 23 },
  ];

  // Demo Line Chart data (user activity)
  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Activity',
        data: [2, 3, 1, 4, 2, 5, 3],
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#e5e7eb' } },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Your Analytics</h1>
        <p className="text-gray-500 text-base mb-8 text-center">
          Track your activity and progress on NexBoard.
        </p>
        {/* Personal stats */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-xl p-4">
              <span className="text-2xl font-bold text-blue-700">{stat.value}</span>
              <span className="text-gray-600 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
        {/* Activity chart */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full h-64 flex items-center justify-center bg-blue-50 rounded-xl border border-blue-100 mb-2">
            <Line data={activityData} options={chartOptions} />
          </div>
          <span className="text-gray-600 text-sm">Weekly Activity</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 