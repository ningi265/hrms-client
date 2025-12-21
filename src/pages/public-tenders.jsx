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


export default function PublicTendersPage() {
  const [tenders, setTenders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTender, setSelectedTender] = useState(null)
  const [showMenuId, setShowMenuId] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
  const [showNewUserAlert, setShowNewUserAlert] = useState(false)
  const backendUrl = import.meta.env.VITE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

  const navigate = useNavigate()

  const [appliedTenders, setAppliedTenders] = useState({})
  const [statusFilter, setStatusFilter] = useState("all")


const TenderCard = ({ tender, onMenuClick, showMenuId, onStartPreApproval, hasApplied }) => {
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
      currency: "MWK",
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
            <p className="text-xs text-gray-500">{tender.company?.name || "N/A"}</p>
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
          {hasApplied ? (
            <button
              onClick={() => {
                // Navigate to login/registration for vendors to view their bids
                navigate("/login");
              }}
              className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-1"
            >
              <Eye size={12} />
              Login to View
            </button>
          ) : (
            tender.status === "open" && daysRemaining > 0 && (
              <button
                onClick={() => onStartPreApproval(tender)}
                className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <Send size={12} />
                Apply Now
              </button>
            )
          )}
          <button 
            onClick={() => {
              // Navigate to tender details page or show more info
              navigate(`/tender/${tender._id}`);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

  
  useEffect(() => {
    setTenders(tenders)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // PUBLIC ENDPOINT - No authentication needed
        const tendersRes = await fetch(`${backendUrl}/api/tenders`);
        
        if (tendersRes.ok) {
          const tendersData = await tendersRes.json();
          setTenders(tendersData);
        } else {
          throw new Error("Failed to load tenders");
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
  const totalValue = tenders.reduce((sum, tender) => sum + (tender.budget || 0), 0)
  const avgBudget = totalTenders > 0 ? totalValue / totalTenders : 0

  const formatBudget = (budget) => {
    if (budget >= 1000000) {
      return `MWK ${(budget / 1000000).toFixed(1)}M`
    } else if (budget >= 1000) {
      return `MWK ${(budget / 1000).toFixed(0)}K`
    }
    return `MWK ${budget}`
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Refresh data
    const fetchData = async () => {
      try {
        const tendersRes = await fetch(`${backendUrl}/api/tenders`);
        if (tendersRes.ok) {
          const tendersData = await tendersRes.json();
          setTenders(tendersData);
        }
      } catch (err) {
        console.error("Error refreshing data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }

  const handleStartPreApproval = async (tender) => {
    setSelectedTender(tender);
    
    // For public users, redirect to vendor registration/login
    setNotificationMessage("Please register or login as a vendor to apply for this tender");
    setNotificationType("info");
    setShowNotification(true);
    
    // Redirect to vendor registration page after a short delay
    setTimeout(() => {
      navigate("/vendor-registration");
    }, 2000);
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

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Public Tenders Portal</h1>
              <p className="text-gray-600">Browse and apply for business opportunities - No login required to view</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-xl text-sm">
                <span className="font-medium">Total Value: </span>
                <span>{formatBudget(totalValue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-3">
            <div className="text-sm text-gray-600 mb-1">Total Tenders</div>
            <div className="text-2xl font-bold text-gray-900">{totalTenders}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-3">
            <div className="text-sm text-gray-600 mb-1">Open Tenders</div>
            <div className="text-2xl font-bold text-green-600">{openTenders}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-3">
            <div className="text-sm text-gray-600 mb-1">Closed Tenders</div>
            <div className="text-2xl font-bold text-red-600">{closedTenders}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-3">
            <div className="text-sm text-gray-600 mb-1">Avg. Budget</div>
            <div className="text-2xl font-bold text-blue-600">{formatBudget(avgBudget)}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tenders by title, company, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open Only</option>
                <option value="closed">Closed</option>
                <option value="awarded">Awarded</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Vendor Registration
              </button>
            </div>
          </div>
        </div>

        {/* Tender Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Available Tenders</h3>
              <span className="text-sm text-gray-500">({filteredTenders.length} results)</span>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredTenders.length} of {totalTenders} tenders
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
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTenders.map((tender) => (
                <TenderCard
                  key={tender._id || tender.id}
                  tender={tender}
                  onMenuClick={handleMenuClick}
                  showMenuId={showMenuId}
                  actionLoading={actionLoading}
                  onStartPreApproval={handleStartPreApproval}
                  hasApplied={false} // Public users haven't applied
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action for Vendors */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Ready to Apply?</h3>
          <p className="text-blue-800 mb-4">
            Register as a vendor to start bidding on tenders and grow your business
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Register as Vendor
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              Vendor Login
            </button>
          </div>
        </div>
      </main>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`p-3 rounded-xl border shadow-sm ${
              notificationType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : notificationType === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {notificationType === "success" ? (
                <CheckCircle size={16} className="flex-shrink-0" />
              ) : notificationType === "error" ? (
                <AlertTriangle size={16} className="flex-shrink-0" />
              ) : (
                <Info size={16} className="flex-shrink-0" />
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
    </div>
  )
}