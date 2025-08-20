import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  ShoppingCart,
  Receipt,
  Activity,
  Calendar
} from 'lucide-react';

const ProcurementStatusCard = ({ summaryData = [], allData = [], activeIndex = null, onPieEnter, onPieLeave, stats = {} }) => {
  const [chartType, setChartType] = useState('pie');
  const [activeCategory, setActiveCategory] = useState('Overall');

  // Define default colors for different statuses
  const defaultColors = {
    pending: '#F59E0B',    // orange
    approved: '#10B981',   // emerald
    rejected: '#EF4444',   // red
    open: '#3B82F6',       // blue
    closed: '#8B5CF6',     // purple
    paid: '#10B981'        // emerald
  };

  // Categories for tabs
  const categories = ['Overall', 'Requisitions', 'RFQs', 'Purchase Orders', 'Invoices'];
  
  // Default data if none provided
  const defaultSummaryData = [
    { name: 'Pending', value: 23, status: 'pending' },
    { name: 'Approved', value: 45, status: 'approved' },
    { name: 'Rejected', value: 12, status: 'rejected' },
    { name: 'Open', value: 32, status: 'open' },
    { name: 'Closed', value: 28, status: 'closed' }
  ];

  const defaultAllData = [
    // Requisitions
    { category: 'Requisitions', name: 'Pending Requisitions', value: 18, status: 'pending' },
    { category: 'Requisitions', name: 'Approved Requisitions', value: 35, status: 'approved' },
    { category: 'Requisitions', name: 'Rejected Requisitions', value: 8, status: 'rejected' },
    
    // RFQs
    { category: 'RFQs', name: 'Open RFQs', value: 22, status: 'open' },
    { category: 'RFQs', name: 'Closed RFQs', value: 15, status: 'closed' },
    
    // Purchase Orders
    { category: 'Purchase Orders', name: 'Pending POs', value: 14, status: 'pending' },
    { category: 'Purchase Orders', name: 'Approved POs', value: 28, status: 'approved' },
    { category: 'Purchase Orders', name: 'Rejected POs', value: 5, status: 'rejected' },
    
    // Invoices
    { category: 'Invoices', name: 'Pending Invoices', value: 12, status: 'pending' },
    { category: 'Invoices', name: 'Paid Invoices', value: 32, status: 'paid' }
  ];

  // Use provided data or fallback to defaults
  const useSummaryData = summaryData.length > 0 ? summaryData : defaultSummaryData;
  const useAllData = allData.length > 0 ? allData : defaultAllData;

  // Get data based on active category
  const getChartData = () => {
    if (activeCategory === 'Overall') {
      return useSummaryData;
    }
    
    return useAllData
      .filter(item => item.category === activeCategory)
      .map(item => ({
        name: item.name.split(' ')[0],
        value: item.value,
        status: item.status,
      }));
  };

  const chartData = getChartData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Generate quick stats from the data
  const generateQuickStats = () => {
    const totals = {
      Requisitions: stats?.requisitions?.counts?.total || 61,
      RFQs: stats?.rfqs?.counts?.total || 37,
      'Purchase Orders': stats?.purchaseOrders?.counts?.total || 47,
      Invoices: stats?.invoices?.counts?.total || 44
    };

    return Object.entries(totals).map(([category, total]) => ({
      title: category,
      value: total,
      change: Math.floor(Math.random() * 20) - 5 + '%',
      trend: Math.random() > 0.3 ? 'up' : 'down'
    }));
  };

  const quickStats = generateQuickStats();

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-md">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-xs text-gray-500">
            {Math.round((data.value / total) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Enhanced Metric Card Component
  const MetricCard = ({ title, value, icon: Icon, color, trend, size = "normal" }) => {
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
              {trend === 'up' ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {trend === 'up' ? '+' : ''}{trend}
              </span>
            </div>
          )}
        </div>
        <div className={`${valueSize} font-bold text-gray-900 mb-1 truncate`}>
          {value}
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">Procurement Status</h1>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 flex-1 flex flex-col min-h-0 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h3 className="font-semibold text-gray-900 text-lg">Status Overview</h3>
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl self-start sm:self-auto">
            <button 
              onClick={() => setChartType('pie')} 
              className={`p-2 rounded-lg transition-all ${
                chartType === 'pie' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PieChartIcon size={16} />
            </button>
             
            <button 
              onClick={() => setChartType('line')} 
              className={`p-2 rounded-lg transition-all ${
                chartType === 'line' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LineChartIcon size={16} />
            </button>
            
            <button 
              onClick={() => setChartType('bar')} 
              className={`p-2 rounded-lg transition-all ${
                chartType === 'bar' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={16} />
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => {
              const currentIndex = categories.indexOf(activeCategory);
              const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
              setActiveCategory(categories[prevIndex]);
            }}
            className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="text-center min-w-0 flex-1 mx-4">
            <h3 className="font-semibold text-gray-900 truncate">{activeCategory}</h3>
            <div className="flex justify-center mt-2 space-x-1">
              {categories.map((category, index) => (
                <div 
                  key={`dot-${index}`}
                  className={`h-2 w-2 rounded-full transition-colors cursor-pointer ${
                    activeCategory === category ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => {
              const currentIndex = categories.indexOf(activeCategory);
              const nextIndex = (currentIndex + 1) % categories.length;
              setActiveCategory(categories[nextIndex]);
            }}
            className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Chart Section */}
        <div className="flex-1 mb-4 min-h-0">
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'pie' && (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={defaultColors[entry.status?.toLowerCase()] || '#3B82F6'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            )}
            
            {chartType === 'line' && (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorArea)" />
              </AreaChart>
            )}
            
            {chartType === 'bar' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>

          {/* Chart Legend for Pie Chart */}
          {chartType === 'pie' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: defaultColors[item.status?.toLowerCase()] || '#3B82F6' }}
                  />
                  <span className="text-gray-600 truncate">
                    {item.name}: {Math.round((item.value / total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {quickStats.map((stat, index) => {
          const getIcon = (title) => {
            switch(title) {
              case 'Requisitions': return FileText;
              case 'RFQs': return HelpCircle;
              case 'Purchase Orders': return ShoppingCart;
              case 'Invoices': return Receipt;
              default: return Activity;
            }
          };

          const getColor = (index) => {
            const colors = ['blue', 'green', 'purple', 'orange'];
            return colors[index % colors.length];
          };

          return (
            <MetricCard 
              key={index}
              title={stat.title} 
              value={stat.value}
              icon={getIcon(stat.title)} 
              color={getColor(index)} 
              trend={stat.trend}
            />
          );
        })}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mt-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate">Advanced Filters</h4>
              <p className="text-sm text-gray-500 truncate">Customize your procurement view</p>
            </div>
          </div>
          <button className="w-full py-2.5 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm shadow-sm hover:shadow-md">
            Apply Filters
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
              <ArrowRight className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate">View All</h4>
              <p className="text-sm text-gray-500 truncate">Access complete procurement dashboard</p>
            </div>
          </div>
          <button className="w-full py-2.5 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm shadow-sm hover:shadow-md">
            View All Procurement
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementStatusCard;