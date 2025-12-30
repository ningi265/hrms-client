import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  AlertCircle,
  Clock,
  DollarSign,
  User,
  Package,
  Eye,
  Download,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  FileText,
  Users,
  Settings,
  ChevronDown,
  MoreVertical,
  Calendar,
  Tag,
  Shield,
  CheckCircle,
  Loader,
  Printer,
  Upload,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExcelJS from 'exceljs';

// LoadingOverlay Component
const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
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
    <div className={`bg-white rounded-2xl border border-gray-200 p-1.5 hover:shadow-sm transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`p-1.5 rounded-xl ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'amber' ? 'bg-amber-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={16} className={
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
              <TrendingUp size={12} className="text-emerald-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
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

// Requisition Card Component (styled like vehicle cards)
const RequisitionCard = ({ requisition, onMenuClick, showMenuId, onAction, onView, onDownload, getUrgencyColor, getUrgencyIcon, formatDate }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-blue-50 rounded-xl">
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">
              {requisition.itemName || "N/A"}
            </h4>
            <p className="text-xs text-gray-500">
              {requisition.employee?.firstName || "Unknown Employee"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(requisition.urgency)}`}>
            {getUrgencyIcon(requisition.urgency)}
            <span className="ml-1 capitalize">{requisition.urgency || "N/A"}</span>
          </span>
          <button
            data-requisition-id={requisition._id}
            onClick={() => onMenuClick(requisition._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">
            {requisition.quantity || 0}
          </div>
          <div className="text-xs text-gray-500">Quantity</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            {requisition.budgetCode?.slice(-4) || "N/A"}
          </div>
          <div className="text-xs text-gray-500">Budget Code</div>
        </div>
      </div>

      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Employee</span>
          <span className="text-xs font-medium truncate">{requisition.employee?.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Submitted</span>
          <span className="text-xs font-medium">{requisition.createdAt ? formatDate(requisition.createdAt) : "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Budget Code</span>
          <span className="text-xs font-medium">{requisition.budgetCode || "N/A"}</span>
        </div>
      </div>

      {requisition.description && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Description</div>
          <div className="text-xs text-gray-800 bg-gray-50 p-2 rounded line-clamp-2">
            {requisition.description}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => onAction(requisition._id, "approve")}
            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
          >
            <Check size={12} />
            Approve
          </button>
          <button
            onClick={() => onAction(requisition._id, "reject")}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
          >
            <X size={12} />
            Reject
          </button>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onView(requisition._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={() => onDownload(requisition._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ManageRequisitionsPage() {
  const [requisitions, setRequisitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showMenuId, setShowMenuId] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const backendUrl = import.meta.env.VITE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

  // Fetch pending requisitions
  useEffect(() => {
    const fetchPendingRequisitions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/requisitions/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch requisitions');
        }
        
        const result = await response.json();
        
        // Check if the response has the expected structure
        if (result.success && Array.isArray(result.data)) {
          setRequisitions(result.data);
        } else {
          // Fallback to empty array if structure is unexpected
          setRequisitions([]);
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
        setRequisitions([]); // Ensure we have an array even on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequisitions();
  }, [backendUrl]);

  // Filter requisitions based on search term and status
  const filteredRequisitions = requisitions.filter((requisition) => {
    const matchesSearch = 
      (requisition.itemName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (requisition.employee?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (requisition.employee?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || requisition.urgency === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRequisitions = requisitions.length;
  const highUrgency = requisitions.filter(req => req.urgency === "high").length;
  const mediumUrgency = requisitions.filter(req => req.urgency === "medium").length;
  const lowUrgency = requisitions.filter(req => req.urgency === "low").length;

  // Handle accept/reject action
  const handleAction = async (requisitionId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/requisitions/${requisitionId}/${action}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setRequisitions((prev) =>
          prev.filter((req) => req._id !== requisitionId)
        );
        showNotificationMessage(`Requisition ${action === "approve" ? "approved" : "rejected"} successfully!`, "success");
      } else {
        setError(data.message || "Failed to update requisition");
      }
    } catch (err) {
      showNotificationMessage("Failed to update requisition", "error");
      console.error(err);
    }
    setShowMenuId(null);
  };

  // Handle view requisition details
  const handleViewRequisition = (requisitionId) => {
    navigate(`/requisitions/${requisitionId}`);
    setShowMenuId(null);
  };

  // Handle download PDF
  const handleDownloadPDF = async (requisitionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/requisitions/${requisitionId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `requisition-${requisitionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotificationMessage("PDF downloaded successfully!", "success");
      } else {
        showNotificationMessage("Failed to download PDF", "error");
      }
    } catch (err) {
      showNotificationMessage("Failed to download PDF", "error");
      console.error(err);
    }
    setShowMenuId(null);
  };

  // Export to Excel
 const handleExportToExcel = async () => {
  if (!requisitions || requisitions.length === 0) {
    showNotificationMessage("No requisitions to export", "error");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pending Requisitions');

    // Define headers
    worksheet.columns = [
      { header: 'Item Name', key: 'itemName', width: 25 },
      { header: 'Quantity', key: 'quantity', width: 12 },
      { header: 'Budget Code', key: 'budgetCode', width: 15 },
      { header: 'Urgency', key: 'urgency', width: 12 },
      { header: 'Employee Name', key: 'employeeName', width: 20 },
      { header: 'Employee Email', key: 'employeeEmail', width: 25 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Submitted Date', key: 'submittedDate', width: 15 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Project Code', key: 'projectCode', width: 15 },
      { header: 'Estimated Cost', key: 'estimatedCost', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Justification', key: 'justification', width: 25 },
      { header: 'Required By', key: 'requiredBy', width: 15 },
      { header: 'Location', key: 'location', width: 20 }
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
    requisitions.forEach((req) => {
      const employeeName = req.employee ? 
        `${req.employee.firstName || ''} ${req.employee.lastName || ''}`.trim() : 
        'N/A';
      
      worksheet.addRow({
        itemName: req.itemName || '',
        quantity: req.quantity || 0,
        budgetCode: req.budgetCode || '',
        urgency: req.urgency || 'medium',
        employeeName: employeeName,
        employeeEmail: req.employee?.email || '',
        description: req.description || '',
        submittedDate: req.createdAt ? new Date(req.createdAt).toISOString().split('T')[0] : '',
        department: req.department || '',
        projectCode: req.projectCode || '',
        estimatedCost: req.estimatedCost || 0,
        status: 'Pending Review',
        justification: req.justification || '',
        requiredBy: req.requiredBy ? new Date(req.requiredBy).toISOString().split('T')[0] : '',
        location: req.location || ''
      });
    });

    // Format number columns
    const numberColumns = ['quantity', 'estimatedCost'];
    numberColumns.forEach(colName => {
      const col = worksheet.getColumn(colName);
      col.numFmt = '#,##0';
    });

    // Format date columns
    const dateColumns = ['submittedDate', 'requiredBy'];
    dateColumns.forEach(colName => {
      const col = worksheet.getColumn(colName);
      col.numFmt = 'yyyy-mm-dd';
    });

    // Style urgency column with colors
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header
        const urgencyCell = row.getCell('urgency');
        const urgency = urgencyCell.value?.toString().toLowerCase();
        
        if (urgency === 'high') {
          urgencyCell.font = { color: { argb: 'FFEF4444' }, bold: true }; // Red
        } else if (urgency === 'medium') {
          urgencyCell.font = { color: { argb: 'FFF59E0B' }, bold: true }; // Orange
        } else if (urgency === 'low') {
          urgencyCell.font = { color: { argb: 'FF10B981' }, bold: true }; // Green
        }
      }
    });

    // Style estimated cost column
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const costCell = row.getCell('estimatedCost');
        const cost = Number(costCell.value) || 0;
        if (cost > 10000) {
          costCell.font = { bold: true, color: { argb: 'FFEF4444' } }; // Red for high costs
        } else if (cost > 5000) {
          costCell.font = { bold: true, color: { argb: 'FFF59E0B' } }; // Orange for medium costs
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
      itemName: 'SUMMARY STATISTICS',
      quantity: '',
      budgetCode: '',
      urgency: '',
      employeeName: '',
      employeeEmail: '',
      description: '',
      submittedDate: '',
      department: '',
      projectCode: '',
      estimatedCost: requisitions.reduce((sum, req) => sum + (req.estimatedCost || 0), 0),
      status: '',
      justification: '',
      requiredBy: '',
      location: ''
    });

    // Style summary row
    summaryRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    summaryRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF059669' } // Emerald green
    };

    // Add urgency breakdown
    const urgencyCounts = {};
    requisitions.forEach(req => {
      urgencyCounts[req.urgency] = (urgencyCounts[req.urgency] || 0) + 1;
    });

    Object.entries(urgencyCounts).forEach(([urgency, count]) => {
      const urgencyRow = worksheet.addRow({
        itemName: `Urgency: ${urgency}`,
        quantity: '',
        budgetCode: '',
        urgency: count,
        employeeName: '',
        employeeEmail: '',
        description: '',
        submittedDate: '',
        department: '',
        projectCode: '',
        estimatedCost: '',
        status: '',
        justification: '',
        requiredBy: '',
        location: ''
      });
      
      urgencyRow.getCell('itemName').font = { italic: true };
    });

    // Add department breakdown
    const departmentCounts = {};
    requisitions.forEach(req => {
      const dept = req.department || 'No Department';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    worksheet.addRow([]); // Empty row
    worksheet.addRow({
      itemName: 'DEPARTMENT BREAKDOWN',
      quantity: '',
      budgetCode: '',
      urgency: '',
      employeeName: '',
      employeeEmail: '',
      description: '',
      submittedDate: '',
      department: '',
      projectCode: '',
      estimatedCost: '',
      status: '',
      justification: '',
      requiredBy: '',
      location: ''
    });

    Object.entries(departmentCounts).forEach(([dept, count]) => {
      worksheet.addRow({
        itemName: dept,
        quantity: '',
        budgetCode: '',
        urgency: count,
        employeeName: '',
        employeeEmail: '',
        description: '',
        submittedDate: '',
        department: '',
        projectCode: '',
        estimatedCost: '',
        status: '',
        justification: '',
        requiredBy: '',
        location: ''
      });
    });

    // Add financial summary
    worksheet.addRow([]); // Empty row
    worksheet.addRow({
      itemName: 'FINANCIAL SUMMARY',
      quantity: '',
      budgetCode: '',
      urgency: '',
      employeeName: '',
      employeeEmail: '',
      description: '',
      submittedDate: '',
      department: '',
      projectCode: '',
      estimatedCost: '',
      status: '',
      justification: '',
      requiredBy: '',
      location: ''
    });

    const totalEstimatedCost = requisitions.reduce((sum, req) => sum + (req.estimatedCost || 0), 0);
    const avgCostPerRequisition = requisitions.length > 0 ? (totalEstimatedCost / requisitions.length).toFixed(2) : 0;
    const highCostRequisitions = requisitions.filter(req => (req.estimatedCost || 0) > 10000).length;

    const financialStats = [
      { label: 'Total Estimated Cost', value: totalEstimatedCost },
      { label: 'Average Cost per Requisition', value: avgCostPerRequisition },
      { label: 'High Cost Items (> $10,000)', value: highCostRequisitions },
      { label: 'Total Items Requested', value: requisitions.reduce((sum, req) => sum + (req.quantity || 0), 0) }
    ];

    financialStats.forEach(stat => {
      worksheet.addRow({
        itemName: stat.label,
        quantity: '',
        budgetCode: '',
        urgency: '',
        employeeName: '',
        employeeEmail: '',
        description: '',
        submittedDate: '',
        department: '',
        projectCode: '',
        estimatedCost: stat.value,
        status: '',
        justification: '',
        requiredBy: '',
        location: ''
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
    link.download = `pending-requisitions-report-${today}.xlsx`;
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

  // Import from Excel
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
          'Item Name': row.getCell(1).value,
          'Quantity': row.getCell(2).value,
          'Budget Code': row.getCell(3).value,
          'Urgency': row.getCell(4).value,
          'Employee Name': row.getCell(5).value,
          'Employee Email': row.getCell(6).value,
          'Description': row.getCell(7).value,
          'Submitted Date': row.getCell(8).value,
          'Department': row.getCell(9).value,
          'Project Code': row.getCell(10).value,
          'Estimated Cost': row.getCell(11).value,
          'Status': row.getCell(12).value,
          'Justification': row.getCell(13).value,
          'Required By': row.getCell(14).value,
          'Location': row.getCell(15).value
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
        // 1. Look up employee by email to get employeeId
        // 2. Validate budget codes
        // 3. Check department validity
        
        const payload = {
          itemName: row['Item Name'] || '',
          quantity: Number(row['Quantity']) || 0,
          budgetCode: row['Budget Code'] || '',
          urgency: (row['Urgency'] || 'medium').toLowerCase(),
          description: row['Description'] || '',
          department: row['Department'] || '',
          projectCode: row['Project Code'] || '',
          estimatedCost: Number(row['Estimated Cost']) || 0,
          justification: row['Justification'] || '',
          requiredBy: row['Required By'] ? new Date(row['Required By']).toISOString() : '',
          location: row['Location'] || '',
          // employeeId would need to be looked up from Employee Email
          // For now, we'll set a placeholder or require it to be set manually
        };

        // Validate required fields
        if (!payload.itemName || !payload.quantity || !payload.budgetCode) {
          throw new Error('Missing required fields (Item Name, Quantity, Budget Code)');
        }

        // Validate quantity
        if (payload.quantity <= 0) {
          throw new Error('Quantity must be greater than 0');
        }

        // Validate urgency
        if (!['high', 'medium', 'low'].includes(payload.urgency)) {
          throw new Error('Urgency must be high, medium, or low');
        }

        const response = await fetch(`${backendUrl}/api/requisitions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}: ${row['Item Name']}`);
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
          row: row['Item Name'] || 'Unknown requisition',
          error: err.message
        });
        console.error(`Import error for row:`, row, err);
      }
    }

    if (importResults.success > 0) {
      showNotificationMessage(
        `Excel import completed! ${importResults.success} requisitions imported successfully, ${importResults.failed} failed.`,
        importResults.failed === 0 ? "success" : "warning"
      );
      
      if (importResults.failed > 0) {
        console.warn('Import errors:', importResults.errors);
      }
      
      handleRefresh();
    } else {
      showNotificationMessage(
        `Import failed for all ${importResults.failed} requisitions.`,
        "error"
      );
    }
  } catch (err) {
    console.error("Import error:", err);
    showNotificationMessage(`Excel import failed: ${err.message}`, "error");
  }
};

  // Print functionality
  const handlePrint = () => {
    const printContents = document.getElementById("requisitions-section")?.innerHTML;
    if (!printContents) {
      showNotificationMessage("Nothing to print", "error");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
      <html>
        <head>
          <title>Pending Requisitions Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            .print-header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin-bottom: 20px; 
              padding-bottom: 10px;
              border-bottom: 1px solid #ddd;
            }
            .print-metrics {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .metric-box {
              border: 1px solid #ddd;
              padding: 15px;
              text-align: center;
              border-radius: 8px;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              margin: 5px 0;
            }
            .metric-title {
              font-size: 14px;
              color: #666;
              text-transform: uppercase;
            }
            .requisitions-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-top: 20px;
            }
            .requisition-card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
            }
            .requisition-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .urgency-badge {
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .urgency-high { background-color: #fee; color: #c00; border: 1px solid #fcc; }
            .urgency-medium { background-color: #ffe; color: #c90; border: 1px solid #ffc; }
            .urgency-low { background-color: #efe; color: #090; border: 1px solid #cfc; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
              font-size: 14px; 
            }
            th { background-color: #f4f4f4; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Pending Requisitions Report</h1>
            <div>Generated: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="print-metrics">
            <div class="metric-box">
              <div class="metric-value">${totalRequisitions}</div>
              <div class="metric-title">Total Pending</div>
            </div>
            <div class="metric-box">
              <div class="metric-value">${highUrgency}</div>
              <div class="metric-title">High Urgency</div>
            </div>
            <div class="metric-box">
              <div class="metric-value">${mediumUrgency}</div>
              <div class="metric-title">Medium Urgency</div>
            </div>
            <div class="metric-box">
              <div class="metric-value">${lowUrgency}</div>
              <div class="metric-title">Low Urgency</div>
            </div>
          </div>
          
          <h2>Requisitions List (${filteredRequisitions.length} items)</h2>
          
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Employee</th>
                <th>Urgency</th>
                <th>Budget Code</th>
                <th>Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRequisitions.map(req => `
                <tr>
                  <td>${req.itemName || "N/A"}</td>
                  <td>${req.quantity || 0}</td>
                  <td>${req.employee?.firstName || "Unknown"} ${req.employee?.lastName || ""}</td>
                  <td>
                    <span class="urgency-badge urgency-${req.urgency || 'medium'}">
                      ${req.urgency || "N/A"}
                    </span>
                  </td>
                  <td>${req.budgetCode || "N/A"}</td>
                  <td>${req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.print();
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "text-red-700 bg-red-50 border-red-200";
      case "medium":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "low":
        return "text-green-700 bg-green-50 border-green-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return <AlertCircle size={12} />;
      case "medium":
        return <Clock size={12} />;
      case "low":
        return <CheckCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
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
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
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
      <LoadingOverlay isVisible={isLoading} message="Loading requisitions..." />

      {/* Hidden file input for Excel import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleImportFromExcel}
      />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requisitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
            >
              <option value="all">All Urgency</option>
              <option value="high">High Urgency</option>
              <option value="medium">Medium Urgency</option>
              <option value="low">Low Urgency</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
          
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Pending" 
            value={totalRequisitions}
            icon={Package} 
            color="blue" 
            subtitle="Awaiting review"
          />
          <MetricCard 
            title="High Urgency" 
            value={highUrgency}
            icon={AlertCircle} 
            color="red" 
            trend={-12}
            subtitle="Immediate attention"
          />
          <MetricCard 
            title="Medium Urgency" 
            value={mediumUrgency}
            icon={Clock} 
            color="amber" 
            subtitle="Standard processing"
          />
          <MetricCard 
            title="Low Urgency" 
            value={lowUrgency}
            icon={CheckCircle} 
            color="green" 
            trend={8}
            subtitle="Routine requests"
          />
        </div>

        {/* Requisitions Cards */}
        <div id="requisitions-section" className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Pending Requisitions</h3>
            </div>

              {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
            >
              <Printer size={16} />
              Print
            </button>

            {/* Excel Import Button */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
            >
              <Upload size={16} />
              Excel Import
            </button>

            {/* Excel Export Button */}
            <button
              onClick={handleExportToExcel}
              className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
            >
              <FileSpreadsheet size={16} />
              Excel Export
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filteredRequisitions.length} of {totalRequisitions} requisitions</span>
            </div>
          </div>

          {filteredRequisitions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No requisitions match your filters" : "No Pending Requisitions"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search criteria or filters."
                  : "All requisitions have been processed. New requests will appear here."}
              </p>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 mx-auto"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredRequisitions.map((requisition) => (
                <RequisitionCard
                  key={requisition._id}
                  requisition={requisition}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onAction={handleAction}
                  onView={handleViewRequisition}
                  onDownload={handleDownloadPDF}
                  getUrgencyColor={getUrgencyColor}
                  getUrgencyIcon={getUrgencyIcon}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
      {showMenuId && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-transparent"
            onClick={() => setShowMenuId(null)}
          ></div>
          
          <div 
            className="fixed z-[101] w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-requisition-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 280;
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const spaceAbove = rect.top;
                  
                  if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
                    return `${rect.top - menuHeight + window.scrollY}px`;
                  } else {
                    return `${rect.bottom + 8 + window.scrollY}px`;
                  }
                }
                return '50px';
              })(),
              left: (() => {
                const button = document.querySelector(`[data-requisition-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuWidth = 256;
                  const spaceRight = window.innerWidth - rect.right;
                  
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
              <button
                onClick={() => handleViewRequisition(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Eye size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">View Details</div>
                  <div className="text-xs text-gray-500">See full requisition</div>
                </div>
              </button>
              
              <button
                onClick={() => handleDownloadPDF(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors text-left"
              >
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Download size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Download PDF</div>
                  <div className="text-xs text-gray-500">Export as document</div>
                </div>
              </button>
              
              <div className="border-t border-gray-100 my-2 mx-4"></div>
              
              <button
                onClick={() => handleAction(showMenuId, "approve")}
                className="w-full flex items-center space-x-3 px-4 py-3 text-green-700 hover:bg-green-50 transition-colors text-left"
              >
                <div className="p-2 bg-green-50 rounded-lg">
                  <Check size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Approve</div>
                  <div className="text-xs text-green-600">Accept this request</div>
                </div>
              </button>
              
              <button
                onClick={() => handleAction(showMenuId, "reject")}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-700 hover:bg-red-50 transition-colors text-left"
              >
                <div className="p-2 bg-red-50 rounded-lg">
                  <X size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Reject</div>
                  <div className="text-xs text-red-600">Decline this request</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

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