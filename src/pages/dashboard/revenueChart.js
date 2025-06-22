import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Area, AreaChart, Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  ArrowRight,
  Activity,
  DollarSign,
  Target,
  Calendar
} from 'lucide-react';

const RevenueChart = ({ salesData = [], revenueBreakdown = [] }) => {
  const [chartType, setChartType] = useState('line');
  const [activeCategory, setActiveCategory] = useState('Monthly');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Define default data in case props are empty
  const defaultSalesData = [
    { month: 'Jan', revenue: 65000, target: 60000, growth: 8 },
    { month: 'Feb', revenue: 59000, target: 65000, growth: -5 },
    { month: 'Mar', revenue: 80000, target: 70000, growth: 12 },
    { month: 'Apr', revenue: 81000, target: 75000, growth: 10 },
    { month: 'May', revenue: 56000, target: 80000, growth: -15 },
    { month: 'Jun', revenue: 95000, target: 85000, growth: 20 },
    { month: 'Jul', revenue: 100000, target: 90000, growth: 18 }
  ];

  const defaultRevenueBreakdown = [
    { name: 'Product A', value: 35, color: '#3B82F6' },
    { name: 'Product B', value: 25, color: '#10B981' },
    { name: 'Product C', value: 20, color: '#F59E0B' },
    { name: 'Product D', value: 15, color: '#8B5CF6' },
    { name: 'Other', value: 5, color: '#EF4444' }
  ];

  // Use provided data or fallback to defaults
  const chartData = salesData.length > 0 ? salesData : defaultSalesData;
  const pieData = revenueBreakdown.length > 0 ? revenueBreakdown : defaultRevenueBreakdown;

  // Revenue Metrics data
  const revenueMetrics = [
    { 
      title: "Current Month", 
      value: "95,000",
      change: "+12.5%",
      trend: 12.5,
      icon: DollarSign,
      color: "blue"
    },
    {
      title: "Previous Month", 
      value: "81,000",
      change: "+8.3%",
      trend: 8.3,
      icon: Calendar,
      color: "green"
    },
    {
      title: "YTD Revenue", 
      value: "536,000",
      change: "+5.7%",
      trend: 5.7,
      icon: Target,
      color: "purple"
    },
    {
      title: "Projected Q2", 
      value: "310,000",
      change: "-2.1%",
      trend: -2.1,
      icon: Activity,
      color: "orange"
    }
  ];

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: MWK {entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Metric Card Component
  const MetricCard = ({ title, value, icon: Icon, color, trend, prefix = "MWK ", size = "normal" }) => {
    const cardClass = size === "large" ? "col-span-2" : "";
    const valueSize = size === "large" ? "text-4xl" : "text-2xl";
    
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${cardClass} min-w-0`}>
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${
            color === 'blue' ? 'bg-blue-50' :
            color === 'green' ? 'bg-emerald-50' :
            color === 'purple' ? 'bg-purple-50' :
            color === 'orange' ? 'bg-orange-50' :
            'bg-gray-50'
          }`}>
            <Icon size={20} className={
              color === 'blue' ? 'text-blue-600' :
              color === 'green' ? 'text-emerald-600' :
              color === 'purple' ? 'text-purple-600' :
              color === 'orange' ? 'text-orange-600' :
              'text-gray-600'
            } />
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {trend > 0 ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`${valueSize} font-bold text-gray-900 mb-1 truncate`}>
          {prefix}{value}
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</div>
      </div>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Function to handle chart type change
  const handleChartTypeChange = (type) => {
    setIsLoading(true);
    setChartType(type);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex flex-col">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 w-full max-w-full overflow-hidden">
      {/* Header - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">Travel Request Expenses</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 overflow-hidden">
            <div className="flex items-center gap-1 flex-shrink-0">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="hidden sm:inline">Real-time tracking</span>
              <span className="sm:hidden">Live</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="truncate">{activeCategory}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Chart Card - MAIN CONTENT AREA - RESPONSIVE */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 lg:p-4 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h3 className="font-semibold text-gray-900 text-lg">Revenue Analysis</h3>
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg self-start sm:self-auto">
            <button 
              onClick={() => handleChartTypeChange('line')} 
              className={`p-2 rounded-md transition-colors ${
                chartType === 'line' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LineChartIcon size={16} />
            </button>
            <button 
              onClick={() => handleChartTypeChange('bar')} 
              className={`p-2 rounded-md transition-colors ${
                chartType === 'bar' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={16} />
            </button>
            <button 
              onClick={() => handleChartTypeChange('pie')} 
              className={`p-2 rounded-md transition-colors ${
                chartType === 'pie' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PieChartIcon size={16} />
            </button>
          </div>
        </div>

        {/* Time Period Tabs - RESPONSIVE */}
        <div className="border-b border-gray-200 mb-4 overflow-x-auto">
          <div className="flex space-x-4 lg:space-x-8 min-w-max pb-2">
            {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
              <button 
                key={period}
                onClick={() => setActiveCategory(period)}
                className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeCategory === period 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chart Section - RESPONSIVE */}
        <div className="flex-1 mb-4 min-h-0">
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' && (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="target" stroke="#10B981" fillOpacity={1} fill="url(#colorTarget)" name="Target" />
              </AreaChart>
            )}
            
            {chartType === 'bar' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#10B981" name="Target" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
            
            {chartType === 'pie' && (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            )}
          </ResponsiveContainer>

          {/* Chart Legend for Pie Chart - RESPONSIVE */}
          {chartType === 'pie' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm min-w-0">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600 truncate">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue Metrics Grid - RESPONSIVE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {revenueMetrics.map((metric, index) => (
          <MetricCard 
            key={index}
            title={metric.title} 
            value={metric.value}
            icon={metric.icon} 
            color={metric.color} 
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Action Cards - RESPONSIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mt-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-3 lg:p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate">Export Data</h4>
              <p className="text-sm text-gray-500 truncate">Download detailed revenue reports</p>
            </div>
          </div>
          <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm">
            Download Report
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 lg:p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
              <ArrowRight className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate">View Details</h4>
              <p className="text-sm text-gray-500 truncate">Access comprehensive analytics</p>
            </div>
          </div>
          <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;