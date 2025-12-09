import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Save,
  FileSpreadsheet,
  Printer,
  X,
  Upload,
  Star,
  Phone,
  Mail,
  Briefcase,
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
  User,
  Clock,
  Calendar,
  Shield,
  Copy,
  MessageSquare,
  Settings,
  FileText,
  UserPlus,
  CheckCircle,
  DollarSign,
  Loader
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import * as XLSX from "xlsx"; // Add this import

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

// Employee Card Component (styled like vehicle cards)
const EmployeeCard = ({ employee, onMenuClick, showMenuId, onDelete, actionLoading, findEmployeeDepartment }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const employeeId = employee._id || employee.id || employee.employeeId;
  const employeeDepartment = findEmployeeDepartment(employeeId);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-blue-50 rounded-xl">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900">
              {`${employee.firstName || ''} ${employee.lastName || ''}`.trim() || "N/A"}
            </h4>
            <p className="text-xs text-gray-500">{employee.position || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
            {employee.status}
          </span>
          <button
            data-employee-id={employeeId}
            onClick={() => onMenuClick(employeeId)}
            className="p-1 text-gray-400 hover:text-blue-600 rounded-xl"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">
            ${employee.salary ? employee.salary.toLocaleString() : 0}
          </div>
          <div className="text-xs text-gray-500">Salary</div>
        </div>
        <div className="text-center p-1.5 bg-gray-50 rounded-xl">
          <div className="text-base font-bold text-gray-900">
            {employee.hireDate 
              ? `${Math.floor((new Date() - new Date(employee.hireDate)) / (1000 * 60 * 60 * 24 * 365))}` 
              : 0}
          </div>
          <div className="text-xs text-gray-500">Years</div>
        </div>
      </div>

      <div className="space-y-0.5 mb-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Email</span>
          <span className="text-xs font-medium truncate">{employee.email || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Phone</span>
          <span className="text-xs font-medium">{employee.phoneNumber || employee.phone || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Department</span>
          <span className="text-xs font-medium">
            {employeeDepartment ? employeeDepartment.departmentCode : "N/A"}
          </span>
        </div>
      </div>

      {employee.skills && employee.skills.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 mb-1">Skills</div>
          <div className="flex flex-wrap gap-1">
            {employee.skills.slice(0, 2).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {skill}
              </span>
            ))}
            {employee.skills.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{employee.skills.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Hired: {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "N/A"}
        </span>
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

export default function EmployeesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [showMenuId, setShowMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    department: "",
    position: "",
    hireDate: "",
    salary: "",
    status: "active",
    emergencyContact: "",
    skills: [],
  });
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'dashboard';
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [departments, setDepartments] = useState([]);
  const fileInputRef = useRef(null); // Add this ref for file input
  const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`?section=${section}`, { replace: true });
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/auth/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("Employees fetched successfully:", result);
          
          // Handle both response structures
          if (result.success && Array.isArray(result.data)) {
            setEmployees(result.data);
          } else if (Array.isArray(result)) {
            setEmployees(result);
          } else {
            console.warn("Unexpected employees response structure:", result);
            setEmployees([]);
          }
        } else {
          throw new Error("Failed to fetch employees");
        }
      } catch (error) {
        setError("Failed to fetch employees");
        console.error("Failed to fetch employees:", error);
        setEmployees([]); // Ensure employees is always an array
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [backendUrl]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/departments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("Departments fetched successfully:", result);
          
          // Handle the structured response - departments are in result.data
          if (result.success && Array.isArray(result.data)) {
            setDepartments(result.data);
          } else if (Array.isArray(result)) {
            // Fallback for direct array response
            setDepartments(result);
          } else {
            console.warn("Unexpected departments response structure:", result);
            setDepartments([]);
          }
        } else {
          throw new Error("Failed to fetch departments");
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments([]); // Ensure departments is always an array
      }
    };

    fetchDepartments();
  }, [backendUrl]);

  // Debug effect to show employee-department mapping after both are loaded
  useEffect(() => {
    if (Array.isArray(employees) && employees.length > 0 && Array.isArray(departments) && departments.length > 0) {
      console.log("Employee-Department Mapping:");
      employees.forEach(emp => {
        const employeeId = emp._id || emp.id || emp.employeeId;
        const department = findEmployeeDepartment(employeeId);
        console.log(`${emp.firstName} ${emp.lastName} (${employeeId}) -> ${department ? `${department.name} (${department.departmentCode})` : 'No Department'}`);
      });
    }
  }, [employees, departments]);

  // Function to find employee's department from departments array
  const findEmployeeDepartment = (employeeId) => {
    if (!employeeId || !Array.isArray(departments) || departments.length === 0) return null;
    
    const department = departments.find(dept => 
      dept.employees && Array.isArray(dept.employees) && dept.employees.includes(employeeId)
    );
    
    return department || null;
  };

  // Excel Export Functionality
  const handleExportToExcel = () => {
    if (!employees || employees.length === 0) {
      showNotificationMessage("No employees to export", "error");
      return;
    }

    const formatted = employees.map((emp) => {
      const employeeId = emp._id || emp.id || emp.employeeId;
      const employeeDepartment = findEmployeeDepartment(employeeId);
      
      return {
        "Employee ID": employeeId || "N/A",
        "First Name": emp.firstName || "",
        "Last Name": emp.lastName || "",
        "Full Name": `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
        "Email": emp.email || "",
        "Phone": emp.phoneNumber || emp.phone || "",
        "Position": emp.position || "",
        "Department": employeeDepartment ? employeeDepartment.name : "",
        "Department Code": employeeDepartment ? employeeDepartment.departmentCode : "",
        "Salary": emp.salary || 0,
        "Hire Date": emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : "",
        "Status": emp.status || "",
        "Address": emp.address || "",
        "Emergency Contact": emp.emergencyContact || "",
        "Skills": emp.skills ? emp.skills.join(", ") : "",
        "Years of Service": emp.hireDate 
          ? Math.floor((new Date() - new Date(emp.hireDate)) / (1000 * 60 * 60 * 24 * 365))
          : 0
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "employees.xlsx");

    showNotificationMessage("Export successful!", "success");
  };

  // Excel Import Functionality
  const handleImportFromExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const token = localStorage.getItem("token");

      for (const row of rows) {
        // Find department by name or code
        let departmentId = "";
        if (row.Department || row["Department Code"]) {
          const dept = departments.find(d => 
            d.name === row.Department || d.departmentCode === row["Department Code"]
          );
          departmentId = dept ? dept._id : "";
        }

        const payload = {
          firstName: row["First Name"] || "",
          lastName: row["Last Name"] || "",
          email: row.Email || "",
          phoneNumber: row.Phone || "",
          address: row.Address || "",
          department: departmentId,
          position: row.Position || "",
          hireDate: row["Hire Date"] 
            ? new Date(row["Hire Date"]).toISOString()
            : new Date().toISOString(),
          salary: Number(row.Salary) || 0,
          status: row.Status || "active",
          emergencyContact: row["Emergency Contact"] || "",
          skills: row.Skills ? row.Skills.split(",").map(s => s.trim()) : [],
          employmentType: "full-time",
          workLocation: "office"
        };

        await fetch(`${backendUrl}/api/auth/employees`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      showNotificationMessage("Excel import completed successfully!", "success");
      handleRefresh();
    } catch (err) {
      console.error(err);
      showNotificationMessage("Excel import failed!", "error");
    }
  };

  // Print Functionality
  const handlePrint = () => {
    const printContents = document.getElementById("employees-section")?.innerHTML;
    if (!printContents) {
      showNotificationMessage("Nothing to print", "error");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    printWindow.document.write(`
      <html>
        <head>
          <title>Employees Print</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            .print-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
              gap: 15px; 
              margin-top: 20px; 
            }
            .print-card { 
              border: 1px solid #ddd; 
              padding: 15px; 
              border-radius: 10px; 
              page-break-inside: avoid;
            }
            .print-header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin-bottom: 10px; 
              border-bottom: 1px solid #eee; 
              padding-bottom: 10px; 
            }
            .print-metrics { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 10px; 
              margin-bottom: 20px; 
            }
            .print-metric { 
              text-align: center; 
              padding: 10px; 
              border: 1px solid #ddd; 
              border-radius: 8px; 
            }
            @media print {
              body { padding: 0; }
              .print-card { margin-bottom: 15px; }
            }
          </style>
        </head>
        <body>
          <h1>Employee List</h1>
          <div class="print-metrics">
            <div class="print-metric">
              <h3>Total Employees</h3>
              <p>${totalEmployees}</p>
            </div>
            <div class="print-metric">
              <h3>Active Employees</h3>
              <p>${activeEmployees}</p>
            </div>
            <div class="print-metric">
              <h3>Departments</h3>
              <p>${totalDepartments}</p>
            </div>
            <div class="print-metric">
              <h3>Avg Tenure</h3>
              <p>${avgTenure} years</p>
            </div>
          </div>
          <div class="print-grid">
            ${filteredEmployees.map(emp => {
              const employeeId = emp._id || emp.id || emp.employeeId;
              const employeeDepartment = findEmployeeDepartment(employeeId);
              return `
                <div class="print-card">
                  <div class="print-header">
                    <div>
                      <h3>${emp.firstName || ''} ${emp.lastName || ''}</h3>
                      <p>${emp.position || 'N/A'}</p>
                    </div>
                    <span style="
                      padding: 4px 8px; 
                      border-radius: 12px; 
                      font-size: 12px;
                      ${emp.status === 'active' ? 'background-color: #d1fae5; color: #065f46;' : 
                        emp.status === 'on-leave' ? 'background-color: #fef3c7; color: #92400e;' :
                        'background-color: #fee2e2; color: #991b1b;'}
                    ">
                      ${emp.status}
                    </span>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
                    <div style="text-align: center; padding: 8px; background-color: #f9fafb; border-radius: 8px;">
                      <strong>$${emp.salary ? emp.salary.toLocaleString() : 0}</strong>
                      <p style="font-size: 12px; color: #6b7280;">Salary</p>
                    </div>
                    <div style="text-align: center; padding: 8px; background-color: #f9fafb; border-radius: 8px;">
                      <strong>${emp.hireDate ? Math.floor((new Date() - new Date(emp.hireDate)) / (1000 * 60 * 60 * 24 * 365)) : 0}</strong>
                      <p style="font-size: 12px; color: #6b7280;">Years</p>
                    </div>
                  </div>
                  <div style="font-size: 13px;">
                    <p><strong>Email:</strong> ${emp.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${emp.phoneNumber || emp.phone || 'N/A'}</p>
                    <p><strong>Department:</strong> ${employeeDepartment ? employeeDepartment.departmentCode : 'N/A'}</p>
                    <p><strong>Hired:</strong> ${emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A'}</p>
                    ${emp.skills && emp.skills.length > 0 ? `
                      <p><strong>Skills:</strong> ${emp.skills.slice(0, 3).join(', ')}${emp.skills.length > 3 ? '...' : ''}</p>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.print();
  };

  // Ensure filteredEmployees always works with an array
  const filteredEmployees = Array.isArray(employees) ? employees.filter((employee) => {
    const employeeId = employee._id || employee.id || employee.employeeId;
    const employeeDepartment = findEmployeeDepartment(employeeId);
    
    const nameMatch = `${employee.firstName || ''} ${employee.lastName || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const departmentMatch = employeeDepartment 
      ? employeeDepartment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employeeDepartment.departmentCode?.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    
    const positionMatch = employee.position 
      ? employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    
    const skillsMatch = employee.skills && Array.isArray(employee.skills) 
      ? employee.skills.some(skill => 
          skill && typeof skill === 'string' && skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : false;
    
    return nameMatch || departmentMatch || positionMatch || skillsMatch;
  }) : [];

  // Calculate stats with safety checks
  const totalEmployees = Array.isArray(employees) ? employees.length : 0;
  const activeEmployees = Array.isArray(employees) ? employees.filter(employee => employee.status === "active").length : 0;
  const totalDepartments = Array.isArray(departments) ? departments.length : 0;
  const avgTenure = Array.isArray(employees) && employees.length > 0 
    ? (employees.reduce((sum, employee) => {
        const hireDate = new Date(employee.hireDate);
        const today = new Date();
        const tenure = (today - hireDate) / (1000 * 60 * 60 * 24 * 365);
        return sum + tenure;
      }, 0) / employees.length).toFixed(1) 
    : 0;

  const handleDeleteEmployee = async (employeeId) => {
    console.log("Deleting employee with ID:", employeeId);
    if (!employeeId) {
      console.error("Employee ID is undefined for delete!");
      showNotificationMessage("Error: Employee ID not found", "error");
      return;
    }
    
    setActionLoading(employeeId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEmployees((prev) => Array.isArray(prev) ? prev.filter((employee) => {
          const empId = employee._id || employee.id || employee.employeeId;
          return empId !== employeeId;
        }) : []);
        showNotificationMessage("Employee deleted successfully!", "success");
      } else {
        throw new Error("Failed to delete employee");
      }
    } catch (error) {
      showNotificationMessage("Failed to delete employee", "error");
      console.error("Failed to delete employee:", error);
    } finally {
      setActionLoading(null);
      setShowMenuId(null);
    }
  };

  const openAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const closeAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      department: "",
      position: "",
      hireDate: "",
      salary: "",
      status: "active",
      emergencyContact: "",
      skills: [],
    });
  };

  // Helper function to get department name by ID for display
  const getDepartmentNameById = (departmentId) => {
    if (!departmentId || !Array.isArray(departments)) return "";
    const dept = departments.find(d => d._id === departmentId);
    return dept ? dept.name : "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }));
    } else if (name === "department") {
      // Find the selected department to get its ID
      const selectedDepartment = departments.find(dept => dept.name === value);
      setFormData((prev) => ({
        ...prev,
        [name]: selectedDepartment ? selectedDepartment._id : value, // Use ID instead of name
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

      const selectedDept = departments.find(dept => dept._id === formData.department);
    
    const payload = {
      ...formData,
      departmentId: selectedDept?._id  // Send ID
    };
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/auth/employees`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
           body: JSON.stringify(payload),
      });
      const responseData = await response.json();

      if (response.ok) {
        // Handle both response structures
        const newEmployee = responseData.employee || responseData.data || responseData;
        setEmployees((prev) => Array.isArray(prev) ? [...prev, newEmployee] : [newEmployee]);
        showNotificationMessage(
          `Employee ${newEmployee.firstName} ${newEmployee.lastName} has been created successfully! A registration email has been sent to ${newEmployee.email}.`, 
          "success"
        );
        closeAddEmployeeModal();
        
        // Reset form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          address: '',
          department: '',
          position: '',
          hireDate: '',
          salary: '',
          status: 'active',
          emergencyContact: '',
          skills: [],
          employmentType: 'full-time',
          workLocation: 'office',
          manager: null
        });
      } else {
        throw new Error(responseData.message || "Failed to add employee");
      }
    } catch (err) {
      showNotificationMessage(err.message || "Failed to add employee", "error");
      console.error("Failed to add employee:", err);
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

  // Navigation handlers for action menu
  const handleViewDetails = (employeeId) => {
    console.log("Viewing details for employee ID:", employeeId);
    if (!employeeId) {
        console.error("Employee ID is undefined!");
        showNotificationMessage("Error: Employee ID not found", "error");
        return;
    }
    
    // Update the URL without triggering a full navigation
    window.history.pushState(null, "", `/dashboard/employees/${employeeId}`);
    
    // Change the section
    handleSectionChange("employees-edit");
    
    // Close any open menus
    setShowMenuId(null);
    setUserMenuOpen(false);
  };

  const handleEditEmployee = (employeeId) => {
    console.log("Navigating to edit for employee ID:", employeeId);
    if (!employeeId) {
      console.error("Employee ID is undefined!");
      showNotificationMessage("Error: Employee ID not found", "error");
      return;
    }
    navigate(`/dashboard/employees/${employeeId}/edit`);
    setShowMenuId(null);
  };

  const handleViewPerformance = (employeeId) => {
    console.log("Navigating to performance for employee ID:", employeeId);
    if (!employeeId) {
      console.error("Employee ID is undefined!");
      showNotificationMessage("Error: Employee ID not found", "error");
      return;
    }
    navigate(`/dashboard/employees/${employeeId}/performance`);
    setShowMenuId(null);
  };

  const handleGenerateReport = (employeeId) => {
    console.log("Navigating to report for employee ID:", employeeId);
    if (!employeeId) {
      console.error("Employee ID is undefined!");
      showNotificationMessage("Error: Employee ID not found", "error");
      return;
    }
    navigate(`/dashboard/employees/${employeeId}/report`);
    setShowMenuId(null);
  };

  const handleManageAccess = (employeeId) => {
    console.log("Navigating to access for employee ID:", employeeId);
    if (!employeeId) {
      console.error("Employee ID is undefined!");
      showNotificationMessage("Error: Employee ID not found", "error");
      return;
    }
    navigate(`/dashboard/employees/${employeeId}/access`);
    setShowMenuId(null);
  };

  const handleSendMessage = (employeeId) => {
    // This could open a message modal or navigate to a messaging interface
    showNotificationMessage("Message feature coming soon!", "info");
    setShowMenuId(null);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    window.location.reload();
  };

  // Predefined positions based on common roles
  const commonPositions = [
    "Software Engineer",
    "Senior Software Engineer", 
    "Lead Engineer",
    "Product Manager",
    "Senior Product Manager",
    "Data Scientist",
    "Data Analyst",
    "UI/UX Designer",
    "Senior Designer",
    "DevOps Engineer",
    "Quality Assurance Engineer",
    "Business Analyst",
    "Project Manager",
    "Scrum Master",
    "Sales Representative",
    "Sales Manager",
    "Marketing Specialist",
    "Marketing Manager",
    "HR Specialist",
    "HR Manager",
    "Finance Analyst",
    "Accountant",
    "Administrative Assistant",
    "Office Manager",
    "Customer Support Representative",
    "Customer Success Manager"
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isLoading} message="Loading employees..." />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Hidden file input for Excel import */}
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
                placeholder="Search employees..."
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
              onClick={openAddEmployeeModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Employees" 
            value={totalEmployees}
            icon={Users} 
            color="blue" 
            subtitle="In organization"
          />
          <MetricCard 
            title="Active Employees" 
            value={activeEmployees}
            icon={CheckCircle} 
            color="green" 
            trend={5}
            subtitle="Currently working"
          />
          <MetricCard 
            title="Departments" 
            value={totalDepartments}
            icon={Briefcase} 
            color="purple" 
            subtitle="Active departments"
          />
          <MetricCard 
            title="Avg Tenure" 
            value={avgTenure}
            suffix=" years"
            icon={Clock} 
            color="orange" 
            trend={2}
            subtitle="Company experience"
          />
        </div>

        {/* Employee Cards Section */}
        <div id="employees-section" className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Team Members</h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Print Button */}
              <button
                 className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
                onClick={handlePrint}
              >
                <Printer size={16} />
                Print
              </button>
              
              {/* Excel Import Button */}
              <button
               className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
                onClick={() => fileInputRef.current.click()}
              >
                <FileSpreadsheet size={16} />
                Excel Import
              </button>
              
              {/* Excel Export Button */}
              <button
                 className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 bg-white rounded-2xl text-sm font-medium hover:bg-blue-50 transition"
                onClick={handleExportToExcel}
              >
                  <Upload size={16} />
                Excel Export
              </button>
              
              {/* Count */}
              <span className="text-sm text-gray-500">
                {filteredEmployees.length} of {totalEmployees} employees
              </span>
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No employees match your search" : "No employees found"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Start by adding your first employee."}
              </p>
              <button
                onClick={openAddEmployeeModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 mx-auto"
              >
                <Plus size={16} />
                Add Employee
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee._id || employee.id || employee.employeeId}
                  employee={employee}
                  onMenuClick={setShowMenuId}
                  showMenuId={showMenuId}
                  onDelete={handleDeleteEmployee}
                  actionLoading={actionLoading}
                  findEmployeeDepartment={findEmployeeDepartment}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Action Dropdown Menu */}
     {showMenuId && (
  <>
    {/* Backdrop with subtle fade */}
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
      className="fixed z-[101] w-56 bg-white rounded-2xl shadow-xl border border-gray-200"
      style={{
        top: (() => {
          const button = document.querySelector(`[data-employee-id="${showMenuId}"]`);
          if (button) {
            const rect = button.getBoundingClientRect();
            return `${rect.bottom + window.scrollY}px`; // Directly at button bottom edge
          }
          return '50px';
        })(),
        left: (() => {
          const button = document.querySelector(`[data-employee-id="${showMenuId}"]`);
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
        {[
          { icon: Eye, label: "View Details", action: () => handleViewDetails(showMenuId) },
          { icon: Edit, label: "Edit Employee", action: () => handleEditEmployee(showMenuId) },
          { icon: MessageSquare, label: "Send Message", action: () => handleSendMessage(showMenuId) },
          { icon: TrendingUp, label: "View Performance", action: () => handleViewPerformance(showMenuId) },
          { icon: FileText, label: "Generate Report", action: () => handleGenerateReport(showMenuId) },
          { icon: Copy, label: "Copy Employee ID", action: () => copyToClipboard(showMenuId) },
          { icon: Settings, label: "Manage Access", action: () => handleManageAccess(showMenuId) },
          { type: "divider" },
          { 
            icon: Trash2, 
            label: "Delete Employee", 
            action: () => handleDeleteEmployee(showMenuId),
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
              className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm rounded-xl ${
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

      {/* Add Employee Modal */}
      {/* Add Employee Modal */}
{isAddEmployeeModalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000]">
    <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
      {/* Compact Header */}
      <div className="px-5 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Plus size={18} className="text-blue-500" />
            Add New Employee
          </h2>
          <button
            onClick={closeAddEmployeeModal}
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
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Emergency Contact *
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={getDepartmentNameById(formData.department)}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Department</option>
                {Array.isArray(departments) && departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name} ({dept.departmentCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Position *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Position</option>
                {commonPositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Hire Date *
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Salary *
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Skills *
            </label>
            <select
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              multiple
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Project Management">Project Management</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Sales">Sales</option>
              <option value="Customer Service">Customer Service</option>
            </select>
            <div className="mt-1">
              <div className="flex flex-wrap gap-1">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          skills: formData.skills.filter((_, i) => i !== index)
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
                Hold <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl</kbd> (Windows) or <kbd className="px-1 py-0.5 bg-gray-100 rounded">Cmd</kbd> (Mac) to select multiple
              </p>
            </div>
          </div>

          {/* Compact Footer */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={closeAddEmployeeModal}
              className="px-4 py-2 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormSubmitting}
              className="px-4 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormSubmitting ? (
                <>
                  <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Add Employee
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