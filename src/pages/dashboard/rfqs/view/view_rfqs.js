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
  TrendingDown,
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

// MetricCard Component (styled like vendors.js)
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

// RFQ Card Component (styled like vendor cards)
const RFQCard = ({ rfq, onMenuClick, showMenuId, onDelete, actionLoading, rfqId }) => {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {rfqId}
            </h4>
            <p className="text-sm text-gray-500">{rfq.itemName || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(rfq.status)}`}>
            {getStatusIcon(rfq.status)}
            {rfq.status}
          </span>
          <button
            data-rfq-id={rfqId}
            onClick={() => onMenuClick(rfqId)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900">
            {rfq.quantity || 0}
          </div>
          <div className="text-xs text-gray-500">Quantity</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            {rfq.quotes?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Quotes</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Created</span>
          <span className="text-xs font-medium">
            {rfq.createdAt ? formatDate(rfq.createdAt) : "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Deadline</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">
              {rfq.deadline ? formatDate(rfq.deadline) : "No deadline"}
            </span>
            {rfq.deadline && isDeadlineNear(rfq.deadline) && (
              <span className="bg-amber-100 text-amber-800 px-1 py-0.5 rounded text-xs font-medium">
                Soon
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Vendors</span>
          <span className="text-xs font-medium">{rfq.vendors?.length || 0}</span>
        </div>
      </div>

      {rfq.description && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Description</div>
          <div className="text-sm text-gray-800 line-clamp-2">
            {rfq.description}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            Progress: {rfq.quotes?.length || 0}/{rfq.vendors?.length || 0}
          </span>
        </div>
        <div className="flex gap-1">
          <Link
            to={`/dashboard/rfqs/${rfq.id || rfq._id}`}
            className="p-1 text-gray-400 hover:text-blue-600"
          >
            <Eye size={14} />
          </Link>
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Edit size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

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
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request for Quotations</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>RFQ monitoring</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Response rate: {totalRFQs > 0 ? Math.round((totalQuotes / totalRFQs) * 100) : 0}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search RFQs..."
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
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending</option>
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
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Create RFQ
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total RFQs" 
            value={totalRFQs}
            icon={FileText} 
            color="blue" 
            subtitle="All requests"
          />
          <MetricCard 
            title="Active RFQs" 
            value={openRFQs}
            icon={CheckCircle} 
            color="green" 
            trend={12}
            subtitle="Currently open"
          />
          <MetricCard 
            title="Completed" 
            value={closedRFQs}
            icon={Package} 
            color="purple" 
            subtitle="Finished RFQs"
          />
          <MetricCard 
            title="Total Quotes" 
            value={totalQuotes}
            icon={MessageSquare} 
            color="amber" 
            trend={8}
            subtitle="Received responses"
          />
        </div>

        {/* RFQ Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Request for Quotations</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredRFQs.length} of {totalRFQs} RFQs</span>
            </div>
          </div>

          {filteredRFQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No RFQs match your filters" : "No RFQs found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Start by creating your first RFQ to begin receiving quotes."}
              </p>
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Create RFQ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRFQs.map((rfq, index) => {
                const rfqId = `rfq-${String(index + 1).padStart(3, '0')}`;
                return (
                  <RFQCard
                    key={rfq.id || rfq._id}
                    rfq={rfq}
                    rfqId={rfqId}
                    onMenuClick={setShowMenuId}
                    showMenuId={showMenuId}
                    onDelete={handleDeleteRFQ}
                    actionLoading={actionLoading}
                  />
                );
              })}
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
            className="fixed z-[101] w-56 bg-white rounded-xl shadow-2xl border border-gray-200/50 backdrop-blur-sm"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-rfq-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 450;
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
                const button = document.querySelector(`[data-rfq-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuWidth = 224;
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
              <Link
                to={`/dashboard/rfqs/${filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id}`}
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Eye size={16} />
                <span>View Details</span>
              </Link>
              
              <Link
                to={`/dashboard/rfqs/${filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id}/quote`}
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <MessageSquare size={16} />
                <span>Submit Quote</span>
              </Link>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Edit size={16} />
                <span>Edit RFQ</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <BarChart3 size={16} />
                <span>View All Quotes</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Users size={16} />
                <span>Select Vendor</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Send size={16} />
                <span>Send Reminder</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Download size={16} />
                <span>Download Report</span>
              </button>
              
              <button
                onClick={() => copyToClipboard(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Copy size={16} />
                <span>Copy RFQ ID</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <ExternalLink size={16} />
                <span>Share RFQ</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Settings size={16} />
                <span>Manage Settings</span>
              </button>

              <div className="border-t border-gray-100 my-1"></div>
              
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Plus size={24} className="text-blue-500" />
                    Create New RFQ
                  </h2>
                  <p className="text-gray-600 mt-1">Request quotes from vendors for your procurement needs</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} />
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
    </div>
  );
}