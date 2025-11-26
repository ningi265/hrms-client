"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  ChevronRight,
  ChevronLeft,
  Search,
  DollarSign,
  Calendar,
  Building,
  Mail,
  Phone,
  Tag,
  Eye,
  Loader
} from "lucide-react";
import { useAuth } from "../../../../authcontext/authcontext";

export default function CreateRFQForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [requisitions, setRequisitions] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    vendors: [],
    deadline: "",
    description: "",
    estimatedBudget: "",
    priority: "medium",
    deliveryLocation: "",
    specifications: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV;

  const steps = [
    { id: 1, title: 'Select Requisition', icon: FileText, description: 'Choose from approved requisitions' },
    { id: 2, title: 'RFQ Details', icon: Package, description: 'Define requirements and specifications' },
    { id: 3, title: 'Select Vendors', icon: Users, description: 'Choose vendors to invite' },
    { id: 4, title: 'Review & Submit', icon: CheckCircle, description: 'Confirm and send RFQ' }
  ];

  // Fetch data
  useEffect(() => {
const fetchData = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    
    // Fetch requisitions and vendors in parallel
    const [requisitionsRes, vendorsRes] = await Promise.all([
      fetch(`${backendUrl}/api/requisitions`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${backendUrl}/api/vendors`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    const [requisitionsData, vendorsResponse] = await Promise.all([
      requisitionsRes.json(),
      vendorsRes.json()
    ]);

    if (requisitionsRes.ok) {
      const approvedRequisitions = requisitionsData.filter(req => req.status === "approved");
      setRequisitions(approvedRequisitions);
    }

    if (vendorsRes.ok) {
      // Extract the data array from the vendors response
      setVendors(vendorsResponse.data || []);
    }
  } catch (err) {
    setError("Failed to load data. Please try again.");
    console.error("Error fetching data:", err);
  } finally {
    setIsLoading(false);
  }
};

    fetchData();
  }, [backendUrl]);

  // Validation functions
  const validateStep = (stepIndex) => {
    const errors = {};
    
    switch (stepIndex) {
      case 0:
        if (!selectedRequisition) errors.requisition = "Please select a requisition";
        break;
      case 1:
        if (!formData.itemName) errors.itemName = "Item name is required";
        if (!formData.quantity || formData.quantity <= 0) errors.quantity = "Valid quantity is required";
        if (!formData.deadline) errors.deadline = "Deadline is required";
        break;
      case 2:
        if (formData.vendors.length === 0) errors.vendors = "Please select at least one vendor";
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation functions
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Form handlers
  const handleRequisitionSelect = (requisition) => {
    setSelectedRequisition(requisition);
    setFormData(prev => ({
      ...prev,
      itemName: requisition.itemName,
      quantity: requisition.quantity,
      estimatedBudget: requisition.estimatedCost || "",
      description: requisition.reason || ""
    }));
    if (validationErrors.requisition) {
      setValidationErrors(prev => ({ ...prev, requisition: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleVendorToggle = (vendorId) => {
    setFormData(prev => ({
      ...prev,
      vendors: prev.vendors.includes(vendorId)
        ? prev.vendors.filter(id => id !== vendorId)
        : [...prev.vendors, vendorId]
    }));
    if (validationErrors.vendors) {
      setValidationErrors(prev => ({ ...prev, vendors: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/rfqs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: formData.itemName,
          quantity: formData.quantity,
          vendors: formData.vendors,
          deadline: formData.deadline,
          description: formData.description,
          estimatedBudget: formData.estimatedBudget,
          priority: formData.priority,
          deliveryLocation: formData.deliveryLocation,
          specifications: formData.specifications,
          requisitionId: selectedRequisition?._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("RFQ created successfully!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else navigate("/rfqs/view");
        }, 1500);
      } else {
        setError(data.message || "Failed to create RFQ");
      }
    } catch (err) {
      setError("Failed to create RFQ. Please try again.");
      console.error("Failed to create RFQ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter functions
  const filteredRequisitions = (requisitions || []).filter(req =>
    req.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const filteredVendors = (vendors || []).filter(vendor => {
  if (!vendor) return false;
  return (
    vendor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedRequisition;
      case 1: return formData.itemName && formData.quantity && formData.deadline;
      case 2: return formData.vendors.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  if (isLoading && requisitions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin w-8 h-8 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Progress Bar */}
      <div className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Step {currentStep + 1} of {steps.length}</h3>
            <p className="text-xs text-gray-600">{steps[currentStep].description}</p>
          </div>
          <div className="text-xs text-gray-500">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mx-8 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-green-800 text-sm">{successMessage}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="flex-1 px-8 py-6 overflow-hidden">
        {/* Step 1: Select Requisition */}
         {currentStep === 0 && (
  <div className="h-full flex flex-col">
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">Select Requisition</h4>
      <p className="text-gray-600 text-sm">Choose an approved requisition to create an RFQ</p>
    </div>

    {/* Search */}
    <div className="relative mb-4">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search requisitions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Requisitions Grid - Card Layout */}
    <div className="flex-1 overflow-y-auto">
      {filteredRequisitions.length === 0 ? (
        <div className="text-center py-8">
          <FileText size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {searchTerm ? "No requisitions match your search" : "No approved requisitions available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredRequisitions.map((req) => (
            <div
              key={req._id}
              onClick={() => handleRequisitionSelect(req)}
              className={`bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                selectedRequisition?._id === req._id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-3">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-sm truncate">{req.itemName}</h5>
                    <p className="text-xs text-gray-500 truncate">{req.department}</p>
                  </div>
                  {selectedRequisition?._id === req._id && (
                    <CheckCircle size={16} className="text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-gray-900">{req.quantity}</div>
                    <div className="text-xs text-gray-500">Quantity</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-green-600">
                      ${req.estimatedCost || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Urgency:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      req.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      req.urgency === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {req.urgency || 'Medium'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">{req.category || 'General'}</span>
                  </div>
                  {req.budgetCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Budget Code:</span>
                      <span className="font-medium text-gray-900">{req.budgetCode}</span>
                    </div>
                  )}
                </div>

                {/* Reason Preview */}
                {req.reason && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-600 mb-1">Reason:</div>
                    <p className="text-xs text-gray-800 line-clamp-2">{req.reason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {validationErrors.requisition && (
      <p className="text-sm text-red-600 mt-3 text-center">{validationErrors.requisition}</p>
    )}
  </div>
)}

        {/* Step 2: RFQ Details */}
        {currentStep === 1 && (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">RFQ Details</h4>
              <p className="text-gray-600 text-sm">Define the requirements and specifications</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.itemName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter item name"
                  />
                  {validationErrors.itemName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.itemName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.quantity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter quantity"
                  />
                  {validationErrors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.deadline ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.deadline && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.deadline}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Budget
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter delivery location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Describe the requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technical Specifications
                </label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter technical requirements..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Select Vendors */}
        {currentStep === 2 && (
  <div className="h-full flex flex-col">
    <div className="mb-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">Select Vendors</h4>
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">Choose vendors to invite for quotes</p>
        <span className="text-sm text-blue-600 font-medium">
          {formData.vendors.length} selected
        </span>
      </div>
    </div>

    {/* Search */}
    <div className="relative mb-4">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search vendors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Vendors Grid - Card Layout */}
    <div className="flex-1 overflow-y-auto">
      {filteredVendors.length === 0 ? (
        <div className="text-center py-8">
          <Users size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {searchTerm ? "No vendors match your search" : "No vendors available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredVendors.map((vendor) => {
            // Safely extract values that might be objects
            const vendorLocation = typeof vendor.location === 'object' 
              ? vendor.location?.city || vendor.location?.address || 'N/A'
              : vendor.location || 'N/A';
            
            const vendorIndustry = typeof vendor.industry === 'string' 
              ? vendor.industry 
              : 'General';
            
            const vendorPhone = typeof vendor.phoneNumber === 'string' 
              ? vendor.phoneNumber 
              : 'N/A';
            
            const vendorCompany = typeof vendor.companyName === 'string' 
              ? vendor.companyName 
              : 'N/A';
            
            // Safely handle specializations array
            const specializations = Array.isArray(vendor.specializations) 
              ? vendor.specializations 
              : [];

            return (
              <div
                key={vendor._id}
                onClick={() => handleVendorToggle(vendor._id)}
                className={`bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                  formData.vendors.includes(vendor._id)
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-3">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 text-sm truncate">
                        {vendor.firstName} {vendor.lastName}
                      </h5>
                      <p className="text-xs text-gray-500 truncate">{vendor.email}</p>
                    </div>
                    {formData.vendors.includes(vendor._id) && (
                      <CheckCircle size={16} className="text-blue-600 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Company & Industry */}
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {vendorCompany}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      vendor.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {vendorIndustry}
                      </div>
                      <div className="text-xs text-gray-500">Industry</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {vendorPhone}
                      </div>
                      <div className="text-xs text-gray-500">Phone</div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-1 text-xs">
                    {vendor.businessType && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Business Type:</span>
                        <span className="font-medium text-gray-900">
                          {typeof vendor.businessType === 'string' ? vendor.businessType : 'N/A'}
                        </span>
                      </div>
                    )}
                    {vendor.yearsInBusiness && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium text-gray-900">
                          {typeof vendor.yearsInBusiness === 'number' ? `${vendor.yearsInBusiness} years` : 'N/A'}
                        </span>
                      </div>
                    )}
                    {vendorLocation && vendorLocation !== 'N/A' && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900 truncate">{vendorLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  {specializations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-600 mb-1">Specializations:</div>
                      <div className="flex flex-wrap gap-1">
                        {specializations.slice(0, 2).map((spec, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                            {typeof spec === 'string' ? spec : 'Specialization'}
                          </span>
                        ))}
                        {specializations.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{specializations.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {validationErrors.vendors && (
      <p className="text-sm text-red-600 mt-3 text-center">{validationErrors.vendors}</p>
    )}
  </div>
)}

        {/* Step 4: Review & Submit */}
        {currentStep === 3 && (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Review & Submit</h4>
              <p className="text-gray-600 text-sm">Review all details before submitting your RFQ</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Item Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={16} />
                  Item Details
                </h5>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Item:</span>
                    <span className="ml-2 font-medium">{formData.itemName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <span className="ml-2 font-medium">{formData.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Deadline:</span>
                    <span className="ml-2 font-medium">{new Date(formData.deadline).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Priority:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      formData.priority === 'high' ? 'bg-red-100 text-red-800' :
                      formData.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                    </span>
                  </div>
                  {formData.estimatedBudget && (
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <span className="ml-2 font-medium text-green-600">${formData.estimatedBudget}</span>
                    </div>
                  )}
                  {formData.deliveryLocation && (
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 font-medium">{formData.deliveryLocation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Vendors */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Selected Vendors ({formData.vendors.length})
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formData.vendors.map((vendorId) => {
                    const vendor = vendors.find(v => v._id === vendorId);
                    return vendor ? (
                      <div key={vendorId} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <div className="text-sm font-medium">{vendor.firstName} {vendor.lastName}</div>
                          <div className="text-xs text-gray-600">{vendor.email}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          vendor.isVerified 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {vendor.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Additional Information */}
              {(formData.description || formData.specifications) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Additional Information
                  </h5>
                  {formData.description && (
                    <div className="mb-3">
                      <h6 className="text-sm font-medium text-gray-700 mb-1">Description</h6>
                      <p className="text-sm text-gray-800 bg-white p-2 rounded border">{formData.description}</p>
                    </div>
                  )}
                  {formData.specifications && (
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-1">Specifications</h6>
                      <p className="text-sm text-gray-800 bg-white p-2 rounded border">{formData.specifications}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-8 py-4 border-t border-gray-200 flex justify-between flex-shrink-0">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex gap-3">
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !canProceed()}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit RFQ
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}