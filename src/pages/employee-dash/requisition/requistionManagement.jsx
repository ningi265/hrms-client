import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Package, FileText, Calendar, Clock, CheckCircle, X, Eye, Info, Download, Edit, RefreshCw, Star, TrendingUp, TrendingDown, Award, Activity, Bell, Settings, UserCheck, XCircle, AlertTriangle, Loader, Users, Plus, AlertCircle, DollarSign, Building, Truck, Search, Filter, MoreVertical, Copy, ExternalLink, MessageSquare, Phone, Mail, CreditCard, Zap, Shield } from 'lucide-react';
import { motion } from "framer-motion";

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Loading Requisitions..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 flex items-center gap-2">
        <Loader className="animate-spin w-5 h-5 text-blue-500" />
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};

// MetricCard Component (compact version)
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-3xl" : "text-xl";
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-3 hover:shadow-md transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-xl ${
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

     const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

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
      approver: apiData.approver,
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
      case 'pending': return <Clock size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'under_review': return <Loader size={16} className="animate-spin" />;
      case 'procurement': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
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
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Requisitions</h2>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium text-sm"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-3 space-y-3 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requisitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
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
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleCreateNewRequisition}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus size={14} />
              New Request
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
        <div className="bg-white rounded-2xl border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Requisition Requests</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{filteredRequisitions.length} of {metrics.total} requests</span>
            </div>
          </div>

          {filteredRequisitions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Package size={24} className="text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' ? "No requisitions match your filters" : "No Requisitions Found"}
              </h3>
              <p className="text-gray-500 mb-3 text-xs">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try adjusting your search criteria or filters."
                  : "You haven't created any requisitions yet. Start by creating your first request."}
              </p>
              <button
                onClick={handleCreateNewRequisition}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 mx-auto text-sm"
              >
                <Plus size={14} />
                Create New Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filteredRequisitions.map((requisition) => (
                <div
                  key={requisition.id}
                  className="bg-white rounded-2xl border border-gray-200 p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{requisition.itemName}</h3>
                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            onClick={() => handleViewRequisition(requisition)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleCopyTrackingId(requisition.trackingId)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium border ${getStatusColor(requisition.status)}`}>
                          {getStatusIcon(requisition.status)}
                          <span className="ml-1">{getStatusText(requisition.status)}</span>
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium ${getUrgencyColor(requisition.urgency)}`}>
                          {requisition.urgency.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <FileText size={12} />
                          {requisition.trackingId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {requisition.submissionDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {requisition.daysInProcess}d
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-xl p-2">
                          <span className="text-blue-600 font-medium text-xs">Quantity</span>
                          <p className="font-bold text-blue-900 text-sm">{requisition.quantity}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-2">
                          <span className="text-green-600 font-medium text-xs">Est. Cost</span>
                          <p className="font-bold text-green-900 text-sm">${requisition.estimatedCost.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                     <div className="bg-purple-50 rounded-xl p-2">
  <span className="text-purple-600 font-medium text-xs">Procurement Officer</span>
  <p className="font-bold text-purple-900 text-xs">
    {requisition.approver?.email || 'Not assigned'}
  </p>
</div>
                        <div className="bg-amber-50 rounded-xl p-2">
                          <span className="text-amber-600 font-medium text-xs">Budget Code</span>
                          <p className="font-bold text-amber-900 text-xs">{requisition.budgetCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Timeline */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">Progress Timeline</h4>
                      <span className="text-xs text-gray-500">
                        {requisition.timeline.filter(step => step.completed).length} of {requisition.timeline.length} steps
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div 
                        className="absolute left-2 top-0 w-0.5 bg-blue-500 transition-all duration-500"
                        style={{ 
                          height: `${(requisition.timeline.filter(step => step.completed).length / requisition.timeline.length) * 100}%` 
                        }}
                      ></div>
                      
                      <div className="space-y-2">
                        {requisition.timeline.slice(0, 3).map((step, stepIndex) => (
                          <div key={stepIndex} className="relative flex items-center gap-3">
                            <div className={`relative z-10 w-1.5 h-1.5 rounded-full ${
                              step.completed 
                                ? 'bg-green-500' 
                                : step.current 
                                  ? 'bg-blue-500 animate-pulse' 
                                  : 'bg-gray-300'
                            }`}></div>
                            
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <p className={`text-xs font-medium ${
                                  step.current ? 'text-blue-600' : 'text-gray-900'
                                }`}>
                                  {step.description}
                                </p>
                              </div>
                              <div className="text-xs text-gray-500">
                                {step.date}
                              </div>
                            </div>
                          </div>
                        ))}
                        {requisition.timeline.length > 3 && (
                          <div className="text-xs text-gray-400 text-center">
                            +{requisition.timeline.length - 3} more steps
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Plus className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">New Requisition</h4>
                <p className="text-xs text-gray-500">Submit a new procurement request</p>
              </div>
            </div>
            <button 
              onClick={handleCreateNewRequisition}
              className="w-full py-2 px-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm"
            >
              Create Request
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-50 rounded-xl">
                <Download className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Export Report</h4>
                <p className="text-xs text-gray-500">Download requisition summary</p>
              </div>
            </div>
            <button className="w-full py-2 px-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors text-sm">
              Download Report
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Track Status</h4>
                <p className="text-xs text-gray-500">Monitor all active requests</p>
              </div>
            </div>
            <button className="w-full py-2 px-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors text-sm">
              View All
            </button>
          </div>
        </div>
      </main>

      {/* Requisition Details Modal */}
      {selectedRequisition && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package size={20} className="text-blue-600" />
                    Requisition Details
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">Track the progress of your request</p>
                </div>
                <button
                  onClick={() => setSelectedRequisition(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Header Info */}
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{selectedRequisition.itemName}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium border ${getStatusColor(selectedRequisition.status)}`}>
                        {getStatusIcon(selectedRequisition.status)}
                        <span className="ml-1">{getStatusText(selectedRequisition.status)}</span>
                      </span>
                      <button
                        onClick={() => handleCopyTrackingId(selectedRequisition.trackingId)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Copy size={10} />
                        {selectedRequisition.trackingId}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <span className="text-xs text-blue-600 font-medium">Submitted</span>
                      <p className="font-bold text-blue-900 text-sm">{selectedRequisition.submissionDate}</p>
                    </div>
                    <div>
                      <span className="text-xs text-blue-600 font-medium">Quantity</span>
                      <p className="font-bold text-blue-900 text-sm">{selectedRequisition.quantity}</p>
                    </div>
                    <div>
                      <span className="text-xs text-blue-600 font-medium">Est. Cost</span>
                      <p className="font-bold text-blue-900 text-sm">${selectedRequisition.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-xs text-blue-600 font-medium">Days in Process</span>
                      <p className="font-bold text-blue-900 text-sm">{selectedRequisition.daysInProcess}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Timeline */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={16} />
                    Detailed Progress Timeline
                  </h4>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div 
                      className="absolute left-4 top-0 w-0.5 bg-blue-500 transition-all duration-1000"
                      style={{ 
                        height: `${(selectedRequisition.timeline.filter(step => step.completed).length / selectedRequisition.timeline.length) * 100}%` 
                      }}
                    ></div>
                    
                    <div className="space-y-4">
                      {selectedRequisition.timeline.map((step, index) => (
                        <div key={index} className={`relative flex items-start gap-4 ${step.current ? 'bg-blue-50 border border-blue-200 rounded-2xl p-3 -ml-3' : ''}`}>
                          <div className={`relative z-10 w-3 h-3 rounded-full border-2 ${
                            step.completed 
                              ? 'bg-green-500 border-green-500' 
                              : step.current 
                                ? 'bg-blue-500 border-blue-500 animate-pulse'
                                : 'bg-white border-gray-300'
                          }`}>
                            {step.completed && (
                              <CheckCircle size={10} className="text-green-500 absolute -top-0.5 -left-0.5" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className={`font-semibold text-sm ${step.current ? 'text-blue-900' : 'text-gray-900'}`}>
                                {step.description}
                              </h5>
                              <span className={`text-xs ${step.current ? 'text-blue-600' : 'text-gray-500'}`}>
                                {step.date} {step.time && `• ${step.time}`}
                              </span>
                            </div>
                            
                            {step.current && (
                              <div className="flex items-center gap-1 text-blue-600 text-xs">
                                <Loader size={12} className="animate-spin" />
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Request Information</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                        <p className="text-gray-900 font-medium text-sm">{selectedRequisition.department}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Budget Code</label>
                        <p className="text-gray-900 font-medium text-sm">{selectedRequisition.budgetCode}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Priority Level</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium ${getUrgencyColor(selectedRequisition.urgency)}`}>
                          {selectedRequisition.urgency.toUpperCase()}
                        </span>
                      </div>
                      {selectedRequisition.deliveryDate && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Required Delivery Date</label>
                          <p className="text-gray-900 font-medium text-sm">{selectedRequisition.deliveryDate}</p>
                        </div>
                      )}
                      {selectedRequisition.preferredSupplier && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Preferred Supplier</label>
                          <p className="text-gray-900 font-medium text-sm">{selectedRequisition.preferredSupplier}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Additional Details</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Business Justification</label>
                        <p className="text-gray-900 text-xs leading-relaxed">{selectedRequisition.reason}</p>
                      </div>
                      {selectedRequisition.environmentalImpact && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Environmental Considerations</label>
                          <p className="text-gray-900 font-medium text-sm">{selectedRequisition.environmentalImpact}</p>
                        </div>
                      )}
                      {selectedRequisition.category && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                          <p className="text-gray-900 font-medium text-sm">{selectedRequisition.category}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1 text-sm">
                      <Download size={14} />
                      Export PDF
                    </button>
                    <button className="px-3 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm">
                      <Mail size={14} />
                      Email Updates
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedRequisition.status === 'rejected' && (
                      <button className="px-3 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-1 text-sm">
                        <Edit size={14} />
                        Resubmit
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedRequisition(null)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm"
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
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border ${
            notificationType === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : notificationType === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                notificationType === 'success' 
                  ? 'bg-green-500' 
                  : notificationType === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
              }`}>
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium text-sm">{notificationMessage}</span>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-3 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
