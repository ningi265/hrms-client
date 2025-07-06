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
  Legend
} from 'recharts';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Mail,
  Printer,
  Share2,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  User,
  DollarSign,
  TrendingUp,
  BarChart3,
  Users,
  ShoppingCart,
  MapPin,
  Calculator,
  FileBarChart,
  Table,
  Grid3X3
} from 'lucide-react';

// Sample report data
const reportCategories = [
  {
    id: 'financial',
    name: 'Financial Reports',
    icon: DollarSign,
    color: 'green',
    reports: [
      {
        id: 'expense-summary',
        name: 'Monthly Expense Summary',
        description: 'Comprehensive breakdown of all expenses by department and category',
        lastGenerated: '2024-07-05',
        frequency: 'Monthly',
        format: ['PDF', 'Excel'],
        size: '2.4 MB',
        recipients: 12
      },
      {
        id: 'budget-variance',
        name: 'Budget Variance Analysis',
        description: 'Comparison of actual vs budgeted expenses with variance analysis',
        lastGenerated: '2024-07-04',
        frequency: 'Weekly',
        format: ['PDF', 'Excel'],
        size: '1.8 MB',
        recipients: 8
      },
      {
        id: 'cost-center-report',
        name: 'Cost Center Performance',
        description: 'Detailed cost analysis by business units and cost centers',
        lastGenerated: '2024-07-03',
        frequency: 'Monthly',
        format: ['PDF'],
        size: '3.2 MB',
        recipients: 15
      }
    ]
  },
  {
    id: 'procurement',
    name: 'Procurement Reports',
    icon: ShoppingCart,
    color: 'blue',
    reports: [
      {
        id: 'vendor-performance',
        name: 'Vendor Performance Report',
        description: 'Comprehensive vendor evaluation including delivery times, quality, and pricing',
        lastGenerated: '2024-07-05',
        frequency: 'Monthly',
        format: ['PDF', 'Excel'],
        size: '4.1 MB',
        recipients: 18
      },
      {
        id: 'purchase-analysis',
        name: 'Purchase Order Analysis',
        description: 'Analysis of purchase orders, approval times, and processing efficiency',
        lastGenerated: '2024-07-04',
        frequency: 'Weekly',
        format: ['PDF', 'Excel'],
        size: '2.9 MB',
        recipients: 10
      },
      {
        id: 'procurement-savings',
        name: 'Procurement Savings Report',
        description: 'Cost savings achieved through strategic procurement initiatives',
        lastGenerated: '2024-07-02',
        frequency: 'Quarterly',
        format: ['PDF'],
        size: '1.5 MB',
        recipients: 6
      }
    ]
  },
  {
    id: 'requisitions',
    name: 'Requisition Reports',
    icon: FileText,
    color: 'purple',
    reports: [
      {
        id: 'requisition-summary',
        name: 'Requisition Summary Report',
        description: 'Overview of all requisitions by status, department, and approval stage',
        lastGenerated: '2024-07-05',
        frequency: 'Daily',
        format: ['PDF', 'Excel'],
        size: '1.2 MB',
        recipients: 25
      },
      {
        id: 'approval-workflow',
        name: 'Approval Workflow Analysis',
        description: 'Analysis of approval times, bottlenecks, and process efficiency',
        lastGenerated: '2024-07-04',
        frequency: 'Weekly',
        format: ['PDF'],
        size: '2.7 MB',
        recipients: 12
      },
      {
        id: 'department-requisitions',
        name: 'Department Requisition Breakdown',
        description: 'Detailed breakdown of requisitions by department with spending patterns',
        lastGenerated: '2024-07-03',
        frequency: 'Monthly',
        format: ['Excel'],
        size: '3.5 MB',
        recipients: 20
      }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance Reports',
    icon: CheckCircle,
    color: 'orange',
    reports: [
      {
        id: 'audit-trail',
        name: 'Audit Trail Report',
        description: 'Comprehensive audit trail of all system activities and changes',
        lastGenerated: '2024-07-05',
        frequency: 'Daily',
        format: ['PDF'],
        size: '5.8 MB',
        recipients: 8
      },
      {
        id: 'policy-compliance',
        name: 'Policy Compliance Report',
        description: 'Assessment of compliance with internal policies and procedures',
        lastGenerated: '2024-07-01',
        frequency: 'Monthly',
        format: ['PDF', 'Excel'],
        size: '2.1 MB',
        recipients: 14
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operational Reports',
    icon: BarChart3,
    color: 'red',
    reports: [
      {
        id: 'travel-expenses',
        name: 'Travel Expense Report',
        description: 'Analysis of travel expenses, patterns, and policy compliance',
        lastGenerated: '2024-07-04',
        frequency: 'Monthly',
        format: ['PDF', 'Excel'],
        size: '1.9 MB',
        recipients: 16
      },
      {
        id: 'invoice-processing',
        name: 'Invoice Processing Report',
        description: 'Invoice processing times, payment status, and aging analysis',
        lastGenerated: '2024-07-05',
        frequency: 'Weekly',
        format: ['PDF'],
        size: '2.3 MB',
        recipients: 11
      }
    ]
  }
];

// Scheduled reports data
const scheduledReports = [
  {
    id: 'SCH-001',
    name: 'Monthly Financial Summary',
    nextRun: '2024-08-01',
    frequency: 'Monthly',
    recipients: ['finance@company.com', 'cfo@company.com'],
    status: 'active',
    lastSuccess: '2024-07-01'
  },
  {
    id: 'SCH-002',
    name: 'Weekly Procurement Report',
    nextRun: '2024-07-08',
    frequency: 'Weekly',
    recipients: ['procurement@company.com'],
    status: 'active',
    lastSuccess: '2024-07-01'
  },
  {
    id: 'SCH-003',
    name: 'Daily Requisition Summary',
    nextRun: '2024-07-06',
    frequency: 'Daily',
    recipients: ['managers@company.com'],
    status: 'paused',
    lastSuccess: '2024-07-04'
  }
];

// Report usage analytics
const reportUsageData = [
  { month: 'Jan', downloads: 145, views: 892 },
  { month: 'Feb', downloads: 162, views: 934 },
  { month: 'Mar', downloads: 178, views: 1056 },
  { month: 'Apr', downloads: 134, views: 876 },
  { month: 'May', downloads: 189, views: 1123 },
  { month: 'Jun', downloads: 203, views: 1245 }
];

const popularReports = [
  { name: 'Monthly Expense Summary', downloads: 89, color: '#3B82F6' },
  { name: 'Vendor Performance', downloads: 67, color: '#10B981' },
  { name: 'Requisition Summary', downloads: 54, color: '#F59E0B' },
  { name: 'Budget Variance', downloads: 43, color: '#EF4444' },
  { name: 'Travel Expenses', downloads: 32, color: '#8B5CF6' }
];

// Report generation modal
const ReportGenerationModal = ({ isOpen, onClose, report }) => {
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('current-month');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [emailReport, setEmailReport] = useState(false);
  const [recipients, setRecipients] = useState('');

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Generate Report</h2>
            <p className="text-gray-600">{report.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {report.format.map(format => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedFormat === format
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="current-quarter">Current Quarter</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="current-year">Current Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeCharts"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="includeCharts" className="ml-2 text-sm text-gray-700">
                Include charts and visualizations
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailReport"
                checked={emailReport}
                onChange={(e) => setEmailReport(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="emailReport" className="ml-2 text-sm text-gray-700">
                Email report when ready
              </label>
            </div>
          </div>

          {/* Email Recipients */}
          {emailReport && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
              <textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Enter email addresses separated by commas"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              <Download size={16} />
              Generate Report
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Report card component
const ReportCard = ({ report, onGenerate, onView, onSchedule }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{report.description}</p>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onView(report)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Preview"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onGenerate(report)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Generate"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-3">
        <div>
          <span className="font-medium">Last Generated:</span>
          <div>{report.lastGenerated}</div>
        </div>
        <div>
          <span className="font-medium">Frequency:</span>
          <div>{report.frequency}</div>
        </div>
        <div>
          <span className="font-medium">Size:</span>
          <div>{report.size}</div>
        </div>
        <div>
          <span className="font-medium">Recipients:</span>
          <div>{report.recipients} users</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {report.format.map(format => (
            <span
              key={format}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium"
            >
              {format}
            </span>
          ))}
        </div>
        <button
          onClick={() => onGenerate(report)}
          className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium"
        >
          <Download size={14} />
          Generate
        </button>
      </div>
    </div>
  );
};

// Category section component
const CategorySection = ({ category, onGenerateReport, onViewReport }) => {
  const IconComponent = category.icon;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <div className={`p-2 rounded-lg ${
          category.color === 'blue' ? 'bg-blue-50' :
          category.color === 'green' ? 'bg-emerald-50' :
          category.color === 'purple' ? 'bg-purple-50' :
          category.color === 'orange' ? 'bg-orange-50' :
          category.color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <IconComponent size={20} className={
            category.color === 'blue' ? 'text-blue-600' :
            category.color === 'green' ? 'text-emerald-600' :
            category.color === 'purple' ? 'text-purple-600' :
            category.color === 'orange' ? 'text-orange-600' :
            category.color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.reports.length} reports available</p>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {category.reports.map(report => (
          <ReportCard
            key={report.id}
            report={report}
            onGenerate={onGenerateReport}
            onView={onViewReport}
          />
        ))}
      </div>
    </div>
  );
};

const ReportsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleGenerateReport = (report) => {
    setSelectedReport(report);
    setShowGenerateModal(true);
  };

  const handleViewReport = (report) => {
    // In real app, would open report preview
    console.log('Viewing report:', report.name);
  };

  const filteredCategories = reportCategories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;
    
    if (searchTerm) {
      return category.reports.some(report => 
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Generate and manage comprehensive reports across all business functions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              <Calendar size={16} />
              Schedule Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              <FileBarChart size={16} />
              Custom Report
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">47</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Available Reports</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">203</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Downloads This Month</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Scheduled Reports</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">89</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Recipients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Usage Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={reportUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="downloads" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={3} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Most Popular Reports</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={popularReports} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={120} />
                <Tooltip />
                <Bar dataKey="downloads" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {reportCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Scheduled Reports</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Manage Schedule</button>
          </div>
          <div className="divide-y divide-gray-100">
            {scheduledReports.map((scheduled, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-gray-900">{scheduled.name}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        scheduled.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {scheduled.status === 'active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {scheduled.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Next run: {scheduled.nextRun}</span>
                      <span>•</span>
                      <span>{scheduled.frequency}</span>
                      <span>•</span>
                      <span>{scheduled.recipients.length} recipients</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    Last success: {scheduled.lastSuccess}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Categories */}
        <div className="space-y-6">
          {filteredCategories.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              onGenerateReport={handleGenerateReport}
              onViewReport={handleViewReport}
            />
          ))}
        </div>

        {/* Report Generation Modal */}
        <ReportGenerationModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          report={selectedReport}
        />
      </main>
    </div>
  );
};

export default ReportsPage;