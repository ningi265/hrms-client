import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Key,
  Lock,
  Unlock,
  Settings,
  User,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Edit,
  Trash2,
  Clock,
  Calendar,
  Activity,
  Database,
  FileText,
  Building,
  Smartphone,
  Laptop,
  Wifi,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  UserX,
  Crown,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../authcontext/authcontext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function ManageAccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("permissions");
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // Mock access data - in real app, this would come from API
  const [accessData, setAccessData] = useState({
    role: "employee",
    status: "active",
    lastLogin: "2024-06-10T14:30:00Z",
    accountCreated: "2024-01-15T09:00:00Z",
    permissions: {
      hrSystem: { read: true, write: false, admin: false },
      payroll: { read: true, write: false, admin: false },
      projects: { read: true, write: true, admin: false },
      documents: { read: true, write: true, admin: false },
      reports: { read: true, write: false, admin: false },
      timeTracking: { read: true, write: true, admin: false },
      calendar: { read: true, write: true, admin: false },
      messaging: { read: true, write: true, admin: false }
    },
    devices: [
      { id: 1, name: "MacBook Pro", type: "laptop", lastAccess: "2024-06-10T14:30:00Z", status: "active" },
      { id: 2, name: "iPhone 15", type: "mobile", lastAccess: "2024-06-10T16:45:00Z", status: "active" },
      { id: 3, name: "iPad Air", type: "tablet", lastAccess: "2024-06-08T10:20:00Z", status: "inactive" }
    ],
    accessLogs: [
      { id: 1, action: "Login", timestamp: "2024-06-10T14:30:00Z", device: "MacBook Pro", location: "Office", success: true },
      { id: 2, action: "Document Access", timestamp: "2024-06-10T14:35:00Z", resource: "Q2 Reports", success: true },
      { id: 3, action: "Failed Login", timestamp: "2024-06-09T09:15:00Z", device: "iPhone 15", location: "Remote", success: false },
      { id: 4, action: "Password Change", timestamp: "2024-06-08T11:00:00Z", device: "MacBook Pro", location: "Office", success: true }
    ]
  });

   const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/auth/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
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

  const handlePermissionChange = (system, permission, value) => {
    setAccessData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [system]: {
          ...prev.permissions[system],
          [permission]: value
        }
      }
    }));
  };

  const handleRoleChange = (newRole) => {
    setAccessData(prev => ({ ...prev, role: newRole }));
  };

  const handleStatusChange = (newStatus) => {
    setAccessData(prev => ({ ...prev, status: newStatus }));
  };

  const revokeDevice = (deviceId) => {
    setAccessData(prev => ({
      ...prev,
      devices: prev.devices.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'revoked' }
          : device
      )
    }));
    showNotificationMessage("Device access revoked successfully", "success");
  };

  const saveAccessChanges = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNotificationMessage("Access settings updated successfully!", "success");
    } catch (error) {
      showNotificationMessage("Failed to update access settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const showNotificationMessage = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Access Data</h2>
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
    { id: "permissions", label: "Permissions", icon: Shield },
    { id: "devices", label: "Devices & Sessions", icon: Smartphone },
    { id: "activity", label: "Access Logs", icon: Activity },
    { id: "security", label: "Security Settings", icon: Lock }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'revoked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'laptop':
        return Laptop;
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Smartphone;
      default:
        return Laptop;
    }
  };

  const roleOptions = [
    { value: 'employee', label: 'Employee', description: 'Basic access to assigned resources', icon: User, color: 'blue' },
    { value: 'manager', label: 'Manager', description: 'Access to team resources and reports', icon: Users, color: 'green' },
    { value: 'admin', label: 'Administrator', description: 'Full system access and control', icon: Crown, color: 'purple' },
    { value: 'hr', label: 'HR Specialist', description: 'Access to HR systems and employee data', icon: Briefcase, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/dashboard/employees/${id}`)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">
                    <Shield size={32} />
                  </div>
                  Manage Access
                </h1>
                <p className="text-gray-500 text-lg mt-2">
                  Control permissions and access for {`${employee.firstName || ''} ${employee.lastName || ''}`.trim()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={saveAccessChanges}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <RefreshCw size={20} />
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
          {/* Access Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <User size={24} className="text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(accessData.role)}`}>
                  {accessData.role}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Current Role</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{accessData.role}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(accessData.status)}`}>
                  {accessData.status}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Account Status</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{accessData.status}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Smartphone size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {accessData.devices.filter(d => d.status === 'active').length}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Devices</p>
                <p className="text-sm text-gray-500 mt-1">
                  out of {accessData.devices.length} total
                </p>
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
                <span className="text-lg font-bold text-amber-600">
                  {new Date(accessData.lastLogin).toLocaleDateString()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Last Login</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(accessData.lastLogin).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
            <div className="flex border-b border-gray-200/50 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
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
              {/* Permissions Tab */}
              {activeTab === "permissions" && (
                <div className="space-y-8">
                  {/* Role Management */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Role Assignment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {roleOptions.map((role) => {
                        const Icon = role.icon;
                        const isSelected = accessData.role === role.value;
                        return (
                          <motion.div
                            key={role.value}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleRoleChange(role.value)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? `border-${role.color}-500 bg-${role.color}-50`
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`p-2 bg-${role.color}-100 rounded-lg`}>
                                <Icon size={20} className={`text-${role.color}-600`} />
                              </div>
                              <h4 className="font-semibold text-gray-900">{role.label}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* System Permissions */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">System Permissions</h3>
                    <div className="space-y-4">
                      {Object.entries(accessData.permissions).map(([system, perms]) => (
                        <div key={system} className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Database size={20} className="text-blue-600" />
                              </div>
                              <h4 className="font-semibold text-gray-900 capitalize">
                                {system.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            {Object.entries(perms).map(([permission, value]) => (
                              <label key={permission} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) => handlePermissionChange(system, permission, e.target.checked)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <div className="flex items-center gap-2">
                                  {permission === 'read' && <Eye size={16} className="text-gray-600" />}
                                  {permission === 'write' && <Edit size={16} className="text-gray-600" />}
                                  {permission === 'admin' && <Crown size={16} className="text-gray-600" />}
                                  <span className="text-sm font-medium text-gray-700 capitalize">{permission}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Devices Tab */}
              {activeTab === "devices" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Registered Devices</h3>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium flex items-center gap-2">
                      <UserX size={16} />
                      Revoke All Access
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accessData.devices.map((device) => {
                      const DeviceIcon = getDeviceIcon(device.type);
                      return (
                        <div key={device.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-blue-100 rounded-xl">
                                <DeviceIcon size={24} className="text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{device.name}</h4>
                                <p className="text-sm text-gray-600 capitalize">{device.type}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(device.status)}`}>
                              {device.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={14} />
                              <span>Last access: {new Date(device.lastAccess).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          {device.status === 'active' && (
                            <button
                              onClick={() => revokeDevice(device.id)}
                              className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                            >
                              <Lock size={16} />
                              Revoke Access
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Access Activity Log</h3>
                    <div className="flex items-center gap-3">
                      <select className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                      </select>
                      <button className="p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                        <RefreshCw size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="divide-y divide-gray-100">
                      {accessData.accessLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${log.success ? 'bg-green-100' : 'bg-red-100'}`}>
                                {log.success ? (
                                  <CheckCircle size={20} className="text-green-600" />
                                ) : (
                                  <AlertTriangle size={20} className="text-red-600" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{log.action}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>{log.device}</span>
                                  {log.resource && <span>• {log.resource}</span>}
                                  {log.location && <span>• {log.location}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-900">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  {/* Account Security */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Key size={20} className="text-white" />
                          </div>
                          <h4 className="font-semibold text-blue-900">Password Security</h4>
                        </div>
                        <p className="text-blue-800 mb-4">Last password change: 2 weeks ago</p>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium">
                          Force Password Reset
                        </button>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <Shield size={20} className="text-white" />
                          </div>
                          <h4 className="font-semibold text-green-900">Two-Factor Authentication</h4>
                        </div>
                        <p className="text-green-800 mb-4">Status: Enabled</p>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium">
                          Manage 2FA
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div>
                          <h4 className="font-semibold text-yellow-900">Suspend Account</h4>
                          <p className="text-sm text-yellow-700">Temporarily disable access to all systems</p>
                        </div>
                        <button
                          onClick={() => handleStatusChange('suspended')}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
                        >
                          Suspend
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                        <div>
                          <h4 className="font-semibold text-red-900">Deactivate Account</h4>
                          <p className="text-sm text-red-700">Permanently disable account access</p>
                        </div>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium">
                          Deactivate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

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
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <AlertCircle size={20} className="text-red-600" />
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