import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Tag,
  History,
  FileText,
  Truck,
  Paperclip,
  Search,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Sparkles,
  Settings,
  Save,
  Send,
  X,
  Eye,
  ChevronRight,
  ChevronLeft,
  Building,
  CreditCard,
  Users,
  Calendar,
  Star,
  Filter,
  MoreVertical,
  Zap,
  Shield,
  TrendingUp,
  Bell,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  RefreshCw,
  FileCheck,
  Layers,
  Target,
  Award,
  BarChart3,
  Globe,
  Lock,
  Edit,
  Trash2,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../../authcontext/authcontext";
import CreateRFQForm from "../create/create";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function RFQsPage() {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${backendUrl}/api/rfqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRfqs(data);
      } catch (error) {
        console.error("Failed to fetch RFQs:", error);
        setRfqs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRFQs();
  }, [backendUrl]);

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch = rfq.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats - handle undefined values safely
  const totalRFQs = rfqs?.length || 0;
  const openRFQs = rfqs?.filter(rfq => rfq.status === "open")?.length || 0;
  const closedRFQs = rfqs?.filter(rfq => rfq.status === "closed")?.length || 0;
  const totalQuotes = rfqs?.reduce((sum, rfq) => sum + (rfq.quotes?.length || 0), 0) || 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "text-green-700 bg-green-50 border-green-200";
      case "closed":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "closed":
        return <Shield size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRFQSuccess = () => {
    // Refresh RFQs list after successful creation
    const fetchRFQs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${backendUrl}/api/rfqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRfqs(data);
        }
      } catch (error) {
        console.error("Failed to refresh RFQs:", error);
      }
    };

    fetchRFQs();
    handleCloseModal();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotificationMessage("RFQ ID copied to clipboard!", "success");
    setShowMenuId(null);
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleDeleteRFQ = async (rfqId) => {
    setActionLoading(rfqId);
    try {
      // Simulate API call for delete
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Remove from local state
      setRfqs((prev) => prev.filter((rfq) => (rfq.id || rfq._id) !== rfqId));
      showNotificationMessage("RFQ deleted successfully!", "success");
    } catch (error) {
      showNotificationMessage("Failed to delete RFQ", "error");
      console.error("Failed to delete RFQ:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading RFQs</h2>
          <p className="text-gray-600">
            Please wait while we fetch the latest requests...
          </p>
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
                Request for Quotations
              </h1>
              <p className="text-gray-500 mt-1">
                Create and manage requests for quotations from vendors
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Create New RFQ
              </button>
              <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <Bell size={20} />
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {totalRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total RFQs</p>
                <p className="text-xl font-bold text-gray-900">{totalRFQs}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {openRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active RFQs</p>
                <p className="text-xl font-bold text-gray-900">{openRFQs}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Package size={20} className="text-purple-600" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                  {closedRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-xl font-bold text-gray-900">{closedRFQs}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <MessageSquare size={20} className="text-amber-600" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                  {totalQuotes}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Quotes</p>
                <p className="text-xl font-bold text-gray-900">{totalQuotes}</p>
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
                    placeholder="Search RFQs by item name..."
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
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="pending">Pending</option>
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
                <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RFQs Content */}
          {filteredRFQs.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText size={40} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No RFQs match your filters" : "No RFQs found"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "Start by creating your first RFQ to begin receiving quotes from vendors."
                    }
                  </p>
                </div>
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create First RFQ
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="grid grid-cols-8 gap-4 items-center font-medium text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    RFQ ID
                  </div>
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    Item Details
                  </div>
                  <div>Quantity</div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Created
                  </div>
                  <div>Deadline</div>
                  <div>Status</div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    Quotes
                  </div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredRFQs.map((rfq, index) => {
                  const rfqId = `rfq-${String(index + 1).padStart(3, '0')}`;
                  return (
                    <div
                      key={rfq.id || rfq._id}
                      className="grid grid-cols-8 gap-4 items-center px-4 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <span className="font-medium text-blue-600">
                          {rfqId}
                        </span>
                      </div>

                      <div>
                        <div className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-gray-900">
                          {rfq.itemName || "N/A"}
                        </div>
                        {rfq.description && (
                          <div className="text-sm text-gray-500 max-w-48 overflow-hidden text-ellipsis whitespace-nowrap">
                            {rfq.description}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="font-medium text-gray-900">
                          {rfq.quantity || "N/A"}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-700">
                          {rfq.createdAt ? formatDate(rfq.createdAt) : "N/A"}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700">
                            {rfq.deadline ? formatDate(rfq.deadline) : "No deadline"}
                          </span>
                          {rfq.deadline && isDeadlineNear(rfq.deadline) && (
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                              Due Soon
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(rfq.status)}`}>
                          {getStatusIcon(rfq.status)}
                          <span className="ml-2 capitalize">{rfq.status || "Unknown"}</span>
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {rfq.quotes?.length || 0} / {rfq.vendors?.length || 0}
                          </span>
                          {rfq.quotes?.length === rfq.vendors?.length && rfq.status === "open" && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Complete
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          data-rfq-id={rfqId}
                          onClick={() => setShowMenuId(showMenuId === rfqId ? null : rfqId)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

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
            className="fixed z-[101] w-64 bg-white rounded-lg border border-gray-200"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-rfq-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 450; // Approximate menu height
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
                const button = document.querySelector(`[data-rfq-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuWidth = 256; // w-64
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
              <Link
                to={`/dashboard/rfqs/${filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id}`}
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Eye size={16} />
                <span>View Details</span>
              </Link>
              
              {/* Submit Quote */}
              <Link
                to={`/dashboard/rfqs/${filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id}/quote`}
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <MessageSquare size={16} />
                <span>Submit Quote</span>
              </Link>
              
              {/* Edit RFQ */}
              <button
                onClick={() => {
                  // Handle edit action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Edit size={16} />
                <span>Edit RFQ</span>
              </button>
              
              {/* View Quotes */}
              <button
                onClick={() => {
                  // Handle view quotes action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <BarChart3 size={16} />
                <span>View All Quotes</span>
              </button>
              
              {/* Select Vendor */}
              {(() => {
                const rfq = filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId);
                return rfq?.status === "open" && (rfq.quotes?.length || 0) > 0 && (
                  <button
                    onClick={() => {
                      // Handle select vendor action
                      setShowMenuId(null);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                  >
                    <Users size={16} />
                    <span>Select Vendor</span>
                  </button>
                );
              })()}
              
              {/* Send Reminder */}
              <button
                onClick={() => {
                  // Handle send reminder action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Send size={16} />
                <span>Send Reminder</span>
              </button>
              
              {/* Download Report */}
              <button
                onClick={() => {
                  // Handle download report action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Download size={16} />
                <span>Download Report</span>
              </button>
              
              {/* Copy RFQ ID */}
              <button
                onClick={() => copyToClipboard(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Copy size={16} />
                <span>Copy RFQ ID</span>
              </button>
              
              {/* Share RFQ */}
              <button
                onClick={() => {
                  // Handle share action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <ExternalLink size={16} />
                <span>Share RFQ</span>
              </button>
              
              {/* Manage Settings */}
              <button
                onClick={() => {
                  // Handle manage settings action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Settings size={16} />
                <span>Manage Settings</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              {/* Delete RFQ */}
              <button
                onClick={() => {
                  const rfq = filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId);
                  if (rfq) {
                    handleDeleteRFQ(rfq.id || rfq._id);
                  }
                }}
                disabled={actionLoading === (filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>Delete RFQ</span>
                {actionLoading === (filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id) && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create RFQ Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <Plus size={20} className="text-blue-500" />
                    Create New RFQ
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Request quotes from vendors for your procurement needs</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-0 max-h-[70vh] overflow-y-auto">
              <CreateRFQForm onClose={handleCloseModal} onSuccess={handleRFQSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-4 py-3 rounded-lg border max-w-md ${
              notificationType === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {notificationType === "success" ? (
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
              <button onClick={() => setShowNotification(false)} className="ml-4 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}