"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Clock,
  AlertCircle,
  FileText,
  Users,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Download,
  Send,
  Eye,
  Edit,
  Share2,
  Printer,
  Bookmark,
  AlertTriangle,
  Shield,
  Award,
  Package,
  Layers,
  Target,
  FileCheck,
  BarChart,
  Percent,
  Clock4,
   Loader 
} from "lucide-react"
import { motion } from "framer-motion"



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

export default function TenderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tender, setTender] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isApplying, setIsApplying] = useState(false)
  const [userBid, setUserBid] = useState(null)
  const [showBidForm, setShowBidForm] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [bidProposal, setBidProposal] = useState("")
  const [attachments, setAttachments] = useState([])
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" })

  const backendUrl = import.meta.env.VITE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

  // Check if user is logged in as vendor
  const isVendorLoggedIn = () => {
    // Check for vendor token in localStorage
    const token = localStorage.getItem('vendorToken');
    return !!token;
  };

  const getVendorId = () => {
    const vendorData = localStorage.getItem('vendorData');
    return vendorData ? JSON.parse(vendorData)._id : null;
  };

  useEffect(() => {
  const fetchTenderDetails = async () => {
    setLoading(true)
    try {
      // Fetch tender details
      const tenderRes = await fetch(`${backendUrl}/api/tenders/${id}`)
      
      if (!tenderRes.ok) {
        throw new Error(`HTTP error! status: ${tenderRes.status}`)
      }
      
      const response = await tenderRes.json()
      const tenderData = response.data 
      
      // Check if data exists
      if (!tenderData) {
        throw new Error("Tender data not found")
      }
      
      setTender(tenderData)

      // If user is logged in as vendor, check for existing bid
      if (isVendorLoggedIn()) {
        const vendorId = getVendorId()
        const bidRes = await fetch(`${backendUrl}/api/bids/tender/${id}/vendor/${vendorId}`)
        
        if (bidRes.ok) {
          const bidData = await bidRes.json()
          if (bidData) {
            setUserBid(bidData)
          }
        }
      }

    } catch (err) {
      console.error("Error fetching tender details:", err)
      setError("Failed to load tender details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  fetchTenderDetails()
}, [id, backendUrl])

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }
      case "under_review":
        return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" }
      case "closed":
        return { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" }
      case "awarded":
        return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" }
      case "cancelled":
        return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" }
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" }
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatBudget = (budget) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MWK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  }

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateTimeRemaining = () => {
    if (!tender?.deadline) return null
    
    const days = getDaysRemaining(tender.deadline)
    
    if (days > 30) {
      return `${Math.floor(days / 30)} months ${days % 30} days`
    } else if (days > 0) {
      return `${days} days`
    } else {
      return "Expired"
    }
  }

  const handleStartApplication = () => {
    if (!isVendorLoggedIn()) {
      setNotification({
        show: true,
        message: "Please login as a vendor to apply for this tender",
        type: "info"
      })
      setTimeout(() => navigate("/login"), 2000)
      return
    }

    if (userBid) {
      setNotification({
        show: true,
        message: "You have already submitted a bid for this tender",
        type: "info"
      })
      return
    }

    setShowBidForm(true)
  }

  const handleSubmitBid = async (e) => {
    e.preventDefault()
    
    if (!isVendorLoggedIn()) {
      setNotification({
        show: true,
        message: "Please login to submit a bid",
        type: "error"
      })
      return
    }

    setIsApplying(true)
    
    try {
      const vendorId = getVendorId()
      const formData = new FormData()
      formData.append('tenderId', id)
      formData.append('vendorId', vendorId)
      formData.append('amount', bidAmount)
      formData.append('proposal', bidProposal)
      
      // Add attachments if any
      attachments.forEach(file => {
        formData.append('attachments', file)
      })

      const response = await fetch(`${backendUrl}/api/bids`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const bidData = await response.json()
        setUserBid(bidData)
        setShowBidForm(false)
        setNotification({
          show: true,
          message: "Bid submitted successfully!",
          type: "success"
        })
      } else {
        throw new Error("Failed to submit bid")
      }
    } catch (err) {
      setNotification({
        show: true,
        message: "Failed to submit bid. Please try again.",
        type: "error"
      })
    } finally {
      setIsApplying(false)
    }
  }

  const handleDownloadDocuments = async () => {
    // Implementation for downloading tender documents
    setNotification({
      show: true,
      message: "Downloading tender documents...",
      type: "info"
    })
  }

  const handleShareTender = () => {
    if (navigator.share) {
      navigator.share({
        title: tender?.title,
        text: `Check out this tender: ${tender?.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setNotification({
        show: true,
        message: "Link copied to clipboard!",
        type: "success"
      })
    }
  }

  if (loading) {
    return <LoadingOverlay isVisible={true} message="Loading tender details..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-red-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Tender</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Go Back
              </button>
              <button
                onClick={() => navigate("/public-tenders")}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Browse Tenders
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Tender Not Found</h3>
          <p className="text-gray-600 mb-6">The tender you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/public-tenders")}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse Available Tenders
          </button>
        </div>
      </div>
    )
  }

  const statusColors = getStatusColor(tender.status)
  const daysRemaining = getDaysRemaining(tender.deadline)
  const timeRemaining = calculateTimeRemaining()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isApplying} message="Submitting your bid..." />

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border shadow-sm ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : notification.type === "error" ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium flex-1">{notification.message}</span>
              <button
                onClick={() => setNotification({ ...notification, show: false })}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bid Form Modal */}
      {showBidForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Submit Your Bid</h3>
                <button
                  onClick={() => setShowBidForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Submit your proposal for: {tender.title}</p>
            </div>

            <form onSubmit={handleSubmitBid} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bid Amount (MWK)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid amount"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tender budget: {formatBudget(tender.budget)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technical Proposal
                </label>
                <textarea
                  required
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                  placeholder="Describe your approach, methodology, timeline, and why you're the best fit for this project..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload supporting documents (PDF, DOC, images)
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setAttachments(Array.from(e.target.files))}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBidForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying ? (
                    <>
                      <Clock className="w-4 h-4 inline mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 inline mr-2" />
                      Submit Bid
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4">
        {/* Header with Actions */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/public-tenders")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tenders
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{tender.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                  {tender.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {tender.company?.name || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {tender.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Posted: {formatDate(tender.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareTender}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Share tender"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadDocuments}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                title="Download documents"
              >
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tender Overview
              </h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{tender.description}</p>
              </div>
              
              {tender.scopeOfWork && (
                <div className="mt-6">
                  <h3 className="font-bold text-gray-900 mb-3">Scope of Work</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{tender.scopeOfWork}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Requirements & Qualifications */}
            {tender.requirements && tender.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Requirements & Qualifications
                </h2>
                <div className="space-y-3">
                  {tender.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents & Attachments */}
            {tender.documents && tender.documents.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Tender Documents
                </h2>
                <div className="space-y-3">
                  {tender.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">{doc.size}</div>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Tender Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Tender Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-bold text-gray-900">{formatBudget(tender.budget)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Deadline</span>
                  <span className="font-bold text-gray-900">{formatDate(tender.deadline)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Remaining</span>
                  <span className={`font-bold ${daysRemaining <= 7 ? "text-red-600" : daysRemaining <= 14 ? "text-yellow-600" : "text-green-600"}`}>
                    {timeRemaining}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{tender.category}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Urgency</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(tender.urgency)}`}>
                    {tender.urgency.toUpperCase()}
                  </span>
                </div>
                
                {tender.deliveryTimeline && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Timeline</span>
                    <span className="font-medium text-gray-900">{tender.deliveryTimeline}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{tender.company?.name}</div>
                    <div className="text-sm text-gray-600">{tender.company?.type}</div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  {tender.contactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${tender.contactEmail}`} className="text-blue-600 hover:underline">
                        {tender.contactEmail}
                      </a>
                    </div>
                  )}
                  
                  {tender.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${tender.contactPhone}`} className="text-blue-600 hover:underline">
                        {tender.contactPhone}
                      </a>
                    </div>
                  )}
                  
                  {tender.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a href={tender.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Ready to Bid?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {userBid 
                    ? "You've already submitted a bid for this tender"
                    : "Submit your proposal before the deadline"
                  }
                </p>
              </div>
              
              {userBid ? (
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Bid Submitted</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Bid:</span>
                        <span className="font-medium">{formatBudget(userBid.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium capitalize">{userBid.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{formatDate(userBid.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/vendor/bids/${userBid._id}`)}
                    className="w-full px-4 py-3 bg-white border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Your Bid
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tender.status === "open" && daysRemaining > 0 ? (
                    <>
                      <button
                        onClick={handleStartApplication}
                        disabled={!isVendorLoggedIn()}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isVendorLoggedIn() ? "Submit Bid Now" : "Login to Bid"}
                      </button>
                      {!isVendorLoggedIn() && (
                        <p className="text-xs text-gray-600 text-center">
                          <Link to="/login" className="text-blue-600 hover:underline">
                            Register as vendor
                          </Link>{" "}
                          to submit bids
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <XCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {tender.status === "closed" 
                          ? "This tender is now closed for submissions"
                          : daysRemaining <= 0 
                            ? "The submission deadline has passed"
                            : "Submissions are not currently accepted"
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock4 className="w-4 h-4" />
                  <span>Deadline: {formatDate(tender.deadline)}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-medium text-gray-900">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bids Submitted</span>
                  <span className="font-medium text-gray-900">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shortlisted</span>
                  <span className="font-medium text-green-600">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-blue-600">21.7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(tender.additionalInfo || tender.termsConditions) && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h2>
            
            {tender.additionalInfo && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Additional Information</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{tender.additionalInfo}</p>
                </div>
              </div>
            )}
            
            {tender.termsConditions && (
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Terms & Conditions</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{tender.termsConditions}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related Tenders */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Similar Tenders</h2>
            <Link to="/public-tenders" className="text-sm text-blue-600 hover:underline">
              View all tenders →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Placeholder for related tenders - you would fetch these from API */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="text-sm text-gray-600 mb-1">Construction</div>
              <h4 className="font-bold text-gray-900 mb-2">Road Construction Project</h4>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Budget: MWK 50M</span>
                <span className="text-green-600 font-medium">12 days left</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="text-sm text-gray-600 mb-1">IT Services</div>
              <h4 className="font-bold text-gray-900 mb-2">Website Development</h4>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Budget: MWK 5M</span>
                <span className="text-yellow-600 font-medium">5 days left</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="text-sm text-gray-600 mb-1">Consulting</div>
              <h4 className="font-bold text-gray-900 mb-2">Business Strategy Consulting</h4>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Budget: MWK 15M</span>
                <span className="text-red-600 font-medium">Expired</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}