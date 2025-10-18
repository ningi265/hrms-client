import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';

const FinancialDashboard = () => {
  // Department data
  const departmentData = [
    { name: 'Product', value: 37600000, percentage: 38, color: '#4361EE' },
    { name: 'Business Development', value: 18149600, percentage: 27, color: '#5C7CFA' },
    { name: 'Marketing', value: 10152000, percentage: 23, color: '#8896EB' },
    { name: 'HR', value: 4096400, percentage: 12, color: '#C2C9F0' },
  ];

  // Chart of Accounts data
  const accountsData = [
    { name: 'Travel expenses', value: 42400000, percentage: 45, color: '#4361EE' },
    { name: 'Services', value: 31092600, percentage: 23, color: '#7C4DFF' },
    { name: 'Utilities', value: 17901000, percentage: 19, color: '#B39DDB' },
    { name: 'Transportation', value: 2826700, percentage: 13, color: '#D1C4E9' },
  ];

  // User Transactions data with Malawian names
  const transactionsData = [
    { name: 'Chisomo M.', value: 72, color: '#4361EE' },
    { name: 'Takondwa C.', value: 44, color: '#4361EE' },
    { name: 'Mayamiko N.', value: 19, color: '#4361EE' },
    { name: 'Chimwemwe B.', value: 16, color: '#4361EE' },
    { name: 'Other', value: 11, color: '#4361EE' },
  ];

  const xAxisTicks = [0, 18, 36, 72, 144, 288];

  // Number formatting function for Kwacha
  const formatKwacha = (value) => {
    return new Intl.NumberFormat('en-MW', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Custom label for vertical bars
  const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y - 10} fill="#6B7280" textAnchor="middle" fontSize={12} fontWeight="600">
        {value}%
      </text>
    );
  };

  // Custom shape for horizontal bars with dot at the end
  const CustomBar = (props) => {
    const { x, y, width, height, fill, value } = props;
    
    return (
      <g>
        {/* Drop shadow filter for dot */}
        <defs>
          <filter id={`dot-shadow-${value}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>
        
        {/* The bar with gradient */}
        <defs>
          <linearGradient id={`barGradient-${value}`} x1="0" y1="0" x2="1" y2="0">
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
          fill={`url(#barGradient-${value})`} 
          rx={3} 
          ry={3} 
          filter="url(#softShadow)"
        />
        
        {/* The dot at the end of the bar */}
        <circle 
          cx={x + width} 
          cy={y + height/2} 
          r={4} 
          fill="#4361EE" 
          filter={`url(#dot-shadow-${value})`}
        />
        
        {/* The percentage text */}
        <text 
          x={x + width + 10} 
          y={y + height/2 + 4} 
          fontSize="12" 
          fontWeight="600" 
          fill="#4361EE"
        >
          {value}%
        </text>
      </g>
    );
  };

  return (
    <div className="w-full">
      {/* Main Charts Container */}
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6 mt-4 lg:mt-14 px-2 lg:px-0">
        
        {/* Department Section */}
        <div className="bg-white rounded-xl p-4 lg:p-6 xl:p-7 w-full lg:w-1/3 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-5 gap-3">
            <div className="flex items-center">
              <span className="text-gray-800 font-bold text-base lg:text-lg">By Department</span>
              <div className="ml-2 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">This Week</div>
            </div>
            <div className="relative min-w-[140px]">
              <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pl-3 pr-8 text-gray-700 text-xs lg:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors duration-150 shadow-sm">
                <option>Department</option>
                <option>By Value</option>
                <option>By Percentage</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-3 w-3 lg:h-4 lg:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Total Amount */}
          <div className="text-gray-500 text-xs font-medium mb-1">Total</div>
          <div className="text-gray-800 font-bold text-xl lg:text-2xl mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center gap-2">
            <span>{formatKwacha(98956800)} MWK</span>
            <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium w-fit">+4.3%</span>
          </div>
          
          {/* Chart */}
          <div className="h-40 lg:h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} barSize={28} barGap={6}>
                <defs>
                  {departmentData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="95%" stopColor={entry.color} stopOpacity={0.9} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis tick={false} axisLine={false} />
                <YAxis 
                  tickFormatter={(tick) => `${tick/1000000}M`} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                  domain={[0, 60000000]}
                  ticks={[0, 30000000, 60000000]}
                  width={35}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', 
                    border: 'none',
                    padding: '8px 12px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${formatKwacha(value)} MWK`, '']}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 8, 8]} 
                  isAnimationActive={false}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                  ))}
                  <LabelList dataKey="percentage" content={renderCustomizedLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-4 lg:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {departmentData.map((item, index) => (
              <div key={index} className="flex items-center group p-2 lg:p-3 rounded-lg hover:bg-blue-50 transition-all duration-200">
                <div className="h-3 w-3 rounded-full mr-3 shadow-sm flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <div className="text-xs min-w-0 flex-1">
                  <div className="font-bold text-gray-800 truncate">{item.percentage}% - {item.name}</div>
                  <div className="text-gray-500 mt-0.5 font-medium truncate">{formatKwacha(item.value)} MWK</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart of Accounts Section */}
        <div className="bg-white rounded-xl p-4 lg:p-6 xl:p-7 w-full lg:w-1/3 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden"> 
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-5 gap-3">
            <div className="flex items-center">
              <span className="text-gray-800 font-bold text-base lg:text-lg">By Chart of Accounts</span>
              <div className="ml-2 text-xs px-2 py-1 bg-violet-50 text-violet-600 rounded-full font-medium">This Month</div>
            </div>
            <div className="relative min-w-[140px]">
              <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pl-3 pr-8 text-gray-700 text-xs lg:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors duration-150 shadow-sm">
                <option>Chart of Accounts</option>
                <option>By Type</option>
                <option>By Category</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-3 w-3 lg:h-4 lg:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Total Amount */}
          <div className="text-gray-500 text-xs font-medium mb-1">Total</div>
          <div className="text-gray-800 font-bold text-xl lg:text-2xl mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center gap-2">
            <span>{formatKwacha(94220300)} MWK</span>
            <span className="text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded-full font-medium w-fit">-1.2%</span>
          </div>
          
          {/* Chart */}
          <div className="h-40 lg:h-48 flex justify-center mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {accountsData.map((entry, index) => (
                    <linearGradient key={`pieGradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={accountsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={1}
                  dataKey="value"
                  isAnimationActive={false}
                  strokeWidth={1}
                  stroke="#fff"
                >
                  {accountsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#pieGradient-${index})`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', 
                    border: 'none',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                  formatter={(value, name, props) => [`${Math.round(value/94220300*100)}% - ${formatKwacha(value)} MWK`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-4 lg:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {accountsData.map((item, index) => (
              <div key={index} className="flex items-center group p-2 lg:p-3 rounded-lg hover:bg-violet-50 transition-all duration-200">
                <div className="h-3 w-3 rounded-full mr-3 shadow-sm flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <div className="text-xs min-w-0 flex-1">
                  <div className="font-bold text-gray-800 truncate">{item.percentage}% - {item.name}</div>
                  <div className="text-gray-500 mt-0.5 font-medium truncate">{formatKwacha(item.value)} MWK</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Transactions Section */}
        <div className="bg-white rounded-xl p-4 lg:p-6 xl:p-7 w-full lg:w-1/3 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-5 gap-3">
            <div className="flex items-center">
              <span className="text-gray-800 font-bold text-base lg:text-lg">User Transactions</span>
              <div className="ml-2 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">Last 30 Days</div>
            </div>
          </div>
          
          {/* Total Transactions */}
          <div className="text-gray-500 text-xs font-medium mb-1">Overall Transactions Amount</div>
          <div className="text-gray-800 font-bold text-xl lg:text-2xl mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center gap-2">
            <span>152</span>
            <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium w-fit">+12.5%</span>
          </div>
          
          {/* Chart */}
          <div className="h-44 lg:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={transactionsData}
                margin={{ top: 5, right: 30, bottom: 5, left: 0 }}
                barSize={6}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4361EE" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#4361EE" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis 
                  type="number" 
                  domain={[0, 288]}
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  hide={true}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                  width={70}
                />
                <CartesianGrid horizontal={true} vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  isAnimationActive={false}
                  shape={<CustomBar />}
                />
                <Tooltip 
                  cursor={false} 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', 
                    border: 'none',
                    padding: '8px 12px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* X-Axis Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-6 lg:mt-8 px-1 font-medium">
            {xAxisTicks.map((tick, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="h-1 w-1 bg-gray-300 rounded-full mb-1"></div>
                <span className="text-[10px] lg:text-xs">{tick}</span>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
            <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium flex items-center justify-center hover:bg-blue-100 transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
            </button>
            <button className="text-sm text-blue-600 font-medium flex items-center justify-center hover:text-blue-800 transition-colors duration-150">
              <span>View All Transactions</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;