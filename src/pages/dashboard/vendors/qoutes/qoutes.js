import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  FileText,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  User,
  DollarSign,
  Truck,
  Edit3,
  Send,
  X,
  Plus,
  Bell,
  Filter,
  Search,
  RefreshCw,
  Download,
  Building,
  Star,
  Award,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../../authcontext/authcontext";

export default function VendorRFQsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState([]);
  const [filteredRFQs, setFilteredRFQs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [price, setPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Log the token and user role when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (user) {
      console.log("User Role:", user.role);
      console.log("User Email:", user.email);
    }
  }, [user]);

  // Fetch all RFQs from the backend
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
          // Filter RFQs where the vendor's email matches
          const vendorRFQs = data.filter((rfq) =>
            rfq.vendors.some((vendor) => vendor.email === user?.email)
          );
          setFilteredRFQs(vendorRFQs);
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
  }, [user]);

  // Filter RFQs based on search term and status
  const displayedRFQs = filteredRFQs.filter((rfq) => {
    const matchesSearch = rfq.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRFQs = filteredRFQs?.length || 0;
  const openRFQs = filteredRFQs?.filter(rfq => rfq.status === "open")?.length || 0;
  const closedRFQs = filteredRFQs?.filter(rfq => rfq.status === "closed")?.length || 0;
  const submittedQuotes = filteredRFQs?.filter(rfq => 
    rfq.quotes?.some(quote => quote.vendorEmail === user?.email)
  )?.length || 0;

  // Handle RFQ selection to open the modal
  const handleSelectRFQ = (rfq) => {
    setSelectedRFQ(rfq);
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRFQ(null);
    setPrice("");
    setDeliveryTime("");
    setNotes("");
  };

  const handleSubmitQuote = async () => {
    if (!selectedRFQ) return;

    try {
      const token = localStorage.getItem("token");
      const userEmail = user?.email;
      console.log("Submitting quote for RFQ:", selectedRFQ._id);

      const response = await fetch(
        `${backendUrl}/api/rfqs/${selectedRFQ._id}/quote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            price: parseFloat(price),
            deliveryTime,
            notes,
          }),
        }
      );

      if (response.ok) {
        // Show success message
        setError(null);
        handleCloseModal();
        // Refresh the data
        window.location.reload();
      } else {
        const data = await response.json();
        console.log("Error Response from Backend:", data);
        setError(data.message || "Failed to submit quote.");
      }
    } catch (err) {
      console.error("Failed to submit quote:", err);
      setError("Failed to submit quote. Please check your network connection.");
    }
  };

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

  const hasSubmittedQuote = (rfq) => {
    return rfq.quotes?.some(quote => quote.vendorEmail === user?.email);
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
            Please wait while we fetch your available requests...
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
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
                    <MessageSquare size={32} />
                  </div>
                  Available RFQs
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  Submit quotes for procurement requests - {user?.name}
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
                <p className="text-gray-600 text-sm font-medium">Available RFQs</p>
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
                <p className="text-gray-600 text-sm font-medium">Open RFQs</p>
                <p className="text-2xl font-bold text-gray-900">{openRFQs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Award size={24} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {submittedQuotes}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Quotes Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{submittedQuotes}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Activity size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round((submittedQuotes / Math.max(totalRFQs, 1)) * 100)}%
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round((submittedQuotes / Math.max(totalRFQs, 1)) * 100)}%</p>
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
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

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
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm font-medium"
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
          {displayedRFQs.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <MessageSquare size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No RFQs match your filters" : "No RFQs available"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "There are currently no RFQs assigned to you. Check back later for new opportunities."
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-green-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-7 gap-4 items-center font-semibold text-gray-700 text-sm">
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
                    <User size={16} />
                    Procurement Officer
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Deadline
                  </div>
                  <div>Status</div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {displayedRFQs.map((rfq, index) => (
                  <motion.div
                    key={rfq._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-7 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <div>
                      <span className="font-bold text-green-600 group-hover:text-green-700 transition-colors duration-200">
                        {rfq._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <div className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
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
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User size={14} className="text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {rfq.procurementOfficer?.name || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-700">
                        {rfq.deadline ? formatDate(rfq.deadline) : "No deadline"}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(rfq.status)}`}>
                        {getStatusIcon(rfq.status)}
                        <span className="ml-2 capitalize">{rfq.status || "Unknown"}</span>
                      </span>
                    </div>

                    <div className="text-center">
                      {hasSubmittedQuote(rfq) ? (
                        <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                          <CheckCircle size={16} className="mr-2" />
                          Quote Submitted
                        </span>
                      ) : rfq.status === "open" ? (
                        <button
                          onClick={() => handleSelectRFQ(rfq)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                        >
                          <Send size={16} />
                          Submit Quote
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
                          <Shield size={16} className="mr-2" />
                          Closed
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Enhanced Submit Quote Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <MessageSquare size={24} className="text-green-500" />
                    Submit Quote
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Submit your quote for: <span className="font-semibold">{selectedRFQ?.itemName}</span>
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* RFQ Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={20} />
                    RFQ Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Item:</span>
                      <p className="font-semibold text-gray-900">{selectedRFQ?.itemName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <p className="font-semibold text-gray-900">{selectedRFQ?.quantity}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Procurement Officer:</span>
                      <p className="font-semibold text-gray-900">{selectedRFQ?.procurementOfficer?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedRFQ?.deadline ? formatDate(selectedRFQ.deadline) : "No deadline"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quote Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <DollarSign size={16} />
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter your price"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Truck size={16} />
                      Delivery Time *
                    </label>
                    <input
                      type="text"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      placeholder="e.g., 2 weeks, 10 business days"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Edit3 size={16} />
                      Additional Notes
                    </label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Include any additional information, terms, or conditions..."
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmitQuote}
                    disabled={!price || !deliveryTime}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Submit Quote
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}