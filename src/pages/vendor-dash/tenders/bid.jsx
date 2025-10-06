

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FileText,
  DollarSign,
  Calendar,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  ArrowLeft,
  User,
  Mail,
  Phone,
} from "lucide-react"

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Loading..." }) => {
  console.log("LoadingOverlay rendered:", { isVisible, message })
  if (!isVisible) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  console.log("StatusBadge rendered:", { status })
  const getStatusConfig = (status) => {
    switch (status) {
      case "submitted":
        return { color: "bg-blue-100 text-blue-800", label: "Submitted" }
      case "under_review":
        return { color: "bg-yellow-100 text-yellow-800", label: "Under Review" }
      case "technical_evaluation":
        return { color: "bg-purple-100 text-purple-800", label: "Technical Evaluation" }
      case "financial_evaluation":
        return { color: "bg-indigo-100 text-indigo-800", label: "Financial Evaluation" }
      case "awarded":
        return { color: "bg-green-100 text-green-800", label: "Awarded" }
      case "rejected":
        return { color: "bg-red-100 text-red-800", label: "Not Awarded" }
      default:
        return { color: "bg-gray-100 text-gray-800", label: "Pending" }
    }
  }

  const config = getStatusConfig(status)
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  )
}

// Timeline Component
const BidTimeline = ({ currentStatus }) => {
  console.log("BidTimeline rendered:", { currentStatus })
  const steps = [
    { id: "submitted", label: "Bid Submitted", description: "Your bid has been received" },
    { id: "under_review", label: "Under Review", description: "Initial document review" },
    { id: "technical_evaluation", label: "Technical Evaluation", description: "Technical compliance check" },
    { id: "financial_evaluation", label: "Financial Evaluation", description: "Price and financial assessment" },
    { id: "awarded", label: "Award Decision", description: "Final award decision" },
  ]

  const getStepStatus = (stepId) => {
    const stepOrder = steps.map(step => step.id)
    const currentIndex = stepOrder.indexOf(currentStatus)
    const stepIndex = stepOrder.indexOf(stepId)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "upcoming"
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Bid Status Timeline</h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    status === "completed"
                      ? "bg-green-500 text-white"
                      : status === "current"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-1 ${
                      status === "completed" ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{step.label}</h4>
                  {status === "current" && (
                    <div className="flex items-center gap-1 text-blue-600 text-sm">
                      <Clock size={14} />
                      <span>In Progress</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Document Upload Component
const DocumentUpload = ({ tender, onDocumentUpload }) => {
  console.log("DocumentUpload rendered:", { tender: tender?.title })
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    console.log("File upload triggered:", files.length, "files")
    if (files.length === 0) return

    setUploading(true)
    try {
      console.log("Starting file upload simulation...")
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("File upload simulation complete")
      onDocumentUpload(files)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  // Default documents if none provided
  const requiredDocuments = [
  { id: "technical_proposal", name: "Technical Proposal" },
  { id: "financial_proposal", name: "Financial Proposal" },
  { id: "company_profile", name: "Company Profile" },
];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Required Documents</h3>
      <div className="space-y-3">
        {requiredDocuments.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-gray-400" />
              <div>
                <p className="font-medium text-sm text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {doc.uploaded ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept={doc.accept}
                  />
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors">
                    {uploading ? "Uploading..." : "Upload"}
                  </div>
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function VendorBidPortal({ 
  tenderId: propTenderId, 
  vendorId: propVendorId, 
  bidId: propBidId 
}) {
  console.log("=== VENDOR BID PORTAL COMPONENT MOUNTED ===")
  console.log("Current pathname:", window.location.pathname)
  console.log("Full URL:", window.location.href)
  console.log("Search params:", window.location.search)

  const [tender, setTender] = useState(null)
  const [bid, setBid] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
  const [urlParams, setUrlParams] = useState(null)

  const [bidAmount, setBidAmount] = useState(bid?.bidAmount || "")
const [proposal, setProposal] = useState(bid?.proposal || "")
const [uploadedDocuments, setUploadedDocuments] = useState({})
const [canSubmit, setCanSubmit] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV

  console.log("Backend URL:", backendUrl)
  console.log("Environment:", process.env.REACT_APP_ENV)


  

  const requiredDocuments = [
  { 
    id: "technical_proposal", 
    name: "Technical Proposal", 
    description: "Detailed technical solution", 
    accept: ".pdf,.doc,.docx" 
  },
  { 
    id: "financial_proposal", 
    name: "Financial Proposal", 
    description: "Detailed cost breakdown", 
    accept: ".pdf,.xlsx,.xls" 
  },
  { 
    id: "company_profile", 
    name: "Company Profile", 
    description: "Company background and experience", 
    accept: ".pdf,.doc,.docx" 
  }
]

useEffect(() => {
  const allUploaded = requiredDocuments.every(doc => 
    uploadedDocuments[doc.id]?.uploaded
  )
  setCanSubmit(allUploaded && bidAmount && proposal)
}, [uploadedDocuments, bidAmount, proposal])





  

  // Get URL parameters safely
  useEffect(() => {
     console.log("🔍 useEffect [mount] - Reading URL parameters and props")
  console.log("Props received:", { propTenderId, propVendorId, propBidId })
    const searchParams = new URLSearchParams(window.location.search)
   console.log("URL Search Params:", {
    urlTenderId: searchParams.get('tenderId'),
    urlVendorId: searchParams.get('vendorId'),
    urlBidId: searchParams.get('bidId')
  })
  
  // Use props if provided, otherwise fall back to URL parameters
  const params = {
    tenderId: propTenderId || searchParams.get('tenderId'),
    vendorId: propVendorId || searchParams.get('vendorId'),
    bidId: propBidId || searchParams.get('bidId')
  }
   console.log("📋 Final Parameters after merge:", params)
  
    
      
  if (!params.tenderId || !params.vendorId) {
    console.warn("⚠️ Missing required parameters:", params)
    const errorMsg = "Invalid link parameters. Please make sure you're using a valid bid invitation link from the Tenders page."
    setError(errorMsg)
    setIsLoading(false)
    return
  }
    
     console.log("✅ Parameters validated, setting urlParams")
  setUrlParams(params)
}, [propTenderId, propVendorId, propBidId])

  // Fetch data when URL parameters are available
  useEffect(() => {
    if (!urlParams) {
      console.log("🔄 Skipping data fetch - urlParams not set yet")
      return
    }

    console.log("🚀 useEffect [urlParams] - Starting data fetch with:", urlParams)
    
    const fetchBidData = async () => {
  const { tenderId, vendorId } = urlParams
  
  if (!tenderId || !vendorId) {
    const errorMsg = "Invalid link parameters. Please make sure you're using a valid bid invitation link."
    console.error("❌ Parameter validation failed:", { tenderId, vendorId })
    setError(errorMsg)
    setIsLoading(false)
    return
  }

  try {
    console.log("🔐 Checking authentication token...")
    const token = localStorage.getItem("token")
    console.log("Token available:", !!token)
    
    if (!token) {
      const errorMsg = "Please log in to access the bid portal"
      console.error("❌ No authentication token found")
      setError(errorMsg)
      setIsLoading(false)
      return
    }

    console.log("📡 Fetching tender details...")
    console.log("Tender ID:", tenderId)
    console.log("Full API URL:", `${backendUrl}/api/tenders/${tenderId}`)
    
    // Fetch tender details
    const tenderResponse = await fetch(`${backendUrl}/api/tenders/${tenderId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log("Tender response status:", tenderResponse.status)
    console.log("Tender response headers:", tenderResponse.headers)
    
    if (!tenderResponse.ok) {
      // Try to get more detailed error info
      const errorText = await tenderResponse.text()
      console.error("❌ Tender fetch failed:", {
        status: tenderResponse.status,
        statusText: tenderResponse.statusText,
        errorText: errorText
      })
      
      if (tenderResponse.status === 404) {
        throw new Error(`Tender not found. The tender may have been removed or the ID is incorrect. Tender ID: ${tenderId}`)
      } else if (tenderResponse.status === 401) {
        throw new Error("Authentication failed. Please log in again.")
      } else {
        throw new Error(`Failed to fetch tender: ${tenderResponse.status} ${tenderResponse.statusText}`)
      }
    }
    
    const tenderData = await tenderResponse.json()
    console.log("✅ Tender data received:", tenderData)
    
    if (!tenderData) {
      throw new Error("Tender data is empty or invalid")
    }
    
    setTender(tenderData)


        // Fetch bid details
        console.log("📡 Fetching bid details...")
        try {
          const bidResponse = await fetch(`${backendUrl}/api/bids/vendor/${vendorId}/tender/${tenderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })

          console.log("Bid response status:", bidResponse.status)
          
          if (bidResponse.ok) {
            const bidData = await bidResponse.json()
            console.log("✅ Bid data received:", bidData)
            setBid(bidData)
          } else {
            console.log("ℹ️ No existing bid found or bid endpoint returned error:", bidResponse.status)
          }
        } catch (bidError) {
          console.log("ℹ️ Bid fetch error (may be normal for new bids):", bidError.message)
        }

        // Fetch vendor details
        console.log("📡 Fetching vendor details...")
        const vendorResponse = await fetch(`${backendUrl}/api/vendors/${vendorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        console.log("Vendor response status:", vendorResponse.status)
        
        if (vendorResponse.ok) {
          const vendorData = await vendorResponse.json()
          console.log("✅ Vendor data received:", vendorData)
          setVendor(vendorData)
        } else {
          throw new Error(`Failed to fetch vendor details: ${vendorResponse.status} ${vendorResponse.statusText}`)
        }

        console.log("🎉 All data fetched successfully!")
     } catch (err) {
    console.error("❌ Error fetching bid data:", err)
    console.error("Error stack:", err.stack)
    setError(err.message)
  } finally {
    console.log("🏁 Data fetch completed, setting isLoading to false")
    setIsLoading(false)
  }
}

    fetchBidData()
  }, [urlParams, backendUrl, navigate])


  const handleSubmitBid = async () => {
  setIsSubmitting(true)
  try {
    const token = localStorage.getItem("token")
    
    const response = await fetch(`${backendUrl}/api/bids/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bidId: bid?._id,
        tenderId: urlParams.tenderId,
        vendorId: urlParams.vendorId,
        bidAmount: parseFloat(bidAmount),
        proposal: proposal
      })
    })

    if (response.ok) {
      const result = await response.json()
      setBid(result.data)
      setNotificationMessage("Bid submitted successfully!")
      setNotificationType("success")
    } else {
      throw new Error("Failed to submit bid")
    }
  } catch (err) {
    console.error("Error submitting bid:", err)
    setNotificationMessage("Error submitting bid")
    setNotificationType("error")
  } finally {
    setIsSubmitting(false)
    setShowNotification(true)
  }
}

const handleDocumentUpload = async (files, documentType, documentName) => {
  console.log("📎 Document upload initiated:", { 
    files: files.length, 
    documentType, 
    tenderId: urlParams?.tenderId,
    vendorId: urlParams?.vendorId,
    bidId: bid?._id 
  })
  
  setIsLoading(true)
  try {
    const token = localStorage.getItem("token")
    const formData = new FormData()
    
    // Add all files - use the exact field name that multer expects
    files.forEach(file => {
      console.log("Adding file to formData:", file.name, file.type, file.size)
      formData.append('documents', file) // Must match multer field name
    })
    
    // Add text fields
    if (bid?._id) {
      formData.append('bidId', bid._id)
    } else {
      formData.append('bidId', 'new')
    }
    
    if (!urlParams?.tenderId) {
      throw new Error("Tender ID is missing")
    }
    formData.append('tenderId', urlParams.tenderId)
    
    if (!urlParams?.vendorId) {
      throw new Error("Vendor ID is missing")
    }
    formData.append('vendorId', urlParams.vendorId)
    
    if (!documentType) {
      throw new Error("Document type is missing")
    }
    formData.append('documentType', documentType)

    // Debug: Log FormData contents
    console.log("📤 FormData contents:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    const response = await fetch(`${backendUrl}/api/bids/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type header - let browser set it with boundary
      },
      body: formData
    })

    console.log("Upload response status:", response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Upload failed:", response.status, errorText)
      throw new Error(`Failed to upload ${documentName}: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    const successMsg = `${documentName} uploaded successfully`
    console.log("✅", successMsg, result)
    
    setNotificationMessage(successMsg)
    setNotificationType("success")
    setBid(result.data) // Update bid state with the response
    
    // Update uploaded documents state
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: { uploaded: true, name: documentName }
    }))
    
  } catch (err) {
    console.error("❌ Document upload error:", err)
    setNotificationMessage(`Error uploading ${documentName}: ${err.message}`)
    setNotificationType("error")
  } finally {
    setShowNotification(true)
    setIsLoading(false)
  }
}

  const DocumentUpload = ({ tender, onDocumentUpload }) => {
  const [uploading, setUploading] = useState(null)

    const handleFileUpload = async (event, documentId, documentName) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setUploading(documentId)
    try {
      await onDocumentUpload(files, documentId, documentName)
      // Update local state to mark as uploaded
      setUploadedDocuments(prev => ({
        ...prev,
        [documentId]: { uploaded: true, name: documentName }
      }))
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Required Documents</h3>
      <div className="space-y-3">
        {requiredDocuments.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-gray-400" />
              <div>
                <p className="font-medium text-sm text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploadedDocuments[doc.id]?.uploaded ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-xs">Uploaded</span>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, doc.id, doc.name)}
                    accept={doc.accept}
                    disabled={uploading === doc.id}
                  />
                  <div className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    uploading === doc.id 
                      ? "bg-gray-400 text-white cursor-not-allowed" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}>
                    {uploading === doc.id ? "Uploading..." : "Upload"}
                  </div>
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const BidForm = ({ bid, tender, onSubmit, isSubmitting }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Bid Details</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bid Amount (USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your bid amount"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Technical Proposal
          </label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your technical approach, methodology, and why you're the best choice for this tender..."
          />
        </div>
      </div>
    </div>
  )
}



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


 

  console.log("🔄 Component render state:", {
    isLoading,
    error,
    urlParams,
    tender: !!tender,
    bid: !!bid,
    vendor: !!vendor
  })

  // If no URL parameters yet, show loading
  if (!urlParams) {
    console.log("🕐 Rendering: Waiting for URL parameters...")
    return <LoadingOverlay isVisible={true} message="Initializing bid portal..." />
  }

  if (isLoading) {
    console.log("🕐 Rendering: Loading overlay...")
    return <LoadingOverlay isVisible={true} message="Loading bid details..." />
  }

  if (error) {
    console.log("❌ Rendering: Error state...")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Bid</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
           <button
  onClick={() => {
    console.log("🔙 Navigating back to tenders section")
    navigate('?section=tenders')
  }}
  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
>
  <ArrowLeft size={20} />
  <span>Back to Tenders</span>
</button>
            <button
              onClick={() => {
                console.log("🔄 Manual refresh triggered")
                window.location.reload()
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-left">
            <p className="text-xs text-gray-600 font-mono break-all">
              Debug Info:<br/>
              TenderID: {urlParams.tenderId}<br/>
              VendorID: {urlParams.vendorId}<br/>
              Path: {window.location.pathname}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!tender) {
    console.log("❌ Rendering: Tender not found state...")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Tender Not Found</h2>
          <p className="text-gray-600 mb-4">The tender you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/tenders')}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Back to Tenders
          </button>
        </div>
      </div>
    )
  }

  console.log("✅ Rendering: Main bid portal interface")
  return (
    <div className="min-h-screen bg-gray-50">

    {bid?.status !== "submitted" && (
  <div className="bg-white rounded-2xl border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-gray-900">Ready to Submit</h3>
        <p className="text-sm text-gray-600">
          {canSubmit 
            ? "All requirements completed. You can now submit your bid."
            : "Complete all required documents and bid details to submit."
          }
        </p>
      </div>
      <button
        onClick={handleSubmitBid}
        disabled={!canSubmit || isSubmitting}
        className={`px-6 py-3 rounded-xl font-medium transition-colors ${
          canSubmit && !isSubmitting
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit Bid"}
      </button>
    </div>
  </div>
)}

  
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`p-3 rounded-xl border shadow-sm ${
              notificationType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {notificationType === "success" ? (
                <CheckCircle size={16} className="flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{notificationMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header   <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
             
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tender.title}</h1>
                <p className="text-gray-600">Bid Submission Portal</p>
              </div>
            </div>
            {bid && <StatusBadge status={bid.status} />}
          </div>
        </div>
      </header>  */}
    

      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Tender Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Building className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Issuing Organization</p>
                    <p className="font-medium">{tender.company?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Estimated Budget</p>
                    <p className="font-medium">{formatCurrency(tender.budget)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{tender.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Submission Deadline</p>
                    <p className="font-medium">{formatDate(tender.deadline)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{tender.description}</p>
              </div>
            </div>

            {/* Bid Details */}
            {bid && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Your Bid Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Bid Amount</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(bid.bidAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="font-medium">{formatDate(bid.submittedAt)}</p>
                  </div>
                  {bid.proposal && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Technical Proposal</p>
                      <p className="text-gray-700 leading-relaxed">{bid.proposal}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Required Documents */}
            <DocumentUpload tender={tender} onDocumentUpload={handleDocumentUpload} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bid Timeline */}
            <BidTimeline currentStatus={bid?.status || "submitted"} />

            {/* Vendor Information */}
            {vendor && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vendor.vendor?.firstName} {vendor.vendor?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Authorized Representative</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-900">{vendor.businessName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-900">{vendor.vendor?.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-900">{vendor.vendor?.phoneNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Important Dates */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Important Dates</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Bid Submission</p>
                  <p className="text-xs text-gray-500">
                    {bid?.submittedAt ? formatDate(bid.submittedAt) : "Not submitted yet"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Technical Evaluation</p>
                  <p className="text-xs text-gray-500">Within 5 business days</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Award Decision</p>
                  <p className="text-xs text-gray-500">Within 15 business days</p>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Contact our procurement team for any questions about your bid submission.
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <p>📧 procurement@nexusmwi.com</p>
                <p>📞 +265 123 456 789</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}