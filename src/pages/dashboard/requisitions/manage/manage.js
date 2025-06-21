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
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// MetricCard Component (styled like vehicle-management.jsx)
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

// Requisition Card Component (styled like vehicle cards)
const RequisitionCard = ({ requisition, onMenuClick, showMenuId, onAction, onView, onDownload, getUrgencyColor, getUrgencyIcon, formatDate }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {requisition.itemName || "N/A"}
            </h4>
            <p className="text-sm text-gray-500">
              {requisition.employee?.firstName || "Unknown Employee"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(requisition.urgency)}`}>
            {getUrgencyIcon(requisition.urgency)}
            <span className="ml-1 capitalize">{requisition.urgency || "N/A"}</span>
          </span>
          <button
            data-requisition-id={requisition._id}
            onClick={() => onMenuClick(requisition._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900">
            {requisition.quantity || 0}
          </div>
          <div className="text-xs text-gray-500">Quantity</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            {requisition.budgetCode?.slice(-4) || "N/A"}
          </div>
          <div className="text-xs text-gray-500">Budget Code</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Employee</span>
          <span className="text-xs font-medium truncate">{requisition.employee?.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Submitted</span>
          <span className="text-xs font-medium">{requisition.createdAt ? formatDate(requisition.createdAt) : "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Budget Code</span>
          <span className="text-xs font-medium">{requisition.budgetCode || "N/A"}</span>
        </div>
      </div>

      {requisition.description && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Description</div>
          <div className="text-xs text-gray-800 bg-gray-50 p-2 rounded line-clamp-2">
            {requisition.description}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => onAction(requisition._id, "approve")}
            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
          >
            <Check size={12} />
            Approve
          </button>
          <button
            onClick={() => onAction(requisition._id, "reject")}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
          >
            <X size={12} />
            Reject
          </button>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onView(requisition._id)}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={() => onDownload(requisition._id)}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ManageRequisitionsPage() {
  const [requisitions, setRequisitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showMenuId, setShowMenuId] = useState(null);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch pending requisitions
  useEffect(() => {
    const fetchPendingRequisitions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/requisitions/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setRequisitions(data);
      } catch (err) {
        setError("Failed to fetch requisitions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequisitions();
  }, [backendUrl]);

  // Filter requisitions based on search term and status
  const filteredRequisitions = requisitions.filter((requisition) => {
    const matchesSearch = 
      requisition.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requisition.employee?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requisition.employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    
    const matchesStatus = statusFilter === "all" || requisition.urgency === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRequisitions = requisitions?.length || 0;
  const highUrgency = requisitions?.filter(req => req.urgency === "high")?.length || 0;
  const mediumUrgency = requisitions?.filter(req => req.urgency === "medium")?.length || 0;
  const lowUrgency = requisitions?.filter(req => req.urgency === "low")?.length || 0;

  // Handle accept/reject action
  const handleAction = async (requisitionId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/requisitions/${requisitionId}/${action}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setRequisitions((prev) =>
          prev.filter((req) => req._id !== requisitionId)
        );
        showNotificationMessage(`Requisition ${action === "approve" ? "approved" : "rejected"} successfully!`, "success");
      } else {
        setError(data.message || "Failed to update requisition");
      }
    } catch (err) {
      showNotificationMessage("Failed to update requisition", "error");
      console.error(err);
    }
    setShowMenuId(null);
  };

  // Handle view requisition details
  const handleViewRequisition = (requisitionId) => {
    navigate(`/requisitions/${requisitionId}`);
    setShowMenuId(null);
  };

  // Handle download PDF
  const handleDownloadPDF = async (requisitionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/requisitions/${requisitionId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `requisition-${requisitionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotificationMessage("PDF downloaded successfully!", "success");
      } else {
        showNotificationMessage("Failed to download PDF", "error");
      }
    } catch (err) {
      showNotificationMessage("Failed to download PDF", "error");
      console.error(err);
    }
    setShowMenuId(null);
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "text-red-700 bg-red-50 border-red-200";
      case "medium":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "low":
        return "text-green-700 bg-green-50 border-green-200";
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

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <DotLottieReact
            src="loading.lottie"
            loop
            autoplay
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Requisitions</h2>
          <p className="text-gray-600">
            Please wait while we fetch pending requisitions...
          </p>
        </motion.div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
            <h1 className="text-2xl font-bold text-gray-900">Requisition Management</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Processing queue</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Approval workflow: Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requisitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="all">All Urgency</option>
              <option value="high">High Urgency</option>
              <option value="medium">Medium Urgency</option>
              <option value="low">Low Urgency</option>
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
            title="Total Pending" 
            value={totalRequisitions}
            icon={Package} 
            color="blue" 
            subtitle="Awaiting review"
          />
          <MetricCard 
            title="High Urgency" 
            value={highUrgency}
            icon={AlertCircle} 
            color="red" 
            trend={-12}
            subtitle="Immediate attention"
          />
          <MetricCard 
            title="Medium Urgency" 
            value={mediumUrgency}
            icon={Clock} 
            color="amber" 
            subtitle="Standard processing"
          />
          <MetricCard 
            title="Low Urgency" 
            value={lowUrgency}
            icon={CheckCircle} 
            color="green" 
            trend={8}
            subtitle="Routine requests"
          />
        </div>

        {/* Requisitions Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Pending Requisitions</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredRequisitions.length} of {totalRequisitions} requisitions</span>
            </div>
          </div>

          {filteredRequisitions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No requisitions match your filters" : "No Pending Requisitions"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search criteria or filters."
                  : "All requisitions have been processed. New requests will appear here."}
              </p>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequisitions.map((requisition) => (
                <RequisitionCard
                  key={requisition._id}
                  requisition={requisition}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onAction={handleAction}
                  onView={handleViewRequisition}
                  onDownload={handleDownloadPDF}
                  getUrgencyColor={getUrgencyColor}
                  getUrgencyIcon={getUrgencyIcon}
                  formatDate={formatDate}
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
            className="fixed z-[101] w-64 bg-white rounded-xl shadow-2xl border border-gray-200/50 backdrop-blur-sm"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-requisition-id="${showMenuId}"]`);
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
                const button = document.querySelector(`[data-requisition-id="${showMenuId}"]`);
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
                onClick={() => handleViewRequisition(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Eye size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">View Details</div>
                  <div className="text-xs text-gray-500">See full requisition</div>
                </div>
              </button>
              
              <button
                onClick={() => handleDownloadPDF(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-left"
              >
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Download size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Download PDF</div>
                  <div className="text-xs text-gray-500">Export as document</div>
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
                  <div className="font-medium">Approve</div>
                  <div className="text-xs text-green-600">Accept this request</div>
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
                  <div className="font-medium">Reject</div>
                  <div className="text-xs text-red-600">Decline this request</div>
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
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {notificationType === 'success' ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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