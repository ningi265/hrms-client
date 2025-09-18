"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Search,
  MoreVertical,
  X,
  Info,
  Mail,
  Eye,
  RefreshCw,
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Loader,
  Send,
} from "lucide-react"
import { motion } from "framer-motion"

// LoadingOverlay Component
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

// MetricCard Component
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

// Tender Card Component
const TenderCard = ({ tender, onMenuClick, showMenuId, onDelete, actionLoading, onStartPreApproval }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      case "awarded":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const formatBudget = (budget) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining(tender.deadline)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div>
            <h4 className="font-semibold text-sm text-gray-900">{tender.title}</h4>
            <p className="text-xs text-gray-500">{tender.company.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tender.status)}`}>
            {tender.status.replace("_", " ")}
          </span>
          <button
            data-tender-id={tender.id}
            onClick={() => onMenuClick(tender.id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">{formatBudget(tender.budget)}</div>
          <div className="text-xs text-gray-500">Budget</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div
            className={`text-base font-bold ${daysRemaining <= 7 ? "text-red-600" : daysRemaining <= 14 ? "text-yellow-600" : "text-green-600"}`}
          >
            {daysRemaining > 0 ? `${daysRemaining}d` : "Expired"}
          </div>
          <div className="text-xs text-gray-500">Days Left</div>
        </div>
      </div>

      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Category</span>
          <span className="text-xs font-medium">{tender.category}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Location</span>
          <span className="text-xs font-medium">{tender.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Deadline</span>
          <span className="text-xs font-medium">{formatDate(tender.deadline)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Urgency</span>
          <span className={`text-xs font-medium ${getUrgencyColor(tender.urgency)}`}>{tender.urgency}</span>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-600 mb-1">Description</div>
        <p className="text-xs text-gray-800 line-clamp-2">{tender.description}</p>
      </div>

      {tender.requirements && tender.requirements.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Requirements</div>
          <div className="flex flex-wrap gap-1">
            {tender.requirements.slice(0, 2).map((req, idx) => (
              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                {req}
              </span>
            ))}
            {tender.requirements.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{tender.requirements.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail size={12} />
          <span className="truncate">{tender.contactEmail}</span>
        </div>
        <div className="flex gap-1">
          {tender.status === "open" && daysRemaining > 0 && (
            <button
              onClick={() => onStartPreApproval(tender)}
              className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              <Send size={12} />
              Apply
            </button>
          )}
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-xl">
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TendersPage() {
  const [tenders, setTenders] = useState([])
  const [vendorData, setVendorData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTender, setSelectedTender] = useState(null)
  const [showMenuId, setShowMenuId] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
  const [isNewUser, setIsNewUser] = useState(false)
    const [showNewUserAlert, setShowNewUserAlert] = useState(false)
       const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV;

  
  useEffect(() => {
    setTenders(tenders)
  }, [])


        useEffect(() => {
     const fetchData = async () => {
       setIsLoading(true);
       try {
         const token = localStorage.getItem("token");
         
         
         const [tendersRes] = await Promise.all([
           fetch(`${backendUrl}/api/tenders`, {
             headers: { Authorization: `Bearer ${token}` }
           }),
         ]);
     
         const [tendersData] = await Promise.all([
          tendersRes.json(),
         ]);
     
        if (tendersRes.ok) {
     const opentenders = tendersData.filter(t => t.status === "open");
     setTenders(opentenders);
   }
   
       } catch (err) {
         setError("Failed to load data. Please try again.");
         console.error("Error fetching data:", err);
       } finally {
         setIsLoading(false);
       }
     };
     
         fetchData();
       }, [backendUrl]);

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

  // Filter tenders based on search term
  const filteredTenders = tenders.filter((tender) => {
    const titleMatch = tender.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const companyMatch = tender.company.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const categoryMatch = tender.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const locationMatch = tender.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false

    return titleMatch || companyMatch || categoryMatch || locationMatch
  })

  // Calculate stats
  const totalTenders = tenders.length
  const openTenders = tenders.filter((tender) => tender.status === "open").length
  const totalValue = tenders.reduce((sum, tender) => sum + (tender.budget || 0), 0)
  const avgBudget = totalTenders > 0 ? totalValue / totalTenders : 0

  const formatBudget = (budget) => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`
    } else if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(0)}K`
    }
    return `$${budget}`
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

const handleStartPreApproval = async (tender) => {
  setSelectedTender(tender);
  setIsLoading(true);
  setNotificationMessage("");
  setNotificationType("success");

  try {
    const token = localStorage.getItem("token");

    // Step 1: Check if prequalification exists
    const response = await fetch(
      `${backendUrl}/api/prequalifications/vendor/${vendorData.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    let preQual = null;

    if (response.ok) {
      const resData = await response.json();
      preQual = resData.data;
    }

    // Step 2: If not found, create one
    if (!preQual) {
      const createRes = await fetch(`${backendUrl}/api/prequalifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ vendorId: vendorData.id }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create pre-qualification record");
      }

      const created = await createRes.json();
      preQual = created.data;
    }

    // Step 3: Send email with pre-qualification results instead of UI notification
    const emailResponse = await fetch(`${backendUrl}/api/vendors/send-pre-qual-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tenderTitle: tender.title,
        preQualStatus: preQual.status,
        preQualScore: preQual.score,
        vendorId: vendorData.id,
      }),
    });

    if (emailResponse.ok) {
      setNotificationMessage(
        "Pre-qualification results have been sent to your email address."
      );
      setNotificationType("success");
    } else {
      throw new Error("Failed to send email notification");
    }

  } catch (err) {
    console.error("Pre-qualification error:", err);
    setNotificationMessage("Error processing pre-qualification. Please try again.");
    setNotificationType("error");
  } finally {
    setShowNotification(true);
    setIsLoading(false);
    setTimeout(() => setShowNotification(false), 5000);
  }
};



  const handleMenuClick = (tenderId) => {
    setShowMenuId(showMenuId === tenderId ? null : tenderId)
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
      <LoadingOverlay isVisible={isLoading} message="Loading tenders..." />

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`p-4 rounded-2xl border ${
              notificationType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {notificationType === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              <span className="text-sm font-medium">{notificationMessage}</span>
              <button onClick={() => setShowNotification(false)} className="ml-2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
      
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Available Tenders</h1>
            <p className="text-gray-600">Browse and apply for business opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

          {showNewUserAlert && isNewUser && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-xl">
                          <Info size={20} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-red-700 text-sm">
                            You haven't started your registration yet. Click the registration link to begin your vendor registration
                            process.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Tenders"
            value={totalTenders}
            icon={FileText}
            color="blue"
            subtitle="Available opportunities"
          />
          <MetricCard
            title="Open Tenders"
            value={openTenders}
            icon={CheckCircle}
            color="green"
            trend={8}
            subtitle="Currently accepting bids"
          />
          <MetricCard
            title="Total Value"
            value={formatBudget(totalValue)}
            icon={DollarSign}
            color="purple"
            trend={15}
            subtitle="Combined tender value"
          />
          <MetricCard
            title="Avg Budget"
            value={formatBudget(avgBudget)}
            icon={BarChart3}
            color="orange"
            trend={-3}
            subtitle="Average tender budget"
          />
        </div>

        {/* Tender Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Available Tenders</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {filteredTenders.length} of {totalTenders} tenders
              </span>
            </div>
          </div>

          {filteredTenders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No tenders match your search" : "No tenders available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms to find relevant tenders."
                  : "Check back later for new tender opportunities."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTenders.map((tender) => (
                <TenderCard
                  key={tender.id}
                  tender={tender}
                  onMenuClick={handleMenuClick}
                  showMenuId={showMenuId}
                  actionLoading={actionLoading}
                  onStartPreApproval={handleStartPreApproval}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
