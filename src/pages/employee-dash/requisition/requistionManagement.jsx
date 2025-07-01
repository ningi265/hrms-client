import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Package,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Eye,
  Info,
  Download,
  Edit,
  RefreshCw,
  Star,
  TrendingUp,
  TrendingDown,
  Award,
  Activity,
  Bell,
  Settings,
  UserCheck,
  XCircle,
  AlertTriangle,
  Loader,
  Users,
  Plus,
  AlertCircle,
  DollarSign,
  Building,
  Truck,
  Search,
  Filter,
  MoreVertical,
  Copy,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  CreditCard,
  Zap,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Loading Requisitions..." }) => {
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

// MetricCard Component (styled like reconciliation.jsx)
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
          color === 'amber' ? 'bg-amber-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={20} className={
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

export default function EmployeeRequisitionManagement() {
  const navigate = useNavigate();
  const [requisitionData, setRequisitionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'requisition-dash';
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch requisition data from API
  useEffect(() => {
    const fetchRequisitionData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/requisitions/my`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();
        
        // Transform API data to component format
        const transformedData = apiData.map(transformRequisitionData);
        setRequisitionData(transformedData);
        
      } catch (err) {
        console.error('Error fetching requisition data:', err);
        setError("Failed to load requisition data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequisitionData();
  }, [backendUrl]);

  // Helper function to transform API data to component format
  const transformRequisitionData = (apiData) => {
    const submissionDate = new Date(apiData.createdAt);
    const currentDate = new Date();
    const daysInProcess = Math.floor((currentDate - submissionDate) / (1000 * 60 * 60 * 24));

    // Generate timeline based on current status
    const generateTimeline = (status, createdAt, updatedAt) => {
      const timeline = [];
      const submissionDateObj = new Date(createdAt);
      
      // Submitted step
      timeline.push({
        status: "submitted",
        date: submissionDateObj.toLocaleDateString(),
        time: submissionDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: "Requisition submitted successfully",
        completed: true
      });

      // Review step
      const reviewDate = new Date(submissionDateObj);
      reviewDate.setHours(reviewDate.getHours() + 2);
      
      timeline.push({
        status: "under_review",
        date: reviewDate.toLocaleDateString(),
        time: reviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: "Under review by department manager",
        completed: ['approved', 'rejected', 'under_review'].includes(status),
        current: status === 'pending'
      });

      // Procurement step
      if (['approved', 'procurement', 'shipped', 'delivered'].includes(status)) {
        const procurementDate = new Date(submissionDateObj);
        procurementDate.setDate(procurementDate.getDate() + 1);
        
        timeline.push({
          status: "procurement",
          date: procurementDate.toLocaleDateString(),
          time: procurementDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: "Approved - Procurement team sourcing items",
          completed: ['procurement', 'shipped', 'delivered'].includes(status),
          current: status === 'approved'
        });
      }

      // Shipping step
      if (['shipped', 'delivered'].includes(status)) {
        const shipDate = new Date(submissionDateObj);
        shipDate.setDate(shipDate.getDate() + 3);
        
        timeline.push({
          status: "shipped",
          date: shipDate.toLocaleDateString(),
          time: shipDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: "Items shipped and in transit",
          completed: status === 'delivered',
          current: status === 'shipped'
        });
      }

      // Delivery step
      if (status === 'delivered') {
        const deliveryDate = new Date(submissionDateObj);
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        
        timeline.push({
          status: "delivered",
          date: deliveryDate.toLocaleDateString(),
          time: deliveryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: "Items delivered successfully",
          completed: true
        });
      }

      // Rejection step (if applicable)
      if (status === 'rejected') {
        const rejectionDate = new Date(updatedAt || createdAt);
        timeline.push({
          status: "rejected",
          date: rejectionDate.toLocaleDateString(),
          time: rejectionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: "Requisition was rejected - please review feedback",
          completed: true,
          isRejection: true
        });
      }

      return timeline;
    };

    return {
      id: apiData._id,
      itemName: apiData.itemName,
      quantity: apiData.quantity,
      status: apiData.status,
      budgetCode: apiData.budgetCode,
      urgency: apiData.urgency,
      preferredSupplier: apiData.preferredSupplier,
      reason: apiData.reason,
      category: apiData.category,
      estimatedCost: apiData.estimatedCost,
      deliveryDate: apiData.deliveryDate ? new Date(apiData.deliveryDate).toLocaleDateString() : null,
      department: apiData.department,
      environmentalImpact: apiData.environmentalImpact,
      submissionDate: submissionDate.toLocaleDateString(),
      submissionTime: submissionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      daysInProcess: daysInProcess,
      employee: apiData.employee,
      timeline: generateTimeline(apiData.status, apiData.createdAt, apiData.updatedAt),
      trackingId: `REQ-${new Date(apiData.createdAt).getFullYear()}-${apiData._id.slice(-6).toUpperCase()}`
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'under_review': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'procurement': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'shipped': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={20} />;
      case 'approved': return <CheckCircle size={20} />;
      case 'rejected': return <XCircle size={20} />;
      case 'under_review': return <Loader size={20} className="animate-spin" />;
      case 'procurement': return <Package size={20} />;
      case 'shipped': return <Truck size={20} />;
      case 'delivered': return <CheckCircle size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'under_review': return 'Under Review';
      case 'procurement': return 'In Procurement';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const showNotificationMessage = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleSectionChange = (section) => {
    navigate(`?section=${section}`, { replace: true });
  };

  const handleCreateNewRequisition = () => {
    handleSectionChange("requisitions");
  };

  const handleViewRequisition = (requisition) => {
    setSelectedRequisition(requisition);
  };

  const handleCopyTrackingId = (trackingId) => {
    navigator.clipboard.writeText(trackingId);
    showNotificationMessage(`Tracking ID ${trackingId} copied to clipboard!`, "success");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  // Calculate metrics
  const metrics = {
    total: requisitionData.length,
    pending: requisitionData.filter(req => req.status === 'pending').length,
    approved: requisitionData.filter(req => req.status === 'approved').length,
    rejected: requisitionData.filter(req => req.status === 'rejected').length,
    delivered: requisitionData.filter(req => req.status === 'delivered').length,
    totalValue: requisitionData.reduce((sum, req) => sum + req.estimatedCost, 0),
    averageProcessingTime: Math.round(
      requisitionData.reduce((sum, req) => sum + req.daysInProcess, 0) / (requisitionData.length || 1)
    )
  };

  // Filter requisitions
  const filteredRequisitions = requisitionData.filter(req => {
    const matchesSearch = req.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingOverlay isVisible={isLoading} message="Loading requisitions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Requisitions</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Requisitions</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Real-time tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Procurement requests</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requisitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="delivered">Delivered</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleCreateNewRequisition}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              New Request
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Requests" 
            value={metrics.total}
            icon={Package} 
            color="blue" 
            subtitle="All requisitions"
          />
          <MetricCard 
            title="Pending Review" 
            value={metrics.pending}
            icon={Clock} 
            color="amber" 
            subtitle="Awaiting approval"
          />
          <MetricCard 
            title="Approved" 
            value={metrics.approved}
            icon={CheckCircle} 
            color="green" 
            trend={12}
            subtitle="In procurement"
          />
          <MetricCard 
            title="Total Value" 
            value={metrics.totalValue.toLocaleString()}
            prefix="$"
            icon={DollarSign} 
            color="purple" 
            trend={8}
            subtitle="Estimated cost"
          />
        </div>

        {/* Requisitions List */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Requisition Requests</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredRequisitions.length} of {metrics.total} requests</span>
            </div>
          </div>

          {filteredRequisitions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' ? "No requisitions match your filters" : "No Requisitions Found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try adjusting your search criteria or filters."
                  : "You haven't created any requisitions yet. Start by creating your first request."}
              </p>
              <button
                onClick={handleCreateNewRequisition}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Create New Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequisitions.map((requisition) => (
                <div
                  key={requisition.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{requisition.itemName}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(requisition.status)}`}>
                          {getStatusIcon(requisition.status)}
                          <span className="ml-2">{getStatusText(requisition.status)}</span>
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(requisition.urgency)}`}>
                          {requisition.urgency.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <FileText size={14} />
                          {requisition.trackingId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Submitted: {requisition.submissionDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {requisition.daysInProcess} days in process
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <span className="text-blue-600 font-medium text-sm">Quantity</span>
                          <p className="font-bold text-blue-900">{requisition.quantity}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <span className="text-green-600 font-medium text-sm">Est. Cost</span>
                          <p className="font-bold text-green-900">${requisition.estimatedCost.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <span className="text-purple-600 font-medium text-sm">Department</span>
                          <p className="font-bold text-purple-900 text-sm">{requisition.department}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <span className="text-amber-600 font-medium text-sm">Budget Code</span>
                          <p className="font-bold text-amber-900 text-sm">{requisition.budgetCode}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewRequisition(requisition)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleCopyTrackingId(requisition.trackingId)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Timeline */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Progress Timeline</h4>
                      <span className="text-sm text-gray-500">
                        {requisition.timeline.filter(step => step.completed).length} of {requisition.timeline.length} steps completed
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div 
                        className="absolute left-3 top-0 w-0.5 bg-blue-500 transition-all duration-500"
                        style={{ 
                          height: `${(requisition.timeline.filter(step => step.completed).length / requisition.timeline.length) * 100}%` 
                        }}
                      ></div>
                      
                      <div className="space-y-3">
                        {requisition.timeline.map((step, stepIndex) => (
                          <div key={stepIndex} className="relative flex items-center gap-4">
                            <div className={`relative z-10 w-2 h-2 rounded-full ${
                              step.completed 
                                ? 'bg-green-500' 
                                : step.current 
                                  ? 'bg-blue-500 animate-pulse' 
                                  : 'bg-gray-300'
                            }`}></div>
                            
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <p className={`text-sm font-medium ${
                                  step.current ? 'text-blue-600' : 'text-gray-900'
                                }`}>
                                  {step.description}
                                </p>
                              </div>
                              <div className="text-xs text-gray-500">
                                {step.date} {step.time && `• ${step.time}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">New Requisition</h4>
                <p className="text-sm text-gray-500">Submit a new procurement request</p>
              </div>
            </div>
            <button 
              onClick={handleCreateNewRequisition}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Create Request
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Export Report</h4>
                <p className="text-sm text-gray-500">Download requisition summary</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
              Download Report
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Track Status</h4>
                <p className="text-sm text-gray-500">Monitor all active requests</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors">
              View All
            </button>
          </div>
        </div>
      </main>

      {/* Requisition Details Modal */}
      {selectedRequisition && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Package size={24} className="text-blue-600" />
                    Requisition Details
                  </h2>
                  <p className="text-gray-600 mt-1">Track the progress of your request</p>
                </div>
                <button
                  onClick={() => setSelectedRequisition(null)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-8">
                {/* Header Info */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{selectedRequisition.itemName}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRequisition.status)}`}>
                        {getStatusIcon(selectedRequisition.status)}
                        <span className="ml-2">{getStatusText(selectedRequisition.status)}</span>
                      </span>
                      <button
                        onClick={() => handleCopyTrackingId(selectedRequisition.trackingId)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Copy size={12} />
                        {selectedRequisition.trackingId}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-blue-600 font-medium">Submitted</span>
                      <p className="font-bold text-blue-900">{selectedRequisition.submissionDate}</p>
                    </div>
                    <div>
                      <span className="text-sm text-blue-600 font-medium">Quantity</span>
                      <p className="font-bold text-blue-900">{selectedRequisition.quantity}</p>
                    </div>
                    <div>
                      <span className="text-sm text-blue-600 font-medium">Est. Cost</span>
                      <p className="font-bold text-blue-900">${selectedRequisition.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-blue-600 font-medium">Days in Process</span>
                      <p className="font-bold text-blue-900">{selectedRequisition.daysInProcess}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Timeline */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Activity size={20} />
                    Detailed Progress Timeline
                  </h4>
                  
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div 
                      className="absolute left-6 top-0 w-0.5 bg-blue-500 transition-all duration-1000"
                      style={{ 
                        height: `${(selectedRequisition.timeline.filter(step => step.completed).length / selectedRequisition.timeline.length) * 100}%` 
                      }}
                    ></div>
                    
                    <div className="space-y-6">
                      {selectedRequisition.timeline.map((step, index) => (
                        <div key={index} className={`relative flex items-start gap-6 ${step.current ? 'bg-blue-50 border border-blue-200 rounded-xl p-4 -ml-4' : ''}`}>
                          <div className={`relative z-10 w-4 h-4 rounded-full border-2 ${
                            step.completed 
                              ? 'bg-green-500 border-green-500' 
                              : step.current 
                                ? 'bg-blue-500 border-blue-500 animate-pulse'
                                : 'bg-white border-gray-300'
                          }`}>
                            {step.completed && (
                              <CheckCircle size={12} className="text-green-500 absolute -top-1 -left-1" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className={`font-semibold ${step.current ? 'text-blue-900' : 'text-gray-900'}`}>
                                {step.description}
                              </h5>
                              <span className={`text-sm ${step.current ? 'text-blue-600' : 'text-gray-500'}`}>
                                {step.date} {step.time && `• ${step.time}`}
                              </span>
                            </div>
                            
                            {step.current && (
                              <div className="flex items-center gap-2 text-blue-600 text-sm">
                                <Loader size={14} className="animate-spin" />
                                <span>Currently in progress...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Request Information</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                        <p className="text-gray-900 font-medium">{selectedRequisition.department}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Budget Code</label>
                        <p className="text-gray-900 font-medium">{selectedRequisition.budgetCode}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Priority Level</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedRequisition.urgency)}`}>
                          {selectedRequisition.urgency.toUpperCase()}
                        </span>
                      </div>
                      {selectedRequisition.deliveryDate && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Required Delivery Date</label>
                          <p className="text-gray-900 font-medium">{selectedRequisition.deliveryDate}</p>
                        </div>
                      )}
                      {selectedRequisition.preferredSupplier && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Preferred Supplier</label>
                          <p className="text-gray-900 font-medium">{selectedRequisition.preferredSupplier}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Additional Details</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Business Justification</label>
                        <p className="text-gray-900 text-sm leading-relaxed">{selectedRequisition.reason}</p>
                      </div>
                      {selectedRequisition.environmentalImpact && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Environmental Considerations</label>
                          <p className="text-gray-900 font-medium">{selectedRequisition.environmentalImpact}</p>
                        </div>
                      )}
                      {selectedRequisition.category && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                          <p className="text-gray-900 font-medium">{selectedRequisition.category}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                      <Download size={16} />
                      Export PDF
                    </button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                      <Mail size={16} />
                      Email Updates
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedRequisition.status === 'rejected' && (
                      <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
                        <Edit size={16} />
                        Resubmit
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedRequisition(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
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
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                notificationType === 'success' 
                  ? 'bg-green-500' 
                  : notificationType === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
              }`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
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
    </div>
  );
}