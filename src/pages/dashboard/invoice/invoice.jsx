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
  Loader,
  Printer,
  FileSpreadsheet,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { useNavigate } from "react-router-dom";
import ExcelJS from 'exceljs';

// LoadingOverlay Component (compact like view_rfqs.js)
const LoadingOverlay = ({ isVisible, message = "Loading Invoices..." }) => {
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

// MetricCard Component (compact and rounded like view_rfqs.js)
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
  
  // Excel import/export and print functionality
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
   const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

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
      if (showMenuId && !event.target.closest(`[data-invoice-id="${showMenuId}"]`)) {
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

  // Excel Export Functionality
  const handleExportToExcel = async () => {
  if (!invoices || invoices.length === 0) {
    showNotificationMessage("No invoices to export", "error");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoices');

    // Define headers
    worksheet.columns = [
      { header: 'Invoice Number', key: 'invoiceNumber', width: 18 },
      { header: 'Vendor Name', key: 'vendorName', width: 25 },
      { header: 'Vendor Email', key: 'vendorEmail', width: 25 },
      { header: 'Amount Due (USD)', key: 'amountDue', width: 16 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'PO Number', key: 'poNumber', width: 15 },
      { header: 'Created Date', key: 'createdDate', width: 12 },
      { header: 'Due Date', key: 'dueDate', width: 12 },
      { header: 'Payment Method', key: 'paymentMethod', width: 15 },
      { header: 'Notes', key: 'notes', width: 30 },
      { header: 'Currency', key: 'currency', width: 10 },
      { header: 'Items Count', key: 'itemsCount', width: 12 },
      { header: 'Tax Amount', key: 'taxAmount', width: 12 },
      { header: 'Shipping Amount', key: 'shippingAmount', width: 15 },
      { header: 'Discount Amount', key: 'discountAmount', width: 15 },
      { header: 'Total Amount (USD)', key: 'totalAmount', width: 16 }
    ];

    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' } // Blue color
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data rows
    invoices.forEach((invoice) => {
      const vendorName = `${invoice.vendor?.firstName || ""} ${invoice.vendor?.lastName || ""}`.trim() || "N/A";
      
      worksheet.addRow({
        invoiceNumber: invoice.invoiceNumber || "N/A",
        vendorName: vendorName,
        vendorEmail: invoice.vendor?.email || "N/A",
        amountDue: invoice.amountDue || 0,
        status: invoice.status || "pending",
        poNumber: invoice.po?.poNumber || "N/A",
        createdDate: invoice.createdAt ? new Date(invoice.createdAt).toISOString().split('T')[0] : "N/A",
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : "N/A",
        paymentMethod: invoice.paymentMethod || "N/A",
        notes: invoice.notes || "",
        currency: "USD",
        itemsCount: invoice.items?.length || 0,
        taxAmount: invoice.taxAmount || 0,
        shippingAmount: invoice.shippingAmount || 0,
        discountAmount: invoice.discountAmount || 0,
        totalAmount: invoice.totalAmount || 0
      });
    });

    // Format currency columns
    const currencyColumns = ['amountDue', 'taxAmount', 'shippingAmount', 'discountAmount', 'totalAmount'];
    currencyColumns.forEach(colName => {
      const col = worksheet.getColumn(colName);
      col.numFmt = '"$"#,##0.00';
    });

    // Format date columns
    const dateColumns = ['createdDate', 'dueDate'];
    dateColumns.forEach(colName => {
      const col = worksheet.getColumn(colName);
      col.numFmt = 'yyyy-mm-dd';
    });

    // Style status column with colors
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header
        const statusCell = row.getCell('status');
        const status = statusCell.value?.toString().toLowerCase();
        
        if (status === 'paid') {
          statusCell.font = { color: { argb: 'FF10B981' }, bold: true }; // Green
        } else if (status === 'approved') {
          statusCell.font = { color: { argb: 'FF3B82F6' }, bold: true }; // Blue
        } else if (status === 'pending') {
          statusCell.font = { color: { argb: 'FFF59E0B' }, bold: true }; // Orange
        } else if (status === 'rejected') {
          statusCell.font = { color: { argb: 'FFEF4444' }, bold: true }; // Red
        }
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    });

    // Add summary statistics
    const lastRow = worksheet.rowCount;
    worksheet.addRow([]); // Empty row
    
    const summaryRow = worksheet.addRow({
      invoiceNumber: 'FINANCIAL SUMMARY',
      vendorName: '',
      vendorEmail: '',
      amountDue: invoices.reduce((sum, inv) => sum + (inv.amountDue || 0), 0),
      status: '',
      poNumber: '',
      createdDate: '',
      dueDate: '',
      paymentMethod: '',
      notes: '',
      currency: '',
      itemsCount: invoices.reduce((sum, inv) => sum + (inv.items?.length || 0), 0),
      taxAmount: invoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0),
      shippingAmount: invoices.reduce((sum, inv) => sum + (inv.shippingAmount || 0), 0),
      discountAmount: invoices.reduce((sum, inv) => sum + (inv.discountAmount || 0), 0),
      totalAmount: invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
    });

    // Style summary row
    summaryRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    summaryRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF059669' } // Emerald green
    };

    // Add status summary
    const statusCounts = {};
    invoices.forEach(inv => {
      statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
    });

    Object.entries(statusCounts).forEach(([status, count], index) => {
      const statusRow = worksheet.addRow({
        invoiceNumber: `Status: ${status}`,
        vendorName: '',
        vendorEmail: '',
        amountDue: '',
        status: count,
        poNumber: '',
        createdDate: '',
        dueDate: '',
        paymentMethod: '',
        notes: '',
        currency: '',
        itemsCount: '',
        taxAmount: '',
        shippingAmount: '',
        discountAmount: '',
        totalAmount: ''
      });
      
      statusRow.getCell('invoiceNumber').font = { italic: true };
    });

    // Add payment method summary
    const paymentMethodCounts = {};
    invoices.forEach(inv => {
      const method = inv.paymentMethod || 'Not Specified';
      paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + 1;
    });

    worksheet.addRow([]); // Empty row
    worksheet.addRow({
      invoiceNumber: 'PAYMENT METHOD SUMMARY',
      vendorName: '',
      vendorEmail: '',
      amountDue: '',
      status: '',
      poNumber: '',
      createdDate: '',
      dueDate: '',
      paymentMethod: '',
      notes: '',
      currency: '',
      itemsCount: '',
      taxAmount: '',
      shippingAmount: '',
      discountAmount: '',
      totalAmount: ''
    });

    Object.entries(paymentMethodCounts).forEach(([method, count]) => {
      worksheet.addRow({
        invoiceNumber: method,
        vendorName: '',
        vendorEmail: '',
        amountDue: '',
        status: count,
        poNumber: '',
        createdDate: '',
        dueDate: '',
        paymentMethod: '',
        notes: '',
        currency: '',
        itemsCount: '',
        taxAmount: '',
        shippingAmount: '',
        discountAmount: '',
        totalAmount: ''
      });
    });

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date().toISOString().split('T')[0];
    link.download = `invoices-report-${today}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showNotificationMessage("Export successful!", "success");
  } catch (error) {
    console.error('Export error:', error);
    showNotificationMessage("Export failed!", "error");
  }
};

  // Excel Import Functionality
 const handleImportFromExcel = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    const data = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);
    
    const worksheet = workbook.getWorksheet(1); // Get first sheet
    if (!worksheet) {
      throw new Error('No worksheet found in the Excel file');
    }

    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const rowData = {
          "Invoice Number": row.getCell(1).value,
          "Vendor Name": row.getCell(2).value,
          "Vendor Email": row.getCell(3).value,
          "Amount Due (USD)": row.getCell(4).value,
          "Status": row.getCell(5).value,
          "PO Number": row.getCell(6).value,
          "Created Date": row.getCell(7).value,
          "Due Date": row.getCell(8).value,
          "Payment Method": row.getCell(9).value,
          "Notes": row.getCell(10).value,
          "Currency": row.getCell(11).value,
          "Items Count": row.getCell(12).value,
          "Tax Amount": row.getCell(13).value,
          "Shipping Amount": row.getCell(14).value,
          "Discount Amount": row.getCell(15).value,
          "Total Amount (USD)": row.getCell(16).value
        };
        rows.push(rowData);
      }
    });

    const token = localStorage.getItem("token");
    const importResults = {
      success: 0,
      failed: 0,
      errors: []
    };

    // Import each row
    for (const row of rows) {
      try {
        // Note: This is a simplified import. In a real application, you would need to:
        // 1. Look up vendor by name/email to get vendorId
        // 2. Look up PO by PO number to get poId
        // 3. Handle items parsing if present
        
        const invoiceData = {
          invoiceNumber: row["Invoice Number"] || "",
          // vendorId: would need to be looked up based on vendor info
          // poId: would need to be looked up based on PO number
          amountDue: Number(row["Amount Due (USD)"]) || 0,
          dueDate: row["Due Date"] ? new Date(row["Due Date"]).toISOString() : new Date().toISOString(),
          status: row["Status"] || "pending",
          notes: row["Notes"] || "",
          paymentMethod: row["Payment Method"] || "bank_transfer",
          items: [], // Would need to parse if provided
          taxAmount: Number(row["Tax Amount"]) || 0,
          shippingAmount: Number(row["Shipping Amount"]) || 0,
          discountAmount: Number(row["Discount Amount"]) || 0,
          totalAmount: Number(row["Total Amount (USD)"]) || 0,
        };

        // Validate required fields
        if (!invoiceData.invoiceNumber || !invoiceData.amountDue) {
          throw new Error('Missing required fields (Invoice Number, Amount)');
        }

        // In a real implementation, you would need vendor lookup logic here
        // For now, we'll use a placeholder or skip vendor association
        if (row["Vendor Email"]) {
          // Look up vendor by email to get vendorId
          // This would require additional API calls
          console.log(`Would look up vendor for email: ${row["Vendor Email"]}`);
        }

        const response = await fetch(`${backendUrl}/api/invoices`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}: ${row["Invoice Number"]}`);
        }

        const result = await response.json();
        if (result.success) {
          importResults.success++;
        } else {
          throw new Error(result.message || 'Import failed');
        }
      } catch (err) {
        importResults.failed++;
        importResults.errors.push({
          row: row["Invoice Number"] || 'Unknown invoice',
          error: err.message
        });
        console.error(`Import error for row:`, row, err);
      }
    }

    if (importResults.success > 0) {
      showNotificationMessage(
        `Excel import completed! ${importResults.success} invoices imported successfully, ${importResults.failed} failed.`,
        importResults.failed === 0 ? "success" : "warning"
      );
      
      if (importResults.failed > 0) {
        console.warn('Import errors:', importResults.errors);
      }
      
      handleRefresh();
    } else {
      showNotificationMessage(
        `Import failed for all ${importResults.failed} invoices.`,
        "error"
      );
    }
  } catch (err) {
    console.error("Import error:", err);
    showNotificationMessage(`Excel import failed: ${err.message}`, "error");
  }
};

  // Print Functionality
const handlePrint = () => {
  if (filteredInvoices.length === 0) {
    showNotificationMessage("Nothing to print", "error");
    return;
  }

  const printWindow = window.open("", "_blank", "width=1200,height=700");

  // Calculate financial summary
  const totalAmountDue = filteredInvoices.reduce((sum, inv) => sum + (inv.amountDue || 0), 0);
  const totalTax = filteredInvoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
  const totalShipping = filteredInvoices.reduce((sum, inv) => sum + (inv.shippingAmount || 0), 0);
  const totalDiscount = filteredInvoices.reduce((sum, inv) => sum + (inv.discountAmount || 0), 0);
  
  const formatCurrencyForPrint = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateForPrint = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Status counts
  const statusCounts = {};
  filteredInvoices.forEach(inv => {
    statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
  });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice Management Report - ${new Date().toLocaleDateString()}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            padding: 30px; 
            color: #1F2937;
            line-height: 1.4;
            background: #F9FAFB;
          }
          
          .print-container {
            max-width: 1100px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          .print-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 30px; 
            padding-bottom: 20px;
            border-bottom: 2px solid #3B82F6;
          }
          
          h1 { 
            color: #1F2937; 
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          
          .report-subtitle {
            color: #6B7280;
            font-size: 14px;
            margin-top: 4px;
          }
          
          .company-info {
            text-align: right;
          }
          
          .company-name {
            font-size: 18px;
            font-weight: 600;
            color: #3B82F6;
          }
          
          .report-date {
            font-size: 14px;
            color: #6B7280;
            margin-top: 4px;
          }
          
          .financial-summary {
            background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
            border: 1px solid #BAE6FD;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
          }
          
          .financial-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-top: 15px;
          }
          
          .financial-item {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border: 1px solid #E5E7EB;
          }
          
          .financial-value {
            font-size: 20px;
            font-weight: bold;
            color: #1F2937;
            margin: 5px 0;
          }
          
          .financial-label {
            font-size: 13px;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            font-size: 13px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .invoice-table th {
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            color: white;
            text-align: left;
            padding: 14px 16px;
            font-weight: 600;
            font-size: 13px;
            position: sticky;
            top: 0;
          }
          
          .invoice-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #E5E7EB;
            vertical-align: middle;
          }
          
          .invoice-table tr:hover {
            background: #F9FAFB;
          }
          
          .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: capitalize;
            min-width: 80px;
            text-align: center;
          }
          
          .status-paid { 
            background: #D1FAE5; 
            color: #065F46;
            border: 1px solid #A7F3D0;
          }
          
          .status-approved { 
            background: #DBEAFE; 
            color: #1E40AF;
            border: 1px solid #BFDBFE;
          }
          
          .status-pending { 
            background: #FEF3C7; 
            color: #92400E;
            border: 1px solid #FDE68A;
          }
          
          .status-rejected { 
            background: #FEE2E2; 
            color: #991B1B;
            border: 1px solid #FECACA;
          }
          
          .amount-cell {
            font-weight: 600;
            color: #059669;
          }
          
          .due-date-cell {
            font-weight: 500;
          }
          
          .overdue {
            color: #EF4444;
            font-weight: bold;
          }
          
          .vendor-cell {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 12px;
          }
          
          .footer-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-top: 15px;
          }
          
          .footer-section h4 {
            color: #374151;
            margin-bottom: 8px;
            font-size: 13px;
          }
          
          .footer-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .footer-section li {
            margin-bottom: 4px;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
          }
          
          .status-count {
            font-weight: 600;
          }
          
          @media print {
            @page { 
              margin: 10mm;
              size: A4 landscape;
            }
            body { 
              background: white; 
              padding: 0; 
            }
            .print-container {
              box-shadow: none;
              padding: 0;
            }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <div>
              <h1>Invoice Management Report</h1>
              <p class="report-subtitle">Comprehensive invoice tracking and financial overview</p>
            </div>
            <div class="company-info">
              <div class="company-name">Procurement System</div>
              <div class="report-date">Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
          </div>
          
          <div class="financial-summary">
            <h3 style="color: #1E40AF; margin: 0 0 15px 0;">Financial Summary</h3>
            <div class="financial-grid">
              <div class="financial-item">
                <div class="financial-value">${formatCurrencyForPrint(totalAmountDue)}</div>
                <div class="financial-label">Total Amount Due</div>
              </div>
              <div class="financial-item">
                <div class="financial-value">${formatCurrencyForPrint(totalTax)}</div>
                <div class="financial-label">Total Tax</div>
              </div>
              <div class="financial-item">
                <div class="financial-value">${formatCurrencyForPrint(totalShipping)}</div>
                <div class="financial-label">Total Shipping</div>
              </div>
              <div class="financial-item">
                <div class="financial-value">${formatCurrencyForPrint(totalDiscount)}</div>
                <div class="financial-label">Total Discount</div>
              </div>
            </div>
          </div>
          
          <h2>Invoice Details (${filteredInvoices.length} invoices)</h2>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Vendor</th>
                <th>PO Number</th>
                <th>Amount Due</th>
                <th>Status</th>
                <th>Created</th>
                <th>Due Date</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              ${filteredInvoices.map(invoice => {
                const vendorName = `${invoice.vendor?.firstName || ""} ${invoice.vendor?.lastName || ""}`.trim() || "N/A";
                const poNumber = invoice.po?.poNumber || "N/A";
                const dueDate = new Date(invoice.dueDate);
                const isOverdue = invoice.status === 'pending' && dueDate < new Date();
                
                return `
                  <tr>
                    <td style="font-weight: 600;">
                      <div>${invoice.invoiceNumber || 'N/A'}</div>
                      <div style="font-size: 11px; color: #6B7280; margin-top: 2px;">ID: ${invoice._id?.substring(0, 8) || 'N/A'}</div>
                    </td>
                    <td class="vendor-cell">
                      <div>${vendorName}</div>
                      <div style="font-size: 11px; color: #6B7280;">${invoice.vendor?.email || 'N/A'}</div>
                    </td>
                    <td>${poNumber}</td>
                    <td class="amount-cell">${formatCurrencyForPrint(invoice.amountDue || 0)}</td>
                    <td>
                      <span class="status-badge status-${invoice.status?.toLowerCase() || 'pending'}">
                        ${invoice.status || 'Pending'}
                      </span>
                    </td>
                    <td>${formatDateForPrint(invoice.createdAt)}</td>
                    <td class="${isOverdue ? 'overdue' : 'due-date-cell'}">
                      ${formatDateForPrint(invoice.dueDate)}
                      ${isOverdue ? '<span style="color: #EF4444; margin-left: 4px;">(Overdue)</span>' : ''}
                    </td>
                    <td>${invoice.paymentMethod || 'Not Specified'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div>
                <strong>Report ID:</strong> INV-${new Date().getTime().toString().substring(0, 8)}
              </div>
              <div style="font-size: 11px; color: #6B7280;">
                Page 1 of 1 • Confidential Financial Document
              </div>
            </div>
            
            <div class="footer-grid">
              <div class="footer-section">
                <h4>Status Distribution</h4>
                <ul>
                  ${Object.entries(statusCounts).map(([status, count]) => 
                    `<li>
                      <span>${status}:</span>
                      <span class="status-count">${count} invoices</span>
                    </li>`
                  ).join('')}
                </ul>
              </div>
              <div class="footer-section">
                <h4>Report Notes</h4>
                <ul>
                  <li>Data as of ${new Date().toLocaleDateString()}</li>
                  <li>Generated by Procurement Management System</li>
                  <li>© ${new Date().getFullYear()} Procurement Department</li>
                  <li>Confidential - For internal finance use only</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          // Auto-print and close
          setTimeout(() => {
            window.print();
            setTimeout(() => {
              if (!document.querySelector('.no-print')) {
                window.close();
              }
            }, 500);
          }, 300);
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
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
      {/* Hidden file input for Excel import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleImportFromExcel}
      />

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading invoices..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
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
        <div id="invoices-section" className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Invoices</h3>
            </div>

            {/* Export/Import/Print Buttons */}
            <div className="flex items-center gap-3">
              {/* Print Button */}
              <button
                onClick={handlePrint}
               className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
              >
                <Printer size={16} />
                Print
              </button>
              
              {/* Excel Import */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
              >
                <FileSpreadsheet size={16} />
                Excel Import
              </button>

              {/* Excel Export */}
              <button
                onClick={handleExportToExcel}
               className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
              >
                <Upload size={16} />
                Excel Export
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{filteredInvoices.length} of {totalInvoices} invoices</span>
              </div>
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