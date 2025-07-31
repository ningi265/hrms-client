import { useState, useEffect } from "react";
import { Link,useSearchParams, useNavigate } from "react-router-dom";
import {
  Package,
  Tag,
  History,
  FileText,
  Truck,
  Paperclip,
  Search,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Sparkles,
  Settings,
  Save,
  Send,
  X,
  Eye,
  ChevronRight,
  ChevronLeft,
  Building,
  CreditCard,
  Users,
  Calendar,
  Star,
  Filter,
  MoreVertical,
  Zap,
  Shield,
  TrendingUp,
  TrendingDown,
  Bell,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  RefreshCw,
  FileCheck,
  Layers,
  Target,
  Award,
  BarChart3,
  Globe,
  Lock,
  Edit,
  Trash2,
  Activity,
  DollarSign,
  User,
  Check,
  Loader
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../../authcontext/authcontext";
import CreateRFQForm from "../create/create";

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
        <Loader className="animate-spin w-5 h-5 text-blue-500" />
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};

// MetricCard Component (styled like vendors.js)
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-2xl" : "text-lg";
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`p-1 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'amber' ? 'bg-amber-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={14} className={
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
          <div className="flex items-center gap-0.5">
            {trend > 0 ? (
              <TrendingUp size={10} className="text-emerald-500" />
            ) : (
              <TrendingDown size={10} className="text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-0.5`}>
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

// Vendor Quote Card Component for Selection Modal
const VendorQuoteCard = ({ quote, rfq, isSelected, onSelect, vendorInfo }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get vendor name from the populated vendors array or fallback
  const getVendorName = () => {
    if (vendorInfo) {
      return vendorInfo.name || `${vendorInfo.firstName || ''} ${vendorInfo.lastName || ''}`.trim() || vendorInfo.email;
    }
    return `Vendor ${quote.vendor?.slice(-4) || 'Unknown'}`;
  };

  return (
    <div 
      onClick={() => onSelect(quote.vendor)}
      className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-50'}`}>
            <User className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {getVendorName()}
            </h4>
            <p className="text-sm text-gray-500">
              {vendorInfo?.email || "Quote Submitted"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {quote.isLowestPrice && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Best Price
            </span>
          )}
          {isSelected && (
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            {quote.price ? Number(quote.price).toFixed(0) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">Price (MWK)</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-blue-500" />
            {quote.deliveryTime || "N/A"}
          </div>
          <div className="text-xs text-gray-500">Delivery</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Unit Price</span>
          <span className="text-xs font-medium">
            MWK {quote.price && rfq.quantity ? (Number(quote.price) / Number(rfq.quantity)).toFixed(2) : "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Total Quantity</span>
          <span className="text-xs font-medium">{rfq.quantity || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Submitted</span>
          <span className="text-xs font-medium">
            {formatDate(quote.createdAt || quote.submittedAt)}
          </span>
        </div>
      </div>

      {quote.notes && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Vendor Notes</div>
          <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded line-clamp-2">
            {quote.notes}
          </p>
        </div>
      )}

      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Vendor ID: {quote.vendor?.slice(-6) || "N/A"}
          </span>
          {vendorInfo?.phoneNumber && (
            <span className="text-xs text-gray-500">
              {vendorInfo.phoneNumber}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Vendor Selection Modal Component
const VendorSelectionModal = ({ rfq, isOpen, onClose, onVendorSelect, selectedVendor }) => {
  const [localSelectedVendor, setLocalSelectedVendor] = useState(selectedVendor || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLocalSelectedVendor(selectedVendor || "");
  }, [selectedVendor, isOpen]);

  if (!isOpen || !rfq) return null;

  const quotes = rfq.quotes || [];
  
  // Calculate which quote has the lowest price (handle string/number conversion)
  const validPrices = quotes
    .map(q => Number(q.price))
    .filter(price => !isNaN(price) && price > 0);
  
  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  
  const quotesWithBestPrice = quotes.map(quote => ({
    ...quote,
    isLowestPrice: Number(quote.price) === lowestPrice && Number(quote.price) > 0
  }));

  const handleVendorSelect = (vendorId) => {
    setLocalSelectedVendor(vendorId);
  };

  const handleConfirmSelection = async () => {
    if (!localSelectedVendor) return;
    
    setIsSubmitting(true);
    try {
      await onVendorSelect(rfq._id || rfq.id, localSelectedVendor);
      onClose();
    } catch (error) {
      console.error("Failed to select vendor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedQuote = quotes.find(q => q.vendor === localSelectedVendor);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Users size={24} className="text-blue-500" />
                Select Vendor for RFQ
              </h2>
              <p className="text-gray-600 mt-1">
                Choose the best vendor quote for "{rfq.itemName}" (Qty: {rfq.quantity})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[75vh] overflow-y-auto">
          {/* RFQ Summary */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              RFQ Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Item</p>
                <p className="text-gray-900 font-semibold">{rfq.itemName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Quantity</p>
                <p className="text-gray-900 font-semibold">{rfq.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Quotes Received</p>
                <p className="text-gray-900 font-semibold">{quotes.length}</p>
              </div>
            </div>
          </div>

          {/* Vendor Quotes Grid */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-green-500" />
                Vendor Quotes ({quotes.length})
              </h3>
              {quotes.length > 0 && (
                <div className="text-sm text-gray-500">
                  Select the best quote for your needs
                </div>
              )}
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotes Received</h3>
                <p className="text-gray-500 mb-4">
                  This RFQ hasn't received any vendor quotes yet.
                </p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Invited vendors: {rfq.vendors?.length || 0}</p>
                  <p>Vendors need to submit quotes before you can select one.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quotesWithBestPrice.map((quote, index) => {
                  // Find vendor info from the populated vendors array
                  const vendorInfo = rfq.vendors?.find(v => 
                    (v._id || v.id || v) === quote.vendor || 
                    (typeof v === 'object' && (v._id || v.id) === quote.vendor)
                  );
                  
                  return (
                    <VendorQuoteCard
                      key={`${quote.vendor}-${index}`}
                      quote={quote}
                      rfq={rfq}
                      isSelected={localSelectedVendor === quote.vendor}
                      onSelect={handleVendorSelect}
                      vendorInfo={vendorInfo}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Quote Summary */}
          {localSelectedVendor && selectedQuote && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                Selected Quote Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Vendor</p>
                  <p className="text-gray-900 font-semibold">
                    {(() => {
                      const vendorInfo = rfq.vendors?.find(v => 
                        (v._id || v.id || v) === selectedQuote.vendor || 
                        (typeof v === 'object' && (v._id || v.id) === selectedQuote.vendor)
                      );
                      if (vendorInfo) {
                        return vendorInfo.name || `${vendorInfo.firstName || ''} ${vendorInfo.lastName || ''}`.trim() || vendorInfo.email;
                      }
                      return `Vendor ${selectedQuote.vendor?.slice(-4) || 'Unknown'}`;
                    })()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Price</p>
                  <p className="text-gray-900 font-semibold text-lg">MWK {Number(selectedQuote.price || 0).toFixed(0)}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Unit Price</p>
                  <p className="text-gray-900 font-semibold">
                    MWK {selectedQuote.price && rfq.quantity ? (Number(selectedQuote.price) / Number(rfq.quantity)).toFixed(2) : "N/A"}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Delivery Time</p>
                  <p className="text-gray-900 font-semibold">{selectedQuote.deliveryTime || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!localSelectedVendor || isSubmitting || quotes.length === 0}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Selecting...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Confirm Selection
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// RFQ Card Component (styled like vendor cards)
const RFQCard = ({ rfq, onMenuClick, showMenuId, onDelete, actionLoading, rfqId, onSelectVendor }) => {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "closed":
        return <Shield size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-50 rounded-lg">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">
              {rfqId}
            </h4>
            <p className="text-xs text-gray-500">{rfq.itemName || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(rfq.status)}`}>
            {getStatusIcon(rfq.status)}
            {rfq.status}
          </span>
          <button
            data-rfq-id={rfqId}
            onClick={() => onMenuClick(rfqId)}
            className="p-0.5 text-gray-400 hover:text-blue-600 rounded"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="text-center p-1.5 bg-gray-50 rounded-lg">
          <div className="text-base font-bold text-gray-900">
            {rfq.quantity || 0}
          </div>
          <div className="text-xs text-gray-500">Quantity</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-lg">
          <div className="text-base font-bold text-gray-900 flex items-center justify-center gap-1">
            <MessageSquare className="w-3 h-3 text-blue-500" />
            {rfq.quotes?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Quotes</div>
        </div>
      </div>

      <div className="space-y-1 mb-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Created</span>
          <span className="text-xs font-medium">
            {rfq.createdAt ? formatDate(rfq.createdAt) : "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Deadline</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">
              {rfq.deadline ? formatDate(rfq.deadline) : "No deadline"}
            </span>
            {rfq.deadline && isDeadlineNear(rfq.deadline) && (
              <span className="bg-amber-100 text-amber-800 px-1 py-0.5 rounded text-xs font-medium">
                Soon
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Vendors</span>
          <span className="text-xs font-medium">{rfq.vendors?.length || 0}</span>
        </div>
      </div>

      {rfq.selectedVendor && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Selected Vendor</div>
          <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1 w-fit">
            <CheckCircle size={10} />
            {rfq.selectedVendor}
          </span>
        </div>
      )}

      {rfq.description && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-0.5">Description</div>
          <div className="text-xs text-gray-800 line-clamp-2">
            {rfq.description}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            Progress: {rfq.quotes?.length || 0}/{rfq.vendors?.length || 0}
          </span>
        </div>
        <div className="flex gap-1">
          <Link
            to={`/dashboard/rfqs/${rfq.id || rfq._id}`}
            className="p-0.5 text-gray-400 hover:text-blue-600 rounded"
          >
            <Eye size={12} />
          </Link>
          <button className="p-0.5 text-gray-400 hover:text-blue-600 rounded">
            <Edit size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function RFQsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard' ;
  });
  // Vendor selection modal state
  const [showVendorSelectionModal, setShowVendorSelectionModal] = useState(false);
  const [selectedRFQForVendor, setSelectedRFQForVendor] = useState(null);
   const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

  useEffect(() => {
   const fetchRFQs = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${backendUrl}/api/rfqs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    // Extract the data array from the response
    setRfqs(responseData.data || []);
  } catch (error) {
    console.error("Failed to fetch RFQs:", error);
    setRfqs([]);
  } finally {
    setIsLoading(false);
  }
};

    fetchRFQs();
  }, [backendUrl]);

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch = rfq.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSectionChange = (section) =>{
    navigate(`?section=${section}`, { replace: true });
  };

  const handleCreateRFQ = () => {
    handleSectionChange("create-rfq");
  }

  // Calculate stats - handle undefined values safely
  const totalRFQs = rfqs?.length || 0;
  const openRFQs = rfqs?.filter(rfq => rfq.status === "open")?.length || 0;
  const closedRFQs = rfqs?.filter(rfq => rfq.status === "closed")?.length || 0;
  const totalQuotes = rfqs?.reduce((sum, rfq) => sum + (rfq.quotes?.length || 0), 0) || 0;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotificationMessage("RFQ ID copied to clipboard!", "success");
    setShowMenuId(null);
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleDeleteRFQ = async (rfqId) => {
    setActionLoading(rfqId);
    try {
      // Simulate API call for delete
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Remove from local state
      setRfqs((prev) => prev.filter((rfq) => (rfq.id || rfq._id) !== rfqId));
      showNotificationMessage("RFQ deleted successfully!", "success");
    } catch (error) {
      showNotificationMessage("Failed to delete RFQ", "error");
      console.error("Failed to delete RFQ:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const handleSelectVendor = (rfq) => {
    setSelectedRFQForVendor(rfq);
    setShowVendorSelectionModal(true);
    setShowMenuId(null);
  };

  const handleVendorSelect = async (rfqId, vendorId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Make API call to select vendor using your existing backend endpoint
      const response = await fetch(`${backendUrl}/api/rfqs/${rfqId}/select`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vendorId: vendorId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to select vendor');
      }
      
      // Update local state with the successful selection
      setRfqs(prev => prev.map(rfq => 
        (rfq._id || rfq.id) === rfqId 
          ? { ...rfq, selectedVendor: vendorId, status: 'closed' }
          : rfq
      ));
      
      // Get vendor name for success message
      const selectedRfq = rfqs.find(r => (r._id || r.id) === rfqId);
      const vendorInfo = selectedRfq?.vendors?.find(v => 
        (v._id || v.id || v) === vendorId || 
        (typeof v === 'object' && (v._id || v.id) === vendorId)
      );
      const vendorName = vendorInfo ? 
        (vendorInfo.name || `${vendorInfo.firstName || ''} ${vendorInfo.lastName || ''}`.trim() || vendorInfo.email) :
        `Vendor ${vendorId?.slice(-4) || 'Unknown'}`;
      
      showNotificationMessage(`Vendor "${vendorName}" selected successfully!`, "success");
      setShowVendorSelectionModal(false);
      setSelectedRFQForVendor(null);
    } catch (error) {
      showNotificationMessage(error.message || "Failed to select vendor", "error");
      console.error("Failed to select vendor:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRFQSuccess = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch(`${backendUrl}/api/rfqs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      setRfqs(responseData.data || []);
    }
  } catch (error) {
    console.error("Failed to refresh RFQs:", error);
  } finally {
    setIsLoading(false);
    handleCloseModal();
  }
};

 const handleRefresh = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch(`${backendUrl}/api/rfqs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      setRfqs(responseData.data || []);
    }
  } catch (error) {
    console.error("Failed to refresh RFQs:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* LoadingOverlay with Loader icon */}
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Loading RFQs..." 
      />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
         
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleCreateRFQ}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Create RFQ
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total RFQs" 
            value={totalRFQs}
            icon={FileText} 
            color="blue" 
            subtitle="All requests"
          />
          <MetricCard 
            title="Active RFQs" 
            value={openRFQs}
            icon={CheckCircle} 
            color="green" 
            trend={12}
            subtitle="Currently open"
          />
          <MetricCard 
            title="Completed" 
            value={closedRFQs}
            icon={Package} 
            color="purple" 
            subtitle="Finished RFQs"
          />
          <MetricCard 
            title="Total Quotes" 
            value={totalQuotes}
            icon={MessageSquare} 
            color="amber" 
            trend={8}
            subtitle="Received responses"
          />
        </div>

        {/* RFQ Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Request for Quotations</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredRFQs.length} of {totalRFQs} RFQs</span>
            </div>
          </div>

          {filteredRFQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No RFQs match your filters" : "No RFQs found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Start by creating your first RFQ to begin receiving quotes."}
              </p>
              <button
                onClick={handleCreateRFQ}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Create RFQ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredRFQs.map((rfq, index) => {
                const rfqId = `rfq-${String(index + 1).padStart(3, '0')}`;
                return (
                  <RFQCard
                    key={rfq.id || rfq._id}
                    rfq={rfq}
                    rfqId={rfqId}
                    onMenuClick={setShowMenuId}
                    showMenuId={showMenuId}
                    onDelete={handleDeleteRFQ}
                    actionLoading={actionLoading}
                    onSelectVendor={handleSelectVendor}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-transparent"
            onClick={() => setShowMenuId(null)}
          />
          
          {/* Menu positioned exactly at button edge */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed z-[101] w-56 bg-white rounded-lg shadow-xl border border-gray-200"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-rfq-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  return `${rect.bottom + window.scrollY}px`; // Directly at button bottom edge
                }
                return '50px';
              })(),
              left: (() => {
                const button = document.querySelector(`[data-rfq-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuWidth = 224; // 56rem = 224px
                  const rightEdge = rect.right + window.scrollX;
                  
                  // If menu would go offscreen right, align to viewport edge
                  if (rightEdge + menuWidth > window.innerWidth) {
                    return `${window.innerWidth - menuWidth - 8}px`; // 8px padding from edge
                  }
                  return `${rect.right - menuWidth + window.scrollX}px`; // Align to button right
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
              <Link
                to={`/dashboard/rfqs/${filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id}`}
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <Eye size={16} className="text-gray-500" />
                View Details
              </Link>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <Edit size={16} className="text-gray-500" />
                Edit RFQ
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <BarChart3 size={16} className="text-gray-500" />
                View All Quotes
              </button>
              
              <button
                onClick={() => {
                  const rfq = filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId);
                  if (rfq) {
                    handleSelectVendor(rfq);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <Users size={16} className="text-gray-500" />
                Select Vendor
              </button>
              
              <button
                onClick={() => copyToClipboard(showMenuId)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <Copy size={16} className="text-gray-500" />
                Copy RFQ ID
              </button>
              
              <button
                onClick={() => {
                  setShowMenuId(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <ExternalLink size={16} className="text-gray-500" />
                Share RFQ
              </button>

              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => {
                  const rfq = filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId);
                  if (rfq) {
                    handleDeleteRFQ(rfq.id || rfq._id);
                  }
                }}
                disabled={actionLoading === (filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id)}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 text-left text-sm"
              >
                <Trash2 size={16} />
                Delete RFQ
                {actionLoading === (filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?.id || filteredRFQs.find((rfq, index) => `rfq-${String(index + 1).padStart(3, '0')}` === showMenuId)?._id) && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Vendor Selection Modal */}
      <VendorSelectionModal
        rfq={selectedRFQForVendor}
        isOpen={showVendorSelectionModal}
        onClose={() => {
          setShowVendorSelectionModal(false);
          setSelectedRFQForVendor(null);
        }}
        onVendorSelect={handleVendorSelect}
        selectedVendor={selectedRFQForVendor?.selectedVendor}
      />

      {/* Create RFQ Modal - Keep Original Functionality --  {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Plus size={24} className="text-blue-500" />
                    Create New RFQ
                  </h2>
                  <p className="text-gray-600 mt-1">Request quotes from vendors for your procurement needs</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="max-h-[75vh] overflow-y-auto">
              <CreateRFQForm onClose={handleCloseModal} onSuccess={handleRFQSuccess} />
            </div>
          </motion.div>
        </div>
      )} */}
     

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