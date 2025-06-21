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
  MessageSquare,
  Activity,
  Shield,
  TrendingUp,
  TrendingDown,
  Save
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
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

// Purchase Order Card Component (styled like vendor cards)
const PurchaseOrderCard = ({ po, onMenuClick, showMenuId, onApprove, onReject, actionLoading }) => {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const vendorName = po.vendor ? `${po.vendor.lastName || ""} ${po.vendor.firstName || ""}`.trim() : "N/A";
  const poNumber = po._id?.slice(-8) || "N/A";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              PO-{poNumber}
            </h4>
            <p className="text-sm text-gray-500">{vendorName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(po.status)}`}>
            {getStatusIcon(po.status)}
            {po.status}
          </span>
          <button
            data-po-id={po._id}
            onClick={() => onMenuClick(po._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            {po.totalAmount?.toFixed(0) || 0}
          </div>
          <div className="text-xs text-gray-500">Amount (MWK)</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <Truck className="w-4 h-4 text-blue-500" />
            {po.deliveryStatus || "Pending"}
          </div>
          <div className="text-xs text-gray-500">Delivery</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Created</span>
          <span className="text-xs font-medium">
            {formatDate(po.createdAt)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Vendor Email</span>
          <span className="text-xs font-medium truncate">{po.vendor?.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Items</span>
          <span className="text-xs font-medium">{po.items?.length || 0}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Delivery Status</div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getDeliveryStatusColor(po.deliveryStatus)}`}>
          {getDeliveryStatusIcon(po.deliveryStatus)}
          {po.deliveryStatus || "Pending"}
        </span>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            Status: {po.status || "Unknown"}
          </span>
        </div>
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Edit size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

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
          <DotLottieReact src="loading.lottie" loop autoplay />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Purchase Orders</h2>
          <p className="text-gray-600">Please wait while we fetch purchase order data...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Order tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Approval rate: {totalPOs > 0 ? Math.round((approvedPOs / totalPOs) * 100) : 0}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search purchase orders..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
              onClick={openCreatePOModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              New PO
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total POs" 
            value={totalPOs}
            icon={ShoppingCart} 
            color="blue" 
            subtitle="All orders"
          />
          <MetricCard 
            title="Approved" 
            value={approvedPOs}
            icon={Check} 
            color="green" 
            trend={15}
            subtitle="Ready to ship"
          />
          <MetricCard 
            title="Pending" 
            value={pendingPOs}
            icon={Package} 
            color="amber" 
            subtitle="Awaiting approval"
          />
          <MetricCard 
            title="Total Amount" 
            value={totalAmount.toFixed(0)}
            prefix="MWK "
            icon={DollarSign} 
            color="purple" 
            trend={8}
            subtitle="Order value"
          />
        </div>

        {/* Purchase Order Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Purchase Orders</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredPurchaseOrders.length} of {totalPOs} orders</span>
            </div>
          </div>

          {filteredPurchaseOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No purchase orders match your filters" : "No Purchase Orders"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Start by creating your first purchase order from an approved RFQ."}
              </p>
              <button
                onClick={openCreatePOModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Create PO
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPurchaseOrders.map((po) => (
                <PurchaseOrderCard
                  key={po._id}
                  po={po}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onApprove={handleApprovePO}
                  onReject={handleRejectPO}
                  actionLoading={actionLoading}
                />
              ))}
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
                const button = document.querySelector(`[data-po-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 500;
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
                const button = document.querySelector(`[data-po-id="${showMenuId}"]`);
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
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Edit size={16} />
                <span>Edit PO</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Truck size={16} />
                <span>Track Delivery</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Send size={16} />
                <span>Send to Vendor</span>
              </button>
              
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
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              
              <button
                onClick={() => copyToClipboard(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Copy size={16} />
                <span>Copy PO Number</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <History size={16} />
                <span>View History</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <MessageSquare size={16} />
                <span>Message Vendor</span>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200">
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
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select RFQ *</label>
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
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
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
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePO}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                >
                  <Save size={20} />
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
    </div>
  )
}