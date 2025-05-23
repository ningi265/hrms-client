import { useState, useEffect } from "react";
import {
  FileText,
  DollarSign,
  Check,
  X,
  Eye,
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  Package,
  Building,
  Calendar,
  Activity,
  TrendingUp,
  AlertCircle,
  Clock,
  Plus,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { useNavigate } from "react-router-dom";

export default function InvoicesPage() {
  const { token, user, logout } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showMenuId, setShowMenuId] = useState(null);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/invoices`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch invoices");

        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        setError("Failed to fetch invoices. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [token, backendUrl]);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.po?.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalInvoices = invoices?.length || 0;
  const pendingInvoices = invoices?.filter(inv => inv.status === "pending")?.length || 0;
  const approvedInvoices = invoices?.filter(inv => inv.status === "approved")?.length || 0;
  const paidInvoices = invoices?.filter(inv => inv.status === "paid")?.length || 0;
  const totalAmount = invoices?.reduce((sum, inv) => sum + (inv.amountDue || 0), 0) || 0;

  const openDialog = (invoice, type) => {
    setSelectedInvoice(invoice);
    setActionType(type);
    setIsDialogOpen(true);
    setShowMenuId(null);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
    setActionType("");
  };

  const handleInvoiceAction = async () => {
    if (!selectedInvoice || !token) {
      showNotificationMessage("Invalid request. Please try again.", "error");
      return;
    }

    setIsProcessing(true);

    try {
      let url;
      let method = "POST";

      switch (actionType) {
        case "approve":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/approve`;
          break;
        case "reject":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/reject`;
          break;
        case "mark-as-paid":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/pay`;
          break;
        default:
          throw new Error("Invalid action type");
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid or expired token") {
          showNotificationMessage("Your session has expired. Please log in again.", "error");
          logout();
          return;
        }
        throw new Error(data.message || "Failed to perform action");
      }

      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === selectedInvoice._id ? data.invoice : invoice
        )
      );

      showNotificationMessage(`Invoice ${actionType.replace("-", " ")} successfully!`, "success");
      closeDialog();
    } catch (error) {
      showNotificationMessage(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayInvoice = (invoice) => {
    navigate("/invoices/pay", { state: { invoice } });
    setShowMenuId(null);
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-700 bg-green-50 border-green-200";
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200";
      case "paid":
        return "text-blue-700 bg-blue-50 border-blue-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Check size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "rejected":
        return <X size={14} />;
      case "paid":
        return <CreditCard size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Invoices</h2>
          <p className="text-gray-600">
            Please wait while we fetch invoice data...
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Invoices</h2>
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
                Invoice Management
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Review, approve, and process vendor invoices
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <FileText size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalInvoices}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
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
                  {pendingInvoices}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingInvoices}</p>
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
                  {approvedInvoices}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedInvoices}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <CreditCard size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {paidInvoices}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{paidInvoices}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <DollarSign size={24} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {formatCurrency(totalAmount).replace('$', '$')}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
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
                    placeholder="Search invoices..."
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
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="paid">Paid</option>
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

          {/* Invoices Content */}
          {filteredInvoices.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <FileText size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No invoices match your filters" : "No Invoices Found"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "Invoices will appear here when vendors submit them for processing."
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-6 gap-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    Invoice Number
                  </div>
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    PO Number
                  </div>
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    Vendor
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Amount Due
                  </div>
                  <div>Status</div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                {filteredInvoices.map((invoice, index) => (
                  <motion.div
                    key={invoice._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-6 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <div>
                      <span className="font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                        {invoice.invoiceNumber || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium text-gray-900">
                        {invoice.po?.poNumber || "N/A"}
                      </span>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {invoice.vendor?.name || "N/A"}
                      </div>
                      {invoice.vendor?.email && (
                        <div className="text-sm text-gray-500">
                          {invoice.vendor.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(invoice.amountDue)}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-2 capitalize">{invoice.status || "Unknown"}</span>
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="relative">
                        <button
                          onClick={() => setShowMenuId(showMenuId === invoice._id ? null : invoice._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {showMenuId === invoice._id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                            <div className="py-2">
                              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                                <Eye size={16} />
                                <span>View Details</span>
                              </button>
                              
                              {invoice.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => openDialog(invoice, "approve")}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-green-600 hover:bg-green-50 transition-colors duration-200"
                                  >
                                    <Check size={16} />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => openDialog(invoice, "reject")}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                                  >
                                    <X size={16} />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                              
                              {invoice.status === "approved" && (
                                <>
                                  <button
                                    onClick={() => handlePayInvoice(invoice)}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                  >
                                    <CreditCard size={16} />
                                    <span>Pay Invoice</span>
                                  </button>
                                  <button
                                    onClick={() => openDialog(invoice, "mark-as-paid")}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                                  >
                                    <Check size={16} />
                                    <span>Mark as Paid</span>
                                  </button>
                                </>
                              )}
                              
                              <div className="border-t border-gray-100 my-1"></div>
                              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                                <Download size={16} />
                                <span>Download PDF</span>
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

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  {actionType === "approve" && <Check size={24} className="text-green-500" />}
                  {actionType === "reject" && <X size={24} className="text-red-500" />}
                  {actionType === "mark-as-paid" && <CreditCard size={24} className="text-blue-500" />}
                  Confirm {actionType.replace("-", " ")}
                </h2>
                <button
                  onClick={closeDialog}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-gray-700 mb-6">
                Are you sure you want to {actionType.replace("-", " ")} invoice{" "}
                <span className="font-semibold text-gray-900">
                  {selectedInvoice?.invoiceNumber || "N/A"}
                </span>?
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeDialog}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvoiceAction}
                  disabled={isProcessing}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    actionType === "approve" 
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      : actionType === "reject"
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {actionType === "approve" && <Check size={20} />}
                      {actionType === "reject" && <X size={20} />}
                      {actionType === "mark-as-paid" && <CreditCard size={20} />}
                      Confirm
                    </>
                  )}
                </button>
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