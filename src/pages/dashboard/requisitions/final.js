"use client"

import React, { useState, useEffect } from "react"
import {
  Check,
  X,
  AlertCircle,
  Calendar,
  MapPin,
  Plane,
  CreditCard,
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
  Activity,
  TrendingUp,
  Users,
  Package,
  MoreVertical,
  Eye,
  FileText,
  Car,
  Train,
  Bus
} from "lucide-react"
import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


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
      false;
    
    const matchesStatus = statusFilter === "all" || request.meansOfTravel === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRequests = travelRequests?.length || 0;
  const ownVehicleRequests = travelRequests?.filter(req => req.meansOfTravel === "own")?.length || 0;
  const companyVehicleRequests = travelRequests?.filter(req => req.meansOfTravel === "company")?.length || 0;
  const publicTransportRequests = travelRequests?.filter(req => req.meansOfTravel === "public_transport")?.length || 0;

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
          "info"
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
        showNotificationMessage(`Travel request ${decision === "approve" ? "approved" : "rejected"} successfully!`, "success")
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
           <DotLottieReact
                src="loading.lottie"
                loop
                autoplay
              />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Travel Requests</h2>
          <p className="text-gray-600">
            Please wait while we fetch supervisor-approved requests...
          </p>
        </motion.div>
      </div>
    )
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
                  <ShieldCheck size={32} />
                </div>
                Final Approval Dashboard
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Review and finalize supervisor-approved travel requests
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchApprovedRequests}
                disabled={refreshing}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                Refresh
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
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalRequests}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Awaiting Final Approval</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Car size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {ownVehicleRequests}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Own Vehicle</p>
                <p className="text-2xl font-bold text-gray-900">{ownVehicleRequests}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Car size={24} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {companyVehicleRequests}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Company Vehicle</p>
                <p className="text-2xl font-bold text-gray-900">{companyVehicleRequests}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Bus size={24} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {publicTransportRequests}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Public Transport</p>
                <p className="text-2xl font-bold text-gray-900">{publicTransportRequests}</p>
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
          {/* Preview Mode Warning */}
          {isPreviewMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertTriangle size={24} className="text-amber-600" />
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

          {/* Enhanced Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search travel requests..."
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
                    <option value="all">All Vehicle Types</option>
                    <option value="own">Own Vehicle</option>
                    <option value="company">Company Vehicle</option>
                    <option value="rental">Rental Vehicle</option>
                    <option value="public_transport">Public Transport</option>
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
              </div>
            </div>
          </div>

          {/* Travel Requests Content */}
          {filteredTravelRequests.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <ShieldCheck size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No travel requests match your filters" : "No Pending Final Approvals"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "There are currently no supervisor-approved travel requests waiting for your final approval."
                    }
                  </p>
                </div>
                <button
                  onClick={fetchApprovedRequests}
                  disabled={refreshing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Final Approval Required</h2>
                    <p className="text-blue-100 text-sm">Review and finalize supervisor-approved travel requests</p>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {filteredTravelRequests.length} Pending
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-6 gap-4 items-center font-semibold text-gray-700 text-sm">
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
                {filteredTravelRequests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-6 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(request.employee?.name)}`}>
                          {getEmployeeAvatar(request.employee?.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
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
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(request.departureDate)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ArrowRight size={12} />
                          {formatDate(request.returnDate)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900">
                        {request.location || "N/A"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTravelMeansColor(request.meansOfTravel)}`}>
                          {getTravelMeansIcon(request.meansOfTravel)}
                          <span className="ml-2">{getTravelMeansText(request.meansOfTravel)}</span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 font-mono">
                        {request.fundingCodes || "N/A"}
                      </div>
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
                          onClick={() => setShowMenuId(showMenuId === request._id ? null : request._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {showMenuId === request._id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                            <div className="py-2">
                              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                                <Eye size={16} />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => openConfirmationDialog(request._id, "approve")}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-green-600 hover:bg-green-50 transition-colors duration-200"
                              >
                                <Check size={16} />
                                <span>Final Approve</span>
                              </button>
                              <button
                                onClick={() => openConfirmationDialog(request._id, "reject")}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                              >
                                <X size={16} />
                                <span>Deny</span>
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                                <FileText size={16} />
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

              {/* Footer */}
              <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  Showing all supervisor-approved travel requests that require your final approval.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      {openConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  {selectedDecision === "approve" ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <X size={20} className="text-red-600" />
                    </div>
                  )}
                  {selectedDecision === "approve" ? "Confirm Final Approval" : "Confirm Denial"}
                </h2>
                <button
                  onClick={closeConfirmationDialog}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedDecision === "approve" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {selectedDecision === "approve" ? (
                    <Check size={24} className="text-green-600" />
                  ) : (
                    <X size={24} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-gray-700 mb-2">
                    You are about to{" "}
                    <span className={`font-semibold ${
                      selectedDecision === "approve" ? "text-green-600" : "text-red-600"
                    }`}>
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
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDecision}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
                    selectedDecision === "approve" 
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  }`}
                >
                  {selectedDecision === "approve" ? (
                    <>
                      <Check size={20} />
                      Confirm Final Approval
                    </>
                  ) : (
                    <>
                      <X size={20} />
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
          <div className={`px-6 py-4 rounded-xl shadow-2xl border ${
            notificationType === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : notificationType === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              {notificationType === 'success' ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : notificationType === 'error' ? (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  )
}

export default FinalApproverDashboard