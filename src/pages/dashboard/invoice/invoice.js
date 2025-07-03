import { useState, useEffect, useRef } from "react";
import {
  FileText,
  DollarSign,
  Check,
  X,
  Eye,
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  Package,
  Building,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  Plus,
  MoreVertical,
  Shield,
  Save,
  Edit,
  Send,
  Copy,
  History,
  MessageSquare,
  Loader
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { useNavigate } from "react-router-dom";

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Loading Invoices..." }) => {
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

// MetricCard Component (styled like vendors.js)
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

// Invoice Card Component (styled like vendor cards)
const InvoiceCard = ({ invoice, onMenuClick, showMenuId, onAction }) => {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Check size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "rejected":
        return <X size={14} />;
      case "paid":
        return <CreditCard size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const vendorName = `${invoice.vendor?.firstName || ""} ${invoice.vendor?.lastName || ""}`.trim() || "N/A";
  const invoiceNumber = invoice.invoiceNumber || "N/A";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {invoiceNumber}
            </h4>
            <p className="text-sm text-gray-500">{vendorName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(invoice.status)}`}>
            {getStatusIcon(invoice.status)}
            {invoice.status}
          </span>
          <button
            data-invoice-id={invoice._id}
            onClick={() => onMenuClick(invoice._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            {invoice.amountDue?.toFixed(0) || 0}
          </div>
          <div className="text-xs text-gray-500">Amount Due (USD)</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
            <Package className="w-4 h-4 text-blue-500" />
            {invoice.po?.poNumber || "N/A"}
          </div>
          <div className="text-xs text-gray-500">PO Number</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Created</span>
          <span className="text-xs font-medium">
            {formatDate(invoice.createdAt)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Vendor Email</span>
          <span className="text-xs font-medium truncate">{invoice.vendor?.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Due Date</span>
          <span className="text-xs font-medium">{invoice.dueDate ? formatDate(invoice.dueDate) : "N/A"}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Payment Status</div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getStatusColor(invoice.status)}`}>
          {getStatusIcon(invoice.status)}
          {invoice.status || "Unknown"}
        </span>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            {formatCurrency(invoice.amountDue)}
          </span>
        </div>
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Eye size={14} />
          </button>
          {invoice.status === 'pending' && (
            <button 
              onClick={() => onAction(invoice, 'approve')}
              className="p-1 text-gray-400 hover:text-green-600"
            >
              <Check size={14} />
            </button>
          )}
          {invoice.status === 'approved' && (
            <button 
              onClick={() => onAction(invoice, 'pay')}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <CreditCard size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function InvoicesPage() {
  const { token, user, logout } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showMenuId, setShowMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0, bottom: 'auto' });
  const menuRef = useRef(null);
  const navigate = useNavigate();
   const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/invoices`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch invoices");

        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        setError("Failed to fetch invoices. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [token, backendUrl]);

  // Handle menu positioning
  const handleMenuToggle = (invoiceId, event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Menu dimensions (approximate)
    const menuHeight = 280;
    const menuWidth = 200;
    
    // Calculate position
    let position = {
      right: Math.max(8, viewportWidth - buttonRect.right),
      top: 'auto',
      bottom: 'auto'
    };
    
    // Check if menu would go below viewport
    if (buttonRect.bottom + menuHeight > viewportHeight - 20) {
      // Position above the button
      position.bottom = viewportHeight - buttonRect.top + 8;
      position.top = 'auto';
    } else {
      // Position below the button
      position.top = buttonRect.bottom + 8;
      position.bottom = 'auto';
    }
    
    // Ensure menu doesn't go off the left edge
    if (buttonRect.right - menuWidth < 8) {
      position.right = 8;
      position.left = 'auto';
    }
    
    setMenuPosition(position);
    setShowMenuId(showMenuId === invoiceId ? null : invoiceId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuId(null);
      }
    };

    if (showMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenuId]);

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.po?.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalInvoices = invoices?.length || 0;
  const pendingInvoices = invoices?.filter(inv => inv.status === "pending")?.length || 0;
  const approvedInvoices = invoices?.filter(inv => inv.status === "approved")?.length || 0;
  const paidInvoices = invoices?.filter(inv => inv.status === "paid")?.length || 0;
  const totalAmount = invoices?.reduce((sum, inv) => sum + (inv.amountDue || 0), 0) || 0;

  const openDialog = (invoice, type) => {
    setSelectedInvoice(invoice);
    setActionType(type);
    setIsDialogOpen(true);
    setShowMenuId(null);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
    setActionType("");
  };

  const handleInvoiceAction = async () => {
    if (!selectedInvoice || !token) {
      showNotificationMessage("Invalid request. Please try again.", "error");
      return;
    }

    setIsProcessing(true);

    try {
      let url;
      let method = "POST";

      switch (actionType) {
        case "approve":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/approve`;
          break;
        case "reject":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/reject`;
          break;
        case "mark-as-paid":
          url = `${backendUrl}/api/invoices/${selectedInvoice._id}/pay`;
          break;
        default:
          throw new Error("Invalid action type");
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid or expired token") {
          showNotificationMessage("Your session has expired. Please log in again.", "error");
          logout();
          return;
        }
        throw new Error(data.message || "Failed to perform action");
      }

      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === selectedInvoice._id ? data.invoice : invoice
        )
      );

      showNotificationMessage(`Invoice ${actionType.replace("-", " ")} successfully!`, "success");
      closeDialog();
    } catch (error) {
      showNotificationMessage(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayInvoice = (invoice) => {
    navigate("/invoices/pay", { state: { invoice } });
    setShowMenuId(null);
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Invoices</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading invoices..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Payment processing</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Approval rate: {totalInvoices > 0 ? Math.round((approvedInvoices / totalInvoices) * 100) : 0}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="paid">Paid</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              <Plus size={16} />
              New Invoice
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard 
            title="Total Invoices" 
            value={totalInvoices}
            icon={FileText} 
            color="blue" 
            subtitle="All invoices"
          />
          <MetricCard 
            title="Pending" 
            value={pendingInvoices}
            icon={Clock} 
            color="amber" 
            subtitle="Awaiting review"
          />
          <MetricCard 
            title="Approved" 
            value={approvedInvoices}
            icon={Check} 
            color="green" 
            trend={12}
            subtitle="Ready to pay"
          />
          <MetricCard 
            title="Paid" 
            value={paidInvoices}
            icon={CreditCard} 
            color="blue" 
            trend={8}
            subtitle="Completed"
          />
          <MetricCard 
            title="Total Amount" 
            value={totalAmount.toFixed(0)}
            prefix="$"
            icon={DollarSign} 
            color="purple" 
            trend={15}
            subtitle="Outstanding value"
          />
        </div>

        {/* Invoice Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Invoices</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredInvoices.length} of {totalInvoices} invoices</span>
            </div>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No invoices match your filters" : "No Invoices Found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search criteria or filters."
                  : "Invoices will appear here when vendors submit them for processing."}
              </p>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice._id}
                  invoice={invoice}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onAction={openDialog}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
      <AnimatePresence>
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
          const button = document.querySelector(`[data-invoice-id="${showMenuId}"]`);
          if (button) {
            const rect = button.getBoundingClientRect();
            return `${rect.bottom + window.scrollY}px`; // Directly at button bottom edge
          }
          return '50px';
        })(),
        left: (() => {
          const button = document.querySelector(`[data-invoice-id="${showMenuId}"]`);
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
        <button
          onClick={() => setShowMenuId(null)}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
        >
          <Eye size={16} className="text-gray-500" />
          View Details
        </button>
        
        {(() => {
          const invoice = invoices.find(inv => inv._id === showMenuId);
          if (!invoice) return null;

          return (
            <>
              {invoice.status === "pending" && (
                <>
                  <button
                    onClick={() => openDialog(invoice, "approve")}
                    className="w-full flex items-center gap-3 px-4 py-2 text-green-600 hover:bg-green-50 text-left text-sm"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => openDialog(invoice, "reject")}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 text-left text-sm"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </>
              )}
              
              {invoice.status === "approved" && (
                <>
                  <button
                    onClick={() => handlePayInvoice(invoice)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-blue-600 hover:bg-blue-50 text-left text-sm"
                  >
                    <CreditCard size={16} />
                    Pay Invoice
                  </button>
                  <button
                    onClick={() => openDialog(invoice, "mark-as-paid")}
                    className="w-full flex items-center gap-3 px-4 py-2 text-purple-600 hover:bg-purple-50 text-left text-sm"
                  >
                    <Check size={16} />
                    Mark as Paid
                  </button>
                </>
              )}
              
              <button
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <Download size={16} className="text-gray-500" />
                Download PDF
              </button>

              <button
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <Edit size={16} className="text-gray-500" />
                Edit Invoice
              </button>

              <button
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <Send size={16} className="text-gray-500" />
                Send Reminder
              </button>

              <button
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <Copy size={16} className="text-gray-500" />
                Copy Details
              </button>

              <button
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <History size={16} className="text-gray-500" />
                View History
              </button>

              <button
                onClick={() => setShowMenuId(null)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm"
              >
                <MessageSquare size={16} className="text-gray-500" />
                Message Vendor
              </button>
            </>
          );
        })()}
      </div>
    </motion.div>
  </>
)}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            >
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    {actionType === "approve" && <Check size={24} className="text-green-500" />}
                    {actionType === "reject" && <X size={24} className="text-red-500" />}
                    {actionType === "mark-as-paid" && <CreditCard size={24} className="text-blue-500" />}
                    Confirm {actionType.replace("-", " ")}
                  </h2>
                  <button
                    onClick={closeDialog}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-gray-700 mb-6 text-lg">
                  Are you sure you want to {actionType.replace("-", " ")} invoice{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedInvoice?.invoiceNumber || "N/A"}
                  </span>?
                </p>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeDialog}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvoiceAction}
                    disabled={isProcessing}
                    className={`px-6 py-3 rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      actionType === "approve" 
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : actionType === "reject"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {actionType === "approve" && <Check size={20} />}
                        {actionType === "reject" && <X size={20} />}
                        {actionType === "mark-as-paid" && <CreditCard size={20} />}
                        Confirm
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}