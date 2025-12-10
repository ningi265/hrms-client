"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Check,
  X,
  Calendar,
  MapPin,
  Plane,
  AlertTriangle,
  User,
  Search,
  RefreshCw,
  Package,
  MoreVertical,
  Eye,
  FileText,
  Car,
  Train,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Send,
  Copy,
  History,
  MessageSquare,
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
                        : color === "sky"
                          ? "bg-sky-50"
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
                          : color === "sky"
                            ? "text-sky-600"
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

// Travel Request Card Component (compact design)
const TravelRequestCard = ({ request, onMenuClick, showMenuId, onAction }) => {
  const getTravelColor = (meansOfTravel) => {
    switch (meansOfTravel?.toLowerCase()) {
      case "flight":
        return "bg-blue-100 text-blue-800"
      case "train":
        return "bg-green-100 text-green-800"
      case "car":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTravelIcon = (meansOfTravel) => {
    switch (meansOfTravel?.toLowerCase()) {
      case "flight":
        return <Plane size={12} />
      case "train":
        return <Train size={12} />
      case "car":
        return <Car size={12} />
      default:
        return <Package size={12} />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateDuration = (departure, returnDate) => {
    const start = new Date(departure)
    const end = new Date(returnDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const employeeName = request.employee?.lastName || "N/A"
  const duration = calculateDuration(request.departureDate, request.returnDate)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-blue-50 rounded-xl">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">{employeeName}</h4>
            <p className="text-xs text-gray-500">{request.location || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getTravelColor(request.meansOfTravel)}`}
          >
            {getTravelIcon(request.meansOfTravel)}
            <span className="ml-1">{request.meansOfTravel}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900 flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3 text-purple-500" />
            {duration}
          </div>
          <div className="text-xs text-gray-500">Days</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-red-500" />
            {request.location?.split(",")[0] || "N/A"}
          </div>
          <div className="text-xs text-gray-500">Destination</div>
        </div>
      </div>

      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Departure</span>
          <span className="text-xs font-medium">{formatDate(request.departureDate)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Return</span>
          <span className="text-xs font-medium">{formatDate(request.returnDate)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Funding Code</span>
          <span className="text-xs font-medium font-mono truncate">{request.fundingCodes || "N/A"}</span>
        </div>
      </div>

      <div className="mb-1.5">
        <div className="text-xs text-gray-600 mb-1">Travel Method</div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getTravelColor(request.meansOfTravel)}`}
        >
          {getTravelIcon(request.meansOfTravel)}
          {request.meansOfTravel || "Unknown"}
        </span>
      </div>

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
            <Plane size={12} className="text-blue-600" />
          </div>
          <span className="text-xs text-gray-500">{duration} day trip</span>
        </div>
        <div className="flex gap-1">
          <button
            data-request-id={request._id}
            onClick={() => onMenuClick(request._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <MoreVertical size={14} />
          </button>
          <button
            onClick={() => onAction(request._id, "approved")}
            className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
          >
            <Check size={12} />
            Approve
          </button>
          <button
            onClick={() => onAction(request._id, "rejected")}
            className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Reject
          </button>
        </div>
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
    meansOfTravel: "Flight",
  },
  {
    _id: "2",
    employee: { _id: "e2", name: "Sarah Johnson" },
    departureDate: "2025-06-01T00:00:00.000Z",
    returnDate: "2025-06-05T00:00:00.000Z",
    location: "Chicago, IL",
    fundingCodes: "FIN-2025-002",
    meansOfTravel: "Train",
  },
  {
    _id: "3",
    employee: { _id: "e3", name: "Michael Chen" },
    departureDate: "2025-05-20T00:00:00.000Z",
    returnDate: "2025-05-27T00:00:00.000Z",
    location: "San Francisco, CA",
    fundingCodes: "FIN-2025-003",
    meansOfTravel: "Flight",
  },
  {
    _id: "4",
    employee: { _id: "e4", name: "Emily Davis" },
    departureDate: "2025-06-10T00:00:00.000Z",
    returnDate: "2025-06-15T00:00:00.000Z",
    location: "Austin, TX",
    fundingCodes: "FIN-2025-004",
    meansOfTravel: "Car",
  },
]

const SupervisorDashboard = () => {
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
  const [showMenuId, setShowMenuId] = useState(null)

  const navigate = useNavigate()
  const backendUrl =
    import.meta.env.VITE_ENV === "production"
      ? import.meta.env.VITE_BACKEND_URL_PROD
      : import.meta.env.VITE_BACKEND_URL_DEV

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/travel-requests/pending/all`, {
          headers: {
            Authorization: `Bearer ${token || "preview-token"}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch pending travel requests")
        }

        const data = await response.json()
        setTravelRequests(data)
        setIsPreviewMode(false)
      } catch (error) {
        console.error("Failed to fetch pending travel requests:", error)
        setTravelRequests(MOCK_TRAVEL_REQUESTS)
        setIsPreviewMode(true)
        if (
          typeof window !== "undefined" &&
          window.location.hostname !== "localhost" &&
          !window.location.hostname.includes("vercel.app")
        ) {
          showNotificationMessage("Failed to fetch pending travel requests", "error")
        }
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 800)
      }
    }

    fetchPendingRequests()
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
  const flightRequests = travelRequests?.filter((req) => req.meansOfTravel === "Flight")?.length || 0
  const trainRequests = travelRequests?.filter((req) => req.meansOfTravel === "Train")?.length || 0
  const carRequests = travelRequests?.filter((req) => req.meansOfTravel === "Car")?.length || 0

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const handleDecision = async (id, decision) => {
    try {
      if (isPreviewMode) {
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))
        showNotificationMessage(`Travel request ${decision} successfully! (Preview mode)`, "info")
        return
      }

      const token = localStorage.getItem("token")
      const supervisorId = JSON.parse(localStorage.getItem("user") || '{"_id":"preview-user"}')._id

      const response = await fetch(`${backendUrl}/api/travel-requests/${id}/supervisor-approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ supervisorId, decision }),
      })

      if (response.ok) {
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))
        showNotificationMessage(`Travel request ${decision} successfully!`, "success")
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
    handleDecision(selectedRequestId, selectedDecision)
    closeConfirmationDialog()
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading travel requests..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search travel requests..."
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
              <option value="all">All Travel Types</option>
              <option value="Flight">Flight</option>
              <option value="Train">Train</option>
              <option value="Car">Car</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors">
              <Plus size={16} />
              New Request
            </button>
          </div>
        </div>

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

        {/* Key Metrics Grid -   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Requests"
            value={totalRequests}
            icon={Package}
            color="blue"
            subtitle="Pending approval"
          />
          <MetricCard
            title="Flight Requests"
            value={flightRequests}
            icon={Plane}
            color="sky"
            trend={12}
            subtitle="Air travel"
          />
          <MetricCard title="Train Requests" value={trainRequests} icon={Train} color="green" subtitle="Rail travel" />
          <MetricCard
            title="Car Requests"
            value={carRequests}
            icon={Car}
            color="amber"
            trend={-3}
            subtitle="Road travel"
          />
        </div>*/}
      

        {/* Travel Request Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Travel Requests</h3>
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
                <Plane size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No travel requests match your filters"
                  : "No Pending Travel Requests"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "There are currently no travel requests waiting for your approval."}
              </p>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 mx-auto"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredTravelRequests.map((request) => (
                <TravelRequestCard
                  key={request._id}
                  request={request}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onAction={openConfirmationDialog}
                />
              ))}
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
                  action: () => {
                    navigate(`/dashboard/travel-requests/${showMenuId}`)
                  },
                },
                {
                  icon: Check,
                  label: "Approve",
                  action: () => openConfirmationDialog(showMenuId, "approved"),
                  color: "green",
                },
                {
                  icon: X,
                  label: "Reject",
                  action: () => openConfirmationDialog(showMenuId, "rejected"),
                  color: "red",
                },
                { type: "divider" },
                {
                  icon: Edit,
                  label: "Edit Request",
                  action: () => {},
                },
                {
                  icon: Send,
                  label: "Send Message",
                  action: () => {},
                },
                {
                  icon: Copy,
                  label: "Copy Details",
                  action: () => {},
                },
                {
                  icon: FileText,
                  label: "Download PDF",
                  action: () => {},
                },
                {
                  icon: History,
                  label: "View History",
                  action: () => {},
                },
                {
                  icon: MessageSquare,
                  label: "Contact Employee",
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
                  {selectedDecision === "approved" ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <X size={18} className="text-red-500" />
                  )}
                  Confirm Decision
                </h2>
                <button onClick={closeConfirmationDialog} className="p-1.5 hover:bg-gray-100 rounded-2xl">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-700 mb-4 text-sm">
                Are you sure you want to mark this travel request as{" "}
                <span
                  className={`font-semibold ${selectedDecision === "approved" ? "text-green-600" : "text-red-600"}`}
                >
                  {selectedDecision}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeConfirmationDialog}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDecision}
                  className={`px-4 py-2 rounded-xl transition-colors font-medium flex items-center gap-2 text-sm ${
                    selectedDecision === "approved"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {selectedDecision === "approved" ? <Check size={16} /> : <X size={16} />}
                  Confirm
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

export default SupervisorDashboard
