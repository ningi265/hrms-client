import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Calendar,
  CreditCard,
  FileText,
  Plane,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  X,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Building,
  DollarSign,
  Upload,
  Save,
  Eye,
  Plus,
  Minus,
  Star,
  Award,
  Zap,
  TrendingUp,
  Shield,
  Bell,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  Users,
  Settings,
  Target,
  Download,
  Copy,
  ExternalLink,
  HelpCircle,
  Info,
  Trash2,
  Paperclip,
  AlertTriangle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const InternationalTravelRequest = ({ onCancel, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    purpose: '',
    departureDate: '',
    returnDate: '',
    travelDays: 0,
    country: '',
    fundingCodes: '',
    meansOfTravel: 'company',
    currency: '',
    documents: [],
    location: '',
    travelType: 'international',
    estimatedCost: '',
    numberOfTravelers: 1,
    accommodationNeeded: false,
    emergencyContact: '',
    specialRequirements: '',
    businessJustification: '',
    department: '',
    visaRequired: false,
    passportExpiry: '',
    insuranceNeeded: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [animate, setAnimate] = useState(false);

 const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

  const steps = [
    {
      id: 0,
      title: "Travel Details",
      description: "Basic travel information and destination",
      icon: <Globe size={20} />
    },
    {
      id: 1,
      title: "Dates & Logistics",
      description: "Travel dates and transportation",
      icon: <Calendar size={20} />
    },
    {
      id: 2,
      title: "Budget & Documentation",
      description: "Funding, documents, and submission",
      icon: <CreditCard size={20} />
    }
  ];

  const countries = [
    { name: "United Kingdom", code: "GB", currencies: ["GBP", "EUR"], visaRequired: false },
    { name: "France", code: "FR", currencies: ["EUR"], visaRequired: false },
    { name: "Germany", code: "DE", currencies: ["EUR"], visaRequired: false },
    { name: "Japan", code: "JP", currencies: ["JPY"], visaRequired: true },
    { name: "Australia", code: "AU", currencies: ["AUD"], visaRequired: true },
    { name: "Canada", code: "CA", currencies: ["CAD"], visaRequired: false },
    { name: "Brazil", code: "BR", currencies: ["BRL"], visaRequired: true },
    { name: "India", code: "IN", currencies: ["INR"], visaRequired: true },
    { name: "South Africa", code: "ZA", currencies: ["ZAR"], visaRequired: false },
    { name: "China", code: "CN", currencies: ["CNY"], visaRequired: true },
    { name: "United States", code: "US", currencies: ["USD"], visaRequired: false },
    { name: "Singapore", code: "SG", currencies: ["SGD"], visaRequired: false },
    { name: "Thailand", code: "TH", currencies: ["THB"], visaRequired: false },
    { name: "Kenya", code: "KE", currencies: ["KES"], visaRequired: true }
  ];

  const departments = [
    "Information Technology",
    "Human Resources", 
    "Finance & Accounting",
    "Operations",
    "Marketing & Communications",
    "Research & Development",
    "Customer Support"
  ];

  const transportMethods = [
    { value: "flight", label: "Flight", icon: <Plane size={16} />, description: "International air travel" },
    { value: "company", label: "Company Vehicle", icon: <Building size={16} />, description: "Use company fleet" },
    { value: "personal", label: "Personal Vehicle", icon: <MapPin size={16} />, description: "Use personal vehicle" },
    { value: "other", label: "Other Transport", icon: <Globe size={16} />, description: "Train, bus, or other" }
  ];

  useEffect(() => {
    setAnimate(true);
    // Calculate travel days
    if (formData.departureDate && formData.returnDate) {
      const departure = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      const days = differenceInDays(returnDate, departure) + 1;
      setFormData(prev => ({ ...prev, travelDays: days > 0 ? days : 0 }));
    }

    // Auto-save draft
    const saveDraft = setTimeout(() => {
      if (Object.values(formData).some(value => value !== '' && value !== 1 && value !== false && value !== 0 && value.length !== 0)) {
        localStorage.setItem('internationalTravelDraft', JSON.stringify(formData));
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 2000);
      }
    }, 3000);

    return () => clearTimeout(saveDraft);
  }, [formData]);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('internationalTravelDraft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  // Calculate progress
  useEffect(() => {
    let completedFields = 0;
    const totalFields = 10;

    if (formData.purpose) completedFields++;
    if (formData.departureDate) completedFields++;
    if (formData.returnDate) completedFields++;
    if (formData.country) completedFields++;
    if (formData.fundingCodes) completedFields++;
    if (formData.currency) completedFields++;
    if (formData.department) completedFields++;
    if (formData.businessJustification) completedFields++;
    if (formData.meansOfTravel) completedFields++;
    if (formData.documents.length > 0) completedFields++;

    setProgress((completedFields / totalFields) * 100);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find(country => country.code === countryCode);
    
    setFormData(prev => ({
      ...prev,
      country: countryCode,
      currency: selectedCountry?.currencies[0] || '',
      visaRequired: selectedCountry?.visaRequired || false
    }));

    if (errors.country) {
      setErrors(prev => ({ ...prev, country: "" }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...validFiles]
    }));

    if (errors.documents) {
      setErrors(prev => ({ ...prev, documents: "" }));
    }
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    
    if (stepIndex === 0) {
      if (!formData.purpose.trim()) newErrors.purpose = "Purpose of travel is required";
      if (!formData.country) newErrors.country = "Destination country is required";
      if (!formData.department) newErrors.department = "Department is required";
      if (formData.purpose.length < 20) newErrors.purpose = "Please provide detailed purpose (minimum 20 characters)";
    }
    
    if (stepIndex === 1) {
      if (!formData.departureDate) newErrors.departureDate = "Departure date is required";
      if (!formData.returnDate) newErrors.returnDate = "Return date is required";
      if (!formData.meansOfTravel) newErrors.meansOfTravel = "Transportation method is required";
      
      if (formData.departureDate && formData.returnDate) {
        const departure = new Date(formData.departureDate);
        const returnDate = new Date(formData.returnDate);
        if (departure >= returnDate) {
          newErrors.returnDate = "Return date must be after departure date";
        }
        if (departure < new Date()) {
          newErrors.departureDate = "Departure date cannot be in the past";
        }
      }

      if (formData.visaRequired && !formData.passportExpiry) {
        newErrors.passportExpiry = "Passport expiry date is required for visa-required countries";
      }
    }
    
    if (stepIndex === 2) {
      if (!formData.fundingCodes.trim()) newErrors.fundingCodes = "Funding code is required";
      if (!formData.businessJustification.trim()) newErrors.businessJustification = "Business justification is required";
      if (formData.businessJustification.length < 30) newErrors.businessJustification = "Please provide detailed justification (minimum 30 characters)";
      if (formData.documents.length === 0) newErrors.documents = "At least one supporting document is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user._id) {
        throw new Error("User not logged in or user ID not found");
      }

      const payload = {
        employee: user._id,
        purpose: formData.purpose,
        departureDate: formData.departureDate ? new Date(formData.departureDate).toISOString() : null,
        returnDate: formData.returnDate ? new Date(formData.returnDate).toISOString() : null,
        location: formData.location,
        fundingCodes: formData.fundingCodes,
        meansOfTravel: formData.meansOfTravel,
        travelType: 'international',
        currency: formData.currency,
        documents: formData.documents,
        destination: formData.country,
        estimatedCost: formData.estimatedCost,
        numberOfTravelers: formData.numberOfTravelers,
        accommodationNeeded: formData.accommodationNeeded,
        emergencyContact: formData.emergencyContact,
        specialRequirements: formData.specialRequirements,
        businessJustification: formData.businessJustification,
        department: formData.department,
        visaRequired: formData.visaRequired,
        passportExpiry: formData.passportExpiry,
        insuranceNeeded: formData.insuranceNeeded
      };

      const response = await fetch(`${backendUrl}/api/travel-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("International travel request created:", data);
        
        setShowSuccess(true);
        localStorage.removeItem('internationalTravelDraft');
        
        // Call success callback if provided
        if (onSubmitSuccess) {
          setTimeout(() => {
            onSubmitSuccess();
          }, 2000);
        } else {
          setTimeout(() => {
            navigate('/travel/manage/dash');
          }, 2000);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to submit travel request");
        setShowError(true);
      }
    } catch (error) {
      console.error('Error submitting travel request:', error);
      setErrorMessage(error.message || "An error occurred while submitting the travel request");
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCountry = () => {
    return countries.find(country => country.code === formData.country);
  };

  const getTotalDays = () => {
    return formData.travelDays;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl text-white">
                <Globe size={24} />
              </div>
              International Travel Request
            </h2>
            <p className="text-gray-600 mt-1">Submit a request for international business travel</p>
          </div>
          <div className="flex items-center space-x-3">
            {isDraftSaved && (
              <div className="flex items-center text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200 animate-pulse">
                <Save size={16} className="mr-2" />
                Draft saved
              </div>
            )}
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">{Math.round(progress)}% complete</div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Progress</h3>
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          </div>
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-br from-purple-500 to-blue-600 border-transparent text-white shadow-lg' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle size={20} />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-500 ${
                    index < currentStep ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h4 className="font-medium text-gray-900">{steps[currentStep].title}</h4>
            <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-purple-50/30">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Step 1: Travel Details */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Travel *
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none ${
                    errors.purpose ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Provide detailed information about the purpose of your international travel, conferences, meetings, business objectives..."
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.purpose ? (
                    <p className="text-sm text-red-600">{errors.purpose}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Minimum 20 characters required</p>
                  )}
                  <span className={`text-xs ${formData.purpose.length >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.purpose.length}/20
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination Country *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleCountryChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.country ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Destination Country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                  
                  {/* Country Information */}
                  {formData.country && (
                    <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-900 font-medium">Destination Info</span>
                        <div className="flex items-center space-x-2">
                          {formData.visaRequired ? (
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">Visa Required</span>
                          ) : (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">No Visa Required</span>
                          )}
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            Currency: {formData.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.department ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, numberOfTravelers: Math.max(1, prev.numberOfTravelers - 1) }))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-medium text-gray-900 px-4">{formData.numberOfTravelers}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, numberOfTravelers: prev.numberOfTravelers + 1 }))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Name and phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="accommodationNeeded"
                      name="accommodationNeeded"
                      checked={formData.accommodationNeeded}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="accommodationNeeded" className="ml-3 text-sm font-medium text-gray-900">
                      Accommodation required
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="insuranceNeeded"
                      name="insuranceNeeded"
                      checked={formData.insuranceNeeded}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="insuranceNeeded" className="ml-3 text-sm font-medium text-gray-900">
                      Travel insurance needed
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dates & Logistics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.departureDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.departureDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.departureDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      min={formData.departureDate || new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.returnDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.returnDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.returnDate}</p>
                  )}
                </div>
              </div>

              {/* Trip Duration Display */}
              {formData.departureDate && formData.returnDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-900 font-medium">Trip Duration</span>
                    <span className="text-blue-700 font-bold">
                      {getTotalDays()} {getTotalDays() === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>
              )}

              {/* Visa Requirements */}
              {formData.visaRequired && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900 mb-2">Visa Required</h4>
                      <p className="text-sm text-amber-800 mb-4">
                        Travel to {getSelectedCountry()?.name} requires a valid visa. Please ensure all visa documentation is complete.
                      </p>
                      
                      <div>
                        <label className="block text-sm font-medium text-amber-900 mb-2">
                          Passport Expiry Date *
                        </label>
                        <input
                          type="date"
                          name="passportExpiry"
                          value={formData.passportExpiry}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                            errors.passportExpiry ? 'border-red-300' : 'border-amber-300'
                          }`}
                        />
                        {errors.passportExpiry && (
                          <p className="mt-1 text-sm text-red-600">{errors.passportExpiry}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transportation Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Transportation Method *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transportMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, meansOfTravel: method.value }))}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                        formData.meansOfTravel === method.value
                          ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          formData.meansOfTravel === method.value ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                          {method.icon}
                        </div>
                        {formData.meansOfTravel === method.value && (
                          <CheckCircle size={20} className="text-purple-600" />
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900">{method.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    </button>
                  ))}
                </div>
                {errors.meansOfTravel && (
                  <p className="mt-2 text-sm text-red-600">{errors.meansOfTravel}</p>
                )}
              </div>

              {/* Currency Information */}
              {formData.currency && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-purple-900 flex items-center gap-2">
                      <DollarSign size={20} />
                      Currency Information
                    </h4>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {formData.currency}
                    </span>
                  </div>
                  <p className="text-purple-800 text-sm">
                    You'll be traveling to <strong>{getSelectedCountry()?.name}</strong> where the local currency is <strong>{formData.currency}</strong>. 
                    Corporate travel cards will be loaded with the appropriate currency amount.
                  </p>
                </div>
              )}

              {/* Special Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements (Optional)
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Dietary restrictions, accessibility needs, special accommodations, etc."
                />
              </div>
            </div>
          )}

          {/* Step 3: Budget & Documentation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Code *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="fundingCodes"
                      value={formData.fundingCodes}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.fundingCodes ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., INT-2024-001"
                    />
                  </div>
                  {errors.fundingCodes && (
                    <p className="mt-1 text-sm text-red-600">{errors.fundingCodes}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="estimatedCost"
                      value={formData.estimatedCost}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Currency: {formData.currency || 'USD'}</p>
                </div>
              </div>

              {/* Business Justification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Justification *
                </label>
                <textarea
                  name="businessJustification"
                  value={formData.businessJustification}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none ${
                    errors.businessJustification ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Explain the business necessity for this international travel, expected outcomes, ROI, and strategic importance..."
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.businessJustification ? (
                    <p className="text-sm text-red-600">{errors.businessJustification}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Minimum 30 characters required</p>
                  )}
                  <span className={`text-xs ${formData.businessJustification.length >= 30 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.businessJustification.length}/30
                  </span>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Supporting Documents *
                </label>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Info size={20} className="text-amber-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-amber-900 mb-1">Required Documents</h5>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Pre-approval documents from department head</li>
                        <li>• Visa applications or approvals (if required)</li>
                        <li>• Flight booking confirmations or quotes</li>
                        <li>• Hotel/accommodation confirmations</li>
                        <li>• Conference registration or invitation letters</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    errors.documents 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    const validFiles = files.filter(file => {
                      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                      const maxSize = 10 * 1024 * 1024;
                      return validTypes.includes(file.type) && file.size <= maxSize;
                    });
                    setFormData(prev => ({
                      ...prev,
                      documents: [...prev.documents, ...validFiles]
                    }));
                  }}
                >
                  <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Upload Documents
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF, Word, JPEG, PNG up to 10MB each
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer"
                  >
                    <Upload size={16} className="mr-2" />
                    Select Files
                  </label>
                </div>
                
                {errors.documents && (
                  <p className="mt-2 text-sm text-red-600">{errors.documents}</p>
                )}
              </div>

              {/* Uploaded Documents */}
              {formData.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents ({formData.documents.length})</h4>
                  <div className="space-y-3">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Paperclip size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <Eye size={20} />
                  Travel Request Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-700 font-medium">Destination:</span>
                    <p className="text-purple-900">{getSelectedCountry()?.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Department:</span>
                    <p className="text-purple-900">{formData.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Travel Dates:</span>
                    <p className="text-purple-900">
                      {formData.departureDate && formData.returnDate 
                        ? `${new Date(formData.departureDate).toLocaleDateString()} - ${new Date(formData.returnDate).toLocaleDateString()}`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Duration:</span>
                    <p className="text-purple-900">{getTotalDays()} days</p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Transportation:</span>
                    <p className="text-purple-900">
                      {transportMethods.find(m => m.value === formData.meansOfTravel)?.label || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Currency:</span>
                    <p className="text-purple-900">{formData.currency || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Visa Required:</span>
                    <p className="text-purple-900">{formData.visaRequired ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Documents:</span>
                    <p className="text-purple-900">{formData.documents.length} file(s) uploaded</p>
                  </div>
                </div>
              </div>

              {/* Compliance Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield size={20} className="text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-amber-900 mb-2">International Travel Compliance</h5>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• All international travel requires pre-approval from department head and HR</li>
                      <li>• Valid passport required (must be valid for 6+ months from travel date)</li>
                      <li>• Visa documentation must be completed before travel</li>
                      <li>• Travel insurance is mandatory for all international trips</li>
                      <li>• Emergency contact information must be provided to security team</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={currentStep === 0 ? onCancel : handlePrevious}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </button>

            <div className="flex space-x-3">
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg animate-pulse">
                <CheckCircle size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                International Travel Request Submitted! 🌍
              </h3>
              <div className="text-gray-600 mb-6 space-y-2">
                <p>Your international travel request has been submitted successfully.</p>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-lg font-bold text-green-900 font-mono">
                    ITR-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}
                  </div>
                  <div className="text-sm text-green-700">Reference Number</div>
                </div>
                <div className="text-sm space-y-1">
                  <p>✅ Department head and HR will review</p>
                  <p>✅ Visa processing will be initiated if required</p>
                  <p>✅ You'll receive detailed email updates</p>
                  <p>✅ Travel documentation will be prepared</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {showError && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg z-50 max-w-md">
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Submission Failed</h4>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-red-400 hover:text-red-600 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Help Sidebar */}
      <div className="fixed right-6 bottom-6 z-40">
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-4 text-white shadow-2xl max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold flex items-center gap-2">
              <Sparkles size={16} />
              International Travel Help
            </h4>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2 text-sm">
            <button className="w-full text-left p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2">
              <BookOpen size={14} />
              Visa Requirements Guide
            </button>
            <button className="w-full text-left p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2">
              <MessageSquare size={14} />
              Travel Support Chat
            </button>
            <button className="w-full text-left p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2">
              <Phone size={14} />
              Emergency Travel Line
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalTravelRequest;