"use client"

import { useState, useEffect} from "react"
import {
  FileText,
  Search,
  MoreVertical,
  X,
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
  Plus,
  Save
} from "lucide-react"

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
            data-tender-id={tender._id}
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
      </div>
    </div>
  )
}

export default function CreateTendersPage() {
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
  const [isCreateTenderModalOpen, setIsCreateTenderModalOpen] = useState(false)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const [requisitions, setRequisitions] = useState([]);
  const [formData, setFormData] = useState({
      title: "",
      description: "",
      budget: "",
      location: "",
      urgency: "Medium",
      category: "",
      deadline: "",
      requisitionId: "",
      requirements: []
    })
     const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;



const openCreateTendersModal = () => {
    setIsCreateTenderModalOpen(true)
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
      urgency: selectedReq ? selectedReq.urgency : "Medium",
      category: selectedReq ? selectedReq.category : "",
    }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};



  const closeCreateTenderModal = () => {
    setIsCreateTenderModalOpen(false)
    setFormData({
      title: "",
      description: "",
      budget: "",
      location: "",
      urgency: "Medium",
      category: "",
      deadline: "",
      requisitionId: "",
      requirements: []

    })
  }

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
        // Handle both response structures
        const newTender = responseData.tender || responseData.data || responseData
        setTenders((prev) => Array.isArray(prev) ? [...prev, newTender] : [newTender])
        showNotificationMessage("Tender created successfully!", "success")
        closeCreateTenderModal()
      } else {
        throw new Error(responseData.message || "Failed to add department")
      }
    } catch (err) {
      showNotificationMessage(err.message || "Failed to add department", "error")
      console.error("Failed to add department:", err)
    } finally {
      setIsFormSubmitting(false)
    }
  }


  useEffect(() => {
    setTenders(tenders)
  }, [])


  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      
      const [requisitionsRes] = await Promise.all([
        fetch(`${backendUrl}/api/requisitions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);
  
      const [requisitionsData] = await Promise.all([
        requisitionsRes.json(),
      ]);
  
      if (requisitionsRes.ok) {
        const approvedRequisitions = requisitionsData.filter(req => req.status === "approved");
        setRequisitions(approvedRequisitions);
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
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      
      const [tendersRes] = await Promise.all([
        fetch(`${backendUrl}/api/tenders/company`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);
  
      const [tendersData] = await Promise.all([
       tendersRes.json(),
      ]);
  
     if (tendersRes.ok) {
 const opentenders = (tendersData.data || []).filter(t => t.status === "open");
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

  const handleStartPreApproval = (tender) => {
    setSelectedTender(tender)
    setNotificationMessage(
      `Pre-approval process started for "${tender.title}". You will receive an email with next steps.`,
    )
    setNotificationType("success")
    setShowNotification(true)

    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 5000)
  }

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
            
            </button>
            <button
              onClick={openCreateTendersModal}
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
                  key={tender._id}
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

       {isCreateTenderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Compact Header */}
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  Create New Tender 
                </h2>
                <button
                  onClick={closeCreateTenderModal}
                  className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Compact Form Body */}
            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Medical Equipment Supply"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                     Requisitions *
                    </label>
                    <select
                      name="requisitionId"
                      value={formData.requisitionId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                     <option value="">Select requisition</option>
  {requisitions.map((req) => (
    <option key={req._id} value={req._id}>
      {req.itemName} ({req.budgetCode})
    </option>
                      ))}
                    </select>
                  </div>
                </div>
      
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Tender purpose and specifications"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Downtown District"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Requirements (comma-separated)
  </label>
  <input
    type="text"
    name="requirements"
   value={(formData.requirements || []).join(", ")}
    onChange={handleInputChange}
    placeholder="e.g., Licensed Contractor, 5+ Years Experience, Green Building Cert"
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
  />
</div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                     Deadline *
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                     Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Medical Supplies"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Budget *
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 500000"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Urgency *
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                 
                </div>
                {/* Compact Footer */}
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
                      <>
                        Create Tender
                      </>
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


