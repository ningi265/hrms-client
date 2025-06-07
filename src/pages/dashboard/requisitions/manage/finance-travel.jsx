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
import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
        <DotLottieReact
      src="loading.lottie"
      loop
      autoplay
    />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Financial Processing</h2>
          <p className="text-gray-600">
            Please wait while we fetch the latest travel requests...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
                  <DollarSign size={32} />
                </div>
                Financial Requests Processing
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Process per diem calculations and fund transfers for approved travel requests
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Bell size={20} />
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <FileText size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getTotalRequests()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalRequests()}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Clock size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getPendingRequests()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Processing</p>
                <p className="text-2xl font-bold text-gray-900">{getPendingRequests()}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Activity size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getProcessedRequests()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Processed</p>
                <p className="text-2xl font-bold text-gray-900">{getProcessedRequests()}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getCompletedRequests()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{getCompletedRequests()}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Travel Requests */}
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Financial Requests</h2>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm font-medium"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "pending"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("processed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "processed"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Processed
                </button>
              </div>
            </div>

            {/* Scrollable Requests List */}
            <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {filteredRequests
                .filter((req) => activeTab === "all" || req.financialStatus === activeTab)
                .length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-xl text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <FileText size={32} className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} requests found</h3>
                      <p className="text-gray-600">All travel requests have been processed</p>
                    </div>
                  </div>
                </div>
              ) : (
                filteredRequests
                  .filter((req) => activeTab === "all" || req.financialStatus === activeTab)
                  .map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleSelectRequest(request)}
                      className={`bg-white/80 backdrop-blur-sm rounded-2xl border p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                        selectedRequest?.id === request.id
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-gray-200/50 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{request.employeeName}</h3>
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
                    </motion.div>
                  ))
              )}
            </div>
          </div>

          {/* Right Column - Request Details and Actions */}
          <div className="space-y-6">
            {selectedRequest ? (
              <>
                {/* Request Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/30 border-b border-gray-100/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900">{selectedRequest.employeeName}</h2>
                            {getStatusBadge(selectedRequest.financialStatus)}
                          </div>
                          <p className="text-gray-600 mt-1">{selectedRequest.id.substring(0, 8)} • {selectedRequest.department}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
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
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="text-amber-600" size={20} />
                          <div>
                            <h4 className="font-semibold text-amber-800">Action Required</h4>
                            <p className="text-amber-700 text-sm mt-1">
                              This request requires per diem calculation and fund transfer to the employee's {selectedRequest.cardDetails.type} card.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRequest.financialStatus === "processed" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                          <Info className="text-blue-600" size={20} />
                          <div>
                            <h4 className="font-semibold text-blue-800">In Progress</h4>
                            <p className="text-blue-700 text-sm mt-1">
                              Funds have been processed. Please notify the employee about the transfer.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRequest.financialStatus === "completed" && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="text-green-600" size={20} />
                          <div>
                            <h4 className="font-semibold text-green-800">Completed</h4>
                            <p className="text-green-700 text-sm mt-1">
                              All financial processing has been completed for this travel request.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Footer */}
                  <div className="bg-gray-50/50 border-t border-gray-100 p-6 flex justify-between items-center">
                    {selectedRequest.financialStatus === "pending" && (
                      <>
                        <button
                          onClick={() => navigate("/")}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                          Back to Dashboard
                        </button>
                        <button
                          onClick={() => setShowPerDiem(true)}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
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
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                          Back to Dashboard
                        </button>
                        <button
                          onClick={() => setShowNotification(true)}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2"
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
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                          Back to Dashboard
                        </button>
                        <button className="px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-xl hover:bg-green-200 transition-colors duration-200 flex items-center gap-2">
                          <FileText size={16} />
                          View Transaction Record
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Per Diem Calculation Modal */}
                {showPerDiem && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                    >
                      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                              <Calculator size={24} className="text-amber-500" />
                              Per Diem Calculation
                            </h2>
                            <p className="text-gray-600 mt-1">
                              Calculate per diem allowance for {selectedRequest?.employeeName}'s trip to {selectedRequest?.city}
                            </p>
                          </div>
                          <button
                            onClick={() => setShowPerDiem(false)}
                            className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 max-h-[70vh] overflow-y-auto">
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
                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-green-300 cursor-pointer transition-colors duration-200">
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
                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-colors duration-200">
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
                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-amber-300 cursor-pointer transition-colors duration-200">
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

                            {/* Additional categories can be added here */}
                          </div>
                        </div>

                        {/* Calculation Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate</label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  {selectedRequest.currency}
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
                                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Standard rate for {selectedRequest.country}</p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                              <input
                                type="number"
                                value={perDiemDetails.days}
                                onChange={(e) =>
                                  setPerDiemDetails({ ...perDiemDetails, days: Number.parseInt(e.target.value) || 0 })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                Based on travel dates: {format(selectedRequest.departureDate, "MMM d")} - {format(selectedRequest.returnDate, "MMM d")}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Allowance</label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  {selectedRequest.currency}
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
                                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Calculation Summary */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
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
                                        {formatCurrency(category.amount * perDiemDetails.days, selectedRequest.currency)}
                                      </span>
                                    </div>
                                  ))}
                                
                                {Object.entries(perDiemDetails.categories || {}).some(([_, category]) => category.included) && (
                                  <hr className="my-2" />
                                )}
                                
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Additional Allowance:</span>
                                  <span className="font-medium">
                                    {formatCurrency(perDiemDetails.additionalAllowance, selectedRequest.currency)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                              <p className="text-3xl font-bold text-gray-900">
                                {formatCurrency(
                                  (Object.values(perDiemDetails.categories || {})
                                    .filter(category => category.included)
                                    .reduce((sum, category) => sum + (Number(category.amount) || 0), 0) * perDiemDetails.days) +
                                  Number.parseFloat(perDiemDetails.additionalAllowance || 0),
                                  selectedRequest.currency,
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                Approx. {formatCurrency(
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
                          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
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
                          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isCalculating ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
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
                    </motion.div>
                  </div>
                )}

                {/* Fund Transfer Modal */}
                {showTransfer && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                    >
                      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                              <CreditCard size={24} className="text-blue-500" />
                              Fund Transfer
                            </h2>
                            <p className="text-gray-600 mt-1">
                              Transfer per diem funds to {selectedRequest?.employeeName}'s {selectedRequest?.cardDetails.type} card
                            </p>
                          </div>
                          <button
                            onClick={() => setShowTransfer(false)}
                            className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center gap-3">
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
                                  {selectedRequest.currency}
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
                                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value={selectedRequest.currency}>{selectedRequest.currency}</option>
                              </select>
                              <p className="text-sm text-gray-500 mt-1">
                                Exchange rate: 1 USD = {exchangeRates[selectedRequest.currency]} {selectedRequest.currency}
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee</label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  {selectedRequest.currency}
                                </span>
                                <input
                                  type="text"
                                  value={transferDetails.processingFee.toFixed(2)}
                                  readOnly
                                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Transfer Summary */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-blue-800 mb-2">Transfer Summary</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-blue-700">Transfer Amount:</span>
                                  <span className="font-medium text-blue-700">
                                    {formatCurrency(transferDetails.amount, selectedRequest.currency)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-blue-700">Processing Fee:</span>
                                  <span className="font-medium text-blue-700">
                                    {formatCurrency(transferDetails.processingFee, selectedRequest.currency)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-blue-700 mb-1">Total to Transfer</p>
                              <p className="text-3xl font-bold text-blue-800">
                                {formatCurrency(transferDetails.totalAmount, selectedRequest.currency)}
                              </p>
                              <p className="text-sm text-blue-600">
                                Approx. {formatCurrency(
                                  transferDetails.totalAmount / exchangeRates[selectedRequest.currency],
                                  "USD",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Warning Alert */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="text-amber-600" size={20} />
                            <div>
                              <h4 className="font-semibold text-amber-800">Important</h4>
                              <p className="text-amber-700 text-sm mt-1">
                                By proceeding, you confirm that the transfer details are correct and funds will be sent to
                                the employee's {selectedRequest.cardDetails.type} card. This action cannot be undone.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                        <button
                          onClick={() => setShowTransfer(false)}
                          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                          Back
                        </button>
                        <button
                          onClick={processTransfer}
                          disabled={isTransferring || transferDetails.amount <= 0}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isTransferring ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
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
                    </motion.div>
                  </div>
                )}

                {/* Notification Modal */}
                {showNotification && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                    >
                      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                              <Send size={24} className="text-green-500" />
                              Notify Employee
                            </h2>
                            <p className="text-gray-600 mt-1">
                              Send notification to {selectedRequest?.employeeName} about the fund transfer
                            </p>
                          </div>
                          <button
                            onClick={() => setShowNotification(false)}
                            className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                          <input
                            type="email"
                            value={notificationDetails.recipient}
                            onChange={(e) =>
                              setNotificationDetails({ ...notificationDetails, recipient: e.target.value })
                            }
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
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
                                    <span>{formatCurrency(perDiemDetails.dailyRate, selectedRequest.currency)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Number of Days:</span>
                                    <span>{perDiemDetails.days}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Additional Allowance:</span>
                                    <span>{formatCurrency(perDiemDetails.additionalAllowance, selectedRequest.currency)}</span>
                                  </div>
                                  <hr className="my-2" />
                                  <div className="flex justify-between text-sm font-medium">
                                    <span>Total Amount:</span>
                                    <span>{formatCurrency(transferDetails.totalAmount, selectedRequest.currency)}</span>
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
                          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                          Back
                        </button>
                        <button
                          onClick={sendNotification}
                          disabled={
                            isSendingNotification || !notificationDetails.subject || !notificationDetails.message
                          }
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSendingNotification ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
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
                    </motion.div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-12 text-center">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <FileText size={40} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Request Selected</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Select a travel request from the list to view details and process financial requirements
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Snackbar Notification */}
      {snackbarOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className={`px-6 py-4 rounded-xl shadow-2xl border max-w-md ${
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
        </motion.div>
      )}
    </div>
  )
}