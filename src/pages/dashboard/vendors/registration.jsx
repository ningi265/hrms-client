import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Upload,
  AlertCircle,
  Plus,
  Settings,
  Eye,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Star,
  Filter,
  MoreVertical,
  Shield,
  TrendingUp,
  Bell,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  RefreshCw,
  FileCheck,
  Award,
  BarChart3,
  Globe,
  Lock,
  Edit,
  Trash2,
  Activity,
  UserCheck,
  UserX,
  Briefcase,
  MapPin,
  CreditCard,
  Hash,
  Paperclip,
  ArrowRight,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";

export default function VendorApprovalPage() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${backendUrl}/api/vendors/pending/registration`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Failed to fetch vendor registrations:", error);
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [backendUrl]);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = 
      vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesStatus = statusFilter === "all" || vendor.registrationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats - handle undefined values safely
  const totalVendors = vendors?.length || 0;
  const pendingVendors = vendors?.filter(vendor => vendor.registrationStatus === "pending")?.length || 0;
  const approvedVendors = vendors?.filter(vendor => vendor.registrationStatus === "approved")?.length || 0;
  const rejectedVendors = vendors?.filter(vendor => vendor.registrationStatus === "rejected")?.length || 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-700 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200";
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle size={14} />;
      case "rejected":
        return <XCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const handleApproveVendor = async (vendorId) => {
    setActionLoading(vendorId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/vendors/approve/${vendorId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Refresh vendor list
        const updatedVendors = vendors.map(vendor => 
          vendor._id === vendorId 
            ? { ...vendor, registrationStatus: "approved" }
            : vendor
        );
        setVendors(updatedVendors);
      }
    } catch (error) {
      console.error("Failed to approve vendor:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const handleRejectVendor = async (vendorId) => {
    setActionLoading(vendorId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/vendors/reject/${vendorId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Refresh vendor list
        const updatedVendors = vendors.map(vendor => 
          vendor._id === vendorId 
            ? { ...vendor, registrationStatus: "rejected" }
            : vendor
        );
        setVendors(updatedVendors);
      }
    } catch (error) {
      console.error("Failed to reject vendor:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadDocument = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = `${backendUrl}/${filePath}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Vendor Registrations</h2>
          <p className="text-gray-600">
            Please wait while we fetch the vendor registration requests...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Users size={32} />
                </div>
                Vendor Registration Approval
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Review and approve vendor registration requests
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
                <UserCheck size={20} />
                Bulk Approve
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Bell size={20} />
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
                  <Users size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalVendors}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
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
                  {pendingVendors}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{pendingVendors}</p>
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
                  {approvedVendors}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedVendors}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                  <XCircle size={24} className="text-white" />
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {rejectedVendors}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedVendors}</p>
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
          className="space-y-8"
        >
          {/* Enhanced Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by business name, vendor name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button className="px-4 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center gap-2">
                    <Filter size={18} />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white/80 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 flex items-center gap-2">
                  <Download size={16} />
                  Export
                </button>
                <button className="p-2 bg-white/80 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Vendors Content */}
          {filteredVendors.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Users size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? "No vendors match your filters" : "No vendor registrations found"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for."
                      : "No vendor registration requests have been submitted yet."
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-8 gap-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    Business Name
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    Contact Person
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    Category
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    Country
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Submitted
                  </div>
                  <div>Status</div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    Documents
                  </div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredVendors.map((vendor, index) => (
                  <motion.div
                    key={vendor._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-8 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                        {vendor.businessName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vendor.registrationNumber || "No reg. number"}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900">
                        {vendor.vendor?.firstName} {vendor.vendor?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vendor.vendor?.email || "No email"}
                      </div>
                    </div>

                    <div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {vendor.businessCategory || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-700">
                        {vendor.countryOfRegistration || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-700">
                        {vendor.submissionDate ? formatDate(vendor.submissionDate) : "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(vendor.registrationStatus)}`}>
                        {getStatusIcon(vendor.registrationStatus)}
                        <span className="ml-2 capitalize">{vendor.registrationStatus || "Unknown"}</span>
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        {vendor.powerOfAttorney?.fileName && (
                          <button
                            onClick={() => downloadDocument(vendor.powerOfAttorney.filePath, vendor.powerOfAttorney.fileName)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                            title="Download Power of Attorney"
                          >
                            <Paperclip size={16} />
                          </button>
                        )}
                        <span className="text-sm text-gray-500">
                          {vendor.powerOfAttorney?.fileName ? "1 file" : "No files"}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="relative">
                        <button
                          data-vendor-id={vendor._id}
                          onClick={() => setShowMenuId(showMenuId === vendor._id ? null : vendor._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Vendor Details Modal */}
      {showDetailsModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Building size={24} className="text-blue-500" />
                    Vendor Registration Details
                  </h2>
                  <p className="text-gray-600 mt-1">Review vendor information before approval</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Business Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building size={20} />
                      Business Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Name</label>
                        <p className="text-gray-900 font-medium">{selectedVendor.businessName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Registration Number</label>
                        <p className="text-gray-900">{selectedVendor.registrationNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">TIN</label>
                        <p className="text-gray-900">{selectedVendor.taxpayerIdentificationNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Category</label>
                        <p className="text-gray-900">{selectedVendor.businessCategory}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company Type</label>
                        <p className="text-gray-900">{selectedVendor.companyType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Form of Business</label>
                        <p className="text-gray-900">{selectedVendor.formOfBusiness}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users size={20} />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Primary Contact</label>
                        <p className="text-gray-900">{selectedVendor.vendor?.firstName} {selectedVendor.vendor?.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedVendor.vendor?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Authorized Contact</label>
                        <p className="text-gray-900">{selectedVendor.authorizedContact?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedVendor.authorizedContact?.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Email</label>
                        <p className="text-gray-900">{selectedVendor.authorizedContact?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText size={20} />
                      Registration Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Country of Registration</label>
                        <p className="text-gray-900">{selectedVendor.countryOfRegistration}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Registration Date</label>
                        <p className="text-gray-900">{formatDate(selectedVendor.registrationIssuedDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">TIN Issued Date</label>
                        <p className="text-gray-900">{formatDate(selectedVendor.tinIssuedDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ownership Type</label>
                        <p className="text-gray-900">{selectedVendor.ownershipType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Submission Date</label>
                        <p className="text-gray-900">{formatDate(selectedVendor.submissionDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Current Status</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedVendor.registrationStatus)}`}>
                          {getStatusIcon(selectedVendor.registrationStatus)}
                          <span className="ml-2 capitalize">{selectedVendor.registrationStatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Paperclip size={20} />
                      Uploaded Documents
                    </h3>
                    <div className="space-y-3">
                      {selectedVendor.powerOfAttorney?.fileName ? (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText size={20} className="text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{selectedVendor.powerOfAttorney.fileName}</p>
                              <p className="text-sm text-gray-500">
                                {(selectedVendor.powerOfAttorney.fileSize / 1024).toFixed(1)} KB • 
                                Uploaded {formatDate(selectedVendor.powerOfAttorney.uploadDate)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => downloadDocument(selectedVendor.powerOfAttorney.filePath, selectedVendor.powerOfAttorney.fileName)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <FileText size={32} className="text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No documents uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedVendor.registrationStatus === "pending" && (
                <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleRejectVendor(selectedVendor._id);
                      setShowDetailsModal(false);
                    }}
                    disabled={actionLoading === selectedVendor._id}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:transform-none"
                  >
                    <UserX size={20} />
                    Reject Registration
                  </button>
                  <button
                    onClick={() => {
                      handleApproveVendor(selectedVendor._id);
                      setShowDetailsModal(false);
                    }}
                    disabled={actionLoading === selectedVendor._id}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:transform-none"
                  >
                    <UserCheck size={20} />
                    Approve Registration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Action Dropdown Menu - Positioned Above Everything */}
      {showMenuId && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-[100] bg-transparent"
            onClick={() => setShowMenuId(null)}
          ></div>
          
          {/* Action Menu */}
          <div 
            className="fixed z-[101] w-56 bg-white rounded-xl shadow-2xl border border-gray-200/50 backdrop-blur-sm"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 300; // Approximate menu height
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const spaceAbove = rect.top;
                  
                  // If there's more space above or menu would go off screen below
                  if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
                    return `${rect.top - menuHeight + window.scrollY}px`;
                  } else {
                    return `${rect.bottom + 8 + window.scrollY}px`;
                  }
                }
                return '50px';
              })(),
              left: (() => {
                const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuWidth = 224; // 56 * 4 (w-56)
                  const spaceRight = window.innerWidth - rect.right;
                  
                  // If menu would go off screen on right, position it to the left of button
                  if (spaceRight < menuWidth) {
                    return `${rect.left - menuWidth + 8}px`;
                  } else {
                    return `${rect.right - menuWidth}px`;
                  }
                }
                return '50px';
              })()
            }}
          >
            <div className="py-2">
              {/* View Details */}
              <button
                onClick={() => {
                  const vendor = filteredVendors.find(v => v._id === showMenuId);
                  if (vendor) handleViewDetails(vendor);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
              
              {/* Conditional Actions for Pending Status */}
              {(() => {
                const vendor = filteredVendors.find(v => v._id === showMenuId);
                return vendor?.registrationStatus === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveVendor(showMenuId);
                      }}
                      disabled={actionLoading === showMenuId}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-green-600 hover:bg-green-50 transition-colors duration-200 disabled:opacity-50 text-left"
                    >
                      <UserCheck size={16} />
                      <span>Approve Registration</span>
                      {actionLoading === showMenuId && (
                        <div className="ml-auto">
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleRejectVendor(showMenuId);
                      }}
                      disabled={actionLoading === showMenuId}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 text-left"
                    >
                      <UserX size={16} />
                      <span>Reject Registration</span>
                      {actionLoading === showMenuId && (
                        <div className="ml-auto">
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                  </>
                );
              })()}
              
              {/* Send Message */}
              <button
                onClick={() => {
                  // Handle send message action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <MessageSquare size={16} />
                <span>Send Message</span>
              </button>
              
              {/* Download Documents */}
              <button
                onClick={() => {
                  const vendor = filteredVendors.find(v => v._id === showMenuId);
                  if (vendor?.powerOfAttorney?.filePath) {
                    downloadDocument(vendor.powerOfAttorney.filePath, vendor.powerOfAttorney.fileName);
                  }
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Download size={16} />
                <span>Download Documents</span>
              </button>
              
              {/* Copy Vendor ID */}
              <button
                onClick={() => {
                  copyToClipboard(showMenuId);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Copy size={16} />
                <span>Copy Vendor ID</span>
              </button>
              
              {/* Edit Registration */}
              <button
                onClick={() => {
                  // Handle edit action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Edit size={16} />
                <span>Edit Registration</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              {/* Delete Registration */}
              <button
                onClick={() => {
                  // Handle delete action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-left"
              >
                <Trash2 size={16} />
                <span>Delete Registration</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}