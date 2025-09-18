import { useState } from "react";
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
  Info
} from "lucide-react";
import { motion } from "framer-motion";

export default function VendorRegistration() {
  const [formData, setFormData] = useState({
    countryOfRegistration: "Malawi",
    businessName: "",
    taxpayerIdentificationNumber: "",
    tinIssuedDate: "",
    companyType: "",
    formOfBusiness: "",
    ownershipType: "",
    selectBusiness: "",
    registrationNumber: "",
    registrationIssuedDate: "",
    powerOfAttorney: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const countries = [
    "Malawi", "South Africa", "Zambia", "Tanzania", "Mozambique", 
    "Zimbabwe", "Botswana", "Kenya", "Uganda", "Rwanda"
  ];

  const companyTypes = [
    "Private Limited Company",
    "Public Limited Company", 
    "Partnership",
    "Sole Proprietorship",
    "Trust",
    "NGO/Non-Profit",
    "Government Entity"
  ];

  const businessForms = [
    "Limited Liability Company",
    "Partnership",
    "Sole Trader",
    "Trust",
    "Association",
    "Cooperative"
  ];

  const ownershipTypes = [
    "Private Ownership",
    "Public Ownership",
    "Foreign Ownership",
    "Joint Venture",
    "Government Owned"
  ];

  const businessCategories = [
    "Manufacturing",
    "Trading/Retail",
    "Services",
    "Construction",
    "Agriculture",
    "Technology",
    "Healthcare",
    "Education",
    "Transport",
    "Other"
  ];
  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL_PROD
      : process.env.REACT_APP_BACKEND_URL_DEV

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({
        ...prev,
        powerOfAttorney: "File size must be less than 5MB"
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      powerOfAttorney: file
    }));
    
    if (errors.powerOfAttorney) {
      setErrors(prev => ({
        ...prev,
        powerOfAttorney: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    
    if (!formData.taxpayerIdentificationNumber.trim()) {
      newErrors.taxpayerIdentificationNumber = "TIN is required";
    }
    
    if (!formData.tinIssuedDate) {
      newErrors.tinIssuedDate = "TIN issued date is required";
    }
    
    if (!formData.companyType) {
      newErrors.companyType = "Company type is required";
    }
    
    if (!formData.formOfBusiness) {
      newErrors.formOfBusiness = "Form of business is required";
    }
    
    if (!formData.ownershipType) {
      newErrors.ownershipType = "Ownership type is required";
    }
    
    if (!formData.selectBusiness) {
      newErrors.selectBusiness = "Business category is required";
    }
    
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }
    
    if (!formData.registrationIssuedDate) {
      newErrors.registrationIssuedDate = "Registration issued date is required";
    }
    
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkRegistrationStatus = async (email) => {
  try {
    const response = await fetch(
      `${backendUrl}/api/vendors/registration-status?email=${encodeURIComponent(email)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to check status');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking registration status:', error);
    throw error;
  }
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Create FormData to handle file upload
    const formDataToSend = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'powerOfAttorney' && formData[key]) {
        formDataToSend.append('powerOfAttorney', formData[key]);
      } else if (key !== 'powerOfAttorney') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Add terms acceptance
    formDataToSend.append('termsAccepted', acceptTerms);
    
    // Add default user fields for account creation
    formDataToSend.append('firstName', formData.businessName.split(' ')[0] || 'Vendor');
    formDataToSend.append('lastName', formData.businessName.split(' ').slice(1).join(' ') || 'User');
    formDataToSend.append('phoneNumber', formData.phoneNumber); // Default from contact info
    formDataToSend.append('password', 'TempPassword123!'); // You might want to add a password field to the form
    const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage            
    const response = await fetch(`${backendUrl}/api/vendors/register`, {
      method: 'POST',
      headers: {
          Authorization: `Bearer ${token}`,
        },
      body: formDataToSend,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        countryOfRegistration: "Malawi",
        businessName: "",
        taxpayerIdentificationNumber: "",
        tinIssuedDate: "",
        companyType: "",
        formOfBusiness: "",
        ownershipType: "",
        selectBusiness: "",
        registrationNumber: "",
        registrationIssuedDate: "",
        powerOfAttorney: null
      });
      setAcceptTerms(false);
      setShowSuccess(false);
    }, 3000);
    
  } catch (error) {
    console.error("Registration failed:", error);
    setErrors({
      submit: error.message || 'Registration failed. Please try again.'
    });
  } finally {
    setIsSubmitting(false);
  }
}; 



  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-12 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your vendor registration has been submitted successfully. You will receive an email notification once your application has been reviewed and approved.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 text-blue-800">
              <Clock size={20} />
              <span className="font-medium">Expected Review Time: 3-5 Business Days</span>
            </div>
          </div>
          <button 
            onClick={() => setShowSuccess(false)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
          >
            Submit Another Registration
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-6 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Building size={32} />
                </div>
                Vendor Registration
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Register your business to become an approved vendor
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/30 border-b border-gray-100/50 px-8 py-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText size={24} className="text-blue-600" />
                  Basic Information
                </h2>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3 text-blue-800">
                    <Info size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      To access the supplier registration electronic form, please provide your 
                      company tax identification number, country of registration, and legal form of your company.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Country of Registration */}

                  <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="+265-888-0000-000"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country of Registration <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.countryOfRegistration}
                    onChange={(e) => handleInputChange("countryOfRegistration", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name of Business/Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.businessName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your business name"
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.businessName}
                    </p>
                  )}
                </div>

                {/* TIN */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Taxpayer Identification Number (TIN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.taxpayerIdentificationNumber}
                    onChange={(e) => handleInputChange("taxpayerIdentificationNumber", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.taxpayerIdentificationNumber ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your TIN"
                  />
                  {errors.taxpayerIdentificationNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.taxpayerIdentificationNumber}
                    </p>
                  )}
                </div>

                {/* TIN Issued Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TIN Issued Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tinIssuedDate}
                    onChange={(e) => handleInputChange("tinIssuedDate", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.tinIssuedDate ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.tinIssuedDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.tinIssuedDate}
                    </p>
                  )}
                </div>

                {/* Company Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.companyType}
                    onChange={(e) => handleInputChange("companyType", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.companyType ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select company type</option>
                    {companyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.companyType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.companyType}
                    </p>
                  )}
                </div>

                {/* Form of Business */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Form of Business <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.formOfBusiness}
                    onChange={(e) => handleInputChange("formOfBusiness", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.formOfBusiness ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select form of business</option>
                    {businessForms.map(form => (
                      <option key={form} value={form}>{form}</option>
                    ))}
                  </select>
                  {errors.formOfBusiness && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.formOfBusiness}
                    </p>
                  )}
                </div>

                {/* Ownership Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ownership Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.ownershipType}
                    onChange={(e) => handleInputChange("ownershipType", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.ownershipType ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select ownership type</option>
                    {ownershipTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.ownershipType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.ownershipType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50/50 to-blue-50/30 border-b border-gray-100/50 px-8 py-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Building size={24} className="text-purple-600" />
                  Business Details
                </h2>
              </div>

              <div className="p-8 space-y-6">
                {/* Select Business */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Business <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.selectBusiness}
                    onChange={(e) => handleInputChange("selectBusiness", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.selectBusiness ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a business category</option>
                    {businessCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.selectBusiness && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.selectBusiness}
                    </p>
                  )}
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.registrationNumber ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter registration number"
                  />
                  {errors.registrationNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                {/* Registration Issued Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registration Issued Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.registrationIssuedDate}
                    onChange={(e) => handleInputChange("registrationIssuedDate", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm ${
                      errors.registrationIssuedDate ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.registrationIssuedDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.registrationIssuedDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions and Upload Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-50/50 to-blue-50/30 border-b border-gray-100/50 px-8 py-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Info size={24} className="text-green-600" />
                  Instructions
                </h2>
              </div>

              <div className="p-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900">Authorized User: Brian Mtonga</p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={18} />
                      <span>+265 993773578</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail size={18} />
                      <span>brianmtonga592@gmail.com</span>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Attach Official Power of Attorney
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                    <Upload size={40} className="mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium cursor-pointer"
                    >
                      Upload
                    </label>
                  </div>
                  
                  {formData.powerOfAttorney && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText size={18} className="text-green-600" />
                      <span className="text-green-800 font-medium">{formData.powerOfAttorney.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileUpload(null)}
                        className="ml-auto text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  {errors.powerOfAttorney && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.powerOfAttorney}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-8">
              <div className="space-y-6">
                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I accept by continuing using the system you certify that you have read the above service 
                    request instruction and accept the applicable Terms and Conditions
                  </label>
                </div>
                
                {errors.terms && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.terms}
                  </p>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing Registration...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Start Registration
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    );
    }