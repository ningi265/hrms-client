"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format, differenceInDays } from "date-fns"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  Calendar,
  Check,
  CreditCard,
  DollarSign,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Info,
  Loader2,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  Wallet,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  Users,
  Bell,
  Eye,
  X,
  Plus,
  Building
} from "lucide-react"

// Custom Components matching vehicle-management.jsx style
const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={20} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className={trend > 0 ? 'text-emerald-500' : 'text-red-500'} />
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

const Alert = ({ type = "info", title, children, onClose }) => {
  const typeClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const iconClasses = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500"
  };

  const icons = {
    info: AlertCircle,
    success: Check,
    warning: AlertCircle,
    error: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]} mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${iconClasses[type]}`} />
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function FinanceProcessing() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showPerDiem, setShowPerDiem] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)
  const [exchangeRates, setExchangeRates] = useState({})
  const [perDiemRates, setPerDiemRates] = useState({})
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [travelRequests, setTravelRequests] = useState([])
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [perDiemDetails, setPerDiemDetails] = useState({
    dailyRate: 0,
    days: 0,
    totalAmount: 0,
    currency: "",
    additionalAllowance: 0,
    notes: "",
    categories: {}
  })

  const [transferDetails, setTransferDetails] = useState({
    cardNumber: "",
    cardType: "visa",
    accountHolder: "",
    amount: 0,
    currency: "",
    exchangeRate: 1,
    processingFee: 0,
    totalAmount: 0,
    transferDate: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  })

  const [notificationDetails, setNotificationDetails] = useState({
    recipient: "",
    subject: "",
    message: "",
    includeBreakdown: true,
    sendCopy: false,
  })

  // Sample exchange rates data
  const sampleExchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.82,
    SGD: 1.35,
    AUD: 1.53,
    CAD: 1.37,
    CNY: 7.24,
    INR: 83.12,
    BRL: 5.12,
    MWK: 1800,
  }

  // Sample per diem rates by country
  const samplePerDiemRates = {
    "lilongwe": { currency: "USD", rate: 100 },
    "default": { currency: "MWK", rate: 40000 }
  }

  // Initialize exchange rates and per diem rates
  useEffect(() => {
    setExchangeRates(sampleExchangeRates)
    setPerDiemRates(samplePerDiemRates)
  }, [])

  // Transform API data to match component structure
  const transformRequestData = (data) => {
    return data.map(request => ({
      id: request._id,
      employeeName: request.employee?.name || "Employee",
      employeeId: request.employee?._id,
      department: "Not specified",
      email: request.employee?.email || "No email",
      purpose: request.purpose,
      country: request.location || "Not specified",
      city: request.location || "Not specified",
      departureDate: new Date(request.departureDate),
      returnDate: new Date(request.returnDate),
      status: request.finalApproval === "approved" ? "approved" : "pending",
      financialStatus: request.financeStatus || "pending",
      perDiemAmount: request.payment?.perDiemAmount || (request.currency === "MWK" ? 100000 : 1000), 
      currency: request.currency || "USD",
      cardDetails: {
        lastFour: "1234",
        type: "VISA",
        holder: request.employee?.name || "Employee",
      },
      documents: request.documents || [],
      approvedBy: request.finalApprover || "System",
      approvedAt: new Date(request.finalApprovalDate || request.updatedAt),
      priority: "medium",
      travelType: request.travelType || "local"
    }))
  }

  // Filter travel requests based on search query and status filter
  const filteredRequests = travelRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.city.toLowerCase().includes(searchQuery.toLowerCase())
  
    const matchesStatus = filterStatus === "all" || request.financialStatus === filterStatus
  
    return matchesSearch && matchesStatus
  })

  // Set default selected request if none is selected
  useEffect(() => {
    if (!selectedRequest && filteredRequests.length > 0) {
      setSelectedRequest(filteredRequests[0])
    }
  }, [filteredRequests, selectedRequest])

  // Handle selecting a request
  const handleSelectRequest = (request) => {
    setSelectedRequest(request)
    setShowPerDiem(false)
    setShowTransfer(false)
    setShowNotification(false)

    // Reset form states
    if (request) {
      const travelDays = differenceInDays(request.returnDate, request.departureDate) + 1
      const locationRate = perDiemRates[request.city?.toLowerCase()] || perDiemRates["default"]

      setPerDiemDetails({
        dailyRate: locationRate.rate,
        days: travelDays,
        totalAmount: locationRate.rate * travelDays,
        currency: request.currency,
        additionalAllowance: 0,
        notes: "",
        categories: {}
      })

      setTransferDetails({
        cardNumber: `**** **** **** ${request.cardDetails.lastFour}`,
        cardType: request.cardDetails.type.toLowerCase(),
        accountHolder: request.cardDetails.holder,
        amount: 0,
        currency: request.currency,
        exchangeRate: exchangeRates[request.currency] || 1,
        processingFee: 0,
        totalAmount: 0,
        transferDate: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      })
    }
  }

  // Calculate per diem
  const calculatePerDiem = () => {
    setIsCalculating(true)

    // Simulate API call
    setTimeout(() => {
      const totalAmount =
        perDiemDetails.dailyRate * perDiemDetails.days + Number.parseFloat(perDiemDetails.additionalAllowance || 0)

      setPerDiemDetails({
        ...perDiemDetails,
        totalAmount: totalAmount,
      })

      setTransferDetails({
        ...transferDetails,
        amount: totalAmount,
        totalAmount: totalAmount + Number.parseFloat(transferDetails.processingFee || 0),
      })

      setIsCalculating(false)
      setShowPerDiem(false)
      setShowTransfer(true)
    }, 1500)
  }

  // Process fund transfer
  const processTransfer = async () => {
    setIsTransferring(true);
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendUrl}/api/travel-requests/${selectedRequest.id}/finance-process`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: perDiemDetails.totalAmount,
            currency: transferDetails.currency,
            processingFee: transferDetails.processingFee,
            totalAmount: transferDetails.totalAmount,
            transferDate: transferDetails.transferDate,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process transfer");
      }
  
      const data = await response.json();
  
      const updatedRequest = {
        ...selectedRequest,
        financialStatus: "processed",
        perDiemAmount: data.perDiemAmount,
        paymentDate: new Date(data.paymentDate || new Date()),
      };
  
      setSelectedRequest(updatedRequest);
      setTravelRequests(prevRequests =>
        prevRequests.map(req => 
          req.id === selectedRequest.id ? updatedRequest : req
        )
      );
  
      setNotificationDetails({
        recipient: selectedRequest.email,
        subject: `Travel Funds Transfer - ${selectedRequest.id.substring(0, 8)}`,
        message: `Dear ${selectedRequest.employeeName},\n\nWe are pleased to inform you that your per diem allowance for your upcoming trip to ${selectedRequest.city}, ${selectedRequest.country} has been processed. A total of ${data.perDiemAmount} ${transferDetails.currency} has been transferred to your ${selectedRequest.cardDetails.type} card ending in ${selectedRequest.cardDetails.lastFour}.\n\nThe funds should be available within 24 hours.\n\nIf you have any questions, please contact the Finance Department.\n\nSafe travels!`,
        includeBreakdown: true,
        sendCopy: true,
      });
  
      setShowNotification(true);
      setSnackbarMessage(`Successfully processed payment of ${data.perDiemAmount} ${transferDetails.currency}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
    } catch (error) {
      console.error("Transfer failed:", error);
      setSnackbarMessage(error.message || "Failed to process transfer");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsTransferring(false);
      setShowTransfer(false);
    }
  };

  // Send notification
  const sendNotification = () => {
    setIsSendingNotification(true)

    setTimeout(() => {
      setIsSendingNotification(false)

      const updatedRequest = {
        ...selectedRequest,
        financialStatus: "completed",
        transferredAt: new Date(),
      }
      setSelectedRequest(updatedRequest)

      setShowNotification(false)

      // Reset states
      setPerDiemDetails({
        dailyRate: 0,
        days: 0,
        totalAmount: 0,
        currency: "",
        additionalAllowance: 0,
        notes: "",
        categories: {}
      })

      setTransferDetails({
        cardNumber: "",
        cardType: "visa",
        accountHolder: "",
        amount: 0,
        currency: "",
        exchangeRate: 1,
        processingFee: 0,
        totalAmount: 0,
        transferDate: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      })

      setNotificationDetails({
        recipient: "",
        subject: "",
        message: "",
        includeBreakdown: true,
        sendCopy: false,
      })
    }, 1500)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        )
      case "processed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Activity size={14} className="mr-1" />
            Processed
          </span>
        )
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle size={14} className="mr-1" />
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        )
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">High</span>
      case "medium":
        return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">Medium</span>
      case "low":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Low</span>
      default:
        return null
    }
  }

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Update processing fee when amount changes
  useEffect(() => {
    if (transferDetails.amount > 0) {
      const fee = transferDetails.amount * 0.005
      const total = Number.parseFloat(transferDetails.amount) + fee

      setTransferDetails((prevDetails) => ({
        ...prevDetails,
        processingFee: fee,
        totalAmount: total,
      }))
    }
  }, [transferDetails.amount])

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/api/travel-requests/finance/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch approved travel requests");
        }
        const data = await response.json();
        setTravelRequests(transformRequestData(data));
      } catch (error) {
        console.error("Failed to fetch approved travel requests:", error);
        setSnackbarMessage("Failed to fetch approved travel requests");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovedRequests();
  }, [backendUrl]);

  // Calculate stats
  const getTotalRequests = () => filteredRequests.length
  const getPendingRequests = () => filteredRequests.filter(req => req.financialStatus === "pending").length
  const getProcessedRequests = () => filteredRequests.filter(req => req.financialStatus === "processed").length
  const getCompletedRequests = () => filteredRequests.filter(req => req.financialStatus === "completed").length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Loading Financial Processing</h2>
            <p className="text-gray-600">
              Please wait while we fetch the latest travel requests...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Requests Processing</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Process per diem calculations and fund transfers for approved travel requests</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>{getTotalRequests()} requests</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200">
              <Bell size={20} />
            </button>
            <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Requests" 
            value={getTotalRequests()}
            icon={FileText} 
            color="blue"
          />
          <MetricCard 
            title="Pending Processing" 
            value={getPendingRequests()}
            icon={Clock} 
            color="orange"
          />
          <MetricCard 
            title="Processed" 
            value={getProcessedRequests()}
            icon={Activity} 
            color="blue"
          />
          <MetricCard 
            title="Completed" 
            value={getCompletedRequests()}
            icon={CheckCircle} 
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Travel Requests */}
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Financial Requests</h2>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "pending"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("processed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "processed"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Processed
                </button>
              </div>
            </div>

            {/* Scrollable Requests List */}
            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
              {filteredRequests
                .filter((req) => activeTab === "all" || req.financialStatus === activeTab)
                .length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <FileText size={40} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} requests found</h3>
                  <p className="text-gray-600">All travel requests have been processed</p>
                </div>
              ) : (
                filteredRequests
                  .filter((req) => activeTab === "all" || req.financialStatus === activeTab)
                  .map((request) => (
                    <div
                      key={request.id}
                      onClick={() => handleSelectRequest(request)}
                      className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer ${
                        selectedRequest?.id === request.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.employeeName}</h3>
                          <p className="text-gray-600 text-sm">{request.id.substring(0, 8)}</p>
                        </div>
                        {getPriorityBadge(request.priority)}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Globe size={16} className="text-gray-400" />
                          <span className="text-sm">{request.city}, {request.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm">
                            {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium border border-blue-200">
                            {request.currency}
                          </span>
                          {request.financialStatus === "completed" && request.perDiemAmount && (
                            <span className="text-green-700 text-sm font-medium">
                              {formatCurrency(request.perDiemAmount, request.currency)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {request.financialStatus === "completed" && request.paymentDate 
                            ? `Paid: ${format(request.paymentDate, "MMM d, yyyy")}`
                            : `Approved: ${format(request.approvedAt, "MMM d, yyyy")}`}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Right Column - Request Details and Actions */}
          <div className="space-y-4">
            {selectedRequest ? (
              <>
                {/* Request Details */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="bg-blue-50 border-b border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-gray-900">{selectedRequest.employeeName}</h2>
                            {getStatusBadge(selectedRequest.financialStatus)}
                          </div>
                          <p className="text-gray-600 text-sm">{selectedRequest.id.substring(0, 8)} • {selectedRequest.department}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Purpose of Travel</p>
                          <p className="text-gray-900">{selectedRequest.purpose}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Destination</p>
                          <div className="flex items-center gap-2">
                            <MapPin className="text-blue-500" size={18} />
                            <span className="text-gray-900">{selectedRequest.city}, {selectedRequest.country}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Travel Period</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="text-blue-500" size={18} />
                            <span className="text-gray-900">
                              {format(selectedRequest.departureDate, "MMM d, yyyy")} - {format(selectedRequest.returnDate, "MMM d, yyyy")}
                            </span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                              {Math.ceil((selectedRequest.returnDate - selectedRequest.departureDate) / (1000 * 60 * 60 * 24)) + 1} days
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Payment Details</p>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <CreditCard className="text-blue-600" size={16} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedRequest.cardDetails.type} Card **** {selectedRequest.cardDetails.lastFour}
                              </p>
                              <p className="text-sm text-gray-600">Holder: {selectedRequest.cardDetails.holder}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Currency</p>
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-blue-500" size={18} />
                            <span className="text-gray-900">{selectedRequest.currency}</span>
                            {selectedRequest.currency !== "USD" && (
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                                1 USD = {exchangeRates[selectedRequest.currency]} {selectedRequest.currency}
                              </span>
                            )}
                          </div>
                        </div>

                        {selectedRequest.financialStatus === "completed" && selectedRequest.perDiemAmount && (
                          <div>
                            <p className="text-sm text-gray-500 font-medium mb-2">Transferred Amount</p>
                            <div className="flex items-center gap-2">
                              <Wallet className="text-blue-500" size={18} />
                              <span className="font-medium text-gray-900">
                                {formatCurrency(selectedRequest.perDiemAmount, selectedRequest.currency)}
                              </span>
                            </div>
                            {selectedRequest.transferredAt && (
                              <p className="text-sm text-gray-500 mt-1">
                                Transferred on {format(selectedRequest.transferredAt, "MMMM d, yyyy")}
                              </p>
                            )}
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-2">Approval</p>
                          <div className="flex items-center gap-2">
                            <Check className="text-green-500" size={18} />
                            <span className="text-gray-900">Approved by {selectedRequest.approvedBy}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(selectedRequest.approvedAt, "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Alerts */}
                    {selectedRequest.financialStatus === "pending" && (
                      <Alert type="warning" title="Action Required">
                        This request requires per diem calculation and fund transfer to the employee's {selectedRequest.cardDetails.type} card.
                      </Alert>
                    )}

                    {selectedRequest.financialStatus === "processed" && (
                      <Alert type="info" title="In Progress">
                        Funds have been processed. Please notify the employee about the transfer.
                      </Alert>
                    )}

                    {selectedRequest.financialStatus === "completed" && (
                      <Alert type="success" title="Completed">
                        All financial processing has been completed for this travel request.
                      </Alert>
                    )}
                  </div>

                  {/* Action Footer */}
                  <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center">
                    {selectedRequest.financialStatus === "pending" && (
                      <>
                        <button
                          onClick={() => navigate("/")}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Back to Dashboard
                        </button>
                        <button
                          onClick={() => setShowPerDiem(true)}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Calculator size={16} />
                          Calculate Per Diem
                        </button>
                      </>
                    )}

                    {selectedRequest.financialStatus === "processed" && (
                      <>
                        <button
                          onClick={() => navigate("/travel-dashboard")}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Back to Dashboard
                        </button>
                        <button
                          onClick={() => setShowNotification(true)}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Send size={16} />
                          Notify Employee
                        </button>
                      </>
                    )}

                    {selectedRequest.financialStatus === "completed" && (
                      <>
                        <button
                          onClick={() => navigate("/travel-dashboard")}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Back to Dashboard
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-lg hover:bg-green-200">
                          <FileText size={16} />
                          View Transaction Record
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
                <FileText size={40} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Request Selected</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Select a travel request from the list to view details and process financial requirements
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Per Diem Calculation Modal */}
      <Modal
        isOpen={showPerDiem}
        onClose={() => setShowPerDiem(false)}
        title="Per Diem Calculation"
        size="xl"
      >
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600">
              Calculate per diem allowance for {selectedRequest?.employeeName}'s trip to {selectedRequest?.city}
            </p>
          </div>

          {/* Expense Categories Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <HelpCircle size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Food Category */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={perDiemDetails.categories?.food?.included || false}
                  onChange={(e) => setPerDiemDetails({
                    ...perDiemDetails,
                    categories: {
                      ...perDiemDetails.categories,
                      food: {
                        ...perDiemDetails.categories?.food,
                        included: e.target.checked,
                        amount: e.target.checked 
                          ? (perDiemDetails.categories?.food?.amount || Math.round(perDiemDetails.dailyRate * 0.4))
                          : 0
                      }
                    }
                  })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-600">
                      <path d="M15 11H20L18 7H15M13 3H7V9H13M11 11H4C4 13.6 5 16 7 16V21H11V16C13 16 14 13.6 14 11M19 3H15.5L12.5 11H19C19 11 22 11 22 8C22 5 19 3 19 3Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Food & Meals</span>
                </div>
              </label>

              {/* Accommodation Category */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={perDiemDetails.categories?.accommodation?.included || false}
                  onChange={(e) => setPerDiemDetails({
                    ...perDiemDetails,
                    categories: {
                      ...perDiemDetails.categories,
                      accommodation: {
                        ...perDiemDetails.categories?.accommodation,
                        included: e.target.checked,
                        amount: e.target.checked 
                          ? (perDiemDetails.categories?.accommodation?.amount || Math.round(perDiemDetails.dailyRate * 0.5))
                          : 0
                      }
                    }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Building className="text-blue-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-900">Accommodation</span>
                </div>
              </label>

              {/* Transportation Category */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-amber-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={perDiemDetails.categories?.transportation?.included || false}
                  onChange={(e) => setPerDiemDetails({
                    ...perDiemDetails,
                    categories: {
                      ...perDiemDetails.categories,
                      transportation: {
                        ...perDiemDetails.categories?.transportation,
                        included: e.target.checked,
                        amount: e.target.checked 
                          ? (perDiemDetails.categories?.transportation?.amount || Math.round(perDiemDetails.dailyRate * 0.2))
                          : 0
                      }
                    }
                  })}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 mt-1"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01M6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16M17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16M5 12L6.5 6.5H17.5L19 12H5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Transportation</span>
                </div>
              </label>
            </div>
          </div>

          {/* Calculation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {selectedRequest?.currency}
                  </span>
                  <input
                    type="number"
                    value={perDiemDetails.dailyRate}
                    onChange={(e) => {
                      const newRate = Number.parseFloat(e.target.value) || 0;
                      setPerDiemDetails({
                        ...perDiemDetails,
                        dailyRate: newRate,
                      });
                    }}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Standard rate for {selectedRequest?.country}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                <input
                  type="number"
                  value={perDiemDetails.days}
                  onChange={(e) =>
                    setPerDiemDetails({ ...perDiemDetails, days: Number.parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Based on travel dates: {selectedRequest && format(selectedRequest.departureDate, "MMM d")} - {selectedRequest && format(selectedRequest.returnDate, "MMM d")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Allowance</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {selectedRequest?.currency}
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={perDiemDetails.additionalAllowance}
                    onChange={(e) =>
                      setPerDiemDetails({
                        ...perDiemDetails,
                        additionalAllowance: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  placeholder="Any notes about this per diem calculation"
                  value={perDiemDetails.notes}
                  onChange={(e) => setPerDiemDetails({ ...perDiemDetails, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Calculation Summary</h4>
                <div className="space-y-1">
                  {Object.entries(perDiemDetails.categories || {})
                    .filter(([_, category]) => category.included)
                    .map(([key, category]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-medium">
                          {selectedRequest && formatCurrency(category.amount * perDiemDetails.days, selectedRequest.currency)}
                        </span>
                      </div>
                    ))}
                  
                  {Object.entries(perDiemDetails.categories || {}).some(([_, category]) => category.included) && (
                    <hr className="my-2" />
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Additional Allowance:</span>
                    <span className="font-medium">
                      {selectedRequest && formatCurrency(perDiemDetails.additionalAllowance, selectedRequest.currency)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  {selectedRequest && formatCurrency(
                    (Object.values(perDiemDetails.categories || {})
                      .filter(category => category.included)
                      .reduce((sum, category) => sum + (Number(category.amount) || 0), 0) * perDiemDetails.days) +
                    Number.parseFloat(perDiemDetails.additionalAllowance || 0),
                    selectedRequest.currency,
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  Approx. {selectedRequest && formatCurrency(
                    ((Object.values(perDiemDetails.categories || {})
                      .filter(category => category.included)
                      .reduce((sum, category) => sum + (Number(category.amount) || 0), 0) * perDiemDetails.days) +
                      Number.parseFloat(perDiemDetails.additionalAllowance || 0)) /
                      exchangeRates[selectedRequest.currency],
                    "USD",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => setShowPerDiem(false)}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={calculatePerDiem}
            disabled={
              isCalculating || 
              perDiemDetails.dailyRate <= 0 || 
              perDiemDetails.days <= 0 ||
              !Object.values(perDiemDetails.categories || {}).some(cat => cat.included)
            }
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <LoadingSpinner size="sm" />
                Calculating...
              </>
            ) : (
              <>
                <Check size={16} />
                Confirm Calculation
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Fund Transfer Modal */}
      <Modal
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
        title="Fund Transfer"
        size="lg"
      >
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600">
              Transfer per diem funds to {selectedRequest?.employeeName}'s {selectedRequest?.cardDetails.type} card
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <CreditCard className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transferDetails.cardNumber}</p>
                    <p className="text-sm text-gray-600">Holder: {transferDetails.accountHolder}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {selectedRequest?.currency}
                  </span>
                  <input
                    type="number"
                    value={transferDetails.amount}
                    onChange={(e) =>
                      setTransferDetails({
                        ...transferDetails,
                        amount: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Amount calculated from per diem</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Date</label>
                <input
                  type="date"
                  value={transferDetails.transferDate}
                  onChange={(e) =>
                    setTransferDetails({ ...transferDetails, transferDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={transferDetails.currency}
                  onChange={(e) =>
                    setTransferDetails({ ...transferDetails, currency: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={selectedRequest?.currency}>{selectedRequest?.currency}</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Exchange rate: 1 USD = {selectedRequest && exchangeRates[selectedRequest.currency]} {selectedRequest?.currency}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {selectedRequest?.currency}
                  </span>
                  <input
                    type="text"
                    value={transferDetails.processingFee.toFixed(2)}
                    readOnly
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Automatically calculated (0.5% of transfer amount)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Notes</label>
                <textarea
                  placeholder="Any notes about this transfer"
                  value={transferDetails.notes}
                  onChange={(e) => setTransferDetails({ ...transferDetails, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Transfer Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Transfer Summary</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Transfer Amount:</span>
                    <span className="font-medium text-blue-700">
                      {selectedRequest && formatCurrency(transferDetails.amount, selectedRequest.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Processing Fee:</span>
                    <span className="font-medium text-blue-700">
                      {selectedRequest && formatCurrency(transferDetails.processingFee, selectedRequest.currency)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700 mb-1">Total to Transfer</p>
                <p className="text-3xl font-bold text-blue-800">
                  {selectedRequest && formatCurrency(transferDetails.totalAmount, selectedRequest.currency)}
                </p>
                <p className="text-sm text-blue-600">
                  Approx. {selectedRequest && formatCurrency(
                    transferDetails.totalAmount / exchangeRates[selectedRequest.currency],
                    "USD",
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert type="warning" title="Important">
            By proceeding, you confirm that the transfer details are correct and funds will be sent to
            the employee's {selectedRequest?.cardDetails.type} card. This action cannot be undone.
          </Alert>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => setShowTransfer(false)}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={processTransfer}
            disabled={isTransferring || transferDetails.amount <= 0}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isTransferring ? (
              <>
                <LoadingSpinner size="sm" />
                Processing Transfer...
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                Process Transfer
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Notification Modal */}
      <Modal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        title="Notify Employee"
        size="lg"
      >
        <div className="p-6 space-y-6">
          <div className="mb-6">
            <p className="text-gray-600">
              Send notification to {selectedRequest?.employeeName} about the fund transfer
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
            <input
              type="email"
              value={notificationDetails.recipient}
              onChange={(e) =>
                setNotificationDetails({ ...notificationDetails, recipient: e.target.value })
              }
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
            <p className="text-sm text-gray-500 mt-1">Employee's email address</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Notification subject"
              value={notificationDetails.subject}
              onChange={(e) =>
                setNotificationDetails({ ...notificationDetails, subject: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              placeholder="Enter notification message"
              value={notificationDetails.message}
              onChange={(e) =>
                setNotificationDetails({ ...notificationDetails, message: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notificationDetails.includeBreakdown}
                onChange={(e) =>
                  setNotificationDetails({ ...notificationDetails, includeBreakdown: e.target.checked })
                }
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">Include per diem breakdown in notification</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notificationDetails.sendCopy}
                onChange={(e) =>
                  setNotificationDetails({ ...notificationDetails, sendCopy: e.target.checked })
                }
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">Send copy to finance department</span>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Preview</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-1">To: {notificationDetails.recipient}</p>
              <p className="font-medium text-gray-900 mb-1">Subject: {notificationDetails.subject}</p>
              <hr className="my-3" />
              <p className="text-gray-700 whitespace-pre-line mb-4">{notificationDetails.message}</p>

              {notificationDetails.includeBreakdown && (
                <>
                  <hr className="my-3" />
                  <h5 className="font-medium text-gray-900 mb-2">Per Diem Breakdown:</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Daily Rate:</span>
                      <span>{selectedRequest && formatCurrency(perDiemDetails.dailyRate, selectedRequest.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Number of Days:</span>
                      <span>{perDiemDetails.days}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Additional Allowance:</span>
                      <span>{selectedRequest && formatCurrency(perDiemDetails.additionalAllowance, selectedRequest.currency)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total Amount:</span>
                      <span>{selectedRequest && formatCurrency(transferDetails.totalAmount, selectedRequest.currency)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => setShowNotification(false)}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={sendNotification}
            disabled={
              isSendingNotification || !notificationDetails.subject || !notificationDetails.message
            }
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSendingNotification ? (
              <>
                <LoadingSpinner size="sm" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Notification
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Snackbar Notification */}
      {snackbarOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg border max-w-md ${
            snackbarSeverity === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : snackbarSeverity === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
            <div className="flex items-center gap-3">
              {snackbarSeverity === "success" && <CheckCircle size={20} className="text-green-600" />}
              {snackbarSeverity === "error" && <AlertCircle size={20} className="text-red-600" />}
              {snackbarSeverity === "info" && <Info size={20} className="text-blue-600" />}
              <span className="font-medium">{snackbarMessage}</span>
              <button
                onClick={() => setSnackbarOpen(false)}
                className="ml-2 text-gray-400 hover:text-gray-600"
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