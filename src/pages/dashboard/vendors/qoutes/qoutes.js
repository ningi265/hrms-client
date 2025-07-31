"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Package,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Send,
  X,
  Search,
  RefreshCw,
  Building,
  Award,
  TrendingUp,
  Activity,
  Loader,
  TrendingDown,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "../../../../authcontext/authcontext"

// LoadingOverlay Component (matching vendors.js style)
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

// MetricCard Component (matching vendors.js style)
const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
  prefix = "",
  suffix = "",
  size = "normal",
}) => {
  const cardClass = size === "large" ? "col-span-2" : ""
  const valueSize = size === "large" ? "text-4xl" : "text-2xl"

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-1.5 hover:shadow-sm transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-1">
        <div
          className={`p-1.5 rounded-xl ${
            color === "blue"
              ? "bg-blue-50"
              : color === "green"
                ? "bg-emerald-50"
                : color === "purple"
                  ? "bg-purple-50"
                  : color === "orange"
                    ? "bg-orange-50"
                    : color === "amber"
                      ? "bg-amber-50"
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
                      : color === "amber"
                        ? "text-amber-600"
                        : color === "red"
                          ? "text-red-600"
                          : "text-gray-600"
            }
          />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={12} className="text-emerald-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-500" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  )
}

// RFQ Card Component (new compact design)
const RFQCard = ({
  rfq,
  onSubmitQuote,
  hasSubmittedQuote,
  user,
  getOfficerName,
  getCompanyName,
  formatDate,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-blue-50 rounded-xl">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">{rfq._id.slice(-8).toUpperCase()}</h4>
            <p className="text-xs text-gray-500">{rfq.itemName || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(rfq.status)}`}>
            {getStatusIcon(rfq.status)}
            <span className="ml-1 capitalize">{rfq.status || "Unknown"}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">{rfq.quantity || 0}</div>
          <div className="text-xs text-gray-500">Quantity</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">
            {rfq.deadline ? formatDate(rfq.deadline) : "No deadline"}
          </div>
          <div className="text-xs text-gray-500">Deadline</div>
        </div>
      </div>

      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Company</span>
          <span className="text-xs font-medium truncate">{getCompanyName(rfq)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Officer</span>
          <span className="text-xs font-medium truncate">{getOfficerName(rfq)}</span>
        </div>
        {rfq.estimatedBudget && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Budget</span>
            <span className="text-xs font-medium">${rfq.estimatedBudget.toLocaleString()}</span>
          </div>
        )}
      </div>

      {rfq.description && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Description</div>
          <div className="text-xs text-gray-700 line-clamp-2">{rfq.description}</div>
        </div>
      )}

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
            <Building size={12} className="text-blue-600" />
          </div>
          <span className="text-xs text-gray-500">RFQ</span>
        </div>
        <div className="flex gap-1">
          {hasSubmittedQuote(rfq) ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium flex items-center gap-1">
              <CheckCircle size={12} />
              Submitted
            </span>
          ) : rfq.status === "open" ? (
            <button
              onClick={() => onSubmitQuote(rfq)}
              className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              <Send size={12} />
              Quote
            </button>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium flex items-center gap-1">
              <Shield size={12} />
              Closed
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VendorRFQsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rfqs, setRfqs] = useState([])
  const [filteredRFQs, setFilteredRFQs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [price, setPrice] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [notes, setNotes] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
  const [viewMode, setViewMode] = useState("cards") // cards or table

  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV

  // Fetch all RFQs from the backend
  const fetchRFQs = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/rfqs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (response.ok) {
        setRfqs(data.data)
        const vendorRFQs = data.data.filter((rfq) => rfq.vendors.some((vendor) => vendor.email === user?.email))
        setFilteredRFQs(vendorRFQs)
        setError(null)
      } else {
        setError(data.message || "Failed to fetch RFQs")
      }
    } catch (err) {
      setError("Failed to fetch RFQs. Please check your network connection.")
      console.error("Failed to fetch RFQs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchRFQs()
    }
  }, [user])

  // Filter RFQs based on search term and status
  const displayedRFQs = filteredRFQs.filter((rfq) => {
    const matchesSearch = rfq.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalRFQs = filteredRFQs?.length || 0
  const openRFQs = filteredRFQs?.filter((rfq) => rfq.status === "open")?.length || 0
  const closedRFQs = filteredRFQs?.filter((rfq) => rfq.status === "closed")?.length || 0
  const submittedQuotes =
    filteredRFQs?.filter((rfq) => rfq.quotes?.some((quote) => quote.vendorEmail === user?.email))?.length || 0

  const handleSelectRFQ = (rfq) => {
    setSelectedRFQ(rfq)
    setOpenModal(true)
    setError("")
    setNotificationMessage("")
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedRFQ(null)
    setPrice("")
    setDeliveryTime("")
    setNotes("")
    setError("")
    setNotificationMessage("")
  }

  const handleSubmitQuote = async () => {
    if (!selectedRFQ || !price || !deliveryTime) return

    setIsSubmittingQuote(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/rfqs/${selectedRFQ._id}/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: Number.parseFloat(price),
          deliveryTime,
          notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const updatedRFQs = filteredRFQs.map((rfq) => {
          if (rfq._id === selectedRFQ._id) {
            return {
              ...rfq,
              quotes: [
                ...(rfq.quotes || []),
                {
                  vendorEmail: user?.email,
                  price: Number.parseFloat(price),
                  deliveryTime,
                  notes,
                  submittedAt: new Date().toISOString(),
                },
              ],
            }
          }
          return rfq
        })

        setFilteredRFQs(updatedRFQs)

        const updatedAllRFQs = rfqs.map((rfq) => {
          if (rfq._id === selectedRFQ._id) {
            return {
              ...rfq,
              quotes: [
                ...(rfq.quotes || []),
                {
                  vendorEmail: user?.email,
                  price: Number.parseFloat(price),
                  deliveryTime,
                  notes,
                  submittedAt: new Date().toISOString(),
                },
              ],
            }
          }
          return rfq
        })

        setRfqs(updatedAllRFQs)
        showNotificationMessage("Quote submitted successfully!", "success")

        setTimeout(() => {
          handleCloseModal()
        }, 1500)
      } else {
        setError(data.message || "Failed to submit quote.")
      }
    } catch (err) {
      console.error("Failed to submit quote:", err)
      setError("Failed to submit quote. Please check your network connection.")
    } finally {
      setIsSubmittingQuote(false)
    }
  }

  const handleRefreshData = () => {
    fetchRFQs()
  }

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "text-green-700 bg-green-50 border-green-200"
      case "closed":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <CheckCircle size={14} />
      case "pending":
        return <Clock size={14} />
      case "closed":
        return <Shield size={14} />
      default:
        return <AlertCircle size={14} />
    }
  }

  const hasSubmittedQuote = (rfq) => {
    return rfq.quotes?.some((quote) => quote.vendorEmail === user?.email)
  }

  const getOfficerName = (rfq) => {
    if (rfq.procurementOfficer?.name) return rfq.procurementOfficer.name
    if (rfq.procurementOfficer?.email) return rfq.procurementOfficer.email
    return "N/A"
  }

  const getCompanyName = (rfq) => {
    return rfq.company?.name || "N/A"
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading RFQs..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              Available RFQs
            </h1>
            <p className="text-gray-500 text-sm mt-1">Submit quotes for procurement requests - {user?.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending</option>
            </select>
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                  viewMode === "cards" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                  viewMode === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total RFQs" value={totalRFQs} icon={FileText} color="blue" subtitle="Available to you" />
          <MetricCard title="Open RFQs" value={openRFQs} icon={CheckCircle} color="green" subtitle="Ready for quotes" />
          <MetricCard
            title="Quotes Submitted"
            value={submittedQuotes}
            icon={Award}
            color="purple"
            subtitle="Your responses"
          />
          <MetricCard
            title="Response Rate"
            value={Math.round((submittedQuotes / Math.max(totalRFQs, 1)) * 100)}
            suffix="%"
            icon={Activity}
            color="amber"
            subtitle="Quote submission"
          />
        </div>

        {/* RFQs Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Request for Quotes</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {displayedRFQs.length} of {totalRFQs} RFQs
              </span>
            </div>
          </div>

          {displayedRFQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No RFQs match your filters" : "No RFQs available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "There are currently no RFQs assigned to you. Check back later for new opportunities."}
              </p>
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayedRFQs.map((rfq) => (
                <RFQCard
                  key={rfq._id}
                  rfq={rfq}
                  onSubmitQuote={handleSelectRFQ}
                  hasSubmittedQuote={hasSubmittedQuote}
                  user={user}
                  getOfficerName={getOfficerName}
                  getCompanyName={getCompanyName}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">RFQ ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Item</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Quantity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Company</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Officer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Deadline</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedRFQs.map((rfq) => (
                    <tr key={rfq._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-blue-600">{rfq._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{rfq.itemName || "N/A"}</div>
                        {rfq.description && (
                          <div className="text-sm text-gray-500 truncate max-w-48">{rfq.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{rfq.quantity || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-700">{getCompanyName(rfq)}</td>
                      <td className="py-3 px-4 text-gray-700">{getOfficerName(rfq)}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {rfq.deadline ? formatDate(rfq.deadline) : "No deadline"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(rfq.status)}`}
                        >
                          {getStatusIcon(rfq.status)}
                          <span className="ml-1 capitalize">{rfq.status || "Unknown"}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasSubmittedQuote(rfq) ? (
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                            <CheckCircle size={14} className="mr-1" />
                            Submitted
                          </span>
                        ) : rfq.status === "open" ? (
                          <button
                            onClick={() => handleSelectRFQ(rfq)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm flex items-center gap-1 mx-auto"
                          >
                            <Send size={14} />
                            Quote
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
                            <Shield size={14} className="mr-1" />
                            Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Submit Quote Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Compact Header */}
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Send size={18} className="text-blue-500" />
                  Submit Quote
                </h2>
                <button onClick={handleCloseModal} className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Compact Form Body */}
            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <div className="space-y-3">
                {/* Success/Error Messages */}
                {notificationMessage && (
                  <div
                    className={`px-3 py-2 rounded-xl text-sm flex items-center gap-2 ${
                      notificationType === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {notificationType === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {notificationMessage}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* RFQ Details */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Package size={16} />
                    RFQ Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Item:</span>
                      <p className="font-semibold text-gray-900">{selectedRFQ?.itemName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <p className="font-semibold text-gray-900">{selectedRFQ?.quantity}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Company:</span>
                      <p className="font-semibold text-gray-900">{getCompanyName(selectedRFQ)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedRFQ?.deadline ? formatDate(selectedRFQ.deadline) : "No deadline"}
                      </p>
                    </div>
                  </div>
                  {selectedRFQ?.description && (
                    <div className="mt-2">
                      <span className="text-gray-500 text-xs">Description:</span>
                      <p className="text-xs text-gray-900 mt-1">{selectedRFQ.description}</p>
                    </div>
                  )}
                </div>

                {/* Quote Form */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter your price"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isSubmittingQuote}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Time *</label>
                    <input
                      type="text"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      placeholder="e.g., 2 weeks, 10 business days"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isSubmittingQuote}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Include any additional information..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      disabled={isSubmittingQuote}
                    />
                  </div>
                </div>

                {/* Compact Footer */}
                <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={handleCloseModal}
                    disabled={isSubmittingQuote}
                    className="px-4 py-2 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuote}
                    disabled={!price || !deliveryTime || isSubmittingQuote}
                    className="px-4 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingQuote ? (
                      <>
                        <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Submit Quote
                      </>
                    )}
                  </button>
                </div>
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
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border ${
              notificationType === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {notificationType === "success" ? (
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
              <button onClick={() => setShowNotification(false)} className="ml-4 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
