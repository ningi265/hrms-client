"use client"

import { useState, useEffect,useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Building2,
  Search,
  Plus,
  MoreVertical,
  Save,
  X,
  Printer,
  FileSpreadsheet,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Upload,
  Activity,
  DollarSign,
  Users,
  Crown,
  BarChart3,
  Copy,
  MessageSquare,
  Settings,
  FileText,
  TrendingUp,
  TrendingDown,
  Shield,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Loader
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "../../../authcontext/authcontext"
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
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={16} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
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

// Department Card Component (styled like vehicle cards)
const DepartmentCard = ({ department, onMenuClick, showMenuId, onDelete, actionLoading }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'restructuring': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'merging': return 'bg-blue-100 text-blue-800';
      case 'dissolving': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-blue-50 rounded-xl">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">{department.name}</h4>
            <p className="text-xs text-gray-500">{department.departmentHead}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(department.status)}`}>
            {department.status}
          </span>
          <button
            data-department-id={department._id}
            onClick={() => onMenuClick(department._id)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">{department.employeeCount || 0}</div>
          <div className="text-xs text-gray-500">Employees</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className={`text-base font-bold ${getPerformanceColor(department.performance || 0)}`}>
            {department.performance || 0}%
          </div>
          <div className="text-xs text-gray-500">Performance</div>
        </div>
      </div>

      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Budget</span>
          <span className="text-xs font-medium">{formatBudget(department.budget || 0)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Location</span>
          <span className="text-xs font-medium">{department.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Established</span>
          <span className="text-xs font-medium">
            {department.establishedDate ? new Date(department.establishedDate).getFullYear() : 'N/A'}
          </span>
        </div>
      </div>

      {department.goals && department.goals.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Goals</div>
          <div className="flex flex-wrap gap-1">
            {department.goals.slice(0, 2).map((goal, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {goal}
              </span>
            ))}
            {department.goals.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{department.goals.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail size={12} />
          <span className="truncate">{department.headEmail}</span>
        </div>
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-xl">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-blue-600 rounded-xl">
            <Edit size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DepartmentsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false)
  const [showMenuId, setShowMenuId] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    departmentHead: "",
    headEmail: "",
    headPhone: "",
    budget: "",
    location: "",
    floor: "",
    building: "",
    status: "active",
    goals: [],
    establishedDate: "",
    maxCapacity: "",
  })
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")
    const fileInputRef = useRef(null);

   const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token")
        console.log("Fetching departments from:", `${backendUrl}/api/departments`)
        
        const response = await fetch(`${backendUrl}/api/departments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const result = await response.json()
          console.log("Departments fetched successfully:", result)
          
          // Handle the structured response - departments are in result.data
          if (result.success && Array.isArray(result.data)) {
            setDepartments(result.data)
          } else if (Array.isArray(result)) {
            // Fallback for direct array response
            setDepartments(result)
          } else {
            // If neither structure matches, set empty array
            console.warn("Unexpected response structure:", result)
            setDepartments([])
          }
        } else {
          throw new Error("Failed to fetch departments")
        }
      } catch (error) {
        setError("Failed to fetch departments")
        console.error("Failed to fetch departments:", error)
        setDepartments([]) // Ensure departments is always an array
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [backendUrl])

  // Ensure filteredDepartments always works with an array
  const filteredDepartments = Array.isArray(departments) ? departments.filter((department) => {
    const nameMatch = department.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const headMatch = department.departmentHead?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const locationMatch = department.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const goalsMatch =
      department.goals && Array.isArray(department.goals)
        ? department.goals.some(
            (goal) => goal && typeof goal === "string" && goal.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : false

    return nameMatch || headMatch || locationMatch || goalsMatch
  }) : []

  // Calculate stats with safety checks
  const totalDepartments = Array.isArray(departments) ? departments.length : 0
  const activeDepartments = Array.isArray(departments) ? departments.filter((dept) => dept.status === "active").length : 0
  const totalEmployees = Array.isArray(departments) ? departments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0) : 0
  const totalBudget = Array.isArray(departments) ? departments.reduce((sum, dept) => sum + (dept.budget || 0), 0) : 0

  const handleDeleteDepartment = async (departmentId) => {
    setActionLoading(departmentId);
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/departments/${departmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setDepartments((prev) => Array.isArray(prev) ? prev.filter((department) => department._id !== departmentId) : [])
        showNotificationMessage("Department deleted successfully!", "success")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete department")
      }
    } catch (error) {
      showNotificationMessage(error.message || "Failed to delete department", "error")
      console.error("Failed to delete department:", error)
    } finally {
      setActionLoading(null);
      setShowMenuId(null)
    }
  }

const handleExportToExcel = async () => {
  if (!departments || departments.length === 0) {
    showNotificationMessage("No departments to export", "error");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Departments');

    // Define headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'DepartmentHead', key: 'departmentHead', width: 20 },
      { header: 'Email', key: 'headEmail', width: 25 },
      { header: 'Phone', key: 'headPhone', width: 15 },
      { header: 'Budget', key: 'budget', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Building', key: 'building', width: 15 },
      { header: 'Floor', key: 'floor', width: 10 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Goals', key: 'goals', width: 30 },
      { header: 'Established', key: 'establishedDate', width: 12 },
      { header: 'MaxCapacity', key: 'maxCapacity', width: 12 },
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    departments.forEach((dept) => {
      worksheet.addRow({
        name: dept.name,
        description: dept.description,
        departmentHead: dept.departmentHead,
        headEmail: dept.headEmail,
        headPhone: dept.headPhone,
        budget: dept.budget,
        location: dept.location,
        building: dept.building,
        floor: dept.floor,
        status: dept.status,
        goals: dept.goals?.join(", ") || '',
        establishedDate: dept.establishedDate
          ? new Date(dept.establishedDate).toLocaleDateString()
          : '',
        maxCapacity: dept.maxCapacity,
      });
    });

    // Auto-fit columns (ExcelJS doesn't have auto-width, so we set manually)
    worksheet.columns.forEach(column => {
      if (column.width) {
        const lengths = column.values.map(v => v ? v.toString().length : 0);
        const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
        column.width = Math.min(Math.max(maxLength, column.width || 10), 50);
      }
    });

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'departments.xlsx';
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
          Name: row.getCell(1).value,
          Description: row.getCell(2).value,
          DepartmentHead: row.getCell(3).value,
          Email: row.getCell(4).value,
          Phone: row.getCell(5).value,
          Budget: row.getCell(6).value,
          Location: row.getCell(7).value,
          Building: row.getCell(8).value,
          Floor: row.getCell(9).value,
          Status: row.getCell(10).value,
          Goals: row.getCell(11).value,
          Established: row.getCell(12).value,
          MaxCapacity: row.getCell(13).value,
        };
        rows.push(rowData);
      }
    });

    const token = localStorage.getItem("token");

    // Import each row
    const importPromises = rows.map(async (row) => {
      const payload = {
        name: row.Name || "",
        description: row.Description || "",
        departmentHead: row.DepartmentHead || "",
        headEmail: row.Email || "",
        headPhone: row.Phone || "",
        budget: Number(row.Budget) || 0,
        location: row.Location || "",
        building: row.Building || "",
        floor: row.Floor || "",
        status: row.Status || "active",
        goals: row.Goals ? row.Goals.split(",").map((g) => g.trim()) : [],
        establishedDate: row.Established
          ? new Date(row.Established).toISOString()
          : "",
        maxCapacity: Number(row.MaxCapacity) || "",
      };

      const response = await fetch(`${backendUrl}/api/departments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to import department: ${row.Name}`);
      }

      return response.json();
    });

    await Promise.all(importPromises);
    showNotificationMessage(`Excel import completed successfully! ${rows.length} departments imported.`, "success");
    handleRefresh();
  } catch (err) {
    console.error("Import error:", err);
    showNotificationMessage(`Excel import failed: ${err.message}`, "error");
  }
};

const handlePrint = () => {
  const printContents = document.getElementById("departments-section")?.innerHTML;
  if (!printContents) {
    showNotificationMessage("Nothing to print", "error");
    return;
  }

  const printWindow = window.open("", "_blank", "width=900,height=700");

  // Create a cleaner table for printing
  const tableHTML = `
    <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; font-family: Arial, sans-serif; font-size: 12px;">
      <thead>
        <tr>
          <th>Name</th>
          <th>Department Head</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Location</th>
          <th>Status</th>
          <th>Budget</th>
        </tr>
      </thead>
      <tbody>
        ${departments.map(dept => `
          <tr>
            <td>${dept.name || ''}</td>
            <td>${dept.departmentHead || ''}</td>
            <td>${dept.headEmail || ''}</td>
            <td>${dept.headPhone || ''}</td>
            <td>${dept.location || ''}</td>
            <td>${dept.status || ''}</td>
            <td>${formatBudget(dept.budget || 0)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  printWindow.document.write(`
    <html>
      <head>
        <title>Departments Print - ${new Date().toLocaleDateString()}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f4f4f4; font-weight: bold; }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Department List</h1>
          <div>Generated: ${new Date().toLocaleString()}</div>
        </div>
        <div>Total Departments: ${departments.length}</div>
        ${tableHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};



  const openAddDepartmentModal = () => {
    setIsAddDepartmentModalOpen(true)
  }

  const closeAddDepartmentModal = () => {
    setIsAddDepartmentModalOpen(false)
    setFormData({
      name: "",
      description: "",
      departmentHead: "",
      headEmail: "",
      headPhone: "",
      budget: "",
      location: "",
      floor: "",
      building: "",
      status: "active",
      goals: [],
      establishedDate: "",
      maxCapacity: "",
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "goals") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsFormSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/departments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()

      if (response.ok) {
        // Handle both response structures
        const newDepartment = responseData.department || responseData.data || responseData
        setDepartments((prev) => Array.isArray(prev) ? [...prev, newDepartment] : [newDepartment])
        showNotificationMessage("Department added successfully!", "success")
        closeAddDepartmentModal()
      } else {
        throw new Error(responseData.message || "Failed to add department")
      }
    } catch (err) {
      showNotificationMessage(err.message || "Failed to add department", "error")
      console.error("Failed to add department:", err)
    } finally {
      setIsFormSubmitting(false)
    }
  }

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotificationMessage("Department ID copied to clipboard!", "success");
    setShowMenuId(null);
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  }

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">{error}</div>
      </div>
    )
  }




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading departments..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">

        <input
  ref={fileInputRef}
  type="file"
  accept=".xlsx, .xls"
  className="hidden"
  onChange={handleImportFromExcel}
/>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl text-sm bg-white"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={openAddDepartmentModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Department
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Departments" 
            value={totalDepartments}
            icon={Building2} 
            color="blue" 
            subtitle="In organization"
          />
          <MetricCard 
            title="Active Departments" 
            value={activeDepartments}
            icon={CheckCircle} 
            color="green" 
            trend={5}
            subtitle="Currently operational"
          />
          <MetricCard 
            title="Total Employees" 
            value={totalEmployees}
            icon={Users} 
            color="purple" 
            trend={12}
            subtitle="Across all departments"
          />
          <MetricCard 
            title="Total Budget" 
            value={formatBudget(totalBudget)}
            icon={DollarSign} 
            color="orange" 
            trend={-2}
            subtitle="Annual allocation"
          />
        </div>

        {/* Department Cards */}
       <div id="departments-section" className="bg-white rounded-2xl border border-gray-200 p-4">

           <div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-2">
    <Building2 className="w-5 h-5 text-gray-600" />
    <h3 className="font-semibold text-gray-900">Departments</h3>
  </div>

  <div className="flex items-center gap-3">
  {/* Print */}
<button
   className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
>
   <Printer size={16} />
  Print
</button>
    {/* Excel Import */}
    <button
   className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
  onClick={() => fileInputRef.current.click()}
>
  <FileSpreadsheet size={16} />
  Excel Import
</button>

    {/* Excel Export */}
    <button
   className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
  onClick={handleExportToExcel}
>
   <Upload size={16} />
  Excel Export
</button>
{/* Count */}
    <span className="text-sm text-gray-500">
      {filteredDepartments.length} of {totalDepartments} departments
    </span>
  </div>
</div>


          {filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No departments match your search" : "No departments found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Start by adding your first department."}
              </p>
              <button
                onClick={openAddDepartmentModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Add Department
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredDepartments.map((department) => (
                <DepartmentCard
                  key={department._id}
                  department={department}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onDelete={handleDeleteDepartment}
                  actionLoading={actionLoading}
                />
              ))}
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
      className="fixed z-[101] w-56 bg-white rounded-2xl shadow-xl border border-gray-200"
      style={{
        top: (() => {
          const button = document.querySelector(`[data-department-id="${showMenuId}"]`);
          if (button) {
            const rect = button.getBoundingClientRect();
            return `${rect.bottom + window.scrollY}px`; // Directly at button bottom edge
          }
          return '50px';
        })(),
        left: (() => {
          const button = document.querySelector(`[data-department-id="${showMenuId}"]`);
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
          onClick={() => {
            navigate(`/dashboard/departments/${showMenuId}`);
            setShowMenuId(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm rounded-xl"
        >
          <Eye size={16} className="text-gray-500" />
          View Details
        </button>
        
        {/* Other menu items with same styling */}
        <button
          onClick={() => {
            navigate(`/dashboard/departments/${showMenuId}/edit`);
            setShowMenuId(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left text-sm rounded-xl"
        >
          <Edit size={16} className="text-gray-500" />
          Edit Department
        </button>

        <div className="border-t border-gray-100 my-1"></div>

        <button
          onClick={() => handleDeleteDepartment(showMenuId)}
          disabled={actionLoading === showMenuId}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 text-left text-sm rounded-xl"
        >
          <Trash2 size={16} />
          Delete Department
          {actionLoading === showMenuId && (
            <div className="ml-auto">
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      </div>
    </motion.div>
  </>
)}

      {/* Add Department Modal */}
    {isAddDepartmentModalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
    <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
      {/* Compact Header */}
      <div className="px-5 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Plus size={18} className="text-blue-500" />
            Add New Department
          </h2>
          <button
            onClick={closeAddDepartmentModal}
            className="p-1.5 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Compact Form Body */}
      <div className="p-5 max-h-[75vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Engineering"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="restructuring">Restructuring</option>
                <option value="inactive">Inactive</option>
                <option value="merging">Merging</option>
                <option value="dissolving">Dissolving</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="Department's purpose and responsibilities"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department Head *
              </label>
              <input
                type="text"
                name="departmentHead"
                value={formData.departmentHead}
                onChange={handleInputChange}
                required
                placeholder="e.g., John Smith"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Head Email *
              </label>
              <input
                type="email"
                name="headEmail"
                value={formData.headEmail}
                onChange={handleInputChange}
                required
                placeholder="john.smith@company.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Head Phone *
              </label>
              <input
                type="tel"
                name="headPhone"
                value={formData.headPhone}
                onChange={handleInputChange}
                required
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Established Date *
              </label>
              <input
                type="date"
                name="establishedDate"
                value={formData.establishedDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Budget *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                required
                placeholder="e.g., 500000"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., Building A, Floor 3"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Building
              </label>
              <input
                type="text"
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                placeholder="e.g., Building A"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Floor
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                placeholder="e.g., Floor 3"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Department Goals
            </label>
            <select
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              multiple
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-2xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            >
              <option value="Product Development">Product Development</option>
              <option value="Technical Innovation">Technical Innovation</option>
              <option value="System Optimization">System Optimization</option>
              <option value="Brand Growth">Brand Growth</option>
              <option value="Lead Generation">Lead Generation</option>
              <option value="Customer Engagement">Customer Engagement</option>
              <option value="Revenue Growth">Revenue Growth</option>
              <option value="Customer Retention">Customer Retention</option>
              <option value="Market Expansion">Market Expansion</option>
              <option value="Talent Acquisition">Talent Acquisition</option>
              <option value="Employee Development">Employee Development</option>
              <option value="Culture Building">Culture Building</option>
              <option value="Financial Planning">Financial Planning</option>
              <option value="Cost Optimization">Cost Optimization</option>
              <option value="Compliance">Compliance</option>
              <option value="Process Improvement">Process Improvement</option>
              <option value="Efficiency">Efficiency</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Digital Transformation">Digital Transformation</option>
              <option value="Risk Management">Risk Management</option>
            </select>
            <div className="mt-1">
              <div className="flex flex-wrap gap-1">
                {formData.goals.map((goal, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-2xl text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {goal}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          goals: formData.goals.filter((_, i) => i !== index)
                        });
                      }}
                      className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Hold <kbd className="px-1 py-0.5 bg-gray-100 rounded-xl">Ctrl</kbd> (Windows) or <kbd className="px-1 py-0.5 bg-gray-100 rounded-xl">Cmd</kbd> (Mac) to select multiple
              </p>
            </div>
          </div>

          {/* Compact Footer */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={closeAddDepartmentModal}
              className="px-4 py-2 text-xs text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormSubmitting}
              className="px-4 py-2 text-xs bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormSubmitting ? (
                <>
                  <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Create Department
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
          <div
            className={`px-6 py-4 rounded-2xl shadow-2xl border ${
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