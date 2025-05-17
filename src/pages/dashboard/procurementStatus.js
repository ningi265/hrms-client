import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, ComposedChart,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const ProcurementStatusCard = ({ summaryData = [], allData = [], activeIndex = null, onPieEnter, onPieLeave, stats = {} }) => {
  const [chartType, setChartType] = useState('pie'); // 'pie', 'line', 'bar'
  const [activeCategory, setActiveCategory] = useState('Overall');

  // Define default colors for different statuses
  const defaultColors = {
    pending: '#FF9F1C',    // warm orange
    approved: '#2EC4B6',   // teal
    rejected: '#E71D36',   // bright red
    open: '#4361EE',       // bright blue
    closed: '#3A0CA3',     // deep purple
    paid: '#7209B7'        // vibrant purple
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
    
    // Filter data by category
    return useAllData
      .filter(item => item.category === activeCategory)
      .map(item => ({
        name: item.name.split(' ')[0], // Get first word (Pending, Approved, etc.)
        value: item.value,
        status: item.status,
      }));
  };

  const chartData = getChartData();

  // Calculate total for percentage display
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom shape for bars with gradient
  const CustomBar = (props) => {
    const { x, y, width, height, fill, status } = props;
    const color = defaultColors[status?.toLowerCase()] || '#4361EE';
    
    return (
      <g>
        {/* The bar with gradient */}
        <defs>
          <linearGradient id={`barGradient-${status}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        
        {/* The bar itself */}
        <rect 
          x={x} 
          y={y} 
          width={width} 
          height={height} 
          fill={`url(#barGradient-${status})`} 
          rx={3} 
          ry={3}
        />
      </g>
    );
  };

  // Generate quick stats from the data
  const generateQuickStats = () => {
    const totals = {
      Requisitions: stats?.requisitions?.counts?.total || 61, // Sum of default requisitions data if no stats
      RFQs: stats?.rfqs?.counts?.total || 37, // Sum of default RFQs data if no stats
      'Purchase Orders': stats?.purchaseOrders?.counts?.total || 47, // Sum of default PO data if no stats
      Invoices: stats?.invoices?.counts?.total || 44 // Sum of default invoices data if no stats
    };

    return Object.entries(totals).map(([category, total]) => ({
      title: category,
      value: total,
      change: Math.floor(Math.random() * 20) - 5 + '%', // Random change percentage for demo
      trend: Math.random() > 0.3 ? 'up' : 'down' // Random trend for demo
    }));
  };

  const quickStats = generateQuickStats();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Decorative accent at top of card */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      {/* Header with title and chart type toggles */}
      <div className="flex justify-between mb-6 items-center">
        <div>
          <div className="flex items-center">
            <h2 className="text-gray-800 font-bold text-lg">Procurement Status</h2>
            <div className="ml-2 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
              {activeCategory}
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-1">Current status of procurement activities</p>
        </div>
        
        {/* Chart Type Toggle Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setChartType('pie')} 
            className={`p-1.5 rounded transition-all text-sm flex items-center ${
              chartType === 'pie' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span className={chartType === 'pie' ? 'font-medium' : 'hidden md:inline'}>Pie</span>
          </button>
          <button 
            onClick={() => setChartType('line')} 
            className={`p-1.5 rounded transition-all text-sm flex items-center mx-1 ${
              chartType === 'line' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span className={chartType === 'line' ? 'font-medium' : 'hidden md:inline'}>Line</span>
          </button>
          <button 
            onClick={() => setChartType('bar')} 
            className={`p-1.5 rounded transition-all text-sm flex items-center ${
              chartType === 'bar' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className={chartType === 'bar' ? 'font-medium' : 'hidden md:inline'}>Bar</span>
          </button>
        </div>
      </div>
      
      {/* Category Tabs with Navigation Arrows */}
      <div className="border-b border-gray-200 mb-6 relative">
        <div className="flex items-center">
          {/* Left Arrow */}
          <button 
            className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-150 focus:outline-none"
            onClick={() => {
              const currentIndex = categories.indexOf(activeCategory);
              const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
              setActiveCategory(categories[prevIndex]);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Center Tab Content with fixed width and no scroll */}
          <div className="flex-1 flex justify-center mx-4 overflow-hidden">
            <div className="relative flex items-center justify-center">
              {categories.map((category) => (
                <div 
                  key={category}
                  className={`px-4 pb-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap mx-2 ${
                    activeCategory === category 
                      ? 'border-blue-600 text-blue-600 scale-110 opacity-100' 
                      : 'border-transparent text-gray-400 opacity-0 absolute'
                  }`}
                  style={{
                    display: activeCategory === category ? 'block' : 'none',
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Arrow */}
          <button 
            className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-150 focus:outline-none"
            onClick={() => {
              const currentIndex = categories.indexOf(activeCategory);
              const nextIndex = (currentIndex + 1) % categories.length;
              setActiveCategory(categories[nextIndex]);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Tab indicator dots */}
        <div className="flex justify-center mt-2 mb-2 space-x-1">
          {categories.map((category, index) => (
            <div 
              key={`dot-${index}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeCategory === category 
                  ? 'w-4 bg-blue-600' 
                  : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setActiveCategory(category)}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="h-72 mb-8">
        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {/* Create gradient definitions for each status */}
                {Object.entries(defaultColors).map(([status, color]) => (
                  <linearGradient key={`pieGradient-${status}`} id={`pieGradient-${status}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                  </linearGradient>
                ))}
                <filter id="pieGlow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={activeIndex !== null ? 120 : 110}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                strokeWidth={2}
                stroke="#fff"
                filter="url(#pieGlow)"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#pieGradient-${entry.status?.toLowerCase()})` || `url(#pieGradient-pending)`}
                    opacity={activeIndex === index ? 1 : 0.85}
                    className="transition-all duration-300"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="font-bold text-gray-800">{data.name}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          Count: <span className="font-semibold text-blue-600">{data.value}</span>
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {Math.round((data.value / total) * 100)}% of total
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 5, bottom: 40 }}>
              <defs>
                {/* Area gradient */}
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4361EE" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#4361EE" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4361EE" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="font-bold text-gray-800">{data.name}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          Count: <span className="font-semibold text-blue-600">{data.value}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* Area under the line */}
              <Area
                type="monotone"
                dataKey="value"
                fill="url(#areaGradient)"
                fillOpacity={1}
                stroke="none"
              />
              
              {/* Line */}
              <Line
                type="monotone"
                dataKey="value"
                name="Value"
                stroke="#4361EE"
                strokeWidth={2}
                dot={{ 
                  fill: "#4361EE", 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: '#FFFFFF',
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: "#4361EE", 
                  strokeWidth: 2,
                  fill: '#FFFFFF', 
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 5, bottom: 40 }} barGap={8}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="font-bold text-gray-800">{data.name}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          Count: <span className="font-semibold text-blue-600">{data.value}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                barSize={35}
                shape={<CustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Chart Legend if Pie Chart is active - improved with hover effects */}
      {chartType === 'pie' && (
        <div className="mt-6 grid grid-cols-3 gap-y-4 gap-x-4 mb-8">
          {chartData.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              onMouseEnter={() => onPieEnter(null, index)}
              onMouseLeave={onPieLeave}
            >
              <div 
                className="h-3 w-3 rounded-full mr-3 shadow-sm" 
                style={{ backgroundColor: defaultColors[item.status?.toLowerCase()] || '#4361EE' }}
              ></div>
              <div className="text-xs">
                <span className="font-bold text-gray-800">
                  {Math.round((item.value / total) * 100)}% - {item.name}
                </span>
                <div className="text-gray-500 mt-0.5 font-medium">
                  Count: {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Stats Section - Improved with icons and better visual hierarchy */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {quickStats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
            {/* Decorative accent bar that appears on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <div className="text-gray-500 text-xs font-medium mb-1">{stat.title}</div>
                <div className="text-gray-800 font-bold text-xl flex items-center">
                  {stat.value}
                  <span 
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium flex items-center ${
                      stat.trend === 'up' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
              
              {/* Category Icon */}
              <div className={`rounded-full p-2 ${
                stat.trend === 'up' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'
              }`}>
                {stat.title === 'Requisitions' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {stat.title === 'RFQs' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {stat.title === 'Purchase Orders' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {stat.title === 'Invoices' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Action buttons with improved styling */}
      <div className="mt-8 flex justify-between">
        <button className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center hover:bg-blue-100 transition-colors duration-150 shadow-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filter Data</span>
        </button>
        <button className="text-sm bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center hover:bg-blue-50 transition-colors duration-150 shadow-sm border border-blue-100 group">
          <span>View All Procurement</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProcurementStatusCard;