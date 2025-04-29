import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const FuturisticProcurementChart = () => {
  // Combined data from all procurement processes
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Define color scheme for a futuristic look
  const colors = {
    pending: '#FF9F1C',    // warm orange
    approved: '#2EC4B6',   // teal
    rejected: '#E71D36',   // bright red
    open: '#4361EE',       // bright blue
    closed: '#3A0CA3',     // deep purple
    paid: '#7209B7'        // vibrant purple
  };
  
  // Combine all statuses into a single dataset
  const allData = [
    { name: 'Pending Requisitions', value: 12, category: 'Requisitions', status: 'pending' },
    { name: 'Approved Requisitions', value: 28, category: 'Requisitions', status: 'approved' },
    { name: 'Rejected Requisitions', value: 5, category: 'Requisitions', status: 'rejected' },
    { name: 'Open RFQs', value: 8, category: 'RFQs', status: 'open' },
    { name: 'Closed RFQs', value: 15, category: 'RFQs', status: 'closed' },
    { name: 'Pending POs', value: 10, category: 'Purchase Orders', status: 'pending' },
    { name: 'Approved POs', value: 22, category: 'Purchase Orders', status: 'approved' },
    { name: 'Rejected POs', value: 3, category: 'Purchase Orders', status: 'rejected' },
    { name: 'Pending Invoices', value: 14, category: 'Invoices', status: 'pending' },
    { name: 'Approved Invoices', value: 18, category: 'Invoices', status: 'approved' },
    { name: 'Paid Invoices', value: 25, category: 'Invoices', status: 'paid' }
  ];
  
  // Calculate totals for each category
  const totals = {
    Requisitions: 45,
    RFQs: 23,
    'Purchase Orders': 35,
    Invoices: 57
  };
  
  // Calculate summary status across all categories
  const statusSummary = allData.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = 0;
    }
    acc[item.status] += item.value;
    return acc;
  }, {});
  
  const summaryData = Object.entries(statusSummary).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
    status
  }));
  
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg text-white border border-gray-700">
          <p className="font-bold text-lg">{payload[0].name}</p>
          <p className="text-md">Count: <span className="font-bold">{payload[0].value}</span></p>
          <p className="text-sm text-gray-300">
            {Math.round((payload[0].value / 160) * 100)}% of total procurement items
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-xl p-6 text-gray-800 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-700">
          Procurement Status Overview
        </h2>
        <p className="text-gray-600 mt-2">
          Summary of all procurement activities by status
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summaryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={activeIndex !== null ? 110 : 100}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                stroke="#121212"
                strokeWidth={2}
              >
                {summaryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[entry.status.toLowerCase()]} 
                    fillOpacity={activeIndex === index ? 1 : 0.8}
                    style={{
                      filter: activeIndex === index ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' : 'none'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom"
                layout="horizontal"
                formatter={(value) => (
                  <span className="text-sm text-gray-300">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <div className="bg-gray-50 rounded-lg p-4 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Process Breakdown</h3>
            {Object.entries(totals).map(([category, total]) => (
              <div key={category} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600 text-sm">{category}</span>
                  <span className="text-gray-800 font-medium">{total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-full rounded-full ${
                      category === 'Requisitions' ? 'bg-gradient-to-r from-blue-500 to-teal-400' :
                      category === 'RFQs' ? 'bg-gradient-to-r from-purple-600 to-blue-500' :
                      category === 'Purchase Orders' ? 'bg-gradient-to-r from-green-500 to-blue-600' :
                      'bg-gradient-to-r from-pink-600 to-purple-600'
                    }`}
                    style={{ width: `${Math.round((total / 160) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-gray-50 rounded-lg p-4 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Quick Insights</h3>
            <ul className="text-sm text-gray-600">
              <li className="flex items-center py-1">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Most items are in approved or paid status (58%)</span>
              </li>
              <li className="flex items-center py-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span>36 items are pending action (22.5%)</span>
              </li>
              <li className="flex items-center py-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span>Invoices represent the largest process volume (35.6%)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 text-center">
        Total procurement items: 160 • Last updated: April 29, 2025
      </div>
    </div>
  );
};

export default FuturisticProcurementChart;