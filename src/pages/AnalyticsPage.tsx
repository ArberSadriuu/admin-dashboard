import React, { useState, useEffect } from 'react';
import { BarChartIcon, DownloadIcon, FileIcon, CalendarIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface Demographic {
  age: string;
  percentage: number;
  color: string;
}

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([
    { label: 'Revenue', value: 45, color: 'bg-blue-500' },
    { label: 'Users', value: 30, color: 'bg-green-500' },
    { label: 'Orders', value: 25, color: 'bg-purple-500' }
  ]);

  const [topProducts, setTopProducts] = useState<TopProduct[]>([
    { name: 'Product A', sales: 1250, revenue: 12500, growth: 12.5 },
    { name: 'Product B', sales: 980, revenue: 9800, growth: 8.2 },
    { name: 'Product C', sales: 750, revenue: 7500, growth: -2.1 },
    { name: 'Product D', sales: 620, revenue: 6200, growth: 15.8 }
  ]);

  const demographics: Demographic[] = [
    { age: '18-24', percentage: 25, color: 'bg-blue-500' },
    { age: '25-34', percentage: 35, color: 'bg-green-500' },
    { age: '35-44', percentage: 20, color: 'bg-purple-500' },
    { age: '45+', percentage: 20, color: 'bg-orange-500' }
  ];

  const periods: FilterOption[] = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1y' }
  ];

  const metrics: FilterOption[] = [
    { label: 'Revenue', value: 'revenue' },
    { label: 'Users', value: 'users' },
    { label: 'Orders', value: 'orders' },
    { label: 'Conversion', value: 'conversion' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => prev.map(item => ({
        ...item,
        value: Math.max(10, Math.min(60, item.value + (Math.random() - 0.5) * 10))
      })));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const productInterval = setInterval(() => {
      setTopProducts(prev => prev.map(product => ({
        ...product,
        sales: product.sales + Math.floor((Math.random() - 0.5) * 50),
        revenue: product.revenue + Math.floor((Math.random() - 0.5) * 500),
        growth: product.growth + (Math.random() - 0.5) * 5
      })));
    }, 30000);

    return () => clearInterval(productInterval);
  }, []);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsLoading(true);

    setTimeout(() => {
      const newData = period === '7d' ? [
        { label: 'Revenue', value: 35, color: 'bg-blue-500' },
        { label: 'Users', value: 25, color: 'bg-green-500' },
        { label: 'Orders', value: 40, color: 'bg-purple-500' }
      ] : period === '30d' ? [
        { label: 'Revenue', value: 45, color: 'bg-blue-500' },
        { label: 'Users', value: 30, color: 'bg-green-500' },
        { label: 'Orders', value: 25, color: 'bg-purple-500' }
      ] : period === '90d' ? [
        { label: 'Revenue', value: 55, color: 'bg-blue-500' },
        { label: 'Users', value: 40, color: 'bg-green-500' },
        { label: 'Orders', value: 15, color: 'bg-purple-500' }
      ] : [
        { label: 'Revenue', value: 65, color: 'bg-blue-500' },
        { label: 'Users', value: 50, color: 'bg-green-500' },
        { label: 'Orders', value: 10, color: 'bg-purple-500' }
      ];

      setChartData(newData);
      setIsLoading(false);
    }, 800); 
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleExport = () => {
    console.log('Exporting analytics data...');
  };

  const handleFilter = () => {
    console.log('Applying filters...');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
          >
            <FileIcon className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <BarChartIcon className="w-4 h-4 text-gray-500" />
            <select
              value={selectedMetric}
              onChange={(e) => handleMetricChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <div className="text-sm text-gray-500">
              {selectedPeriod === '7d' ? 'Last 7 days' :
                selectedPeriod === '30d' ? 'Last 30 days' :
                  selectedPeriod === '90d' ? 'Last 90 days' : 'Last year'}
            </div>
          </div>
          <div className="h-64 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            <div className="flex items-end justify-between h-full">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center group cursor-pointer">
                  <div
                    className={`w-8 ${item.color} rounded-t-lg transition-all duration-300 hover:opacity-80 group-hover:scale-110`}
                    style={{ height: `${item.value * 2}px` }}
                  />
                  <span className="text-xs text-gray-600 mt-2 group-hover:text-blue-600 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-xs font-medium text-gray-900">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Demographics</h3>
          <div className="space-y-4">
            {demographics.map((demo, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 ${demo.color} rounded-full`} />
                  <span className="text-sm text-gray-700">{demo.age}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 ${demo.color} rounded-full transition-all duration-300`}
                      style={{ width: `${demo.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{demo.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                        {product.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {product.growth > 0 ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(product.growth).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$125,430', change: 12.5, trend: 'up' },
          { label: 'Active Users', value: '8,234', change: 8.2, trend: 'up' },
          { label: 'Conversion Rate', value: '3.24%', change: -1.2, trend: 'down' },
          { label: 'Avg. Order Value', value: '$45.67', change: 5.8, trend: 'up' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {metric.trend === 'up' ? (
                    <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChartIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage; 