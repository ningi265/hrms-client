import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [isNewUser, setIsNewUser] = useState(false);
  const [showNewUserAlert, setShowNewUserAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'vendor-dash';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
    const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

  // Helper function to transform API data to component format
  const transformApiData = (apiData) => {
    try {
      // Validate required fields
      if (!apiData._id) {
        throw new Error('Missing vendor ID in API response');
      }
      
      // Safely parse dates with fallbacks
      const parseDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
      };
      
      const submissionDate = parseDate(apiData.submissionDate);
      const approvalDate = parseDate(apiData.approvalDate);
      
      // Calculate days in review with null check
      const daysInReview = submissionDate 
        ? Math.floor((new Date() - submissionDate) / (1000 * 60 * 60 * 24))
        : 0;

      // Calculate completion percentage based on status
      const getCompletionPercentage = (status) => {
        switch (status) {
          case 'pending': return 25;
          case 'under_review': return 75;
          case 'approved': return 100;
          case 'rejected': return 50;
          default: return 0;
        }
      };

      // Generate timeline based on current status and dates
      const generateTimeline = (status, submissionDate, approvalDate) => {
        const timeline = [];
        const submissionDateObj = new Date(submissionDate);
        
        // Submitted step
        timeline.push({
          status: "submitted",
          date: submissionDateObj.toLocaleDateString(),
          time: submissionDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: "Registration submitted successfully",
          completed: true
        });

        // Document verification step
        const docVerificationDate = new Date(submissionDateObj);
        docVerificationDate.setDate(docVerificationDate.getDate() + 1);
        
        timeline.push({
          status: "document_verification",
          date: docVerificationDate.toLocaleDateString(),
          time: docVerificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: "Documents under verification",
          completed: ['under_review', 'approved', 'rejected'].includes(status)
        });

        // Review step
        if (['under_review', 'approved', 'rejected'].includes(status)) {
          const reviewDate = new Date(submissionDateObj);
          reviewDate.setDate(reviewDate.getDate() + 2);
          
          timeline.push({
            status: status,
            date: reviewDate.toLocaleDateString(),
            time: reviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: status === 'rejected' 
              ? "Application was rejected - please review feedback"
              : "Application under review by compliance team",
            completed: ['approved', 'rejected'].includes(status),
            current: status === 'under_review'
          });
        } else if (status === 'pending') {
          timeline.push({
            status: "under_review",
            date: "Pending",
            time: "",
            description: "Waiting for review by compliance team",
            completed: false,
            current: true
          });
        }

        // Final approval step
        if (status === 'approved' && approvalDate) {
          const approvalDateObj = new Date(approvalDate);
          timeline.push({
            status: "final_approval",
            date: approvalDateObj.toLocaleDateString(),
            time: approvalDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: "Final approval and account activation completed",
            completed: true
          });
        } else if (status !== 'rejected') {
          timeline.push({
            status: "final_approval",
            date: "Pending",
            time: "",
            description: "Final approval and account activation",
            completed: false
          });
        }

        return timeline;
      };

      // Format file size safely
      const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      // Build transformed data with correct property mapping
      return {
        id: apiData._id,
        registrationStatus: apiData.registrationStatus || 'pending',
        submissionDate: submissionDate ? submissionDate.toLocaleDateString() : 'N/A',
        approvalDate: approvalDate ? approvalDate.toLocaleDateString() : null,
        isNewUser: false,
        
        basicInfo: {
          countryOfRegistration: apiData.countryOfRegistration || 'N/A',
          businessName: apiData.businessName || 'N/A',
          taxpayerIdentificationNumber: apiData.taxpayerIdentificationNumber || 'N/A',
          tinIssuedDate: parseDate(apiData.tinIssuedDate)?.toLocaleDateString() || 'N/A',
          companyType: apiData.companyType || 'N/A',
          formOfBusiness: apiData.formOfBusiness || 'N/A',
          ownershipType: apiData.ownershipType || 'N/A',
          businessCategory: apiData.businessCategory || 'N/A',
          registrationNumber: apiData.registrationNumber || 'N/A',
          registrationIssuedDate: parseDate(apiData.registrationIssuedDate)?.toLocaleDateString() || 'N/A'
        },
        
        // FIXED: Use vendor object instead of authorizedContact
        contactInfo: apiData.vendor ? {
          authorizedUser: `${apiData.vendor.firstName || ''} ${apiData.vendor.lastName || ''}`.trim() || 'N/A',
          phone: apiData.vendor.phoneNumber || 'N/A',
          email: apiData.vendor.email || 'N/A'
        } : {
          authorizedUser: 'N/A',
          phone: 'N/A',
          email: 'N/A'
        },
        
        documents: apiData.powerOfAttorney ? {
          powerOfAttorney: {
            name: apiData.powerOfAttorney.fileName || 'Unknown Document',
            uploadDate: parseDate(apiData.powerOfAttorney.uploadDate)?.toLocaleDateString() || 'N/A',
            status: apiData.registrationStatus === 'approved' ? 'verified' : 
                    apiData.registrationStatus === 'rejected' ? 'rejected' : 'pending',
            size: formatFileSize(apiData.powerOfAttorney.fileSize),
            filePath: apiData.powerOfAttorney.filePath || ''
          }
        } : null,
        
        timeline: generateTimeline(
          apiData.registrationStatus || 'pending', 
          apiData.submissionDate, 
          apiData.approvalDate
        ),
        
        metrics: {
          completionPercentage: getCompletionPercentage(apiData.registrationStatus),
          daysInReview: daysInReview,
          averageProcessingTime: "5-7 days"
        },
        
        vendor: apiData.vendor || null
      };
      
    } catch (err) {
      console.error('Error transforming API data:', err);
      throw new Error('Failed to process vendor data: ' + err.message);
    }
  };

  // Fetch vendor data from API
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Check if backend URL is configured
        if (!backendUrl) {
          throw new Error('Backend URL is not configured. Please check your .env file.');
        }
        
        console.log('Fetching from:', `${backendUrl}/api/vendors/vendor-data`);
        console.log('Token exists:', !!token);

        const response = await fetch(`${backendUrl}/api/vendors/vendor-data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          if (response.status === 404) {
            // No vendor data found - new user
            setIsNewUser(true);
            setShowNewUserAlert(true);
            setVendorData({
              id: null,
              registrationStatus: "not_started",
              isNewUser: true,
              timeline: [
                {
                  status: "start_registration",
                  date: "Not started",
                  time: "",
                  description: "Click the + button to start your registration",
                  completed: false,
                  current: true
                },
                {
                  status: "document_upload",
                  date: "Pending",
                  time: "",
                  description: "Upload required documents",
                  completed: false
                },
                {
                  status: "document_verification",
                  date: "Pending",
                  time: "",
                  description: "Documents verification",
                  completed: false
                },
                {
                  status: "final_approval",
                  date: "Pending",
                  time: "",
                  description: "Final approval and account activation",
                  completed: false
                }
              ],
              metrics: {
                completionPercentage: 0,
                daysInReview: 0,
                averageProcessingTime: "5-7 days"
              }
            });
            return;
          } else if (response.status === 401) {
            throw new Error('Authentication failed. Please login again.');
          } else if (response.status === 403) {
            throw new Error('Access denied. You do not have permission to view this data.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown error'}`);
          }
        }

        const apiData = await response.json();
        console.log('API Response:', apiData);
        
        // Validate API data structure
        if (!apiData || typeof apiData !== 'object') {
          throw new Error('Invalid API response format');
        }
        
        // Transform API data to component format
        const transformedData = transformApiData(apiData);
        setVendorData(transformedData);
        setIsNewUser(false);
        
      } catch (err) {
        console.error('Error fetching vendor data:', err);
        
        // Enhanced error handling
        if (err.message.includes('fetch')) {
          setError('Network error. Please check your internet connection and try again.');
        } else if (err.message.includes('Authentication')) {
          setError('Authentication failed. Please login again.');
        } else if (err.message.includes('404') || err.message.includes('Not Found')) {
          // Handle as new user
          setIsNewUser(true);
          setShowNewUserAlert(true);
          setVendorData({
            id: null,
            registrationStatus: "not_started",
            isNewUser: true,
            timeline: [
              {
                status: "start_registration",
                date: "Not started",
                time: "",
                description: "Click the + button to start your registration",
                completed: false,
                current: true
              },
              {
                status: "document_upload",
                date: "Pending",
                time: "",
                description: "Upload required documents",
                completed: false
              },
              {
                status: "document_verification",
                date: "Pending",
                time: "",
                description: "Documents verification",
                completed: false
              },
              {
                status: "final_approval",
                date: "Pending",
                time: "",
                description: "Final approval and account activation",
                completed: false
              }
            ],
            metrics: {
              completionPercentage: 0,
              daysInReview: 0,
              averageProcessingTime: "5-7 days"
            }
          });
        } else {
          setError(err.message || "Failed to load vendor data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [backendUrl]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'under_review': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'not_started': return <AlertCircle size={20} />;
      case 'pending': return <Clock size={20} />;
      case 'under_review': return <Loader size={20} className="animate-spin" />;
      case 'approved': return <CheckCircle size={20} />;
      case 'rejected': return <XCircle size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'pending': return 'Pending';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
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

  const handleDownloadDocument = async (docName, filePath) => {
    try {
      showNotificationMessage(`Downloading ${docName}...`, "info");
      
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/vendors/download-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ filePath })
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = docName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotificationMessage(`${docName} downloaded successfully!`, "success");
    } catch (error) {
      console.error('Download error:', error);
      showNotificationMessage(`Failed to download ${docName}`, "error");
    }
  };

  const handleEditRegistration = () => {
    navigate('/vendor-registration/edit');
  };

  const handleStartRegistration = () => {
    setShowNewUserAlert(false);
    handleSectionChange("registration");
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
                {isNewUser ? "Welcome! Start your registration process" : "Track your registration status and manage business information"}
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
                onClick={handleStartRegistration}
                className={`p-3 rounded-xl transition-all duration-200 border shadow-sm hover:shadow-md ${
                  isNewUser 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 animate-pulse border-blue-600' 
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border-gray-200'
                }`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New User Alert */}
      {showNewUserAlert && isNewUser && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-6 py-4"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Info size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Welcome to Vendor Registration!</h3>
                <p className="text-blue-700">You haven't started your registration yet. Click the + button to begin your vendor registration process.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartRegistration}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Registration
              </button>
              <button
                onClick={() => setShowNewUserAlert(false)}
                className="p-2 text-blue-400 hover:text-blue-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

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
                  {getStatusText(vendorData.registrationStatus)}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Registration Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isNewUser ? "Not Started" : getStatusText(vendorData.registrationStatus)}
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
                  {isNewUser ? "0 days" : `${vendorData.metrics.daysInReview} days`}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Days in Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isNewUser ? "0" : vendorData.metrics.daysInReview}
                </p>
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
                  {isNewUser ? "Not Assigned" : `ID: ${vendorData.id?.slice(-8)}`}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Vendor ID</p>
                <p className="text-lg font-bold text-gray-900">
                  {isNewUser ? "N/A" : vendorData.id?.slice(-8)}
                </p>
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
                            ? isNewUser && item.status === 'start_registration'
                              ? 'bg-orange-500 border-orange-500 animate-pulse'
                              : 'bg-blue-500 border-blue-500 animate-pulse'
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
                        
                        {item.current && isNewUser && item.status === 'start_registration' && (
                          <div className="flex items-center gap-2 text-orange-600 text-sm">
                            <AlertCircle size={14} />
                            <span>Click the + button to start registration</span>
                          </div>
                        )}
                        
                        {item.current && !isNewUser && (
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

          {/* Tab Navigation - Only show if not a new user */}
          {!isNewUser && (
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
                      {vendorData.basicInfo && Object.entries(vendorData.basicInfo).map(([key, value]) => (
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
                    
                    {vendorData.documents ? (
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
                              onClick={() => handleDownloadDocument(
                                vendorData.documents.powerOfAttorney.name,
                                vendorData.documents.powerOfAttorney.filePath
                              )}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No documents uploaded yet</p>
                      </div>
                    )}
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
                    
                    {vendorData.contactInfo ? (
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
                    ) : (
                      <div className="text-center py-8">
                        <Phone size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No contact information available</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* New User Call-to-Action Card */}
          {isNewUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join our vendor network by completing the registration process. It only takes a few minutes to submit your business information and required documents.
                </p>
                <button
                  onClick={handleStartRegistration}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Your Registration
                </button>
              </div>
            </motion.div>
          )}
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