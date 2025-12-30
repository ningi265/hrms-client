import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  AlertCircle,
  Clock,
  DollarSign,
  User,
  Package,
  Eye,
  Download,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  FileText,
  Users,
  Settings,
  ChevronDown,
  MoreVertical,
  Calendar,
  Tag,
  Shield,
  CheckCircle,
  Loader,
  Printer,
  Upload,
  FileSpreadsheet,
  Building,
  Briefcase,
  FileCheck,
  Mail,
  MessageSquare,
  Lock,
  Unlock,
  BarChart,
  CreditCard,
  FileBarChart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExcelJS from 'exceljs';

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
        <Loader className="animate-spin w-6 h-6 text-blue-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// MetricCard Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-4xl" : "text-2xl";
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-1.5 hover:shadow-sm transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`p-1.5 rounded-xl ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'amber' ? 'bg-amber-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={16} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'amber' ? 'text-amber-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={12} className="text-emerald-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
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

// Approval Card Component with All Roles
const ApprovalCard = ({ 
  approval, 
  userRole, 
  userDepartment,
  onMenuClick, 
  showMenuId, 
  onAction, 
  onView, 
  onDownload,
  onComment,
  onDelegate,
  getStageColor,
  getUrgencyIcon,
  formatDate,
  formatCurrency 
}) => {
  // Check if user has procurement role
 const isProcurementRole = (role) => {
  const procurementRoles = [
    "Procurement Officer",
    "Senior Procurement Officer",
    "Procurement Manager", 
    "Supply Chain Officer"
  ];
  return procurementRoles.includes(role);
};

  // Determine available actions based on user role and approval stage
  const getAvailableActions = () => {
    const actions = {
      approve: false,
      reject: false,
      comment: true,
      delegate: false,
      requestInfo: false,
      adjustBudget: false,
      viewDetails: true,
      approveRfq: false
    };

    const currentStage = approval.currentStage;
    const userInApprovers = approval.approvers?.some(approver => 
      approver.userId === approval.currentUserId || 
      approver.email === approval.currentUserEmail
    );

    // Only allow actions if user is in current approvers list
    if (!userInApprovers) return actions;

    // Check if this is a procurement-related approval
    const isProcurementApproval = currentStage?.includes('procurement') || 
                                 currentStage?.includes('vendor') ||
                                 currentStage?.includes('rfq') ||
                                 currentStage?.includes('po');

    // Check if user is in procurement department
    const isProcurementDept = approval.department?.toLowerCase().includes('procurement') ||
                             approval.department?.toLowerCase().includes('supply chain');

    switch (userRole) {
      // Department Management Roles
      case 'Department Head':
      case 'Manager':
      case 'Senior Manager':
        if (approval.department === userDepartment) {
          actions.approve = currentStage === 'department-approval';
          actions.reject = currentStage === 'department-approval';
          actions.delegate = true;
          actions.requestInfo = true;
        }
        break;

      // Finance Roles
      case 'Finance Officer':
      case 'Senior Finance Officer':
      case 'Finance Manager':
      case 'CFO':
      case 'Accountant':
      case 'Finance Analyst':
        actions.approve = ['finance-approval', 'budget-review', 'payment-approval'].includes(currentStage);
        actions.reject = ['finance-approval', 'budget-review', 'payment-approval'].includes(currentStage);
        actions.adjustBudget = true;
        actions.requestInfo = true;
        break;

      // Procurement Roles
      case 'Procurement Officer':
      case 'Senior Procurement Officer':
      case 'Procurement Manager':
      case 'Supply Chain Officer':
        if (isProcurementApproval || isProcurementDept) {
          actions.approve = true;
          actions.reject = true;
          actions.requestInfo = true;
          actions.delegate = userRole === 'Procurement Manager' || userRole === 'Senior Procurement Officer';
          actions.approveRfq = true; // Special action for procurement officers
        }
        break;

      // IT Roles
      case 'IT Manager':
      case 'IT Officer':
      case 'IT Support':
      case 'Software Engineer':
      case 'Senior Software Engineer':
      case 'Lead Engineer':
      case 'DevOps Engineer':
      case 'IT/Technical':
        if (approval.category === 'IT Equipment' || 
            approval.category === 'Software & Licenses' || 
            approval.requireITReview) {
          actions.approve = currentStage === 'it-review';
          actions.reject = currentStage === 'it-review';
          actions.requestInfo = true;
        }
        break;

      // Legal Roles
      case 'Legal Counsel':
      case 'Legal Officer':
        if (approval.requireLegalReview) {
          actions.approve = currentStage === 'legal-review';
          actions.reject = currentStage === 'legal-review';
        }
        break;

      // Executive Roles
      case 'Enterprise(CEO, CFO, etc.)':
      case 'Executive (CEO, CFO, etc.)':
      case 'CEO':
      case 'COO':
        actions.approve = ['executive-approval', 'final-approval', 'cfo-approval'].includes(currentStage);
        actions.reject = ['executive-approval', 'final-approval', 'cfo-approval'].includes(currentStage);
        actions.delegate = true;
        break;

      // Admin Roles
      case 'admin':
      case 'Administrator':
      case 'System Admin':
        actions.approve = true;
        actions.reject = true;
        actions.delegate = true;
        actions.requestInfo = true;
        actions.adjustBudget = true;
        break;

      // HR Roles
      case 'HR Manager':
      case 'HR Specialist':
      case 'Human Resources':
        if (approval.category === 'HR Related' || approval.department === 'Human Resources') {
          actions.approve = true;
          actions.reject = true;
        }
        break;

      // Sales & Marketing Roles
      case 'Sales Manager':
      case 'Sales Representative':
      case 'Marketing Manager':
      case 'Marketing Specialist':
        if (approval.department === 'Sales' || approval.department === 'Marketing') {
          actions.approve = currentStage === 'department-approval';
          actions.reject = currentStage === 'department-approval';
        }
        break;

      // Default for other roles
      default:
        // Check if user has specific permissions based on their department
        if (approval.department === userDepartment) {
          actions.approve = currentStage === 'department-approval';
          actions.reject = currentStage === 'department-approval';
        }
    }

    return actions;
  };

  const actions = getAvailableActions();
  const canTakeAction = actions.approve || actions.reject || actions.approveRfq;

  // Get role-specific info to display
  const getRoleInfo = () => {
    const procurementRoles = [
      "Procurement Officer",
      "Senior Procurement Officer", 
      "Procurement Manager",
      "Supply Chain Officer"
    ];

    const financeRoles = [
      "Finance Officer",
      "Senior Finance Officer",
      "Finance Manager",
      "CFO",
      "Accountant",
      "Finance Analyst"
    ];

    const itRoles = [
      "IT Manager",
      "IT Officer",
      "IT Support",
      "Software Engineer",
      "Senior Software Engineer",
      "Lead Engineer",
      "DevOps Engineer",
      "IT/Technical"
    ];

    if (procurementRoles.includes(userRole)) {
      return {
        title: userRole,
        description: 'Review vendor selection, procurement compliance, and contract terms',
        icon: <Package className="w-4 h-4" />,
        color: 'orange'
      };
    }

    if (financeRoles.includes(userRole)) {
      return {
        title: userRole,
        description: 'Review budget availability, financial compliance, and payment terms',
        icon: <CreditCard className="w-4 h-4" />,
        color: 'green'
      };
    }

    if (itRoles.includes(userRole)) {
      return {
        title: userRole,
        description: 'Review technical specifications and IT requirements',
        icon: <Settings className="w-4 h-4" />,
        color: 'indigo'
      };
    }

    switch (userRole) {
      case 'Department Head':
      case 'Manager':
      case 'Senior Manager':
        return {
          title: userRole,
          description: `Review requests from ${userDepartment} department`,
          icon: <Building className="w-4 h-4" />,
          color: 'blue'
        };
      case 'Legal Counsel':
      case 'Legal Officer':
        return {
          title: userRole,
          description: 'Review legal compliance and contract terms',
          icon: <FileText className="w-4 h-4" />,
          color: 'red'
        };
      case 'Enterprise(CEO, CFO, etc.)':
      case 'Executive (CEO, CFO, etc.)':
      case 'CEO':
      case 'COO':
        return {
          title: userRole,
          description: 'Executive approval for strategic decisions',
          icon: <Briefcase className="w-4 h-4" />,
          color: 'purple'
        };
      case 'admin':
      case 'Administrator':
        return {
          title: 'System Administrator',
          description: 'Manage and oversee all approval processes',
          icon: <Shield className="w-4 h-4" />,
          color: 'gray'
        };
      default:
        return {
          title: userRole || 'Approver',
          description: 'Your approval is required',
          icon: <FileCheck className="w-4 h-4" />,
          color: 'gray'
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      {/* Header with Role Context */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className={`p-1.5 rounded-xl ${
            roleInfo.color === 'blue' ? 'bg-blue-50' :
            roleInfo.color === 'green' ? 'bg-green-50' :
            roleInfo.color === 'orange' ? 'bg-orange-50' :
            roleInfo.color === 'purple' ? 'bg-purple-50' :
            roleInfo.color === 'red' ? 'bg-red-50' :
            roleInfo.color === 'indigo' ? 'bg-indigo-50' :
            'bg-gray-50'
          }`}>
            {roleInfo.icon}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">
              {approval.itemName || "Purchase Request"}
            </h4>
            <p className="text-xs text-gray-500">{roleInfo.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStageColor(approval.currentStage)}`}>
            {getUrgencyIcon(approval.urgency)}
            <span className="ml-1 capitalize">{approval.currentStage?.replace('-', ' ') || "Pending"}</span>
          </span>
          <button
            data-approval-id={approval._id}
            onClick={() => onMenuClick(approval._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Role-Specific Context */}
      <div className="mb-2 p-1.5 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-600">{roleInfo.description}</p>
        
        {/* Special notifications for procurement roles */}
        {isProcurementRole(userRole) && approval.status === 'approved-rfq' && (
          <div className="flex items-center gap-1 mt-1 text-xs text-orange-600 bg-orange-50 p-1 rounded">
            <AlertCircle size={10} />
            <span>RFQ Approved - Ready for procurement processing</span>
          </div>
        )}

        {/* Department check for department heads */}
        {userRole === 'Department Head' && approval.department !== userDepartment && (
          <p className="text-xs text-red-500 mt-1">⚠️ This request is not from your department</p>
        )}

        {/* Special note for finance roles about budgets */}
        {['Finance Officer', 'Finance Manager', 'CFO', 'Accountant'].includes(userRole) && (
          <p className="text-xs text-green-600 mt-1">💰 Check budget availability and financial compliance</p>
        )}
      </div>

      {/* Approval Details Grid */}
      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            {formatCurrency(approval.amount || 0)}
          </div>
          <div className="text-xs text-gray-500">Amount</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">
            {approval.daysPending || 0}
          </div>
          <div className="text-xs text-gray-500">Days Pending</div>
        </div>
      </div>

      {/* Key Information */}
      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Requestor</span>
          <span className="text-xs font-medium truncate">
            {approval.requestor?.name || approval.requestorEmail || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Department</span>
          <span className="text-xs font-medium">{approval.department || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Category</span>
          <span className="text-xs font-medium">{approval.category || "General"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Current Status</span>
          <span className={`text-xs font-medium ${
            approval.status === 'approved-rfq' ? 'text-orange-600' :
            approval.status === 'approved' ? 'text-green-600' :
            approval.status === 'rejected' ? 'text-red-600' :
            'text-blue-600'
          }`}>
            {approval.status?.replace('-', ' ').toUpperCase() || 'IN REVIEW'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Submitted</span>
          <span className="text-xs font-medium">{formatDate(approval.createdAt)}</span>
        </div>
        {approval.slaDeadline && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">SLA Deadline</span>
            <span className={`text-xs font-medium ${
              approval.isSlaBreached ? 'text-red-500' : 'text-green-500'
            }`}>
              {formatDate(approval.slaDeadline)}
            </span>
          </div>
        )}
      </div>

      {/* Previous Approvals/Comments */}
      {approval.previousApprovals && approval.previousApprovals.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Previous Actions</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {approval.previousApprovals.slice(0, 2).map((action, idx) => (
              <div key={idx} className="text-xs bg-blue-50 p-1 rounded">
                <span className="font-medium">{action.approver}:</span>{' '}
                <span className={action.action === 'approved' ? 'text-green-600' : 'text-gray-600'}>
                  {action.action} on {formatDate(action.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Action Buttons */}
      <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-gray-100">
        {/* Approve Button */}
        {actions.approve && (
          <button
            onClick={() => onAction(approval._id, "approve")}
            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
          >
            <Check size={12} />
            Approve
          </button>
        )}

        {/* Special Approve-RFQ Button for Procurement Officers */}
        {actions.approveRfq && (
          <button
            onClick={() => onAction(approval._id, "approve-rfq")}
            className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors"
          >
            <FileCheck size={12} />
            Approve RFQ
          </button>
        )}
        
        {/* Reject Button */}
        {actions.reject && (
          <button
            onClick={() => onAction(approval._id, "reject")}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
          >
            <X size={12} />
            Reject
          </button>
        )}
        
        {/* Adjust Budget Button */}
        {actions.adjustBudget && (
          <button
            onClick={() => onAction(approval._id, "adjust-budget")}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
          >
            <DollarSign size={12} />
            Adjust Budget
          </button>
        )}
        
        {/* Request Info Button */}
        {actions.requestInfo && (
          <button
            onClick={() => onAction(approval._id, "request-info")}
            className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors"
          >
            <MessageSquare size={12} />
            Request Info
          </button>
        )}
        
        {/* Delegate Button */}
        {actions.delegate && (
          <button
            onClick={() => onDelegate(approval._id)}
            className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
          >
            <Users size={12} />
            Delegate
          </button>
        )}

        <div className="flex-1"></div>
        
        {/* Action Icons */}
        <div className="flex gap-1">
          <button 
            onClick={() => onView(approval._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={() => onComment(approval._id)}
            className="p-1 text-gray-400 hover:text-green-600 rounded-xl"
            title="Add Comment"
          >
            <MessageSquare size={14} />
          </button>
          {onDownload && (
            <button 
              onClick={() => onDownload(approval._id)}
              className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
              title="Download"
            >
              <Download size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ApprovalDashboardPage() {
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showMenuId, setShowMenuId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null);
  const [stats, setStats] = useState({
    totalPending: 0,
    highPriority: 0,
    overdue: 0,
    avgResponseTime: 0
  });
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const backendUrl = import.meta.env.VITE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

  // Fetch user profile and approvals
 useEffect(() => {
  const fetchUserAndApprovals = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      // Get user profile first
      const userResponse = await fetch(`${backendUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserRole(userData.data?.role || 'Employee');
        setUserDepartment(userData.data?.department || null);
        
        // Fetch approvals - backend already filters by user role
        const approvalsResponse = await fetch(`${backendUrl}/api/requisitions/pending-by-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (approvalsResponse.ok) {
          const approvalsData = await approvalsResponse.json();
          
          if (approvalsData.success && Array.isArray(approvalsData.data)) {
            // DIRECTLY USE THE DATA FROM BACKEND - NO ADDITIONAL FILTERING
            setApprovals(approvalsData.data);
            
            // Calculate statistics
            calculateStats(approvalsData.data);
          } else {
            setApprovals([]);
          }
        } else {
          throw new Error('Failed to fetch approvals');
        }
      } else {
        throw new Error('Failed to fetch user profile');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
      setApprovals([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserAndApprovals();
}, [backendUrl]);

  // Calculate statistics
  const calculateStats = (approvalList) => {
    const total = approvalList.length;
    const highPriority = approvalList.filter(a => a.urgency === 'high' || a.priority === 'high').length;
    const overdue = approvalList.filter(a => 
      a.slaDeadline && new Date(a.slaDeadline) < new Date()
    ).length;
    
    // Calculate average response time from previous approvals
    const responseTimes = approvalList
      .filter(a => a.previousApprovals && a.previousApprovals.length > 0)
      .map(a => {
        const firstApproval = a.previousApprovals[0];
        const submitted = new Date(a.createdAt);
        const approved = new Date(firstApproval.date);
        return Math.round((approved - submitted) / (1000 * 60 * 60 * 24)); // Days
      });
    
    const avgResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    setStats({
      totalPending: total,
      highPriority,
      overdue,
      avgResponseTime
    });
  };

  // Filter approvals based on search and filters
  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch = 
      (approval.itemName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (approval.requestor?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (approval.department?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === "all" || approval.currentStage === stageFilter;
    const matchesUrgency = urgencyFilter === "all" || approval.urgency === urgencyFilter;
    
    return matchesSearch && matchesStage && matchesUrgency;
  });

  // Get available stages for filter dropdown based on user role
  const getAvailableStages = () => {
    const stages = new Set(['all']);
    approvals.forEach(approval => {
      if (approval.currentStage) stages.add(approval.currentStage);
    });
    
    return Array.from(stages).map(stage => ({
      value: stage,
      label: stage === 'all' ? 'All Stages' : stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  };

  // Helper function for role context
  const getRoleContext = (role, department) => {
    if (['Procurement Officer', 'Senior Procurement Officer', 'Procurement Manager', 'Supply Chain Officer'].includes(role)) {
      return 'Procurement Review';
    }
    if (['Finance Officer', 'Finance Manager', 'CFO', 'Accountant', 'Finance Analyst'].includes(role)) {
      return 'Financial Review';
    }
    if (['IT Manager', 'IT Officer', 'Software Engineer', 'DevOps Engineer'].includes(role)) {
      return 'Technical Review';
    }
    if (role === 'Department Head' && department) {
      return `Department Head (${department})`;
    }
    return role;
  };

  // Handle approval actions
  const handleAction = async (approvalId, action) => {
    try {
      const token = localStorage.getItem("token");
      let endpoint = 'approve-step';
      
      // Map actions to endpoints
      if (action === 'approve-rfq') {
        endpoint = 'approve-step';
        action = 'approve'; // Backend will handle RFQ approval based on role
      } else if (action === 'adjust-budget') {
        endpoint = 'adjust-budget';
      }

      const response = await fetch(`${backendUrl}/api/requisitions/${approvalId}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action === 'approve-rfq' ? 'approve' : action,
          comment: `${action === 'approve-rfq' ? 'RFQ Approved' : action} by ${userRole}`,
          role: userRole,
          department: userDepartment,
          isRfqApproval: action === 'approve-rfq'
        })
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the approval from the list
        setApprovals(prev => prev.filter(a => a._id !== approvalId));
        
        // Update stats
        calculateStats(approvals.filter(a => a._id !== approvalId));
        
        showNotificationMessage(
          action === 'approve-rfq' 
            ? 'RFQ approved for procurement processing!' 
            : `Request ${action}d successfully!`, 
          "success"
        );
      } else {
        showNotificationMessage(data.message || "Failed to process request", "error");
      }
    } catch (err) {
      showNotificationMessage("Failed to process request", "error");
      console.error(err);
    }
    setShowMenuId(null);
  };

  // Handle delegate action
  const handleDelegate = async (approvalId) => {
    // In a real app, this would open a modal to select delegate
    showNotificationMessage("Delegate functionality coming soon", "info");
    setShowMenuId(null);
  };

  // Handle add comment
  const handleComment = async (approvalId) => {
    // In a real app, this would open a comment modal
    showNotificationMessage("Comment functionality coming soon", "info");
    setShowMenuId(null);
  };

  // Handle view details
  const handleViewDetails = (approvalId) => {
    navigate(`/approvals/${approvalId}`);
    setShowMenuId(null);
  };

  // Handle download
  const handleDownload = async (approvalId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/approvals/${approvalId}/document`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `approval-${approvalId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotificationMessage("Document downloaded successfully!", "success");
      } else {
        showNotificationMessage("Failed to download document", "error");
      }
    } catch (err) {
      showNotificationMessage("Failed to download document", "error");
      console.error(err);
    }
    setShowMenuId(null);
  };

  // Export to Excel
 const handleExportToExcel = async () => {
  if (!approvals || approvals.length === 0) {
    showNotificationMessage("No approvals to export", "error");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Approvals');

    // Define headers
    worksheet.columns = [
      { header: 'Item Name', key: 'itemName', width: 25 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Requestor', key: 'requestor', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Current Stage', key: 'currentStage', width: 20 },
      { header: 'Urgency', key: 'urgency', width: 12 },
      { header: 'Current Status', key: 'status', width: 15 },
      { header: 'Days Pending', key: 'daysPending', width: 12 },
      { header: 'SLA Deadline', key: 'slaDeadline', width: 15 },
      { header: 'Submitted Date', key: 'submittedDate', width: 15 },
      { header: 'Your Role', key: 'yourRole', width: 20 },
      { header: 'Approval Context', key: 'approvalContext', width: 25 }
    ];

    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' } // Blue color
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data rows
    approvals.forEach((approval) => {
      worksheet.addRow({
        itemName: approval.itemName || "N/A",
        amount: approval.amount || 0,
        requestor: approval.requestor?.name || approval.requestorEmail || "N/A",
        department: approval.department || "N/A",
        category: approval.category || "General",
        currentStage: approval.currentStage || "N/A",
        urgency: approval.urgency || "medium",
        status: approval.status || "in-review",
        daysPending: approval.daysPending || 0,
        slaDeadline: approval.slaDeadline ? formatDate(approval.slaDeadline) : "N/A",
        submittedDate: formatDate(approval.createdAt),
        yourRole: userRole,
        approvalContext: getRoleContext(userRole, approval.department)
      });
    });

    // Format currency column
    const amountColumn = worksheet.getColumn('amount');
    amountColumn.numFmt = '"$"#,##0';

    // Format date columns
    const dateColumns = ['slaDeadline', 'submittedDate'];
    dateColumns.forEach(colName => {
      const col = worksheet.getColumn(colName);
      col.numFmt = 'yyyy-mm-dd';
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    });

    // Add a summary row
    const lastRow = worksheet.rowCount;
    worksheet.addRow([]); // Empty row
    
    const summaryRow = worksheet.addRow({
      itemName: 'SUMMARY',
      amount: approvals.reduce((sum, a) => sum + (a.amount || 0), 0),
      requestor: `Total: ${approvals.length}`,
      department: '',
      category: '',
      currentStage: '',
      urgency: '',
      status: '',
      daysPending: Math.round(approvals.reduce((sum, a) => sum + (a.daysPending || 0), 0) / approvals.length),
      slaDeadline: '',
      submittedDate: '',
      yourRole: userRole,
      approvalContext: `${stats.highPriority} High Priority`
    });

    // Style summary row
    summaryRow.font = { bold: true };
    summaryRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' } // Gray background
    };

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-approvals-${userRole}-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showNotificationMessage("Export successful!", "success");
  } catch (error) {
    console.error('Export error:', error);
    showNotificationMessage("Export failed!", "error");
  }
};

  // Print functionality
  const handlePrint = () => {
    const printContents = document.getElementById("approvals-section")?.innerHTML;
    if (!printContents) {
      showNotificationMessage("Nothing to print", "error");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
      <html>
        <head>
          <title>Approval Dashboard - ${userRole}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            .print-header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin-bottom: 20px; 
              padding-bottom: 10px;
              border-bottom: 1px solid #ddd;
            }
            .user-info {
              background: #f4f4f4;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .print-metrics {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .metric-box {
              border: 1px solid #ddd;
              padding: 15px;
              text-align: center;
              border-radius: 8px;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              margin: 5px 0;
            }
            .metric-title {
              font-size: 14px;
              color: #666;
              text-transform: uppercase;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
              font-size: 14px; 
            }
            th { background-color: #f4f4f4; }
            .stage-badge {
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Approval Dashboard - ${userRole}</h1>
            <div>Generated: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="user-info">
            <strong>User Role:</strong> ${userRole}<br>
            ${userDepartment ? `<strong>Department:</strong> ${userDepartment}<br>` : ''}
            <strong>Total Items:</strong> ${filteredApprovals.length}
          </div>
          
          <div class="print-metrics">
            <div class="metric-box">
              <div class="metric-value">${stats.totalPending}</div>
              <div class="metric-title">Total Pending</div>
            </div>
            <div class="metric-box">
              <div class="metric-value">${stats.highPriority}</div>
              <div class="metric-title">High Priority</div>
            </div>
            <div class="metric-box">
              <div class="metric-value">${stats.overdue}</div>
              <div class="metric-title">Overdue</div>
            </div>
            <div class="metric-box">
              <div class="metric-value">${stats.avgResponseTime}</div>
              <div class="metric-title">Avg Days</div>
            </div>
          </div>
          
          <h2>Pending Approvals (${filteredApprovals.length} items)</h2>
          
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Amount</th>
                <th>Requestor</th>
                <th>Department</th>
                <th>Stage</th>
                <th>Urgency</th>
                <th>Days Pending</th>
                <th>SLA Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${filteredApprovals.map(approval => `
                <tr>
                  <td>${approval.itemName || "N/A"}</td>
                  <td>${formatCurrency(approval.amount || 0)}</td>
                  <td>${approval.requestor?.name || approval.requestorEmail || "N/A"}</td>
                  <td>${approval.department || "N/A"}</td>
                  <td>
                    <span class="stage-badge" style="background-color: ${getStageColor(approval.currentStage, true)}; color: white;">
                      ${approval.currentStage?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || "N/A"}
                    </span>
                  </td>
                  <td>${approval.urgency || "medium"}</td>
                  <td>${approval.daysPending || 0}</td>
                  <td>${approval.slaDeadline ? formatDate(approval.slaDeadline) : "N/A"}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Helper functions
  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

const getStageColor = (stage, forPrint = false) => {
  if (forPrint) {
    switch (stage) {
      case 'department-approval': return '#3b82f6';
      case 'finance-approval': return '#10b981';
      case 'cfo-approval': return '#8b5cf6';
      case 'procurement-review': return '#f59e0b';
      case 'vendor-selection': return '#f97316';
      case 'rfq-processing': return '#ea580c';
      case 'po-creation': return '#dc2626';
      case 'it-review': return '#6366f1';
      case 'legal-review': return '#ef4444';
      default: return '#6b7280';
    }
  }
  
  switch (stage) {
    case 'department-approval':
      return "text-blue-700 bg-blue-50 border-blue-200";
    case 'finance-approval':
      return "text-green-700 bg-green-50 border-green-200";
    case 'cfo-approval':
      return "text-purple-700 bg-purple-50 border-purple-200";
    case 'procurement-review':
    case 'vendor-selection':
    case 'rfq-processing':
    case 'po-creation':
      return "text-orange-700 bg-orange-50 border-orange-200";
    case 'it-review':
      return "text-indigo-700 bg-indigo-50 border-indigo-200";
    case 'legal-review':
      return "text-red-700 bg-red-50 border-red-200";
    default:
      return "text-gray-700 bg-gray-50 border-gray-200";
  }
};

  const getUrgencyIcon = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return <AlertCircle size={12} />;
      case "medium":
        return <Clock size={12} />;
      case "low":
        return <CheckCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading approvals..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header with User Role Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Approval Dashboard</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <Shield size={12} />
                  {userRole}
                </div>
               
                <div className="text-sm text-gray-500">
                  {filteredApprovals.length} pending approvals
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
              >
                <FileSpreadsheet size={16} />
                Export
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-2xl text-sm font-medium hover:bg-gray-50 transition"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
            
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search approvals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
              />
            </div>
            
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
            >
              <option value="all">All Stages</option>
              {getAvailableStages()
                .filter(stage => stage.value !== 'all')
                .map(stage => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
            </select>
            
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
            >
              <option value="all">All Urgency</option>
              <option value="high">High Urgency</option>
              <option value="medium">Medium Urgency</option>
              <option value="low">Low Urgency</option>
            </select>
            
            <div className="flex-1"></div>
            
            <div className="text-xs text-gray-500">
              Showing {filteredApprovals.length} of {approvals.length} approvals
            </div>
          </div>
          
          {/* Role-Specific Guidance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Your Approval Responsibilities</h3>
                <p className="text-sm text-gray-600">
                  {userRole === 'Department Head' 
                    ? `You can approve requests from the ${userDepartment} department. Review for departmental needs and budget alignment.`
                    : ['Procurement Officer', 'Senior Procurement Officer', 'Procurement Manager', 'Supply Chain Officer'].includes(userRole)
                    ? 'You review vendor selection, procurement compliance, contract terms, and can approve RFQs for processing.'
                    : ['Finance Officer', 'Finance Manager', 'CFO', 'Accountant', 'Finance Analyst'].includes(userRole)
                    ? 'You review financial compliance, budget availability, and payment terms. Ensure proper documentation.'
                    : userRole === 'CFO'
                    ? 'You provide final approval for high-value purchases and strategic investments.'
                    : ['IT Manager', 'IT Officer', 'Software Engineer', 'DevOps Engineer'].includes(userRole)
                    ? 'You review technical specifications and IT requirements for IT-related purchases.'
                    : ['Legal Counsel', 'Legal Officer'].includes(userRole)
                    ? 'You review legal compliance and contract terms for purchases requiring legal review.'
                    : ['Enterprise(CEO, CFO, etc.)', 'Executive (CEO, CFO, etc.)', 'CEO', 'COO'].includes(userRole)
                    ? 'You provide executive approval for strategic decisions and high-value investments.'
                    : 'Review requests assigned to you and take appropriate action.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Procurement Status Section */}
        {['Procurement Officer', 'Senior Procurement Officer', 'Procurement Manager', 'Supply Chain Officer'].includes(userRole) && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">Procurement Approval Status</h3>
                <p className="text-sm text-orange-700">
                  When you approve a requisition, it will be marked as <span className="font-bold">"approved-rfq"</span> status.
                  This indicates the requisition is ready for RFQ (Request for Quotation) processing.
                  The final approval status will be <span className="font-bold">"approved"</span> after all workflow steps are complete.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Approvals Cards Section */}
        <div id="approvals-section" className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
            </div>
            <div className="text-sm text-gray-500">
              {filteredApprovals.length} items requiring your action
            </div>
          </div>

          {filteredApprovals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || stageFilter !== "all" || urgencyFilter !== "all" 
                  ? "No approvals match your filters" 
                  : "No Pending Approvals"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || stageFilter !== "all" || urgencyFilter !== "all" 
                  ? "Try adjusting your search criteria or filters."
                  : "All approvals have been processed. New requests will appear here as they reach your approval stage."}
              </p>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 mx-auto"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredApprovals.map((approval) => (
                <ApprovalCard
                  key={approval._id}
                  approval={approval}
                  userRole={userRole}
                  userDepartment={userDepartment}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onAction={handleAction}
                  onView={handleViewDetails}
                  onDownload={handleDownload}
                  onComment={handleComment}
                  onDelegate={handleDelegate}
                  getStageColor={getStageColor}
                  getUrgencyIcon={getUrgencyIcon}
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-transparent"
            onClick={() => setShowMenuId(null)}
          ></div>
          
          <div 
            className="fixed z-[101] w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-approval-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 280;
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const spaceAbove = rect.top;
                  
                  if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
                    return `${rect.top - menuHeight + window.scrollY}px`;
                  } else {
                    return `${rect.bottom + 8 + window.scrollY}px`;
                  }
                }
                return '50px';
              })(),
              left: (() => {
                const button = document.querySelector(`[data-approval-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuWidth = 256;
                  const spaceRight = window.innerWidth - rect.right;
                  
                  if (spaceRight < menuWidth) {
                    return `${rect.left - menuWidth + 8}px`;
                  } else {
                    return `${rect.right - menuWidth}px`;
                  }
                }
                return '50px';
              })()
            }}
          >
            <div className="py-2">
              <button
                onClick={() => handleViewDetails(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Eye size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">View Details</div>
                  <div className="text-xs text-gray-500">See full approval request</div>
                </div>
              </button>
              
              <button
                onClick={() => handleDownload(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-left"
              >
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Download size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Download Document</div>
                  <div className="text-xs text-gray-500">Export as PDF</div>
                </div>
              </button>
              
              <button
                onClick={() => handleComment(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors text-left"
              >
                <div className="p-2 bg-green-50 rounded-lg">
                  <MessageSquare size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Add Comment</div>
                  <div className="text-xs text-gray-500">Provide feedback</div>
                </div>
              </button>
              
              <div className="border-t border-gray-100 my-2 mx-4"></div>
              
              <button
                onClick={() => handleAction(showMenuId, "approve")}
                className="w-full flex items-center space-x-3 px-4 py-3 text-green-700 hover:bg-green-50 transition-colors text-left"
              >
                <div className="p-2 bg-green-50 rounded-lg">
                  <Check size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Approve Request</div>
                  <div className="text-xs text-green-600">Accept and forward</div>
                </div>
              </button>
              
              <button
                onClick={() => handleAction(showMenuId, "reject")}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-700 hover:bg-red-50 transition-colors text-left"
              >
                <div className="p-2 bg-red-50 rounded-lg">
                  <X size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Reject Request</div>
                  <div className="text-xs text-red-600">Decline with reason</div>
                </div>
              </button>
              
              <button
                onClick={() => handleAction(showMenuId, "request-info")}
                className="w-full flex items-center space-x-3 px-4 py-3 text-amber-700 hover:bg-amber-50 transition-colors text-left"
              >
                <div className="p-2 bg-amber-50 rounded-lg">
                  <MessageSquare size={16} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Request More Info</div>
                  <div className="text-xs text-amber-600">Need clarification</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-2xl border ${
              notificationType === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : notificationType === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                {notificationType === 'success' ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : notificationType === 'error' ? (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <span className="font-medium">{notificationMessage}</span>
                <button
                  onClick={() => setShowNotification(false)}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}