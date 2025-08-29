import React, { useState, useEffect } from "react";
import { ArrowLeft, Package, Tag, History, FileText, Truck, Paperclip, Search, Download, Upload, CheckCircle, AlertCircle, AlertTriangle, Clock, Plus, Sparkles, Settings, Save, Send, X, Eye, ChevronRight, ChevronLeft, Building, CreditCard, Users, Calendar, Star, Filter, MoreVertical, Zap, Shield, TrendingUp, Bell, BookOpen, MessageSquare, Phone, Mail, ExternalLink, Copy, RefreshCw, FileCheck, Layers, Target, Award, BarChart3, Globe, Lock, Cpu, Wifi, Monitor, Smartphone, Headphones, Camera, Database, HardDrive, Server, Router, Printer, Keyboard, Mouse, Activity, Loader } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { debounce } from "lodash";

// API configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const steps = [
  { 
    id: 1, 
    title: "Item Selection", 
    description: "Choose from catalog or specify custom items",
    icon: <Package size={16} />
  },
  { 
    id: 2, 
    title: "Request Details", 
    description: "Provide budget, timeline, and justification",
    icon: <FileText size={16} />
  },
  { 
    id: 3, 
    title: "Review & Submit", 
    description: "Verify information and submit for approval",
    icon: <Shield size={16} />
  }
];

const categories = [
  { 
    name: "Computing Hardware", 
    icon: <Monitor size={16} />,
    color: "blue",
    items: [
      { name: "Laptop", icon: <Monitor size={14} />, avgCost: "$1,200", leadTime: "3-5 days" },
      { name: "Desktop Computer", icon: <Cpu size={14} />, avgCost: "$800", leadTime: "2-4 days" },
      { name: "Tablet", icon: <Smartphone size={14} />, avgCost: "$600", leadTime: "1-3 days" },
      { name: "Monitor", icon: <Monitor size={14} />, avgCost: "$300", leadTime: "1-2 days" },
      { name: "Keyboard", icon: <Keyboard size={14} />, avgCost: "$150", leadTime: "1-2 days" },
      { name: "Mouse", icon: <Mouse size={14} />, avgCost: "$80", leadTime: "1-2 days" }
    ]
  },
  { 
    name: "Office Equipment", 
    icon: <FileText size={16} />,
    color: "emerald",
    items: [
      { name: "Printer", icon: <Printer size={14} />, avgCost: "$400", leadTime: "2-3 days" },
      { name: "Scanner", icon: <Camera size={14} />, avgCost: "$250", leadTime: "2-3 days" },
      { name: "Projector", icon: <Monitor size={14} />, avgCost: "$800", leadTime: "3-5 days" },
      { name: "Whiteboard", icon: <FileText size={14} />, avgCost: "$200", leadTime: "1-2 days" },
      { name: "Shredder", icon: <FileText size={14} />, avgCost: "$150", leadTime: "1-2 days" }
    ]
  },
  { 
    name: "Furniture & Workspace", 
    icon: <Building size={16} />,
    color: "purple",
    items: [
      { name: "Office Chair", icon: <Building size={14} />, avgCost: "$350", leadTime: "5-7 days" },
      { name: "Standing Desk", icon: <Building size={14} />, avgCost: "$600", leadTime: "7-10 days" },
      { name: "Filing Cabinet", icon: <Building size={14} />, avgCost: "$200", leadTime: "3-5 days" },
      { name: "Bookshelf", icon: <Building size={14} />, avgCost: "$180", leadTime: "3-5 days" },
      { name: "Desk Lamp", icon: <Zap size={14} />, avgCost: "$80", leadTime: "1-2 days" }
    ]
  },
  { 
    name: "Software & Licenses", 
    icon: <Settings size={16} />,
    color: "amber",
    items: [
      { name: "Microsoft Office", icon: <FileText size={14} />, avgCost: "$150/year", leadTime: "Instant" },
      { name: "Adobe Creative Suite", icon: <Settings size={14} />, avgCost: "$600/year", leadTime: "Instant" },
      { name: "Project Management Tool", icon: <Target size={14} />, avgCost: "$120/year", leadTime: "Instant" },
      { name: "Antivirus Software", icon: <Shield size={14} />, avgCost: "$80/year", leadTime: "Instant" }
    ]
  },
  { 
    name: "Network & IT Infrastructure", 
    icon: <Wifi size={16} />,
    color: "teal",
    items: [
      { name: "Network Router", icon: <Router size={14} />, avgCost: "$300", leadTime: "2-4 days" },
      { name: "Ethernet Switch", icon: <Database size={14} />, avgCost: "$200", leadTime: "2-4 days" },
      { name: "External Hard Drive", icon: <HardDrive size={14} />, avgCost: "$120", leadTime: "1-3 days" },
      { name: "Server Equipment", icon: <Server size={14} />, avgCost: "$2,500", leadTime: "7-14 days" }
    ]
  },
  { 
    name: "Audio/Visual Equipment", 
    icon: <Headphones size={16} />,
    color: "rose",
    items: [
      { name: "Headphones", icon: <Headphones size={14} />, avgCost: "$200", leadTime: "1-3 days" },
      { name: "Webcam", icon: <Camera size={14} />, avgCost: "$150", leadTime: "1-3 days" },
      { name: "Microphone", icon: <Phone size={14} />, avgCost: "$180", leadTime: "1-3 days" },
      { name: "Speakers", icon: <Headphones size={14} />, avgCost: "$250", leadTime: "2-4 days" }
    ]
  }
];

const templates = [
  { 
    name: "New Employee Setup", 
    description: "Complete workstation for new hire",
    items: ["Laptop", "Monitor", "Office Chair", "Keyboard", "Mouse"],
    estimatedCost: "$2,100",
    category: "Computing Hardware",
    department: "IT",
    popular: true
  },
  { 
    name: "Home Office Package", 
    description: "Remote work essentials",
    items: ["Laptop", "Webcam", "Headphones", "Desk Lamp"],
    estimatedCost: "$1,650",
    category: "Computing Hardware",
    department: "HR",
    popular: true
  },
  { 
    name: "Conference Room Setup", 
    description: "Meeting room equipment",
    items: ["Projector", "Webcam", "Speakers", "Whiteboard"],
    estimatedCost: "$1,400",
    category: "Office Equipment",
    department: "Operations",
    popular: false
  },
  { 
    name: "Software Developer Kit", 
    description: "Development tools and licenses",
    items: ["Adobe Creative Suite", "Project Management Tool", "External Hard Drive"],
    estimatedCost: "$950",
    category: "Software & Licenses", 
    department: "Engineering",
    popular: true
  }
];

const forms = [
  { 
    name: "Standard Requisition Form", 
    category: "General", 
    description: "Standard form for all requisition requests",
    url: "https://example.com/standard-requisition.pdf",
    size: "245 KB",
    downloads: 12247,
    lastUpdated: "Jan 15, 2024",
    required: true
  },
  { 
    name: "Capital Expenditure Form", 
    category: "Finance", 
    description: "Required for purchases over $5,000",
    url: "https://example.com/capex-form.pdf",
    size: "189 KB",
    downloads: 3892,
    lastUpdated: "Jan 10, 2024",
    required: false
  },
  { 
    name: "Emergency Purchase Authorization", 
    category: "Urgent", 
    description: "Fast-track approval for critical needs",
    url: "https://example.com/emergency-form.pdf",
    size: "156 KB",
    downloads: 1234,
    lastUpdated: "Jan 8, 2024",
    required: false
  },
  { 
    name: "IT Security Compliance Form", 
    category: "Security", 
    description: "Security review for IT equipment",
    url: "https://example.com/security-form.pdf",
    size: "198 KB",
    downloads: 892,
    lastUpdated: "Jan 12, 2024",
    required: false
  }
];

// Compact Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-3xl" : "text-xl";
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-3 hover:shadow-md transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className={`p-1.5 rounded-xl ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'emerald' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'amber' ? 'bg-amber-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={16} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'emerald' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'amber' ? 'text-amber-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={12} className="text-emerald-500" />
            ) : (
              <TrendingUp size={12} className="text-red-500 rotate-180" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-0.5`}>
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

export default function NewRequisition() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [useCustomItem, setUseCustomItem] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    selectedItem: "",
    quantity: "",
    budgetCode: "",
    urgency: "",
    preferredSupplier: "",
    reason: "",
    attachment: null,
    estimatedCost: "",
    deliveryDate: "",
    department: "",
    businessJustification: "",
    alternativeOptions: "",
    environmentalImpact: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFormsModal, setShowFormsModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredForms, setFilteredForms] = useState(forms);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showBudgetInfo, setShowBudgetInfo] = useState(false);
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  
  // Dynamic budget data states - Updated for new JSON structure
  const [budgetCodes, setBudgetCodes] = useState([]);
  const [departmentBudgets, setDepartmentBudgets] = useState([]);
  const [requisitionHistory, setRequisitionHistory] = useState([]);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [budgetError, setBudgetError] = useState(null);

  const backendUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PROD
    : process.env.REACT_APP_BACKEND_URL_DEV;

  // Updated function to fetch departments and budget data with new JSON structure
  const fetchBudgetData = async () => {
    try {
      setIsLoadingBudgets(true);
      setBudgetError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch departments data with new structure
      const deptResponse = await fetch(`${API_BASE_URL}/api/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (deptResponse.ok) {
        const response = await deptResponse.json();
        const departments = response.data || response; // Handle both array and object responses
        
        setDepartmentBudgets(departments);
        
        // Transform department data from new JSON structure
        const budgetCodesFromDepts = departments.map(dept => {
          const budgetInfo = dept.budgetInfo || {};
          
          return {
            code: dept.departmentCode || budgetInfo.code || `${dept.name?.replace(/\s+/g, '').toUpperCase()}-Q1-2025`,
            department: dept.name || 'Unknown Department',
            remaining: `MWK ${(budgetInfo.remaining || (dept.budget || 0) - (dept.actualSpending || 0)).toLocaleString()}`,
            total: `MWK ${(budgetInfo.total || dept.budget || 0).toLocaleString()}`,
            actualSpending: dept.actualSpending || 0,
            budget: dept.budget || budgetInfo.total || 0,
            utilizationPercentage: budgetInfo.utilizationPercentage || 0,
            status: budgetInfo.status || dept.status || 'active',
            allocationStatus: budgetInfo.allocationStatus || 'allocated',
            period: budgetInfo.period || `${dept.budgetYear || new Date().getFullYear()}`,
            departmentId: dept._id,
            departmentHead: dept.departmentHead,
            headEmail: dept.headEmail,
            headPhone: dept.headPhone,
            location: dept.location,
            floor: dept.floor,
            building: dept.building,
            employeeCount: dept.employeeCount || 0,
            maxCapacity: dept.maxCapacity || 0,
            establishedDate: dept.establishedDate
          };
        });
        
        setBudgetCodes(budgetCodesFromDepts);
      } else {
        setBudgetError('Failed to fetch departments data');
        console.error('Failed to fetch departments:', deptResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      setBudgetError(error.message);
      
      // Fallback data with new structure format
      const fallbackBudgets = [
        {
          code: "MAT-827",
          department: "Mathematics",
          remaining: "MWK 60,000,000",
          total: "MWK 60,000,000",
          actualSpending: 0,
          budget: 60000000,
          utilizationPercentage: 0,
          status: "active",
          allocationStatus: "allocated",
          period: "2025"
        }
      ];
      setBudgetCodes(fallbackBudgets);
    } finally {
      setIsLoadingBudgets(false);
    }
  };

  // Fetch requisition history
  const fetchRequisitionHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/requisitions?limit=10&sort=createdAt&order=desc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedHistory = (data.data || []).map((req, index) => ({
          id: req.requisitionNumber || `REQ-2025-${String(index + 1).padStart(3, '0')}`,
          itemName: req.description || req.itemName || 'Unknown Item',
          quantity: req.quantity || 1,
          status: req.status || 'pending',
          date: req.createdAt ? new Date(req.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          budgetCode: req.budgetCode || 'N/A',
          amount: `MWK ${(req.estimatedCost || req.totalCost || 0).toLocaleString()}`,
          urgency: req.urgency || 'Medium',
          department: req.department || 'Unknown',
          approver: req.approver || 'Pending Assignment',
          deliveryDate: req.deliveryDate || null,
          category: req.category || 'General',
          rejectionReason: req.rejectionReason || null
        }));
        
        setRequisitionHistory(formattedHistory);
      } else {
        console.error('Failed to fetch requisition history:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching requisition history:', error);
      
      // Fallback to default history
      const defaultHistory = [
        { 
          id: "REQ-2025-001", 
          itemName: "MacBook Pro 16\" M3", 
          quantity: 5, 
          status: "approved", 
          date: "2025-01-15",
          budgetCode: "MAT-827",
          amount: "MWK 14,995",
          urgency: "Medium",
          department: "Mathematics",
          approver: "Legend",
          deliveryDate: "2025-01-20",
          category: "Computing Hardware"
        }
      ];
      setRequisitionHistory(defaultHistory);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Enhanced auto-save with better UX
  useEffect(() => {
    const saveDraft = debounce(() => {
      localStorage.setItem("requisitionDraft", JSON.stringify(formData));
      setIsDraftSaved(true);
      setTimeout(() => setIsDraftSaved(false), 3000);
    }, 1500);
    
    saveDraft();
    return () => saveDraft.cancel();
  }, [formData]);

  // Load draft on component mount and fetch dynamic data
  useEffect(() => {
    const savedDraft = localStorage.getItem("requisitionDraft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
    
    // Fetch dynamic data
    fetchBudgetData();
    fetchRequisitionHistory();
  }, []);

  // Calculate estimated total
  useEffect(() => {
    if (selectedItems.length > 0) {
      const total = selectedItems.reduce((sum, item) => {
        const cost = parseFloat(item.avgCost.replace(/[$,]/g, '')) || 0;
        return sum + (cost * item.quantity);
      }, 0);
      setEstimatedTotal(total);
    } else if (formData.estimatedCost) {
      setEstimatedTotal(parseFloat(formData.estimatedCost) || 0);
    }
  }, [selectedItems, formData.estimatedCost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (stepIndex) => {
    const errors = {};
    
   if (stepIndex === 0) {
  if (!useCustomItem) {
    if (!formData.category) {
      errors.category = "Category is required";
    }
    if (selectedItems.length === 0) {
      errors.selectedItem = "At least one item must be selected";
    }
  } else {
    if (!formData.itemName) {
      errors.itemName = "Item name is required";
    }
    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = "Valid quantity is required";
    }
  }
}

    if (stepIndex === 1) {
      if (!formData.budgetCode) errors.budgetCode = "Budget code is required";
      if (!formData.reason) errors.reason = "Business justification is required";
      if (!formData.department) errors.department = "Department is required";
      if (formData.reason.length < 20) errors.reason = "Please provide a detailed justification (minimum 20 characters)";
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFormData((prev) => ({ ...prev, attachment: acceptedFiles[0] }));
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    
    try {
      // Calculate the correct estimated cost
      let calculatedEstimatedCost = 0;
      
      if (useCustomItem) {
        // For custom items, use the manually entered cost
        if (formData.estimatedCost) {
          calculatedEstimatedCost = parseFloat(formData.estimatedCost.toString().replace(/[$,]/g, '')) || 0;
        }
      } else {
        // For catalog items, calculate from selected items
        calculatedEstimatedCost = selectedItems.reduce((sum, item) => {
          const cost = parseFloat(item.avgCost.replace(/[$,]/g, '')) || 0;
          return sum + (cost * item.quantity);
        }, 0);
      }

      // Prepare the data to match backend expectations
      const submissionData = {
        itemName: useCustomItem
          ? formData.itemName
          : selectedItems.map(item => item.name).join(', '),
        quantity: useCustomItem
          ? parseInt(formData.quantity) || 1
          : selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
        budgetCode: formData.budgetCode,
        urgency: formData.urgency || 'medium',
        preferredSupplier: formData.preferredSupplier || 'No preference',
        reason: formData.reason,
        category: useCustomItem 
          ? formData.category 
          : (selectedItems.length > 0 ? selectedItems[0].category : ''),
        estimatedCost: calculatedEstimatedCost,
        deliveryDate: formData.deliveryDate || null,
        department: formData.department,
        environmentalImpact: formData.environmentalImpact || 'No specific requirements'
      };

      // Validate required fields before sending
      if (!submissionData.itemName) {
        throw new Error('Item name is required');
      }
      if (!submissionData.budgetCode) {
        throw new Error('Budget code is required');
      }
      if (!submissionData.reason) {
        throw new Error('Business justification is required');
      }
      if (!submissionData.department) {
        throw new Error('Department is required');
      }
      if (submissionData.estimatedCost <= 0) {
        throw new Error('Estimated cost must be greater than 0');
      }

      console.log('Submitting data:', submissionData); // Debug log

      // API call to backend
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${backendUrl}/api/requisitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Submission failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Submission successful:', result); // Debug log
      
      // Handle successful submission
      setShowConfirmation(false);
      setShowSuccessModal(true);
      localStorage.removeItem("requisitionDraft");
      
      // Reset form
      setFormData({
        itemName: "",
        category: "",
        selectedItem: "",
        quantity: "",
        budgetCode: "",
        urgency: "",
        preferredSupplier: "",
        reason: "",
        attachment: null,
        estimatedCost: "",
        deliveryDate: "",
        department: "",
        businessJustification: "",
        alternativeOptions: "",
        environmentalImpact: ""
      });
      setSelectedItems([]);
      setActiveStep(0);
      setUseCustomItem(false);

      // Refresh data after successful submission
      fetchBudgetData();
      fetchRequisitionHistory();

    } catch (error) {
      console.error('Submission error:', error);
      setValidationErrors(prev => ({
        ...prev,
        submission: error.message || "Failed to submit requisition. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      category: template.category,
      department: template.department,
      estimatedCost: template.estimatedCost.replace('$', '').replace(',', '')
    }));
    setShowTemplates(false);
  };

  const handleItemSelect = (item, category) => {
  const newItem = {
    ...item,
    category: category.name,
    categoryColor: category.color,
    quantity: 1,
    id: Date.now()
  };
  
  // Ensure category is set when adding an item
  setFormData(prev => ({ 
    ...prev, 
    category: category.name 
  }));
  
  setSelectedItems(prev => [...prev, newItem]);
};
  const updateItemQuantity = (itemId, quantity) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: parseInt(quantity) || 1 } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'rejected': return <X size={12} />;
      default: return <AlertCircle size={12} />;
    }
  };

  // Updated function to get budget info with new JSON structure
  const getBudgetInfo = (code) => {
    const budget = budgetCodes.find(budget => budget.code === code);
    if (!budget) return null;
    
    return {
      ...budget,
      remaining: budget.budget - budget.actualSpending,
      utilizationPercentage: budget.budget > 0 ? ((budget.actualSpending / budget.budget) * 100) : 0,
      isHealthy: budget.budget > 0 ? ((budget.budget - budget.actualSpending) / budget.budget) > 0.25 : false
    };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const refreshBudgetData = () => {
    fetchBudgetData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate("/employee-dash")}
              className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-blue-500 rounded-xl text-white">
                  <Sparkles size={20} />
                </div>
                New Requisition Request
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isDraftSaved && (
              <div className="flex items-center text-emerald-600 text-sm bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200">
                <Save size={14} className="mr-1" />
                Draft saved
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowTemplates(true)}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
              >
                <Star size={14} className="mr-1" />
                Templates
              </button>
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm font-medium border border-gray-200"
              >
                {isLoadingHistory ? (
                  <Loader size={14} className="mr-1 animate-spin" />
                ) : (
                  <History size={14} className="mr-1" />
                )}
                History
              </button>
              <button 
                onClick={refreshBudgetData}
                disabled={isLoadingBudgets}
                className="px-3 py-1.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm font-medium border border-gray-200"
              >
                <RefreshCw size={14} className={isLoadingBudgets ? "mr-1 animate-spin" : "mr-1"} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 space-y-3">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
          {/* Main Form - 3 columns */}
          <div className="xl:col-span-3">
            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {steps[activeStep].icon}
                    {steps[activeStep].title}
                  </h3>
                  {estimatedTotal > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-2 py-1">
                      <span className="text-sm text-blue-600 font-medium">
                        Estimated Total: MWK {estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                {/* Step 1: Item Selection */}
                {activeStep === 0 && (
                  <div className="space-y-4">
                    {/* Template Quick Access */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-blue-900 text-sm">Quick Start Templates</h4>
                          <p className="text-blue-700 text-xs">Pre-configured packages for common requests</p>
                        </div>
                        <button
                          onClick={() => setShowTemplates(true)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-xs font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {templates.filter(t => t.popular).slice(0, 2).map((template, index) => (
                          <button
                            key={index}
                            onClick={() => handleTemplateSelect(template)}
                            className="p-2 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors duration-200 text-left"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-bold text-blue-900 text-xs">{template.name}</h5>
                              <Award size={12} className="text-amber-500" />
                            </div>
                            <p className="text-xs text-blue-600 mb-1">{template.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-500">{template.items.length} items</span>
                              <span className="font-bold text-blue-900 text-xs">{template.estimatedCost}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Item Toggle */}
                    <div className="flex items-center p-2 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="checkbox"
                        id="customItem"
                        checked={useCustomItem}
                        onChange={(e) => setUseCustomItem(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="customItem" className="ml-2 text-sm font-medium text-gray-900">
                        Request custom item not in our catalog
                      </label>
                      <div className="ml-auto">
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                          May require additional approval time
                        </span>
                      </div>
                    </div>

                    {useCustomItem ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm">
                          <Package size={16} />
                          Custom Item Request
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Item Name & Description
                            </label>
                            <textarea
                              name="itemName"
                              value={formData.itemName}
                              onChange={handleChange}
                              rows={3}
                              className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm ${
                                validationErrors.itemName ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Provide detailed description of the custom item including specifications, model numbers, etc."
                            />
                            {validationErrors.itemName && (
                              <p className="mt-1 text-xs text-red-600">{validationErrors.itemName}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estimated Unit Cost (MWK)
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400 text-sm">MWK</span>
                                <input
                                  type="number"
                                  name="estimatedCost"
                                  value={formData.estimatedCost}
                                  onChange={handleChange}
                                  className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity Needed
                              </label>
                              <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                                  validationErrors.quantity ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="1"
                              />
                              {validationErrors.quantity && (
                                <p className="mt-1 text-xs text-red-600">{validationErrors.quantity}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Category Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Category
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {categories.map((category) => (
                              <button
                                key={category.name}
                                type="button"
                                onClick={() => setFormData(prev => ({ 
                                  ...prev, 
                                  category: category.name,
                                  selectedItem: ""
                                }))}
                                className={`p-3 border-2 rounded-2xl transition-all duration-200 text-left hover:shadow-sm ${
                                  formData.category === category.name
                                    ? `border-${category.color}-500 bg-${category.color}-50`
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className={`p-1.5 rounded-xl ${
                                    formData.category === category.name 
                                      ? `bg-${category.color}-100 text-${category.color}-600` 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {category.icon}
                                  </div>
                                  {formData.category === category.name && (
                                    <CheckCircle size={16} className={`text-${category.color}-600`} />
                                  )}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-0.5 text-sm">
                                  {category.name}
                                </h3>
                                <p className="text-xs text-gray-600">
                                  {category.items.length} items available
                                </p>
                              </button>
                            ))}
                          </div>
                          {validationErrors.category && (
                            <p className="mt-1 text-xs text-red-600">{validationErrors.category}</p>
                          )}
                        </div>

                        {/* Item Selection */}
                        {formData.category && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700">
                                Select Items from {formData.category}
                              </label>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {selectedItems.length} items selected
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                              {categories
                                .find(cat => cat.name === formData.category)
                                ?.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="border border-gray-200 rounded-2xl p-2 hover:shadow-sm transition-shadow duration-200 bg-white"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <div className="p-1.5 bg-gray-100 rounded-xl">
                                          {item.icon}
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-gray-900 text-xs">{item.name}</h4>
                                          <p className="text-xs text-gray-500">{item.avgCost}</p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedItemDetails(item)}
                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                      >
                                        <Eye size={12} />
                                      </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                      <span>Lead time: {item.leadTime}</span>
                                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                                        In Stock
                                      </span>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={() => handleItemSelect(item, categories.find(cat => cat.name === formData.category))}
                                      className="w-full px-2 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-xs font-medium"
                                    >
                                      Add to Request
                                    </button>
                                  </div>
                                ))}
                            </div>

                            {/* Selected Items Summary */}
                            {selectedItems.length > 0 && (
                              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                                  <Layers size={16} />
                                  Selected Items ({selectedItems.length})
                                </h4>
                                <div className="space-y-2">
                                  {selectedItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-blue-200">
                                      <div className="flex items-center space-x-2">
                                        <div className={`p-1.5 bg-${item.categoryColor}-100 rounded-xl`}>
                                          {item.icon}
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-gray-900 text-xs">{item.name}</h5>
                                          <p className="text-xs text-gray-500">{item.category}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                          <label className="text-xs text-gray-600">Qty:</label>
                                          <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                                            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-center text-xs"
                                          />
                                        </div>
                                        <span className="font-medium text-gray-900 text-xs">
                                          MWK {(parseFloat(item.avgCost.replace(/[$,]/g, '')) * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => removeItem(item.id)}
                                          className="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                                        >
                                          <X size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 pt-2 border-t border-blue-200">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-blue-900 text-sm">Estimated Total:</span>
                                    <span className="text-lg font-bold text-blue-900">
                                      MWK {estimatedTotal.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {validationErrors.selectedItem && (
                              <p className="mt-1 text-xs text-red-600">{validationErrors.selectedItem}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Request Details */}
                {activeStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-3">
                        {/* Budget Information - Updated for new JSON structure */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                              Budget Code
                            </label>
                            {isLoadingBudgets && (
                              <Loader size={12} className="text-blue-500 animate-spin" />
                            )}
                          </div>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <select
                              name="budgetCode"
                              value={formData.budgetCode}
                              onChange={(e) => {
                                handleChange(e);
                                setShowBudgetInfo(true);
                              }}
                              disabled={isLoadingBudgets}
                              className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                                validationErrors.budgetCode ? 'border-red-300' : 'border-gray-300'
                              } ${isLoadingBudgets ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <option value="">Select Budget Code</option>
                              {budgetCodes.map((budget) => (
                                <option key={budget.code} value={budget.code}>
                                  {budget.code} - {budget.department}
                                </option>
                              ))}
                            </select>
                          </div>
                          {validationErrors.budgetCode && (
                            <p className="mt-1 text-xs text-red-600">{validationErrors.budgetCode}</p>
                          )}
                          
                          {budgetError && (
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl">
                              <div className="flex items-center gap-1 text-amber-800 text-xs">
                                <AlertTriangle size={10} />
                                Budget data connection issue - using cached data
                              </div>
                            </div>
                          )}
                          
                          {/* Budget Info Display - Enhanced for new structure */}
                          {formData.budgetCode && getBudgetInfo(formData.budgetCode) && (
                            <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-emerald-900">Budget Status</span>
                                <div className="flex items-center space-x-1">
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    getBudgetInfo(formData.budgetCode).status === 'active' 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {getBudgetInfo(formData.budgetCode).status?.toUpperCase() || 'ACTIVE'}
                                  </span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    getBudgetInfo(formData.budgetCode).allocationStatus === 'allocated' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {getBudgetInfo(formData.budgetCode).allocationStatus?.toUpperCase() || 'ALLOCATED'}
                                  </span>
                                </div>
                              </div>
                              {(() => {
                                const budget = getBudgetInfo(formData.budgetCode);
                                const remaining = budget.remaining;
                                const total = budget.budget;
                                const percentage = total > 0 ? (remaining / total) * 100 : 0;
                                return (
                                  <div>
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-emerald-700">Remaining: MWK {remaining.toLocaleString()}</span>
                                      <span className="text-emerald-600">Total: MWK {total.toLocaleString()}</span>
                                    </div>
                                    <div className="mt-1 w-full bg-emerald-200 rounded-full h-1.5">
                                      <div 
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                          percentage > 50 ? 'bg-emerald-500' :
                                          percentage > 25 ? 'bg-amber-500' :
                                          'bg-red-500'
                                        }`}
                                        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                                      ></div>
                                    </div>
                                    {budget.period && (
                                      <div className="mt-1 text-xs text-emerald-600">
                                        Budget Period: {budget.period}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Department - Updated for new JSON structure */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Requesting Department
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <select
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                                validationErrors.department ? 'border-red-300' : 'border-gray-300'
                              }`}
                            >
                              <option value="">Select Department</option>
                              {budgetCodes.map((budget) => (
                                <option key={budget.department} value={budget.department}>
                                  {budget.department}
                                </option>
                              ))}
                            </select>
                          </div>
                          {validationErrors.department && (
                            <p className="mt-1 text-xs text-red-600">{validationErrors.department}</p>
                          )}
                        </div>

                        {/* Urgency Level */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority Level
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { level: 'low', label: 'Low', color: 'emerald', desc: '2-4 weeks' },
                              { level: 'medium', label: 'Medium', color: 'amber', desc: '1-2 weeks' },
                              { level: 'high', label: 'High', color: 'red', desc: '1-3 days' }
                            ].map(({ level, label, color, desc }) => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                                className={`p-2 border-2 rounded-xl transition-all duration-200 text-center ${
                                  formData.urgency === level
                                    ? `border-${color}-500 bg-${color}-50`
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`font-bold text-sm ${
                                  formData.urgency === level ? `text-${color}-700` : 'text-gray-900'
                                }`}>
                                  {label}
                                </div>
                                <div className={`text-xs mt-0.5 ${
                                  formData.urgency === level ? `text-${color}-600` : 'text-gray-500'
                                }`}>
                                  {desc}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        {/* Required Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Required Delivery Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="date"
                              name="deliveryDate"
                              value={formData.deliveryDate}
                              onChange={handleChange}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Leave blank if no specific date required
                          </p>
                        </div>

                        {/* Preferred Supplier */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Supplier (Optional)
                          </label>
                          <div className="relative">
                            <Truck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              name="preferredSupplier"
                              value={formData.preferredSupplier}
                              onChange={handleChange}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Enter supplier name or 'No preference'"
                            />
                          </div>
                        </div>

                        {/* Environmental Impact */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Environmental Considerations
                          </label>
                          <div className="space-y-1">
                            {[
                              'Energy efficient options preferred',
                              'Sustainable/recycled materials',
                              'Local supplier preference',
                              'No specific requirements'
                            ].map((option, index) => (
                              <label key={index} className="flex items-center">
                                <input
                                  type="radio"
                                  name="environmentalImpact"
                                  value={option}
                                  checked={formData.environmentalImpact === option}
                                  onChange={handleChange}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Justification */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Justification *
                      </label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm ${
                          validationErrors.reason ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Explain why this item is needed, how it will be used, and the business impact of not having it. Include any relevant project details or deadlines."
                      />
                      <div className="mt-1 flex items-center justify-between">
                        {validationErrors.reason ? (
                          <p className="text-xs text-red-600">{validationErrors.reason}</p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Provide detailed justification (minimum 20 characters)
                          </p>
                        )}
                        <span className={`text-xs ${
                          formData.reason.length >= 20 ? 'text-emerald-600' : 'text-gray-400'
                        }`}>
                          {formData.reason.length}/20
                        </span>
                      </div>
                    </div>

                    {/* Alternative Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternative Options Considered (Optional)
                      </label>
                      <textarea
                        name="alternativeOptions"
                        value={formData.alternativeOptions}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                        placeholder="Describe any alternative solutions you've considered and why this option is preferred."
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supporting Documents (Optional)
                      </label>
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors duration-200 ${
                          isDragActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-1 font-medium text-sm">
                          {isDragActive 
                            ? "Drop files here..." 
                            : "Drag and drop files here, or click to browse"
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, Word, Excel, or images up to 10MB
                        </p>
                      </div>
                      {formData.attachment && (
                        <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Paperclip size={14} className="text-emerald-600" />
                              <div>
                                <span className="text-sm font-medium text-emerald-900">
                                  {formData.attachment.name}
                                </span>
                                <p className="text-xs text-emerald-700">
                                  {Math.round(formData.attachment.size / 1024)} KB • Uploaded successfully
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, attachment: null }))}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors duration-200"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {activeStep === 2 && (
                  <div className="space-y-4">
                    {/* Request Summary Header */}
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <h4 className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
                        <Eye size={18} />
                        Request Summary
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Please review all information carefully before submitting your requisition request.
                      </p>
                    </div>

                    {/* Items Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3">
                      <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                        <Package size={16} />
                        Requested Items
                      </h5>
                      
                      {useCustomItem ? (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl">
                          <div className="flex items-start justify-between">
                            <div>
                              <h6 className="font-medium text-amber-900 text-sm">Custom Item Request</h6>
                              <p className="text-amber-800 mt-1 text-sm">{formData.itemName}</p>
                              <div className="mt-1 flex items-center space-x-4 text-xs">
                                <span className="text-amber-700">Quantity: {formData.quantity}</span>
                                {formData.estimatedCost && (
                                  <span className="text-amber-700">Est. Cost: MWK {formData.estimatedCost}</span>
                                )}
                              </div>
                            </div>
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                              Custom
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="flex items-center space-x-2">
                                <div className={`p-1.5 bg-${item.categoryColor}-100 rounded-xl`}>
                                  {item.icon}
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-900 text-sm">{item.name}</h6>
                                  <p className="text-xs text-gray-600">{item.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900 text-sm">
                                  {item.quantity} × {item.avgCost}
                                </p>
                                <p className="text-xs font-bold text-blue-600">
                                  MWK {(parseFloat(item.avgCost.replace(/[$,]/g, '')) * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900 text-sm">Total Estimated Cost:</span>
                              <span className="text-lg font-bold text-blue-600">
                                MWK {estimatedTotal.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Request Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {/* Left Column - Basic Info */}
                      <div className="bg-white border border-gray-200 rounded-xl p-3">
                        <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                          <FileText size={16} />
                          Request Details
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-1 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-500">Department</span>
                            <span className="text-xs font-medium text-gray-900">{formData.department}</span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-500">Budget Code</span>
                            <div className="text-right">
                              <span className="text-xs font-medium text-gray-900">{formData.budgetCode}</span>
                              <button
                                onClick={() => copyToClipboard(formData.budgetCode)}
                                className="ml-1 p-0.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                              >
                                <Copy size={10} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-500">Priority Level</span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              formData.urgency === 'high' 
                                ? 'bg-red-100 text-red-800'
                                : formData.urgency === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {formData.urgency ? formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1) : 'Not specified'}
                            </span>
                          </div>
                          {formData.deliveryDate && (
                            <div className="flex items-center justify-between py-1 border-b border-gray-100">
                              <span className="text-xs font-medium text-gray-500">Required Date</span>
                              <span className="text-xs font-medium text-gray-900">
                                {new Date(formData.deliveryDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                          {formData.preferredSupplier && (
                            <div className="flex items-center justify-between py-1 border-b border-gray-100">
                              <span className="text-xs font-medium text-gray-500">Preferred Supplier</span>
                              <span className="text-xs font-medium text-gray-900">{formData.preferredSupplier}</span>
                            </div>
                          )}
                          {formData.environmentalImpact && (
                            <div className="flex items-center justify-between py-1">
                              <span className="text-xs font-medium text-gray-500">Environmental Preference</span>
                              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {formData.environmentalImpact}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column - Budget Info - Enhanced for new structure */}
                      <div className="bg-white border border-gray-200 rounded-xl p-3">
                        <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                          <CreditCard size={16} />
                          Budget Information
                        </h5>
                        {getBudgetInfo(formData.budgetCode) && (
                          <div className="space-y-2">
                            {(() => {
                              const budget = getBudgetInfo(formData.budgetCode);
                              const remaining = budget.remaining;
                              const total = budget.budget;
                              const afterPurchase = remaining - estimatedTotal;
                              const percentage = total > 0 ? (remaining / total) * 100 : 0;
                              const afterPercentage = total > 0 ? (afterPurchase / total) * 100 : 0;
                              
                              return (
                                <>
                                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-emerald-900">Current Budget Status</span>
                                      <div className="flex items-center space-x-1">
                                        <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                          {percentage.toFixed(1)}% Available
                                        </span>
                                        {budget.status && (
                                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                                            budget.status === 'active' 
                                              ? 'bg-blue-100 text-blue-800' 
                                              : 'bg-gray-100 text-gray-800'
                                          }`}>
                                            {budget.status.toUpperCase()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <span className="text-emerald-700">Available:</span>
                                        <span className="ml-1 font-bold">MWK {remaining.toLocaleString()}</span>
                                      </div>
                                      <div>
                                        <span className="text-emerald-700">Total Budget:</span>
                                        <span className="ml-1 font-bold">MWK {total.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="mt-1 w-full bg-emerald-200 rounded-full h-1.5">
                                      <div 
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                          percentage > 50 ? 'bg-emerald-500' :
                                          percentage > 25 ? 'bg-amber-500' :
                                          'bg-red-500'
                                        }`}
                                        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                                      ></div>
                                    </div>
                                    {budget.period && (
                                      <div className="mt-1 text-xs text-emerald-600">
                                        Budget Period: {budget.period}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-blue-900">After This Purchase</span>
                                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                                        afterPercentage >= 0 
                                          ? 'bg-blue-100 text-blue-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {afterPercentage >= 0 ? `${afterPercentage.toFixed(1)}% Remaining` : 'Over Budget'}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <span className="text-blue-700">Request Cost:</span>
                                        <span className="ml-1 font-bold">MWK {estimatedTotal.toLocaleString()}</span>
                                      </div>
                                      <div>
                                        <span className="text-blue-700">Remaining:</span>
                                        <span className={`ml-1 font-bold ${
                                          afterPurchase >= 0 ? 'text-blue-900' : 'text-red-600'
                                        }`}>
                                          MWK {afterPurchase.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                    {afterPurchase < 0 && (
                                      <div className="mt-1 p-1.5 bg-red-100 border border-red-200 rounded text-xs text-red-800">
                                        ⚠️ This request exceeds available budget. Additional approval may be required.
                                      </div>
                                    )}
                                  </div>

                                  {/* Additional Department Info */}
                                  {(budget.departmentHead || budget.location) && (
                                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-xl">
                                      <h6 className="text-xs font-medium text-gray-900 mb-1">Department Details</h6>
                                      <div className="space-y-0.5 text-xs text-gray-600">
                                        {budget.departmentHead && (
                                          <div className="flex items-center justify-between">
                                            <span>Department Head:</span>
                                            <span className="font-medium">{budget.departmentHead}</span>
                                          </div>
                                        )}
                                        {budget.location && (
                                          <div className="flex items-center justify-between">
                                            <span>Location:</span>
                                            <span className="font-medium">{budget.location}</span>
                                          </div>
                                        )}
                                        {budget.employeeCount !== undefined && (
                                          <div className="flex items-center justify-between">
                                            <span>Employees:</span>
                                            <span className="font-medium">{budget.employeeCount}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Justification & Additional Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3">
                      <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                        <MessageSquare size={16} />
                        Business Justification
                      </h5>
                      <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-800 leading-relaxed text-sm">{formData.reason}</p>
                      </div>
                      
                      {formData.alternativeOptions && (
                        <div className="mt-2">
                          <h6 className="font-medium text-gray-900 mb-1 text-sm">Alternative Options Considered</h6>
                          <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-gray-800 leading-relaxed text-sm">{formData.alternativeOptions}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Attachments */}
                    {formData.attachment && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3">
                        <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                          <Paperclip size={16} />
                          Supporting Documents
                        </h5>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center space-x-2">
                            <FileText size={14} className="text-blue-600" />
                            <div>
                              <span className="text-sm font-medium text-gray-900">{formData.attachment.name}</span>
                              <p className="text-xs text-gray-500">
                                {Math.round(formData.attachment.size / 1024)} KB • {formData.attachment.type}
                              </p>
                            </div>
                          </div>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Validation Errors */}
                    {validationErrors.submission && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertTriangle size={16} />
                          <span className="font-medium text-sm">Submission Error</span>
                        </div>
                        <p className="text-red-700 mt-1 text-sm">{validationErrors.submission}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Form Actions */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  disabled={activeStep === 0}
                  className="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                
                <div className="flex space-x-2">
                  {activeStep === steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setShowConfirmation(true)}
                      disabled={isSubmitting}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Submit Request
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 font-medium text-sm"
                    >
                      Continue
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-3">
            {/* Budget Insights - Enhanced for new structure */}
            {formData.budgetCode && getBudgetInfo(formData.budgetCode) && (
              <div className="bg-white rounded-2xl border border-gray-200 p-3">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <BarChart3 size={16} className="text-emerald-500" />
                  Budget Status
                </h3>
                
                {(() => {
                  const budget = getBudgetInfo(formData.budgetCode);
                  const remaining = budget.remaining;
                  const total = budget.budget;
                  const percentage = total > 0 ? (remaining / total) * 100 : 0;
                  
                  return (
                    <div className="space-y-2">
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-emerald-900">Budget Health</span>
                          <div className="flex items-center space-x-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              percentage > 50 ? 'bg-emerald-100 text-emerald-800' :
                              percentage > 25 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {percentage > 50 ? 'Healthy' : percentage > 25 ? 'Moderate' : 'Critical'}
                            </span>
                            {budget.allocationStatus && (
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                budget.allocationStatus === 'allocated' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {budget.allocationStatus.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-emerald-200 rounded-full h-1.5 mb-1">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              percentage > 50 ? 'bg-emerald-500' :
                              percentage > 25 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-emerald-700">
                          MWK {remaining.toLocaleString()} of MWK {total.toLocaleString()} remaining
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <p>• Budget year: {budget.period || new Date().getFullYear()}</p>
                        <p>• Utilization: {budget.utilizationPercentage?.toFixed(1) || '0.0'}%</p>
                        {estimatedTotal > 0 && (
                          <p>• This request uses {((estimatedTotal / total) * 100).toFixed(1)}% of total budget</p>
                        )}
                        {budget.departmentHead && (
                          <p>• Approver: {budget.departmentHead}</p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Help & Support */}
            <div className="bg-purple-50 rounded-2xl border border-purple-200 p-3">
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <BookOpen size={16} className="text-purple-500" />
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Get assistance with your requisition or learn about procurement policies.
              </p>
              
              <div className="space-y-1">
                <button className="w-full text-left px-2 py-1.5 text-sm text-purple-700 hover:bg-purple-100 rounded-xl transition-colors duration-200 flex items-center gap-2">
                  <BookOpen size={12} />
                  Guidelines
                </button>
                <button className="w-full text-left px-2 py-1.5 text-sm text-purple-700 hover:bg-purple-100 rounded-xl transition-colors duration-200 flex items-center gap-2">
                  <MessageSquare size={12} />
                  Live Chat
                </button>
                <button className="w-full text-left px-2 py-1.5 text-sm text-purple-700 hover:bg-purple-100 rounded-xl transition-colors duration-200 flex items-center gap-2">
                  <Phone size={12} />
                  Call Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      
      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Star size={18} className="text-amber-500" />
                    Quick Start Templates
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Pre-configured packages for common business needs</p>
                </div>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-3 hover:shadow-md transition-shadow duration-200 cursor-pointer relative"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {template.popular && (
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">
                        POPULAR
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1 text-sm">
                          {template.name}
                        </h3>
                        <p className="text-gray-600 text-xs">{template.description}</p>
                      </div>
                      <div className="ml-3 text-right">
                        <div className="text-lg font-bold text-emerald-600">{template.estimatedCost}</div>
                        <div className="text-xs text-gray-500">{template.items.length} items</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">Includes:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {template.items.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              {item}
                            </span>
                          ))}
                          {template.items.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{template.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Building size={10} />
                          <span>{template.department}</span>
                        </div>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-xs font-medium">
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <History size={18} className="text-blue-500" />
                    Requisition History
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Track all your previous requests and their status</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={fetchRequisitionHistory}
                    disabled={isLoadingHistory}
                    className="px-2 py-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                  >
                    <RefreshCw size={12} className={isLoadingHistory ? "animate-spin" : ""} />
                    Refresh
                  </button>
                  <button className="px-2 py-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 text-sm font-medium flex items-center gap-1">
                    <Filter size={12} />
                    Filter
                  </button>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader size={28} className="animate-spin text-gray-400" />
                  <span className="ml-3 text-gray-600">Loading history...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {requisitionHistory.map((req) => (
                    <div key={req.id} className="border border-gray-200 rounded-2xl p-3 hover:shadow-sm transition-shadow duration-200 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-sm">{req.itemName}</h3>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(req.status)}`}>
                              {getStatusIcon(req.status)}
                              <span className="ml-1">{req.status}</span>
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs mb-2">
                            <div className="bg-blue-50 rounded-xl p-1.5">
                              <span className="text-blue-600 font-medium text-xs">Request ID</span>
                              <p className="font-bold text-blue-900 text-xs">{req.id}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-1.5">
                              <span className="text-gray-600 font-medium text-xs">Quantity</span>
                              <p className="font-bold text-gray-900 text-xs">{req.quantity}</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-1.5">
                              <span className="text-emerald-600 font-medium text-xs">Amount</span>
                              <p className="font-bold text-emerald-900 text-xs">{req.amount}</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-1.5">
                              <span className="text-purple-600 font-medium text-xs">Department</span>
                              <p className="font-bold text-purple-900 text-xs">{req.department}</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-1.5">
                              <span className="text-amber-600 font-medium text-xs">Priority</span>
                              <p className="font-bold text-amber-900 text-xs">{req.urgency}</p>
                            </div>
                            <div className="bg-indigo-50 rounded-xl p-1.5">
                              <span className="text-indigo-600 font-medium text-xs">Submitted</span>
                              <p className="font-bold text-indigo-900 text-xs">{req.date}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <span>Budget: {req.budgetCode}</span>
                              <span>Approver: {req.approver}</span>
                              {req.deliveryDate && <span>Expected: {req.deliveryDate}</span>}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                                <Eye size={12} />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                                <Copy size={12} />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                                <MoreVertical size={12} />
                              </button>
                            </div>
                          </div>
                          
                          {req.rejectionReason && (
                            <div className="mt-2 p-1.5 bg-red-50 border border-red-200 rounded-xl">
                              <div className="flex items-center gap-1 text-red-800 text-xs font-medium mb-1">
                                <AlertCircle size={10} />
                                Rejection Reason
                              </div>
                              <p className="text-red-700 text-xs">{req.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forms Modal */}
      {showFormsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-amber-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Download size={18} className="text-amber-500" />
                    Download Forms & Documents
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Access all required forms and supporting documentation</p>
                </div>
                <button
                  onClick={() => setShowFormsModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search forms and documents..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFilteredForms(forms.filter(form => 
                        form.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        form.category.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        form.description.toLowerCase().includes(e.target.value.toLowerCase())
                      ));
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
                {filteredForms.map((form, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-3 hover:shadow-md transition-shadow duration-200 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-1.5 bg-blue-100 rounded-xl">
                        <FileText size={18} className="text-blue-600" />
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          form.required 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {form.category}
                        </span>
                        {form.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-medium">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">
                      {form.name}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2">{form.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center gap-1">
                          <FileText size={8} />
                          {form.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download size={8} />
                          {form.downloads.toLocaleString()}
                        </span>
                      </div>
                      <span>Updated {form.lastUpdated}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(form.url, "_blank")}
                        className="flex-1 flex items-center justify-center px-2 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-xs font-medium"
                      >
                        <Download size={12} className="mr-1" />
                        Download
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredForms.length === 0 && (
                <div className="text-center py-8">
                  <FileText size={36} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">No forms found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search terms or browse all categories.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center w-14 h-14 mx-auto bg-blue-500 rounded-2xl mb-3">
                <Send size={20} className="text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Submit Requisition Request?
              </h3>
              <div className="text-gray-600 mb-4 space-y-2">
                <p className="text-sm">You're about to submit a requisition request for:</p>
                <div className="bg-blue-50 rounded-xl p-2 border border-blue-200">
                  <div className="font-bold text-blue-900 text-sm">
                    {useCustomItem ? formData.itemName : selectedItems.map(item => item.name).join(', ')}
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Estimated Total: MWK {estimatedTotal.toLocaleString()}
                  </div>
                </div>
                <p className="text-xs">This action cannot be undone once submitted.</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                >
                  Review Again
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium text-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Confirm & Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-emerald-500 rounded-2xl mb-3">
                <CheckCircle size={28} className="text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Request Submitted Successfully! 🎉
              </h3>
              <div className="text-gray-600 mb-4 space-y-2">
                <p className="text-sm">Your requisition has been successfully submitted and assigned tracking number:</p>
                <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-200">
                  <div className="text-lg font-bold text-emerald-900 font-mono">
                    REQ-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}
                  </div>
                </div>
                <div className="text-xs space-y-0.5">
                  <p>✅ Department manager will be notified</p>
                  <p>✅ Procurement team will begin sourcing</p>
                  <p>✅ You'll receive email updates on progress</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/employee-dash");
                  }}
                  className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    // Reset form for new requisition
                    setFormData({
                      itemName: "",
                      category: "",
                      selectedItem: "",
                      quantity: "",
                      budgetCode: "",
                      urgency: "",
                      preferredSupplier: "",
                      reason: "",
                      attachment: null,
                      estimatedCost: "",
                      deliveryDate: "",
                      department: "",
                      businessJustification: "",
                      alternativeOptions: "",
                      environmentalImpact: ""
                    });
                    setSelectedItems([]);
                    setActiveStep(0);
                    setUseCustomItem(false);
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                >
                  Create Another Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItemDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Item Details</h3>
                <button
                  onClick={() => setSelectedItemDetails(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    {selectedItemDetails.icon}
                  </div>
                  <h4 className="font-bold text-gray-900">{selectedItemDetails.name}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <span className="text-gray-600 font-medium text-xs">Average Cost</span>
                    <p className="font-bold text-gray-900 text-sm">{selectedItemDetails.avgCost}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <span className="text-gray-600 font-medium text-xs">Lead Time</span>
                    <p className="font-bold text-gray-900 text-sm">{selectedItemDetails.leadTime}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-2 border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-1 text-sm">Specifications</h5>
                  <ul className="text-xs text-blue-800 space-y-0.5">
                    <li>• Standard business quality</li>
                    <li>• Warranty included</li>
                    <li>• Compatible with existing systems</li>
                    <li>• Energy efficient design</li>
                  </ul>
                </div>
                
                <button
                  onClick={() => {
                    const selectedCategory = categories.find(cat => 
                      cat.items.some(item => item.name === selectedItemDetails.name)
                    );
                    handleItemSelect(selectedItemDetails, selectedCategory);
                    setSelectedItemDetails(null);
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                >
                  Add to Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
