"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Package,
  FileText,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Eye,
  X,
  Bell,
  Search,
  RefreshCw,
  Download,
  Building,
  Hash,
  PackageCheck,
  Zap,
  Loader
} from "lucide-react"

// Utility function to generate a tracking number (2 letters + 4 digits)
const generateTrackingNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const digits = "0123456789"

  let trackingNumber = ""

  // Generate 2 random letters
  for (let i = 0; i < 2; i++) {
    trackingNumber += letters[Math.floor(Math.random() * letters.length)]
  }

  // Generate 4 random digits
  for (let i = 0; i < 4; i++) {
    trackingNumber += digits[Math.floor(Math.random() * digits.length)]
  }

  return trackingNumber
}

// Compact Metric Card Component (similar to employee.jsx)
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div
          className={`p-2 rounded-xl ${
            color === "blue"
              ? "bg-blue-50"
              : color === "green"
                ? "bg-emerald-50"
                : color === "purple"
                  ? "bg-purple-50"
                  : color === "orange"
                    ? "bg-orange-50"
                    : color === "red"
                      ? "bg-red-50"
                      : "bg-gray-50"
          }`}
        >
          <Icon
            size={16}
            className={
              color === "blue"
                ? "text-blue-600"
                : color === "green"
                  ? "text-emerald-600"
                  : color === "purple"
                    ? "text-purple-600"
                    : color === "orange"
                      ? "text-orange-600"
                      : color === "red"
                        ? "text-red-600"
                        : "text-gray-600"
            }
          />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <div className="text-xl font-bold text-gray-900 mb-1">
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  )
}

// Compact PO Card Component
const POCard = ({ po, onConfirm, onUpdateDelivery, isLoading }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle size={14} />
      case "pending":
        return <Clock size={14} />
      case "shipped":
        return <Truck size={14} />
      case "delivered":
        return <PackageCheck size={14} />
      default:
        return <AlertCircle size={14} />
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-50 rounded-xl">
            <Package className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">PO #{po._id.slice(-8).toUpperCase()}</h4>
            <p className="text-xs text-gray-500">
              {po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{formatCurrency(po.totalAmount)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded-xl">
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.vendorConfirmation?.confirmed ? "confirmed" : "pending")}`}
          >
            {getStatusIcon(po.vendorConfirmation?.confirmed ? "confirmed" : "pending")}
            <span className="ml-1">{po.vendorConfirmation?.confirmed ? "Confirmed" : "Pending"}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Confirmation</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-xl">
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.deliveryStatus || "pending")}`}
          >
            {getStatusIcon(po.deliveryStatus || "pending")}
            <span className="ml-1 capitalize">{po.deliveryStatus || "Pending"}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Delivery</div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-xl transition-colors">
            <Eye size={14} />
          </button>
        </div>
        <div className="flex gap-2">
          {!po.vendorConfirmation?.confirmed ? (
            <button
              onClick={() => onConfirm(po._id)}
              disabled={isLoading === po._id}
              className="px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium text-xs flex items-center gap-1 disabled:opacity-50"
            >
              {isLoading === po._id ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle size={14} />
              )}
              Confirm
            </button>
          ) : po.deliveryStatus !== "delivered" ? (
            <button
              onClick={() => onUpdateDelivery(po)}
              className="px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium text-xs flex items-center gap-1"
            >
              <Truck size={14} />
              {po.deliveryStatus === "shipped" ? "Deliver" : "Ship"}
            </button>
          ) : (
            <span className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-xl text-xs font-medium">
              <PackageCheck size={14} className="mr-1" />
              Complete
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VendorPODetailsPage() {
  const navigate = useNavigate()
  const [vendorId, setVendorId] = useState(null)
  const [pos, setPos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [selectedPO, setSelectedPO] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState(null)

  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV

  // Fetch vendor details
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/vendors/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Failed to fetch vendor details")
        const data = await response.json()
        setVendorId(data._id)
      } catch (err) {
        console.error("❌ Error fetching vendor details:", err)
        setError("Could not fetch vendor details.")
      }
    }

    fetchVendorDetails()
  }, [backendUrl])

  // Fetch purchase orders for the vendor
  useEffect(() => {
    const fetchPOs = async () => {
      if (!vendorId) return

      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/purchase-orders/vendor`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Failed to fetch purchase orders")
        const result = await response.json()
        
        if (result.success) {
          // Use the data from the response
          setPos(result.data)
        } else {
          throw new Error(result.message || "Failed to fetch purchase orders")
        }
      } catch (err) {
        console.error("❌ Error fetching POs:", err)
        setError("Could not fetch purchase orders.")
      } finally {
        setIsLoading(false)
      }
    }

    if (vendorId) fetchPOs()
  }, [vendorId, backendUrl])

  // Filter POs based on search term and status
  const filteredPOs = pos.filter((po) => {
    const matchesSearch = po._id.toLowerCase().includes(searchTerm.toLowerCase())
    let matchesStatus = true

    if (statusFilter === "confirmed") {
      matchesStatus = po.vendorConfirmation?.confirmed
    } else if (statusFilter === "pending") {
      matchesStatus = !po.vendorConfirmation?.confirmed
    } else if (statusFilter === "shipped") {
      matchesStatus = po.deliveryStatus === "shipped"
    } else if (statusFilter === "delivered") {
      matchesStatus = po.deliveryStatus === "delivered"
    }

    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalPOs = pos?.length || 0
  const confirmedPOs = pos?.filter((po) => po.vendorConfirmation?.confirmed)?.length || 0
  const pendingPOs = pos?.filter((po) => !po.vendorConfirmation?.confirmed)?.length || 0
  const shippedPOs = pos?.filter((po) => po.deliveryStatus === "shipped")?.length || 0
  const deliveredPOs = pos?.filter((po) => po.deliveryStatus === "delivered")?.length || 0
  const totalValue = pos?.reduce((sum, po) => sum + (po.totalAmount || 0), 0) || 0

  // Confirm a purchase order
  const handleConfirmPO = async (poId) => {
    setActionLoading(poId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/purchase-orders/${poId}/vendor/confirm`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId }),
      })

      if (!response.ok) throw new Error(`Failed to confirm purchase order. Status: ${response.status}`)

      // Update the state with the confirmed PO
      setPos((prevPos) =>
        prevPos.map((po) => (po._id === poId ? { ...po, vendorConfirmation: { confirmed: true } } : po)),
      )

      setError("") // Clear any previous errors
    } catch (err) {
      console.error("❌ Error confirming PO:", err)
      setError("Could not confirm purchase order.")
    } finally {
      setActionLoading(null)
    }
  }

  // Open the modal for updating delivery status
  // Open the modal for updating delivery status
const handleOpenModal = (po) => {
  setSelectedPO(po)

  // Only generate a new tracking number if PO has no tracking number yet
  if (po.trackingNumber) {
    setTrackingNumber(po.trackingNumber)
  } else {
    setTrackingNumber(generateTrackingNumber())
  }

  // If carrier exists from DB, use it. Otherwise start empty
  setCarrier(po.carrier || "")

  setOpenModal(true)
}


  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false)
    setTrackingNumber("")
    setCarrier("")
    setSelectedPO(null)
  }

  // Update delivery status (shipped or delivered)
const handleUpdateDeliveryStatus = async (status) => {
  try {
    if (!selectedPO) throw new Error("Missing PO")

    const token = localStorage.getItem("token")

    const payload =
      status === "shipped"
        ? { deliveryStatus: status, trackingNumber, carrier, vendorId }
        : { deliveryStatus: status, vendorId } // delivered should not overwrite tracking info

    const response = await fetch(
      `${backendUrl}/api/purchase-orders/${selectedPO._id}/delivery-status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update delivery status")
    }

    // Update local state
    setPos((prevPos) =>
      prevPos.map((po) =>
        po._id === selectedPO._id
          ? {
              ...po,
              deliveryStatus: status,
              trackingNumber: status === "shipped" ? trackingNumber : po.trackingNumber,
              carrier: status === "shipped" ? carrier : po.carrier,
            }
          : po
      )
    )

    handleCloseModal()
    setError("")
  } catch (err) {
    console.error("❌ Error updating delivery status:", err)
    setError(err.message)
  }
}


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Refetch the data
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/purchase-orders/vendor`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Failed to fetch purchase orders")
        const result = await response.json()
        
        if (result.success) {
          setPos(result.data)
        } else {
          throw new Error(result.message || "Failed to fetch purchase orders")
        }
      } catch (err) {
        console.error("❌ Error refreshing POs:", err)
        setError("Could not refresh purchase orders.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }

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
    <div className="min-h-screen bg-gray-50">
       <LoadingOverlay isVisible={isLoading} message="Loading Purchase Orders..." />
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Purchase Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your assigned purchase orders and delivery tracking</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Compact Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard title="Total POs" value={totalPOs} icon={FileText} color="blue" subtitle="All orders" />
          <MetricCard
            title="Confirmed"
            value={confirmedPOs}
            icon={CheckCircle}
            color="green"
            trend={5}
            subtitle="Ready to ship"
          />
          <MetricCard title="Pending" value={pendingPOs} icon={Clock} color="orange" subtitle="Awaiting action" />
          <MetricCard title="Shipped" value={shippedPOs} icon={Truck} color="blue" subtitle="In transit" />
          <MetricCard title="Delivered" value={deliveredPOs} icon={PackageCheck} color="purple" subtitle="Completed" />
          <MetricCard
            title="Total Value"
            value={formatCurrency(totalValue)}
            icon={DollarSign}
            color="green"
            trend={8}
            subtitle="Order value"
          />
        </div>

        {/* Compact Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-center flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by PO number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              </button>
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-1">
                <Download size={14} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Orders Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Purchase Orders</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {filteredPOs.length} of {totalPOs} orders
              </span>
            </div>
          </div>

          {filteredPOs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No orders match your filters" : "No purchase orders available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "There are currently no purchase orders assigned to you."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPOs.map((po) => (
                <POCard
                  key={po._id}
                  po={po}
                  onConfirm={handleConfirmPO}
                  onUpdateDelivery={handleOpenModal}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Compact Delivery Status Update Modal */}
      {openModal && selectedPO && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Truck size={20} className="text-blue-500" />
                    Update Delivery
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    PO: <span className="font-semibold">{selectedPO._id.slice(-8).toUpperCase()}</span>
                  </p>
                </div>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-2xl transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* PO Details */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package size={16} />
                    Order Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-semibold text-gray-900">{formatCurrency(selectedPO.totalAmount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-semibold text-gray-900 capitalize">{selectedPO.deliveryStatus || "Pending"}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Hash size={14} />
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      readOnly={!!selectedPO.trackingNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-gray-50 text-gray-700 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated tracking number</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Building size={14} />
                      Carrier *
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g., FedEx, UPS, DHL"
                      readOnly={!!selectedPO.carrier}
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-3">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-blue-500 rounded-lg">
                        <Zap size={12} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 text-sm">Next Action</h4>
                        <p className="text-blue-800 text-xs">
                          {selectedPO.deliveryStatus === "shipped"
                            ? "Mark as delivered once it reaches the customer."
                            : "Mark as shipped once dispatched from your facility."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      handleUpdateDeliveryStatus(selectedPO.deliveryStatus === "shipped" ? "delivered" : "shipped")
                    }
                    disabled={!carrier}
                    className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {selectedPO.deliveryStatus === "shipped" ? (
                      <>
                        <PackageCheck size={16} />
                        Mark Delivered
                      </>
                    ) : (
                      <>
                        <Truck size={16} />
                        Mark Shipped
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2 text-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}