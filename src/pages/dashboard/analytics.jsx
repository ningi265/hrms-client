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
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  ShoppingCart,
  MapPin,
  Calculator,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Calendar,
  Activity,
  BarChart3,
  Target,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  Eye
} from 'lucide-react';

// Sample analytics data
const overviewMetrics = {
  totalRequisitions: 1247,
  totalPurchaseOrders: 892,
  totalInvoices: 756,
  totalTravelRequests: 324,
  totalReconciliations: 445,
  pendingApprovals: 67,
  monthlySpend: 2840000,
  annualSpend: 28400000,
  avgProcessingTime: 3.2,
  approvalRate: 87.5
};

// Requisition analytics
const requisitionTrends = [
  { month: 'Jan', submitted: 105, approved: 92, rejected: 8, pending: 5 },
  { month: 'Feb', submitted: 118, approved: 102, rejected: 12, pending: 4 },
  { month: 'Mar', submitted: 134, approved: 119, rejected: 9, pending: 6 },
  { month: 'Apr', submitted: 142, approved: 125, rejected: 11, pending: 6 },
  { month: 'May', submitted: 156, approved: 140, rejected: 8, pending: 8 },
  { month: 'Jun', submitted: 163, approved: 147, rejected: 10, pending: 6 }
];

const requisitionByDepartment = [
  { name: 'IT', value: 285, amount: 850000, color: '#3B82F6' },
  { name: 'Marketing', value: 192, amount: 640000, color: '#10B981' },
  { name: 'HR', value: 134, amount: 420000, color: '#F59E0B' },
  { name: 'Operations', value: 198, amount: 590000, color: '#EF4444' },
  { name: 'Finance', value: 87, amount: 280000, color: '#8B5CF6' },
  { name: 'Sales', value: 156, amount: 480000, color: '#EC4899' }
];

const requisitionByCategory = [
  { name: 'Software & Licenses', value: 324, amount: 1200000 },
  { name: 'Office Supplies', value: 287, amount: 180000 },
  { name: 'Equipment', value: 198, amount: 890000 },
  { name: 'Services', value: 156, amount: 620000 },
  { name: 'Training', value: 134, amount: 340000 },
  { name: 'Travel', value: 148, amount: 530000 }
];

// Purchase Order analytics
const purchaseOrderTrends = [
  { month: 'Jan', orders: 78, value: 420000, avgValue: 5385 },
  { month: 'Feb', orders: 85, value: 485000, avgValue: 5706 },
  { month: 'Mar', orders: 92, value: 518000, avgValue: 5630 },
  { month: 'Apr', orders: 98, value: 547000, avgValue: 5582 },
  { month: 'May', orders: 104, value: 592000, avgValue: 5692 },
  { month: 'Jun', orders: 110, value: 634000, avgValue: 5764 }
];

const vendorPerformance = [
  { vendor: 'TechPro Solutions', orders: 45, onTime: 42, quality: 98, amount: 650000 },
  { vendor: 'Office Dynamics', orders: 67, onTime: 63, quality: 95, amount: 420000 },
  { vendor: 'CloudTech Inc', orders: 38, onTime: 36, quality: 97, amount: 890000 },
  { vendor: 'Supply Chain Ltd', orders: 89, onTime: 85, quality: 92, amount: 340000 },
  { vendor: 'Global Services', orders: 52, onTime: 48, quality: 94, amount: 580000 }
];

// Invoice analytics
const invoiceStatusBreakdown = [
  { name: 'Paid', value: 623, amount: 2340000, color: '#10B981' },
  { name: 'Pending Payment', value: 89, amount: 420000, color: '#F59E0B' },
  { name: 'Overdue', value: 31, amount: 180000, color: '#EF4444' },
  { name: 'Disputed', value: 13, amount: 85000, color: '#8B5CF6' }
];

const paymentTrends = [
  { month: 'Jan', paid: 1850000, pending: 320000, overdue: 95000 },
  { month: 'Feb', paid: 2100000, pending: 380000, overdue: 120000 },
  { month: 'Mar', paid: 2280000, pending: 420000, overdue: 85000 },
  { month: 'Apr', paid: 2450000, pending: 350000, overdue: 110000 },
  { month: 'May', paid: 2690000, pending: 390000, overdue: 95000 },
  { month: 'Jun', paid: 2840000, pending: 420000, overdue: 180000 }
];

// Travel request analytics
const travelRequestTrends = [
  { month: 'Jan', domestic: 28, international: 12, amount: 185000 },
  { month: 'Feb', domestic: 32, international: 15, amount: 220000 },
  { month: 'Mar', domestic: 38, international: 18, amount: 285000 },
  { month: 'Apr', domestic: 35, international: 22, amount: 320000 },
  { month: 'May', domestic: 42, international: 19, amount: 295000 },
  { month: 'Jun', domestic: 45, international: 25, amount: 385000 }
];

const travelByPurpose = [
  { name: 'Client Meetings', value: 35, color: '#3B82F6' },
  { name: 'Training', value: 28, color: '#10B981' },
  { name: 'Conferences', value: 22, color: '#F59E0B' },
  { name: 'Site Visits', value: 15, color: '#EF4444' }
];

// Reconciliation analytics
const reconciliationMetrics = [
  { month: 'Jan', completed: 68, pending: 12, discrepancies: 8 },
  { month: 'Feb', completed: 75, pending: 15, discrepancies: 6 },
  { month: 'Mar', completed: 82, pending: 18, discrepancies: 9 },
  { month: 'Apr', completed: 78, pending: 14, discrepancies: 5 },
  { month: 'May', completed: 85, pending: 16, discrepancies: 7 },
  { month: 'Jun', completed: 89, pending: 19, discrepancies: 4 }
];

// Financial KPIs
const financialKPIs = [
  { metric: 'Cost Savings', current: 8.5, target: 10, unit: '%' },
  { metric: 'Processing Time', current: 3.2, target: 2.5, unit: 'days' },
  { metric: 'Approval Rate', current: 87.5, target: 90, unit: '%' },
  { metric: 'Vendor Performance', current: 94.2, target: 95, unit: '%' }
];

// Component for metric cards
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer ${onClick ? 'hover:border-blue-300' : ''}`}
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
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {trend > 0 ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

// KPI Progress component
const KPIProgress = ({ metric, current, target, unit }) => {
  const percentage = (current / target) * 100;
  const isGood = current >= target * 0.9;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{metric}</h4>
        <span className={`text-sm font-medium ${isGood ? 'text-emerald-600' : 'text-orange-600'}`}>
          {current}{unit} / {target}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${isGood ? 'bg-emerald-500' : 'bg-orange-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of target</div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [dateRange, setDateRange] = useState('6months');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const views = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'requisitions', name: 'Requisitions', icon: FileText },
    { id: 'purchases', name: 'Purchase Orders', icon: ShoppingCart },
    { id: 'invoices', name: 'Invoices', icon: DollarSign },
    { id: 'travel', name: 'Travel', icon: MapPin },
    { id: 'reconciliation', name: 'Reconciliation', icon: Calculator }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard 
          title="Total Requisitions" 
          value={overviewMetrics.totalRequisitions}
          icon={FileText} 
          color="blue" 
          trend={12}
          subtitle="This year"
        />
        <MetricCard 
          title="Purchase Orders" 
          value={overviewMetrics.totalPurchaseOrders}
          icon={ShoppingCart} 
          color="green" 
          trend={8}
          subtitle="Processed"
        />
        <MetricCard 
          title="Monthly Spend" 
          value={overviewMetrics.monthlySpend}
          prefix="MWK "
          icon={DollarSign} 
          color="purple" 
          trend={-3}
          subtitle="Current month"
        />
        <MetricCard 
          title="Pending Approvals" 
          value={overviewMetrics.pendingApprovals}
          icon={Clock} 
          color="orange" 
          trend={-15}
          subtitle="Awaiting action"
        />
        <MetricCard 
          title="Approval Rate" 
          value={overviewMetrics.approvalRate}
          suffix="%"
          icon={CheckCircle} 
          color="green" 
          trend={5}
          subtitle="Last 30 days"
        />
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialKPIs.map((kpi, index) => (
          <KPIProgress key={index} {...kpi} />
        ))}
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spend Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={paymentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [`MWK ${value.toLocaleString()}`, '']} />
              <Area dataKey="paid" stackId="1" fill="#10B981" fillOpacity={0.8} />
              <Area dataKey="pending" stackId="1" fill="#F59E0B" fillOpacity={0.8} />
              <Area dataKey="overdue" stackId="1" fill="#EF4444" fillOpacity={0.8} />
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Spending by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={requisitionByDepartment}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="amount"
              >
                {requisitionByDepartment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`MWK ${value.toLocaleString()}`, 'Amount']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderRequisitions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requisition Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Requisition Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={requisitionTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area dataKey="submitted" stackId="1" fill="#3B82F6" fillOpacity={0.8} />
              <Area dataKey="approved" stackId="1" fill="#10B981" fillOpacity={0.8} />
              <Area dataKey="rejected" stackId="1" fill="#EF4444" fillOpacity={0.8} />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Requisitions by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requisitionByDepartment} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Requisitions by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={requisitionByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPurchases = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Order Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Purchase Order Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={purchaseOrderTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} />
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Vendor Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorPerformance.slice(0, 5)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[80, 100]} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="vendor" axisLine={false} tickLine={false} width={120} />
              <Tooltip />
              <Bar dataKey="quality" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Invoice Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={invoiceStatusBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {invoiceStatusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [`MWK ${value.toLocaleString()}`, '']} />
              <Line type="monotone" dataKey="paid" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={3} />
              <Line type="monotone" dataKey="overdue" stroke="#EF4444" strokeWidth={3} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTravel = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Travel Request Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Travel Request Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={travelRequestTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="domestic" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="international" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={3} />
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Travel Purpose */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Travel by Purpose</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={travelByPurpose}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
              <Tooltip />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderReconciliation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Reconciliation Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={reconciliationMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area dataKey="completed" stackId="1" fill="#10B981" fillOpacity={0.8} />
            <Area dataKey="pending" stackId="1" fill="#F59E0B" fillOpacity={0.8} />
            <Area dataKey="discrepancies" stackId="1" fill="#EF4444" fillOpacity={0.8} />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into your procurement and finance operations</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-1">
          <div className="flex overflow-x-auto">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedView === view.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <view.icon size={16} />
                {view.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {selectedView === 'overview' && renderOverview()}
          {selectedView === 'requisitions' && renderRequisitions()}
          {selectedView === 'purchases' && renderPurchases()}
          {selectedView === 'invoices' && renderInvoices()}
          {selectedView === 'travel' && renderTravel()}
          {selectedView === 'reconciliation' && renderReconciliation()}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;