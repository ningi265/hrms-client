import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  Wallet,
  Eye,
  Edit,
  X,
  Loader
} from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal", onClick }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-4xl" : "text-2xl";
  
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${cardClass}`}
      onClick={onClick}
    >
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
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
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

// Budget Allocation Modal Component
const BudgetAllocationModal = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Budget Allocation</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Wallet className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Allocate Department Budgets</h4>
              <p className="text-sm text-gray-600">Distribute budget across departments for the current period</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Auto-Distribution Available</h4>
              <p className="text-sm text-gray-600">Use smart algorithms to distribute budget automatically</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-gray-900">Approval Workflow</h4>
              <p className="text-sm text-gray-600">Submit allocations for management approval</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onNavigate();
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Allocation
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3">
        <Loader className="animate-spin w-6 h-6 text-blue-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

const BudgetOverviewDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('quarter');
  const [isLoading, setIsLoading] = useState(false);
  const [budgetData, setBudgetData] = useState(null);
  const [showNewUserAlert, setShowNewUserAlert] = useState(true);
  const handleSectionChange = (section) => {
    navigate(`?section=${section}`, { replace: true });
  };
  const [departmentBudgets, setDepartmentBudgets] = useState([]);
  const [recentRequisitions, setRecentRequisitions] = useState([]);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [error, setError] = useState(null);

  // Fetch budget overview data
  const fetchBudgetOverview = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/budget/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBudgetData(data.data);
      } else {
        throw new Error('Failed to fetch budget overview');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching budget overview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch departments data
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const departments = await response.json();
        setDepartmentBudgets(departments.slice(0, 5)); // Show top 5 departments
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // Fetch recent requisitions
  const fetchRecentRequisitions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/requisitions?limit=4&sort=createdAt&order=desc`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentRequisitions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    }
  };

  useEffect(() => {
    fetchBudgetOverview();
    fetchDepartments();
    fetchRecentRequisitions();
  }, [timeRange]);

  const handleRefresh = () => {
    fetchBudgetOverview();
    fetchDepartments();
    fetchRecentRequisitions();
  };

  const handleAllocateBudget = () => {
    setShowNewUserAlert(false);
    handleSectionChange('budget-allocation'); 
  };

  // Default data when API data is not available
  const defaultBudgetData = budgetData || {
    totalBudget: 325000,
    totalAllocated: 178500,
    remainingBudget: 146500,
    allocationEfficiency: 55,
    currentPeriod: 'Q1 2024',
    status: 'active'
  };

  const utilizationData = [
    { name: 'IT Equipment', value: 45000, color: '#3B82F6' },
    { name: 'Software Licenses', value: 32000, color: '#10B981' },
    { name: 'Training', value: 28000, color: '#F59E0B' },
    { name: 'Office Supplies', value: 23500, color: '#EF4444' },
    { name: 'Travel', value: 35000, color: '#8B5CF6' },
    { name: 'Consulting', value: 15000, color: '#06B6D4' }
  ];

  const spendingTrendData = [
    { month: 'Jan', allocated: 325000, spent: 28500, target: 27000 },
    { month: 'Feb', spent: 45200, target: 54000 },
    { month: 'Mar', spent: 52800, target: 65000 },
    { month: 'Apr', spent: 52000, target: 81000 }
  ];

  const approvalWorkflowData = [
    { stage: 'Department Head', pending: 12, avgTime: '2.3 days' },
    { stage: 'Finance Review', pending: 5, avgTime: '1.8 days' },
    { stage: 'CFO Approval', pending: 3, avgTime: '3.1 days' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-semibold mb-2">Error Loading Budget Data</h3>
          <p className="text-sm">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
       <LoadingOverlay 
      isVisible={isLoading} 
      message="Loading Budget Data..." 
    />
    
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
                <span>{defaultBudgetData.currentPeriod}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-purple-500" />
                <span>Status: {defaultBudgetData.status}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAllocationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <Wallet size={16} />
              Allocate Budget
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
            title="Total Budget" 
            value={defaultBudgetData.totalBudget}
            prefix="MWK "
            icon={Target} 
            color="blue" 
            subtitle={defaultBudgetData.currentPeriod}
          />
          <MetricCard 
            title="Total Allocated" 
            value={defaultBudgetData.totalAllocated}
            prefix="MWK "
            icon={DollarSign} 
            color="green" 
            trend={12}
            subtitle="Distributed to departments"
          />
          <MetricCard 
            title="Remaining Budget" 
            value={defaultBudgetData.remainingBudget}
            prefix="MWK "
            icon={CreditCard} 
            color="purple" 
            subtitle="Available for allocation"
          />
          <MetricCard 
            title="Allocation Efficiency" 
            value={defaultBudgetData.allocationEfficiency}
            suffix="%"
            icon={BarChart3} 
            color="orange" 
            trend={8}
            subtitle="Budget utilization"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Active Departments" 
            value={departmentBudgets.length}
            icon={Building2} 
            color="blue" 
            subtitle="With budget allocations"
          />
          <MetricCard 
            title="Pending Approvals" 
            value={8}
            icon={Clock} 
            color="orange" 
            trend={-15}
            subtitle="Awaiting review"
          />
          <MetricCard 
            title="Approved This Month" 
            value={52000}
            prefix="MWK "
            icon={CheckCircle} 
            color="green" 
            trend={18}
            subtitle="Recent allocations"
          />
          <MetricCard 
            title="Budget Alerts" 
            value={3}
            icon={AlertTriangle} 
            color="red" 
            subtitle="Require attention"
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
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{dept.departmentCode}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium">MWK {(dept.budget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Spent</span>
                    <span className="font-medium">MWK {(dept.actualSpending || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Remaining</span>
                    <span className="font-medium text-green-600">MWK {((dept.budget || 0) - (dept.actualSpending || 0)).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500" 
                      style={{ 
                        width: `${dept.budget > 0 ? ((dept.actualSpending || 0) / dept.budget) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Utilization</span>
                    <span className="font-medium">{dept.budget > 0 ? Math.round(((dept.actualSpending || 0) / dept.budget) * 100) : 0}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Head: {dept.departmentHead}</div>
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentRequisitions.length > 0 ? (
                  recentRequisitions.map((req, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-blue-600">{req.requisitionNumber || `REQ-${index + 1}`}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{req.description || req.itemName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{req.department}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">MWK {(req.estimatedCost || req.totalCost || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          req.status === 'approved' ? 'bg-green-100 text-green-800' :
                          req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No recent requisitions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Budget Allocation Modal */}
      <BudgetAllocationModal 
        isOpen={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        onNavigate={handleAllocateBudget}
      />
    </div>
  );
};

export default BudgetOverviewDashboard;