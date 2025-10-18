"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  AlertCircle,
  Eye,
  Calendar,
  Filter,
  MoreVertical,
  TrendingUp,
  Bell,
  MessageSquare,
  Copy,
  RefreshCw,
  Briefcase,
  MapPin,
  Paperclip,
  X,
  Loader,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  TrendingDown,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "../../../authcontext/authcontext"


// LoadingOverlay Component (matching vendors.js style)
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

// MetricCard Component (matching vendors.js style)
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
                    : color === "amber"
                      ? "bg-amber-50"
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
                      : color === "amber"
                        ? "text-amber-600"
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

const VendorCard = ({
  vendor,
  onViewDetails,
  onApprove,
  onReject,
  actionLoading,
  formatDate,
  getStatusColor,
  getStatusIcon,
   handleSectionChange
}) => {
  // Count total documents
  const documentCount = vendor.documents?.length || 0;

const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-blue-50 rounded-xl">
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">{vendor.businessName || "N/A"}</h4>
            <p className="text-xs text-gray-500">{vendor.registrationNumber || "No reg. number"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vendor.registrationStatus)}`}
          >
            {getStatusIcon(vendor.registrationStatus)}
            <span className="ml-1 capitalize">{vendor.registrationStatus || "Unknown"}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">{vendor.businessCategory || "N/A"}</div>
          <div className="text-xs text-gray-500">Category</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">{vendor.countryOfRegistration || "N/A"}</div>
          <div className="text-xs text-gray-500">Country</div>
        </div>
      </div>

      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Contact</span>
          <span className="text-xs font-medium truncate">
            {vendor.vendor?.firstName} {vendor.vendor?.lastName}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Email</span>
          <span className="text-xs font-medium truncate">{vendor.vendor?.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Submitted</span>
          <span className="text-xs font-medium">
            {vendor.submissionDate ? formatDate(vendor.submissionDate) : "N/A"}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
            <FileText size={12} className="text-blue-600" />
          </div>
          <span className="text-xs text-gray-500">{documentCount} file{documentCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex gap-1">
        <button
  onClick={() => {
    console.log('👁️ View button clicked, vendor._id:', vendor._id);
    console.log('👁️ Vendor object:', vendor);
    
    if (!vendor._id) {
      console.error('🚨 vendor._id is undefined!');
      return;
    }
    
    localStorage.setItem('selectedVendorId', vendor._id);
    console.log('💾 Saved to localStorage:', vendor._id);
    
    if (handleSectionChange) {
      handleSectionChange('vendor-details');
    } else {
      window.dispatchEvent(new CustomEvent('dashboardNavigation', {
        detail: { section: 'vendor-details' }
      }));
    }
  }}
  className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
>
  <Eye size={12} />
  View
</button>
          {vendor.registrationStatus === "pending" && (
            <>
              <button
                onClick={() => onApprove(vendor._id)}
                disabled={actionLoading === vendor._id}
                className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <UserCheck size={12} />
                Approve
              </button>
              <button
                onClick={() => onReject(vendor._id)}
                disabled={actionLoading === vendor._id}
                className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <UserX size={12} />
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VendorApprovalPage({ handleSectionChange }) {
  const { user } = useAuth()
  const [vendors, setVendors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showMenuId, setShowMenuId] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [viewMode, setViewMode] = useState("table") // table or cards
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")


  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(`${backendUrl}/api/vendors/pending/registration`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setVendors(data)
      } catch (error) {
        console.error("Failed to fetch vendor registrations:", error)
        setVendors([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
  }, [backendUrl])

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    const matchesStatus = statusFilter === "all" || vendor.registrationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate stats - handle undefined values safely
  const totalVendors = vendors?.length || 0
  const pendingVendors = vendors?.filter((vendor) => vendor.registrationStatus === "pending")?.length || 0
  const approvedVendors = vendors?.filter((vendor) => vendor.registrationStatus === "approved")?.length || 0
  const rejectedVendors = vendors?.filter((vendor) => vendor.registrationStatus === "rejected")?.length || 0

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-700 bg-green-50 border-green-200"
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200"
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle size={14} />
      case "rejected":
        return <XCircle size={14} />
      case "pending":
        return <Clock size={14} />
      default:
        return <AlertCircle size={14} />
    }
  }

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const handleApproveVendor = async (vendorId) => {
    setActionLoading(vendorId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/vendors/approve/${vendorId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const updatedVendors = vendors.map((vendor) =>
          vendor._id === vendorId ? { ...vendor, registrationStatus: "approved" } : vendor,
        )
        setVendors(updatedVendors)
        showNotificationMessage("Vendor approved successfully!", "success")
      }
    } catch (error) {
      console.error("Failed to approve vendor:", error)
      showNotificationMessage("Failed to approve vendor", "error")
    } finally {
      setActionLoading(null)
      setShowMenuId(null)
    }
  }

  const handleRejectVendor = async (vendorId) => {
    setActionLoading(vendorId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/vendors/reject/${vendorId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const updatedVendors = vendors.map((vendor) =>
          vendor._id === vendorId ? { ...vendor, registrationStatus: "rejected" } : vendor,
        )
        setVendors(updatedVendors)
        showNotificationMessage("Vendor rejected successfully!", "success")
      }
    } catch (error) {
      console.error("Failed to reject vendor:", error)
      showNotificationMessage("Failed to reject vendor", "error")
    } finally {
      setActionLoading(null)
      setShowMenuId(null)
    }
  }

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor)
    setShowDetailsModal(true)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    showNotificationMessage("ID copied to clipboard!", "success")
  }

   const downloadDocument = (filePath, fileName) => {
  if (!filePath) {
    showNotificationMessage("Document path not found", "error");
    return;
  }
  
  const link = document.createElement("a");
  link.href = `${backendUrl}/${filePath}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showNotificationMessage("Document downloaded successfully!", "success");
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading registration data..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              Vendor Registration Approval
            </h1>
            <p className="text-gray-500 text-sm mt-1">Review and approve vendor registration requests</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-2xl font-medium hover:bg-green-600 transition-colors">
              <UserCheck size={16} />
              Bulk Approve
            </button>
            <button className="p-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors">
              <Bell size={16} />
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Requests"
            value={totalVendors}
            icon={Users}
            color="blue"
            subtitle="All submissions"
          />
          <MetricCard
            title="Pending Review"
            value={pendingVendors}
            icon={Clock}
            color="amber"
            subtitle="Awaiting approval"
          />
          <MetricCard title="Approved" value={approvedVendors} icon={CheckCircle} color="green" subtitle="Accepted" />
          <MetricCard title="Rejected" value={rejectedVendors} icon={XCircle} color="red" subtitle="Declined" />
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by business name, vendor name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
                />
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 text-sm">
                  <Filter size={16} />
                  More Filters
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2 text-sm">
                <Download size={16} />
                Export
              </button>
              <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <RefreshCw size={16} />
              </button>
              <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                    viewMode === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                    viewMode === "cards" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vendors Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Vendor Registrations</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {filteredVendors.length} of {totalVendors} registrations
              </span>
            </div>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No vendors match your filters"
                  : "No vendor registrations found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters to find what you're looking for."
                  : "No vendor registration requests have been submitted yet."}
              </p>
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApproveVendor}
                  onReject={handleRejectVendor}
                  actionLoading={actionLoading}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                   handleSectionChange={handleSectionChange} 
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Building size={16} />
                        Business Name
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        Contact Person
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        Category
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        Country
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Submitted
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        Documents
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVendors.map((vendor, index) => (
                    <motion.tr
                      key={vendor._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {vendor.businessName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">{vendor.registrationNumber || "No reg. number"}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">
                          {vendor.vendor?.firstName} {vendor.vendor?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{vendor.vendor?.email || "No email"}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {vendor.businessCategory || "N/A"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-gray-700">{vendor.countryOfRegistration || "N/A"}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-gray-700">
                          {vendor.submissionDate ? formatDate(vendor.submissionDate) : "N/A"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(vendor.registrationStatus)}`}
                        >
                          {getStatusIcon(vendor.registrationStatus)}
                          <span className="ml-1 capitalize">{vendor.registrationStatus || "Unknown"}</span>
                        </span>
                      </td>

                  <td className="py-3 px-4">
  <div className="flex items-center space-x-2">
    {vendor.documents && vendor.documents.length > 0 ? (
      <div className="flex items-center gap-1">
        <div className="p-1 bg-blue-50 rounded-lg">
          <FileText size={12} className="text-blue-600" />
        </div>
        <span className="text-sm text-gray-500">
          {vendor.documents.length} file{vendor.documents.length !== 1 ? 's' : ''}
        </span>
      </div>
    ) : (
      <span className="text-sm text-gray-500">No files</span>
    )}
  </div>
</td>

                      <td className="py-3 px-4 text-center">
                        <button
                          data-vendor-id={vendor._id}
                          onClick={() => setShowMenuId(showMenuId === vendor._id ? null : vendor._id)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Vendor Details Modal */}
      {showDetailsModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building size={18} className="text-blue-500" />
                  Vendor Registration Details
                </h2>
                <button onClick={() => setShowDetailsModal(false)} className="p-1.5 hover:bg-gray-100 rounded-2xl">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Information */}
             {/* Business Information - Enhanced */}
<div className="space-y-4">
  <div>
    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
      <Building size={16} />
      Business Information
    </h3>
    <div className="space-y-3">
      <div className="bg-gray-50 rounded-xl p-3">
        <label className="text-xs font-medium text-gray-500">Business Name</label>
        <p className="text-gray-900 font-medium text-sm">{selectedVendor.businessName}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3">
        <label className="text-xs font-medium text-gray-500">Registration Number</label>
        <p className="text-gray-900 text-sm">{selectedVendor.registrationNumber}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3">
        <label className="text-xs font-medium text-gray-500">TIN</label>
        <p className="text-gray-900 text-sm">{selectedVendor.taxpayerIdentificationNumber}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3">
        <label className="text-xs font-medium text-gray-500">Address</label>
        <p className="text-gray-900 text-sm">{selectedVendor.address || "N/A"}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3">
        <label className="text-xs font-medium text-gray-500">Phone</label>
        <p className="text-gray-900 text-sm">{selectedVendor.phoneNumber || "N/A"}</p>
      </div>
    </div>
  </div>
</div>

                {/* Registration Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText size={16} />
                      Registration Details
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <label className="text-xs font-medium text-gray-500">Country of Registration</label>
                        <p className="text-gray-900 text-sm">{selectedVendor.countryOfRegistration}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <label className="text-xs font-medium text-gray-500">Registration Date</label>
                        <p className="text-gray-900 text-sm">{formatDate(selectedVendor.registrationIssuedDate)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <label className="text-xs font-medium text-gray-500">Submission Date</label>
                        <p className="text-gray-900 text-sm">{formatDate(selectedVendor.submissionDate)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <label className="text-xs font-medium text-gray-500">Current Status</label>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedVendor.registrationStatus)}`}
                        >
                          {getStatusIcon(selectedVendor.registrationStatus)}
                          <span className="ml-1 capitalize">{selectedVendor.registrationStatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>

              
 {/* Documents */}
<div>
  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
    <Paperclip size={16} />
    Uploaded Documents
  </h3>
  <div className="space-y-2 max-h-60 overflow-y-auto">
    {selectedVendor.documents && selectedVendor.documents.length > 0 ? (
      selectedVendor.documents.map((doc, index) => (
        <div key={doc._id || index} className="bg-white rounded-2xl border border-gray-200 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-xl">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  Document {index + 1}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded: {formatDate(doc.uploadedAt || selectedVendor.submissionDate)}
                </p>
                {doc.fileName && (
                  <p className="text-xs text-gray-500">File: {doc.fileName}</p>
                )}
              </div>
            </div>
            {doc.filePath && (
              <button
                onClick={() => downloadDocument(doc.filePath, doc.fileName || `document-${index + 1}`)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
              >
                <Download size={14} />
                Download
              </button>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-6 bg-gray-50 rounded-xl">
        <FileText size={32} className="text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No documents uploaded</p>
      </div>
    )}
  </div>
</div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedVendor.registrationStatus === "pending" && (
                <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleRejectVendor(selectedVendor._id)
                      setShowDetailsModal(false)
                    }}
                    disabled={actionLoading === selectedVendor._id}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <UserX size={16} />
                    Reject Registration
                  </button>
                  <button
                    onClick={() => {
                      handleApproveVendor(selectedVendor._id)
                      setShowDetailsModal(false)
                    }}
                    disabled={actionLoading === selectedVendor._id}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <UserCheck size={16} />
                    Approve Registration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/5"
            onClick={() => setShowMenuId(null)}
            transition={{ duration: 0.1 }}
          />

          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed z-[101] w-56 bg-white rounded-2xl shadow-xl border border-gray-200"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`)
                if (button) {
                  const rect = button.getBoundingClientRect()
                  return `${rect.bottom + window.scrollY}px`
                }
                return "50px"
              })(),
              left: (() => {
                const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`)
                if (button) {
                  const rect = button.getBoundingClientRect()
                  const menuWidth = 224
                  const rightEdge = rect.right + window.scrollX

                  if (rightEdge + menuWidth > window.innerWidth) {
                    return `${window.innerWidth - menuWidth - 8}px`
                  }
                  return `${rect.right - menuWidth + window.scrollX}px`
                }
                return "50px"
              })(),
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut",
            }}
          >
            <div className="py-1">
              {[
                {
                  icon: Eye,
                  label: "View Details",
                  action: () => {
                    const vendor = filteredVendors.find((v) => v._id === showMenuId)
                    if (vendor) handleViewDetails(vendor)
                  },
                },
                ...(() => {
                  const vendor = filteredVendors.find((v) => v._id === showMenuId)
                  return vendor?.registrationStatus === "pending"
                    ? [
                        {
                          icon: UserCheck,
                          label: "Approve Registration",
                          action: () => handleApproveVendor(showMenuId),
                          color: "green",
                        },
                        {
                          icon: UserX,
                          label: "Reject Registration",
                          action: () => handleRejectVendor(showMenuId),
                          color: "red",
                        },
                        { type: "divider" },
                      ]
                    : []
                })(),
                {
                  icon: MessageSquare,
                  label: "Send Message",
                  action: () => {},
                },
             {
  icon: Download,
  label: "Download Documents",
  action: () => {
    const vendor = filteredVendors.find((v) => v._id === showMenuId);
    if (vendor?.documents && vendor.documents.length > 0) {
      vendor.documents.forEach((doc, index) => {
        if (doc.filePath) {
          downloadDocument(doc.filePath, doc.fileName || `document-${index + 1}`);
        }
      });
    } else {
      showNotificationMessage("No documents available for download", "error");
    }
  },
},
                {
                  icon: Copy,
                  label: "Copy Vendor ID",
                  action: () => copyToClipboard(showMenuId),
                },
                {
                  icon: Edit,
                  label: "Edit Registration",
                  action: () => {},
                },
                { type: "divider" },
                {
                  icon: Trash2,
                  label: "Delete Registration",
                  action: () => {},
                  destructive: true,
                },
              ].map((item, index) =>
                item.type === "divider" ? (
                  <div key={`divider-${index}`} className="border-t border-gray-100 my-1" />
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action()
                      setShowMenuId(null)
                    }}
                    disabled={actionLoading === showMenuId && (item.color === "green" || item.color === "red")}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm rounded-xl ${
                      item.destructive
                        ? "text-red-600 hover:bg-red-50"
                        : item.color === "green"
                          ? "text-green-600 hover:bg-green-50"
                          : item.color === "red"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <item.icon size={16} className="text-gray-500" />
                    <span>{item.label}</span>
                    {actionLoading === showMenuId && (item.color === "green" || item.color === "red") && (
                      <div className="ml-auto">
                        <div
                          className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                            item.color === "green" ? "border-green-600" : "border-red-600"
                          }`}
                        />
                      </div>
                    )}
                  </button>
                ),
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border ${
              notificationType === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {notificationType === "success" ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <span className="font-medium">{notificationMessage}</span>
              <button onClick={() => setShowNotification(false)} className="ml-4 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
