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
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  DollarSign,
  Calendar,
  FileText,
  Building2,
  Eye,
  MessageSquare,
  Filter,
  Search,
  Download,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Target,
  TrendingUp,
  Activity,
  Users,
  Timer,
  Award,
  Settings,
  Bell
} from 'lucide-react';

// Sample pending approvals data
const pendingApprovals = [
  {
    id: 'REQ-2024-088',
    description: 'Marketing Campaign Software',
    department: 'Marketing',
    budgetCode: 'MKT-Q1-2024',
    requestedBy: 'Mike Wilson',
    requestDate: '2024-06-16',
    amount: 12000,
    priority: 'high',
    category: 'Software License',
    vendor: 'MarketPro Solutions',
    justification: 'Required for Q2 marketing campaigns to increase lead generation by 40%',
    approvalLevel: 'CFO',
    daysWaiting: 2,
    budgetRemaining: 33500,
    attachments: ['quote.pdf', 'specifications.docx'],
    previousApprovers: ['Dept Head'],
    estimatedROI: '200%',
    urgency: 'high'
  },
  {
    id: 'REQ-2024-091',
    description: 'Cloud Infrastructure Upgrade',
    department: 'IT',
    budgetCode: 'IT-Q1-2024',
    requestedBy: 'John Smith',
    requestDate: '2024-06-15',
    amount: 8500,
    priority: 'high',
    category: 'Infrastructure',
    vendor: 'CloudTech Solutions',
    justification: 'Current infrastructure is at 90% capacity, upgrade needed to prevent downtime',
    approvalLevel: 'CFO',
    daysWaiting: 3,
    budgetRemaining: 45000,
    attachments: ['technical_specs.pdf'],
    previousApprovers: ['Dept Head', 'Finance'],
    estimatedROI: '150%',
    urgency: 'urgent'
  },
  {
    id: 'REQ-2024-089',
    description: 'Employee Training Program',
    department: 'HR',
    budgetCode: 'HR-Q1-2024',
    requestedBy: 'Sarah Johnson',
    requestDate: '2024-06-14',
    amount: 4200,
    priority: 'medium',
    category: 'Training',
    vendor: 'SkillDev Institute',
    justification: 'Upskill 15 employees in digital marketing and data analysis',
    approvalLevel: 'Dept Head',
    daysWaiting: 4,
    budgetRemaining: 18000,
    attachments: ['curriculum.pdf', 'cost_breakdown.xlsx'],
    previousApprovers: [],
    estimatedROI: '120%',
    urgency: 'medium'
  },
  {
    id: 'REQ-2024-092',
    description: 'Office Equipment Replacement',
    department: 'Operations',
    budgetCode: 'OPS-Q1-2024',
    requestedBy: 'David Chen',
    requestDate: '2024-06-13',
    amount: 6800,
    priority: 'medium',
    category: 'Equipment',
    vendor: 'OfficePro Ltd',
    justification: 'Replace 8 outdated computers affecting productivity',
    approvalLevel: 'Finance',
    daysWaiting: 5,
    budgetRemaining: 28000,
    attachments: ['quote.pdf'],
    previousApprovers: ['Dept Head'],
    estimatedROI: '110%',
    urgency: 'medium'
  }
];

// Recent decisions data
const recentDecisions = [
  {
    id: 'REQ-2024-087',
    description: 'Dell Laptops (5 units)',
    amount: 6000,
    decision: 'approved',
    decisionDate: '2024-06-17',
    approver: 'CFO',
    department: 'IT',
    processingTime: '1 day'
  },
  {
    id: 'REQ-2024-086',
    description: 'Conference Room Renovation',
    amount: 15000,
    decision: 'rejected',
    decisionDate: '2024-06-16',
    approver: 'CFO',
    department: 'Operations',
    processingTime: '3 days',
    rejectionReason: 'Budget allocated for more critical items'
  },
  {
    id: 'REQ-2024-085',
    description: 'Adobe Creative Suite Licenses',
    amount: 4500,
    decision: 'approved',
    decisionDate: '2024-06-15',
    approver: 'Dept Head',
    department: 'Marketing',
    processingTime: '1 day'
  }
];

// Approval workflow stats
const workflowStats = {
  totalPending: 8,
  avgProcessingTime: 2.3,
  approvalRate: 87,
  urgentItems: 3,
  totalValue: 31500,
  thisWeekApproved: 12,
  thisWeekRejected: 2
};

// Processing time by approval level
const processingTimeData = [
  { level: 'Dept Head', avgTime: 1.2, pending: 4 },
  { level: 'Finance', avgTime: 1.8, pending: 2 },
  { level: 'CFO', avgTime: 3.1, pending: 2 }
];

// Approval decision trends
const decisionTrendData = [
  { week: 'Week 1', approved: 8, rejected: 1, pending: 3 },
  { week: 'Week 2', approved: 12, rejected: 2, pending: 4 },
  { week: 'Week 3', approved: 15, rejected: 1, pending: 2 },
  { week: 'Week 4', approved: 10, rejected: 3, pending: 5 }
];

// Approval Details Modal Component
const ApprovalDetailsModal = ({ isOpen, onClose, requisition, onApprove, onReject }) => {
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleDecision = (type) => {
    if (type === 'approve') {
      onApprove(requisition.id, comments);
    } else {
      onReject(requisition.id, comments);
    }
    setComments('');
    setDecision('');
    onClose();
  };

  if (!isOpen || !requisition) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Requisition Details</h2>
            <p className="text-gray-600">{requisition.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Request Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium">{requisition.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">MWK {requisition.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{requisition.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor:</span>
                  <span className="font-medium">{requisition.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${
                    requisition.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    requisition.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {requisition.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Budget Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-600">Budget Code:</span>
                  <span className="font-medium">{requisition.budgetCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Department:</span>
                  <span className="font-medium">{requisition.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Remaining Budget:</span>
                  <span className="font-medium text-green-600">MWK {requisition.budgetRemaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">After Approval:</span>
                  <span className="font-medium">MWK {(requisition.budgetRemaining - requisition.amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Request Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Requested By:</span>
                  <span className="font-medium">{requisition.requestedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Date:</span>
                  <span className="font-medium">{requisition.requestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Waiting:</span>
                  <span className="font-medium">{requisition.daysWaiting} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated ROI:</span>
                  <span className="font-medium text-green-600">{requisition.estimatedROI}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Approval Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-600">Current Level:</span>
                  <span className="font-medium">{requisition.approvalLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Previous Approvers:</span>
                  <span className="font-medium">{requisition.previousApprovers.join(', ') || 'None'}</span>
                </div>
                {requisition.attachments.length > 0 && (
                  <div>
                    <span className="text-green-600">Attachments:</span>
                    <div className="mt-1">
                      {requisition.attachments.map((attachment, index) => (
                        <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                          {attachment}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Justification */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-2">Business Justification</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">{requisition.justification}</p>
          </div>
        </div>

        {/* Decision Section */}
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <MessageSquare size={16} />
              Add Comments
              <ChevronDown size={16} className={showComments ? 'rotate-180' : ''} />
            </button>
          </div>

          {showComments && (
            <div className="mb-4">
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your comments here..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleDecision('approve')}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              <CheckCircle size={16} />
              Approve
            </button>
            <button
              onClick={() => handleDecision('reject')}
              className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              <XCircle size={16} />
              Reject
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

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const getConfig = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getConfig(priority)}`}>
      {priority}
    </span>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
            <TrendingUp size={14} className={trend > 0 ? 'text-emerald-500' : 'text-red-500'} />
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

const ApprovalWorkflow = () => {
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requisitions, setRequisitions] = useState(pendingApprovals);

  const handleApprove = (reqId, comments) => {
    setRequisitions(prev => prev.filter(req => req.id !== reqId));
    // In real app, would make API call here
    console.log(`Approved ${reqId} with comments: ${comments}`);
  };

  const handleReject = (reqId, comments) => {
    setRequisitions(prev => prev.filter(req => req.id !== reqId));
    // In real app, would make API call here
    console.log(`Rejected ${reqId} with comments: ${comments}`);
  };

  const openDetails = (requisition) => {
    setSelectedRequisition(requisition);
    setShowModal(true);
  };

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  const urgentCount = requisitions.filter(req => req.urgency === 'urgent').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Approval Workflow</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{workflowStats.totalPending} pending approvals</span>
              </div>
              {urgentCount > 0 && (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 font-medium">{urgentCount} urgent items</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4 text-blue-500" />
                <span>Avg processing: {workflowStats.avgProcessingTime} days</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              <Download size={16} />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Pending Approvals" 
            value={workflowStats.totalPending}
            icon={Clock} 
            color="orange" 
            subtitle="Awaiting decision"
          />
          <MetricCard 
            title="Total Value" 
            value={workflowStats.totalValue}
            prefix="MWK "
            icon={DollarSign} 
            color="blue" 
            subtitle="Pending amount"
          />
          <MetricCard 
            title="Approval Rate" 
            value={workflowStats.approvalRate}
            suffix="%"
            icon={CheckCircle} 
            color="green" 
            trend={5}
            subtitle="This quarter"
          />
          <MetricCard 
            title="Avg Processing Time" 
            value={workflowStats.avgProcessingTime}
            suffix=" days"
            icon={Timer} 
            color="purple" 
            trend={-12}
            subtitle="Getting faster"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Processing Time by Level */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Processing Time by Approval Level</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={processingTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="level" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Decision Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Decision Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={decisionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
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
                  placeholder="Search requisitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
            <span className="text-sm text-gray-500">{filteredRequisitions.length} items</span>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredRequisitions.map((req, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-blue-600">{req.id}</span>
                      <PriorityBadge priority={req.priority} />
                      {req.urgency === 'urgent' && (
                        <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                          <AlertTriangle size={12} />
                          URGENT
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{req.description}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{req.department}</span>
                      <span>•</span>
                      <span>{req.requestedBy}</span>
                      <span>•</span>
                      <span>{req.daysWaiting} days waiting</span>
                      <span>•</span>
                      <span>MWK {req.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openDetails(req)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                    >
                      <Eye size={14} />
                      Review
                    </button>
                    <button
                      onClick={() => handleApprove(req.id, '')}
                      className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id, '')}
                      className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Decisions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentDecisions.map((decision, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-gray-900">{decision.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        decision.decision === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {decision.decision === 'approved' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {decision.decision}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 mb-1">{decision.description}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{decision.department}</span>
                      <span>•</span>
                      <span>MWK {decision.amount.toLocaleString()}</span>
                      <span>•</span>
                      <span>Processed in {decision.processingTime}</span>
                      <span>•</span>
                      <span>By {decision.approver}</span>
                    </div>
                    {decision.rejectionReason && (
                      <div className="text-xs text-red-600 mt-1">
                        Reason: {decision.rejectionReason}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {decision.decisionDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Details Modal */}
        <ApprovalDetailsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          requisition={selectedRequisition}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </main>
    </div>
  );
};

export default ApprovalWorkflow;