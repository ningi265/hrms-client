import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Tooltip,
  Legend
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Filter,
  Download,
  ChevronRight,
  Building2,
  Target,
  CreditCard,
  FileText,
  Award,
  BarChart3,
  Activity,
  Settings,
  Plus
} from 'lucide-react';

// Sample budget data
const budgetData = {
  totalAllocated: 325000,
  totalSpent: 178500,
  totalRemaining: 146500,
  pendingRequisitions: 24500,
  approvedThisMonth: 52000,
  utilizationRate: 55,
  totalRequisitions: 127,
  pendingApprovals: 8
};

// Department budget data
const departmentBudgets = [
  { 
    code: 'IT-Q1-2024', 
    department: 'Information Technology', 
    allocated: 100000, 
    spent: 55000, 
    remaining: 45000,
    utilizationRate: 55,
    color: '#3B82F6',
    manager: 'John Smith'
  },
  { 
    code: 'HR-Q1-2024', 
    department: 'Human Resources', 
    allocated: 50000, 
    spent: 32000, 
    remaining: 18000,
    utilizationRate: 64,
    color: '#10B981',
    manager: 'Sarah Johnson'
  },
  { 
    code: 'MKT-Q1-2024', 
    department: 'Marketing', 
    allocated: 75000, 
    spent: 41500, 
    remaining: 33500,
    utilizationRate: 55,
    color: '#F59E0B',
    manager: 'Mike Wilson'
  },
  { 
    code: 'FIN-Q1-2024', 
    department: 'Finance', 
    allocated: 40000, 
    spent: 18000, 
    remaining: 22000,
    utilizationRate: 45,
    color: '#EF4444',
    manager: 'Lisa Brown'
  },
  { 
    code: 'OPS-Q1-2024', 
    department: 'Operations', 
    allocated: 60000, 
    spent: 32000, 
    remaining: 28000,
    utilizationRate: 53,
    color: '#8B5CF6',
    manager: 'David Chen'
  }
];

// Monthly spending trend
const spendingTrendData = [
  { month: 'Jan', allocated: 325000, spent: 28500, target: 27000 },
  { month: 'Feb', spent: 45200, target: 54000 },
  { month: 'Mar', spent: 52800, target: 65000 },
  { month: 'Apr', spent: 52000, target: 81000 }
];

// Budget utilization by category
const utilizationData = [
  { name: 'IT Equipment', value: 45000, color: '#3B82F6' },
  { name: 'Software Licenses', value: 32000, color: '#10B981' },
  { name: 'Training', value: 28000, color: '#F59E0B' },
  { name: 'Office Supplies', value: 23500, color: '#EF4444' },
  { name: 'Travel', value: 35000, color: '#8B5CF6' },
  { name: 'Consulting', value: 15000, color: '#06B6D4' }
];

// Recent requisitions
const recentRequisitions = [
  {
    id: 'REQ-2024-087',
    description: 'Dell Laptops (5 units)',
    department: 'IT',
    budgetCode: 'IT-Q1-2024',
    amount: 6000,
    status: 'approved',
    requestedBy: 'John Smith',
    date: '2024-06-17',
    approver: 'CFO'
  },
  {
    id: 'REQ-2024-088',
    description: 'Marketing Campaign Software',
    department: 'Marketing',
    budgetCode: 'MKT-Q1-2024',
    amount: 12000,
    status: 'pending',
    requestedBy: 'Mike Wilson',
    date: '2024-06-16',
    approver: 'CFO'
  },
  {
    id: 'REQ-2024-089',
    description: 'HR Training Materials',
    department: 'HR',
    budgetCode: 'HR-Q1-2024',
    amount: 2500,
    status: 'approved',
    requestedBy: 'Sarah Johnson',
    date: '2024-06-15',
    approver: 'Dept Head'
  },
  {
    id: 'REQ-2024-090',
    description: 'Office Furniture',
    department: 'Operations',
    budgetCode: 'OPS-Q1-2024',
    amount: 4200,
    status: 'rejected',
    requestedBy: 'David Chen',
    date: '2024-06-14',
    approver: 'Finance'
  }
];

// Approval workflow data
const approvalWorkflowData = [
  { stage: 'Department Head', pending: 12, avgTime: '2.3 days' },
  { stage: 'Finance Review', pending: 5, avgTime: '1.8 days' },
  { stage: 'CFO Approval', pending: 3, avgTime: '3.1 days' }
];

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-4xl" : "text-2xl";
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={20} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend > 0 ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
        {prefix}{value.toLocaleString()}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, children, action, size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : size === "full" ? "col-span-full" : "";
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${cardClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {action && (
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

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

const BudgetOverviewDashboard = () => {
  const [timeRange, setTimeRange] = useState('quarter');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Overview</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Real-time tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Q1 2024</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              <Plus size={16} />
              New Requisition
            </button>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Allocated" 
            value={budgetData.totalAllocated}
            prefix="MWK "
            icon={Target} 
            color="blue" 
            subtitle="Q1 2024 Budget"
          />
          <MetricCard 
            title="Total Spent" 
            value={budgetData.totalSpent}
            prefix="MWK "
            icon={CreditCard} 
            color="green" 
            trend={12}
            subtitle="Approved expenditure"
          />
          <MetricCard 
            title="Remaining Budget" 
            value={budgetData.totalRemaining}
            prefix="MWK "
            icon={DollarSign} 
            color="purple" 
            subtitle="Available to spend"
          />
          <MetricCard 
            title="Pending Approvals" 
            value={budgetData.pendingApprovals}
            icon={Clock} 
            color="orange" 
            trend={-15}
            subtitle="Awaiting review"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Utilization Rate" 
            value={budgetData.utilizationRate}
            suffix="%"
            icon={BarChart3} 
            color="green" 
            trend={8}
          />
          <MetricCard 
            title="Total Requisitions" 
            value={budgetData.totalRequisitions}
            icon={FileText} 
            color="blue" 
            trend={22}
          />
          <MetricCard 
            title="Approved This Month" 
            value={budgetData.approvedThisMonth}
            prefix="MWK "
            icon={CheckCircle} 
            color="green" 
            trend={18}
          />
          <MetricCard 
            title="Pending Amount" 
            value={budgetData.pendingRequisitions}
            prefix="MWK "
            icon={AlertTriangle} 
            color="orange" 
            trend={-5}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Budget Utilization by Category */}
          <ChartCard title="Budget Utilization by Category">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {utilizationData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Monthly Spending Trend */}
          <ChartCard title="Spending vs Target">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={spendingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="spent" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  name="Actual Spent"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10B981', r: 4 }}
                  name="Target Spend"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Approval Workflow Status */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Approval Pipeline</h3>
              </div>
              <div className="space-y-3">
                {approvalWorkflowData.map((stage, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                      <div className="text-xs text-gray-500">Avg: {stage.avgTime}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{stage.pending}</span>
                      <span className="text-xs text-gray-500">pending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Department Budget Overview */}
        <ChartCard title="Department Budget Overview" size="full" action="Manage Budgets">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {departmentBudgets.map((dept, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                  </div>
                  <span className="text-xs text-gray-500">{dept.code}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Allocated</span>
                    <span className="font-medium">MWK {dept.allocated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Spent</span>
                    <span className="font-medium">MWK {dept.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Remaining</span>
                    <span className="font-medium text-green-600">MWK {dept.remaining.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        backgroundColor: dept.color, 
                        width: `${dept.utilizationRate}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Utilization</span>
                    <span className="font-medium">{dept.utilizationRate}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Manager: {dept.manager}</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Requisitions Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Recent Requisitions</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Requisition ID</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentRequisitions.map((req, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-blue-600">{req.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{req.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{req.department}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">MWK {req.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{req.requestedBy}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        req.status === 'approved' ? 'bg-green-100 text-green-800' :
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{req.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BudgetOverviewDashboard;