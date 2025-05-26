import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Check,
  X,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  Package,
  FileText,
  DollarSign,
  Truck,
  Calendar,
  Building,
  Activity,
  TrendingUp,
  ShoppingCart,
  Users,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";

export default function PurchaseOrdersPage() {
  const { token } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMenuId, setShowMenuId] = useState(null);
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const poResponse = await fetch(`${backendUrl}/api/purchase-orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!poResponse.ok) throw new Error("Failed to fetch purchase orders");
        const poData = await poResponse.json();
        setPurchaseOrders(poData);

        const rfqResponse = await fetch(`${backendUrl}/api/rfqs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!rfqResponse.ok) throw new Error("Failed to fetch RFQs");
        const rfqData = await rfqResponse.json();
        setRfqs(rfqData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, backendUrl]);

  // Filter purchase orders
  const filteredPurchaseOrders = purchaseOrders
    .filter((po) => {
      if (statusFilter === "all") return true;
      return po.status === statusFilter;
    })
    .filter((po) => {
      return (
        po._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
      );
    });

  // Calculate stats
  const totalPOs = purchaseOrders?.length || 0;
  const approvedPOs = purchaseOrders?.filter(po => po.status === "approved")?.length || 0;
  const pendingPOs = purchaseOrders?.filter(po => po.status === "pending")?.length || 0;
  const totalAmount = purchaseOrders?.reduce((sum, po) => sum + (po.totalAmount || 0), 0) || 0;

  const openCreatePOModal = () => {
    setIsCreatePOModalOpen(true);
  };

  const closeCreatePOModal = () => {
    setIsCreatePOModalOpen(false);
    setSelectedRfqId("");
    setSelectedQuote(null);
  };

  const handleRfqSelection = (rfqId) => {
    setSelectedRfqId(rfqId);
    const rfq = rfqs.find((rfq) => rfq._id === rfqId);
    if (rfq && rfq.selectedVendor) {
      const selectedQuote = rfq.quotes.find((quote) => quote.vendor === rfq.selectedVendor);
      setSelectedQuote(selectedQuote);
    }
  };

  const handleCreatePO = async () => {
    if (!selectedRfqId || !selectedQuote) {
      showNotificationMessage("Please select an RFQ and ensure a quote is selected.", "error");
      return;
    }

    const rfq = rfqs.find((rfq) => rfq._id === selectedRfqId);
    if (!rfq) {
      showNotificationMessage("RFQ not found.", "error");
      return;
    }

    const items = [
      {
        itemName: rfq.itemName,
        product: rfq.itemName,
        quantity: rfq.quantity,
        price: selectedQuote.price,
      },
    ];

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/purchase-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rfqId: selectedRfqId,
          items,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotificationMessage("Purchase Order created successfully!", "success");
        setPurchaseOrders([...purchaseOrders, data.po]);
        closeCreatePOModal();
      } else {
        throw new Error(data.message || "Failed to create PO");
      }
    } catch (error) {
      console.error("Error creating PO:", error);
      showNotificationMessage(error.message, "error");
    }
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
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Check size={14} />;
      case "pending":
        return <Package size={14} />;
      case "rejected":
        return <X size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  const getDeliveryStatusColor = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "delivered":
        return "text-green-700 bg-green-50 border-green-200";
      case "shipped":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "confirmed":
        return "text-purple-700 bg-purple-50 border-purple-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getDeliveryStatusIcon = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "delivered":
        return <Check size={14} />;
      case "shipped":
        return <Truck size={14} />;
      case "confirmed":
        return <FileText size={14} />;
      default:
        return <Package size={14} />;
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Purchase Orders</h2>
          <p className="text-gray-600">
            Please wait while we fetch purchase order data...
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
                  <ShoppingCart size={32} />
                </div>
                Purchase Orders
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Manage and track your purchase orders efficiently
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={openCreatePOModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                New PO
              </button>
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
                  <ShoppingCart size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total POs</p>
                <p className="text-2xl font-bold text-gray-900">{totalPOs}</p>
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
                  {approvedPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedPOs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Package size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {pendingPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPOs}</p>
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
                  MWK {totalAmount.toFixed(0)}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{totalAmount.toLocaleString()}</p>
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
                    placeholder="Search purchase orders..."
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
          {filteredPurchaseOrders.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <ShoppingCart size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No purchase orders match your filters" : "No Purchase Orders"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "Start by creating your first purchase order from an approved RFQ."
                    }
                  </p>
                </div>
                <button
                  onClick={openCreatePOModal}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create First PO
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-7 gap-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    PO Number
                  </div>
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    Vendor
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Date
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Amount
                  </div>
                  <div>Status</div>
                  <div className="flex items-center gap-2">
                    <Truck size={16} />
                    Delivery Status
                  </div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                {filteredPurchaseOrders.map((po, index) => (
                  <motion.div
                    key={po._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-7 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <div>
                      <span className="font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                        {po._id?.slice(-8) || "N/A"}
                      </span>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {po.vendor?.name || "N/A"}
                      </div>
                      {po.vendor?.email && (
                        <div className="text-sm text-gray-500">
                          {po.vendor.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-gray-700">
                        {formatDate(po.createdAt)}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-900">
                        MWK {po.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(po.status)}`}>
                        {getStatusIcon(po.status)}
                        <span className="ml-2 capitalize">{po.status || "Unknown"}</span>
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDeliveryStatusColor(po.deliveryStatus)}`}>
                        {getDeliveryStatusIcon(po.deliveryStatus)}
                        <span className="ml-2 capitalize">{po.deliveryStatus || "Pending"}</span>
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="relative">
                        <button
                          onClick={() => setShowMenuId(showMenuId === po._id ? null : po._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {showMenuId === po._id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                            <div className="py-2">
                              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                                <Eye size={16} />
                                <span>View Details</span>
                              </button>
                              {po.status === "pending" && (
                                <>
                                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-green-600 hover:bg-green-50 transition-colors duration-200">
                                    <Check size={16} />
                                    <span>Approve</span>
                                  </button>
                                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200">
                                    <X size={16} />
                                    <span>Reject</span>
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

      {/* Create PO Modal */}
      {isCreatePOModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Plus size={24} className="text-blue-500" />
                    Create New Purchase Order
                  </h2>
                  <p className="text-gray-600 mt-1">Select an RFQ to create a purchase order</p>
                </div>
                <button
                  onClick={closeCreatePOModal}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select RFQ *
                  </label>
                  <select
                    value={selectedRfqId}
                    onChange={(e) => handleRfqSelection(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose an RFQ...</option>
                    {rfqs.map((rfq) => (
                      <option key={rfq._id} value={rfq._id}>
                        {rfq.itemName} (Qty: {rfq.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedQuote && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-blue-500" />
                      Selected Quote Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vendor</p>
                        <p className="text-gray-900 font-semibold">
                          {rfqs.find((rfq) => rfq._id === selectedRfqId)?.selectedVendor || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Price</p>
                        <p className="text-gray-900 font-semibold">
                          MWK {selectedQuote.price?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Delivery Time</p>
                        <p className="text-gray-900 font-semibold">
                          {selectedQuote.deliveryTime || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Notes</p>
                        <p className="text-gray-900 font-semibold">
                          {selectedQuote.notes || "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                <button
                  onClick={closeCreatePOModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePO}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Create PO
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