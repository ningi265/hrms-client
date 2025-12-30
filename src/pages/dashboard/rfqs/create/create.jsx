"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  ChevronRight,
  ChevronLeft,
  Search,
  DollarSign,
  Eye,
  Loader,
  XCircle,
  Check
} from "lucide-react";
import { useAuth } from "../../../../authcontext/authcontext";

export default function CreateRFQForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
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
  const [existingRFQs, setExistingRFQs] = useState([]);

  const backendUrl = import.meta.env.VITE_ENV === 'production'
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

  const steps = [
    { id: 1, title: 'Select Requisition', icon: FileText, description: 'Choose from approved requisitions' },
    { id: 2, title: 'RFQ Details', icon: Package, description: 'Define requirements and specifications' },
    { id: 3, title: 'Review & Submit', icon: CheckCircle, description: 'Confirm and send RFQ' }
  ];

  // Helper function to ensure we always get an array from API responses
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.rfqs && Array.isArray(data.rfqs)) return data.rfqs;
    if (data?.requisitions && Array.isArray(data.requisitions)) return data.requisitions;
    if (data?.success && Array.isArray(data.data)) return data.data;
    return [];
  };

  // Helper function to check if procurement has approved based on workflow timeline
  const hasProcurementApproved = (requisition) => {
    if (!requisition) return false;
    
    // Check 1: Look for procurement approval in workflow timeline
    if (requisition.workflowTimeline && Array.isArray(requisition.workflowTimeline)) {
      const procurementApproval = requisition.workflowTimeline.find(item => 
        item.action === "approved_rfq_intermediate" || 
        item.action === "procurement_approved" ||
        (item.details && item.details.isProcurementApproval === true)
      );
      
      if (procurementApproval) {
        return true;
      }
    }
    
    // Check 2: Look in history
    if (requisition.history && Array.isArray(requisition.history)) {
      const procurementHistory = requisition.history.find(item => 
        item.action === "approved_rfq_intermediate" || 
        item.action === "procurement_approved" ||
        (item.details && item.details.isProcurementApproval === true)
      );
      
      if (procurementHistory) {
        return true;
      }
    }
    
    // Check 3: Look in approval steps
    if (requisition.approvalSteps && Array.isArray(requisition.approvalSteps)) {
      for (const step of requisition.approvalSteps) {
        if (step.approvers && Array.isArray(step.approvers)) {
          const procurementApprover = step.approvers.find(approver => {
            // Check if approver is a procurement role
            if (approver.userId && approver.userId.role) {
              const procurementRoles = [
                "Procurement Officer",
                "Senior Procurement Officer", 
                "Procurement Manager",
                "Supply Chain Officer"
              ];
              return procurementRoles.includes(approver.userId.role) && 
                     approver.status === "approved";
            }
            return false;
          });
          
          if (procurementApprover) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // Check if requisition already has an RFQ
  const hasExistingRFQ = (requisitionId) => {
    if (!Array.isArray(existingRFQs)) {
      console.warn("existingRFQs is not an array:", existingRFQs);
      return false;
    }
    
    return existingRFQs.some(rfq => {
      if (!rfq) return false;
      
      // Handle different RFQ object structures
      const rfqRequisitionId = rfq.requisitionId || 
                              (rfq.requisition && rfq.requisition._id) || 
                              (rfq.requisitionIdObj && rfq.requisitionIdObj._id) ||
                              (rfq.requisition && typeof rfq.requisition === 'string' ? rfq.requisition : null);
      
      return rfqRequisitionId === requisitionId || 
             rfqRequisitionId?._id === requisitionId ||
             (typeof rfqRequisitionId === 'string' && rfqRequisitionId === requisitionId);
    });
  };

  // Get existing RFQ for a requisition
  const getExistingRFQ = (requisitionId) => {
    if (!Array.isArray(existingRFQs)) {
      console.warn("existingRFQs is not an array:", existingRFQs);
      return null;
    }
    
    return existingRFQs.find(rfq => {
      if (!rfq) return false;
      
      // Handle different RFQ object structures
      const rfqRequisitionId = rfq.requisitionId || 
                              (rfq.requisition && rfq.requisition._id) || 
                              (rfq.requisitionIdObj && rfq.requisitionIdObj._id) ||
                              (rfq.requisition && typeof rfq.requisition === 'string' ? rfq.requisition : null);
      
      return rfqRequisitionId === requisitionId || 
             rfqRequisitionId?._id === requisitionId ||
             (typeof rfqRequisitionId === 'string' && rfqRequisitionId === requisitionId);
    });
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        
        // Fetch all RFQs to check which requisitions already have RFQs
        const rfqsRes = await fetch(`${backendUrl}/api/rfqs`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (rfqsRes.ok) {
          const rfqsData = await rfqsRes.json();
          console.log("RFQs API response:", rfqsData);
          
          // Use ensureArray to handle different response structures
          const rfqsArray = ensureArray(rfqsData);
          setExistingRFQs(rfqsArray);
          console.log("Processed RFQs array:", rfqsArray.length, rfqsArray);
        } else {
          console.error("Failed to fetch RFQs, status:", rfqsRes.status);
          setExistingRFQs([]);
        }
        
        // Fetch requisitions
        const requisitionsRes = await fetch(`${backendUrl}/api/requisitions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (requisitionsRes.ok) {
          const requisitionsData = await requisitionsRes.json();
          console.log("Requisitions API response:", requisitionsData);
          
          // Use ensureArray to handle different response structures
          const requisitionsArray = ensureArray(requisitionsData);
          console.log("Processed requisitions array:", requisitionsArray.length, requisitionsArray);
          
          // Filter requisitions: only show those without existing RFQs and approved by procurement
          const filteredRequisitions = requisitionsArray.filter(req => {
            if (!req || !req._id) return false;
            
            // Skip if already has an RFQ
            if (hasExistingRFQ(req._id)) {
              console.log(`Skipping requisition ${req._id} - already has RFQ`);
              return false;
            }
            
            // Check if procurement approved
            const procurementApproved = hasProcurementApproved(req);
            
            // Also check for backward compatibility status
            const hasApprovedRFQStatus = req.status === "approved-rfq";
            
            const shouldInclude = procurementApproved || hasApprovedRFQStatus;
            
            if (shouldInclude) {
              console.log(`Including requisition ${req._id} - procurement approved or approved-rfq status`);
            } else {
              console.log(`Excluding requisition ${req._id} - not approved by procurement`);
            }
            
            return shouldInclude;
          });
          
          setRequisitions(filteredRequisitions);
          
          // Debug logging
          console.log("=== RFQ Creation Summary ===");
          console.log("Total requisitions found:", requisitionsArray.length);
          console.log("Total RFQs found:", existingRFQs.length);
          console.log("Available for RFQ creation:", filteredRequisitions.length);
          
          // Log which requisitions have existing RFQs
          const requisitionsWithRFQ = requisitionsArray.filter(req => hasExistingRFQ(req._id));
          console.log("Requisitions with existing RFQs (excluded):", requisitionsWithRFQ.length);
          
          console.log("=== End Summary ===");
        } else {
          console.error("Failed to fetch requisitions, status:", requisitionsRes.status);
          setRequisitions([]);
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching data:", err);
        setExistingRFQs([]);
        setRequisitions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  // Filter requisitions for display - exclude those with existing RFQs
  const filteredRequisitions = (requisitions || []).filter(req => {
    if (!req || !req.itemName) return false;
    
    // Don't show requisitions with existing RFQs
    if (hasExistingRFQ(req._id)) {
      return false;
    }
    
    // Check search term
    return req.itemName.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
    if (!requisition || !requisition._id) {
      setError("Invalid requisition selected");
      return;
    }
    
    // Check if requisition already has an RFQ (defensive check)
    if (hasExistingRFQ(requisition._id)) {
      const existingRFQ = getExistingRFQ(requisition._id);
      setError(`This requisition already has an RFQ (${existingRFQ?.rfqNumber || existingRFQ?._id || 'unknown'}). Please select another requisition.`);
      return;
    }
    
    setSelectedRequisition(requisition);
    setFormData(prev => ({
      ...prev,
      itemName: requisition.itemName || "",
      quantity: requisition.quantity || "",
      estimatedBudget: requisition.estimatedCost || "",
      description: requisition.reason || ""
    }));
    
    if (validationErrors.requisition) {
      setValidationErrors(prev => ({ ...prev, requisition: "" }));
    }
    setError(null); // Clear any previous errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    // Double-check if selected requisition still doesn't have an RFQ
    if (selectedRequisition && selectedRequisition._id && hasExistingRFQ(selectedRequisition._id)) {
      const existingRFQ = getExistingRFQ(selectedRequisition._id);
      setError(`This requisition now has an existing RFQ (${existingRFQ?.rfqNumber || existingRFQ?._id || 'unknown'}). Please refresh and select another requisition.`);
      return;
    }

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

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedRequisition;
      case 1: return formData.itemName && formData.quantity && formData.deadline;
      case 2: return true;
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
              <p className="text-gray-600 text-sm">Choose a requisition approved by procurement to create an RFQ</p>
              <p className="text-gray-500 text-xs mt-1">
                Note: Requisitions that already have an RFQ are not shown
              </p>
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
                  {searchTerm ? (
                    <>
                      <Search size={48} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No requisitions match your search</p>
                    </>
                  ) : (
                    <>
                      <FileText size={48} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No requisitions available for RFQ creation</p>
                      <p className="text-gray-400 text-xs mt-2">
                        This could be because:
                      </p>
                      <ul className="text-gray-400 text-xs mt-1 text-left max-w-md mx-auto">
                        <li className="flex items-center gap-1 mb-1">
                          <Check size={12} className="text-green-400" />
                          All approved requisitions already have RFQs created
                        </li>
                        <li className="flex items-center gap-1 mb-1">
                          <Clock size={12} className="text-blue-400" />
                          Requisitions are still pending procurement approval
                        </li>
                        <li className="flex items-center gap-1">
                          <FileText size={12} className="text-gray-400" />
                          No requisitions have been approved by procurement yet
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredRequisitions.map((req) => {
                    if (!req || !req._id) return null;
                    
                    return (
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
                              <h5 className="font-semibold text-gray-900 text-sm truncate">{req.itemName || "Unnamed Item"}</h5>
                              <p className="text-xs text-gray-500 truncate">{req.department || "No Department"}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {selectedRequisition?._id === req._id && (
                                <CheckCircle size={16} className="text-blue-600 flex-shrink-0" />
                              )}
                              {hasProcurementApproved(req) && (
                                <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                                  Proc. Approved
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              req.status === 'approved-rfq' ? 'bg-orange-100 text-orange-800' :
                              req.status === 'approved' ? 'bg-green-100 text-green-800' :
                              req.status === 'in-review' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {req.status === 'approved-rfq' ? 'Ready for RFQ' :
                               req.status === 'approved' ? 'Fully Approved' :
                               req.status === 'in-review' ? 'In Review' :
                               req.status || 'Unknown'}
                            </span>
                          </div>

                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                              <div className="text-sm font-bold text-gray-900">{req.quantity || 0}</div>
                              <div className="text-xs text-gray-500">Quantity</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                              <div className="text-sm font-bold text-green-600">
                                MWK {req.estimatedCost || 'N/A'}
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

                          {/* Workflow Info */}
                          {req.currentApprovalStep && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="text-xs text-gray-600 mb-1">Current Stage:</div>
                              <p className="text-xs font-medium text-gray-800">{req.currentApprovalStep.nodeName || 'N/A'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                    <span className="absolute left-3 top-2 text-gray-400 text-sm font-medium">MWK</span>
                    <input
                      type="number"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {/* Step 3: Review & Submit */}
        {currentStep === 2 && (
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
                      <span className="ml-2 font-medium text-green-600">MWK {formData.estimatedBudget}</span>
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

              {/* Source Requisition Info */}
              {selectedRequisition && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Source Requisition
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-blue-700">Requisition ID:</span>
                      <span className="ml-2 font-medium text-blue-900">{selectedRequisition._id?.slice(-8) || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Status:</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedRequisition.status === 'approved-rfq' ? 'bg-orange-100 text-orange-800' :
                        selectedRequisition.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedRequisition.status === 'approved-rfq' ? 'Ready for RFQ' :
                         selectedRequisition.status === 'approved' ? 'Fully Approved' :
                         selectedRequisition.status || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Approved By:</span>
                      <span className="ml-2 font-medium text-blue-900">
                        {hasProcurementApproved(selectedRequisition) ? 'Procurement' : 'Various Approvers'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Department:</span>
                      <span className="ml-2 font-medium text-blue-900">{selectedRequisition.department || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Source Information */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Eye size={16} />
                  Sourcing Information
                </h5>
                <p className="text-sm text-green-800">
                  After submission, the procurement team will source quotes from qualified vendors based on:
                </p>
                <ul className="mt-2 text-sm text-green-800 space-y-1">
                  <li>• Vendor specialization and capabilities</li>
                  <li>• Past performance and reliability</li>
                  <li>• Competitive pricing and quality</li>
                  <li>• Delivery capabilities and timelines</li>
                </ul>
              </div>
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