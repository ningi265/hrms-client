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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
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
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <FileText size={32} />
                </div>
                Manage Requisitions
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Review and process pending requisition requests efficiently
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Bell size={20} />
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Package size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalRequisitions}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Pending</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequisitions}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                  <AlertCircle size={24} className="text-white" />
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {highUrgency}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">High Urgency</p>
                <p className="text-2xl font-bold text-gray-900">{highUrgency}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Clock size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {mediumUrgency}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Medium Urgency</p>
                <p className="text-2xl font-bold text-gray-900">{mediumUrgency}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Check size={24} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {lowUrgency}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Urgency</p>
                <p className="text-2xl font-bold text-gray-900">{lowUrgency}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Enhanced Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requisitions by item, employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm font-medium"
                  >
                    <option value="all">All Urgency</option>
                    <option value="high">High Urgency</option>
                    <option value="medium">Medium Urgency</option>
                    <option value="low">Low Urgency</option>
                  </select>

                  <button className="px-4 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center gap-2">
                    <Filter size={18} />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white/80 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 flex items-center gap-2">
                  <Download size={16} />
                  Export
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="p-2 bg-white/80 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Requisitions Content */}
          {filteredRequisitions.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Package size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <RefreshCw size={20} />
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-visible">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-7 gap-4 items-center font-semibold text-gray-700 text-sm">
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
              <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto overflow-x-visible">
                {filteredRequisitions.map((requisition, index) => (
                  <motion.div
                    key={requisition._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-7 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group relative"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {requisition.employee?.firstName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-32">
                        {requisition.employee?.email || ""}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 max-w-40 truncate">
                        {requisition.itemName || "N/A"}
                      </div>
                      {requisition.description && (
                        <div className="text-sm text-gray-500 max-w-40 truncate">
                          {requisition.description}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-semibold text-gray-900">
                        {requisition.quantity || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border text-blue-700 bg-blue-50 border-blue-200">
                        {requisition.budgetCode || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(requisition.urgency)}`}>
                        {getUrgencyIcon(requisition.urgency)}
                        <span className="ml-2 capitalize">{requisition.urgency || "N/A"}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-700">
                        {requisition.createdAt ? formatDate(requisition.createdAt) : "N/A"}
                      </span>
                    </div>

                    <div className="text-center relative">
                      <button
                        data-requisition-id={requisition._id}
                        onClick={() => setShowMenuId(showMenuId === requisition._id ? null : requisition._id)}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-lg"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

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

      {/* Enhanced Action Dropdown Menu - Positioned Above Everything */}
      {showMenuId && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-[100] bg-transparent"
            onClick={() => setShowMenuId(null)}
          ></div>
          
          {/* Action Menu */}
          <div 
            className="fixed z-[101] w-56 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-lg overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
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
              <motion.button
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                onClick={() => handleViewRequisition(showMenuId)}
                className="w-full flex items-center space-x-3 px-6 py-4 text-gray-700 hover:text-blue-600 transition-all duration-200 text-left"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">View Details</div>
                  <div className="text-xs text-gray-500">See full requisition</div>
                </div>
              </motion.button>
              
              {/* Download PDF */}
              <motion.button
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                onClick={() => handleDownloadPDF(showMenuId)}
                className="w-full flex items-center space-x-3 px-6 py-4 text-gray-700 hover:text-blue-600 transition-all duration-200 text-left"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Download size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Download PDF</div>
                  <div className="text-xs text-gray-500">Export as document</div>
                </div>
              </motion.button>
              
              <div className="border-t border-gray-100 my-2 mx-4"></div>
              
              {/* Approve */}
              <motion.button
                whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}
                onClick={() => handleAction(showMenuId, "approve")}
                className="w-full flex items-center space-x-3 px-6 py-4 text-green-700 hover:text-green-800 transition-all duration-200 text-left"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Approve</div>
                  <div className="text-xs text-green-600">Accept this request</div>
                </div>
              </motion.button>
              
              {/* Reject */}
              <motion.button
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                onClick={() => handleAction(showMenuId, "reject")}
                className="w-full flex items-center space-x-3 px-6 py-4 text-red-700 hover:text-red-800 transition-all duration-200 text-left"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <X size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Reject</div>
                  <div className="text-xs text-red-600">Decline this request</div>
                </div>
              </motion.button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}