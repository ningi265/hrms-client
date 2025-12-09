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
  Fingerprint
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
      nickname: "Business Card"
    },
    {
      id: 2,
      type: "mastercard",
      lastFour: "8888",
      expiryMonth: "06",
      expiryYear: "2026",
      cardHolder: "John Banda",
      isDefault: false,
      nickname: "Personal Card"
    }
  ]);

  // UI State
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [avatarError, setAvatarError] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    nickname: "",
  });
  const [showAddCardModal, setShowAddCardModal] = useState(false);
const [newPaymentMethod, setNewPaymentMethod] = useState({
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardHolder: "",
  nickname: "",
  isDefault: false
});

  // Stats (mock data - replace with real API calls)
  const [userStats, setUserStats] = useState({
    totalTransactions: 247,
    totalSpent: 125420,
    averageTransactionValue: 508,
    accountAge: 18,
    completedProjects: 32,
    successRate: 98.5,
    currentStreak: 45,
    achievementPoints: 2840
  });
  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV;
  

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 5000);
  };

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

  const handleProfileSave = async () => {
  setIsSaving(true);
  try {
    const response = await userAPI.updateProfile(profileData);
    
    if (response.success) {
      showNotification("Profile updated successfully!");
      setIsEditing(false);
      
      // Update the profileData state with the returned user data
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
      showNotification("Password changed successfully!");
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
      showNotification("Settings updated successfully!");
    }
  } catch (error) {
    console.error('Security settings update error:', error);
    showNotification(error.message || "Failed to update settings", "error");
  }
};

const loadUserProfile = async () => {
  console.log('loadUserProfile called');
  try {
    const response = await userAPI.getProfile();
    console.log('Profile API response:', response);
    
    if (response.success) {
      const userData = response.user;
      console.log('User data from API:', userData);
      
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
        company: userData.company || userData.companyName || "", // Fixed: was companyName
        jobTitle: userData.jobTitle || "",
        bio: userData.bio || "",
        website: userData.website || "",
        linkedin: userData.linkedin || "",
        twitter: userData.twitter || "",
         avatar: userData.avatar 
          ? `${backendUrl.replace('/api', '')}${userData.avatar}`
          : null
      };
      
      console.log('Setting profileData to:', newProfileData);
      setProfileData(newProfileData);
      
      setSecurityData(prev => ({
        ...prev,
        twoFactorEnabled: userData.twoFactorEnabled || false,
        loginNotifications: userData.loginNotifications || true,
        activityNotifications: userData.activityNotifications || true
      }));
    } else {
      console.error('Profile API response not successful:', response);
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
    // Don't show error notification for stats as it's not critical
  }
};

// Load payment methods from API
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

useEffect(() => {
   console.log('useEffect triggered - loading data');
  loadUserProfile();
  loadUserStats();
  loadPaymentMethods();
}, []);

useEffect(() => {
  console.log('UserProfilePage mounted');
  console.log('Initial user from auth:', user);
  console.log('Initial profileData:', profileData);
  console.log('Current activeTab:', activeTab);
}, []);

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    showNotification("File size must be less than 2MB", "error");
    return;
  }
  
  // Validate file type
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
      setProfileData(prev => ({ ...prev, avatar:fullAvatarUrl }));
      setAvatarError(false); // Reset error state when new avatar is uploaded
      showNotification("Avatar uploaded successfully!");
    }
  } catch (error) {
    console.error('Avatar upload error:', error);
    showNotification(error.message || "Failed to upload avatar", "error");
  } finally {
    setIsSaving(false);
  }
};

// Update the security toggle handlers:
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
  setIsSaving(true);
  try {
    const response = await userAPI.addPaymentMethod({
      cardNumber: newCard.cardNumber,
      expiryDate: newCard.expiryDate,
      cvv: newCard.cvv,
      cardHolder: newCard.cardHolder,
      nickname: newCard.nickname,
      isDefault: paymentMethods.length === 0
    });
    
    if (response.success) {
      await loadPaymentMethods(); 
      setNewCard({ cardNumber: "", expiryDate: "", cvv: "", cardHolder: "", nickname: "" });
      setShowAddCard(false);
      showNotification("Payment method added successfully!");
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
      showNotification("Payment method deleted successfully!");
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

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setNewCard(prev => ({ ...prev, [name]: formattedValue }));
  };

  const getCardIcon = (type) => {
    const icons = {
      visa: <div className="text-blue-600 font-bold text-xs">VISA</div>,
      mastercard: <div className="text-red-600 font-bold text-xs">MC</div>,
      amex: <div className="text-green-600 font-bold text-xs">AMEX</div>
    };
    return icons[type] || <CreditCard size={16} className="text-gray-400" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl sticky top-24">
            {/* Avatar Section */}
<div className="text-center mb-6">
  <div className="relative inline-block">
    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
      {profileData.avatar && !avatarError ? (
        <img 
          src={profileData.avatar} 
          alt="Avatar" 
          className="w-full h-full object-cover"
           onError={(e) => {
        
          setProfileData(prev => ({ ...prev, avatar: null }));
        }}
        />
      ) : (
        <span>
          {`${profileData.firstName?.[0] || 'U'}${profileData.lastName?.[0] || 'S'}`}
        </span>
      )}
    </div>
    {isEditing && (
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        <Camera size={14} className="text-gray-600" />
      </button>
    )}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleAvatarUpload}
    />
  </div>
  <h3 className="text-xl font-bold text-gray-900 mt-4">
    {profileData.firstName} {profileData.lastName}
  </h3>

</div>

              {/* Navigation */}
              <div className="mt-6 space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <IconComponent size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden"
            >
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                      <p className="text-gray-600 mt-1">Update your personal details and contact information</p>
                    </div>
                    <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Edit3 size={16} />
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
                    {isEditing && (
                      <button
                        onClick={handleProfileSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
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

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Details */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone size={18} className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                        <input
                          type="text"
                          value={profileData.jobTitle}
                          onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                        <div className="relative">
                          <Building size={18} className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={profileData.company}
                            onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address & Social */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={profileData.address}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={profileData.city}
                            onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            value={profileData.state}
                            onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={profileData.zipCode}
                            onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                          <input
                            type="text"
                            value={profileData.country}
                            onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                        <div className="relative">
                          <Globe size={18} className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="https://your-website.com"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                      <p className="text-gray-600 mt-1">Manage your account security and privacy settings</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Password Section */}
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Lock size={20} />
                            Password
                          </h3>
                          <p className="text-gray-600 text-sm">Last changed 3 months ago</p>
                        </div>
                        <button
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                          className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors duration-200 font-medium border border-purple-200"
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
                            className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100"
                          >
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={securityData.currentPassword}
                                  onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80"
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
                              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                              <input
                                type={showPassword ? "text" : "password"}
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                              <input
                                type={showPassword ? "text" : "password"}
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80"
                              />
                            </div>
                            <div className="md:col-span-3 flex justify-end gap-3 pt-4">
                              <button
                                onClick={() => setShowPasswordForm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handlePasswordChange}
                                disabled={isSaving}
                                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Fingerprint size={20} />
                            Two-Factor Authentication
                          </h3>
                          <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
  type="checkbox"
  checked={securityData.twoFactorEnabled}
  onChange={(e) => handleTwoFactorToggle(e.target.checked)}
  className="sr-only peer"
/>
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Login Sessions */}
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <Activity size={20} />
                        Active Sessions
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle size={20} className="text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-green-900">Current Session</div>
                              <div className="text-sm text-green-700">Chrome on MacOS • New York, US</div>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active Now</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                              <Phone size={20} className="text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Mobile App</div>
                              <div className="text-sm text-gray-600">iPhone • 2 hours ago</div>
                            </div>
                          </div>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">Revoke</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
{/* Payment Methods Tab */}
{activeTab === "payments" && (
  <div className="p-8">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <p className="text-gray-600 mt-1">Manage your saved payment methods for quick checkout</p>
      </div>
     <button
  onClick={() => setShowAddCardModal(true)}
  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
>
  <Plus size={16} />
  Add New Card
</button>
    </div>

    {/* Payment Methods Grid */}
    <div className="grid md:grid-cols-2 gap-6">
      {paymentMethods.map((method) => (
        <motion.div
          key={method.id}
          whileHover={{ y: -2, scale: 1.02 }}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl border border-gray-700"
        >
          {method.isDefault && (
            <div className="absolute top-4 right-4">
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Default
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {getCardIcon(method.type)}
              <div>
                <div className="font-semibold">{method.nickname}</div>
                <div className="text-gray-300 text-sm">{method.type.toUpperCase()}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-2xl font-mono tracking-wider mb-2">
              •••• •••• •••• {method.lastFour}
            </div>
            <div className="text-gray-300 text-sm">{method.cardHolder}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-300">
              Expires {method.expiryMonth}/{method.expiryYear}
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200">
                <Edit3 size={16} />
              </button>
              <button 
                onClick={() => handleDeleteCard(method.id)}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Add New Card Placeholder */}
      {paymentMethods.length === 0 && (
        <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-gray-500">
          <CreditCard size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No payment methods yet</h3>
          <p className="text-gray-500 text-center mb-6">Add your first payment method to get started with quick and secure checkout</p>
          <button
            onClick={() => setShowAddCard(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Your First Card
          </button>
        </div>
      )}
    </div>
  </div>
)}







              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                      <p className="text-gray-600 mt-1">Choose how you want to be notified about important events</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Login Notifications</div>
                            <div className="text-sm text-gray-600">Get notified when someone logs into your account</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                           <input
  type="checkbox"
  checked={securityData.loginNotifications}
  onChange={(e) => handleLoginNotificationsToggle(e.target.checked)}
  className="sr-only peer"
/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Account Activity</div>
                            <div className="text-sm text-gray-600">Get notified about important account changes</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                           <input
  type="checkbox"
  checked={securityData.activityNotifications}
  onChange={(e) => handleActivityNotificationsToggle(e.target.checked)}
  className="sr-only peer"
/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Marketing Emails</div>
                            <div className="text-sm text-gray-600">Receive updates about new features and promotions</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Weekly Summary</div>
                            <div className="text-sm text-gray-600">Get a weekly summary of your account activity</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
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
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Account Analytics</h2>
                      <p className="text-gray-600 mt-1">View your account performance and usage statistics</p>
                    </div>
                    <button className="px-4 py-2 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md flex items-center gap-2">
                      <Download size={16} />
                      Export Report
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <DollarSign size={24} />
                        <div className="text-right">
                          <div className="text-2xl font-bold">{formatCurrency(userStats.totalSpent)}</div>
                          <div className="text-blue-100 text-sm">Total Spent</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-blue-100">
                        <TrendingUp size={16} />
                        <span className="text-sm">+12.5% from last month</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Activity size={24} />
                        <div className="text-right">
                          <div className="text-2xl font-bold">{userStats.totalTransactions}</div>
                          <div className="text-green-100 text-sm">Transactions</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-green-100">
                        <TrendingUp size={16} />
                        <span className="text-sm">+8.2% from last month</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Target size={24} />
                        <div className="text-right">
                          <div className="text-2xl font-bold">{userStats.successRate}%</div>
                          <div className="text-purple-100 text-sm">Success Rate</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-100">
                        <TrendingUp size={16} />
                        <span className="text-sm">+2.1% from last month</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Zap size={24} />
                        <div className="text-right">
                          <div className="text-2xl font-bold">{userStats.currentStreak}</div>
                          <div className="text-orange-100 text-sm">Day Streak</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-orange-100">
                        <Sparkles size={16} />
                        <span className="text-sm">Personal best!</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Charts would go here */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <PieChart size={20} />
                        Spending by Category
                      </h3>
                      <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <BarChart3 size={40} className="mx-auto mb-2" />
                          <p>Chart visualization would be here</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity size={20} />
                        Monthly Activity
                      </h3>
                      <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <TrendingUp size={40} className="mx-auto mb-2" />
                          <p>Activity chart would be here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
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
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add Payment Method</h3>
          <button
            onClick={() => setShowAddCardModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Nickname</label>
            <input
              type="text"
              name="nickname"
              value={newPaymentMethod.nickname}
              onChange={handlePaymentMethodInputChange}
              placeholder="Personal Card"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="defaultCard"
              name="isDefault"
              checked={newPaymentMethod.isDefault}
              onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="defaultCard" className="ml-2 block text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setShowAddCardModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
         <button
  onClick={async () => {
    try {
      // Validate required fields before submitting
      if (!newPaymentMethod.cardNumber || !newPaymentMethod.expiryDate || 
          !newPaymentMethod.cvv || !newPaymentMethod.cardHolder) {
        showNotification("Please fill in all required fields", "error");
        return;
      }

      // Validate expiry date format
      if (!/^\d{2}\/\d{2}$/.test(newPaymentMethod.expiryDate)) {
        showNotification("Please enter a valid expiry date (MM/YY)", "error");
        return;
      }

      setIsSaving(true);
      
      // Extract last 4 digits
      const lastFour = newPaymentMethod.cardNumber.replace(/\s/g, '').slice(-4);
      
      // Extract expiry month and year
      const [expiryMonth, expiryYear] = newPaymentMethod.expiryDate.split('/');
      
      // Determine card type
      const type = detectCardType(newPaymentMethod.cardNumber);
      
      // Prepare the request payload
      const payload = {
        cardNumber: newPaymentMethod.cardNumber.replace(/\s/g, ''),
        expiryDate: newPaymentMethod.expiryDate,
        cvv: newPaymentMethod.cvv,
        cardHolder: newPaymentMethod.cardHolder,
        nickname: newPaymentMethod.nickname || `${type} ending in ${lastFour}`,
        isDefault: newPaymentMethod.isDefault
      };

      const response = await userAPI.addPaymentMethod(payload);

      if (response.success) {
        showNotification("Payment method added successfully!");
        setShowAddCardModal(false);
        setNewPaymentMethod({
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardHolder: "",
          nickname: "",
          isDefault: false
        });
        await loadPaymentMethods();
      }
    } catch (error) {
      console.error('Add payment method error:', error);
      showNotification(error.message || "Failed to add payment method", "error");
    } finally {
      setIsSaving(false);
    }
  }}
  disabled={isSaving}
  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
>
  {isSaving ? (
    <>
      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
      Adding...
    </>
  ) : (
    "Add Card"
  )}
</button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      </div>

      {/* Enhanced Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-sm ${
              notification.type === 'success' 
                ? 'bg-green-50/90 text-green-800 border-green-200' 
                : 'bg-red-50/90 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {notification.type === 'success' ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle size={16} className="text-white" />
                  </div>
                )}
                <span className="font-medium">{notification.message}</span>
                <button
                  onClick={() => setNotification({ show: false, message: "", type: "success" })}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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