import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  Award,
  Activity,
  Edit,
  Trash2,
  Download,
  MessageSquare,
  TrendingUp,
  FileText,
  Settings,
  Star,
  Badge,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Building
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Debug logging
  console.log("EmployeeDetailPage rendered");
  console.log("Current URL:", window.location.href);
  console.log("useParams() result:", useParams());
  console.log("Extracted ID:", id);
  console.log("ID type:", typeof id);

  useEffect(() => {
    const fetchEmployee = async () => {
      console.log("Fetching employee with ID:", id);
      console.log("Current URL:", window.location.href);
      
      if (!id) {
        setError("No employee ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        console.log("Making API call to:", `${backendUrl}/api/employees/${id}`);
        
        const response = await fetch(`${backendUrl}/api/auth/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Employee data received:", data);
          setEmployee(data);
        } else {
          throw new Error("Employee not found");
        }
      } catch (error) {
        setError("Failed to fetch employee details");
        console.error("Failed to fetch employee:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id, backendUrl]);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Employee Details</h2>
          <p className="text-gray-600">Please wait while we fetch the information...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} />
            <div>
              <h3 className="font-semibold">Error</h3>
              <p>{error || "Employee not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "contact", label: "Contact Info", icon: Mail },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "skills", label: "Skills & Competencies", icon: Award }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateTenure = (hireDate) => {
    if (!hireDate) return "N/A";
    const hire = new Date(hireDate);
    const today = new Date();
    const years = Math.floor((today - hire) / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(((today - hire) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/employees')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                    <User size={32} />
                  </div>
                  Employee Details
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  {`${employee.firstName || ''} ${employee.lastName || ''}`.trim()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/dashboard/employees/${id}/edit`)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Edit size={18} />
                Edit Employee
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Download size={20} />
              </button>
            </div>
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
          {/* Employee Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="relative px-8 py-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center -mt-16">
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
                    <User size={48} className="text-gray-400" />
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(employee.status)}`}>
                      <CheckCircle size={14} className="mr-1" />
                      {employee.status || 'Active'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 lg:mt-16">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {`${employee.firstName || ''} ${employee.lastName || ''}`.trim() || "N/A"}
                  </h2>
                  <p className="text-xl text-gray-600 mt-1">{employee.position || "N/A"}</p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building size={16} />
                      <span>{employee.department || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>Joined {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>{calculateTenure(employee.hireDate)} tenure</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:mt-16">
                  <button
                    onClick={() => navigate(`/dashboard/employees/${id}/performance`)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors duration-200 font-medium flex items-center gap-2"
                  >
                    <TrendingUp size={16} />
                    View Performance
                  </button>
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-200 font-medium flex items-center gap-2">
                    <MessageSquare size={16} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
            <div className="flex border-b border-gray-200/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500 rounded-lg">
                                <DollarSign size={20} className="text-white" />
                              </div>
                              <div>
                                <p className="text-sm text-blue-600 font-medium">Annual Salary</p>
                                <p className="text-xl font-bold text-blue-900">
                                  ${employee.salary ? employee.salary.toLocaleString() : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-500 rounded-lg">
                                <UserCheck size={20} className="text-white" />
                              </div>
                              <div>
                                <p className="text-sm text-green-600 font-medium">Employee Status</p>
                                <p className="text-xl font-bold text-green-900 capitalize">
                                  {employee.status || "Active"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {employee.skills && employee.skills.length > 0 ? (
                            employee.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500">No skills listed</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => navigate(`/dashboard/employees/${id}/edit`)}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                          >
                            <Edit size={16} />
                            Edit Employee
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/employees/${id}/performance`)}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                          >
                            <TrendingUp size={16} />
                            View Performance
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                            <FileText size={16} />
                            Generate Report
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/employees/${id}/access`)}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                          >
                            <Settings size={16} />
                            Manage Access
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Contact</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Mail size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">Email Address</p>
                              <p className="text-gray-900">{employee.email || "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="p-3 bg-green-100 rounded-lg">
                              <Phone size={20} className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                              <p className="text-gray-900">{employee.phoneNumber || employee.phone || "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="p-3 bg-purple-100 rounded-lg">
                              <MapPin size={20} className="text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">Address</p>
                              <p className="text-gray-900">{employee.address || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertCircle size={20} className="text-red-600" />
                            <p className="text-sm text-red-600 font-medium">Emergency Contact Information</p>
                          </div>
                          <p className="text-gray-900">{employee.emergencyContact || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Employment Tab */}
              {activeTab === "employment" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Position Details</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium">Job Title</span>
                            <span className="text-gray-900 font-semibold">{employee.position || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium">Department</span>
                            <span className="text-gray-900 font-semibold">{employee.department || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium">Employee ID</span>
                            <span className="text-gray-900 font-semibold">{employee.employeeId || employee._id || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Employment Timeline</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                            <span className="text-blue-600 font-medium">Hire Date</span>
                            <span className="text-blue-900 font-semibold">
                              {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                            <span className="text-green-600 font-medium">Tenure</span>
                            <span className="text-green-900 font-semibold">{calculateTenure(employee.hireDate)}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                            <span className="text-purple-600 font-medium">Annual Salary</span>
                            <span className="text-purple-900 font-semibold">
                              ${employee.salary ? employee.salary.toLocaleString() : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Technical Skills & Competencies</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-medium text-gray-800 mb-4">Current Skills</h4>
                        <div className="space-y-3">
                          {employee.skills && employee.skills.length > 0 ? (
                            employee.skills.map((skill, index) => (
                              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-500 rounded-lg">
                                    <Award size={16} className="text-white" />
                                  </div>
                                  <span className="font-medium text-gray-900">{skill}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={16}
                                      className={`${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Award size={48} className="text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500">No skills listed for this employee</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-gray-800 mb-4">Skill Development</h4>
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                          <div className="flex items-center gap-3 mb-4">
                            <Target size={24} className="text-orange-600" />
                            <h5 className="font-semibold text-orange-900">Development Goals</h5>
                          </div>
                          <p className="text-orange-800 mb-4">Track skill development and set learning objectives.</p>
                          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
                            Manage Development Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}