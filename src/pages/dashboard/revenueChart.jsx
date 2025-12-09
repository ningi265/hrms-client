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
import TravelExpenseService from '../../services/travelExpenseService';

const RevenueChart = ({ salesData = [], revenueBreakdown = [] }) => {
  const [chartType, setChartType] = useState('bar');
  const [activeCategory, setActiveCategory] = useState('Monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  // Transform API data for chart consumption
  const transformApiData = (data) => {
    if (!data || !data.data || !data.data.travel_expenses) {
      return { chartData: [], pieData: [], metricsData: [] };
    }

    const { time_series_data, breakdown_data, metrics } = data.data.travel_expenses;

    // Transform time series data for line/bar charts
    const chartData = time_series_data.map(item => ({
      month: item.period,
      revenue: item.revenue,
      target: item.target,
      growth: item.growth
    }));

    // Transform breakdown data for pie chart
    const pieData = breakdown_data.map(item => ({
      name: item.category,
      value: item.value,
      amount: item.amount,
      color: item.color,
      description: item.description
    }));

    // Transform metrics data
    const metricsData = [
      {
        title: "Current Month",
        value: metrics.current_month.value.toLocaleString(),
        change: `${metrics.current_month.change_percentage > 0 ? '+' : ''}${metrics.current_month.change_percentage}%`,
        trend: metrics.current_month.change_percentage,
        icon: DollarSign,
        color: "blue"
      },
      {
        title: "Previous Month",
        value: metrics.previous_month.value.toLocaleString(),
        change: `${metrics.previous_month.change_percentage > 0 ? '+' : ''}${metrics.previous_month.change_percentage}%`,
        trend: metrics.previous_month.change_percentage,
        icon: Calendar,
        color: "green"
      },
      {
        title: "YTD Expenses",
        value: metrics.year_to_date.value.toLocaleString(),
        change: `${metrics.year_to_date.change_percentage > 0 ? '+' : ''}${metrics.year_to_date.change_percentage}%`,
        trend: metrics.year_to_date.change_percentage,
        icon: Target,
        color: "purple"
      },
      {
        title: "Projected Q2",
        value: metrics.projected_quarter.value.toLocaleString(),
        change: `${metrics.projected_quarter.change_percentage > 0 ? '+' : ''}${metrics.projected_quarter.change_percentage}%`,
        trend: metrics.projected_quarter.change_percentage,
        icon: Activity,
        color: "orange"
      }
    ];

    return { chartData, pieData, metricsData, metadata: data.data.travel_expenses.metadata };
  };

  // Fetch data from API
  const fetchData = async (period = 'monthly') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const periodMap = {
        'Monthly': 'monthly',
        'Quarterly': 'quarterly', 
        'Yearly': 'yearly'
      };

      const response = await TravelExpenseService.getTravelExpenseAnalytics({
        period: periodMap[period] || 'monthly',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      });

      setApiData(response);
    } catch (error) {
      console.error('Error fetching travel expense data:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (newCategory) => {
    setActiveCategory(newCategory);
  };

  // Get transformed data or fallback to defaults
  const { chartData, pieData, metricsData, metadata } = apiData ? 
    transformApiData(apiData) : 
    {
      chartData: [], 
      pieData: [], 
      metricsData: [],
      metadata: { currency: 'MWK', last_updated: new Date().toISOString() }
    };

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 text-center p-8">
        <div className="text-red-500 text-xl">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900">Failed to load data</h3>
        <p className="text-sm text-gray-600">{error}</p>
        <button 
          onClick={() => fetchData(activeCategory)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // Use fallback data if no API data is available
  const finalChartData = chartData.length > 0 ? chartData : [
    { month: 'Jan', revenue: 65000, target: 60000, growth: 8 },
    { month: 'Feb', revenue: 59000, target: 65000, growth: -5 },
    { month: 'Mar', revenue: 80000, target: 70000, growth: 12 },
    { month: 'Apr', revenue: 81000, target: 75000, growth: 10 },
    { month: 'May', revenue: 56000, target: 80000, growth: -15 },
    { month: 'Jun', revenue: 95000, target: 85000, growth: 20 }
  ];

  const finalPieData = pieData.length > 0 ? pieData : [
    { name: 'Domestic Travel', value: 65, color: '#3B82F6' },
    { name: 'International Travel', value: 35, color: '#10B981' }
  ];

  const finalMetricsData = metricsData.length > 0 ? metricsData : [
    { title: "Current Month", value: "95,000", change: "+12.5%", trend: 12.5, icon: DollarSign, color: "blue" },
    { title: "Previous Month", value: "81,000", change: "+8.3%", trend: 8.3, icon: Calendar, color: "green" },
    { title: "YTD Expenses", value: "536,000", change: "+5.7%", trend: 5.7, icon: Target, color: "purple" },
    { title: "Projected Q2", value: "310,000", change: "-2.1%", trend: -2.1, icon: Activity, color: "orange" }
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

  // Enhanced Metric Card Component
  const MetricCard = ({ title, value, icon: Icon, color, trend, prefix = "MWK ", size = "normal" }) => {
    const cardClass = size === "large" ? "col-span-2" : "";
    const valueSize = size === "large" ? "text-4xl" : "text-2xl";
    
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all ${cardClass} min-w-0`}>
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
      <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-1/6"></div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );

  // Function to handle chart type change
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full flex flex-col space-y-4 w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-32 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">Travel Request Expenses</h1>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 flex-1 flex flex-col min-h-0 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h3 className="font-semibold text-gray-900 text-lg">Revenue Analysis</h3>
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl self-start sm:self-auto">
            <button 
              onClick={() => handleChartTypeChange('bar')} 
              className={`p-2 rounded-lg transition-all ${
                chartType === 'bar' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={16} />
            </button>
            <button 
              onClick={() => handleChartTypeChange('line')} 
              className={`p-2 rounded-lg transition-all ${
                chartType === 'line' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LineChartIcon size={16} />
            </button>         
            <button 
              onClick={() => handleChartTypeChange('pie')} 
              className={`p-2 rounded-lg transition-all ${
                chartType === 'pie' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PieChartIcon size={16} />
            </button>
          </div>
        </div>

        {/* Time Period Tabs */}
        <div className="border-b border-gray-200 mb-4 overflow-x-auto">
          <div className="flex space-x-4 lg:space-x-8 min-w-max pb-2">
            {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
              <button 
                key={period}
                onClick={() => handleCategoryChange(period)}
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
        
        {/* Chart Section */}
        <div className="flex-1 mb-4 min-h-0">
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' && (
              <AreaChart data={finalChartData}>
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
              <BarChart data={finalChartData}>
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
                  data={finalPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {finalPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            )}
          </ResponsiveContainer>

          {/* Chart Legend for Pie Chart */}
          {chartType === 'pie' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
              {finalPieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm min-w-0">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600 truncate">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue Metrics Grid - <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {finalMetricsData.map((metric, index) => (
          <MetricCard 
            key={index}
            title={metric.title} 
            value={metric.value}
            icon={metric.icon} 
            color={metric.color} 
            trend={metric.trend}
          />
        ))}
      </div>*/}
     

      {/* Action Cards -<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mt-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate">Export Data</h4>
              <p className="text-sm text-gray-500 truncate">Download detailed revenue reports</p>
            </div>
          </div>
          <button className="w-full py-2.5 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm shadow-sm hover:shadow-md">
            Download Report
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
              <ArrowRight className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate">View Details</h4>
              <p className="text-sm text-gray-500 truncate">Access comprehensive analytics</p>
            </div>
          </div>
          <button className="w-full py-2.5 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm shadow-sm hover:shadow-md">
            View Analytics
          </button>
        </div>
      </div> */}
      
    </div>
  );
};

export default RevenueChart;