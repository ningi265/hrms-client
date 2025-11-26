"use client"

import { useState, useEffect } from "react"
import {
  Check,
  X,
  Calendar,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  User,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  Package,
  MoreVertical,
  Eye,
  FileText,
  Car,
  Bus,
  TrendingUp,
  TrendingDown,
  Loader,
} from "lucide-react"
import { motion } from "framer-motion"

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

// Travel Request Row Component (compact design)
const TravelRequestRow = ({
  request,
  onMenuClick,
  showMenuId,
  formatDate,
  getTravelMeansText,
  getTravelMeansIcon,
  getTravelMeansColor,
  getEmployeeAvatar,
  getAvatarColor,
}) => {
  return (
    <div className="grid grid-cols-6 gap-4 items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      <div>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(request.employee?.name)}`}
          >
            {getEmployeeAvatar(request.employee?.name)}
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">{request.employee?.lastName || "N/A"}</div>
           
             <div className="text-xs text-gray-600 font-mono truncate">{request.fundingCodes || "N/A"}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-gray-900">{formatDate(request.departureDate)}</div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <ArrowRight size={10} />
            {formatDate(request.returnDate)}
          </div>
        </div>
      </div>

      <div>
        <div className="font-medium text-gray-900 text-sm truncate">{request.location || "N/A"}</div>
      </div>

      <div className="space-y-1">
        <div>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTravelMeansColor(request.meansOfTravel)}`}
          >
            {getTravelMeansIcon(request.meansOfTravel)}
            <span className="ml-1">{getTravelMeansText(request.meansOfTravel)}</span>
          </span>
        </div>
       
      </div>

      <div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border text-amber-700 bg-amber-50 border-amber-200">
          <ShieldCheck size={12} />
          <span className="ml-1">Supervisor Approved</span>
        </span>
      </div>

      <div className="text-center">
        <button
          data-request-id={request._id}
          onClick={() => onMenuClick(showMenuId === request._id ? null : request._id)}
          className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  )
}

// Mock data for preview/development
const MOCK_TRAVEL_REQUESTS = [
  {
    _id: "1",
    employee: { _id: "e1", name: "John Smith" },
    departureDate: "2025-05-15T00:00:00.000Z",
    returnDate: "2025-05-22T00:00:00.000Z",
    location: "New York, NY",
    fundingCodes: "FIN-2025-001",
    meansOfTravel: "own",
    status: "supervisor_approved",
  },
  {
    _id: "2",
    employee: { _id: "e2", name: "Sarah Johnson" },
    departureDate: "2025-06-01T00:00:00.000Z",
    returnDate: "2025-06-05T00:00:00.000Z",
    location: "Chicago, IL",
    fundingCodes: "FIN-2025-002",
    meansOfTravel: "public_transport",
    status: "supervisor_approved",
  },
  {
    _id: "3",
    employee: { _id: "e3", name: "Michael Chen" },
    departureDate: "2025-05-20T00:00:00.000Z",
    returnDate: "2025-05-27T00:00:00.000Z",
    location: "San Francisco, CA",
    fundingCodes: "FIN-2025-003",
    meansOfTravel: "rental",
    status: "supervisor_approved",
  },
  {
    _id: "4",
    employee: { _id: "e4", name: "Emily Davis" },
    departureDate: "2025-06-10T00:00:00.000Z",
    returnDate: "2025-06-15T00:00:00.000Z",
    location: "Austin, TX",
    fundingCodes: "FIN-2025-004",
    meansOfTravel: "company",
    status: "supervisor_approved",
  },
]

const FinalApproverDashboard = () => {
  const [travelRequests, setTravelRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showMenuId, setShowMenuId] = useState(null)

  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV

  const fetchApprovedRequests = async () => {
    setRefreshing(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/travel-requests/supervisor-approved`, {
        headers: {
          Authorization: `Bearer ${token || "preview-token"}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch supervisor-approved travel requests")
      }

      const data = await response.json()
      setTravelRequests(data)
      setIsPreviewMode(false)
    } catch (error) {
      console.error("Failed to fetch supervisor-approved travel requests:", error)
      setTravelRequests(MOCK_TRAVEL_REQUESTS)
      setIsPreviewMode(true)
      if (
        typeof window !== "undefined" &&
        window.location.hostname !== "localhost" &&
        !window.location.hostname.includes("vercel.app")
      ) {
        showNotificationMessage("Failed to fetch supervisor-approved travel requests", "error")
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        setRefreshing(false)
      }, 800)
    }
  }

  useEffect(() => {
    fetchApprovedRequests()
  }, [backendUrl])

  // Filter travel requests
  const filteredTravelRequests = travelRequests.filter((request) => {
    const matchesSearch =
      request.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.meansOfTravel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    const matchesStatus = statusFilter === "all" || request.meansOfTravel === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalRequests = travelRequests?.length || 0
  const ownVehicleRequests = travelRequests?.filter((req) => req.meansOfTravel === "own")?.length || 0
  const companyVehicleRequests = travelRequests?.filter((req) => req.meansOfTravel === "company")?.length || 0
  const publicTransportRequests = travelRequests?.filter((req) => req.meansOfTravel === "public_transport")?.length || 0

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const handleFinalDecision = async (id, decision) => {
    try {
      if (isPreviewMode) {
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))
        showNotificationMessage(
          `Travel request ${decision === "approve" ? "approved" : "rejected"} successfully! (Preview mode)`,
          "info",
        )
        return
      }

      const token = localStorage.getItem("token")
      const finalApproverId = JSON.parse(localStorage.getItem("user") || '{"_id":"preview-user"}')._id

      const response = await fetch(`${backendUrl}/api/travel-requests/${id}/final-approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          finalApproverId,
          decision: decision === "approve" ? "approved" : "rejected",
        }),
      })

      if (response.ok) {
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))
        showNotificationMessage(
          `Travel request ${decision === "approve" ? "approved" : "rejected"} successfully!`,
          "success",
        )
      } else {
        const errorData = await response.json()
        showNotificationMessage(errorData.message || "Failed to update travel request", "error")
      }
    } catch (error) {
      showNotificationMessage("An error occurred while updating the travel request", "error")
    }
    setShowMenuId(null)
  }

  const openConfirmationDialog = (id, decision) => {
    setSelectedRequestId(id)
    setSelectedDecision(decision)
    setOpenConfirmation(true)
    setShowMenuId(null)
  }

  const closeConfirmationDialog = () => {
    setOpenConfirmation(false)
    setSelectedRequestId(null)
    setSelectedDecision(null)
  }

  const confirmDecision = () => {
    handleFinalDecision(selectedRequestId, selectedDecision)
    closeConfirmationDialog()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTravelMeansText = (meansCode) => {
    switch (meansCode) {
      case "own":
        return "Own Vehicle"
      case "company":
        return "Company Vehicle"
      case "rental":
        return "Rental Vehicle"
      case "public_transport":
        return "Public Transport"
      default:
        return meansCode || "N/A"
    }
  }

  const getTravelMeansIcon = (meansCode) => {
    switch (meansCode) {
      case "own":
        return <Car size={12} />
      case "company":
        return <Car size={12} />
      case "rental":
        return <Car size={12} />
      case "public_transport":
        return <Bus size={12} />
      default:
        return <Package size={12} />
    }
  }

  const getTravelMeansColor = (meansCode) => {
    switch (meansCode) {
      case "own":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "company":
        return "text-purple-700 bg-purple-50 border-purple-200"
      case "rental":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "public_transport":
        return "text-green-700 bg-green-50 border-green-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getEmployeeAvatar = (name) => {
    if (!name) return "?"
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
    return initials
  }

  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-500"
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-amber-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-orange-500",
      "bg-pink-500",
    ]
    const charCode = name.charCodeAt(0) || 0
    return colors[charCode % colors.length]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading travel requests..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Key Metrics Grid - <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Awaiting Final Approval"
            value={totalRequests}
            icon={ShieldCheck}
            color="blue"
            subtitle="Pending your review"
          />
          <MetricCard title="Own Vehicle" value={ownVehicleRequests} icon={Car} color="blue" subtitle="Personal cars" />
          <MetricCard
            title="Company Vehicle"
            value={companyVehicleRequests}
            icon={Car}
            color="purple"
            subtitle="Fleet vehicles"
          />
          <MetricCard
            title="Public Transport"
            value={publicTransportRequests}
            icon={Bus}
            color="green"
            subtitle="Buses & trains"
          />
        </div> */}
       

        {/* Preview Mode Warning */}
        {isPreviewMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Preview Mode Active</h3>
                <p className="text-amber-700 text-sm">
                  Using mock data for preview. In production, this would connect to your backend API.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search travel requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
                />
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
                >
                  <option value="all">All Vehicle Types</option>
                  <option value="own">Own Vehicle</option>
                  <option value="company">Company Vehicle</option>
                  <option value="rental">Rental Vehicle</option>
                  <option value="public_transport">Public Transport</option>
                </select>
              </div>
            </div>

             

            <div className="flex items-center space-x-3">

              <button
              onClick={fetchApprovedRequests}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
             
            </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 text-sm">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Travel Requests Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Final Approval Required</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {filteredTravelRequests.length} of {totalRequests} requests
              </span>
            </div>
          </div>

          {filteredTravelRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No travel requests match your filters"
                  : "No Pending Final Approvals"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters to find what you're looking for."
                  : "There are currently no supervisor-approved travel requests waiting for your final approval."}
              </p>
              <button
                onClick={fetchApprovedRequests}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 disabled:opacity-50 mx-auto"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 items-center px-4 py-3 bg-gray-50 rounded-xl mb-2 font-semibold text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Employee
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Travel Period
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  Location
                </div>
                <div className="flex items-center gap-2">
                  <Car size={16} />
                  Travel Details
                </div>
                <div>Status</div>
                <div className="text-center">Actions</div>
              </div>

              {/* Table Body */}
              <div className="space-y-0">
                {filteredTravelRequests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TravelRequestRow
                      request={request}
                      onMenuClick={setShowMenuId}
                      showMenuId={showMenuId}
                      formatDate={formatDate}
                      getTravelMeansText={getTravelMeansText}
                      getTravelMeansIcon={getTravelMeansIcon}
                      getTravelMeansColor={getTravelMeansColor}
                      getEmployeeAvatar={getEmployeeAvatar}
                      getAvatarColor={getAvatarColor}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/5"
            onClick={() => setShowMenuId(null)}
            transition={{ duration: 0.1 }}
          />

          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed z-[101] w-56 bg-white rounded-2xl shadow-xl border border-gray-200"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-request-id="${showMenuId}"]`)
                if (button) {
                  const rect = button.getBoundingClientRect()
                  return `${rect.bottom + window.scrollY}px`
                }
                return "50px"
              })(),
              left: (() => {
                const button = document.querySelector(`[data-request-id="${showMenuId}"]`)
                if (button) {
                  const rect = button.getBoundingClientRect()
                  const menuWidth = 224
                  const rightEdge = rect.right + window.scrollX

                  if (rightEdge + menuWidth > window.innerWidth) {
                    return `${window.innerWidth - menuWidth - 8}px`
                  }
                  return `${rect.right - menuWidth + window.scrollX}px`
                }
                return "50px"
              })(),
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut",
            }}
          >
            <div className="py-1">
              {[
                {
                  icon: Eye,
                  label: "View Details",
                  action: () => {},
                },
                {
                  icon: Check,
                  label: "Final Approve",
                  action: () => openConfirmationDialog(showMenuId, "approve"),
                  color: "green",
                },
                {
                  icon: X,
                  label: "Deny",
                  action: () => openConfirmationDialog(showMenuId, "reject"),
                  color: "red",
                },
                { type: "divider" },
                {
                  icon: FileText,
                  label: "Download PDF",
                  action: () => {},
                },
              ].map((item, index) =>
                item.type === "divider" ? (
                  <div key={`divider-${index}`} className="border-t border-gray-100 my-1" />
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action()
                      setShowMenuId(null)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm rounded-xl ${
                      item.color === "green"
                        ? "text-green-600 hover:bg-green-50"
                        : item.color === "red"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <item.icon size={16} className="text-gray-500" />
                    <span>{item.label}</span>
                  </button>
                ),
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* Confirmation Dialog */}
      {openConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {selectedDecision === "approve" ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <X size={18} className="text-red-500" />
                  )}
                  {selectedDecision === "approve" ? "Confirm Final Approval" : "Confirm Denial"}
                </h2>
                <button onClick={closeConfirmationDialog} className="p-1.5 hover:bg-gray-100 rounded-2xl">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedDecision === "approve" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {selectedDecision === "approve" ? (
                    <Check size={20} className="text-green-600" />
                  ) : (
                    <X size={20} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-gray-700 mb-2 text-sm">
                    You are about to{" "}
                    <span
                      className={`font-semibold ${selectedDecision === "approve" ? "text-green-600" : "text-red-600"}`}
                    >
                      {selectedDecision === "approve" ? "give final approval to" : "deny"}
                    </span>{" "}
                    this travel request.
                  </p>
                  <p className="text-xs text-gray-500">
                    This action cannot be undone. The employee will be notified of your decision.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeConfirmationDialog}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDecision}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm ${
                    selectedDecision === "approve"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {selectedDecision === "approve" ? (
                    <>
                      <Check size={16} />
                      Confirm Final Approval
                    </>
                  ) : (
                    <>
                      <X size={16} />
                      Confirm Denial
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
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border ${
              notificationType === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : notificationType === "error"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {notificationType === "success" ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : notificationType === "error" ? (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
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

export default FinalApproverDashboard
