
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
  Plus,
  Clock,
  Download, 
} from "lucide-react"
import { motion } from "framer-motion"

const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV

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

const TenderDetailsModal = ({ tender, bids, isOpen, onClose, onAwardBid }) => {
  const [selectedBid, setSelectedBid] = useState(null)
  const [awarding, setAwarding] = useState(false)
  const [viewingDocuments, setViewingDocuments] = useState(null)

  if (!isOpen || !tender) return null

  const bidsArray = Array.isArray(bids) ? bids : []
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
      month: 'short',
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
    try {
      if (!doc || !doc._id) return
      
      const token = localStorage.getItem("token")
      const downloadUrl = `${backendUrl}/api/bids/${bidId}/documents/${doc._id}/download`
      
      const response = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      const fileExtension = doc.name?.split('.').pop() || 'pdf'
      const vendorSlug = (vendorName || 'unknown').replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const docType = (doc.type || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const fileName = `${vendorSlug}_${docType}.${fileExtension}`
      
      link.href = objectUrl
      link.download = fileName
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(objectUrl)
      
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    }
  }

  const viewDocument = async (document, bidId) => {
    try {
      const token = localStorage.getItem("token")
      const viewUrl = `${backendUrl}/api/bids/${bidId}/documents/${document._id}/view`
      
      const response = await fetch(viewUrl, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('View failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      
    } catch (error) {
      console.error('Error viewing document:', error)
      alert('Failed to view document')
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
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl mr-16">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">Docs - {bid.vendor?.businessName}</h3>
              <p className="text-xs text-gray-600 truncate">Bid documents</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-2xl flex-shrink-0 ml-2">
              <X size={16} />
            </button>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {bid.documents && bid.documents.length > 0 ? (
              <div className="space-y-2">
                {bid.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText size={16} className="text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-xs truncate">
                          {getDocumentTypeName(doc.type)}
                        </h4>
                        <div className="flex flex-col text-xs text-gray-600 mt-0.5">
                          <span className="truncate">{doc.name}</span>
                          <span>{formatFileSize(doc.size)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 ml-2">
                      <button
                        onClick={() => viewDocument(doc, bid._id)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Eye size={12} />
                        View
                      </button>
                      <button
                        onClick={() => downloadDocument(doc, bid.vendor?.businessName, bid._id)}
                        className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Download size={12} />
                        DL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-xs">No documents uploaded</p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-500 text-white text-xs rounded-xl hover:bg-gray-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-end p-4 z-[1000]">
      {/* Shifted right with mr-8 and reduced width */}
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl mr-8">
        
        {/* Compact Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-gray-900 truncate">{tender.title}</h2>
            <p className="text-xs text-gray-600">Tender Details & Bids</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors flex-shrink-0 ml-2"
          >
            <X size={16} />
          </button>
        </div>

        {/* Compact Body */}
        <div className="p-4 max-h-[75vh] overflow-y-auto">
          {/* Single column layout for better fit */}
          <div className="flex flex-col gap-3">
            
            {/* Tender Details */}
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-2xl p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Tender Information</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">Budget</span>
                    <span className="text-xs font-medium">{formatCurrency(tender.budget)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">Category</span>
                    <span className="text-xs font-medium">{tender.category}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">Location</span>
                    <span className="text-xs font-medium">{tender.location}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">Deadline</span>
                    <span className="text-xs font-medium">{formatDate(tender.deadline)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">Urgency</span>
                    <span className={`text-xs font-medium ${
                      tender.urgency === 'high' ? 'text-red-600' : 
                      tender.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {tender.urgency}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">Status</span>
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

              {tender.requirements && tender.requirements.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">Requirements</h3>
                  <div className="flex flex-wrap gap-1">
                    {tender.requirements.map((req, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bids List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">Vendor Bids ({bidsArray.length})</h3>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Users size={12} />
                  <span>Total Bids</span>
                </div>
              </div>

              {bidsArray.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-2xl">
                  <FileText size={28} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-gray-600 text-xs">No bids received yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {bidsArray.map((bid) => (
                    <div key={bid._id} className="bg-white border border-gray-200 rounded-2xl p-2">
                      <div className="flex flex-col gap-1.5 mb-1.5">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">{bid.vendor?.businessName}</h4>
                            <p className="text-xs text-gray-600 truncate">{bid.vendor?.vendor?.email}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-600">
                                {formatCurrency(bid.bidAmount)}
                              </div>
                              <div className="text-xs text-gray-500">Bid</div>
                            </div>
                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                              bid.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                              bid.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                              bid.status === 'awarded' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {bid.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-600">Tech Score</p>
                            <p className="text-xs font-medium">
                              {bid.technicalScore || 'Not evaluated'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Submitted</p>
                            <p className="text-xs font-medium">{formatDate(bid.submittedAt)}</p>
                          </div>
                        </div>

                        {bid.proposal && (
                          <div>
                            <p className="text-xs text-gray-600">Proposal</p>
                            <p className="text-xs text-gray-700 line-clamp-1">{bid.proposal}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedBid(bid)}
                            className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-xl hover:bg-blue-600 transition-colors"
                          >
                            Evaluate
                          </button>
                          {bid.documents && bid.documents.length > 0 && (
                            <button 
                              onClick={() => setViewingDocuments(bid)}
                              className="px-2 py-0.5 bg-purple-500 text-white text-xs font-medium rounded-xl hover:bg-purple-600 transition-colors flex items-center gap-0.5"
                            >
                              <FileText size={10} />
                              Docs
                            </button>
                          )}
                        </div>
                        {bid.status !== 'awarded' && (
                          <button
                            onClick={() => handleAwardBid(bid)}
                            disabled={awarding}
                            className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-0.5"
                          >
                            <Award size={10} />
                            {awarding ? '...' : 'Award'}
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
  const [isCreateTenderModalOpen, setIsCreateTenderModalOpen] = useState(false)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [requisitions, setRequisitions] = useState([])
  const [formData, setFormData] = useState({
      title: "",
      description: "",
      budget: "",
      location: "",
      urgency: "medium",
      category: "",
      deadline: "",
      requisitionId: "",
      requirements: []
    })
  
  

  const navigate = useNavigate()

  const openCreateTenderModal = () => {
    setIsCreateTenderModalOpen(true)
  }

  const closeCreateTenderModal = () => {
    setIsCreateTenderModalOpen(false)
    setFormData({
      title: "",
      description: "",
      budget: "",
      location: "",
      urgency: "medium",
      category: "",
      deadline: "",
      requisitionId: "",
      requirements: []
    })
  }

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "requirements") {
      const reqs = value.split(",").map((r) => r.trim());
      setFormData((prev) => ({ ...prev, requirements: reqs }));
    } else if (name === "requisitionId") {
      const selectedReq = requisitions.find((req) => req._id === value);
      setFormData((prev) => ({
        ...prev,
        requisitionId: value,
        budget: selectedReq ? selectedReq.estimatedCost : "",
        urgency: selectedReq ? selectedReq.urgency : "medium",
        category: selectedReq ? selectedReq.category : "",
        location: selectedReq ? selectedReq.location : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsFormSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/tenders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()

      if (response.ok) {
        const newTender = responseData.tender || responseData.data || responseData
        setTenders((prev) => Array.isArray(prev) ? [...prev, newTender] : [newTender])
        showNotificationMessage("Tender created successfully!", "success")
        closeCreateTenderModal()
      } else {
        throw new Error(responseData.message || "Failed to create tender")
      }
    } catch (err) {
      showNotificationMessage(err.message || "Failed to create tender", "error")
      console.error("Failed to create tender:", err)
    } finally {
      setIsFormSubmitting(false)
    }
  }

 // Replace the useEffect with this improved version:
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      
      const [tendersRes, requisitionsRes] = await Promise.all([
        fetch(`${backendUrl}/api/tenders/company`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${backendUrl}/api/requisitions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      let tendersData = []
      let requisitionsData = []

      if (tendersRes.ok) {
        const response = await tendersRes.json()
        tendersData = response.data || response || []
        setTenders(tendersData)
      }

      if (requisitionsRes.ok) {
        const response = await requisitionsRes.json()
        requisitionsData = Array.isArray(response) ? response : response.data || []
        const approvedRequisitions = requisitionsData.filter(req => req.status === "approved")
        const tenderRequisitions = approvedRequisitions.filter(req => 
          req.estimatedCost > 1000 || req.urgency === "high"
        )
        setRequisitions(tenderRequisitions)
      }

      // Fetch bid counts for each tender
      const bidCountPromises = tendersData.map(async (tender) => {
        try {
          const bidsRes = await fetch(`${backendUrl}/api/bids/tender/${tender._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (bidsRes.ok) {
            const bidsData = await bidsRes.json()
            // Handle different response structures for bids
            let bidsArray = []
            if (Array.isArray(bidsData)) {
              bidsArray = bidsData
            } else if (bidsData.data && Array.isArray(bidsData.data)) {
              bidsArray = bidsData.data
            } else if (bidsData.bids && Array.isArray(bidsData.bids)) {
              bidsArray = bidsData.bids
            }
            return { tenderId: tender._id, count: bidsArray.length }
          }
          return { tenderId: tender._id, count: 0 }
        } catch (error) {
          console.error(`Error fetching bids for tender ${tender._id}:`, error)
          return { tenderId: tender._id, count: 0 }
        }
      })

      const bidCountResults = await Promise.all(bidCountPromises)
      const bidCountsMap = {}
      bidCountResults.forEach(result => {
        bidCountsMap[result.tenderId] = result.count
      })
      setBidCounts(bidCountsMap)

    } catch (err) {
      setError("Failed to load data. Please try again.")
      console.error("Error fetching data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  fetchData()
}, [backendUrl])


const handleViewTender = async (tender) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${backendUrl}/api/bids/tender/${tender._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.ok) {
      const responseData = await response.json()
      
    
      let bidsData = []
      if (Array.isArray(responseData)) {
        bidsData = responseData
      } else if (responseData.data && Array.isArray(responseData.data)) {
        bidsData = responseData.data
      } else if (responseData.bids && Array.isArray(responseData.bids)) {
        bidsData = responseData.bids
      } else if (typeof responseData === 'object' && responseData !== null) {
     
        bidsData = [responseData]
      }
      
      console.log('Bids data:', bidsData) 
      setTenderBids(bidsData)
      setSelectedTender(tender)
      setShowTenderModal(true)
    } else {
      throw new Error("Failed to fetch bids")
    }
  } catch (error) {
    console.error("Error fetching bids:", error)
    showNotificationMessage("Failed to load tender details", "error")

    setTenderBids([])
    setSelectedTender(tender)
    setShowTenderModal(true)
  }
}

  const handleAwardBid = async (bid) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/bids/${bid._id}/award`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        showNotificationMessage(`Bid awarded to ${bid.vendor.businessName} successfully!`, "success")
        
        // Refresh the bids data
        if (selectedTender) {
          const bidsRes = await fetch(`${backendUrl}/api/bids/tender/${selectedTender._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (bidsRes.ok) {
            const bidsData = await bidsRes.json()
            setTenderBids(bidsData)
          }
        }
      } else {
        throw new Error("Failed to award bid")
      }
    } catch (error) {
      console.error("Error awarding bid:", error)
      showNotificationMessage("Failed to award bid", "error")
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Filter tenders based on search term and status
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = 
      tender.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || tender.status === statusFilter

    return matchesSearch && matchesStatus
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
            <h1 className="text-2xl font-bold text-gray-900">Tender Management</h1>
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
              className="px-3 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="closed">Closed</option>
              <option value="awarded">Awarded</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openCreateTenderModal}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-2xl font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
              Create Tender
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
            subtitle="All tender opportunities"
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
            title="Avg Budget"
            value={formatBudget(avgBudget)}
            icon={BarChart3}
            color="orange"
            subtitle="Average tender budget"
          />
        </div>

        {/* Tender Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Tender List</h3>
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
                {searchTerm || statusFilter !== "all" ? "No tenders match your criteria" : "No tenders available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search terms or status filter to find relevant tenders."
                  : "Create a new tender to get started."}
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
      {showTenderModal && (
        <TenderDetailsModal
          tender={selectedTender}
          bids={tenderBids}
          isOpen={showTenderModal}
          onClose={() => setShowTenderModal(false)}
          onAwardBid={handleAwardBid}
        />
      )}

      {/* Create Tender Modal */}
      {isCreateTenderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Create Tender</h2>
              <button
                onClick={closeCreateTenderModal}
                className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Title + Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Supply of Medical Equipment"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Medical Supplies"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Requisition */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Requisition *</label>
                  <select
                    name="requisitionId"
                    value={formData.requisitionId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                  >
                    <option value="">Select requisition</option>
                    {requisitions.map((req) => (
                      <option key={req._id} value={req._id}>
                        {req.itemName} ({req.budgetCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Scope / Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Provide detailed description of goods/services"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                  />
                </div>

                {/* Requirements + Technical Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Requirements *</label>
                    <input
                      type="text"
                      name="requirements"
                      value={(formData.requirements || []).join(", ")}
                      onChange={handleInputChange}
                      placeholder="e.g., License, 5+ yrs exp, ISO Cert"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Technical Specs</label>
                    <input
                      type="text"
                      name="technicalSpecs"
                      value={formData.technicalSpecs || ""}
                      onChange={handleInputChange}
                      placeholder="Key specs"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Budget + Payment Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Budget *</label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 500000"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Payment Terms</label>
                    <input
                      type="text"
                      name="paymentTerms"
                      value={formData.paymentTerms || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., 30% advance"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Deadline + Evaluation Criteria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Deadline *</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Evaluation Criteria</label>
                    <input
                      type="text"
                      name="evaluationCriteria"
                      value={formData.evaluationCriteria || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., 60% tech / 40% finance"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Urgency + Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Urgency *</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      placeholder="Location"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeCreateTenderModal}
                    className="px-4 py-2 text-xs text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isFormSubmitting}
                    className="px-4 py-2 text-xs bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFormSubmitting ? (
                      <>
                        <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                        Creating...
                      </>
                    ) : (
                      "Create Tender"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
