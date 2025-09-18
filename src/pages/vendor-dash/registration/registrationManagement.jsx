"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Building,
  FileText,
  Check,
  AlertCircle,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle,
  X,
  Info,
  Download,
  Edit,
  RefreshCw,
  TrendingUp,
  Award,
  Activity,
  Bell,
  Settings,
  XCircle,
  Loader,
  Plus,
  TrendingDown,
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

// Timeline Step Component
const TimelineStep = ({ item, index, isNewUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`relative flex items-start gap-3 ${
        item.current ? "bg-blue-50 border border-blue-200 rounded-xl p-2 -ml-2" : ""
      }`}
    >
      <div
        className={`relative z-10 w-3 h-3 rounded-full border-2 mt-1 ${
          item.completed
            ? "bg-green-500 border-green-500"
            : item.current
              ? isNewUser && item.status === "start_registration"
                ? "bg-orange-500 border-orange-500 animate-pulse"
                : "bg-blue-500 border-blue-500 animate-pulse"
              : "bg-white border-gray-300"
        }`}
      >
        {item.completed && <Check size={8} className="text-white absolute -top-0.5 -left-0.5" />}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`font-semibold text-sm ${item.current ? "text-blue-900" : "text-gray-900"}`}>
            {item.description}
          </h4>
          <span className={`text-xs ${item.current ? "text-blue-600" : "text-gray-500"}`}>
            {item.date} {item.time && `• ${item.time}`}
          </span>
        </div>

        {item.current && isNewUser && item.status === "start_registration" && (
          <div className="flex items-center gap-1 text-orange-600 text-xs">
            <AlertCircle size={12} />
            <span>Click the + button to start registration</span>
          </div>
        )}

        {item.current && !isNewUser && (
          <div className="flex items-center gap-1 text-blue-600 text-xs">
            <Loader size={12} className="animate-spin" />
            <span>Currently in progress...</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Document Card Component
const DocumentCard = ({ document, onDownload }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-xl">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">{document.name}</h4>
            <p className="text-xs text-gray-500">
              {document.uploadDate} • {document.size}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              document.status === "verified"
                ? "bg-green-100 text-green-800"
                : document.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {document.status.toUpperCase()}
          </span>
          <button
            onClick={() => onDownload(document.name, document.filePath)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VendorManagementDashboard() {
  const navigate = useNavigate()
  const [vendorData, setVendorData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("info")
  const [isNewUser, setIsNewUser] = useState(false)
  const [showNewUserAlert, setShowNewUserAlert] = useState(false)
  const [searchParams] = useSearchParams()
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get("section") || "vendor-dash"
  })
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV



        useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!backendUrl) {
          throw new Error("Backend URL is not configured. Please check your .env file.")
        }

        const response = await fetch(`${backendUrl}/api/vendors/vendor-data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            setIsNewUser(true)
            setShowNewUserAlert(true)
            setVendorData({
              id: null,
              registrationStatus: "not_started",
              isNewUser: true,
              timeline: [
                {
                  status: "start_registration",
                  date: "Not started",
                  time: "",
                  description: "Click the + button to start your registration",
                  completed: false,
                  current: true,
                },
                {
                  status: "document_upload",
                  date: "Pending",
                  time: "",
                  description: "Upload required documents",
                  completed: false,
                },
                {
                  status: "document_verification",
                  date: "Pending",
                  time: "",
                  description: "Documents verification",
                  completed: false,
                },
                {
                  status: "final_approval",
                  date: "Pending",
                  time: "",
                  description: "Final approval and account activation",
                  completed: false,
                },
              ],
              metrics: {
                completionPercentage: 0,
                daysInReview: 0,
                averageProcessingTime: "5-7 days",
              },
            })
            return
          } else if (response.status === 401) {
            throw new Error("Authentication failed. Please login again.")
          } else if (response.status === 403) {
            throw new Error("Access denied. You do not have permission to view this data.")
          } else if (response.status >= 500) {
            throw new Error("Server error. Please try again later.")
          } else {
            const errorText = await response.text()
            throw new Error(`HTTP ${response.status}: ${errorText || "Unknown error"}`)
          }
        }

        const apiData = await response.json()

        if (!apiData || typeof apiData !== "object") {
          throw new Error("Invalid API response format")
        }

        const transformedData = transformApiData(apiData)
        setVendorData(transformedData)
        setIsNewUser(false)
      } catch (err) {
        console.error("Error fetching vendor data:", err)

        if (err.message.includes("fetch")) {
          setError("Network error. Please check your internet connection and try again.")
        } else if (err.message.includes("Authentication")) {
          setError("Authentication failed. Please login again.")
        } else if (err.message.includes("404") || err.message.includes("Not Found")) {
          setIsNewUser(true)
          setShowNewUserAlert(true)
          setVendorData({
            id: null,
            registrationStatus: "not_started",
            isNewUser: true,
            timeline: [
              {
                status: "start_registration",
                date: "Not started",
                time: "",
                description: "Click the + button to start your registration",
                completed: false,
                current: true,
              },
              {
                status: "document_upload",
                date: "Pending",
                time: "",
                description: "Upload required documents",
                completed: false,
              },
              {
                status: "document_verification",
                date: "Pending",
                time: "",
                description: "Documents verification",
                completed: false,
              },
              {
                status: "final_approval",
                date: "Pending",
                time: "",
                description: "Final approval and account activation",
                completed: false,
              },
            ],
            metrics: {
              completionPercentage: 0,
              daysInReview: 0,
              averageProcessingTime: "5-7 days",
            },
          })
        } else {
          setError(err.message || "Failed to load vendor data")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendorData()
  }, [backendUrl])
  


  const transformApiData = (apiData) => {
  try {
    if (!apiData._id) {
      throw new Error("Missing vendor ID in API response")
    }

    const parseDate = (dateString) => {
      if (!dateString) return null
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? null : date
    }

    const submissionDate = parseDate(apiData.createdAt) // Use createdAt instead of submissionDate
    const approvalDate = parseDate(apiData.updatedAt)   // Use updatedAt for approval date

    const daysInReview = submissionDate ? Math.floor((new Date() - submissionDate) / (1000 * 60 * 60 * 24)) : 0

    const getCompletionPercentage = (status) => {
      switch (status) {
        case "pending":
          return 25
        case "under_review":
          return 75
        case "approved":
          return 100
        case "rejected":
          return 50
        default:
          return 0
      }
    }

    const generateTimeline = (status, createdAt, updatedAt) => {
      const timeline = []
      const submissionDateObj = new Date(createdAt)

      timeline.push({
        status: "submitted",
        date: submissionDateObj.toLocaleDateString(),
        time: submissionDateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        description: "Registration submitted successfully",
        completed: true,
      })

      const docVerificationDate = new Date(submissionDateObj)
      docVerificationDate.setDate(docVerificationDate.getDate() + 1)

      timeline.push({
        status: "document_verification",
        date: docVerificationDate.toLocaleDateString(),
        time: docVerificationDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        description: "Documents under verification",
        completed: ["under_review", "approved", "rejected"].includes(status),
      })

      if (["under_review", "approved", "rejected"].includes(status)) {
        const reviewDate = new Date(submissionDateObj)
        reviewDate.setDate(reviewDate.getDate() + 2)

        timeline.push({
          status: status,
          date: reviewDate.toLocaleDateString(),
          time: reviewDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          description:
            status === "rejected"
              ? "Application was rejected - please review feedback"
              : "Application under review by compliance team",
          completed: ["approved", "rejected"].includes(status),
          current: status === "under_review",
        })
      } else if (status === "pending") {
        timeline.push({
          status: "under_review",
          date: "Pending",
          time: "",
          description: "Waiting for review by compliance team",
          completed: false,
          current: true,
        })
      }

      if (status === "approved" && updatedAt) {
        const approvalDateObj = new Date(updatedAt)
        timeline.push({
          status: "final_approval",
          date: approvalDateObj.toLocaleDateString(),
          time: approvalDateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          description: "Final approval and account activation completed",
          completed: true,
        })
      } else if (status !== "rejected") {
        timeline.push({
          status: "final_approval",
          date: "Pending",
          time: "",
          description: "Final approval and account activation",
          completed: false,
        })
      }

      return timeline
    }

    const formatFileSize = (bytes) => {
      if (!bytes || bytes === 0) return "0 Bytes"
      const k = 1024
      const sizes = ["Bytes", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return {
      id: apiData._id,
      registrationStatus: apiData.registrationStatus || "pending",
      submissionDate: submissionDate ? submissionDate.toLocaleDateString() : "N/A",
      approvalDate: approvalDate ? approvalDate.toLocaleDateString() : null,
      isNewUser: false,

      basicInfo: {
        countryOfRegistration: apiData.countryOfRegistration || "N/A",
        businessName: apiData.businessName || "N/A",
        taxpayerIdentificationNumber: apiData.taxpayerIdentificationNumber || "N/A",
        tinIssuedDate: parseDate(apiData.tinIssuedDate)?.toLocaleDateString() || "N/A",
        companyType: apiData.companyType || "N/A",
        formOfBusiness: apiData.formOfBusiness || "N/A",
        ownershipType: apiData.ownershipType || "N/A",
        businessCategory: apiData.categories ? apiData.categories.join(", ") : "N/A",
        registrationNumber: apiData.registrationNumber || "N/A",
        registrationIssuedDate: parseDate(apiData.registrationIssuedDate)?.toLocaleDateString() || "N/A",
      },

      contactInfo: apiData.vendor
        ? {
            authorizedUser: `${apiData.vendor.firstName || ""} ${apiData.vendor.lastName || ""}`.trim() || "N/A",
            phone: apiData.vendor.phoneNumber || "N/A",
            email: apiData.vendor.email || "N/A",
          }
        : {
            authorizedUser: "N/A",
            phone: "N/A",
            email: "N/A",
          },

      documents: apiData.documents && apiData.documents.length > 0
        ? {
            // Map your documents here based on your actual API structure
            powerOfAttorney: {
              name: "Power of Attorney",
              uploadDate: parseDate(apiData.createdAt)?.toLocaleDateString() || "N/A",
              status: apiData.registrationStatus === "approved" ? "verified" : "pending",
              size: "N/A",
              filePath: "",
            }
          }
        : null,

      timeline: generateTimeline(
        apiData.registrationStatus || "pending",
        apiData.createdAt, // Use createdAt instead of submissionDate
        apiData.updatedAt  // Use updatedAt for approval date
      ),

      metrics: {
        completionPercentage: getCompletionPercentage(apiData.registrationStatus),
        daysInReview: daysInReview,
        averageProcessingTime: "5-7 days",
      },

      vendor: apiData.vendor || null,
    }
  } catch (err) {
    console.error("Error transforming API data:", err)
    throw new Error("Failed to process vendor data: " + err.message)
  }
}



  const getStatusColor = (status) => {
    switch (status) {
      case "not_started":
        return "text-gray-600 bg-gray-50 border-gray-200"
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "under_review":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "approved":
        return "text-green-600 bg-green-50 border-green-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

 const getStatusIcon = (status) => {
  if (!status) return <AlertCircle size={16} />
  
  switch (status) {
    case "not_started":
      return <AlertCircle size={16} />
    case "pending":
      return <Clock size={16} />
    case "under_review":
      return <Loader size={16} className="animate-spin" />
    case "approved":
      return <CheckCircle size={16} />
    case "rejected":
      return <XCircle size={16} />
    default:
      return <AlertCircle size={16} />
  }
}
  const getStatusText = (status) => {
  if (!status) return "Loading..."
  
  switch (status) {
    case "not_started":
      return "Not Started"
    case "pending":
      return "Pending"
    case "under_review":
      return "Under Review"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
    default:
      return "Unknown"
  }
}

  const showNotificationMessage = (message, type = "info") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 4000)
  }

  const handleSectionChange = (section) => {
    navigate(`?section=${section}`, { replace: true })
  }

  const handleDownloadDocument = async (docName, filePath) => {
    try {
      showNotificationMessage(`Downloading ${docName}...`, "info")

      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/vendors/download-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ filePath }),
      })

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = docName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showNotificationMessage(`${docName} downloaded successfully!`, "success")
    } catch (error) {
      console.error("Download error:", error)
      showNotificationMessage(`Failed to download ${docName}`, "error")
    }
  }

  const handleEditRegistration = () => {
    navigate("/vendor-registration/edit")
  }

  const handleStartRegistration = () => {
    setShowNewUserAlert(false)
    handleSectionChange("registration")
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl max-w-md w-full text-center">
          <AlertCircle size={24} className="mx-auto mb-2" />
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading dashboard..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                       
              Vendor Management Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isNewUser
                ? "Welcome! Start your registration process"
                : "Track your registration status and manage business information"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotificationMessage("Refreshing data...", "info")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="p-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors">
              <Bell size={16} />
            </button>
            <button className="p-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors">
              <Settings size={16} />
            </button>
            <button
              onClick={handleStartRegistration}
              className={`p-2 rounded-2xl transition-colors ${
                isNewUser
                  ? "bg-blue-600 text-white hover:bg-blue-700 animate-pulse"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* New User Alert */}
        {showNewUserAlert && isNewUser && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Info size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm">Welcome to Vendor Registration!</h3>
                  <p className="text-blue-700 text-sm">
                    You haven't started your registration yet. Click the + button to begin your vendor registration
                    process.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartRegistration}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Start Registration
                </button>
                <button onClick={() => setShowNewUserAlert(false)} className="p-1 text-blue-400 hover:text-blue-600">
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
  title="Registration Status"
  value={isNewUser ? "Not Started" : vendorData ? getStatusText(vendorData.registrationStatus) : "Loading..."}
  icon={vendorData ? getStatusIcon(vendorData.registrationStatus).type : AlertCircle}
  color={
    !vendorData 
      ? "gray"
      : vendorData.registrationStatus === "approved"
        ? "green"
        : vendorData.registrationStatus === "under_review"
          ? "blue"
          : vendorData.registrationStatus === "rejected"
            ? "red"
            : "amber"
  }
  subtitle="Current status"
/>
        <MetricCard
  title="Completion"
  value={vendorData ? vendorData.metrics.completionPercentage : 0}
  suffix="%"
  icon={TrendingUp}
  color="green"
  subtitle="Progress made"
/>
<MetricCard
  title="Days in Review"
  value={isNewUser ? "0" : vendorData ? vendorData.metrics.daysInReview : 0}
  icon={Clock}
  color="purple"
  subtitle="Processing time"
/>
<MetricCard
  title="Vendor ID"
  value={isNewUser ? "N/A" : vendorData ? vendorData.id?.slice(-8) : "Loading..."}
  icon={Award}
  color="amber"
  subtitle="Your identifier"
/>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Registration Progress</h3>
            </div>
          </div>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div
              className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 transition-all duration-1000"
            style={{
  height: vendorData ? `${(vendorData.timeline.filter((item) => item.completed).length / vendorData.timeline.length) * 100}%` : "0%",
}}
            ></div>

           <div className="space-y-4">
  {vendorData && vendorData.timeline.map((item, index) => (
    <TimelineStep key={index} item={item} index={index} isNewUser={isNewUser} />
  ))}
</div>
          </div>
        </div>

        {/* Tab Navigation - Only show if not a new user */}
        {!isNewUser && vendorData && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-6 px-4">
                {[
                  { id: "overview", label: "Business Overview", icon: Building },
                  { id: "documents", label: "Documents", icon: FileText },
                  { id: "contact", label: "Contact Information", icon: Phone },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4">
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                    <button
                      onClick={handleEditRegistration}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Edit size={14} />
                      Edit Information
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vendorData.basicInfo &&
                      Object.entries(vendorData.basicInfo).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-xl p-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          </label>
                          <p className="text-gray-900 font-medium text-sm">{value || "N/A"}</p>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "documents" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>

                  {vendorData.documents ? (
                    <div className="space-y-3">
                      <DocumentCard
                        document={vendorData.documents.powerOfAttorney}
                        onDownload={handleDownloadDocument}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded yet</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "contact" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

                  {vendorData.contactInfo ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-blue-600" />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Authorized User</p>
                            <p className="text-gray-700 text-sm">{vendorData.contactInfo.authorizedUser}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone size={18} className="text-blue-600" />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Phone Number</p>
                            <p className="text-gray-700 text-sm">{vendorData.contactInfo.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-blue-600" />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Email Address</p>
                            <p className="text-gray-700 text-sm">{vendorData.contactInfo.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Phone size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No contact information available</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* New User Call-to-Action Card */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our vendor network by completing the registration process. It only takes a few minutes to submit your
              business information and required documents.
            </p>
            <button
              onClick={handleStartRegistration}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your Registration
            </button>
          </motion.div>
        )}
      </main>

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
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  notificationType === "success"
                    ? "bg-green-500"
                    : notificationType === "error"
                      ? "bg-red-500"
                      : "bg-blue-500"
                }`}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
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
