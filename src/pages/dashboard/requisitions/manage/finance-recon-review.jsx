"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format, differenceInDays, parseISO } from "date-fns"
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  Globe,
  HelpCircle,
  History,
  Info,
  Loader2,
  MapPin,
  MoreHorizontal,
  Receipt,
  Search,
  Send,
  X,
  TrendingUp,
  CheckCircle,
  Loader,
} from "lucide-react"
import { generateApprovalReport } from "../../../../utils/generatedPdfReport"

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 flex items-center gap-2">
        <Loader className="animate-spin w-4 h-4 text-blue-500" />
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  )
}

// MetricCard Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
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
                    : "bg-gray-50"
          }`}
        >
          <Icon
            size={14}
            className={
              color === "blue"
                ? "text-blue-600"
                : color === "green"
                  ? "text-emerald-600"
                  : color === "purple"
                    ? "text-purple-600"
                    : color === "orange"
                      ? "text-orange-600"
                      : "text-gray-600"
            }
          />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp size={10} className={trend > 0 ? "text-emerald-500" : "text-red-500"} />
            <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-500" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
      <div className="text-lg font-bold text-gray-900 mb-0.5">
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  )
}

// Safe date parsing function
const safeDateParse = (dateString) => {
  if (!dateString) return new Date()
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? new Date() : date
  } catch (e) {
    console.warn("Invalid date string:", dateString)
    return new Date()
  }
}

export default function FinanceReconciliationReview() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedReconciliation, setSelectedReconciliation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showClarificationForm, setShowClarificationForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isSendingClarification, setIsSendingClarification] = useState(false)
  const [currentExpense, setCurrentExpense] = useState(null)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [alertMessage, setAlertMessage] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [travelRequests, setTravelRequests] = useState([])
  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV

  const [reviewNotes, setReviewNotes] = useState({
    internalNotes: "",
    expenseNotes: {},
    approvalDecision: "approve",
    reimbursementMethod: "bank-transfer",
    reimbursementAmount: 0,
    reimbursementCurrency: "",
    reimbursementDate: format(new Date(), "yyyy-MM-dd"),
  })

  const [clarificationRequest, setClarificationRequest] = useState({
    reason: "",
    details: "",
    requestedItems: [],
    dueDate: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  })

const transformRequestData = (apiData) => {
  return apiData.map((request) => {
    const today = new Date();
    const departureDate = safeDateParse(request.departureDate);
    const returnDate = safeDateParse(request.returnDate || new Date(departureDate.getTime() + 86400000));
    const isCompleted = returnDate < today;
    const isReconciled = request.reconciled || false;
    const status = request.reconciliation ? request.reconciliation.status : request.status;
    const totalSpent = request.payment?.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
    const perDiemAmount = request.payment?.perDiemAmount || (request.currency === "MWK" ? 100000 : 1000);
    
    // Handle null employee data safely
    const employee = request.employee || {};
    const employeeName = employee.name || "Unknown Employee";
    const department = employee.department || "Unknown Department";
    const employeeId = employee._id || "Unknown ID";

    return {
      id: request._id,
      employeeName: employeeName,
      employeeId: employeeId,
      department: department,
      purpose: request.purpose,
      country: request.travelType === "international" ? "International" : request.location || "Local",
      city: request.location || "Local",
      departureDate: departureDate,
      returnDate: returnDate,
      status: status,
      reconciled: isReconciled,
      perDiemAmount: perDiemAmount,
      currency: request.currency || "USD",
      submittedDate: safeDateParse(request.reconciliation?.submittedDate || request.createdAt),
      totalExpenses: totalSpent,
      remainingBalance: perDiemAmount - totalSpent,
      tripReport: request.reconciliation?.tripReport || "No trip report submitted",
      additionalNotes: request.reconciliation?.notes || "",
      email: employee.email || "unknown@company.com",
      expenses:
        request.payment?.expenses?.map((exp) => ({
          id: exp._id || Math.random().toString(36).substr(2, 9),
          category: exp.category || "Miscellaneous",
          description: exp.description || "No description",
          amount: exp.amount || 0,
          currency: request.currency || "USD",
          date: safeDateParse(exp.date || request.departureDate),
          paymentMethod: exp.paymentMethod || "card",
          receipt: exp.receipt || null,
          status: exp.status || "recorded",
        })) || [],
      reconciliation: request.reconciliation
        ? {
            submittedDate: safeDateParse(request.reconciliation.submittedDate || request.updatedAt),
            approvedDate: request.reconciliation.approvedDate
              ? safeDateParse(request.reconciliation.approvedDate)
              : null,
            approvedBy: request.reconciliation.approvedBy || request.finalApprover,
            totalSpent: totalSpent,
            remainingBalance: perDiemAmount - totalSpent,
            status: request.reconciliation.status,
            notes: request.reconciliation.notes || "",
          }
        : null,
      bankDetails: request.bankDetails || {
        accountName: "John Doe",
        accountNumber: "1234567890",
        bankName: "Example Bank",
        routingNumber: "987654321",
      },
    };
  });
};

  useEffect(() => {
    const fetchPendingReconciliations = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/travel-requests/pending/recon`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch completed travel requests")
        }

        const data = await response.json()
        const transformedData = transformRequestData(data)
        setTravelRequests(transformedData)

        if (transformedData.length > 0) {
          setSelectedReconciliation(transformedData[0])
          setReviewNotes({
            internalNotes: "",
            expenseNotes: {},
            approvalDecision: "approve",
            reimbursementMethod: transformedData[0].remainingBalance < 0 ? "bank-transfer" : "n/a",
            reimbursementAmount:
              transformedData[0].remainingBalance < 0 ? Math.abs(transformedData[0].remainingBalance) : 0,
            reimbursementCurrency: transformedData[0].currency,
            reimbursementDate: format(new Date(), "yyyy-MM-dd"),
          })
        }
      } catch (error) {
        console.error("Failed to fetch completed travel requests:", error)
        setSnackbarMessage("Failed to fetch completed travel requests")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingReconciliations()
  }, [backendUrl])

  const handleDownloadReport = async () => {
    setIsProcessing(true)
    try {
      await generateApprovalReport(selectedReconciliation)
      setSnackbarMessage("Report downloaded successfully")
      setSnackbarSeverity("success")
    } catch (error) {
      console.error("Error generating report:", error)
      setSnackbarMessage("Failed to generate report")
      setSnackbarSeverity("error")
    } finally {
      setSnackbarOpen(true)
      setIsProcessing(false)
    }
  }

  const filteredReconciliations = travelRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      filterDepartment === "all" || request.department.toLowerCase() === filterDepartment.toLowerCase()

    const matchesStatus =
      activeTab === "pending"
        ? request.reconciliation?.status === "pending"
        : activeTab === "pending_reconciliation"
          ? request.status === "pending_reconciliation"
          : request.reconciliation?.status === activeTab

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleSelectReconciliation = (reconciliation) => {
    setSelectedReconciliation(reconciliation)
    setShowReviewForm(false)
    setShowClarificationForm(false)

    setReviewNotes({
      internalNotes: "",
      expenseNotes: {},
      approvalDecision: "approve",
      reimbursementMethod: reconciliation.remainingBalance < 0 ? "bank-transfer" : "n/a",
      reimbursementAmount: reconciliation.remainingBalance < 0 ? Math.abs(reconciliation.remainingBalance) : 0,
      reimbursementCurrency: reconciliation.currency,
      reimbursementDate: format(new Date(), "yyyy-MM-dd"),
    })

    setClarificationRequest({
      reason: "",
      details: "",
      requestedItems: [],
      dueDate: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    })
  }

  const handleExpenseNoteChange = (expenseId, note) => {
    setReviewNotes({
      ...reviewNotes,
      expenseNotes: {
        ...reviewNotes.expenseNotes,
        [expenseId]: note,
      },
    })
  }

  const handleRequestedItemToggle = (item) => {
    const currentItems = [...clarificationRequest.requestedItems]
    const itemIndex = currentItems.indexOf(item)

    if (itemIndex >= 0) {
      currentItems.splice(itemIndex, 1)
    } else {
      currentItems.push(item)
    }

    setClarificationRequest({
      ...clarificationRequest,
      requestedItems: currentItems,
    })
  }

  const handleApproveReconciliation = async () => {
    setIsApproving(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${backendUrl}/api/travel-requests/${selectedReconciliation.id}/process-reconciliation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            decision: reviewNotes.approvalDecision,
            internalNotes: reviewNotes.internalNotes,
            expenseNotes: reviewNotes.expenseNotes,
            reimbursementMethod: reviewNotes.reimbursementMethod,
            reimbursementAmount: reviewNotes.reimbursementAmount,
            reimbursementCurrency: reviewNotes.reimbursementCurrency,
            reimbursementDate: reviewNotes.reimbursementDate,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to process reconciliation")
      }

      const data = await response.json()

      setSelectedReconciliation(data.travelRequest)
      setShowReviewForm(false)
      setActiveTab(reviewNotes.approvalDecision === "approve" ? "approved" : "rejected")

      setSnackbarMessage(
        `Reconciliation ${reviewNotes.approvalDecision === "approve" ? "approved" : "rejected"} successfully`,
      )
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Error processing reconciliation:", error)
      setSnackbarMessage(error.message || "Failed to process reconciliation")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setIsApproving(false)
    }
  }

  const handleSendClarification = () => {
    setIsSendingClarification(true)

    setTimeout(() => {
      const updatedReconciliation = {
        ...selectedReconciliation,
        status: "clarification-requested",
        reconciliation: {
          ...selectedReconciliation.reconciliation,
          status: "clarification-requested",
          clarificationRequest: {
            requestedBy: "Sarah Johnson",
            requestedDate: new Date(),
            reason: clarificationRequest.reason,
            details: clarificationRequest.details,
            requestedItems: clarificationRequest.requestedItems,
            dueDate: new Date(clarificationRequest.dueDate),
            status: "pending",
          },
        },
      }

      setSelectedReconciliation(updatedReconciliation)
      setIsSendingClarification(false)
      setShowClarificationForm(false)
      setActiveTab("clarification-requested")
    }, 1500)
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const calculateTravelDays = (departureDate, returnDate) => {
    return differenceInDays(returnDate, departureDate) + 1
  }

  const isExpenseUnusual = (expense) => {
    const thresholds = {
      Meals: 100,
      Entertainment: 150,
      Transportation: 50,
      Accommodation: 200,
      Miscellaneous: 50,
    }

    return expense.amount > (thresholds[expense.category] || 100)
  }

  const isReceiptMissing = (expense) => {
    return !expense.receipt
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
      case "pending_reconciliation":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-2xl text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={12} className="mr-1" />
            {status === "pending_reconciliation" ? "Pending Reconciliation" : "Pending Review"}
          </span>
        )
      case "clarification-requested":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-2xl text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <HelpCircle size={12} className="mr-1" />
            Clarification Requested
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-2xl text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-2xl text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <X size={12} className="mr-1" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-2xl text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        )
    }
  }

  const getExpenseStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-2xl text-xs font-medium">Pending</span>
      case "approved":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-2xl text-xs font-medium">Approved</span>
      case "rejected":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-2xl text-xs font-medium">Rejected</span>
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-2xl text-xs font-medium">{status}</span>
    }
  }

  // Calculate stats
  const getTotalReconciliations = () => filteredReconciliations.length
  const getPendingReconciliations = () =>
    filteredReconciliations.filter((req) => req.status === "pending" || req.status === "pending_reconciliation").length
  const getApprovedReconciliations = () => filteredReconciliations.filter((req) => req.status === "approved").length
  const getRejectedReconciliations = () => filteredReconciliations.filter((req) => req.status === "rejected").length

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay isVisible={isLoading} message="Loading Reconciliation Data..." />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Reconciliations List */}
          <div className="space-y-3">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">Reconciliation Reviews</h2>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs"
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="Product">Product</option>
                </select>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reconciliations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs"
                />
              </div>

              {/* Tabs */}
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab("pending_reconciliation")}
                  className={`px-2 py-1 rounded-2xl text-xs font-medium transition-colors ${
                    activeTab === "pending_reconciliation"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Review
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`px-2 py-1 rounded-2xl text-xs font-medium transition-colors ${
                    activeTab === "approved" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab("rejected")}
                  className={`px-2 py-1 rounded-2xl text-xs font-medium transition-colors ${
                    activeTab === "rejected" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>

            {/* Scrollable Reconciliations List */}
            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredReconciliations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        No {activeTab} reconciliations found
                      </h3>
                      <p className="text-gray-600 text-sm">All reconciliations have been processed</p>
                    </div>
                  </div>
                </div>
              ) : (
                filteredReconciliations.map((reconciliation, index) => (
                  <div
                    key={reconciliation.id}
                    onClick={() => handleSelectReconciliation(reconciliation)}
                    className={`bg-white rounded-2xl border p-2 hover:shadow-sm transition-shadow cursor-pointer ${
                      selectedReconciliation?.id === reconciliation.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900">{reconciliation.employeeName}</h3>
                        <p className="text-gray-600 text-xs">{reconciliation.id}</p>
                      </div>
                      {getStatusBadge(reconciliation.status)}
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Globe size={12} className="text-gray-400" />
                        <span className="text-xs">
                          {reconciliation.city}, {reconciliation.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Calendar size={12} className="text-gray-400" />
                        <span className="text-xs">
                          {format(reconciliation.departureDate, "MMM d")} -{" "}
                          {format(reconciliation.returnDate, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-2xl text-xs font-medium">
                          {reconciliation.department}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{format(reconciliation.submittedDate, "MMM d")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Reconciliation Details and Actions */}
          <div className="space-y-3">
            {selectedReconciliation ? (
              <>
                {/* Reconciliation Details */}
                <div className="bg-white rounded-2xl border border-gray-200">
                  {/* Header */}
                  <div className="bg-gray-50 border-b border-gray-200 p-3 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-500 rounded-xl text-white">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-semibold text-gray-900">{selectedReconciliation.purpose}</h2>
                            {getStatusBadge(selectedReconciliation.status)}
                          </div>
                          <p className="text-gray-600 text-xs mt-0.5">
                            {selectedReconciliation.id} • {selectedReconciliation.department}
                          </p>
                        </div>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Employee Information</p>
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                              {selectedReconciliation.employeeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{selectedReconciliation.employeeName}</p>
                              <p className="text-xs text-gray-600">{selectedReconciliation.employeeId}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Trip Details</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="text-blue-500" size={12} />
                              <span className="text-gray-900 text-xs">
                                {selectedReconciliation.city}, {selectedReconciliation.country}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="text-blue-500" size={12} />
                              <span className="text-gray-900 text-xs">
                                {format(selectedReconciliation.departureDate, "MMM d, yyyy")} -{" "}
                                {format(selectedReconciliation.returnDate, "MMM d, yyyy")}
                              </span>
                              <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-2xl text-xs font-medium ml-1">
                                {calculateTravelDays(
                                  selectedReconciliation.departureDate,
                                  selectedReconciliation.returnDate,
                                )}{" "}
                                days
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="text-blue-500" size={12} />
                              <span className="text-gray-900 text-xs">
                                Submitted {format(selectedReconciliation.submittedDate, "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Financial Summary</p>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-xs">Per Diem Allowance:</span>
                              <span className="font-medium text-xs">
                                {formatCurrency(selectedReconciliation.perDiemAmount, selectedReconciliation.currency)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs">Total Expenses:</span>
                              <span className="font-medium text-xs">
                                {formatCurrency(selectedReconciliation.totalExpenses, selectedReconciliation.currency)}
                              </span>
                            </div>
                            <hr className="my-1" />
                            <div className="flex justify-between">
                              <span className="text-xs">Remaining Balance:</span>
                              <span
                                className={`font-medium text-xs ${
                                  selectedReconciliation.remainingBalance < 0 ? "text-red-600" : "text-green-600"
                                }`}
                              >
                                {formatCurrency(
                                  selectedReconciliation.remainingBalance,
                                  selectedReconciliation.currency,
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>0</span>
                              <span>
                                {formatCurrency(selectedReconciliation.perDiemAmount, selectedReconciliation.currency)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  selectedReconciliation.totalExpenses > selectedReconciliation.perDiemAmount
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                                style={{
                                  width: `${Math.min((selectedReconciliation.totalExpenses / selectedReconciliation.perDiemAmount) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Trip Report</p>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2">
                            <p className="text-xs text-gray-700">{selectedReconciliation.tripReport}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Additional Notes</p>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2">
                            <p className="text-xs text-gray-700">
                              {selectedReconciliation.additionalNotes || "No additional notes provided."}
                            </p>
                          </div>
                        </div>

                        {/* Status-specific sections */}
                        {selectedReconciliation.status === "clarification-requested" &&
                          selectedReconciliation.reconciliation?.clarificationRequest && (
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">Clarification Request</p>
                              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2">
                                <h4 className="font-medium text-blue-800 mb-1 text-xs">
                                  {selectedReconciliation.reconciliation.clarificationRequest.reason}
                                </h4>
                                <p className="text-blue-700 text-xs mb-2">
                                  {selectedReconciliation.reconciliation.clarificationRequest.details}
                                </p>
                                <div className="mb-2">
                                  <p className="text-xs text-blue-600 font-medium mb-1">Requested items:</p>
                                  <ul className="list-disc list-inside text-xs text-blue-700 space-y-0.5">
                                    {selectedReconciliation.reconciliation.clarificationRequest.requestedItems.map(
                                      (item, index) => (
                                        <li key={index}>{item}</li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                                <div className="flex justify-between text-xs text-blue-600">
                                  <span>
                                    By: {selectedReconciliation.reconciliation.clarificationRequest.requestedBy}
                                  </span>
                                  <span>
                                    Due:{" "}
                                    {format(
                                      new Date(selectedReconciliation.reconciliation.clarificationRequest.dueDate),
                                      "MMM d",
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                        {selectedReconciliation.status === "approved" &&
                          selectedReconciliation.reconciliation?.approvedDate && (
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">Approval Details</p>
                              <div className="bg-green-50 border border-green-200 rounded-xl p-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <CheckCircle2 size={12} className="text-green-600" />
                                  <span className="font-medium text-green-800 text-xs">
                                    Approved by {selectedReconciliation.reconciliation.approvedBy}
                                  </span>
                                </div>
                                <p className="text-green-700 text-xs mb-1">
                                  {selectedReconciliation.reconciliation.notes}
                                </p>
                                {reviewNotes.reimbursementMethod !== "n/a" && (
                                  <div>
                                    <p className="text-xs text-green-600 font-medium mb-0.5">Reimbursement Details:</p>
                                    <p className="text-green-700 text-xs">
                                      {formatCurrency(reviewNotes.reimbursementAmount, selectedReconciliation.currency)}{" "}
                                      via {reviewNotes.reimbursementMethod}
                                    </p>
                                    {reviewNotes.reimbursementDate && (
                                      <p className="text-xs text-green-600 mt-0.5">
                                        Processed: {format(new Date(reviewNotes.reimbursementDate), "MMM d, yyyy")}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                        {selectedReconciliation.status === "rejected" &&
                          selectedReconciliation.reconciliation?.notes && (
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">Rejection Details</p>
                              <div className="bg-red-50 border border-red-200 rounded-xl p-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <X size={12} className="text-red-600" />
                                  <span className="font-medium text-red-800 text-xs">
                                    Rejected by {selectedReconciliation.reconciliation.approvedBy}
                                  </span>
                                </div>
                                <p className="text-red-700 text-xs">{selectedReconciliation.reconciliation.notes}</p>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Status Alerts */}
                    {(selectedReconciliation.status === "pending" ||
                      selectedReconciliation.status === "pending_reconciliation") && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="text-amber-600" size={16} />
                          <div>
                            <h4 className="font-semibold text-amber-800 text-xs">Action Required</h4>
                            <p className="text-amber-700 text-xs mt-0.5">
                              This reconciliation requires your review. Please check all expenses and the trip report
                              for accuracy.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Footer */}
                  <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-between items-center rounded-b-2xl">
           

                    {(selectedReconciliation.status === "pending" ||
                      selectedReconciliation.status === "pending_reconciliation") && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowClarificationForm(true)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl hover:bg-blue-200 transition-colors flex items-center gap-1 text-xs"
                        >
                          <HelpCircle size={12} />
                          Request Clarification
                        </button>
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors flex items-center gap-1 text-xs"
                        >
                          <FileCheck size={12} />
                          Review & Process
                        </button>
                      </div>
                    )}

                    {selectedReconciliation.status === "clarification-requested" && (
                      <button className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl hover:bg-blue-200 transition-colors flex items-center gap-1 text-xs">
                        <History size={12} />
                        View History
                      </button>
                    )}

                    {selectedReconciliation.status === "approved" && (
                      <button
                        onClick={handleDownloadReport}
                        disabled={isProcessing}
                        className="px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 rounded-2xl hover:bg-green-200 transition-colors flex items-center gap-1 disabled:opacity-50 text-xs"
                      >
                        {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                        {isProcessing ? "Generating..." : "Download Report"}
                      </button>
                    )}

                    {selectedReconciliation.status === "rejected" && (
                      <button className="px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded-2xl hover:bg-red-200 transition-colors flex items-center gap-1 text-xs">
                        <History size={12} />
                        View Details
                      </button>
                    )}
                  </div>
                </div>

                {/* Expenses List */}
                <div className="bg-white rounded-2xl border border-gray-200">
                  {/* Header */}
                  <div className="bg-gray-50 border-b border-gray-200 p-3 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-xl">
                          <Receipt size={16} className="text-blue-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Expenses</h3>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-2xl text-xs font-medium">
                        {selectedReconciliation.expenses.length} items
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="overflow-x-auto">
                    {selectedReconciliation.expenses.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-sm">No expenses recorded</div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Receipt
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedReconciliation.expenses.map((expense) => (
                            <tr
                              key={expense.id}
                              className={`hover:bg-gray-50 ${isExpenseUnusual(expense) ? "bg-amber-50" : ""}`}
                            >
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                {format(safeDateParse(expense.date), "MMM d, yyyy")}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{expense.category}</td>
                              <td className="px-3 py-2 text-xs text-gray-900">{expense.description}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right font-medium">
                                <div className="flex items-center justify-end gap-1">
                                  {formatCurrency(expense.amount, selectedReconciliation.currency)}
                                  {isExpenseUnusual(expense) && (
                                    <div className="group relative">
                                      <AlertCircle size={12} className="text-amber-500" />
                                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        Unusually high amount for this category
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">{getExpenseStatusBadge(expense.status)}</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                {expense.receipt ? (
                                  <button
                                    onClick={() => {
                                      setCurrentExpense(expense)
                                      setShowReceiptDialog(true)
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                                  >
                                    <Eye size={12} />
                                    View
                                  </button>
                                ) : (
                                  <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-2xl text-xs font-medium">
                                    Missing
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded-xl">
                                  <MoreHorizontal size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-100 font-medium">
                            <td colSpan={3} className="px-3 py-2 text-right text-xs text-gray-900">
                              Total
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right font-bold">
                              {formatCurrency(selectedReconciliation.totalExpenses, selectedReconciliation.currency)}
                            </td>
                            <td colSpan={3}></td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Review Form Modal */}
                {showReviewForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <FileCheck size={20} className="text-green-500" />
                              Review & Process Reconciliation
                            </h2>
                            <p className="text-gray-600 text-xs mt-0.5">
                              Review and process {selectedReconciliation?.employeeName}'s reconciliation for{" "}
                              {selectedReconciliation?.city}
                            </p>
                          </div>
                          <button
                            onClick={() => setShowReviewForm(false)}
                            className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
                        {/* Decision Section */}
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 mb-3">Decision</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <label
                              className={`p-3 border-2 rounded-2xl cursor-pointer transition-colors ${
                                reviewNotes.approvalDecision === "approve"
                                  ? "border-green-300 bg-green-50"
                                  : "border-gray-200 hover:border-green-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="decision"
                                value="approve"
                                checked={reviewNotes.approvalDecision === "approve"}
                                onChange={(e) => setReviewNotes({ ...reviewNotes, approvalDecision: e.target.value })}
                                className="sr-only"
                              />
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full border-2 ${
                                    reviewNotes.approvalDecision === "approve"
                                      ? "border-green-500 bg-green-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {reviewNotes.approvalDecision === "approve" && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                                <span className="font-medium text-sm">Approve Reconciliation</span>
                              </div>
                            </label>

                            <label
                              className={`p-3 border-2 rounded-2xl cursor-pointer transition-colors ${
                                reviewNotes.approvalDecision === "reject"
                                  ? "border-red-300 bg-red-50"
                                  : "border-gray-200 hover:border-red-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="decision"
                                value="reject"
                                checked={reviewNotes.approvalDecision === "reject"}
                                onChange={(e) => setReviewNotes({ ...reviewNotes, approvalDecision: e.target.value })}
                                className="sr-only"
                              />
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full border-2 ${
                                    reviewNotes.approvalDecision === "reject"
                                      ? "border-red-500 bg-red-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {reviewNotes.approvalDecision === "reject" && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                                <span className="font-medium text-sm">Reject Reconciliation</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Internal Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
                          <textarea
                            placeholder="Add notes about this reconciliation (visible to finance team only)"
                            value={reviewNotes.internalNotes}
                            onChange={(e) => setReviewNotes({ ...reviewNotes, internalNotes: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                          />
                        </div>

                        {/* Reimbursement Section */}
                        {selectedReconciliation.remainingBalance < 0 && reviewNotes.approvalDecision === "approve" && (
                          <div className="border-t pt-4">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Reimbursement Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Reimbursement Method
                                </label>
                                <select
                                  value={reviewNotes.reimbursementMethod}
                                  onChange={(e) =>
                                    setReviewNotes({ ...reviewNotes, reimbursementMethod: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                >
                                  <option value="bank-transfer">Bank Transfer</option>
                                  <option value="payroll">Add to Next Payroll</option>
                                  <option value="check">Check</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Reimbursement Amount
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                    {selectedReconciliation.currency}
                                  </span>
                                  <input
                                    type="number"
                                    value={reviewNotes.reimbursementAmount}
                                    onChange={(e) =>
                                      setReviewNotes({
                                        ...reviewNotes,
                                        reimbursementAmount: Number.parseFloat(e.target.value),
                                      })
                                    }
                                    className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Default:{" "}
                                  {formatCurrency(
                                    Math.abs(selectedReconciliation.remainingBalance),
                                    selectedReconciliation.currency,
                                  )}
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Date</label>
                                <input
                                  type="date"
                                  value={reviewNotes.reimbursementDate}
                                  onChange={(e) =>
                                    setReviewNotes({ ...reviewNotes, reimbursementDate: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                />
                              </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Info size={14} className="text-blue-600" />
                                <h4 className="font-medium text-blue-800 text-sm">Payment Details</h4>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="font-medium text-blue-700">Account Name:</span>
                                  <span className="text-blue-600 ml-2">
                                    {selectedReconciliation.bankDetails.accountName}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-blue-700">Account Number:</span>
                                  <span className="text-blue-600 ml-2">
                                    {selectedReconciliation.bankDetails.accountNumber}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-blue-700">Bank:</span>
                                  <span className="text-blue-600 ml-2">
                                    {selectedReconciliation.bankDetails.bankName}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-blue-700">Routing Number:</span>
                                  <span className="text-blue-600 ml-2">
                                    {selectedReconciliation.bankDetails.routingNumber}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Positive Balance Alert */}
                        {selectedReconciliation.remainingBalance > 0 && reviewNotes.approvalDecision === "approve" && (
                          <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="text-green-600" size={16} />
                              <div>
                                <h4 className="font-semibold text-green-800 text-sm">Remaining Balance</h4>
                                <p className="text-green-700 text-xs mt-1">
                                  The employee has a remaining balance of{" "}
                                  {formatCurrency(
                                    selectedReconciliation.remainingBalance,
                                    selectedReconciliation.currency,
                                  )}
                                  . This amount will be returned to the company account.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rejection Alert */}
                        {reviewNotes.approvalDecision === "reject" && (
                          <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="text-red-600" size={16} />
                              <div>
                                <h4 className="font-semibold text-red-800 text-sm">Rejection Notice</h4>
                                <p className="text-red-700 text-xs mt-1">
                                  The employee will be notified that their reconciliation has been rejected. They will
                                  need to resubmit with corrections.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expense Review */}
                        <div className="border-t pt-4">
                          <h3 className="text-base font-semibold text-gray-900 mb-3">Expense Review</h3>
                          <div className="space-y-3">
                            {selectedReconciliation.expenses.map((expense) => (
                              <div
                                key={expense.id}
                                className={`p-3 border rounded-2xl ${
                                  isExpenseUnusual(expense) ? "border-amber-200 bg-amber-50" : "border-gray-200"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium text-gray-900 text-sm">
                                      {expense.category}: {expense.description}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                      {format(safeDateParse(expense.date), "MMM d, yyyy")}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900 text-sm">
                                      {formatCurrency(expense.amount, selectedReconciliation.currency)}
                                    </p>
                                    <p className="text-xs text-gray-600">Payment: {expense.paymentMethod}</p>
                                  </div>
                                </div>

                                {/* Warnings */}
                                {isExpenseUnusual(expense) && (
                                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2 mb-2">
                                    <div className="flex items-center gap-1">
                                      <AlertCircle className="text-amber-600" size={12} />
                                      <span className="font-medium text-amber-800 text-xs">Warning</span>
                                    </div>
                                    <p className="text-amber-700 text-xs mt-0.5">
                                      This expense amount is unusually high for this category.
                                    </p>
                                  </div>
                                )}

                                {isReceiptMissing(expense) && (
                                  <div className="bg-red-50 border border-red-200 rounded-2xl p-2 mb-2">
                                    <div className="flex items-center gap-1">
                                      <AlertCircle className="text-red-600" size={12} />
                                      <span className="font-medium text-red-800 text-xs">Error</span>
                                    </div>
                                    <p className="text-red-700 text-xs mt-0.5">Receipt is missing for this expense.</p>
                                  </div>
                                )}

                                {/* Review Controls */}
                                <div className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    placeholder="Add notes for this expense"
                                    value={reviewNotes.expenseNotes[expense.id] || ""}
                                    onChange={(e) => handleExpenseNoteChange(expense.id, e.target.value)}
                                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs"
                                  />
                                  <div className="flex gap-3">
                                    <label className="flex items-center gap-1">
                                      <input
                                        type="radio"
                                        name={`expense-${expense.id}`}
                                        checked={!reviewNotes.expenseNotes[expense.id]}
                                        onChange={() => handleExpenseNoteChange(expense.id, "")}
                                        className="text-green-500 focus:ring-green-500"
                                      />
                                      <span className="text-xs text-green-700">Approve</span>
                                    </label>
                                    <label className="flex items-center gap-1">
                                      <input
                                        type="radio"
                                        name={`expense-${expense.id}`}
                                        checked={!!reviewNotes.expenseNotes[expense.id]}
                                        onChange={() => {
                                          if (!reviewNotes.expenseNotes[expense.id]) {
                                            handleExpenseNoteChange(expense.id, "Flagged for review")
                                          }
                                        }}
                                        className="text-amber-500 focus:ring-amber-500"
                                      />
                                      <span className="text-xs text-amber-700">Flag</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-2xl">
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-100 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleApproveReconciliation}
                          disabled={isApproving}
                          className={`px-3 py-1.5 text-white rounded-2xl transition-colors disabled:opacity-50 flex items-center gap-1 text-sm ${
                            reviewNotes.approvalDecision === "approve"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {isApproving ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              {reviewNotes.approvalDecision === "approve" ? (
                                <>
                                  <Check size={14} />
                                  Approve Reconciliation
                                </>
                              ) : (
                                <>
                                  <X size={14} />
                                  Reject Reconciliation
                                </>
                              )}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Clarification Request Modal */}
                {showClarificationForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <HelpCircle size={20} className="text-blue-500" />
                              Request Clarification
                            </h2>
                            <p className="text-gray-600 text-xs mt-0.5">
                              Request additional information from {selectedReconciliation?.employeeName}
                            </p>
                          </div>
                          <button
                            onClick={() => setShowClarificationForm(false)}
                            className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for Clarification
                          </label>
                          <select
                            value={clarificationRequest.reason}
                            onChange={(e) =>
                              setClarificationRequest({ ...clarificationRequest, reason: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="">Select a reason</option>
                            <option value="Missing documentation">Missing documentation</option>
                            <option value="Policy violation">Policy violation</option>
                            <option value="Incomplete information">Incomplete information</option>
                            <option value="Expense discrepancy">Expense discrepancy</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Clarification Details</label>
                          <textarea
                            placeholder="Provide detailed information about what needs to be clarified"
                            value={clarificationRequest.details}
                            onChange={(e) =>
                              setClarificationRequest({ ...clarificationRequest, details: e.target.value })
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Requested Items</label>
                          <div className="space-y-1">
                            {[
                              "Missing receipts",
                              "Expense justification",
                              "Policy explanation",
                              "Additional documentation",
                            ].map((item) => (
                              <label key={item} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={clarificationRequest.requestedItems.includes(item)}
                                  onChange={() => handleRequestedItemToggle(item)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-sm">{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Response Due Date</label>
                          <input
                            type="date"
                            value={clarificationRequest.dueDate}
                            onChange={(e) =>
                              setClarificationRequest({ ...clarificationRequest, dueDate: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">Default: 3 business days from today</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                          <div className="flex items-center gap-2">
                            <Info className="text-blue-600" size={16} />
                            <div>
                              <h4 className="font-semibold text-blue-800 text-sm">Notification</h4>
                              <p className="text-blue-700 text-xs mt-0.5">
                                An email will be sent to {selectedReconciliation.employeeName} (
                                {selectedReconciliation.email}) with your clarification request.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-2xl">
                        <button
                          onClick={() => setShowClarificationForm(false)}
                          className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-100 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSendClarification}
                          disabled={
                            isSendingClarification ||
                            !clarificationRequest.reason ||
                            !clarificationRequest.details ||
                            clarificationRequest.requestedItems.length === 0
                          }
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1 text-sm"
                        >
                          {isSendingClarification ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              Send Clarification Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Receipt Dialog */}
                {showReceiptDialog && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 rounded-t-2xl">
                        <h3 className="text-lg font-semibold text-gray-900">Receipt</h3>
                        <p className="text-gray-600 text-xs mt-0.5">
                          {currentExpense?.description} -{" "}
                          {currentExpense ? format(parseISO(currentExpense.date), "MMMM d, yyyy") : ""}
                        </p>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-center">
                          <div className="border border-gray-200 rounded-2xl overflow-hidden">
                            <img
                              src="/placeholder.svg?height=400&width=300"
                              alt="Receipt"
                              className="max-h-96 w-auto object-contain"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-2xl">
                        <button
                          onClick={() => setShowReceiptDialog(false)}
                          className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-100 transition-colors text-sm"
                        >
                          Close
                        </button>
                        <button className="px-3 py-1.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors flex items-center gap-1 text-sm">
                          <Download size={14} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <FileText size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reconciliation Selected</h3>
                    <p className="text-gray-600 max-w-md mx-auto text-sm">
                      Select a reconciliation from the list to view details and process reviews
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Snackbar Notification */}
      {snackbarOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-3 py-2 rounded-2xl border max-w-md ${
              snackbarSeverity === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : snackbarSeverity === "error"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {snackbarSeverity === "success" && <CheckCircle size={16} className="text-green-600" />}
              {snackbarSeverity === "error" && <AlertCircle size={16} className="text-red-600" />}
              {snackbarSeverity === "info" && <Info size={16} className="text-blue-600" />}
              <span className="font-medium text-sm">{snackbarMessage}</span>
              <button onClick={() => setSnackbarOpen(false)} className="ml-2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
