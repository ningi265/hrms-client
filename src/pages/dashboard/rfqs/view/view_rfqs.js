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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading RFQs</h2>
          <p className="text-gray-600">
            Please wait while we fetch the latest requests...
          </p>
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
                Request for Quotations
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Create and manage requests for quotations from vendors
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleOpenModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                Create New RFQ
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Bell size={20} />
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
                  <FileText size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total RFQs</p>
                <p className="text-2xl font-bold text-gray-900">{totalRFQs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {openRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active RFQs</p>
                <p className="text-2xl font-bold text-gray-900">{openRFQs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Package size={24} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {closedRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{closedRFQs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalQuotes}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuotes}</p>
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
                    placeholder="Search RFQs by item name..."
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
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="pending">Pending</option>
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
                <button className="p-2 bg-white/80 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* RFQs Content */}
          {filteredRFQs.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <FileText size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create First RFQ
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-8 gap-4 items-center font-semibold text-gray-700 text-sm">
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
                {filteredRFQs.map((rfq, index) => (
                  <motion.div
                    key={rfq.id || rfq._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-8 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <div>
                      <span className="font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                        {`rfq-${String(index + 1).padStart(3, '0')}`}
                      </span>
                    </div>

                    <div>
                      <div className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                        {rfq.itemName || "N/A"}
                      </div>
                      {rfq.description && (
                        <div className="text-sm text-gray-500 max-w-48 overflow-hidden text-ellipsis whitespace-nowrap">
                          {rfq.description}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-semibold text-gray-900">
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(rfq.status)}`}>
                        {getStatusIcon(rfq.status)}
                        <span className="ml-2 capitalize">{rfq.status || "Unknown"}</span>
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
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
                      <div className="relative">
                        <button
                          onClick={() => setShowMenuId(showMenuId === `rfq-${String(index + 1).padStart(3, '0')}` ? null : `rfq-${String(index + 1).padStart(3, '0')}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {showMenuId === `rfq-${String(index + 1).padStart(3, '0')}` && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                            <div className="py-2">
                              <Link
                                to={`/dashboard/rfqs/${rfq.id || rfq._id}`}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                              >
                                <Eye size={16} />
                                <span>View Details</span>
                              </Link>
                              <Link
                                to={`/dashboard/rfqs/${rfq.id || rfq._id}/quote`}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                              >
                                <MessageSquare size={16} />
                                <span>Submit Quote</span>
                              </Link>
                              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                                <Edit size={16} />
                                <span>Edit RFQ</span>
                              </button>
                              {rfq.status === "open" && (rfq.quotes?.length || 0) > 0 && (
                                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                                  <Users size={16} />
                                  <span>Select Vendor</span>
                                </button>
                              )}
                              <button
                                onClick={() => copyToClipboard(`rfq-${String(index + 1).padStart(3, '0')}`)}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                              >
                                <Copy size={16} />
                                <span>Copy ID</span>
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200">
                                <Trash2 size={16} />
                                <span>Delete RFQ</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Enhanced Create RFQ Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
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
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
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

      {/* Click outside to close menu */}
      {showMenuId && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenuId(null)}
        ></div>
      )}
    </div>
  );
}