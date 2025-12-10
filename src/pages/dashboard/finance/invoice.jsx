"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  RefreshCw,
  Download,
  Search,
  Building,
  FileText,
  Activity,
  Loader,
  Check,
  X,
  Package,
  Receipt,
  Target,
  BarChart3,
} from "lucide-react"
import { useAuth } from "../../../authcontext/authcontext"
import { useNavigate, useSearchParams } from "react-router-dom"

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Processing payment..." }) => {
  if (!isVisible) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-xl">
        <Loader className="animate-spin w-5 h-5 text-blue-500" />
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  )
}

// MetricCard Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "" }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div
          className={`p-2 rounded-lg ${
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
        {trend && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={12} className="text-emerald-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-500" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  )
}

// Payment Method Card Component
const PaymentMethodCard = ({ method, isSelected, onSelect, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onSelect(method.id)}
      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
        disabled
          ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
          : isSelected
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-blue-300 hover:shadow-md bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
          <method.icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{method.name}</h4>
          <p className="text-xs text-gray-600">{method.description}</p>
          {method.processingTime && <p className="text-xs text-gray-500 mt-1">Processing: {method.processingTime}</p>}
        </div>
        {isSelected && (
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

// Invoice Payment Card Component
const InvoicePaymentCard = ({ invoice, isSelected, onSelect, onPay, paymentStatus }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const vendorName = `${invoice.vendor?.firstName || ""} ${invoice.vendor?.lastName || ""}`.trim() || "N/A"
  const invoiceNumber = invoice.invoiceNumber || "N/A"

  const isProcessing = paymentStatus === "processing"
  const isPaid = paymentStatus === "paid" || invoice.status === "paid"

  return (
    <div
      className={`bg-white rounded-2xl border-2 p-4 transition-all duration-200 ${
        isPaid
          ? "border-green-200 bg-green-50 opacity-75"
          : isSelected
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPaid ? "bg-green-100" : isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
            {isPaid ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{invoiceNumber}</h4>
            <p className="text-xs text-gray-500">{vendorName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isPaid && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(invoice._id)}
              className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              disabled={isProcessing}
            />
          )}
          {isPaid && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="w-3 h-3 text-green-500" />
            {(invoice.amountDue || 0).toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">Amount Due</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <Package className="w-3 h-3 text-blue-500" />
            <span className="truncate text-xs">{invoice.po?.poNumber || "N/A"}</span>
          </div>
          <div className="text-xs text-gray-500">PO Number</div>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Vendor</span>
          <span className="text-xs font-medium truncate ml-2">{vendorName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Approved</span>
          <span className="text-xs font-medium">
            {invoice.approvedAt ? formatDate(invoice.approvedAt) : formatDate(invoice.createdAt)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Due Date</span>
          <span className="text-xs font-medium">{invoice.dueDate ? formatDate(invoice.dueDate) : "No due date"}</span>
        </div>
      </div>

      {!isPaid && (
        <div className="pt-3 border-t border-gray-100">
          <button
            onClick={() => onPay(invoice._id)}
            disabled={isProcessing}
            className="w-full py-2 px-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {isProcessing ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-3 h-3" />
                Pay Now
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// Payment Confirmation Modal
const PaymentConfirmationModal = ({ isOpen, onClose, invoices, selectedInvoices, paymentMethod, onConfirm }) => {
  if (!isOpen) return null

  const totalAmount = selectedInvoices.reduce((sum, id) => {
    const invoice = invoices.find((inv) => inv._id === id)
    return sum + (invoice?.amountDue || 0)
  }, 0)

  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct bank transfer",
      processingTime: "1-2 business days",
    },
    {
      id: "mobile_money",
      name: "Mobile Money",
      icon: CreditCard,
      description: "Airtel/TNM Mobile Money",
      processingTime: "Instant",
    },
    {
      id: "check",
      name: "Check Payment",
      icon: FileText,
      description: "Physical check payment",
      processingTime: "3-5 business days",
    },
  ]

  const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard size={20} className="text-blue-500" />
                Confirm Payment
              </h2>
              <p className="text-gray-600 mt-1 text-sm">Review payment details before proceeding</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Payment Summary */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Receipt size={16} className="text-blue-500" />
              Payment Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Selected Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{selectedInvoices.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Method</p>
                <p className="text-lg font-semibold text-gray-900">{selectedMethod?.name}</p>
              </div>
            </div>
          </div>

          {/* Invoice List */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoices to Pay</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedInvoices.map((invoiceId) => {
                const invoice = invoices.find((inv) => inv._id === invoiceId)
                if (!invoice) return null

                const vendorName =
                  `${invoice.vendor?.firstName || ""} ${invoice.vendor?.lastName || ""}`.trim() || "N/A"

                return (
                  <div key={invoiceId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-gray-600">{vendorName}</p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">${(invoice.amountDue || 0).toFixed(2)}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 text-sm"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 text-sm"
            >
              <CreditCard size={16} />
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Component
function InvoicePaymentPage({ onNavigateToPayment = null }) {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [approvedInvoices, setApprovedInvoices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [processingPayments, setProcessingPayments] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")

  const backendUrl =
    import.meta.env.VITE_ENV === "production"
      ? import.meta.env.VITE_BACKEND_URL_PROD
      : import.meta.env.VITE_BACKEND_URL_DEV

  const handleSectionChange = (section) => {
    navigate(`?section=${section}`, { replace: true })
  }

  // Payment methods configuration
  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct bank transfer to vendor account",
      processingTime: "1-2 business days",
    },
    {
      id: "mobile_money",
      name: "Mobile Money",
      icon: CreditCard,
      description: "Airtel Money or TNM Mpamba",
      processingTime: "Instant",
    },
    {
      id: "check",
      name: "Check Payment",
      icon: FileText,
      description: "Physical check payment",
      processingTime: "3-5 business days",
    },
  ]

  useEffect(() => {
    fetchApprovedInvoices()
  }, [])

  const fetchApprovedInvoices = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/invoices?status=approved`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch approved invoices")

      const data = await response.json()
      setApprovedInvoices(data)
    } catch (error) {
      console.error("Failed to fetch approved invoices:", error)
      showNotificationMessage("Failed to fetch approved invoices", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInvoices = approvedInvoices.filter(
    (invoice) =>
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.po?.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate metrics
  const totalApprovedAmount = approvedInvoices.reduce((sum, inv) => sum + (inv.amountDue || 0), 0)
  const selectedAmount = selectedInvoices.reduce((sum, id) => {
    const invoice = approvedInvoices.find((inv) => inv._id === id)
    return sum + (invoice?.amountDue || 0)
  }, 0)
  const overduee = approvedInvoices.filter((inv) => inv.dueDate && new Date(inv.dueDate) < new Date()).length

  const handleSelectInvoice = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId],
    )
  }

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map((inv) => inv._id))
    }
  }

  const handlePaySingle = (invoiceId) => {
    setSelectedInvoices([invoiceId])
    setShowConfirmationModal(true)
  }

  const handlePaySelected = () => {
    if (selectedInvoices.length === 0) {
      showNotificationMessage("Please select invoices to pay", "error")
      return
    }
    setShowConfirmationModal(true)
  }

  const handleConfirmPayment = () => {
    // Close the modal first
    setShowConfirmationModal(false)

    if (selectedInvoices.length === 1) {
      // Single invoice payment
      const invoice = approvedInvoices.find((inv) => inv._id === selectedInvoices[0])
      if (invoice) {
        const paymentData = {
          invoice: invoice,
          paymentMethod: paymentMethod,
          isBulkPayment: false,
        }

        // Navigate to payment page with state
        navigate("/dashboard?section=payment", {
          state: { paymentData },
        })
      }
    } else if (selectedInvoices.length > 1) {
      // Multiple invoices payment
      const invoices = approvedInvoices.filter((inv) => selectedInvoices.includes(inv._id))
      const paymentData = {
        invoices: invoices,
        paymentMethod: paymentMethod,
        isBulkPayment: true,
      }

      // Navigate to payment page with state
      navigate("/dashboard?section=payment", {
        state: { paymentData },
      })
    }
  }

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    fetchApprovedInvoices()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading approved invoices..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics Grid --    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Approved"
            value={totalApprovedAmount.toFixed(0)}
            prefix="$"
            icon={CheckCircle}
            color="green"
            trend={12}
            subtitle="Ready for payment"
          />
          <MetricCard
            title="Selected Amount"
            value={selectedAmount.toFixed(0)}
            prefix="$"
            icon={Target}
            color="blue"
            subtitle="Currently selected"
          />
          <MetricCard
            title="Pending Invoices"
            value={approvedInvoices.length}
            icon={Clock}
            color="orange"
            subtitle="Awaiting payment"
          />
          <MetricCard title="Overdue" value={overduee} icon={AlertTriangle} color="red" subtitle="Past due date" />
        </div> */}
     

        {/* Payment Methods Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Select Payment Method
          </h3>
          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              After confirmation, you will be taken to the secure payment section to complete your transaction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isSelected={paymentMethod === method.id}
                onSelect={setPaymentMethod}
              />
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {approvedInvoices.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Select All ({filteredInvoices.length})</span>
                </div>
                {selectedInvoices.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {selectedInvoices.length} selected • ${selectedAmount.toFixed(2)} total
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedInvoices.length > 0 && (
                  <button
                    onClick={handlePaySelected}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                  >
                    <CreditCard size={14} />
                    Pay Selected ({selectedInvoices.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Approved Invoices Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Approved Invoices</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {filteredInvoices.length} of {approvedInvoices.length} invoices
              </span>
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {searchTerm ? (
                  <Search size={32} className="text-gray-400" />
                ) : (
                  <CheckCircle size={32} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No invoices match your search" : "No Approved Invoices"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Approved invoices ready for payment will appear here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInvoices.map((invoice) => (
                <InvoicePaymentCard
                  key={invoice._id}
                  invoice={invoice}
                  isSelected={selectedInvoices.includes(invoice._id)}
                  onSelect={handleSelectInvoice}
                  onPay={handlePaySingle}
                  paymentStatus={processingPayments.has(invoice._id) ? "processing" : invoice.status}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Bulk Payment</h4>
                <p className="text-xs text-gray-500">Pay multiple invoices at once</p>
              </div>
            </div>
            <button
              onClick={handlePaySelected}
              disabled={selectedInvoices.length === 0}
              className="w-full py-2 px-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Pay Selected ({selectedInvoices.length})
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Download className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Export Report</h4>
                <p className="text-xs text-gray-500">Download payment summary</p>
              </div>
            </div>
            <button className="w-full py-2 px-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm">
              Download Report
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Payment Analytics</h4>
                <p className="text-xs text-gray-500">View payment trends and insights</p>
              </div>
            </div>
            <button className="w-full py-2 px-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors text-sm">
              View Analytics
            </button>
          </div>
        </div>
      </main>

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        invoices={approvedInvoices}
        selectedInvoices={selectedInvoices}
        paymentMethod={paymentMethod}
        onConfirm={handleConfirmPayment}
      />

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-2xl border ${
                notificationType === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {notificationType === "success" ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <span className="font-medium text-sm">{notificationMessage}</span>
                <button onClick={() => setShowNotification(false)} className="ml-4 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InvoicePaymentPage
