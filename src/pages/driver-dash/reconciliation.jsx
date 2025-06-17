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
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Upload,
  Plus,
  RefreshCw,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  Receipt,
  CreditCard,
  Wallet,
  FileText,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Send,
  Paperclip,
  Camera
} from 'lucide-react';

// Sample financial data
const financialSummary = {
  totalAllowances: 85600,
  totalExpenses: 67800,
  pendingReimbursements: 12400,
  currentBalance: 5400,
  thisMonthExpenses: 18600,
  thisMonthAllowances: 28500,
  pendingApprovals: 3,
  overdueClaims: 1
};

// Allowance types data
const allowanceData = [
  { type: 'Travel Allowance', amount: 45000, percentage: 52, color: '#3B82F6' },
  { type: 'Meal Allowance', amount: 25000, percentage: 29, color: '#10B981' },
  { type: 'Fuel Allowance', amount: 15600, percentage: 19, color: '#F59E0B' }
];

// Expense categories data
const expenseCategories = [
  { category: 'Fuel', amount: 32000, percentage: 47, color: '#3B82F6' },
  { category: 'Maintenance', amount: 18500, percentage: 27, color: '#EF4444' },
  { category: 'Tolls & Parking', amount: 8900, percentage: 13, color: '#8B5CF6' },
  { category: 'Meals', amount: 5200, percentage: 8, color: '#10B981' },
  { category: 'Others', amount: 3200, percentage: 5, color: '#F59E0B' }
];

// Monthly financial trends
const monthlyTrends = [
  { month: 'Jan', allowances: 28000, expenses: 22000, balance: 6000 },
  { month: 'Feb', allowances: 32000, expenses: 25000, balance: 7000 },
  { month: 'Mar', allowances: 29000, expenses: 28000, balance: 1000 },
  { month: 'Apr', allowances: 35000, expenses: 30000, balance: 5000 },
  { month: 'May', allowances: 31000, expenses: 26000, balance: 5000 },
  { month: 'Jun', allowances: 28500, expenses: 24000, balance: 4500 }
];

// Recent transactions
const recentTransactions = [
  {
    id: 1,
    type: 'allowance',
    category: 'Travel Allowance',
    amount: 12000,
    date: '2024-06-17',
    status: 'approved',
    reference: 'TRV-2024-0617',
    description: 'Weekly travel allowance'
  },
  {
    id: 2,
    type: 'expense',
    category: 'Fuel',
    amount: -8500,
    date: '2024-06-16',
    status: 'pending',
    reference: 'EXP-2024-0616',
    description: 'Fuel purchase - Puma Station'
  },
  {
    id: 3,
    type: 'expense',
    category: 'Maintenance',
    amount: -4200,
    date: '2024-06-15',
    status: 'approved',
    reference: 'EXP-2024-0615',
    description: 'Vehicle oil change'
  },
  {
    id: 4,
    type: 'allowance',
    category: 'Meal Allowance',
    amount: 5000,
    date: '2024-06-15',
    status: 'approved',
    reference: 'MEAL-2024-0615',
    description: 'Daily meal allowance'
  },
  {
    id: 5,
    type: 'expense',
    category: 'Tolls',
    amount: -1200,
    date: '2024-06-14',
    status: 'rejected',
    reference: 'EXP-2024-0614',
    description: 'Highway toll payment'
  }
];

// Pending claims
const pendingClaims = [
  {
    id: 1,
    type: 'Fuel Reimbursement',
    amount: 8500,
    submittedDate: '2024-06-16',
    expectedApproval: '2024-06-20',
    status: 'under_review',
    receipts: 1
  },
  {
    id: 2,
    type: 'Parking Fees',
    amount: 2400,
    submittedDate: '2024-06-15',
    expectedApproval: '2024-06-19',
    status: 'pending_documents',
    receipts: 0
  },
  {
    id: 3,
    type: 'Emergency Repair',
    amount: 15000,
    submittedDate: '2024-06-10',
    expectedApproval: '2024-06-18',
    status: 'approved',
    receipts: 3
  }
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
      <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
        {prefix}{value}{suffix}
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

// Transaction Row Component
const TransactionRow = ({ transaction }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = (amount) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-4 text-sm text-gray-900">
        <div className="flex items-center gap-2">
          {transaction.type === 'allowance' ? (
            <ArrowDownRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-red-500" />
          )}
          {transaction.date}
        </div>
      </td>
      <td className="py-3 px-4 text-sm font-medium text-gray-900">{transaction.category}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{transaction.description}</td>
      <td className="py-3 px-4 text-sm font-medium">
        <span className={getAmountColor(transaction.amount)}>
          MWK {Math.abs(transaction.amount).toLocaleString()}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{transaction.reference}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
          {transaction.status.replace('_', ' ')}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Edit size={14} />
          </button>
        </div>
      </td>
    </tr>
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

const FinancialReconciliationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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
            <h1 className="text-2xl font-bold text-gray-900">Financial Reconciliation</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Real-time tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Current month</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExpenseForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              <Plus size={16} />
              Submit Expense
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Allowances" 
            value={financialSummary.totalAllowances.toLocaleString()}
            prefix="MWK "
            icon={Wallet} 
            color="green" 
            trend={15}
            subtitle="This month"
          />
          <MetricCard 
            title="Total Expenses" 
            value={financialSummary.totalExpenses.toLocaleString()}
            prefix="MWK "
            icon={CreditCard} 
            color="red" 
            trend={-8}
            subtitle="This month"
          />
          <MetricCard 
            title="Pending Reimbursements" 
            value={financialSummary.pendingReimbursements.toLocaleString()}
            prefix="MWK "
            icon={Clock} 
            color="orange" 
            subtitle="Awaiting approval"
          />
          <MetricCard 
            title="Current Balance" 
            value={financialSummary.currentBalance.toLocaleString()}
            prefix="MWK "
            icon={DollarSign} 
            color="blue" 
            trend={12}
            subtitle="Available funds"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Month Allowances" 
            value={financialSummary.thisMonthAllowances.toLocaleString()}
            prefix="MWK "
            icon={Target} 
            color="green" 
            trend={8}
          />
          <MetricCard 
            title="Month Expenses" 
            value={financialSummary.thisMonthExpenses.toLocaleString()}
            prefix="MWK "
            icon={Receipt} 
            color="purple" 
            trend={-3}
          />
          <MetricCard 
            title="Pending Approvals" 
            value={financialSummary.pendingApprovals}
            icon={CheckCircle} 
            color="orange" 
            subtitle="Items to review"
          />
          <MetricCard 
            title="Overdue Claims" 
            value={financialSummary.overdueClaims}
            icon={AlertTriangle} 
            color="red" 
            subtitle="Need attention"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Allowance Breakdown */}
          <ChartCard title="Allowance Breakdown">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={allowanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {allowanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {allowanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.type}</span>
                  </div>
                  <span className="font-medium">MWK {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Expense Categories */}
          <ChartCard title="Expense Categories">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {expenseCategories.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.category}</span>
                  </div>
                  <span className="font-medium">MWK {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Pending Claims */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Pending Claims</h3>
            </div>
            <div className="space-y-3">
              {pendingClaims.map((claim, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-3 ${
                  claim.status === 'approved' ? 'bg-green-50 border-green-500' :
                  claim.status === 'under_review' ? 'bg-blue-50 border-blue-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{claim.type}</h4>
                    <span className="text-sm font-bold text-gray-900">MWK {claim.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Submitted: {claim.submittedDate}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-1 rounded font-medium ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                      claim.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Paperclip size={12} />
                      <span>{claim.receipts} receipts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Trends Chart */}
        <ChartCard title="Financial Trends" size="full" action="View Details">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorAllowances" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="allowances" stroke="#10B981" fillOpacity={1} fill="url(#colorAllowances)" name="Allowances" />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
              <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={2} name="Balance" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Submit Expense</h4>
                <p className="text-sm text-gray-500">Upload receipts and submit for approval</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Submit New Expense
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Download Reports</h4>
                <p className="text-sm text-gray-500">Export financial summaries and statements</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
              Download Report
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">View Statements</h4>
                <p className="text-sm text-gray-500">Access detailed financial statements</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors">
              View Statements
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialReconciliationDashboard;