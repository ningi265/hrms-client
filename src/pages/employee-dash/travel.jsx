import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Car,
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
  Target,
  Building,
  DollarSign,
  Globe,
  Save,
  RefreshCw,
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
  Settings
} from 'lucide-react';
import { useAuth } from "../../authcontext/authcontext";

const TravelRequestForm = ({ onCancel, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    purpose: '',
    departureDate: '',
    returnDate: '',
    location: '',
    fundingCodes: '',
    meansOfTravel: '',
    currency: 'MWK',
    travelType: 'local',
    estimatedCost: '',
    numberOfTravelers: 1,
    accommodationNeeded: false,
    emergencyContact: '',
    specialRequirements: '',
    businessJustification: '',
    department: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [animate, setAnimate] = useState(false);

     const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;
  const navigate = useNavigate();
  const { token } = useAuth();

  const steps = [
    {
      id: 0,
      title: "Travel Details",
      description: "Basic travel information and purpose",
      icon: <MapPin size={20} />
    },
    {
      id: 1,
      title: "Dates & Logistics",
      description: "Travel dates and transportation",
      icon: <Calendar size={20} />
    },
    {
      id: 2,
      title: "Budget & Approval",
      description: "Cost estimates and justification",
      icon: <CreditCard size={20} />
    }
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
    { value: "own", label: "Own Vehicle", icon: <Car size={16} />, description: "Use personal vehicle" },
    { value: "company", label: "Company Vehicle", icon: <Building size={16} />, description: "Use company fleet" },
    { value: "rental", label: "Rental Car", icon: <Car size={16} />, description: "Rent a vehicle" },
    { value: "flight", label: "Flight", icon: <Plane size={16} />, description: "Air travel" },
    { value: "bus", label: "Bus/Coach", icon: <Car size={16} />, description: "Bus transportation" }
  ];

  useEffect(() => {
    setAnimate(true);
    // Auto-save draft
    const saveDraft = setTimeout(() => {
      if (Object.values(formData).some(value => value !== '' && value !== 1 && value !== false)) {
        localStorage.setItem('travelRequestDraft', JSON.stringify(formData));
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 2000);
      }
    }, 3000);

    return () => clearTimeout(saveDraft);
  }, [formData]);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('travelRequestDraft');
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (stepIndex) => {
    const errors = {};
    
    if (stepIndex === 0) {
      if (!formData.purpose.trim()) errors.purpose = "Purpose of travel is required";
      if (!formData.location.trim()) errors.location = "Destination is required";
      if (!formData.department) errors.department = "Department is required";
      if (formData.purpose.length < 10) errors.purpose = "Please provide more details about the purpose";
    }
    
    if (stepIndex === 1) {
      if (!formData.departureDate) errors.departureDate = "Departure date is required";
      if (!formData.returnDate) errors.returnDate = "Return date is required";
      if (!formData.meansOfTravel) errors.meansOfTravel = "Transportation method is required";
      
      if (formData.departureDate && formData.returnDate) {
        const departure = new Date(formData.departureDate);
        const returnDate = new Date(formData.returnDate);
        if (departure >= returnDate) {
          errors.returnDate = "Return date must be after departure date";
        }
        if (departure < new Date()) {
          errors.departureDate = "Departure date cannot be in the past";
        }
      }
    }
    
    if (stepIndex === 2) {
      if (!formData.fundingCodes.trim()) errors.fundingCodes = "Funding code is required";
      if (!formData.businessJustification.trim()) errors.businessJustification = "Business justification is required";
      if (formData.businessJustification.length < 20) errors.businessJustification = "Please provide detailed justification (minimum 20 characters)";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
        travelType: 'local',
        currency: 'MWK',
        estimatedCost: formData.estimatedCost,
        numberOfTravelers: formData.numberOfTravelers,
        accommodationNeeded: formData.accommodationNeeded,
        emergencyContact: formData.emergencyContact,
        specialRequirements: formData.specialRequirements,
        businessJustification: formData.businessJustification,
        department: formData.department
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
        console.log("Travel request created:", data);
        
        setShowSuccess(true);
        localStorage.removeItem('travelRequestDraft');
        
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

  const getTotalDays = () => {
    if (formData.departureDate && formData.returnDate) {
      const departure = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      const diffTime = Math.abs(returnDate - departure);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                <MapPin size={24} />
              </div>
              Local Travel Request
            </h2>
            <p className="text-gray-600 mt-1">Submit a request for domestic business travel</p>
          </div>
          {isDraftSaved && (
            <div className="flex items-center text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200 animate-pulse">
              <Save size={16} className="mr-2" />
              Draft saved
            </div>
          )}
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
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white shadow-lg' 
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
                    index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'
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
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    validationErrors.purpose ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Provide detailed information about the purpose of your travel, meetings planned, objectives..."
                />
                <div className="mt-1 flex items-center justify-between">
                  {validationErrors.purpose ? (
                    <p className="text-sm text-red-600">{validationErrors.purpose}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Minimum 10 characters required</p>
                  )}
                  <span className={`text-xs ${formData.purpose.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.purpose.length}/10
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter destination city/location"
                    />
                  </div>
                  {validationErrors.location && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.department ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  {validationErrors.department && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.department}</p>
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Name and phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accommodationNeeded"
                  name="accommodationNeeded"
                  checked={formData.accommodationNeeded}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="accommodationNeeded" className="ml-3 text-sm font-medium text-gray-900">
                  Accommodation required for this trip
                </label>
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.departureDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {validationErrors.departureDate && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.departureDate}</p>
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.returnDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {validationErrors.returnDate && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.returnDate}</p>
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

              {/* Transportation Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Transportation Method *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transportMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, meansOfTravel: method.value }))}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                        formData.meansOfTravel === method.value
                          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          formData.meansOfTravel === method.value ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {method.icon}
                        </div>
                        {formData.meansOfTravel === method.value && (
                          <CheckCircle size={20} className="text-blue-600" />
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900">{method.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    </button>
                  ))}
                </div>
                {validationErrors.meansOfTravel && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.meansOfTravel}</p>
                )}
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
                />
              </div>
            </div>
          )}

          {/* Step 3: Budget & Approval */}
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.fundingCodes ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., PROJ-2024-001"
                    />
                  </div>
                  {validationErrors.fundingCodes && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.fundingCodes}</p>
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Currency: Malawian Kwacha (MWK)</p>
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    validationErrors.businessJustification ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Explain the business necessity for this travel, expected outcomes, and how it aligns with organizational goals..."
                />
                <div className="mt-1 flex items-center justify-between">
                  {validationErrors.businessJustification ? (
                    <p className="text-sm text-red-600">{validationErrors.businessJustification}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Minimum 20 characters required</p>
                  )}
                  <span className={`text-xs ${formData.businessJustification.length >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.businessJustification.length}/20
                  </span>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Eye size={20} />
                  Travel Request Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Destination:</span>
                    <p className="text-blue-900">{formData.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Department:</span>
                    <p className="text-blue-900">{formData.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Travel Dates:</span>
                    <p className="text-blue-900">
                      {formData.departureDate && formData.returnDate 
                        ? `${new Date(formData.departureDate).toLocaleDateString()} - ${new Date(formData.returnDate).toLocaleDateString()}`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Transportation:</span>
                    <p className="text-blue-900">
                      {transportMethods.find(m => m.value === formData.meansOfTravel)?.label || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Travelers:</span>
                    <p className="text-blue-900">{formData.numberOfTravelers} person(s)</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Estimated Cost:</span>
                    <p className="text-blue-900">
                      {formData.estimatedCost ? `MWK ${parseFloat(formData.estimatedCost).toLocaleString()}` : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield size={20} className="text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-amber-900 mb-2">Travel Policy Compliance</h5>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• All travel must be pre-approved by your department head</li>
                      <li>• Receipts are required for all expenses over MWK 5,000</li>
                      <li>• Travel must comply with company safety and security guidelines</li>
                      <li>• Changes to approved travel must be communicated immediately</li>
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
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
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
                Request Submitted Successfully! 🎉
              </h3>
              <div className="text-gray-600 mb-6 space-y-2">
                <p>Your travel request has been submitted and is now pending approval.</p>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-lg font-bold text-green-900 font-mono">
                    TR-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}
                  </div>
                  <div className="text-sm text-green-700">Reference Number</div>
                </div>
                <div className="text-sm space-y-1">
                  <p>✅ Department manager will be notified</p>
                  <p>✅ HR will review for policy compliance</p>
                  <p>✅ You'll receive email updates on status</p>
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
              Need Help?
            </h4>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2 text-sm">
            <button className="w-full text-left p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2">
              <BookOpen size={14} />
              Travel Policy Guide
            </button>
            <button className="w-full text-left p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2">
              <MessageSquare size={14} />
              Live Chat Support
            </button>
            <button className="w-full text-left p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2">
              <Phone size={14} />
              Call Travel Team
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator - Mobile */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200 z-40">
        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelRequestForm;