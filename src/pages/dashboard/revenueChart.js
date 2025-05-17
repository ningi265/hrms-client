import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Area, ComposedChart, LabelList
} from 'recharts';

const RevenueChart = ({ salesData = [], revenueBreakdown = [] }) => {
  const [chartType, setChartType] = useState('line');
  const [activeCategory, setActiveCategory] = useState('Monthly');

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
    { name: 'Product A', value: 35, color: '#4361EE' },
    { name: 'Product B', value: 25, color: '#5C7CFA' },
    { name: 'Product C', value: 20, color: '#8896EB' },
    { name: 'Product D', value: 15, color: '#B39DDB' },
    { name: 'Other', value: 5, color: '#C2C9F0' }
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
      trend: "up"
    },
    {
      title: "Previous Month", 
      value: 81000,
      formattedValue: "$81K",
      change: "+8.3%",
      trend: "up"
    },
    {
      title: "YTD Revenue", 
      value: 536000,
      formattedValue: "$536K",
      change: "+5.7%",
      trend: "up"
    },
    {
      title: "Projected Q2", 
      value: 310000,
      formattedValue: "$310K",
      change: "-2.1%",
      trend: "down"
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

  // Custom bar for the bar chart (similar to FinancialDashboard)
  const CustomBar = (props) => {
    const { x, y, width, height, fill } = props;
    
    return (
      <g>
        {/* The bar with gradient */}
        <defs>
          <linearGradient id={`barGradient-${width}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.9} />
            <stop offset="100%" stopColor={fill} stopOpacity={1} />
          </linearGradient>
        </defs>
        
        {/* The bar itself */}
        <rect 
          x={x} 
          y={y} 
          width={width} 
          height={height} 
          fill={`url(#barGradient-${width})`} 
          rx={3} 
          ry={3}
        />
      </g>
    );
  };

  return (
    <div className="bg-white rounded-xl p-7 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Header Section with Title and Chart Type Toggle */}
      <div className="flex justify-between mb-5 items-center">
        <div className="flex items-center">
          <span className="text-gray-800 font-bold text-lg">Revenue Overview</span>
          <div className="ml-2 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
            {activeCategory}
          </div>
        </div>
        
        {/* Chart Type Toggle Buttons */}
        <div className="flex space-x-1">
          <button 
            onClick={() => setChartType('line')} 
            className={`p-2 rounded-lg transition-all ${
              chartType === 'line' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </button>
          <button 
            onClick={() => setChartType('bar')} 
            className={`p-2 rounded-lg transition-all ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button 
            onClick={() => setChartType('pie')} 
            className={`p-2 rounded-lg transition-all ${
              chartType === 'pie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Time Period Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-6">
          {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
            <button 
              key={period}
              onClick={() => setActiveCategory(period)}
              className={`pb-2 px-1 text-sm font-medium transition-all border-b-2 ${
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
      <div className="text-gray-500 text-xs font-medium mb-1">Revenue Total</div>
      <div className="text-gray-800 font-bold text-2xl mb-8 flex items-center">
        {formatCurrency(536000)}
        <span className="ml-2 text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium">+5.7%</span>
      </div>
      
      {/* Chart Section - Dynamically shows either Line, Bar or Pie Chart */}
      <div className="h-64 mb-8">
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
              <defs>
                {/* Gradient for revenue area */}
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4361EE" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#4361EE" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4361EE" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis 
                tickFormatter={(tick) => `$${tick/1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                domain={[0, 120000]}
                ticks={[0, 40000, 80000, 120000]}
              />
              <Tooltip
                cursor={false}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)', 
                  border: 'none',
                  padding: '10px 14px'
                }}
                formatter={(value) => [`${formatCurrency(value)}`, '']}
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
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#7C4DFF"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ 
                  fill: "#7C4DFF", 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: '#FFFFFF',
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: "#7C4DFF", 
                  strokeWidth: 2,
                  fill: '#FFFFFF'
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }} barGap={8}>
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4361EE" stopOpacity={1} />
                    <stop offset="95%" stopColor="#4361EE" stopOpacity={0.9} />
                  </linearGradient>
                ))}
                {chartData.map((entry, index) => (
                  <linearGradient key={`targetGradient-${index}`} id={`targetGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C4DFF" stopOpacity={1} />
                    <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0.9} />
                  </linearGradient>
                ))}
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis 
                tickFormatter={(tick) => `$${tick/1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                domain={[0, 120000]}
                ticks={[0, 40000, 80000, 120000]}
              />
              <Tooltip
                cursor={false}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)', 
                  border: 'none',
                  padding: '10px 14px'
                }}
                formatter={(value) => [`${formatCurrency(value)}`, '']}
              />
              
              <Bar 
                dataKey="revenue" 
                name="Revenue"
                barSize={20}
                radius={[4, 4, 0, 0]}
                shape={<CustomBar />}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                ))}
              </Bar>
              <Bar 
                dataKey="target" 
                name="Target"
                barSize={20}
                radius={[4, 4, 0, 0]}
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
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                  </linearGradient>
                ))}
                <filter id="pieGlow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={1}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedPieLabel}
                strokeWidth={1}
                stroke="#fff"
                filter="url(#pieGlow)"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGradient-${index})`} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)', 
                  border: 'none',
                  padding: '10px 14px'
                }}
                formatter={(value) => [`${value}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Chart Legend for Pie Chart */}
      {chartType === 'pie' && (
        <div className="mt-6 grid grid-cols-3 gap-y-4 gap-x-4 mb-8">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center group p-3 rounded-lg hover:bg-blue-50 transition-all duration-200">
              <div className="h-3 w-3 rounded-full mr-3 shadow-sm" style={{ backgroundColor: item.color }}></div>
              <div className="text-xs">
                <span className="font-bold text-gray-800">{item.value}% - {item.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Revenue Metrics Section */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {revenueMetrics.map((metric) => (
          <div key={metric.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="text-gray-500 text-xs font-medium mb-1">{metric.title}</div>
            <div className="text-gray-800 font-bold text-xl flex items-center">
              {metric.formattedValue}
              <span 
                className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${
                  metric.trend === 'up' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer with actions */}
      <div className="mt-8 flex justify-between">
        <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium flex items-center hover:bg-blue-100 transition-colors duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export Report</span>
        </button>
        <button className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors duration-150">
          <span>View Detailed Analytics</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RevenueChart;