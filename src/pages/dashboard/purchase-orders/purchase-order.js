"use client"

import { useState, useEffect } from "react"
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
  ShoppingCart,
  Users,
  Target,
  Edit,
  Send,
  Copy,
  History,
  Ban,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function PurchaseOrdersPage() {
  const { token } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMenuId, setShowMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
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
        const token = localStorage.getItem("token")
        const poResponse = await fetch(`${backendUrl}/api/purchase-orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!poResponse.ok) throw new Error("Failed to fetch purchase orders")
        const poData = await poResponse.json()
        setPurchaseOrders(poData)

        const rfqResponse = await fetch(`${backendUrl}/api/rfqs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!rfqResponse.ok) throw new Error("Failed to fetch RFQs")
        const rfqData = await rfqResponse.json()
        setRfqs(rfqData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token, backendUrl])

  // Filter purchase orders
  const filteredPurchaseOrders = purchaseOrders
    .filter((po) => {
      if (statusFilter === "all") return true
      return po.status === statusFilter
    })
    .filter((po) => {
      return (
        po._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false
      )
    })

  // Calculate stats
  const totalPOs = purchaseOrders?.length || 0
  const approvedPOs = purchaseOrders?.filter((po) => po.status === "approved")?.length || 0
  const pendingPOs = purchaseOrders?.filter((po) => po.status === "pending")?.length || 0
  const totalAmount = purchaseOrders?.reduce((sum, po) => sum + (po.totalAmount || 0), 0) || 0

  const openCreatePOModal = () => {
    setIsCreatePOModalOpen(true)
  }

  const closeCreatePOModal = () => {
    setIsCreatePOModalOpen(false)
    setSelectedRfqId("")
    setSelectedQuote(null)
  }

  const handleRfqSelection = (rfqId) => {
    setSelectedRfqId(rfqId)
    const rfq = rfqs.find((rfq) => rfq._id === rfqId)
    if (rfq && rfq.selectedVendor) {
      const selectedQuote = rfq.quotes.find((quote) => quote.vendor === rfq.selectedVendor)
      setSelectedQuote(selectedQuote)
    }
  }

  const handleCreatePO = async () => {
    if (!selectedRfqId || !selectedQuote) {
      showNotificationMessage("Please select an RFQ and ensure a quote is selected.", "error")
      return
    }

    const rfq = rfqs.find((rfq) => rfq._id === selectedRfqId)
    if (!rfq) {
      showNotificationMessage("RFQ not found.", "error")
      return
    }

    const items = [
      {
        itemName: rfq.itemName,
        product: rfq.itemName,
        quantity: rfq.quantity,
        price: selectedQuote.price,
      },
    ]

    try {
      const token = localStorage.getItem("token")
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
      })
      const data = await response.json()
      if (response.ok) {
        showNotificationMessage("Purchase Order created successfully!", "success")
        setPurchaseOrders([...purchaseOrders, data.po])
        closeCreatePOModal()
      } else {
        throw new Error(data.message || "Failed to create PO")
      }
    } catch (error) {
      console.error("Error creating PO:", error)
      showNotificationMessage(error.message, "error")
    }
  }

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotificationMessage("PO Number copied to clipboard!", "success");
    setShowMenuId(null);
  };

  const handleApprovePO = async (poId) => {
    setActionLoading(poId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPurchaseOrders(prev => prev.map(po => 
        po._id === poId ? { ...po, status: "approved" } : po
      ));
      showNotificationMessage("Purchase Order approved successfully!", "success");
    } catch (error) {
      showNotificationMessage("Failed to approve purchase order", "error");
      console.error("Failed to approve PO:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const handleRejectPO = async (poId) => {
    setActionLoading(poId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPurchaseOrders(prev => prev.map(po => 
        po._id === poId ? { ...po, status: "rejected" } : po
      ));
      showNotificationMessage("Purchase Order rejected successfully!", "success");
    } catch (error) {
      showNotificationMessage("Failed to reject purchase order", "error");
      console.error("Failed to reject PO:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-700 bg-green-50 border-green-200"
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Check size={14} />
      case "pending":
        return <Package size={14} />
      case "rejected":
        return <X size={14} />
      default:
        return <Package size={14} />
    }
  }

  const getDeliveryStatusColor = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "delivered":
        return "text-green-700 bg-green-50 border-green-200"
      case "shipped":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "confirmed":
        return "text-purple-700 bg-purple-50 border-purple-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getDeliveryStatusIcon = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "delivered":
        return <Check size={14} />
      case "shipped":
        return <Truck size={14} />
      case "confirmed":
        return <FileText size={14} />
      default:
        return <Package size={14} />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <DotLottieReact src="loading.lottie" loop autoplay />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Purchase Orders</h2>
          <p className="text-gray-600">Please wait while we fetch purchase order data...</p>
        </motion.div>
      </div>
    )
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
                  <ShoppingCart size={24} />
                </div>
                Purchase Orders
              </h1>
              <p className="text-gray-500 mt-1">Manage and track your purchase orders efficiently</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={openCreatePOModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                New PO
              </button>
              <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <Bell size={20} />
              </button>
              <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ShoppingCart size={20} className="text-blue-600" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">{totalPOs}</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total POs</p>
                <p className="text-xl font-bold text-gray-900">{totalPOs}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Check size={20} className="text-green-600" />
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {approvedPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <p className="text-xl font-bold text-gray-900">{approvedPOs}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Package size={20} className="text-amber-600" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                  {pendingPOs}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-xl font-bold text-gray-900">{pendingPOs}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <DollarSign size={20} className="text-purple-600" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                  MWK {totalAmount.toFixed(0)}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">{totalAmount.toLocaleString()}</p>
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
                    placeholder="Search purchase orders..."
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
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
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

          {/* Purchase Orders Content */}
          {filteredPurchaseOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart size={40} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all"
                      ? "No purchase orders match your filters"
                      : "No Purchase Orders"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "Start by creating your first purchase order from an approved RFQ."}
                  </p>
                </div>
                <button
                  onClick={openCreatePOModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create First PO
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="grid grid-cols-7 gap-4 items-center font-medium text-gray-700 text-sm">
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
                  <div
                    key={po._id}
                    className="grid grid-cols-7 gap-4 items-center px-4 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-blue-600">
                        {po._id?.slice(-8) || "N/A"}
                      </span>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900">
                        {po.vendor ? `${po.vendor.lastName || ""} ${po.vendor.firstName || ""}`.trim() : "N/A"}
                      </div>

                      {po.vendor?.email && <div className="text-sm text-gray-500">{po.vendor.email}</div>}
                    </div>

                    <div>
                      <span className="text-gray-700">{formatDate(po.createdAt)}</span>
                    </div>

                    <div>
                      <span className="font-medium text-gray-900">MWK {po.totalAmount?.toFixed(2) || "0.00"}</span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(po.status)}`}
                      >
                        {getStatusIcon(po.status)}
                        <span className="ml-2 capitalize">{po.status || "Unknown"}</span>
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border ${getDeliveryStatusColor(po.deliveryStatus)}`}
                      >
                        {getDeliveryStatusIcon(po.deliveryStatus)}
                        <span className="ml-2 capitalize">{po.deliveryStatus || "Pending"}</span>
                      </span>
                    </div>

                    <div className="text-center">
                      <button
                        data-po-id={po._id}
                        onClick={() => setShowMenuId(showMenuId === po._id ? null : po._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
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
                const button = document.querySelector(`[data-po-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 500; // Approximate menu height
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
                const button = document.querySelector(`[data-po-id="${showMenuId}"]`);
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
              <button
                onClick={() => {
                  // Handle view details action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
              
              {/* Edit PO */}
              <button
                onClick={() => {
                  // Handle edit action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Edit size={16} />
                <span>Edit PO</span>
              </button>
              
              {/* Track Delivery */}
              <button
                onClick={() => {
                  // Handle track delivery action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Truck size={16} />
                <span>Track Delivery</span>
              </button>
              
              {/* Send to Vendor */}
              <button
                onClick={() => {
                  // Handle send to vendor action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Send size={16} />
                <span>Send to Vendor</span>
              </button>
              
              {/* Conditional Approve/Reject for pending POs */}
              {(() => {
                const po = purchaseOrders.find(po => po._id === showMenuId);
                return po?.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprovePO(showMenuId)}
                      disabled={actionLoading === showMenuId}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-green-600 hover:bg-green-50 transition-colors text-left disabled:opacity-50"
                    >
                      <Check size={16} />
                      <span>Approve PO</span>
                      {actionLoading === showMenuId && (
                        <div className="ml-auto">
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectPO(showMenuId)}
                      disabled={actionLoading === showMenuId}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
                    >
                      <X size={16} />
                      <span>Reject PO</span>
                      {actionLoading === showMenuId && (
                        <div className="ml-auto">
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>
                  </>
                );
              })()}
              
              {/* Download PDF */}
              <button
                onClick={() => {
                  // Handle download PDF action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              
              {/* Copy PO Number */}
              <button
                onClick={() => copyToClipboard(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Copy size={16} />
                <span>Copy PO Number</span>
              </button>
              
              {/* View History */}
              <button
                onClick={() => {
                  // Handle view history action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <History size={16} />
                <span>View History</span>
              </button>
              
              {/* Send Message */}
              <button
                onClick={() => {
                  // Handle send message action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <MessageSquare size={16} />
                <span>Message Vendor</span>
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
              
              {/* Cancel PO */}
              <button
                onClick={() => {
                  // Handle cancel PO action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <Ban size={16} />
                <span>Cancel PO</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create PO Modal */}
      {isCreatePOModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <Plus size={20} className="text-blue-500" />
                    Create New Purchase Order
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Select an RFQ to create a purchase order</p>
                </div>
                <button
                  onClick={closeCreatePOModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select RFQ *</label>
                  <select
                    value={selectedRfqId}
                    onChange={(e) => handleRfqSelection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
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
                        <p className="text-gray-900 font-semibold">MWK {selectedQuote.price?.toFixed(2) || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Delivery Time</p>
                        <p className="text-gray-900 font-semibold">{selectedQuote.deliveryTime || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Notes</p>
                        <p className="text-gray-900 font-semibold">{selectedQuote.notes || "None"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={closeCreatePOModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePO}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Create PO
                </button>
              </div>
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
  )
}