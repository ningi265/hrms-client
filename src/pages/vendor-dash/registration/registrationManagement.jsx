import { useState, useEffect } from "react";
import { useNavigate ,useSearchParams} from "react-router-dom";
import {
  Building,
  FileText,
  Calendar,
  Upload,
  Check,
  AlertCircle,
  Phone,
  Mail,
  User,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Info,
  Download,
  Edit,
  RefreshCw,
  Star,
  MapPin,
  TrendingUp,
  Award,
  Activity,
  Bell,
  Settings,
  Archive,
  UserCheck,
  XCircle,
  AlertTriangle,
  Loader,
  Users,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

export default function VendorManagementDashboard() {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");
 const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'vendor-dash';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mock vendor data - replace with actual API call
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockData = {
          id: "VND-001",
          registrationStatus: "under_review", // pending, under_review, approved, rejected
          submissionDate: "2024-01-15",
          expectedCompletionDate: "2024-01-20",
          basicInfo: {
            countryOfRegistration: "Malawi",
            businessName: "TechFlow Solutions Ltd",
            taxpayerIdentificationNumber: "TIN123456789",
            tinIssuedDate: "2023-06-15",
            companyType: "Private Limited Company",
            formOfBusiness: "Limited Liability Company",
            ownershipType: "Private Ownership",
            selectBusiness: "Technology",
            registrationNumber: "REG789456123",
            registrationIssuedDate: "2023-07-01"
          },
          contactInfo: {
            authorizedUser: "Brian Mtonga",
            phone: "+265 993773578",
            email: "brianmtonga592@gmail.com"
          },
          documents: {
            powerOfAttorney: {
              name: "power_of_attorney.pdf",
              uploadDate: "2024-01-15",
              status: "verified",
              size: "2.1 MB"
            }
          },
          timeline: [
            {
              status: "submitted",
              date: "2024-01-15",
              time: "10:30 AM",
              description: "Registration submitted successfully",
              completed: true
            },
            {
              status: "document_verification",
              date: "2024-01-16",
              time: "2:15 PM",
              description: "Documents under verification",
              completed: true
            },
            {
              status: "under_review",
              date: "2024-01-17",
              time: "9:00 AM",
              description: "Application under review by compliance team",
              completed: true,
              current: true
            },
            {
              status: "final_approval",
              date: "Expected: 2024-01-19",
              time: "TBD",
              description: "Final approval and account activation",
              completed: false
            }
          ],
          metrics: {
            completionPercentage: 75,
            daysInReview: 3,
            averageProcessingTime: "5-7 days"
          }
        };
        
        setVendorData(mockData);
      } catch (err) {
        setError("Failed to load vendor data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'under_review': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={20} />;
      case 'under_review': return <Loader size={20} className="animate-spin" />;
      case 'approved': return <CheckCircle size={20} />;
      case 'rejected': return <XCircle size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  const showNotificationMessage = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };
  const handleSectionChange = (section) => {
  navigate(`?section=${section}`, { replace: true });
};

  const handleDownloadDocument = (docName) => {
    showNotificationMessage(`Downloading ${docName}...`, "info");
    // Implement actual download logic here
  };

  const handleEditRegistration = () => {
    navigate('/vendor-registration/edit');
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Please wait while we fetch your registration details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md w-full text-center">
          <AlertCircle size={24} className="mx-auto mb-2" />
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Building size={32} />
                </div>
                Vendor Management Dashboard
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Track your registration status and manage business information
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => showNotificationMessage("Refreshing data...", "info")}
                className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
              >
                <RefreshCw size={20} />
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Bell size={20} />
              </button>
              <button className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Settings size={20} />
              </button>
              <button 
  onClick={() => {
    setUserMenuOpen(false);
    handleSectionChange("registration");
  }}
  className="p-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
>
  <Plus size={20} />
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
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${getStatusColor(vendorData.registrationStatus)}`}>
                  {getStatusIcon(vendorData.registrationStatus)}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendorData.registrationStatus)}`}>
                  {vendorData.registrationStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Registration Status</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {vendorData.registrationStatus.replace('_', ' ')}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {vendorData.metrics.completionPercentage}%
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Completion</p>
                <p className="text-2xl font-bold text-gray-900">{vendorData.metrics.completionPercentage}%</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Clock size={24} className="text-white" />
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {vendorData.metrics.daysInReview} days
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Days in Review</p>
                <p className="text-2xl font-bold text-gray-900">{vendorData.metrics.daysInReview}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Award size={24} className="text-white" />
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  ID: {vendorData.id}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Vendor ID</p>
                <p className="text-2xl font-bold text-gray-900">{vendorData.id}</p>
              </div>
            </motion.div>
          </div>

          {/* Progress Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/30 border-b border-gray-100/50 px-8 py-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Activity size={24} className="text-blue-600" />
                Registration Progress
              </h2>
            </div>
            
            <div className="p-8">
              <div className="relative">
                {/* Progress Bar */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div 
                  className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 transition-all duration-1000"
                  style={{ height: `${(vendorData.timeline.filter(item => item.completed).length / vendorData.timeline.length) * 100}%` }}
                ></div>
                
                <div className="space-y-6">
                  {vendorData.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`relative flex items-start gap-6 ${item.current ? 'bg-blue-50 border border-blue-200 rounded-xl p-4 -ml-4' : ''}`}
                    >
                      <div className={`relative z-10 w-4 h-4 rounded-full border-2 ${
                        item.completed 
                          ? 'bg-green-500 border-green-500' 
                          : item.current 
                            ? 'bg-blue-500 border-blue-500 animate-pulse' 
                            : 'bg-white border-gray-300'
                      }`}>
                        {item.completed && (
                          <Check size={12} className="text-white absolute -top-1 -left-1" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${item.current ? 'text-blue-900' : 'text-gray-900'}`}>
                            {item.description}
                          </h3>
                          <span className={`text-sm ${item.current ? 'text-blue-600' : 'text-gray-500'}`}>
                            {item.date} {item.time && `• ${item.time}`}
                          </span>
                        </div>
                        
                        {item.current && (
                          <div className="flex items-center gap-2 text-blue-600 text-sm">
                            <Loader size={14} className="animate-spin" />
                            <span>Currently in progress...</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
            <div className="border-b border-gray-200/50">
              <nav className="flex space-x-8 px-8">
                {[
                  { id: 'overview', label: 'Business Overview', icon: Building },
                  { id: 'documents', label: 'Documents', icon: FileText },
                  { id: 'contact', label: 'Contact Information', icon: Phone }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                    <button
                      onClick={handleEditRegistration}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Information
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(vendorData.basicInfo).map(([key, value]) => (
                      <div key={key} className="bg-gray-50/50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <p className="text-gray-900 font-medium">{value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Uploaded Documents</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FileText size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{vendorData.documents.powerOfAttorney.name}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded: {vendorData.documents.powerOfAttorney.uploadDate} • {vendorData.documents.powerOfAttorney.size}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vendorData.documents.powerOfAttorney.status === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {vendorData.documents.powerOfAttorney.status.toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleDownloadDocument(vendorData.documents.powerOfAttorney.name)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Authorized User</p>
                          <p className="text-gray-700">{vendorData.contactInfo.authorizedUser}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Phone Number</p>
                          <p className="text-gray-700">{vendorData.contactInfo.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Email Address</p>
                          <p className="text-gray-700">{vendorData.contactInfo.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
              : notificationType === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                notificationType === 'success' 
                  ? 'bg-green-500' 
                  : notificationType === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
              }`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
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