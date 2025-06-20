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
  Target,
  Copy,
  MessageSquare,
  Settings,
  FileText,
  UserPlus,
  Send,
  Clock,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
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
      stars.push(<Star key={`full-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative inline-block">
          <Star size={16} className="text-yellow-400" />
          <Star
            size={16}
            className="absolute top-0 left-0 fill-yellow-400 text-yellow-400"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Vendors</h2>
          <p className="text-gray-600">
            Please wait while we fetch vendor information...
          </p>
        </motion.div>
      </div>
    );
  }

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <Users size={24} />
                </div>
                Vendor Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and collaborate with your vendor network
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={openAddVendorModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Add New Vendor
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  handleSectionChange("pending-registration");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Approve Vendor Registration
              </button>
              <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <Bell size={20} />
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {totalVendors}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Vendors</p>
                <p className="text-xl font-bold text-gray-900">{totalVendors}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Activity size={20} className="text-green-600" />
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {activeVendors}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Vendors</p>
                <p className="text-xl font-bold text-gray-900">{activeVendors}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Tag size={20} className="text-purple-600" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                  {totalCategories}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Categories</p>
                <p className="text-xl font-bold text-gray-900">{totalCategories}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Star size={20} className="text-amber-600" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                  {avgRating}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
                <p className="text-xl font-bold text-gray-900">{avgRating}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2">
                    <Filter size={16} />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2 text-sm">
                  <Download size={16} />
                  Export
                </button>
                <button className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Vendors Content */}
          {filteredVendors.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users size={40} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm ? "No vendors match your search" : "No vendors found"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm 
                      ? "Try adjusting your search criteria to find what you're looking for."
                      : "Start by adding your first vendor to begin building your network."
                    }
                  </p>
                </div>
                <button
                  onClick={openAddVendorModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add First Vendor
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="grid grid-cols-6 gap-4 items-center font-medium text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    Vendor Name
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    Contact Info
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    Categories
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} />
                    Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} />
                    Status
                  </div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredVendors.map((vendor, index) => (
                  <div
                    key={vendor._id}
                    className="grid grid-cols-6 gap-4 items-center px-4 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {vendor.name || `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim() || "N/A"}
                      </div>
                      {vendor.companyName && (
                        <div className="text-sm text-gray-500">
                          {vendor.companyName}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                        <Mail size={14} />
                        <span>{vendor.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={14} />
                        <span>{vendor.phoneNumber || vendor.phone || "N/A"}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1">
                        {vendor.categories && Array.isArray(vendor.categories) 
                          ? vendor.categories
                              .filter(category => category && typeof category === 'string')
                              .slice(0, 2)
                              .map((category, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                                >
                                  {category}
                                </span>
                              ))
                          : <span className="text-gray-400 text-sm">No categories</span>
                        }
                        {vendor.categories && vendor.categories.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{vendor.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {renderRating(vendor.rating || 0)}
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        vendor.status === 'active' 
                          ? 'text-green-700 bg-green-50 border border-green-200' 
                          : 'text-gray-700 bg-gray-50 border border-gray-200'
                      }`}>
                        {vendor.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="text-center">
                      <button
                        data-vendor-id={vendor._id}
                        onClick={() => setShowMenuId(showMenuId === vendor._id ? null : vendor._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-[100] bg-transparent"
            onClick={() => setShowMenuId(null)}
          ></div>
          
          {/* Action Menu */}
          <div 
            className="fixed z-[101] w-56 bg-white rounded-lg border border-gray-200"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-vendor-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 400; // Approximate menu height
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
                  navigate(`/dashboard/vendors/${showMenuId}`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
              
              {/* Edit Vendor */}
              <button
                onClick={() => {
                  navigate(`/dashboard/vendors/${showMenuId}/edit`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Edit size={16} />
                <span>Edit Vendor</span>
              </button>
              
              {/* Send Message */}
              <button
                onClick={() => {
                  // Handle send message action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <MessageSquare size={16} />
                <span>Send Message</span>
              </button>
              
              {/* View Performance */}
              <button
                onClick={() => {
                  navigate(`/dashboard/vendors/${showMenuId}/performance`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <TrendingUp size={16} />
                <span>View Performance</span>
              </button>
              
              {/* Create Order */}
              <button
                onClick={() => {
                  navigate(`/dashboard/orders/create?vendor=${showMenuId}`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Plus size={16} />
                <span>Create Order</span>
              </button>
              
              {/* Copy Vendor ID */}
              <button
                onClick={() => {
                  copyToClipboard(showMenuId);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Copy size={16} />
                <span>Copy Vendor ID</span>
              </button>
              
              {/* Manage Access */}
              <button
                onClick={() => {
                  navigate(`/dashboard/vendors/${showMenuId}/access`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Shield size={16} />
                <span>Manage Access</span>
              </button>
              
              {/* Generate Report */}
              <button
                onClick={() => {
                  navigate(`/dashboard/reports/vendor/${showMenuId}`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <FileText size={16} />
                <span>Generate Report</span>
              </button>

              <div className="border-t border-gray-100 my-1"></div>
              
              {/* Delete Vendor */}
              <button
                onClick={() => {
                  handleDeleteVendor(showMenuId);
                }}
                disabled={actionLoading === showMenuId}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>Delete Vendor</span>
                {actionLoading === showMenuId && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Vendor Modal */}
      {isAddVendorModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <Plus size={20} className="text-blue-500" />
                    Add New Vendor
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Add a new vendor to your network</p>
                </div>
                <button
                  onClick={closeAddVendorModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
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
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isFormSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFormSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
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
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-3 rounded-lg border max-w-md ${
            notificationType === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {notificationType === 'success' ? (
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
              <span className="font-medium">{notificationMessage}</span>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}