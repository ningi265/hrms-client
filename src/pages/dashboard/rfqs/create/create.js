"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Tag,
  FileText,
  Truck,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Save,
  Send,
  X,
  Eye,
  ChevronRight,
  ChevronLeft,
  Building,
  CreditCard,
  Users,
  Calendar,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Bell,
  MessageSquare,
  ExternalLink,
  Copy,
  RefreshCw,
  FileCheck,
  Target,
  Award,
  BarChart3,
  Activity,
  DollarSign,
  ShoppingCart
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../../authcontext/authcontext";

export default function CreateRFQPage({ onClose, onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requisitions, setRequisitions] = useState([]);
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
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVendorsLoading, setIsVendorsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const steps = [
    {
      id: 1,
      title: "Select Requisition",
      description: "Choose from approved requisitions",
      icon: <FileText size={20} />
    },
    {
      id: 2,
      title: "RFQ Details",
      description: "Specify requirements and preferences",
      icon: <Package size={20} />
    },
    {
      id: 3,
      title: "Vendor Selection",
      description: "Choose vendors to receive quotes",
      icon: <Users size={20} />
    },
    {
      id: 4,
      title: "Review & Submit",
      description: "Confirm details and send RFQ",
      icon: <Send size={20} />
    }
  ];

  useEffect(() => {
    const fetchRequisitionsAndVendors = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        
        // Fetch requisitions
        const requisitionsResponse = await fetch(`${backendUrl}/api/requisitions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const requisitionsData = await requisitionsResponse.json();

        if (!requisitionsResponse.ok) {
          throw new Error(requisitionsData.message || "Failed to fetch requisitions");
        }

        const approvedRequisitions = requisitionsData.filter(
          (req) => req.status === "approved"
        );
        setRequisitions(approvedRequisitions);

        // Fetch vendors
        setIsVendorsLoading(true);
        const vendorsResponse = await fetch(`${backendUrl}/api/vendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const vendorsData = await vendorsResponse.json();

        if (!vendorsResponse.ok) {
          throw new Error(vendorsData.message || "Failed to fetch vendors");
        }

        setVendors(vendorsData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
        setIsVendorsLoading(false);
      }
    };

    fetchRequisitionsAndVendors();
  }, [backendUrl]);

  const handleRequisitionChange = (requisition) => {
    setSelectedRequisition(requisition);
    if (requisition) {
      setFormData((prev) => ({
        ...prev,
        itemName: requisition.itemName,
        quantity: requisition.quantity,
        estimatedBudget: requisition.estimatedCost || "",
        description: requisition.reason || ""
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleVendorToggle = (vendorId) => {
    setFormData((prev) => ({
      ...prev,
      vendors: prev.vendors.includes(vendorId)
        ? prev.vendors.filter(id => id !== vendorId)
        : [...prev.vendors, vendorId]
    }));
  };

  const validateStep = (stepIndex) => {
    const errors = {};
    
    if (stepIndex === 0) {
      if (!selectedRequisition) errors.requisition = "Please select a requisition";
    }
    
    if (stepIndex === 1) {
      if (!formData.itemName) errors.itemName = "Item name is required";
      if (!formData.quantity || formData.quantity <= 0) errors.quantity = "Valid quantity is required";
      if (!formData.deadline) errors.deadline = "Deadline is required";
    }
    
    if (stepIndex === 2) {
      if (formData.vendors.length === 0) errors.vendors = "Please select at least one vendor";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

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
        setSuccessMessage("RFQ created successfully and vendors notified!");
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        } else {
          setTimeout(() => navigate("/rfqs/view"), 2000);
        }
      } else {
        setError(data.message || "Failed to create RFQ");
      }
    } catch (err) {
      setError("Failed to create RFQ");
      console.error("Failed to create RFQ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequisitions = requisitions.filter(req =>
    req.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVendors = vendors.filter(vendor =>
  (vendor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
   vendor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
   vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
   vendor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()))
);



  if (isLoading && requisitions.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Data</h2>
          <p className="text-gray-600">Fetching requisitions and vendors...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {onClose && (
              <button 
                onClick={onClose}
                className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-all duration-200 hover:scale-105"
              >
                <X size={20} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Sparkles size={24} />
                </div>
                Create Request for Quotation
              </h1>
              <p className="text-gray-500 text-sm mt-1">Transform approved requisitions into vendor quote requests</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">RFQ Creation Progress</h2>
              <p className="text-gray-500 text-sm">Complete all steps to create your RFQ</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">Step {activeStep + 1} of {steps.length}</div>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                  index <= activeStep 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white shadow-lg' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {index < activeStep ? (
                    <CheckCircle size={20} />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-3 rounded-full transition-all duration-500 ${
                    index < activeStep 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-bold text-gray-900">{steps[activeStep].title}</h3>
            <p className="text-gray-600">{steps[activeStep].description}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
        >
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800 font-medium">{successMessage}</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
        >
          <AlertCircle size={20} className="text-red-600" />
          <span className="text-red-800 font-medium">{error}</span>
        </motion.div>
      )}

      {/* Form Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            {steps[activeStep].icon}
            {steps[activeStep].title}
          </h3>
        </div>
        
        <div className="p-8">
          {/* Step 1: Requisition Selection */}
          {activeStep === 0 && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requisitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Requisitions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredRequisitions.map((req) => (
                  <motion.div
                    key={req._id}
                    whileHover={{ y: -2, scale: 1.02 }}
                    onClick={() => handleRequisitionChange(req)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedRequisition?._id === req._id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{req.itemName}</h4>
                        <p className="text-sm text-gray-600">Quantity: {req.quantity}</p>
                      </div>
                      {selectedRequisition?._id === req._id && (
                        <CheckCircle size={20} className="text-blue-600" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Department:</span>
                        <span className="font-medium text-gray-700">{req.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Budget:</span>
                        <span className="font-medium text-green-600">${req.estimatedCost || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Urgency:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.urgency === 'high' ? 'bg-red-100 text-red-800' :
                          req.urgency === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {req.urgency || 'Medium'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {validationErrors.requisition && (
                <p className="text-sm text-red-600">{validationErrors.requisition}</p>
              )}
            </div>
          )}

          {/* Step 2: RFQ Details */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.itemName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter item name"
                  />
                  {validationErrors.itemName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.itemName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.quantity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter quantity"
                  />
                  {validationErrors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.deadline ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.deadline && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.deadline}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Budget
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter delivery location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Describe the requirements and specifications..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Specifications
                </label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter specific technical requirements, standards, or preferences..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Vendor Selection */}
          {activeStep === 2 && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Selected Count */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-900 font-medium">
                    {formData.vendors.length} vendor{formData.vendors.length !== 1 ? 's' : ''} selected
                  </span>
                  {formData.vendors.length > 0 && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, vendors: [] }))}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Vendors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredVendors.map((vendor) => (
                  <motion.div
                    key={vendor._id}
                    whileHover={{ y: -2 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.vendors.includes(vendor._id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleVendorToggle(vendor._id)}
                  >
                   <div className="flex items-start justify-between mb-3">
  <div className="flex-1">
    <h4 className="font-bold text-gray-900 mb-1">
      {vendor.firstName} {vendor.lastName}
    </h4>
    <p className="text-sm text-gray-600">{vendor.email}</p>
  </div>
  {formData.vendors.includes(vendor._id) && (
    <CheckCircle size={20} className="text-blue-600" />
  )}
</div>
                    
                   <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Industry:</span>
          <span className="font-medium text-gray-700">{vendor.industry || 'General'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Phone:</span>
          <span className="font-medium text-gray-700">{vendor.phoneNumber}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            vendor.isVerified 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {vendor.isVerified ? 'Verified' : 'Pending'}
          </span>
        </div>
      </div>
                  </motion.div>
                ))}
              </div>
              
              {validationErrors.vendors && (
                <p className="text-sm text-red-600">{validationErrors.vendors}</p>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-bold text-xl text-gray-900 mb-2 flex items-center gap-3">
                  <Eye size={24} />
                  RFQ Summary
                </h4>
                <p className="text-gray-600">
                  Please review all information before submitting your RFQ to vendors.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Item Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Item Details
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item Name:</span>
                      <span className="font-medium">{formData.itemName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{new Date(formData.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData.priority === 'high' ? 'bg-red-100 text-red-800' :
                        formData.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                      </span>
                    </div>
                    {formData.estimatedBudget && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Budget:</span>
                        <span className="font-medium text-green-600">${formData.estimatedBudget}</span>
                      </div>
                    )}
                    {formData.deliveryLocation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Location:</span>
                        <span className="font-medium">{formData.deliveryLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Selection */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users size={20} />
                    Selected Vendors ({formData.vendors.length})
                  </h5>
                 <div className="space-y-3 max-h-48 overflow-y-auto">
  {formData.vendors.map((vendorId) => {
    const vendor = vendors.find(v => v._id === vendorId);
    return vendor ? (
      <div key={vendorId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-gray-900">
            {vendor.firstName} {vendor.lastName}
          </div>
          <div className="text-sm text-gray-600">{vendor.email}</div>
          <div className="text-xs text-gray-500">{vendor.companyName}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">{vendor.industry}</div>
          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
            vendor.isVerified 
              ? 'bg-green-100 text-green-600' 
              : 'bg-yellow-100 text-yellow-600'
          }`}>
            {vendor.isVerified ? 'Verified' : 'Pending'}
          </div>
        </div>
      </div>
    ) : null;
  })}
</div>
                </div>
              </div>

              {/* Description & Specifications */}
              {(formData.description || formData.specifications) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Additional Information
                  </h5>
                  {formData.description && (
                    <div className="mb-4">
                      <h6 className="font-medium text-gray-900 mb-2">Description</h6>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{formData.description}</p>
                      </div>
                    </div>
                  )}
                  {formData.specifications && (
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Technical Specifications</h6>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{formData.specifications}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Timeline Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h5 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  RFQ Timeline
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Send size={20} className="text-blue-600" />
                    </div>
                    <h6 className="font-medium text-blue-900 mb-1">1. RFQ Sent</h6>
                    <p className="text-xs text-blue-700">Immediately after submission</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare size={20} className="text-blue-600" />
                    </div>
                    <h6 className="font-medium text-blue-900 mb-1">2. Quotes Received</h6>
                    <p className="text-xs text-blue-700">Vendors submit their proposals</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={20} className="text-blue-600" />
                    </div>
                    <h6 className="font-medium text-blue-900 mb-1">3. Deadline</h6>
                    <p className="text-xs text-blue-700">{new Date(formData.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-t border-gray-100/50 flex justify-between">
          <button
            type="button"
            onClick={handlePreviousStep}
            disabled={activeStep === 0}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <ChevronLeft size={18} />
            Previous Step
          </button>
          
          <div className="flex space-x-4">
            {activeStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating RFQ...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit RFQ
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}