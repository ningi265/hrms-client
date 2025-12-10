import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Receipt,
  CreditCard,
  Truck,
  User,
  Bell,
  Filter,
  Search,
  RefreshCw,
  Download,
  Send,
  X,
  Building,
  Hash,
  TrendingUp,
  Activity,
  Award,
  Zap,
  Eye,
  CheckSquare,
  FileCheck,
  Banknote,
  Calculator,
  Loader
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";

export default function VendorInvoiceSubmissionPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [vendorId, setVendorId] = useState(null);
  const [pos, setPos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
    const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

  

  // Fetch vendor details
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/vendors/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch vendor details");
        const data = await response.json();
        setVendorId(data._id);
      } catch (err) {
        console.error("❌ Error fetching vendor details:", err);
        setError("Could not fetch vendor details.");
      }
    };

    fetchVendorDetails();
  }, [token]);

  // Fetch purchase orders assigned to the vendor
  useEffect(() => {
    const fetchPOs = async () => {
      if (!vendorId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/purchase-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch purchase orders");
        const data = await response.json();

        // Filter POs assigned to the vendor
       const vendorPOs = (data.data || []).filter((po) => po.vendor?._id === vendorId);
        setPos(vendorPOs);
      } catch (err) {
        console.error("❌ Error fetching POs:", err);
        setError("Could not fetch purchase orders.");
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) fetchPOs();
  }, [vendorId, token]);

  // Filter POs based on search term and status
  const filteredPOs = pos.filter((po) => {
    const matchesSearch = po._id.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    
    if (statusFilter === "confirmed") {
      matchesStatus = po.vendorConfirmation?.confirmed;
    } else if (statusFilter === "pending") {
      matchesStatus = !po.vendorConfirmation?.confirmed;
    } else if (statusFilter === "invoiced") {
      matchesStatus = !!po.invoice;
    } else if (statusFilter === "not-invoiced") {
      matchesStatus = !po.invoice;
    }
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalPOs = pos?.length || 0;
  const confirmedPOs = pos?.filter(po => po.vendorConfirmation?.confirmed)?.length || 0;
  const deliveredPOs = pos?.filter(po => po.deliveryStatus === "delivered")?.length || 0;
  const invoicedPOs = pos?.filter(po => po.invoice)?.length || 0;
  const pendingInvoicePOs = pos?.filter(po => !po.invoice && po.vendorConfirmation?.confirmed)?.length || 0;
  const totalInvoiceValue = pos?.reduce((sum, po) => sum + (po.invoice ? po.totalAmount : 0), 0) || 0;

  // Generate a random 6-digit invoice number
  const generateInvoiceNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Open invoice submission modal
  const handleOpenInvoiceModal = (po) => {
    setSelectedPO(po);
    setInvoiceNumber(generateInvoiceNumber());
    setOpenInvoiceModal(true);
  };

  // Close invoice submission modal
  const handleCloseInvoiceModal = () => {
    setOpenInvoiceModal(false);
    setInvoiceNumber("");
    setSelectedPO(null);
    setError("");
  };

  // Submit invoice for a PO
  const handleSubmitInvoice = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/api/invoices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          poId: selectedPO._id,
          invoiceNumber,
          amountDue: selectedPO.totalAmount,
          vendorId: vendorId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit invoice");
      }

      const data = await response.json();

      // Update the state with the submitted invoice
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === selectedPO._id
            ? { ...po, invoice: data.invoice }
            : po
        )
      );

      setSuccessMessage(`Invoice ${invoiceNumber} submitted successfully!`);
      handleCloseInvoiceModal();
    } catch (err) {
      console.error("❌ Error submitting invoice:", err);
      setError(err.message || "Could not submit invoice.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-700 bg-green-50 border-green-200";
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "delivered":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "shipped":
        return "text-purple-700 bg-purple-50 border-purple-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "delivered":
        return <Package size={14} />;
      case "shipped":
        return <Truck size={14} />;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
        <Loader className="animate-spin w-6 h-6 text-blue-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
          <LoadingOverlay isVisible={isLoading} message="Loading Invoices..." />
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
                          <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  Invoice Submission
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  Submit invoices for your completed purchase orders
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <FileText size={18} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {totalPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Total POs</p>
                <p className="text-xl font-bold text-gray-900">{totalPOs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <CheckCircle size={18} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {confirmedPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Confirmed</p>
                <p className="text-xl font-bold text-gray-900">{confirmedPOs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Package size={18} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {deliveredPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Delivered</p>
                <p className="text-xl font-bold text-gray-900">{deliveredPOs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <Receipt size={18} className="text-white" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                  {invoicedPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Invoiced</p>
                <p className="text-xl font-bold text-gray-900">{invoicedPOs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                  <Clock size={18} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                  {pendingInvoicePOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Pending Invoice</p>
                <p className="text-xl font-bold text-gray-900">{pendingInvoicePOs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <DollarSign size={18} className="text-white" />
                </div>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                  ${(totalInvoiceValue / 1000).toFixed(0)}K
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Invoice Value</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(totalInvoiceValue)}</p>
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
                <button
                  onClick={() => setSuccessMessage("")}
                  className="ml-auto p-1 hover:bg-green-100 rounded"
                >
                  <X size={16} />
                </button>
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
                <button
                  onClick={() => setError("")}
                  className="ml-auto p-1 hover:bg-red-100 rounded"
                >
                  <X size={16} />
                </button>
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
                    placeholder="Search by PO number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="invoiced">Invoiced</option>
                    <option value="not-invoiced">Not Invoiced</option>
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

          {/* Purchase Orders Content */}
          {filteredPOs.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Receipt size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No purchase orders match your filters" : "No purchase orders available"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "There are currently no purchase orders available for invoicing."
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-emerald-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-6 gap-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash size={16} />
                    PO Number
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Status
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={16} />
                    Delivery Status
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Total Amount
                  </div>
                  <div className="flex items-center gap-2">
                    <Receipt size={16} />
                    Invoice Status
                  </div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredPOs.map((po, index) => (
                  <motion.div
                    key={po._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-6 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <div>
                      <span className="font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200">
                        {po._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(po.vendorConfirmation?.confirmed ? 'confirmed' : 'pending')}`}>
                        {getStatusIcon(po.vendorConfirmation?.confirmed ? 'confirmed' : 'pending')}
                        <span className="ml-2">
                          {po.vendorConfirmation?.confirmed ? "Confirmed" : "Pending"}
                        </span>
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(po.deliveryStatus || 'pending')}`}>
                        {getStatusIcon(po.deliveryStatus || 'pending')}
                        <span className="ml-2 capitalize">
                          {po.deliveryStatus || "Pending"}
                        </span>
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-gray-900 text-lg">
                        {formatCurrency(po.totalAmount)}
                      </span>
                    </div>

                    <div>
                      {po.invoice ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border text-green-700 bg-green-50 border-green-200">
                          <FileCheck size={14} />
                          <span className="ml-2">Submitted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border text-amber-700 bg-amber-50 border-amber-200">
                          <Clock size={14} />
                          <span className="ml-2">Pending</span>
                        </span>
                      )}
                    </div>

                    <div className="text-center">
                      {po.invoice ? (
                        <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                          <CheckCircle size={16} className="mr-2" />
                          Invoice Submitted
                        </span>
                      ) : po.vendorConfirmation?.confirmed ? (
                        <button
                          onClick={() => handleOpenInvoiceModal(po)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                        >
                          <Send size={16} />
                          Submit Invoice
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
                          <Clock size={16} className="mr-2" />
                          Awaiting Confirmation
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

      {/* Enhanced Invoice Submission Modal */}
      {openInvoiceModal && selectedPO && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Receipt size={24} className="text-emerald-500" />
                    Submit Invoice
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Create invoice for PO: <span className="font-semibold">{selectedPO._id.slice(-8).toUpperCase()}</span>
                  </p>
                </div>
                <button
                  onClick={handleCloseInvoiceModal}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* PO Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Purchase Order Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">PO Number:</span>
                      <p className="font-semibold text-gray-900">{selectedPO._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Amount:</span>
                      <p className="font-semibold text-gray-900">{formatCurrency(selectedPO.totalAmount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Confirmation Status:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedPO.vendorConfirmation?.confirmed ? "Confirmed" : "Pending"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Delivery Status:</span>
                      <p className="font-semibold text-gray-900 capitalize">
                        {selectedPO.deliveryStatus || "Pending"}
                      </p>
                    </div>
                    {selectedPO.createdAt && (
                      <div>
                        <span className="text-gray-500">PO Date:</span>
                        <p className="font-semibold text-gray-900">{formatDate(selectedPO.createdAt)}</p>
                      </div>
                    )}
                    {selectedPO.trackingNumber && (
                      <div>
                        <span className="text-gray-500">Tracking Number:</span>
                        <p className="font-semibold text-gray-900">{selectedPO.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoice Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Hash size={16} />
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      readOnly
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-mono"
                    />
                    <p className="text-sm text-gray-500 mt-2">Auto-generated invoice number</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <DollarSign size={16} />
                      Invoice Amount
                    </label>
                    <input
                      type="text"
                      value={formatCurrency(selectedPO.totalAmount)}
                      readOnly
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-mono text-lg font-bold"
                    />
                    <p className="text-sm text-gray-500 mt-2">Amount matches the purchase order total</p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-500 rounded-lg">
                        <Banknote size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-900 mb-1">Invoice Information</h4>
                        <p className="text-emerald-800 text-sm">
                          This invoice will be automatically submitted to the finance department for processing. 
                          You will receive payment according to the agreed terms once the invoice is approved.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Summary */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calculator size={20} />
                      Invoice Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(selectedPO.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Tax (if applicable):</span>
                        <span className="font-semibold text-gray-900">$0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-emerald-50 px-4 rounded-lg">
                        <span className="text-emerald-900 font-semibold text-lg">Total Amount Due:</span>
                        <span className="font-bold text-emerald-900 text-xl">{formatCurrency(selectedPO.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmitInvoice}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Submit Invoice
                  </button>
                  <button
                    onClick={handleCloseInvoiceModal}
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