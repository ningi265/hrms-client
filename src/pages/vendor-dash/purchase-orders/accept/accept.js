import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  FileText,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  DollarSign,
  User,
  Calendar,
  MapPin,
  Eye,
  Send,
  X,
  Bell,
  Filter,
  Search,
  RefreshCw,
  Download,
  Building,
  Star,
  Award,
  TrendingUp,
  Activity,
  Hash,
  CreditCard,
  PackageCheck,
  Zap,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../../authcontext/authcontext";

// Utility function to generate a tracking number (2 letters + 4 digits)
const generateTrackingNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";

  let trackingNumber = "";

  // Generate 2 random letters
  for (let i = 0; i < 2; i++) {
    trackingNumber += letters[Math.floor(Math.random() * letters.length)];
  }

  // Generate 4 random digits
  for (let i = 0; i < 4; i++) {
    trackingNumber += digits[Math.floor(Math.random() * digits.length)];
  }

  return trackingNumber;
};

export default function VendorPODetailsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [vendorId, setVendorId] = useState(null);
  const [pos, setPos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

  // Fetch purchase orders for the vendor
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

        const vendorPOs = data.filter((po) => po.vendor?._id === vendorId);
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
    } else if (statusFilter === "shipped") {
      matchesStatus = po.deliveryStatus === "shipped";
    } else if (statusFilter === "delivered") {
      matchesStatus = po.deliveryStatus === "delivered";
    }
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalPOs = pos?.length || 0;
  const confirmedPOs = pos?.filter(po => po.vendorConfirmation?.confirmed)?.length || 0;
  const pendingPOs = pos?.filter(po => !po.vendorConfirmation?.confirmed)?.length || 0;
  const shippedPOs = pos?.filter(po => po.deliveryStatus === "shipped")?.length || 0;
  const deliveredPOs = pos?.filter(po => po.deliveryStatus === "delivered")?.length || 0;
  const totalValue = pos?.reduce((sum, po) => sum + (po.totalAmount || 0), 0) || 0;

  // Confirm a purchase order
  const handleConfirmPO = async (poId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendUrl}/api/purchase-orders/${poId}/vendor/confirm`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendorId }),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to confirm purchase order. Status: ${response.status}`);

      // Update the state with the confirmed PO
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === poId
            ? { ...po, vendorConfirmation: { confirmed: true } }
            : po
        )
      );
      
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("❌ Error confirming PO:", err);
      setError("Could not confirm purchase order.");
    }
  };

  // Open the modal for updating delivery status
  const handleOpenModal = (po) => {
    setSelectedPO(po);
    setTrackingNumber(generateTrackingNumber());
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setTrackingNumber("");
    setCarrier("");
    setSelectedPO(null);
  };

  // Update delivery status (shipped or delivered)
  const handleUpdateDeliveryStatus = async (status) => {
    try {
      if (!selectedPO || !trackingNumber || !carrier) {
        throw new Error("Missing required data.");
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendUrl}/api/purchase-orders/${selectedPO._id}/delivery-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deliveryStatus: status,
            trackingNumber,
            carrier,
            token,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update delivery status. Status: ${response.status}. Message: ${errorData.message}`
        );
      }

      // Update the state with the updated PO
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === selectedPO._id
            ? { ...po, deliveryStatus: status, trackingNumber, carrier }
            : po
        )
      );

      handleCloseModal();
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("❌ Error updating delivery status:", err);
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-700 bg-green-50 border-green-200";
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "shipped":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "delivered":
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
      case "shipped":
        return <Truck size={14} />;
      case "delivered":
        return <PackageCheck size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "shipped":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "delivered":
        return "text-green-700 bg-green-50 border-green-200";
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
            Please wait while we fetch your assigned orders...
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
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
                    <Package size={32} />
                  </div>
                  Purchase Orders
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  Manage your assigned purchase orders and delivery tracking
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
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                  <Clock size={18} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                  {pendingPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Pending</p>
                <p className="text-xl font-bold text-gray-900">{pendingPOs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Truck size={18} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {shippedPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Shipped</p>
                <p className="text-xl font-bold text-gray-900">{shippedPOs}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <PackageCheck size={18} className="text-white" />
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
                  <DollarSign size={18} className="text-white" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                  ${(totalValue / 1000).toFixed(0)}K
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">Total Value</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(totalValue)}</p>
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
                    placeholder="Search by PO number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
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
                  <Package size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No purchase orders match your filters" : "No purchase orders available"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "There are currently no purchase orders assigned to you. Check back later for new orders."
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-orange-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-6 gap-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash size={16} />
                    PO Number
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Confirmation Status
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
                    <Calendar size={16} />
                    Created Date
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
                      <span className="font-bold text-orange-600 group-hover:text-orange-700 transition-colors duration-200">
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDeliveryStatusColor(po.deliveryStatus || 'pending')}`}>
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
                      <span className="text-gray-700">
                        {po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!po.vendorConfirmation?.confirmed ? (
                          <button
                            onClick={() => handleConfirmPO(po._id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Confirm
                          </button>
                        ) : po.deliveryStatus !== "delivered" ? (
                          <button
                            onClick={() => handleOpenModal(po)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                          >
                            <Truck size={16} />
                            {po.deliveryStatus === "shipped" ? "Mark Delivered" : "Mark Shipped"}
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                            <PackageCheck size={16} className="mr-2" />
                            Completed
                          </span>
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

      {/* Enhanced Delivery Status Update Modal */}
      {openModal && selectedPO && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Truck size={24} className="text-blue-500" />
                    Update Delivery Status
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Update delivery information for PO: <span className="font-semibold">{selectedPO._id.slice(-8).toUpperCase()}</span>
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
                      <span className="text-gray-500">Current Status:</span>
                      <p className="font-semibold text-gray-900 capitalize">{selectedPO.deliveryStatus || "Pending"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Vendor Status:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedPO.vendorConfirmation?.confirmed ? "Confirmed" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Hash size={16} />
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      readOnly
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-mono"
                    />
                    <p className="text-sm text-gray-500 mt-2">Auto-generated tracking number</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Building size={16} />
                      Carrier / Shipping Company *
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g., FedEx, UPS, DHL, USPS"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Zap size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Next Action</h4>
                        <p className="text-blue-800 text-sm">
                          {selectedPO.deliveryStatus === "shipped" 
                            ? "Mark this order as delivered once it reaches the customer."
                            : "Mark this order as shipped once it's dispatched from your facility."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() =>
                      handleUpdateDeliveryStatus(
                        selectedPO.deliveryStatus === "shipped" ? "delivered" : "shipped"
                      )
                    }
                    disabled={!carrier}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {selectedPO.deliveryStatus === "shipped" ? (
                      <>
                        <PackageCheck size={20} />
                        Mark as Delivered
                      </>
                    ) : (
                      <>
                        <Truck size={20} />
                        Mark as Shipped
                      </>
                    )}
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