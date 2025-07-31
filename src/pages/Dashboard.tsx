import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  PersonIcon,
  BarChartIcon
} from '@radix-ui/react-icons';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: 'up' | 'down';
}

interface ActivityItem {
  id: number;
  action: string;
  time: string;
  type: 'user' | 'payment' | 'system';
  user?: string;
  amount?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: 20.1,
      icon: BarChartIcon,
      color: 'from-green-500 to-emerald-600',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: 15.3,
      icon: PersonIcon,
      color: 'from-blue-500 to-indigo-600',
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: -2.1,
      icon: BarChartIcon,
      color: 'from-orange-500 to-red-600',
      trend: 'down'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user', user: 'John Doe' },
    { id: 2, action: 'Payment received', time: '5 minutes ago', type: 'payment', amount: '$1,250' },
    { id: 3, action: 'System update completed', time: '10 minutes ago', type: 'system' }
  ]);

  const [chartData, setChartData] = useState([12000, 19000, 15000, 22000, 28000, 35000, 42000]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics randomly
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.title === 'Total Revenue' 
          ? `$${(Math.random() * 10000 + 40000).toFixed(0)}`
          : metric.title === 'Active Users'
          ? `${(Math.random() * 1000 + 2000).toFixed(0)}`
          : `${(Math.random() * 2 + 2).toFixed(2)}%`,
        change: (Math.random() - 0.5) * 40,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate new activity
  useEffect(() => {
    const activityInterval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now(),
        action: Math.random() > 0.5 ? 'New user registered' : 'Payment received',
        time: 'Just now',
        type: Math.random() > 0.5 ? 'user' : 'payment',
        user: Math.random() > 0.5 ? 'New User' : undefined,
        amount: Math.random() > 0.5 ? `$${(Math.random() * 2000 + 500).toFixed(0)}` : undefined
      };
      
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 45000); // Add new activity every 45 seconds

    return () => clearInterval(activityInterval);
  }, []);

  const handleMetricClick = (metricTitle: string) => {
    setIsLoading(true);
    setSelectedMetric(metricTitle.toLowerCase().replace(' ', '-'));
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsLoading(true);
    
    // Simulate data loading for different periods
    setTimeout(() => {
      const newData = period === '7d' ? [12000, 19000, 15000, 22000, 28000, 35000, 42000] :
                     period === '30d' ? [8000, 12000, 18000, 25000, 32000, 38000, 45000] :
                     [5000, 8000, 12000, 18000, 25000, 32000, 40000];
      setChartData(newData);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Clean Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>
      </div>

      {/* Dynamic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => handleMetricClick(metric.title)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {metric.trend === 'up' ? (
                    <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(metric.change).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <div className="flex items-center gap-3">
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="revenue">Revenue</option>
                <option value="users">Users</option>
                <option value="conversion">Conversion</option>
              </select>
              <select 
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            <div className="flex items-end justify-between h-full">
              {chartData.map((value, index) => (
                <div key={index} className="flex flex-col items-center group cursor-pointer">
                  <div 
                    className="w-6 bg-blue-500 rounded-t-lg transition-all duration-300 hover:opacity-80 hover:bg-blue-600 group-hover:scale-110"
                    style={{ height: `${(value / Math.max(...chartData)) * 150}px` }}
                  />
                  <span className="text-xs text-gray-600 mt-2 group-hover:text-blue-600 transition-colors">
                    {selectedPeriod === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] :
                     selectedPeriod === '30d' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'][index] :
                     ['Month 1', 'Month 2', 'Month 3'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Activity Feed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                <div className={`w-2 h-2 rounded-full mt-2 transition-all duration-200 ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  {activity.user && (
                    <p className="text-xs text-blue-600 font-medium">{activity.user}</p>
                  )}
                  {activity.amount && (
                    <p className="text-xs text-green-600 font-medium">{activity.amount}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 