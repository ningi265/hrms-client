"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  Users,
  Award,
  Clock,
    Download, 
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
const TenderCard = ({ tender, onMenuClick, showMenuId, onViewTender, bidCounts }) => {
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
  const bidCount = bidCounts[tender._id] || 0

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
          <span className="text-xs text-gray-600">Bids Received</span>
          <span className="text-xs font-medium text-blue-600">{bidCount}</span>
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
          <button
            onClick={() => onViewTender(tender)}
            className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-1"
          >
            <Eye size={12} />
            View Bids
          </button>
        </div>
      </div>
    </div>
  )
}

// Tender Details Modal Component
// Tender Details Modal Component
const TenderDetailsModal = ({ tender, bids, isOpen, onClose, onAwardBid }) => {
  const [selectedBid, setSelectedBid] = useState(null)
  const [awarding, setAwarding] = useState(false)
  const [viewingDocuments, setViewingDocuments] = useState(null)

  if (!isOpen || !tender) return null

  const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV

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

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
 const downloadDocument = async (doc, vendorName, bidId) => {
  console.log("🚀 downloadDocument called with:", { doc, vendorName, bidId });
  
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('Not in browser environment');
    }
    
    if (!doc || !doc._id) {
      throw new Error('Invalid document object');
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('No authentication token found');
    }

    const downloadUrl = `${backendUrl}/api/bids/${bidId}/documents/${doc._id}/download`;
    console.log("🔗 Download URL:", downloadUrl);

    // Step 1: Make the request
    console.log("📡 Step 1: Making fetch request...");
    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Step 1 completed - Response status:", response.status);

    // Step 2: Check response status
    console.log("📊 Step 2: Checking response...");
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Response not OK:", { status: response.status, errorText });
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }
    console.log("✅ Step 2 completed - Response is OK");

    // Step 3: Get response headers
    console.log("📋 Step 3: Checking response headers...");
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    console.log("Response headers:", {
      contentType,
      contentLength,
      allHeaders: Object.fromEntries(response.headers.entries())
    });

    // Step 4: Convert to blob
    console.log("📦 Step 4: Converting to blob...");
    const blob = await response.blob();
    console.log("✅ Step 4 completed - Blob created:", {
      size: blob.size,
      type: blob.type
    });

    if (blob.size === 0) {
      throw new Error('Received empty file (0 bytes)');
    }

    // Step 5: Create object URL
    console.log("🔗 Step 5: Creating object URL...");
    const objectUrl = URL.createObjectURL(blob);
    console.log("✅ Step 5 completed - Object URL created:", objectUrl);

    // Step 6: Create download link - FIXED: Use global document
    console.log("📎 Step 6: Creating download link...");
    const link = document.createElement('a'); // Now this uses the global document
    console.log("✅ Link element created");

    // Step 7: Configure link
    link.href = objectUrl;
    
    // Create filename - FIXED: Use doc instead of document
    const fileExtension = doc.name?.split('.').pop() || 'pdf';
    const vendorSlug = (vendorName || 'unknown').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const docType = (doc.type || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${vendorSlug}_${docType}.${fileExtension}`;
    
    link.download = fileName;
    link.style.display = 'none';
    console.log("✅ Link configured with filename:", fileName);

    // Step 8: Trigger download
    console.log("🖱️ Step 8: Triggering download...");
    document.body.appendChild(link);
    console.log("✅ Link appended to body");
    
    link.click();
    console.log("✅ Link clicked");

    // Step 9: Cleanup
    console.log("🧹 Step 9: Cleaning up...");
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    console.log("✅ Cleanup completed");

    console.log("🎉 Download completed successfully!");

  } catch (error) {
    console.error('❌ Download error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Show detailed error alert
    alert(`Download failed:\n\n${error.message}\n\nCheck console for details.`);
  }
};
// View document function (opens in new tab)
const viewDocument = async (document, bidId) => {
  try {
    const token = localStorage.getItem("token")
    const viewUrl = `${backendUrl}/api/bids/${bidId}/documents/${document._id}/view`
    
    console.log("👀 Viewing document:", viewUrl)
    
    const response = await fetch(viewUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`View failed: ${response.status}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    
    // Open in new tab
    window.open(url, '_blank')
    
  } catch (error) {
    console.error('❌ Error viewing document:', error)
    alert(`Failed to view document: ${error.message}`)
  }
}

  const handleAwardBid = async (bid) => {
    setAwarding(true)
    try {
      await onAwardBid(bid)
      setSelectedBid(null)
    } catch (error) {
      console.error("Error awarding bid:", error)
    } finally {
      setAwarding(false)
    }
  }

  // Documents Modal Component
  const DocumentsModal = ({ bid, isOpen, onClose }) => {
    if (!isOpen || !bid) return null

    const getDocumentTypeName = (type) => {
      const typeMap = {
        'technical_proposal': 'Technical Proposal',
        'financial_proposal': 'Financial Proposal', 
        'company_profile': 'Company Profile',
        'certificate_of_incorporation': 'Certificate of Incorporation',
        'tax_clearance': 'Tax Clearance Certificate',
        'business_license': 'Business License'
      }
      return typeMap[type] || type.replace('_', ' ').toUpperCase()
    }

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1100]">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">Documents - {bid.vendor?.businessName}</h3>
              <p className="text-sm text-gray-600">View and download bid documents</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-2xl">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {bid.documents && bid.documents.length > 0 ? (
              <div className="space-y-4">
                {bid.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText size={20} className="text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {getDocumentTypeName(doc.type)}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>Original: {doc.name}</span>
                          <span>Size: {formatFileSize(doc.size)}</span>
                          <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
  <button
    onClick={() => viewDocument(doc, bid._id)}
    className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
  >
    <Eye size={16} />
    View
  </button>
 <button
  onClick={() => downloadDocument(doc, bid.vendor?.businessName, bid._id)}
  className="px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
>
  <Download size={16} />
  Download
</button>
</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No documents uploaded for this bid</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{tender.title}</h2>
            <p className="text-sm text-gray-600">Tender Details & Vendor Bids</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tender Details */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Tender Information</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="text-sm font-medium">{formatCurrency(tender.budget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm font-medium">{tender.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm font-medium">{tender.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Deadline</span>
                    <span className="text-sm font-medium">{formatDate(tender.deadline)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Urgency</span>
                    <span className={`text-sm font-medium ${
                      tender.urgency === 'high' ? 'text-red-600' : 
                      tender.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {tender.urgency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      tender.status === 'open' ? 'bg-green-100 text-green-800' :
                      tender.status === 'closed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tender.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Requirements</h3>
                <div className="space-y-2">
                  {tender.requirements && tender.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bids List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Vendor Bids ({bids.length})</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>Total Bids Received</span>
                </div>
              </div>

              {bids.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bids received yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div key={bid._id} className="bg-white border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{bid.vendor?.businessName}</h4>
                          <p className="text-sm text-gray-600">{bid.vendor?.vendor?.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {formatCurrency(bid.bidAmount)}
                            </div>
                            <div className="text-xs text-gray-500">Bid Amount</div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            bid.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            bid.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                            bid.status === 'awarded' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {bid.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Technical Score</p>
                          <p className="text-sm font-medium">
                            {bid.technicalScore || 'Not evaluated'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Submitted On</p>
                          <p className="text-sm font-medium">{formatDate(bid.submittedAt)}</p>
                        </div>
                      </div>

                      {bid.proposal && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Technical Proposal</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{bid.proposal}</p>
                        </div>
                      )}

                      {/* Documents Section */}
                      {bid.documents && bid.documents.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-2">Supporting Documents</p>
                          <div className="flex flex-wrap gap-2">
                            {bid.documents.map((doc, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                                onClick={() => setViewingDocuments(bid)}
                                title={`Click to view all documents from ${bid.vendor?.businessName}`}
                              >
                                {doc.type.replace('_', ' ')}
                                {idx < bid.documents.length - 1 ? ',' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedBid(bid)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-xl hover:bg-blue-600 transition-colors"
                          >
                            Evaluate
                          </button>
                          {bid.documents && bid.documents.length > 0 && (
                            <button 
                              onClick={() => setViewingDocuments(bid)}
                              className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-xl hover:bg-purple-600 transition-colors flex items-center gap-1"
                            >
                              <FileText size={12} />
                              View Documents ({bid.documents.length})
                            </button>
                          )}
                        </div>
                        {bid.status !== 'awarded' && (
                          <button
                            onClick={() => handleAwardBid(bid)}
                            disabled={awarding}
                            className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <Award size={12} />
                            {awarding ? 'Awarding...' : 'Award'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Evaluation Modal */}
      {selectedBid && (
        <BidEvaluationModal
          bid={selectedBid}
          isOpen={!!selectedBid}
          onClose={() => setSelectedBid(null)}
          onAward={handleAwardBid}
        />
      )}

      {/* Documents Modal */}
      {viewingDocuments && (
        <DocumentsModal
          bid={viewingDocuments}
          isOpen={!!viewingDocuments}
          onClose={() => setViewingDocuments(null)}
        />
      )}
    </div>
  )
}

// Bid Evaluation Modal Component
const BidEvaluationModal = ({ bid, isOpen, onClose, onAward }) => {
  const [evaluation, setEvaluation] = useState({
    technicalScore: bid.technicalScore || 0,
    financialScore: bid.financialScore || 0,
    comments: '',
    recommendation: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Here you would typically save the evaluation
    console.log('Evaluation submitted:', evaluation)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1100]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Evaluate Bid - {bid.vendor?.businessName}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-2xl">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={evaluation.technicalScore}
                onChange={(e) => setEvaluation(prev => ({...prev, technicalScore: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Financial Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={evaluation.financialScore}
                onChange={(e) => setEvaluation(prev => ({...prev, financialScore: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluation Comments
            </label>
            <textarea
              value={evaluation.comments}
              onChange={(e) => setEvaluation(prev => ({...prev, comments: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl"
              placeholder="Provide detailed evaluation comments..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendation
            </label>
            <select
              value={evaluation.recommendation}
              onChange={(e) => setEvaluation(prev => ({...prev, recommendation: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl"
            >
              <option value="">Select recommendation</option>
              <option value="award">Award Contract</option>
              <option value="shortlist">Shortlist</option>
              <option value="reject">Reject</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Save Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function TendersPage() {
  const [tenders, setTenders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTender, setSelectedTender] = useState(null)
  const [tenderBids, setTenderBids] = useState([])
  const [showTenderModal, setShowTenderModal] = useState(false)
  const [bidCounts, setBidCounts] = useState({})
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV

  const navigate = useNavigate()


  // Fetch tenders
  useEffect(() => {
    const fetchTenders = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/tenders/company`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.ok) {
          const data = await response.json()
          // Set ALL tenders, not just open ones
          const allTenders = data.data || data || []
          setTenders(allTenders)
          
          // Fetch bid counts for each tender
          allTenders.forEach(tender => fetchBidCount(tender._id))
        }
      } catch (err) {
        setError("Failed to load tenders")
        console.error("Error fetching tenders:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenders()
  }, [backendUrl])

  // Fetch bid count for a tender
 const fetchBidCount = async (tenderId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/bids/tender/${tenderId}/count`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setBidCounts(prev => ({
          ...prev,
          [tenderId]: data.count || 0
        }))
      }
    } catch (err) {
      console.error("Error fetching bid count:", err)
    }
  }

  // Fetch bids for a tender
  const fetchTenderBids = async (tenderId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/bids/tender/${tenderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setTenderBids(data.data || data)
      } else {
        setTenderBids([])
      }
    } catch (err) {
      console.error("Error fetching tender bids:", err)
      setTenderBids([])
    }
  }

 const handleViewTender = async (tender) => {
    setSelectedTender(tender)
    await fetchTenderBids(tender._id)
    setShowTenderModal(true)
  }

   const handleAwardBid = async (bid) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/bids/${bid._id}/award`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })

      if (response.ok) {
        setNotificationMessage(`Bid awarded to ${bid.vendor?.businessName} successfully!`)
        setNotificationType("success")
        setShowNotification(true)
        
        // Refresh the bids list
        if (selectedTender) {
          await fetchTenderBids(selectedTender._id)
        }
      } else {
        throw new Error('Failed to award bid')
      }
    } catch (err) {
      setNotificationMessage('Error awarding bid')
      setNotificationType("error")
      setShowNotification(true)
    }
  }


   const handleCloseTenderModal = () => {
    setShowTenderModal(false)
    setSelectedTender(null)
    setTenderBids([])
  }

  // Filter tenders based on search term
  const filteredTenders = tenders.filter((tender) => {
    // Status filter
    const statusMatch = statusFilter === "all" || tender.status === statusFilter;
    
    // Search term filter
    const titleMatch = tender.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const companyMatch = tender.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const categoryMatch = tender.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const locationMatch = tender.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false

    const searchMatch = titleMatch || companyMatch || categoryMatch || locationMatch

    return statusMatch && searchMatch
  })

  // Calculate stats
   const totalTenders = tenders.length
  const openTenders = tenders.filter((tender) => tender.status === "open").length
  const closedTenders = tenders.filter((tender) => tender.status === "closed").length
  const awardedTenders = tenders.filter((tender) => tender.status === "awarded").length
  const cancelledTenders = tenders.filter((tender) => tender.status === "cancelled").length
  const totalValue = tenders.reduce((sum, tender) => sum + (tender.budget || 0), 0)
  const avgBudget = totalTenders > 0 ? totalValue / totalTenders : 0
  const totalBids = Object.values(bidCounts).reduce((sum, count) => sum + count, 0)

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
    // Refresh data
    const fetchTenders = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/tenders/company`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.ok) {
          const data = await response.json()
          const allTenders = data.data || data || []
          setTenders(allTenders)
          
          // Refresh bid counts
          allTenders.forEach(tender => fetchBidCount(tender._id))
        }
      } catch (err) {
        console.error("Error refreshing tenders:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTenders()
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
      <LoadingOverlay isVisible={isLoading} message="Loading tenders..." />

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
                <AlertTriangle size={16} className="flex-shrink-0" />
              )}
              <span className="text-sm font-medium leading-tight">{notificationMessage}</span>
              <button 
                onClick={() => setShowNotification(false)} 
                className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
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
            <h1 className="text-2xl font-bold text-gray-900">Company Tenders</h1>
            <p className="text-gray-600">Manage and review tender applications</p>
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
           <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
            >
              <option value="all">All Status ({totalTenders})</option>
              <option value="open">Open ({openTenders})</option>
              <option value="closed">Closed ({closedTenders})</option>
              <option value="awarded">Awarded ({awardedTenders})</option>
              <option value="cancelled">Cancelled ({cancelledTenders})</option>
            </select>
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

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Tenders"
            value={totalTenders}
            icon={FileText}
            color="blue"
            subtitle="Active opportunities"
          />
          <MetricCard
            title="Open Tenders"
            value={openTenders}
            icon={CheckCircle}
            color="green"
            subtitle="Currently accepting bids"
          />
          <MetricCard
            title="Total Value"
            value={formatBudget(totalValue)}
            icon={DollarSign}
            color="purple"
            subtitle="Combined tender value"
          />
          <MetricCard
            title="Total Bids"
            value={totalBids}
            icon={Users}
            color="orange"
            subtitle="Bids received"
          />
        </div>

        {/* Tender Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Active Tenders</h3>
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
                {searchTerm ? "No tenders match your search" : "No active tenders"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms to find relevant tenders."
                  : "Create new tenders to start receiving vendor bids."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTenders.map((tender) => (
                <TenderCard
                  key={tender._id}
                  tender={tender}
                  onViewTender={handleViewTender}
                  bidCounts={bidCounts}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Tender Details Modal */}
      {selectedTender && (
        <TenderDetailsModal
          tender={selectedTender}
          bids={tenderBids}
          isOpen={showTenderModal}
          onClose={handleCloseTenderModal}
          onAwardBid={handleAwardBid}
        />
      )}
    </div>
  )
}