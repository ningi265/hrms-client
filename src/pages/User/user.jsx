import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Camera,
  Upload,
  Globe,
  Calendar,
  DollarSign,
  Settings,
  LogOut,
  Crown,
  Star,
  Award,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Download,
  RefreshCw,
  Heart,
  Bookmark,
  Zap,
  Target,
  Sparkles,
  PieChart,
  BarChart3,
  Wallet,
  Key,
  Fingerprint,
  Clock,
  Check,
  ChevronRight,
  MoreVertical,
  Smartphone,
  Monitor,
  ShieldCheck,
  BellRing,
  MailCheck,
  CalendarDays,
  Trophy,
  Users,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../authcontext/authcontext";
import { userAPI } from '../User/api/userService';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
    company: user?.company || "",
    jobTitle: user?.jobTitle || "",
    bio: user?.bio || "",
    website: user?.website || "",
    linkedin: user?.linkedin || "",
    twitter: user?.twitter || "",
    avatar: user?.avatar || null
  });

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: user?.twoFactorEnabled || false,
    loginNotifications: user?.loginNotifications || true,
    activityNotifications: user?.activityNotifications || true
  });

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "visa",
      lastFour: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      cardHolder: "John Banda",
      isDefault: true,
      nickname: "Primary Card"
    },
    {
      id: 2,
      type: "mastercard",
      lastFour: "8888",
      expiryMonth: "06",
      expiryYear: "2026",
      cardHolder: "John Banda",
      isDefault: false,
      nickname: "Backup Card"
    }
  ]);

  // UI State
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [avatarError, setAvatarError] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    nickname: "",
    isDefault: false
  });
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: "Chrome on MacOS",
      location: "New York, US",
      ip: "192.168.1.1",
      lastActive: "Now",
      isCurrent: true,
      icon: Monitor
    },
    {
      id: 2,
      device: "iPhone Safari",
      location: "San Francisco, US",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      isCurrent: false,
      icon: Smartphone
    }
  ]);

  // Stats (mock data)
  const [userStats, setUserStats] = useState({
    totalTransactions: 247,
    totalSpent: 125420,
    averageTransactionValue: 508,
    accountAge: 18,
    completedProjects: 32,
    successRate: 98.5,
    currentStreak: 45,
    achievementPoints: 2840,
    monthlyGrowth: "+12.5%",
    satisfactionRate: "94%"
  });

  const backendUrl =
    import.meta.env.VITE_ENV === "production"
      ? import.meta.env.VITE_BACKEND_URL_PROD
      : import.meta.env.VITE_BACKEND_URL_DEV;

  // Notification System
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 5000);
  };

  // Input Handlers
  const handlePaymentMethodInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentMethod(prev => ({ ...prev, [name]: value }));
  };

  const handleExpiryDateChange = (e) => {
    const { value } = e.target;
    const formattedValue = value
      .replace(/\D/g, '')
      .replace(/^(\d{2})/, '$1/')
      .substring(0, 5);
    setNewPaymentMethod(prev => ({ ...prev, expiryDate: formattedValue }));
  };

  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = value
      .replace(/\D/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
    setNewPaymentMethod(prev => ({ ...prev, cardNumber: formattedValue }));
  };

  // API Handlers
  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      const response = await userAPI.updateProfile(profileData);
      
      if (response.success) {
        showNotification("Profile updated successfully!", "success");
        setIsEditing(false);
        setProfileData(prev => ({
          ...prev,
          ...response.user
        }));
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showNotification(error.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      showNotification("Passwords don't match", "error");
      return;
    }
    
    if (securityData.newPassword.length < 8) {
      showNotification("Password must be at least 8 characters long", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await userAPI.changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });
      
      if (response.success) {
        showNotification("Password changed successfully!", "success");
        setShowPasswordForm(false);
        setSecurityData(prev => ({ 
          ...prev, 
          currentPassword: "", 
          newPassword: "", 
          confirmPassword: "" 
        }));
      }
    } catch (error) {
      console.error('Password change error:', error);
      showNotification(error.message || "Failed to change password", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySettingsUpdate = async (setting, value) => {
    try {
      const updateData = { [setting]: value };
      const response = await userAPI.updateSecuritySettings(updateData);
      
      if (response.success) {
        setSecurityData(prev => ({ ...prev, [setting]: value }));
        showNotification("Settings updated successfully!", "success");
      }
    } catch (error) {
      console.error('Security settings update error:', error);
      showNotification(error.message || "Failed to update settings", "error");
    }
  };

  // Data Loading Functions
  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      
      if (response.success) {
        const userData = response.user;
        const newProfileData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || userData.phoneNumber || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
          zipCode: userData.zipCode || "",
          country: userData.country || "",
          company: userData.company || userData.companyName || "",
          jobTitle: userData.jobTitle || "",
          bio: userData.bio || "",
          website: userData.website || "",
          linkedin: userData.linkedin || "",
          twitter: userData.twitter || "",
          avatar: userData.avatar 
            ? `${backendUrl.replace('/api', '')}${userData.avatar}`
            : null
        };
        
        setProfileData(newProfileData);
        
        setSecurityData(prev => ({
          ...prev,
          twoFactorEnabled: userData.twoFactorEnabled || false,
          loginNotifications: userData.loginNotifications || true,
          activityNotifications: userData.activityNotifications || true
        }));
      }
    } catch (error) {
      console.error('Profile loading error:', error);
      showNotification("Failed to load profile data", "error");
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await userAPI.getUserStats();
      if (response.success) {
        setUserStats(response.stats);
      }
    } catch (error) {
      console.error('Stats loading error:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await userAPI.getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.paymentMethods);
      }
    } catch (error) {
      console.error('Payment methods loading error:', error);
      showNotification("Failed to load payment methods", "error");
    }
  };

  // Effects
  useEffect(() => {
    loadUserProfile();
    loadUserStats();
    loadPaymentMethods();
  }, []);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      showNotification("File size must be less than 2MB", "error");
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showNotification("Please upload a valid image file (JPEG, PNG, GIF, WebP)", "error");
      return;
    }
    
    try {
      setIsSaving(true);
      const response = await userAPI.uploadAvatar(file);
      
      if (response.success) {
        const fullAvatarUrl = `${backendUrl.replace('/api', '')}${response.data.avatarUrl}`;
        setProfileData(prev => ({ ...prev, avatar: fullAvatarUrl }));
        setAvatarError(false);
        showNotification("Avatar uploaded successfully!", "success");
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      showNotification(error.message || "Failed to upload avatar", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTwoFactorToggle = (checked) => {
    handleSecuritySettingsUpdate('twoFactorEnabled', checked);
  };

  const handleLoginNotificationsToggle = (checked) => {
    handleSecuritySettingsUpdate('loginNotifications', checked);
  };

  const handleActivityNotificationsToggle = (checked) => {
    handleSecuritySettingsUpdate('activityNotifications', checked);
  };

  const handleAddCard = async () => {
    if (!newPaymentMethod.cardNumber || !newPaymentMethod.expiryDate || 
        !newPaymentMethod.cvv || !newPaymentMethod.cardHolder) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(newPaymentMethod.expiryDate)) {
      showNotification("Please enter a valid expiry date (MM/YY)", "error");
      return;
    }

    setIsSaving(true);
    try {
      const response = await userAPI.addPaymentMethod({
        cardNumber: newPaymentMethod.cardNumber.replace(/\s/g, ''),
        expiryDate: newPaymentMethod.expiryDate,
        cvv: newPaymentMethod.cvv,
        cardHolder: newPaymentMethod.cardHolder,
        nickname: newPaymentMethod.nickname || `Card ending in ${newPaymentMethod.cardNumber.slice(-4)}`,
        isDefault: newPaymentMethod.isDefault
      });
      
      if (response.success) {
        await loadPaymentMethods();
        setNewPaymentMethod({
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardHolder: "",
          nickname: "",
          isDefault: false
        });
        setShowAddCardModal(false);
        showNotification("Payment method added successfully!", "success");
      }
    } catch (error) {
      console.error('Add payment method error:', error);
      showNotification(error.message || "Failed to add payment method", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (paymentMethodId) => {
    try {
      const response = await userAPI.deletePaymentMethod(paymentMethodId);
      if (response.success) {
        await loadPaymentMethods();
        showNotification("Payment method deleted successfully!", "success");
      }
    } catch (error) {
      showNotification(error.message || "Failed to delete payment method", "error");
    }
  };

  const detectCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    return 'visa';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, color: "purple" },
    { id: "security", label: "Security", icon: Shield, color: "blue" },
    { id: "payments", label: "Payments", icon: CreditCard, color: "green" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "orange" },
    { id: "analytics", label: "Analytics", icon: BarChart3, color: "indigo" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header Background */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg backdrop-blur-sm sticky top-24 overflow-hidden"
            >
              {/* Avatar Section */}
              <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 p-6">
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    Premium
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl overflow-hidden ring-4 ring-white/30">
                      {profileData.avatar && !avatarError ? (
                        <img 
                          src={profileData.avatar} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <span>
                          {`${profileData.firstName?.[0] || 'U'}${profileData.lastName?.[0] || 'S'}`}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 p-3 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200"
                      >
                        <Camera size={18} className="text-gray-700" />
                      </motion.button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">{profileData.jobTitle}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-white text-sm">4.8 Rating</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Overview */}
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{userStats.completedProjects}</div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{userStats.successRate}%</div>
                    <div className="text-xs text-gray-500">Success</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{userStats.currentStreak}</div>
                    <div className="text-xs text-gray-500">Days</div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? `bg-${tab.color}-50 text-${tab.color}-700 border border-${tab.color}-200`
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? `bg-${tab.color}-100` : 'bg-gray-100'}`}>
                          <IconComponent size={18} className={isActive ? `text-${tab.color}-600` : 'text-gray-500'} />
                        </div>
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      <ChevronRight size={16} className={isActive ? `text-${tab.color}-500` : 'text-gray-400'} />
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            >
              {/* Tab-specific headers */}
              <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {(() => {
                        const TabIcon = tabs.find(t => t.id === activeTab)?.icon || User;
                        const color = tabs.find(t => t.id === activeTab)?.color || 'purple';
                        return (
                          <div className={`p-3 rounded-xl bg-${color}-100`}>
                            <TabIcon size={24} className={`text-${color}-600`} />
                          </div>
                        );
                      })()}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-gray-600">
                          {activeTab === "profile" && "Manage your personal information and preferences"}
                          {activeTab === "security" && "Secure your account and manage access"}
                          {activeTab === "payments" && "View and manage your payment methods"}
                          {activeTab === "notifications" && "Customize your notification preferences"}
                          {activeTab === "analytics" && "Track your account performance and insights"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === "profile" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
                      >
                        <Edit3 size={16} />
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </button>
                      {isEditing && (
                        <button
                          onClick={handleProfileSave}
                          disabled={isSaving}
                          className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save Changes
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "payments" && (
                    <button
                      onClick={() => setShowAddCardModal(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add New Card
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Tab Content */}
              {activeTab === "profile" && (
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Personal Details */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User size={20} />
                        Personal Information
                      </h3>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                              disabled={!isEditing}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <div className="relative">
                            <Phone size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                              disabled={!isEditing}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Details */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Building size={20} />
                        Professional Information
                      </h3>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                          <input
                            type="text"
                            value={profileData.jobTitle}
                            onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <div className="relative">
                            <Building size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              value={profileData.company}
                              onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                              disabled={!isEditing}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                          <div className="relative">
                            <Globe size={18} className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="url"
                              value={profileData.website}
                              onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                              disabled={!isEditing}
                              placeholder="https://"
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                            disabled={!isEditing}
                            rows={4}
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="md:col-span-2 space-y-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin size={20} />
                        Address Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            value={profileData.address}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={profileData.city}
                            onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            value={profileData.state}
                            onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={profileData.zipCode}
                            onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <input
                            type="text"
                            value={profileData.country}
                            onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab Content */}
              {activeTab === "security" && (
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Password Section */}
                    <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-r from-white to-gray-50/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Lock size={20} className="text-blue-600" />
                            Password Management
                          </h3>
                          <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
                        </div>
                        <button
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                          className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors duration-200 font-medium border border-blue-200"
                        >
                          Change Password
                        </button>
                      </div>

                      <AnimatePresence>
                        {showPasswordForm && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 border-t border-gray-200 grid md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    value={securityData.currentPassword}
                                    onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={securityData.newPassword}
                                  onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={securityData.confirmPassword}
                                  onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                />
                              </div>
                              
                              <div className="flex items-end">
                                <div className="text-xs text-gray-500">
                                  Password must be at least 8 characters long with letters and numbers
                                </div>
                              </div>
                              
                              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                                <button
                                  onClick={() => setShowPasswordForm(false)}
                                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handlePasswordChange}
                                  disabled={isSaving}
                                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                                >
                                  {isSaving ? (
                                    <>
                                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                      Updating...
                                    </>
                                  ) : (
                                    "Update Password"
                                  )}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-blue-50">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <Fingerprint size={20} className="text-blue-600" />
                              Two-Factor Authentication
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">Extra layer of security for your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securityData.twoFactorEnabled}
                              onChange={(e) => handleTwoFactorToggle(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ShieldCheck size={14} />
                            <span>{securityData.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Security Recommendations */}
                      <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-white to-green-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                          <ShieldCheck size={20} className="text-green-600" />
                          Security Score
                        </h3>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">85%</div>
                            <div className="text-sm text-gray-600">Excellent</div>
                          </div>
                          <div className="w-24 h-24 relative">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeDasharray="85, 100"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Your account security is strong. Keep up the good work!
                        </div>
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                        <Activity size={20} className="text-purple-600" />
                        Active Sessions
                      </h3>
                      <div className="space-y-4">
                        {activeSessions.map((session) => {
                          const IconComponent = session.icon;
                          return (
                            <div key={session.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                              session.isCurrent ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${
                                  session.isCurrent ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                  <IconComponent size={20} className={
                                    session.isCurrent ? 'text-green-600' : 'text-gray-600'
                                  } />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">{session.device}</div>
                                  <div className="text-sm text-gray-600">
                                    {session.location} • {session.ip} • Last active {session.lastActive}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {session.isCurrent && (
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    Active Now
                                  </span>
                                )}
                                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                  Revoke
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === "payments" && (
                <div className="p-8">
                  <div className="mb-8">
                    <p className="text-gray-600">Manage your saved payment methods for quick and secure transactions</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="relative rounded-2xl overflow-hidden shadow-lg"
                      >
                        <div className={`absolute inset-0 ${
                          method.type === 'visa' 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-800'
                            : method.type === 'mastercard'
                            ? 'bg-gradient-to-br from-red-600 to-red-800'
                            : 'bg-gradient-to-br from-green-600 to-green-800'
                        }`} />
                        
                        <div className="relative p-6 text-white">
                          {method.isDefault && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                                Default
                              </span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <div className="text-sm text-white/80 mb-1">{method.nickname}</div>
                              <div className="text-lg font-bold">
                                {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                              </div>
                            </div>
                            <div className="text-3xl">
                              {method.type === 'visa' ? '💳' : '💎'}
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="text-2xl font-mono tracking-widest mb-2">
                              •••• •••• •••• {method.lastFour}
                            </div>
                            <div className="text-white/80">{method.cardHolder}</div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm text-white/60">Expires</div>
                              <div className="font-medium">{method.expiryMonth}/{method.expiryYear}</div>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200">
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCard(method.id)}
                                className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Add New Card Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddCardModal(true)}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus size={32} className="text-gray-400" />
                      </div>
                      <div className="text-lg font-semibold">Add New Card</div>
                      <div className="text-sm text-gray-500 mt-2">Add a new payment method</div>
                    </motion.button>
                  </div>

                  {/* Payment History */}
                  <div className="mt-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
                    <div className="border border-gray-200 rounded-2xl overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <ShoppingBag size={20} className="text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">Online Purchase</div>
                                  <div className="text-sm text-gray-500">Today • Amazon.com</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">- $49.99</div>
                                <div className="text-sm text-gray-500">VISA •••• 4242</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Security Notifications */}
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                        <Shield size={20} className="text-blue-600" />
                        Security Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              <BellRing size={16} />
                              Login Notifications
                            </div>
                            <div className="text-sm text-gray-600">Get notified when someone logs into your account</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securityData.loginNotifications}
                              onChange={(e) => handleLoginNotificationsToggle(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              <Activity size={16} />
                              Account Activity
                            </div>
                            <div className="text-sm text-gray-600">Get notified about important account changes</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securityData.activityNotifications}
                              onChange={(e) => handleActivityNotificationsToggle(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Email Preferences */}
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                        <Mail size={20} className="text-green-600" />
                        Email Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              <MailCheck size={16} />
                              Marketing Emails
                            </div>
                            <div className="text-sm text-gray-600">Receive updates about new features and promotions</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              <CalendarDays size={16} />
                              Weekly Summary
                            </div>
                            <div className="text-sm text-gray-600">Get a weekly summary of your account activity</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="p-8">
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <DollarSign size={20} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{formatCurrency(userStats.totalSpent)}</div>
                          <div className="text-blue-100 text-sm">Total Spent</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100 text-sm">
                        <TrendingUp size={16} />
                        <span>{userStats.monthlyGrowth} from last month</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Activity size={20} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{userStats.totalTransactions}</div>
                          <div className="text-green-100 text-sm">Transactions</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-green-100 text-sm">
                        <TrendingUp size={16} />
                        <span>+8.2% from last month</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Target size={20} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{userStats.successRate}%</div>
                          <div className="text-purple-100 text-sm">Success Rate</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-100 text-sm">
                        <TrendingUp size={16} />
                        <span>+2.1% from last month</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Trophy size={20} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{userStats.satisfactionRate}</div>
                          <div className="text-orange-100 text-sm">Satisfaction</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-orange-100 text-sm">
                        <Sparkles size={16} />
                        <span>Excellent score</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <PieChart size={20} className="text-indigo-600" />
                          Spending Overview
                        </h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                          View Details
                        </button>
                      </div>
                      <div className="h-64 bg-gradient-to-b from-indigo-50 to-white rounded-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full"></div>
                        </div>
                        <div className="relative text-center">
                          <div className="text-4xl font-bold text-gray-900">{formatCurrency(userStats.totalSpent)}</div>
                          <div className="text-gray-600">Total Spending</div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Activity size={20} className="text-green-600" />
                          Monthly Activity
                        </h3>
                        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
                          <option>Last 30 days</option>
                          <option>Last 90 days</option>
                          <option>This year</option>
                        </select>
                      </div>
                      <div className="h-64 bg-gradient-to-b from-green-50 to-white rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">{userStats.totalTransactions}</div>
                          <div className="text-gray-600">Total Transactions</div>
                          <div className="mt-4 flex items-center justify-center gap-8">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">+24%</div>
                              <div className="text-sm text-gray-600">Growth</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{userStats.averageTransactionValue}</div>
                              <div className="text-sm text-gray-600">Avg. Value</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showAddCardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddCardModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Add Payment Method</h3>
                  <p className="text-gray-600 text-sm mt-1">Enter your card details securely</p>
                </div>
                <button
                  onClick={() => setShowAddCardModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={newPaymentMethod.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={newPaymentMethod.expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={newPaymentMethod.cvv}
                      onChange={handlePaymentMethodInputChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={newPaymentMethod.cardHolder}
                    onChange={handlePaymentMethodInputChange}
                    placeholder="JOHN BANDA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Nickname (Optional)</label>
                  <input
                    type="text"
                    name="nickname"
                    value={newPaymentMethod.nickname}
                    onChange={handlePaymentMethodInputChange}
                    placeholder="e.g., Personal Card"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  />
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="defaultCard"
                    name="isDefault"
                    checked={newPaymentMethod.isDefault}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="defaultCard" className="ml-3 block text-sm text-gray-700">
                    Set as default payment method
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddCardModal(false)}
                  className="px-5 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Card
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm flex items-center gap-3 min-w-64 ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50/90 text-green-800 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-rose-50/90 text-red-800 border-red-200'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {notification.type === 'success' ? (
                  <Check size={20} className="text-white" />
                ) : (
                  <AlertCircle size={20} className="text-white" />
                )}
              </div>
              <div>
                <div className="font-semibold">
                  {notification.type === 'success' ? 'Success!' : 'Error!'}
                </div>
                <div className="text-sm">{notification.message}</div>
              </div>
              <button
                onClick={() => setNotification({ show: false, message: "", type: "success" })}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}