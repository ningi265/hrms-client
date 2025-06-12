"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Building2,
  Search,
  Plus,
  MoreVertical,
  Save,
  X,
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
} from "lucide-react"
import { motion } from "framer-motion"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function DepartmentsPage() {
  const navigate = useNavigate()
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
    status: "active",
    goals: [],
    establishedDate: "",
  })
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")

  // Mock data for demonstration
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockDepartments = [
          {
            _id: "1",
            name: "Engineering",
            description: "Software development and technical infrastructure",
            departmentHead: "Sarah Johnson",
            headEmail: "sarah.johnson@company.com",
            headPhone: "+1 (555) 123-4567",
            budget: 2500000,
            location: "Building A, Floor 3",
            status: "active",
            employeeCount: 45,
            goals: ["Product Development", "Technical Innovation", "System Optimization"],
            establishedDate: "2020-01-15",
            performance: 92,
            projects: 12,
          },
          {
            _id: "2",
            name: "Marketing",
            description: "Brand management, digital marketing, and customer acquisition",
            departmentHead: "Michael Brown",
            headEmail: "michael.brown@company.com",
            headPhone: "+1 (555) 234-5678",
            budget: 1200000,
            location: "Building B, Floor 2",
            status: "active",
            employeeCount: 28,
            goals: ["Brand Growth", "Lead Generation", "Customer Engagement"],
            establishedDate: "2020-03-20",
            performance: 88,
            projects: 8,
          },
          {
            _id: "3",
            name: "Sales",
            description: "Revenue generation and customer relationship management",
            departmentHead: "Emily Davis",
            headEmail: "emily.davis@company.com",
            headPhone: "+1 (555) 345-6789",
            budget: 800000,
            location: "Building A, Floor 1",
            status: "active",
            employeeCount: 32,
            goals: ["Revenue Growth", "Customer Retention", "Market Expansion"],
            establishedDate: "2020-02-10",
            performance: 95,
            projects: 6,
          },
          {
            _id: "4",
            name: "Human Resources",
            description: "Employee management, recruitment, and organizational development",
            departmentHead: "John Smith",
            headEmail: "john.smith@company.com",
            headPhone: "+1 (555) 456-7890",
            budget: 600000,
            location: "Building B, Floor 1",
            status: "active",
            employeeCount: 15,
            goals: ["Talent Acquisition", "Employee Development", "Culture Building"],
            establishedDate: "2020-01-05",
            performance: 90,
            projects: 4,
          },
          {
            _id: "5",
            name: "Finance",
            description: "Financial planning, accounting, and budget management",
            departmentHead: "Lisa Chen",
            headEmail: "lisa.chen@company.com",
            headPhone: "+1 (555) 567-8901",
            budget: 500000,
            location: "Building A, Floor 2",
            status: "active",
            employeeCount: 18,
            goals: ["Financial Planning", "Cost Optimization", "Compliance"],
            establishedDate: "2020-01-08",
            performance: 93,
            projects: 3,
          },
          {
            _id: "6",
            name: "Operations",
            description: "Business operations, logistics, and process optimization",
            departmentHead: "David Wilson",
            headEmail: "david.wilson@company.com",
            headPhone: "+1 (555) 678-9012",
            budget: 400000,
            location: "Building C, Floor 1",
            status: "restructuring",
            employeeCount: 22,
            goals: ["Process Improvement", "Efficiency", "Quality Control"],
            establishedDate: "2020-04-15",
            performance: 85,
            projects: 5,
          },
        ]

        setDepartments(mockDepartments)
      } catch (error) {
        setError("Failed to fetch departments")
        console.error("Failed to fetch departments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const filteredDepartments = departments.filter((department) => {
    const nameMatch = department.name.toLowerCase().includes(searchTerm.toLowerCase())
    const headMatch = department.departmentHead.toLowerCase().includes(searchTerm.toLowerCase())
    const locationMatch = department.location.toLowerCase().includes(searchTerm.toLowerCase())
    const goalsMatch =
      department.goals && Array.isArray(department.goals)
        ? department.goals.some(
            (goal) => goal && typeof goal === "string" && goal.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : false

    return nameMatch || headMatch || locationMatch || goalsMatch
  })

  // Calculate stats
  const totalDepartments = departments?.length || 0
  const activeDepartments = departments?.filter((dept) => dept.status === "active")?.length || 0
  const totalEmployees = departments?.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0) || 0
  const totalBudget = departments?.reduce((sum, dept) => sum + (dept.budget || 0), 0) || 0

  const handleDeleteDepartment = async (departmentId) => {
    setActionLoading(departmentId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setDepartments((prev) => prev.filter((department) => department._id !== departmentId))
      showNotificationMessage("Department deleted successfully!", "success")
    } catch (error) {
      showNotificationMessage("Failed to delete department", "error")
      console.error("Failed to delete department:", error)
    } finally {
      setActionLoading(null);
      setShowMenuId(null)
    }
  }

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
      status: "active",
      goals: [],
      establishedDate: "",
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newDepartment = {
        ...formData,
        _id: Date.now().toString(),
        employeeCount: 0,
        performance: 0,
        projects: 0,
        budget: Number.parseFloat(formData.budget),
      }

      setDepartments((prev) => [...prev, newDepartment])
      showNotificationMessage("Department added successfully!", "success")
      closeAddDepartmentModal()
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

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-700 bg-green-50 border-green-200"
    if (performance >= 80) return "text-blue-700 bg-blue-50 border-blue-200"
    if (performance >= 70) return "text-yellow-700 bg-yellow-50 border-yellow-200"
    return "text-red-700 bg-red-50 border-red-200"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <DotLottieReact src="loading.lottie" loop autoplay />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Departments</h2>
          <p className="text-gray-600">Please wait while we fetch department information...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    )
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
                  <Building2 size={32} />
                </div>
                Department Management
              </h1>
              <p className="text-gray-500 text-lg mt-2">Organize and manage your company departments</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={openAddDepartmentModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Department
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
                  <Building2 size={24} className="text-white" />
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalDepartments}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{totalDepartments}</p>
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
                  {activeDepartments}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Departments</p>
                <p className="text-2xl font-bold text-gray-900">{activeDepartments}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Users size={24} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
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
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <DollarSign size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {formatBudget(totalBudget)}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatBudget(totalBudget)}</p>
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
                    placeholder="Search departments by name, head, or location..."
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

          {/* Departments Content */}
          {filteredDepartments.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 shadow-xl text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Building2 size={40} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchTerm ? "No departments match your search" : "No departments found"}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm
                      ? "Try adjusting your search criteria to find what you're looking for."
                      : "Start by adding your first department to organize your company structure."}
                  </p>
                </div>
                <button
                  onClick={openAddDepartmentModal}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add First Department
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-b border-gray-100/50 px-6 py-4">
                <div className="grid grid-cols-7 gap-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    Department
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown size={16} />
                    Department Head
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    Employees
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Budget
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    Performance
                  </div>
                  <div className="text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredDepartments.map((department, index) => (
                  <motion.div
                    key={department._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="grid grid-cols-7 gap-4 items-center px-6 py-6 hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {department.name}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">{department.description}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {department.goals && Array.isArray(department.goals)
                          ? department.goals.slice(0, 2).map((goal, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                              >
                                {goal}
                              </span>
                            ))
                          : null}
                        {department.goals && department.goals.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{department.goals.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900">{department.departmentHead}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Mail size={12} />
                        <span className="truncate">{department.headEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={12} />
                        <span>{department.headPhone}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin size={14} />
                        <span>{department.location}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{department.employeeCount}</div>
                          <div className="text-xs text-gray-500">{department.projects} projects</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900">{formatBudget(department.budget)}</div>
                      <div className="text-xs text-gray-500">
                        Est. {new Date(department.establishedDate).getFullYear()}
                      </div>
                    </div>

                    <div>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPerformanceColor(department.performance)}`}
                      >
                        {department.performance}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${department.performance}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        data-department-id={department._id}
                        onClick={() => setShowMenuId(showMenuId === department._id ? null : department._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
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
            className="fixed z-[101] w-64 bg-white rounded-xl shadow-2xl border border-gray-200/50 backdrop-blur-sm"
            style={{
              top: (() => {
                const button = document.querySelector(`[data-department-id="${showMenuId}"]`);
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
                const button = document.querySelector(`[data-department-id="${showMenuId}"]`);
                if (button) {
                  const rect = button.getBoundingClientRect();
                  const menuWidth = 256; // w-64
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
                  navigate(`/dashboard/departments/${showMenuId}`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
              
              {/* Edit Department */}
              <button
                onClick={() => {
                  navigate(`/dashboard/departments/${showMenuId}/edit`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Edit size={16} />
                <span>Edit Department</span>
              </button>
              
              {/* View Employees */}
              <button
                onClick={() => {
                  navigate(`/dashboard/departments/${showMenuId}/employees`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Users size={16} />
                <span>View Employees</span>
              </button>
              
              {/* View Performance */}
              <button
                onClick={() => {
                  navigate(`/dashboard/departments/${showMenuId}/performance`);
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <TrendingUp size={16} />
                <span>View Performance</span>
              </button>
              
              {/* Send Message */}
              <button
                onClick={() => {
                  // Handle send message action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <MessageSquare size={16} />
                <span>Send Message to Head</span>
              </button>
              
              {/* Generate Report */}
              <button
                onClick={() => {
                  // Handle generate report action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <FileText size={16} />
                <span>Generate Report</span>
              </button>
              
              {/* Copy Department ID */}
              <button
                onClick={() => copyToClipboard(showMenuId)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Copy size={16} />
                <span>Copy Department ID</span>
              </button>
              
              {/* Manage Settings */}
              <button
                onClick={() => {
                  // Handle manage settings action
                  setShowMenuId(null);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                <Settings size={16} />
                <span>Manage Settings</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              {/* Delete Department */}
              <button
                onClick={() => handleDeleteDepartment(showMenuId)}
                disabled={actionLoading === showMenuId}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-left disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>Delete Department</span>
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

      {/* Add Department Modal */}
      {isAddDepartmentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Plus size={24} className="text-blue-500" />
                    Add New Department
                  </h2>
                  <p className="text-gray-600 mt-1">Create a new department for your organization</p>
                </div>
                <button
                  onClick={closeAddDepartmentModal}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Engineering"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="restructuring">Restructuring</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Describe the department's purpose and responsibilities"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department Head *</label>
                    <input
                      type="text"
                      name="departmentHead"
                      value={formData.departmentHead}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., John Smith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Head Email *</label>
                    <input
                      type="email"
                      name="headEmail"
                      value={formData.headEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="john.smith@company.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Head Phone Number *</label>
                    <input
                      type="tel"
                      name="headPhone"
                      value={formData.headPhone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Established Date *</label>
                    <input
                      type="date"
                      name="establishedDate"
                      value={formData.establishedDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget *</label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 500000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Building A, Floor 3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department Goals</label>
                  <select
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    multiple
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
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
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple goals</p>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeAddDepartmentModal}
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
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
            className={`px-6 py-4 rounded-xl shadow-2xl border ${
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