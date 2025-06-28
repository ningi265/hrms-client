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
    Loader 
} from "lucide-react"

// Custom Components matching vehicle-management.jsx style
const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
  );
};

const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3">
        <Loader className="animate-spin w-6 h-6 text-blue-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={20} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className={trend > 0 ? 'text-emerald-500' : 'text-red-500'} />
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

const Alert = ({ type = "info", title, children, onClose }) => {
  const typeClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const iconClasses = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500"
  };

  const icons = {
    info: AlertTriangle,
    success: Check,
    warning: AlertTriangle,
    error: AlertTriangle
  };

  const Icon = icons[type];

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]} mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${iconClasses[type]}`} />
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

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

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000"

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
        return <Car size={14} />
      case "company":
        return <Car size={14} />
      case "rental":
        return <Car size={14} />
      case "public_transport":
        return <Bus size={14} />
      default:
        return <Package size={14} />
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
       <LoadingOverlay 
      isVisible={isLoading} 
      message="Loading Travel Requests..." 
    />
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Final Approval Dashboard</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Review and finalize supervisor-approved travel requests</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>{totalRequests} pending approval</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchApprovedRequests}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200">
              <Bell size={20} />
            </button>
            <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Awaiting Final Approval" 
            value={totalRequests}
            icon={ShieldCheck} 
            color="blue"
          />
          <MetricCard 
            title="Own Vehicle" 
            value={ownVehicleRequests}
            icon={Car} 
            color="blue"
          />
          <MetricCard 
            title="Company Vehicle" 
            value={companyVehicleRequests}
            icon={Car} 
            color="purple"
          />
          <MetricCard 
            title="Public Transport" 
            value={publicTransportRequests}
            icon={Bus} 
            color="green"
          />
        </div>

        {/* Preview Mode Warning */}
        {isPreviewMode && (
          <Alert type="warning" title="Preview Mode Active">
            Using mock data for preview. In production, this would connect to your backend API.
          </Alert>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search travel requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Vehicle Types</option>
                  <option value="own">Own Vehicle</option>
                  <option value="company">Company Vehicle</option>
                  <option value="rental">Rental Vehicle</option>
                  <option value="public_transport">Public Transport</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  <Filter size={16} />
                  More Filters
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Travel Requests Content */}
        {filteredTravelRequests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ShieldCheck size={40} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No travel requests match your filters"
                : "No Pending Final Approvals"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria or filters to find what you're looking for."
                : "There are currently no supervisor-approved travel requests waiting for your final approval."}
            </p>
            <button
              onClick={fetchApprovedRequests}
              disabled={refreshing}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mx-auto"
            >
              <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-blue-50 border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Final Approval Required</h2>
                  <p className="text-gray-600 text-sm">Review and finalize supervisor-approved travel requests</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredTravelRequests.length} Pending
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-3">
              <div className="grid grid-cols-6 gap-4 items-center font-medium text-gray-700 text-sm">
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
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
              {filteredTravelRequests.map((request) => (
                <div
                  key={request._id}
                  className="grid grid-cols-6 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(request.employee?.name)}`}
                      >
                        {getEmployeeAvatar(request.employee?.name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {request.employee?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {request.employee?._id?.substring(0, 8) || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{formatDate(request.departureDate)}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ArrowRight size={12} />
                        {formatDate(request.returnDate)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900">{request.location || "N/A"}</div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTravelMeansColor(request.meansOfTravel)}`}
                      >
                        {getTravelMeansIcon(request.meansOfTravel)}
                        <span className="ml-2">{getTravelMeansText(request.meansOfTravel)}</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 font-mono">{request.fundingCodes || "N/A"}</div>
                  </div>

                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border text-amber-700 bg-amber-50 border-amber-200">
                      <ShieldCheck size={14} />
                      <span className="ml-2">Supervisor Approved</span>
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="relative">
                      <button
                        data-request-id={request._id}
                        onClick={() => setShowMenuId(showMenuId === request._id ? null : request._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                Showing all supervisor-approved travel requests that require your final approval.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 z-[100] bg-transparent" onClick={() => setShowMenuId(null)}></div>

          {/* Action Menu */}
          <div
            className="fixed z-[101] w-48 bg-white rounded-lg shadow-lg border border-gray-200"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-request-id="${showMenuId}"]`)
                if (button) {
                  const rect = button.getBoundingClientRect()
                  const menuHeight = 250 // Approximate menu height
                  const spaceBelow = window.innerHeight - rect.bottom
                  const spaceAbove = rect.top

                  // If there's more space above or menu would go off screen below
                  if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
                    // Position menu so its bottom edge aligns with top edge of button
                    return `${rect.top - menuHeight + window.scrollY}px`
                  } else {
                    return `${rect.bottom + 8 + window.scrollY}px`
                  }
                }
                return "50px"
              })(),
              left: (() => {
                const button = document.querySelector(`[data-request-id="${showMenuId}"]`)
                if (button) {
                  const rect = button.getBoundingClientRect()
                  const menuWidth = 192 // 48 * 4 (w-48)

                  // Center the menu over the button
                  const buttonCenter = rect.left + rect.width / 2
                  const menuLeft = buttonCenter - menuWidth / 2

                  // Make sure menu doesn't go off screen
                  const minLeft = 8
                  const maxLeft = window.innerWidth - menuWidth - 8

                  return `${Math.max(minLeft, Math.min(maxLeft, menuLeft))}px`
                }
                return "50px"
              })(),
            }}
          >
            <div className="py-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left">
                <Eye size={16} />
                <span>View Details</span>
              </button>
              <button
                onClick={() => openConfirmationDialog(showMenuId, "approve")}
                className="w-full flex items-center space-x-3 px-4 py-3 text-green-600 hover:bg-green-50 transition-colors text-left"
              >
                <Check size={16} />
                <span>Final Approve</span>
              </button>
              <button
                onClick={() => openConfirmationDialog(showMenuId, "reject")}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <X size={16} />
                <span>Deny</span>
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left">
                <FileText size={16} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <Modal
        isOpen={openConfirmation}
        onClose={closeConfirmationDialog}
        title={selectedDecision === "approve" ? "Confirm Final Approval" : "Confirm Denial"}
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedDecision === "approve" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {selectedDecision === "approve" ? (
                <Check size={24} className="text-green-600" />
              ) : (
                <X size={24} className="text-red-600" />
              )}
            </div>
            <div>
              <p className="text-gray-700 mb-2">
                You are about to{" "}
                <span
                  className={`font-semibold ${selectedDecision === "approve" ? "text-green-600" : "text-red-600"}`}
                >
                  {selectedDecision === "approve" ? "give final approval to" : "deny"}
                </span>{" "}
                this travel request.
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. The employee will be notified of your decision.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={closeConfirmationDialog}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDecision}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
                selectedDecision === "approve"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
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
      </Modal>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg border max-w-md ${
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
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : notificationType === "error" ? (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="font-medium">{notificationMessage}</span>
              <button onClick={() => setShowNotification(false)} className="ml-4 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinalApproverDashboard