import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Area, ComposedChart, LabelList, Legend
} from 'recharts';

const RevenueChart = ({ salesData = [], revenueBreakdown = [] }) => {
  const [chartType, setChartType] = useState('line');
  const [activeCategory, setActiveCategory] = useState('Monthly');
  // Add animation state
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

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

  // Enhanced color palette for better visual hierarchy
  const defaultRevenueBreakdown = [
    { name: 'Product A', value: 35, color: '#3B82F6' },
    { name: 'Product B', value: 25, color: '#6366F1' },
    { name: 'Product C', value: 20, color: '#8B5CF6' },
    { name: 'Product D', value: 15, color: '#A855F7' },
    { name: 'Other', value: 5, color: '#D1D5DB' }
  ];

  // Use provided data or fallback to defaults
  const chartData = salesData.length > 0 ? salesData : defaultSalesData;
  const pieData = revenueBreakdown.length > 0 ? revenueBreakdown : defaultRevenueBreakdown;

  // Number formatting function for currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Revenue Metrics data
  const revenueMetrics = [
    { 
      title: "Current Month", 
      value: 95000,
      formattedValue: "$95K",
      change: "+12.5%",
      trend: "up",
      icon: "trending-up"
    },
    {
      title: "Previous Month", 
      value: 81000,
      formattedValue: "$81K",
      change: "+8.3%",
      trend: "up",
      icon: "trending-up"
    },
    {
      title: "YTD Revenue", 
      value: 536000,
      formattedValue: "$536K",
      change: "+5.7%",
      trend: "up",
      icon: "trending-up"
    },
    {
      title: "Projected Q2", 
      value: 310000,
      formattedValue: "$310K",
      change: "-2.1%",
      trend: "down",
      icon: "trending-down"
    }
  ];

  // Custom shape for labels on pie chart
  const renderCustomizedPieLabel = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#FFFFFF" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom bar for the bar chart
  const CustomBar = (props) => {
    const { x, y, width, height, fill } = props;
    
    return (
      <g>
        {/* The bar with gradient */}
        <defs>
          <linearGradient id={`barGradient-${width}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.95} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.7} />
          </linearGradient>
        </defs>
        
        {/* The bar itself with enhanced styling */}
        <rect 
          x={x} 
          y={y} 
          width={width} 
          height={height} 
          fill={`url(#barGradient-${width})`} 
          rx={4} 
          ry={4}
          filter="url(#shadow)"
        />
      </g>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/6 mb-8"></div>
      <div className="h-64 bg-gray-200 rounded mb-8"></div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Icon components
  const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const TrendingDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
    </svg>
  );

  const LineChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );

  const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const PieChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );

  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const ArrowRightIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  // Function to handle tooltip visibility
  const handleInfoIconHover = (isVisible) => {
    setShowTooltip(isVisible);
  };

  // Function to handle chart type change
  const handleChartTypeChange = (type) => {
    setIsLoading(true);
    setChartType(type);
    
    // Simulate loading effect when changing chart types
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // Function to handle export report
  const handleExportReport = () => {
    // Placeholder for export functionality
    console.log("Exporting report...");
    // In a real implementation, this would trigger a download or generate a PDF/CSV
    alert("Report export initiated! In a production environment, this would trigger the download of a PDF or CSV file.");
  };

  // Function to handle view detailed analytics
  const handleViewDetailed = () => {
    // Placeholder for navigation to detailed analytics
    console.log("Navigating to detailed analytics...");
    // In a real implementation, this would navigate to a detailed view
    alert("Navigating to detailed analytics! In a production environment, this would take you to a more comprehensive dashboard.");
  };

  return (
    <div className="bg-white rounded-xl p-7 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* SVG Filters for shadows and glows */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
          </filter>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-50 to-transparent opacity-30 rounded-tr-full pointer-events-none"></div>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Header Section with Title and Chart Type Toggle */}
          <div className="flex justify-between mb-6 items-center">
            <div className="flex items-center">
              <span className="text-gray-800 font-bold text-xl">Revenue Overview</span>
              <div className="ml-3 text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                {activeCategory}
              </div>
            </div>
            
            {/* Chart Type Toggle Buttons */}
            <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg">
              <button 
                onClick={() => handleChartTypeChange('line')} 
                className={`p-2 rounded-md transition-all duration-200 flex items-center space-x-1 ${
                  chartType === 'line' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Line chart"
              >
                <LineChartIcon />
                <span className="text-xs font-medium hidden sm:inline">Line</span>
              </button>
              <button 
                onClick={() => handleChartTypeChange('bar')} 
                className={`p-2 rounded-md transition-all duration-200 flex items-center space-x-1 ${
                  chartType === 'bar' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Bar chart"
              >
                <BarChartIcon />
                <span className="text-xs font-medium hidden sm:inline">Bar</span>
              </button>
              <button 
                onClick={() => handleChartTypeChange('pie')} 
                className={`p-2 rounded-md transition-all duration-200 flex items-center space-x-1 ${
                  chartType === 'pie' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Pie chart"
              >
                <PieChartIcon />
                <span className="text-xs font-medium hidden sm:inline">Pie</span>
              </button>
            </div>
          </div>
          
          {/* Time Period Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
                <button 
                  key={period}
                  onClick={() => setActiveCategory(period)}
                  className={`pb-2 px-1 text-sm font-medium transition-all duration-200 border-b-2 ${
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
          
          {/* Revenue Total Section */}
          <div className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Revenue Total</div>
          <div className="text-gray-800 font-bold text-3xl mb-8 flex items-center">
            {formatCurrency(536000)}
            <div className="ml-3 text-xs px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium flex items-center">
              <TrendingUpIcon />
              <span className="ml-1">+5.7%</span>
            </div>
          </div>
          
          {/* Chart Section - Dynamically shows either Line, Bar or Pie Chart */}
          <div className="h-64 mb-8 relative group">
            {/* Subtle chart background */}
            <div className="absolute inset-0 bg-gray-50 rounded-lg opacity-50"></div>
            
            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 5, bottom: 5 }}>
                  <defs>
                    {/* Enhanced gradient for revenue area */}
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    tickFormatter={(tick) => `$${tick/1000}k`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                    domain={[0, 120000]}
                    ticks={[0, 40000, 80000, 120000]}
                  />
                  <Tooltip
                    cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '5 5' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                      border: 'none',
                      padding: '12px 16px'
                    }}
                    formatter={(value) => [`${formatCurrency(value)}`, '']}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  
                  {/* Area under the revenue line */}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    fill="url(#revenueGradient)"
                    fillOpacity={1}
                    stroke="none"
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ 
                      fill: "#3B82F6", 
                      strokeWidth: 2, 
                      r: 5,
                      stroke: '#FFFFFF',
                    }}
                    activeDot={{ 
                      r: 7, 
                      stroke: "#3B82F6", 
                      strokeWidth: 2,
                      fill: '#FFFFFF', 
                      boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#8B5CF6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ 
                      fill: "#8B5CF6", 
                      strokeWidth: 2, 
                      r: 4,
                      stroke: '#FFFFFF',
                    }}
                    activeDot={{ 
                      r: 6, 
                      stroke: "#8B5CF6", 
                      strokeWidth: 2,
                      fill: '#FFFFFF'
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 5, bottom: 5 }} barGap={8}>
                  <defs>
                    {chartData.map((entry, index) => (
                      <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8} />
                      </linearGradient>
                    ))}
                    {chartData.map((entry, index) => (
                      <linearGradient key={`targetGradient-${index}`} id={`targetGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      </linearGradient>
                    ))}
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    tickFormatter={(tick) => `$${tick/1000}k`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                    domain={[0, 120000]}
                    ticks={[0, 40000, 80000, 120000]}
                  />
                  <Tooltip
                    cursor={false}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                      border: 'none',
                      padding: '12px 16px'
                    }}
                    formatter={(value) => [`${formatCurrency(value)}`, '']}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue"
                    barSize={24}
                    radius={[6, 6, 0, 0]}
                    shape={<CustomBar />}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                    ))}
                  </Bar>
                  <Bar 
                    dataKey="target" 
                    name="Target"
                    barSize={24}
                    radius={[6, 6, 0, 0]}
                    shape={<CustomBar />}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#targetGradient-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {pieData.map((entry, index) => (
                      <linearGradient key={`pieGradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.85} />
                      </linearGradient>
                    ))}
                    <filter id="pieGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedPieLabel}
                    strokeWidth={1.5}
                    stroke="#fff"
                    filter="url(#pieGlow)"
                    animationDuration={800}
                    animationBegin={300}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#pieGradient-${index})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
                      border: 'none',
                      padding: '12px 16px'
                    }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          {/* Chart Legend for Pie Chart */}
          {chartType === 'pie' && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4 mb-8">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center group p-3.5 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                  <div className="h-3.5 w-3.5 rounded-full mr-3 shadow-sm transform group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: item.color }}></div>
                  <div className="text-xs">
                    <span className="font-bold text-gray-800">{item.value}% - {item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Revenue Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {revenueMetrics.map((metric, index) => (
              <div 
                key={metric.title} 
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards' 
                }}
              >
                <div className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">{metric.title}</div>
                <div className="text-gray-800 font-bold text-xl flex items-center">
                  {metric.formattedValue}
                  <div 
                    className={`ml-3 text-xs px-2.5 py-1 rounded-full font-medium flex items-center ${
                      metric.trend === 'up' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {metric.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    <span className="ml-1">{metric.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer with actions */}
          <div className="mt-10 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button 
              onClick={handleExportReport}
              className="text-sm bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg font-medium flex items-center hover:bg-blue-100 transition-colors duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
            >
              <DownloadIcon />
              <span>Export Report</span>
            </button>
            <button 
              onClick={handleViewDetailed}
              className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors duration-200 group focus:outline-none"
            >
              <span>View Detailed Analytics</span>
              <ArrowRightIcon className="transform group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
          
          {/* Info Badge with Tooltip */}
          <div 
            className="absolute bottom-4 right-4 bg-gray-50 rounded-full p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
            onMouseEnter={() => handleInfoIconHover(true)}
            onMouseLeave={() => handleInfoIconHover(false)}
            title="Information about this chart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            {/* Tooltip Content */}
            {showTooltip && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg p-4 text-sm text-gray-700 transform transition-opacity duration-200 z-10 border border-gray-100">
                <div className="font-semibold mb-1 text-gray-800">About This Chart</div>
                <p className="mb-2">Data shown represents revenue performance against targets across periods. Toggle between chart types for different visualizations.</p>
                <div className="text-xs text-gray-500">Last updated: May 17, 2025</div>
                {/* Arrow */}
                <div className="absolute bottom-0 right-4 w-3 h-3 bg-white border-r border-b border-gray-100 transform rotate-45 translate-y-1.5"></div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueChart;