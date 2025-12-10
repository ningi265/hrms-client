import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Award,
  Star,
  MessageSquare,
  Truck,
  User,
  Bell,
  Filter,
  Search,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Building,
  CreditCard,
  Edit3,
  Send,
  Crown,
  ThumbsUp,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../authcontext/authcontext";

export default function SelectVendorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [expandedRFQs, setExpandedRFQs] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

  // Fetch all RFQs
  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/rfqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setRfqs(data);
        } else {
          setError(data.message || "Failed to fetch RFQs");
        }
      } catch (err) {
        setError("Failed to fetch RFQs. Please check your network connection.");
        console.error("Failed to fetch RFQs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRFQs();
  }, []);

  // Filter RFQs based on search term and status
  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch = rfq.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRFQs = rfqs?.length || 0;
  const openRFQs = rfqs?.filter(rfq => rfq.status === "open" && rfq.quotes?.length > 0)?.length || 0;
  const closedRFQs = rfqs?.filter(rfq => rfq.status === "closed")?.length || 0;
  const totalQuotes = rfqs?.reduce((sum, rfq) => sum + (rfq.quotes?.length || 0), 0) || 0;
  const avgQuotesPerRFQ = totalRFQs > 0 ? (totalQuotes / totalRFQs).toFixed(1) : 0;

  // Handle vendor selection
  const handleSelectVendor = async (rfqId, vendorId, quote) => {
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/rfqs/${rfqId}/select`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Vendor selected successfully! Purchase order will be generated.`);
        // Refresh the RFQs list after selection
        const updatedRfqs = rfqs.map((rfq) =>
          rfq._id === rfqId ? { ...rfq, status: "closed", selectedVendor: data.bestQuote?.vendor } : rfq
        );
        setRfqs(updatedRfqs);
      } else {
        setError(data.message || "Failed to select vendor");
      }
    } catch (err) {
      setError("Failed to select vendor. Please check your network connection.");
      console.error("Failed to select vendor:", err);
    }
  };

  const toggleRFQExpansion = (rfqId) => {
    const newExpanded = new Set(expandedRFQs);
    if (newExpanded.has(rfqId)) {
      newExpanded.delete(rfqId);
    } else {
      newExpanded.add(rfqId);
    }
    setExpandedRFQs(newExpanded);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getBestQuote = (quotes) => {
    if (!quotes || quotes.length === 0) return null;
    return quotes.reduce((best, current) => 
      (current.price < best.price) ? current : best
    );
  };

  const getQuoteRanking = (quotes, currentQuote) => {
    if (!quotes || quotes.length === 0) return 0;
    const sortedQuotes = [...quotes].sort((a, b) => a.price - b.price);
    return sortedQuotes.findIndex(q => q._id === currentQuote._id) + 1;
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
            Please wait while we fetch vendor quotes...
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
            <div className="flex items-center gap-6">
              
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
                    <Target size={32} />
                  </div>
                  Vendor Selection
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  Review quotes and select the best vendors for your RFQs
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Bell size={20} />
              </button>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <FileText size={18} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {totalRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Total RFQs</p>
                <p className="text-xl font-bold text-gray-900">{totalRFQs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {openRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Ready to Select</p>
                <p className="text-xl font-bold text-gray-900">{openRFQs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Award size={18} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {closedRFQs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Completed</p>
                <p className="text-xl font-bold text-gray-900">{closedRFQs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                  {totalQuotes}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Total Quotes</p>
                <p className="text-xl font-bold text-gray-900">{totalQuotes}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
                  <Activity size={18} className="text-white" />
                </div>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                  {avgQuotesPerRFQ}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Avg Quotes/RFQ</p>
                <p className="text-xl font-bold text-gray-900">{avgQuotesPerRFQ}</p>
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
          {/* Success/Error Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3"
              >
                <CheckCircle size={20} />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

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
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
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
                  <Target size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No RFQs match your filters" : "No RFQs found"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "There are currently no RFQs available for vendor selection."
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRFQs.map((rfq, index) => {
                const isExpanded = expandedRFQs.has(rfq._id);
                const bestQuote = getBestQuote(rfq.quotes);
                
                // Create a map of vendors for quick lookup
                const vendorMap = {};
                rfq.vendors?.forEach((vendor) => {
                  vendorMap[vendor._id] = vendor;
                });

                return (
                  <motion.div
                    key={rfq._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden"
                  >
                    {/* RFQ Header */}
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
                      onClick={() => toggleRFQExpansion(rfq._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                            <Package size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {rfq.itemName}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <FileText size={14} />
                                RFQ ID: {rfq._id.slice(-8).toUpperCase()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare size={14} />
                                {rfq.quotes?.length || 0} Quotes
                              </span>
                              {bestQuote && (
                                <span className="flex items-center gap-1">
                                  <DollarSign size={14} />
                                  Best: {formatCurrency(bestQuote.price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(rfq.status)}`}>
                            {getStatusIcon(rfq.status)}
                            <span className="ml-2 capitalize">{rfq.status}</span>
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {rfq.quotes?.length > 0 && rfq.status === "open" && (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Ready to Select
                              </span>
                            )}
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={20} className="text-gray-400" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-6">
                            {rfq.quotes?.length === 0 ? (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <MessageSquare size={24} className="text-gray-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">No quotes submitted yet</h4>
                                <p className="text-gray-600">Waiting for vendors to submit their quotes for this RFQ.</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Users size={20} />
                                    Vendor Quotes ({rfq.quotes.length})
                                  </h4>
                                  {bestQuote && (
                                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                                      <Crown size={16} />
                                      Best Price: {formatCurrency(bestQuote.price)}
                                    </div>
                                  )}
                                </div>

                                <div className="grid gap-4">
                                  {rfq.quotes.map((quote) => {
                                    const vendor = vendorMap[quote.vendor];
                                    const ranking = getQuoteRanking(rfq.quotes, quote);
                                    const isBestQuote = bestQuote && quote._id === bestQuote._id;

                                    return (
                                      <motion.div
                                        key={quote._id}
                                        whileHover={{ scale: 1.01 }}
                                        className={`bg-white rounded-xl border p-6 transition-all duration-200 ${
                                          isBestQuote ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                              isBestQuote ? 'bg-green-500' : 'bg-gray-500'
                                            }`}>
                                              {isBestQuote ? (
                                                <Crown size={20} className="text-white" />
                                              ) : (
                                                <Building size={20} className="text-white" />
                                              )}
                                            </div>
                                            <div>
                                              <h5 className="font-semibold text-gray-900 mb-1">
                                                {vendor ? vendor.name : "Unknown Vendor"}
                                              </h5>
                                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                  <DollarSign size={14} />
                                                  {formatCurrency(quote.price)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                  <Truck size={14} />
                                                  {quote.deliveryTime}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                  ranking === 1 ? 'bg-green-100 text-green-800' :
                                                  ranking === 2 ? 'bg-yellow-100 text-yellow-800' :
                                                  'bg-gray-100 text-gray-800'
                                                }`}>
                                                  Rank #{ranking}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-3">
                                            {quote.notes && (
                                              <div className="max-w-xs">
                                                <p className="text-sm text-gray-600 italic">
                                                  "{quote.notes}"
                                                </p>
                                              </div>
                                            )}
                                            
                                            <button
                                              onClick={() => handleSelectVendor(rfq._id, quote.vendor, quote)}
                                              disabled={rfq.status === "closed"}
                                              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                                                rfq.status === "closed"
                                                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                  : isBestQuote
                                                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                                                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105'
                                              }`}
                                            >
                                              {rfq.status === "closed" ? (
                                                <>
                                                  <Shield size={16} />
                                                  Selected
                                                </>
                                              ) : isBestQuote ? (
                                                <>
                                                  <Crown size={16} />
                                                  Select Best Quote
                                                </>
                                              ) : (
                                                <>
                                                  <ThumbsUp size={16} />
                                                  Select Vendor
                                                </>
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>

                                {rfq.status === "open" && rfq.quotes.length > 1 && (
                                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                    <div className="flex items-start gap-3">
                                      <div className="p-2 bg-blue-500 rounded-lg">
                                        <Zap size={16} className="text-white" />
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-blue-900 mb-1">Selection Tip</h5>
                                        <p className="text-blue-800 text-sm">
                                          Consider not just the price, but also delivery time, vendor reputation, and any additional notes when making your selection. 
                                          The highlighted quote shows the lowest price, but other factors may be important for your decision.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}