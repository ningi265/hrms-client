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
  Target,
  Award,
  FileText,
  Users,
  Settings,
  ChevronDown,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


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
        return <AlertCircle size={14} />;
      case "medium":
        return <Clock size={14} />;
      case "low":
        return <Check size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <FileText size={24} />
                </div>
                Manage Requisitions
              </h1>
              <p className="text-gray-500 mt-1">
                Review and process pending requisition requests efficiently
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <Bell size={20} />
              </button>
              <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package size={20} className="text-blue-600" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {totalRequisitions}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Pending</p>
                <p className="text-xl font-bold text-gray-900">{totalRequisitions}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  {highUrgency}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">High Urgency</p>
                <p className="text-xl font-bold text-gray-900">{highUrgency}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock size={20} className="text-amber-600" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                  {mediumUrgency}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Medium Urgency</p>
                <p className="text-xl font-bold text-gray-900">{mediumUrgency}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Check size={20} className="text-green-600" />
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {lowUrgency}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Urgency</p>
                <p className="text-xl font-bold text-gray-900">{lowUrgency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requisitions by item, employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="all">All Urgency</option>
                    <option value="high">High Urgency</option>
                    <option value="medium">Medium Urgency</option>
                    <option value="low">Low Urgency</option>
                  </select>

                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2">
                    <Filter size={16} />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2 text-sm">
                  <Download size={16} />
                  Export
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Requisitions Content */}
          {filteredRequisitions.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package size={40} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No requisitions match your filters" : "No Pending Requisitions"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "All requisitions have been processed. New requests will appear here when submitted by employees."
                    }
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="grid grid-cols-7 gap-4 items-center font-medium text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Employee
                  </div>
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    Item Details
                  </div>
                  <div>Quantity</div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Budget Code
                  </div>
                  <div>Urgency</div>
                  <div>Date Submitted</div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                {filteredRequisitions.map((requisition, index) => (
                  <div
                    key={requisition._id}
                    className="grid grid-cols-7 gap-4 items-center px-4 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {requisition.employee?.firstName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-32">
                        {requisition.employee?.email || ""}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900 max-w-40 truncate">
                        {requisition.itemName || "N/A"}
                      </div>
                      {requisition.description && (
                        <div className="text-sm text-gray-500 max-w-40 truncate">
                          {requisition.description}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-medium text-gray-900">
                        {requisition.quantity || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border text-blue-700 bg-blue-50 border-blue-200">
                        {requisition.budgetCode || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(requisition.urgency)}`}>
                        {getUrgencyIcon(requisition.urgency)}
                        <span className="ml-2 capitalize">{requisition.urgency || "N/A"}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-700">
                        {requisition.createdAt ? formatDate(requisition.createdAt) : "N/A"}
                      </span>
                    </div>

                    <div className="text-center">
                      <button
                        data-requisition-id={requisition._id}
                        onClick={() => setShowMenuId(showMenuId === requisition._id ? null : requisition._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className={`px-4 py-3 rounded-lg border max-w-md ${
              notificationType === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {notificationType === 'success' ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <span className="font-medium">{notificationMessage}</span>
                <button
                  onClick={() => setShowNotification(false)}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-[100] bg-transparent"
            onClick={() => setShowMenuId(null)}
          ></div>
          
          {/* Action Menu */}
          <div 
            className="fixed z-[101] w-56 bg-white rounded-lg border border-gray-200"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-requisition-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 280; // Approximate menu height
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const spaceAbove = rect.top;
                  
                  // If there's more space above or menu would go off screen below
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
                  const menuWidth = 224; // 56 * 4 (w-56)
                  const spaceRight = window.innerWidth - rect.right;
                  
                  // If menu would go off screen on right, position it to the left of button
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
              {/* View Details */}
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
              
              {/* Download PDF */}
              <button
                onClick={() => handleDownloadPDF(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
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
              
              {/* Approve */}
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
              
              {/* Reject */}
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
    </div>
  );
}