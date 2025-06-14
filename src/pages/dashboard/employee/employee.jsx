import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Target,
  User,
  Clock,
  Calendar,
  Shield,
  Copy,
  MessageSquare,
  Settings,
  FileText,
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [departments, setDepartments] = useState([])
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/auth/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched employees:", data);
        console.log("First employee ID:", data[0]?._id);
        setEmployees(data);
      } catch (error) {
        setError("Failed to fetch employees");
        console.error("Failed to fetch employees:", error);
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
        const data = await response.json();
        setDepartments(data);
        console.log("Fetched departments:", data);
        console.log("Total departments count:", data.length);
        console.log("Department employees mapping:", data.map(dept => ({
          name: dept.name,
          code: dept.departmentCode,
          employeeIds: dept.employees
        })));
      } catch (error) {
        setError("Failed to fetch departments");
        console.error("Failed to fetch departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [backendUrl]);

  // Debug effect to show employee-department mapping after both are loaded
  useEffect(() => {
    if (employees.length > 0 && departments.length > 0) {
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
    if (!employeeId || !departments.length) return null;
    
    const department = departments.find(dept => 
      dept.employees && dept.employees.includes(employeeId)
    );
    
    return department || null;
  };

  const filteredEmployees = employees.filter((employee) => {
    const employeeId = employee._id || employee.id || employee.employeeId;
    const employeeDepartment = findEmployeeDepartment(employeeId);
    
    const nameMatch = `${employee.firstName || ''} ${employee.lastName || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const departmentMatch = employeeDepartment 
      ? employeeDepartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employeeDepartment.departmentCode.toLowerCase().includes(searchTerm.toLowerCase())
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
  });

  // Calculate stats
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(employee => employee.status === "active")?.length || 0;
  // Count total departments from departments array, not from employees
  const totalDepartments = departments?.length || 0;
  const avgTenure = employees?.length > 0 
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
        setEmployees((prev) => prev.filter((employee) => {
          const empId = employee._id || employee.id || employee.employeeId;
          return empId !== employeeId;
        }));
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
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
    const response = await fetch(`${backendUrl}/api/auth/employees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (response.ok) {
      setEmployees((prev) => [...prev, data.employee]);
      showNotificationMessage(
        `Employee ${data.employee.firstName} ${data.employee.lastName} has been created successfully! A registration email has been sent to ${data.employee.email}.`, 
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
        emergencyContact: {},
        skills: [],
        employmentType: 'full-time',
        workLocation: 'office',
        manager: null
      });
    } else {
      throw new Error(data.message || "Failed to add employee");
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
    console.log("Navigating to details for employee ID:", employeeId);
    if (!employeeId) {
      console.error("Employee ID is undefined!");
      showNotificationMessage("Error: Employee ID not found", "error");
      return;
    }
    navigate(`/dashboard/employees/${employeeId}`);
    setShowMenuId(null);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Employees</h2>
          <p className="text-gray-600">
            Please wait while we fetch employee information...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
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
                  <User size={32} />
                </div>
                Employee Management
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Manage and organize your workforce efficiently
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={openAddEmployeeModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Employee
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
                  {totalEmployees}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Activity size={24} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {activeEmployees}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">{activeEmployees}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Briefcase size={24} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalDepartments}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{totalDepartments}</p>
                {departments.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    {departments.map(dept => dept.departmentCode).join(", ")}
                  </div>
                )}
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
                  {avgTenure}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Tenure (years)</p>
                <p className="text-2xl font-bold text-gray-900">{avgTenure}</p>
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
                    placeholder="Search employees by name, department (name/code), position or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
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

          {/* Employees Content */}
          {filteredEmployees.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <User size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm ? "No employees match your search" : "No employees found"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm 
                      ? "Try adjusting your search criteria to find what you're looking for."
                      : "Start by adding your first employee to begin building your team."
                    }
                  </p>
                </div>
                <button
                  onClick={openAddEmployeeModal}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add First Employee
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-6 gap-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Employee Name
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    Contact Info
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    Position
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    Department
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Hire Date
                  </div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredEmployees.map((employee, index) => {
                  // Get employee ID - check multiple possible field names
                  const employeeId = employee._id || employee.id || employee.employeeId;
                  console.log("Processing employee:", employee.firstName, employee.lastName, "ID:", employeeId);
                  
                  return (
                    <motion.div
                      key={employeeId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="grid grid-cols-6 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {`${employee.firstName || ''} ${employee.lastName || ''}`.trim() || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {employeeId || "N/A"}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                          <Mail size={14} />
                          <span>{employee.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone size={14} />
                          <span>{employee.phoneNumber || employee.phone || "N/A"}</span>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-gray-900">
                          {employee.position || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${employee.salary ? employee.salary.toLocaleString() : "N/A"}
                        </div>
                      </div>

                      <div>
                        {(() => {
                          const employeeId = employee._id || employee.id || employee.employeeId;
                          const employeeDepartment = findEmployeeDepartment(employeeId);
                          
                          return employeeDepartment ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {employeeDepartment.name} ({employeeDepartment.departmentCode})
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              No Department
                            </span>
                          );
                        })()}
                        {employee.skills && employee.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {employee.skills.slice(0, 2).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {employee.skills.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                +{employee.skills.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm text-gray-700">
                          {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.hireDate 
                            ? `${Math.floor((new Date() - new Date(employee.hireDate)) / (1000 * 60 * 60 * 24 * 365))} yrs` 
                            : "N/A"}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="relative">
                          <button
                            data-employee-id={employeeId}
                            onClick={() => {
                              console.log("Clicked action menu for employee:", employee);
                              console.log("Employee ID:", employeeId);
                              console.log("Employee name:", employee.firstName, employee.lastName);
                              setShowMenuId(showMenuId === employeeId ? null : employeeId);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

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
                const button = document.querySelector(`[data-employee-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuHeight = 350; // Approximate menu height
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
                const button = document.querySelector(`[data-employee-id="${showMenuId}"]`);
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
                onClick={() => handleViewDetails(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
              
              {/* Edit Employee */}
              <button
                onClick={() => handleEditEmployee(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Edit size={16} />
                <span>Edit Employee</span>
              </button>
              
              {/* Send Message */}
              <button
                onClick={() => handleSendMessage(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <MessageSquare size={16} />
                <span>Send Message</span>
              </button>
              
              {/* View Performance */}
              <button
                onClick={() => handleViewPerformance(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <TrendingUp size={16} />
                <span>View Performance</span>
              </button>
              
              {/* Generate Report */}
              <button
                onClick={() => handleGenerateReport(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <FileText size={16} />
                <span>Generate Report</span>
              </button>
              
              {/* Copy Employee ID */}
              <button
                onClick={() => {
                  copyToClipboard(showMenuId);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Copy size={16} />
                <span>Copy Employee ID</span>
              </button>
              
              {/* Manage Access */}
              <button
                onClick={() => handleManageAccess(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Settings size={16} />
                <span>Manage Access</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              {/* Delete Employee */}
              <button
                onClick={() => {
                  handleDeleteEmployee(showMenuId);
                }}
                disabled={actionLoading === showMenuId}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-left disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>Delete Employee</span>
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

      {/* Add Employee Modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Plus size={24} className="text-blue-500" />
                    Add New Employee
                  </h2>
                  <p className="text-gray-600 mt-1">Add a new employee to your team</p>
                </div>
                <button
                  onClick={closeAddEmployeeModal}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
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
                      Emergency Contact *
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
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
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept.name} data-id={dept._id}>
                          {dept.name} ({dept.departmentCode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position *
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hire Date *
                    </label>
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary *
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills *
                  </label>
                  <select
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    multiple
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Project Management">Project Management</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Sales">Sales</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="SQL">SQL</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="HR Management">HR Management</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple skills</p>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeAddEmployeeModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isFormSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFormSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
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