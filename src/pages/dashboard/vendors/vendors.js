import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Save,
  X,
  Star,
  Phone,
  Mail,
  Building,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Award,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Tag,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Copy,
  MessageSquare,
  Settings,
  FileText,
  UserPlus,
  Send,
  Clock,
  Shield,
  CheckCircle,
  DollarSign,
  Package,
  Loader
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3">
        <Loader className="animate-spin w-6 h-6 text-blue-500" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// MetricCard Component (styled like vehicle-management.jsx)
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-4xl" : "text-2xl";
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'amber' ? 'bg-amber-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={20} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'amber' ? 'text-amber-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={14} className="text-emerald-500" />
            ) : (
              <TrendingDown size={14} className="text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

// Vendor Card Component (styled like vehicle cards)
const VendorCard = ({ vendor, onMenuClick, showMenuId, onDelete, actionLoading, renderRating }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const vendorName = vendor.name || `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {vendorName || "N/A"}
            </h4>
            <p className="text-sm text-gray-500">{vendor.companyName || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vendor.status)}`}>
            {vendor.status}
          </span>
          <button
            data-vendor-id={vendor._id}
            onClick={() => onMenuClick(vendor._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            {vendor.rating ? vendor.rating.toFixed(1) : '0.0'}
          </div>
          <div className="text-xs text-gray-500">Rating</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900">
            {vendor.categories?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Categories</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Email</span>
          <span className="text-xs font-medium truncate">{vendor.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Phone</span>
          <span className="text-xs font-medium">{vendor.phoneNumber || vendor.phone || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Industry</span>
          <span className="text-xs font-medium">{vendor.industry || "N/A"}</span>
        </div>
      </div>

      {vendor.categories && vendor.categories.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Categories</div>
          <div className="flex flex-wrap gap-1">
            {vendor.categories
              .filter(category => category && typeof category === 'string')
              .slice(0, 2)
              .map((category, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {category}
                </span>
              ))}
            {vendor.categories.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{vendor.categories.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          {renderRating(vendor.rating || 0)}
        </div>
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Edit size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VendorsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: "",
    role: "Vendor",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    categories: [],
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/vendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        setError("Failed to fetch vendors");
        console.error("Failed to fetch vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [backendUrl]);

  const filteredVendors = vendors.filter((vendor) => {
    const vendorName = vendor.name || `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim();
    const nameMatch = vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const categoriesMatch = vendor.categories && Array.isArray(vendor.categories) 
      ? vendor.categories.some((cat) => 
          cat && typeof cat === 'string' && cat.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : false;
    
    return nameMatch || categoriesMatch;
  });

  // Calculate stats
  const totalVendors = vendors?.length || 0;
  const activeVendors = vendors?.filter(vendor => vendor.status === "active")?.length || 0;
  const totalCategories = [...new Set(vendors?.flatMap(vendor => vendor.categories || []))].length;
  const avgRating = vendors?.length > 0 ? (vendors.reduce((sum, vendor) => sum + (vendor.rating || 0), 0) / vendors.length).toFixed(1) : 0;
 
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={12} className="fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative inline-block">
          <Star size={12} className="text-yellow-400" />
          <Star
            size={12}
            className="absolute top-0 left-0 fill-yellow-400 text-yellow-400"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={12} className="text-gray-300" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
      </div>
    );
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
  };

  const handleDeleteVendor = async (vendorId) => {
    setActionLoading(vendorId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/vendors/${vendorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
        showNotificationMessage("Vendor deleted successfully!", "success");
      } else {
        throw new Error("Failed to delete vendor");
      }
    } catch (error) {
      showNotificationMessage("Failed to delete vendor", "error");
      console.error("Failed to delete vendor:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const openAddVendorModal = () => {
    setIsAddVendorModalOpen(true);
  };

  const closeAddVendorModal = () => {
    setIsAddVendorModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      industry: "",
      role: "Vendor",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      categories: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "categories") {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/vendors`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setVendors((prev) => [...prev, data]);
        showNotificationMessage("Vendor added successfully!", "success");
        closeAddVendorModal();
      } else {
        throw new Error(data.message || "Failed to add vendor");
      }
    } catch (err) {
      showNotificationMessage(err.message || "Failed to add vendor", "error");
      console.error("Failed to add vendor:", err);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotificationMessage("ID copied to clipboard!", "success");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading vendors..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Network monitoring</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Partnership health: {Math.round((activeVendors / totalVendors) * 100) || 0}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => {
                setUserMenuOpen(false);
                handleSectionChange("pending-registration");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              <CheckCircle size={16} />
              Approve Vendors
            </button>
            <button
              onClick={openAddVendorModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Vendors" 
            value={totalVendors}
            icon={Users} 
            color="blue" 
            subtitle="In network"
          />
          <MetricCard 
            title="Active Vendors" 
            value={activeVendors}
            icon={CheckCircle} 
            color="green" 
            trend={8}
            subtitle="Currently partnered"
          />
          <MetricCard 
            title="Categories" 
            value={totalCategories}
            icon={Tag} 
            color="purple" 
            subtitle="Service types"
          />
          <MetricCard 
            title="Avg Rating" 
            value={avgRating}
            suffix="/5"
            icon={Star} 
            color="amber" 
            trend={3}
            subtitle="Partner satisfaction"
          />
        </div>

        {/* Vendor Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Vendor Network</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredVendors.length} of {totalVendors} vendors</span>
            </div>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No vendors match your search" : "No vendors found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Start by adding your first vendor partner."}
              </p>
              <button
                onClick={openAddVendorModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Add Vendor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map((vendor) => (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onDelete={handleDeleteVendor}
                  actionLoading={actionLoading}
                  renderRating={renderRating}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
      {showMenuId && (
  <>
    {/* Subtle backdrop with fade animation */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/5"
      onClick={() => setShowMenuId(null)}
      transition={{ duration: 0.1 }}
    />
    
    {/* Menu positioned exactly at button edge */}
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed z-[101] w-56 bg-white rounded-lg shadow-lg border border-gray-200"
      style={{
        top: (() => {
          const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`);
          if (button) {
            const rect = button.getBoundingClientRect();
            return `${rect.bottom + window.scrollY}px`; // Directly at button bottom edge
          }
          return '50px';
        })(),
        left: (() => {
          const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`);
          if (button) {
            const rect = button.getBoundingClientRect();
            const menuWidth = 224;
            const rightEdge = rect.right + window.scrollX;
            
            // Right edge protection with 8px buffer
            if (rightEdge + menuWidth > window.innerWidth) {
              return `${window.innerWidth - menuWidth - 8}px`;
            }
            return `${rect.right - menuWidth + window.scrollX}px`;
          }
          return '50px';
        })()
      }}
      transition={{
        duration: 0.1,
        ease: "easeOut"
      }}
    >
      <div className="py-1">
        {[
          { icon: Eye, label: "View Details", action: () => navigate(`/dashboard/vendors/${showMenuId}`) },
          { icon: Edit, label: "Edit Vendor", action: () => navigate(`/dashboard/vendors/${showMenuId}/edit`) },
          { icon: MessageSquare, label: "Send Message", action: () => {} },
          { icon: TrendingUp, label: "View Performance", action: () => navigate(`/dashboard/vendors/${showMenuId}/performance`) },
          { icon: Package, label: "Create Order", action: () => navigate(`/dashboard/orders/create?vendor=${showMenuId}`) },
          { icon: Copy, label: "Copy Vendor ID", action: () => copyToClipboard(showMenuId) },
          { icon: Shield, label: "Manage Access", action: () => navigate(`/dashboard/vendors/${showMenuId}/access`) },
          { icon: FileText, label: "Generate Report", action: () => navigate(`/dashboard/reports/vendor/${showMenuId}`) },
          { type: "divider" },
          { 
            icon: Trash2, 
            label: "Delete Vendor", 
            action: () => handleDeleteVendor(showMenuId),
            destructive: true 
          }
        ].map((item, index) => (
          item.type === "divider" ? (
            <div key={`divider-${index}`} className="border-t border-gray-100 my-1" />
          ) : (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                setShowMenuId(null);
              }}
              disabled={actionLoading === showMenuId && item.destructive}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm ${
                item.destructive 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <item.icon size={16} className="text-gray-500" />
              <span>{item.label}</span>
              {actionLoading === showMenuId && item.destructive && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          )
        ))}
      </div>
    </motion.div>
  </>
)}
      {/* Add Vendor Modal */}
      {isAddVendorModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Plus size={24} className="text-blue-500" />
                    Add New Vendor
                  </h2>
                  <p className="text-gray-600 mt-1">Add a new vendor to your network</p>
                </div>
                <button
                  onClick={closeAddVendorModal}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories *
                  </label>
                  <select
                    name="categories"
                    value={formData.categories}
                    onChange={handleInputChange}
                    multiple
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                  >
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Catering">Catering</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Legal Services">Legal Services</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeAddVendorModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isFormSubmitting}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFormSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Add Vendor
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`px-6 py-4 rounded-xl shadow-2xl border ${
            notificationType === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {notificationType === 'success' ? (
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
              <button
                onClick={() => setShowNotification(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}