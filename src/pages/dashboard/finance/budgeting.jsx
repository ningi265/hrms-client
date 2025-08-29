import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  DollarSign,
  PieChart as PieChartIcon,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Filter,
  Search,
  ChevronDown,
  Eye,
  FileText,
  Building2,
  Users,
  Calendar,
  Target,
  Activity,
  Award,
  Settings,
  Bell,
  ChevronRight
} from 'lucide-react';

// Sample budget data
const budgetData = {
  fiscalYear: 'FY2024',
  totalBudget: 2500000,
  allocated: 1875000,
  remaining: 625000,
  departments: [
    {
      name: 'Marketing',
      allocated: 450000,
      spent: 320000,
      remaining: 130000,
      percentage: 71,
      categories: [
        { name: 'Advertising', budget: 180000, spent: 135000 },
        { name: 'Events', budget: 120000, spent: 85000 },
        { name: 'Digital', budget: 100000, spent: 75000 },
        { name: 'Print', budget: 50000, spent: 25000 }
      ]
    },
    {
      name: 'IT',
      allocated: 600000,
      spent: 420000,
      remaining: 180000,
      percentage: 70,
      categories: [
        { name: 'Hardware', budget: 250000, spent: 180000 },
        { name: 'Software', budget: 200000, spent: 150000 },
        { name: 'Maintenance', budget: 100000, spent: 70000 },
        { name: 'Training', budget: 50000, spent: 20000 }
      ]
    },
    {
      name: 'Operations',
      allocated: 400000,
      spent: 310000,
      remaining: 90000,
      percentage: 78,
      categories: [
        { name: 'Facilities', budget: 200000, spent: 160000 },
        { name: 'Equipment', budget: 120000, spent: 90000 },
        { name: 'Supplies', budget: 80000, spent: 60000 }
      ]
    },
    {
      name: 'HR',
      allocated: 300000,
      spent: 210000,
      remaining: 90000,
      percentage: 70,
      categories: [
        { name: 'Recruitment', budget: 120000, spent: 80000 },
        { name: 'Training', budget: 100000, spent: 70000 },
        { name: 'Benefits', budget: 80000, spent: 60000 }
      ]
    },
    {
      name: 'Finance',
      allocated: 125000,
      spent: 85000,
      remaining: 40000,
      percentage: 68,
      categories: [
        { name: 'Audit', budget: 50000, spent: 30000 },
        { name: 'Tax', budget: 40000, spent: 30000 },
        { name: 'Consulting', budget: 35000, spent: 25000 }
      ]
    }
  ],
  recentTransactions: [
    {
      id: 'TRX-2024-088',
      date: '2024-06-16',
      description: 'Marketing Campaign Software',
      department: 'Marketing',
      category: 'Software',
      amount: 12000,
      vendor: 'MarketPro Solutions',
      status: 'processed'
    },
    {
      id: 'TRX-2024-087',
      date: '2024-06-15',
      description: 'Dell Laptops (5 units)',
      department: 'IT',
      category: 'Hardware',
      amount: 6000,
      vendor: 'Tech Solutions Inc.',
      status: 'processed'
    },
    {
      id: 'TRX-2024-086',
      date: '2024-06-14',
      description: 'Office Furniture',
      department: 'Operations',
      category: 'Equipment',
      amount: 8500,
      vendor: 'OfficePro Ltd',
      status: 'pending'
    },
    {
      id: 'TRX-2024-085',
      date: '2024-06-13',
      description: 'Adobe Creative Suite Licenses',
      department: 'Marketing',
      category: 'Software',
      amount: 4500,
      vendor: 'Adobe Systems',
      status: 'processed'
    },
    {
      id: 'TRX-2024-084',
      date: '2024-06-12',
      description: 'Employee Training Program',
      department: 'HR',
      category: 'Training',
      amount: 7500,
      vendor: 'SkillDev Institute',
      status: 'processed'
    }
  ],
  budgetTrends: [
    { month: 'Jan', budget: 180000, actual: 165000 },
    { month: 'Feb', budget: 190000, actual: 175000 },
    { month: 'Mar', budget: 210000, actual: 195000 },
    { month: 'Apr', budget: 220000, actual: 210000 },
    { month: 'May', budget: 230000, actual: 225000 },
    { month: 'Jun', budget: 240000, actual: 235000 }
  ],
  varianceAnalysis: [
    { department: 'Marketing', budget: 450000, actual: 320000, variance: -130000, percentage: -29 },
    { department: 'IT', budget: 600000, actual: 420000, variance: -180000, percentage: -30 },
    { department: 'Operations', budget: 400000, actual: 310000, variance: -90000, percentage: -23 },
    { department: 'HR', budget: 300000, actual: 210000, variance: -90000, percentage: -30 },
    { department: 'Finance', budget: 125000, actual: 85000, variance: -40000, percentage: -32 }
  ]
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-xl ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={18} className={
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
      <div className="text-xl font-bold text-gray-900 mb-1">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
      status === 'processed' ? 'bg-green-100 text-green-800' :
      status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {status === 'processed' ? <CheckCircle size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
};

// Department Budget Modal
const DepartmentBudgetModal = ({ isOpen, onClose, department }) => {
  if (!isOpen || !department) return null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{department.name} Budget</h2>
            <p className="text-sm text-gray-500">FY2024 Allocation: MWK {department.allocated.toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Budget Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Budget Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Allocated:</span>
                <span className="font-medium">MWK {department.allocated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spent:</span>
                <span className="font-medium">MWK {department.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining:</span>
                <span className={`font-medium ${
                  department.remaining > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  MWK {department.remaining.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilization:</span>
                <span className="font-medium">{department.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Budget vs Actual Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Budget vs Actual</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[department]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="allocated" fill="#3B82F6" name="Allocated" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="#10B981" name="Spent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
            <div className="flex">
              <div className="w-1/2 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={department.categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="budget"
                      nameKey="name"
                    >
                      {department.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 pl-3">
                <div className="space-y-2 text-sm">
                  {department.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div>MWK {category.budget.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {Math.round((category.spent / category.budget) * 100)}% spent
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const BudgetingDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [expandedDept, setExpandedDept] = useState(null);

  const openDepartmentDetails = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const toggleDeptExpand = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  const filteredTransactions = budgetData.recentTransactions.filter(trx => {
    const matchesSearch = trx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trx.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || trx.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Budget Management</h1>

          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              <Download size={14} />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard 
            title="Total Budget" 
            value={budgetData.totalBudget}
            prefix="MWK "
            icon={DollarSign} 
            color="blue" 
          />
          <MetricCard 
            title="Allocated" 
            value={budgetData.allocated}
            prefix="MWK "
            icon={PieChartIcon} 
            color="purple" 
          />
          <MetricCard 
            title="Remaining" 
            value={budgetData.remaining}
            prefix="MWK "
            icon={Target} 
            color={budgetData.remaining > 0 ? 'green' : 'red'} 
          />
          <MetricCard 
            title="Utilization" 
            value={Math.round((budgetData.allocated / budgetData.totalBudget) * 100)}
            suffix="%"
            icon={Activity} 
            color="orange" 
            trend={5}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Budget Trends */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Monthly Trends</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={budgetData.budgetTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="budget" stroke="#3B82F6" strokeWidth={2} name="Budget" />
                  <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Variance */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Department Variance</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData.varianceAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="budget" fill="#3B82F6" name="Budget" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="#10B981" name="Actual" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Department Budgets */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Department Budgets</h3>
            <span className="text-xs text-gray-500">{budgetData.departments.length} departments</span>
          </div>
          <div className="divide-y divide-gray-100">
            {budgetData.departments.map((dept, index) => (
              <div key={index} className="p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleDeptExpand(dept.name)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronRight 
                        size={16} 
                        className={`transition-transform ${expandedDept === dept.name ? 'rotate-90' : ''}`} 
                      />
                    </button>
                    <h4 className="font-medium text-gray-900 text-sm">{dept.name}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-gray-900 font-medium">
                        MWK {dept.spent.toLocaleString()} / {dept.allocated.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dept.percentage}% utilized
                      </div>
                    </div>
                    <button
                      onClick={() => openDepartmentDetails(dept)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                    >
                      <Eye size={12} />
                      Details
                    </button>
                  </div>
                </div>
                
                {expandedDept === dept.name && (
                  <div className="mt-2 pl-6">
                    <div className="mb-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          dept.percentage > 80 ? 'bg-red-500' :
                          dept.percentage > 60 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {dept.categories.map((cat, catIndex) => (
                        <div key={catIndex} className="bg-gray-50 rounded-lg p-2">
                          <div className="font-medium">{cat.name}</div>
                          <div className="text-gray-500">
                            MWK {cat.spent.toLocaleString()} / {cat.budget.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {budgetData.departments.map((dept, index) => (
                  <option key={index} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Recent Transactions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((trx, index) => (
              <div key={index} className="p-3 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">{trx.id}</span>
                      <StatusBadge status={trx.status} />
                    </div>
                    <div className="text-sm text-gray-900">{trx.description}</div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>{trx.department}</span>
                      <span>•</span>
                      <span>{trx.category}</span>
                      <span>•</span>
                      <span>MWK {trx.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{trx.date}</div>
                    <button className="mt-1 text-blue-600 hover:text-blue-700 text-xs font-medium">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Budget Modal */}
        <DepartmentBudgetModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          department={selectedDepartment}
        />
      </main>
    </div>
  );
};

export default BudgetingDashboard;