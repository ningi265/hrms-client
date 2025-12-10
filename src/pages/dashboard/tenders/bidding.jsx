import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  FileText,
  DollarSign,
  Calendar,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Award,
  X,
} from "lucide-react"

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Loading..." }) => {
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

// Bid Evaluation Component
const BidEvaluation = ({ bid, onEvaluate, onAward }) => {
  const [evaluation, setEvaluation] = useState({
    technicalScore: bid.technicalScore || 0,
    financialScore: bid.financialScore || 0,
    comments: bid.evaluationComments || '',
    recommendation: bid.recommendation || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onEvaluate(bid._id, evaluation)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <h4 className="font-semibold text-gray-900 mb-3">Bid Evaluation</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Technical Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={evaluation.technicalScore}
              onChange={(e) => setEvaluation(prev => ({...prev, technicalScore: e.target.value}))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Financial Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={evaluation.financialScore}
              onChange={(e) => setEvaluation(prev => ({...prev, financialScore: e.target.value}))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Evaluation Comments
          </label>
          <textarea
            value={evaluation.comments}
            onChange={(e) => setEvaluation(prev => ({...prev, comments: e.target.value}))}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
            placeholder="Provide detailed evaluation comments..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Recommendation
          </label>
          <select
            value={evaluation.recommendation}
            onChange={(e) => setEvaluation(prev => ({...prev, recommendation: e.target.value}))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
          >
            <option value="">Select recommendation</option>
            <option value="award">Award Contract</option>
            <option value="shortlist">Shortlist</option>
            <option value="reject">Reject</option>
          </select>
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            Save Evaluation
          </button>
          {bid.status !== 'awarded' && (
            <button
              type="button"
              onClick={() => onAward(bid._id)}
              className="flex-1 px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
            >
              <Award size={14} />
              Award Bid
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

// Bid Card Component
const BidCard = ({ bid, onEvaluate, onAward }) => {
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{bid.vendor?.businessName}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <User size={12} />
            <span>{bid.vendor?.contactPerson}</span>
            <Mail size={12} />
            <span>{bid.vendor?.vendor?.email}</span>
            <Phone size={12} />
            <span>{bid.vendor?.phone}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">{formatCurrency(bid.bidAmount)}</div>
          <div className="text-xs text-gray-500">Bid Amount</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Technical Score</p>
          <p className="text-sm font-medium">
            {bid.technicalScore ? `${bid.technicalScore}/100` : 'Not evaluated'}
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

      {bid.documents && bid.documents.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Supporting Documents</p>
          <div className="flex flex-wrap gap-1">
            {bid.documents.map((doc, idx) => (
              <button
                key={idx}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download size={12} />
                {doc.name || `Document ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          bid.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
          bid.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
          bid.status === 'awarded' ? 'bg-green-100 text-green-800' :
          bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {bid.status.replace('_', ' ')}
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEvaluate(bid)}
            className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            Evaluate
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CompanyBidPortal() {
  const [tender, setTender] = useState(null)
  const [bids, setBids] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBid, setSelectedBid] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tenderId = searchParams.get('tenderId')

  const backendUrl = import.meta.env.VITE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV

  // Fetch tender and bids
  useEffect(() => {
    if (tenderId) {
      fetchTenderAndBids()
    }
  }, [tenderId])

  const fetchTenderAndBids = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      
      // Fetch tender details
      const tenderResponse = await fetch(`${backendUrl}/api/tenders/${tenderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!tenderResponse.ok) throw new Error('Failed to fetch tender details')
      const tenderData = await tenderResponse.json()
      setTender(tenderData.data || tenderData)

      // Fetch bids for this tender
      const bidsResponse = await fetch(`${backendUrl}/api/bids/tender/${tenderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json()
        setBids(bidsData.data || bidsData)
      } else {
        setBids([])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvaluateBid = async (bidId, evaluation) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/bids/${bidId}/evaluate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evaluation)
      })

      if (response.ok) {
        setNotificationMessage('Bid evaluation saved successfully!')
        setNotificationType('success')
        setShowNotification(true)
        setSelectedBid(null)
        fetchTenderAndBids() // Refresh data
      } else {
        throw new Error('Failed to save evaluation')
      }
    } catch (err) {
      setNotificationMessage('Error saving evaluation')
      setNotificationType('error')
      setShowNotification(true)
    }
  }

  const handleAwardBid = async (bidId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/bids/${bidId}/award`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })

      if (response.ok) {
        setNotificationMessage('Bid awarded successfully!')
        setNotificationType('success')
        setShowNotification(true)
        fetchTenderAndBids() // Refresh data
      } else {
        throw new Error('Failed to award bid')
      }
    } catch (err) {
      setNotificationMessage('Error awarding bid')
      setNotificationType('error')
      setShowNotification(true)
    }
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

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (!tenderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tender selected</h3>
          <p className="mt-1 text-sm text-gray-500">Please select a tender to view bids.</p>
          <button
            onClick={() => navigate('/tenders')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Tenders
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading tender</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => navigate('/tenders')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Tenders
          </button>
        </div>
      </div>
    )
  }

  const daysRemaining = tender ? getDaysRemaining(tender.deadline) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay isVisible={isLoading} message="Loading tender details..." />

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

      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/tenders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Tenders
          </button>
          
          {tender && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{tender.title}</h1>
                  <p className="text-gray-600">{tender.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{formatCurrency(tender.budget)}</div>
                  <div className="text-sm text-gray-500">Budget</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tender.category}</div>
                    <div className="text-xs text-gray-500">Category</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tender.location}</div>
                    <div className="text-xs text-gray-500">Location</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(tender.deadline)}</div>
                    <div className="text-xs text-gray-500">Deadline</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <div className={`text-sm font-medium ${
                      daysRemaining <= 7 ? 'text-red-600' : 
                      daysRemaining <= 14 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                    </div>
                    <div className="text-xs text-gray-500">Status</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bids Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bids List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Vendor Bids ({bids.length})</h2>
              <div className="text-sm text-gray-500">
                {bids.filter(b => b.status === 'awarded').length} awarded
              </div>
            </div>

            {bids.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bids received yet</h3>
                <p className="text-gray-500">Vendor bids will appear here once submitted.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <BidCard
                    key={bid._id}
                    bid={bid}
                    onEvaluate={setSelectedBid}
                    onAward={handleAwardBid}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Evaluation Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {selectedBid ? (
                <BidEvaluation
                  bid={selectedBid}
                  onEvaluate={handleEvaluateBid}
                  onAward={handleAwardBid}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Bid Evaluation</h3>
                  <p className="text-sm text-gray-600">
                    Select a bid from the list to start evaluation and scoring.
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Bid Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Bids</span>
                    <span className="text-sm font-medium">{bids.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Under Review</span>
                    <span className="text-sm font-medium">
                      {bids.filter(b => b.status === 'under_review').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Awarded</span>
                    <span className="text-sm font-medium">
                      {bids.filter(b => b.status === 'awarded').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Bid</span>
                    <span className="text-sm font-medium">
                      {bids.length > 0 ? formatCurrency(
                        bids.reduce((sum, bid) => sum + bid.bidAmount, 0) / bids.length
                      ) : '$0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}