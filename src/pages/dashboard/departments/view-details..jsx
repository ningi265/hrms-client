import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  Edit,
  Users,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Target,
  Briefcase,
  Award,
  Clock,
  Activity,
  BarChart3,
  Crown,
  Settings,
  FileText,
  MessageSquare,
  Copy
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [department, setDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
   const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

  // Debug logging
  console.log("DepartmentDetailPage rendered");
  console.log("Current URL:", window.location.href);
  console.log("useParams() result:", useParams());
  console.log("Extracted ID:", id);
  console.log("ID type:", typeof id);

  useEffect(() => {
    const fetchDepartment = async () => {
      console.log("Fetching department with ID:", id);
      console.log("Current URL:", window.location.href);
      
      if (!id) {
        setError("No department ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        console.log("Making API call to:", `${backendUrl}/api/departments/${id}`);
        
        const response = await fetch(`${backendUrl}/api/departments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Department data received:", data);
          setDepartment(data);
        } else {
          throw new Error("Department not found");
        }
      } catch (error) {
        setError("Failed to fetch department details");
        console.error("Failed to fetch department:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [id, backendUrl]);

  const formatBudget = (budget) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-700 bg-green-50 border-green-200";
    if (performance >= 80) return "text-blue-700 bg-blue-50 border-blue-200";
    if (performance >= 70) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a notification here
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Department</h2>
          <p className="text-gray-600">
            Please wait while we fetch department information...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate('/dashboard/departments')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Not Found</h2>
          <p className="text-gray-600 mb-4">The requested department could not be found.</p>
          <button
            onClick={() => navigate('/dashboard/departments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: Building2 },
    { id: "employees", name: "Employees", icon: Users },
    { id: "performance", name: "Performance", icon: TrendingUp },
    { id: "projects", name: "Projects", icon: Briefcase },
    { id: "settings", name: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/departments')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                    <Building2 size={32} />
                  </div>
                  {department.name}
                </h1>
                <p className="text-gray-500 text-lg mt-1">
                  {department.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/dashboard/departments/${id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Edit size={18} />
                Edit Department
              </button>
              <button
                onClick={() => copyToClipboard(id)}
                className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <Users size={24} className="text-white" />
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {department.employeeCount || 0}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{department.employeeCount || 0}</p>
                  {department.maxCapacity && (
                    <p className="text-sm text-gray-500 mt-1">
                      of {department.maxCapacity} capacity
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <DollarSign size={24} className="text-white" />
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {formatBudget(department.budget || 0)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatBudget(department.budget || 0)}</p>
                  {department.actualSpending && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatBudget(department.actualSpending)} spent
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPerformanceColor(department.performance || 0)}`}>
                    {department.performance || 0}%
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{department.performance || 0}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${department.performance || 0}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {(department.activeProjects || 0) + (department.completedProjects || 0)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(department.activeProjects || 0) + (department.completedProjects || 0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {department.activeProjects || 0} active
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Department Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 size={24} />
                  Department Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Crown size={20} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department Head</p>
                      <p className="text-lg font-semibold text-gray-900">{department.departmentHead}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail size={20} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg text-gray-900">{department.headEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone size={20} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-lg text-gray-900">{department.headPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-lg text-gray-900">{department.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar size={20} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Established</p>
                      <p className="text-lg text-gray-900">
                        {department.establishedDate 
                          ? new Date(department.establishedDate).toLocaleDateString()
                          : "N/A"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Activity size={20} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        department.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : department.status === 'restructuring'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {department.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals & Objectives */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Target size={24} />
                  Goals & Objectives
                </h3>
                
                {department.goals && department.goals.length > 0 ? (
                  <div className="space-y-3">
                    {department.goals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-900 font-medium">{goal}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No goals defined yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/dashboard/departments/${id}/employees`)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6 text-left hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <Users size={24} className="text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{department.employeeCount || 0}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">View Employees</h4>
                <p className="text-gray-600">Manage department staff and assignments</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/dashboard/departments/${id}/performance`)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6 text-left hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{department.performance || 0}%</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h4>
                <p className="text-gray-600">View detailed performance metrics</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {/* Handle generate report */}}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6 text-left hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <FileText size={24} className="text-white" />
                  </div>
                  <Award size={24} className="text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Generate Report</h4>
                <p className="text-gray-600">Create comprehensive department reports</p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Other tabs would be implemented here */}
        {activeTab !== "overview" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {tabs.find(tab => tab.id === activeTab)?.name} Tab
            </h3>
            <p className="text-gray-600 mb-6">
              This tab is under development. Content will be available soon.
            </p>
            <button
              onClick={() => setActiveTab("overview")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}