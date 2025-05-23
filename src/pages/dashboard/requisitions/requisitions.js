import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Tag,
  History,
  FileText,
  Truck,
  Paperclip,
  Search,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Sparkles,
  Settings,
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
  Filter,
  MoreVertical,
  Zap,
  Shield,
  TrendingUp,
  Bell,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Copy,
  RefreshCw,
  FileCheck,
  Layers,
  Target,
  Award,
  BarChart3,
  Globe,
  Lock,
  Cpu,
  Wifi,
  Monitor,
  Smartphone,
  Headphones,
  Camera,
  Database,
  HardDrive,
  Server,
  Router,
  Printer,
  Keyboard,
  Mouse,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { debounce } from "lodash";

const steps = [
  { 
    id: 1, 
    title: "Item Selection", 
    description: "Choose from catalog or specify custom items",
    icon: <Package size={20} />
  },
  { 
    id: 2, 
    title: "Request Details", 
    description: "Provide budget, timeline, and justification",
    icon: <FileText size={20} />
  },
  { 
    id: 3, 
    title: "Review & Submit", 
    description: "Verify information and submit for approval",
    icon: <Shield size={20} />
  }
];

const categories = [
  { 
    name: "Computing Hardware", 
    icon: <Monitor size={20} />,
    color: "blue",
    items: [
      { name: "Laptop", icon: <Monitor size={16} />, avgCost: "$1,200", leadTime: "3-5 days" },
      { name: "Desktop Computer", icon: <Cpu size={16} />, avgCost: "$800", leadTime: "2-4 days" },
      { name: "Tablet", icon: <Smartphone size={16} />, avgCost: "$600", leadTime: "1-3 days" },
      { name: "Monitor", icon: <Monitor size={16} />, avgCost: "$300", leadTime: "1-2 days" },
      { name: "Keyboard", icon: <Keyboard size={16} />, avgCost: "$150", leadTime: "1-2 days" },
      { name: "Mouse", icon: <Mouse size={16} />, avgCost: "$80", leadTime: "1-2 days" }
    ]
  },
  { 
    name: "Office Equipment", 
    icon: <FileText size={20} />,
    color: "green",
    items: [
      { name: "Printer", icon: <Printer size={16} />, avgCost: "$400", leadTime: "2-3 days" },
      { name: "Scanner", icon: <Camera size={16} />, avgCost: "$250", leadTime: "2-3 days" },
      { name: "Projector", icon: <Monitor size={16} />, avgCost: "$800", leadTime: "3-5 days" },
      { name: "Whiteboard", icon: <FileText size={16} />, avgCost: "$200", leadTime: "1-2 days" },
      { name: "Shredder", icon: <FileText size={16} />, avgCost: "$150", leadTime: "1-2 days" }
    ]
  },
  { 
    name: "Furniture & Workspace", 
    icon: <Building size={20} />,
    color: "purple",
    items: [
      { name: "Office Chair", icon: <Building size={16} />, avgCost: "$350", leadTime: "5-7 days" },
      { name: "Standing Desk", icon: <Building size={16} />, avgCost: "$600", leadTime: "7-10 days" },
      { name: "Filing Cabinet", icon: <Building size={16} />, avgCost: "$200", leadTime: "3-5 days" },
      { name: "Bookshelf", icon: <Building size={16} />, avgCost: "$180", leadTime: "3-5 days" },
      { name: "Desk Lamp", icon: <Zap size={16} />, avgCost: "$80", leadTime: "1-2 days" }
    ]
  },
  { 
    name: "Software & Licenses", 
    icon: <Settings size={20} />,
    color: "amber",
    items: [
      { name: "Microsoft Office", icon: <FileText size={16} />, avgCost: "$150/year", leadTime: "Instant" },
      { name: "Adobe Creative Suite", icon: <Settings size={16} />, avgCost: "$600/year", leadTime: "Instant" },
      { name: "Project Management Tool", icon: <Target size={16} />, avgCost: "$120/year", leadTime: "Instant" },
      { name: "Antivirus Software", icon: <Shield size={16} />, avgCost: "$80/year", leadTime: "Instant" }
    ]
  },
  { 
    name: "Network & IT Infrastructure", 
    icon: <Wifi size={20} />,
    color: "teal",
    items: [
      { name: "Network Router", icon: <Router size={16} />, avgCost: "$300", leadTime: "2-4 days" },
      { name: "Ethernet Switch", icon: <Database size={16} />, avgCost: "$200", leadTime: "2-4 days" },
      { name: "External Hard Drive", icon: <HardDrive size={16} />, avgCost: "$120", leadTime: "1-3 days" },
      { name: "Server Equipment", icon: <Server size={16} />, avgCost: "$2,500", leadTime: "7-14 days" }
    ]
  },
  { 
    name: "Audio/Visual Equipment", 
    icon: <Headphones size={20} />,
    color: "rose",
    items: [
      { name: "Headphones", icon: <Headphones size={16} />, avgCost: "$200", leadTime: "1-3 days" },
      { name: "Webcam", icon: <Camera size={16} />, avgCost: "$150", leadTime: "1-3 days" },
      { name: "Microphone", icon: <Phone size={16} />, avgCost: "$180", leadTime: "1-3 days" },
      { name: "Speakers", icon: <Headphones size={16} />, avgCost: "$250", leadTime: "2-4 days" }
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

const requisitionHistory = [
  { 
    id: "REQ-2024-001", 
    itemName: "MacBook Pro 16\" M3", 
    quantity: 5, 
    status: "Approved", 
    date: "2024-01-15",
    budgetCode: "IT-Q1-2024",
    amount: "$14,995",
    urgency: "Medium",
    department: "Engineering",
    approver: "Sarah Chen",
    deliveryDate: "2024-01-20",
    category: "Computing Hardware"
  },
  { 
    id: "REQ-2024-002", 
    itemName: "Herman Miller Office Chairs", 
    quantity: 10, 
    status: "Pending", 
    date: "2024-01-18",
    budgetCode: "HR-Q1-2024",
    amount: "$4,500",
    urgency: "Low",
    department: "Human Resources",
    approver: "Mike Johnson",
    deliveryDate: "2024-01-25",
    category: "Furniture & Workspace"
  },
  { 
    id: "REQ-2024-003", 
    itemName: "Adobe Creative Cloud Licenses", 
    quantity: 20, 
    status: "Rejected", 
    date: "2024-01-12",
    budgetCode: "MKT-Q1-2024",
    amount: "$12,000",
    urgency: "High",
    department: "Marketing",
    approver: "Lisa Wang",
    deliveryDate: "2024-01-15",
    category: "Software & Licenses",
    rejectionReason: "Budget exceeded for Q1"
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

const budgetCodes = [
  { code: "IT-Q1-2024", department: "Information Technology", remaining: "$45,000", total: "$100,000" },
  { code: "HR-Q1-2024", department: "Human Resources", remaining: "$22,000", total: "$50,000" },
  { code: "MKT-Q1-2024", department: "Marketing", remaining: "$8,500", total: "$75,000" },
  { code: "OPS-Q1-2024", department: "Operations", remaining: "$35,000", total: "$80,000" },
  { code: "FIN-Q1-2024", department: "Finance", remaining: "$15,000", total: "$30,000" }
];

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
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("requisitionDraft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
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
      if (!useCustomItem && !formData.category) errors.category = "Category is required";
      if (!useCustomItem && selectedItems.length === 0) errors.selectedItem = "At least one item must be selected";
      if (useCustomItem && !formData.itemName) errors.itemName = "Item name is required";
      if (!formData.quantity || formData.quantity <= 0) errors.quantity = "Valid quantity is required";
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
      case 'Approved': return 'text-green-700 bg-green-50 border-green-200';
      case 'Pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Rejected': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle size={14} />;
      case 'Pending': return <Clock size={14} />;
      case 'Rejected': return <X size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getBudgetInfo = (code) => {
    return budgetCodes.find(budget => budget.code === code);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/employee-dash")}
              className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                  <Sparkles size={24} />
                </div>
                New Requisition Request
              </h1>
              <p className="text-gray-500 text-sm mt-1">Streamlined procurement with intelligent assistance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isDraftSaved && (
              <div className="flex items-center text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200 animate-pulse">
                <Save size={16} className="mr-2" />
                Draft auto-saved
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Star size={16} className="mr-2" />
                Quick Templates
              </button>
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="px-4 py-2.5 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium border border-gray-200 shadow-sm hover:shadow-md"
              >
                <History size={16} className="mr-2" />
                History
              </button>
              <button className="p-2.5 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md">
                <Bell size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Form - 3 columns */}
          <div className="xl:col-span-3">
            {/* Enhanced Progress Steps */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8 shadow-xl">
              <div className="relative">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Request Progress</h2>
                    <p className="text-gray-500 text-sm">Complete all steps to submit your requisition</p>
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
                      <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-300 ${
                        index <= activeStep 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white shadow-lg' 
                          : 'bg-white border-gray-300 text-gray-400 shadow-sm'
                      }`}>
                        {index < activeStep ? (
                          <CheckCircle size={24} />
                        ) : index === activeStep ? (
                          step.icon
                        ) : (
                          <span className="font-bold text-lg">{step.id}</span>
                        )}
                        {index <= activeStep && (
                          <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-25 animate-pulse"></div>
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-24 h-1 mx-4 rounded-full transition-all duration-500 ${
                          index < activeStep 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900">{steps[activeStep].title}</h3>
                  <p className="text-gray-600 mt-1">{steps[activeStep].description}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Form Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-xl">
              <div className="px-8 py-6 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    {steps[activeStep].icon}
                    {steps[activeStep].title}
                  </h3>
                  {estimatedTotal > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                      <span className="text-sm text-blue-600 font-medium">
                        Estimated Total: ${estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-8">
                {/* Step 1: Enhanced Item Selection */}
                {activeStep === 0 && (
                  <div className="space-y-8">
                    {/* Template Quick Access */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-blue-900 text-lg">Quick Start Templates</h4>
                          <p className="text-blue-700 text-sm">Pre-configured packages for common requests</p>
                        </div>
                        <button
                          onClick={() => setShowTemplates(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                          View All Templates
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.filter(t => t.popular).slice(0, 2).map((template, index) => (
                          <button
                            key={index}
                            onClick={() => handleTemplateSelect(template)}
                            className="p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200 text-left group hover:shadow-md"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold text-blue-900 group-hover:text-blue-700">{template.name}</h5>
                              <Award size={16} className="text-amber-500" />
                            </div>
                            <p className="text-sm text-blue-600 mb-2">{template.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-500">{template.items.length} items</span>
                              <span className="font-bold text-blue-900">{template.estimatedCost}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Item Toggle */}
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="checkbox"
                        id="customItem"
                        checked={useCustomItem}
                        onChange={(e) => setUseCustomItem(e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="customItem" className="ml-3 text-sm font-medium text-gray-900">
                        Request custom item not in our catalog
                      </label>
                      <div className="ml-auto">
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border">
                          May require additional approval time
                        </span>
                      </div>
                    </div>

                    {useCustomItem ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                          <Package size={20} />
                          Custom Item Request
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Item Name & Description
                            </label>
                            <textarea
                              name="itemName"
                              value={formData.itemName}
                              onChange={handleChange}
                              rows={3}
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                validationErrors.itemName ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Provide detailed description of the custom item including specifications, model numbers, etc."
                            />
                            {validationErrors.itemName && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.itemName}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estimated Unit Cost
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">$</span>
                                <input
                                  type="number"
                                  name="estimatedCost"
                                  value={formData.estimatedCost}
                                  onChange={handleChange}
                                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity Needed
                              </label>
                              <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  validationErrors.quantity ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="1"
                              />
                              {validationErrors.quantity && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.quantity}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Category Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">
                            Select Category
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((category) => (
                              <button
                                key={category.name}
                                type="button"
                                onClick={() => setFormData(prev => ({ 
                                  ...prev, 
                                  category: category.name,
                                  selectedItem: ""
                                }))}
                                className={`p-6 border-2 rounded-xl transition-all duration-200 text-left group hover:shadow-lg ${
                                  formData.category === category.name
                                    ? `border-${category.color}-500 bg-${category.color}-50 shadow-lg scale-105`
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className={`p-3 rounded-xl ${
                                    formData.category === category.name 
                                      ? `bg-${category.color}-100 text-${category.color}-600` 
                                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                  }`}>
                                    {category.icon}
                                  </div>
                                  {formData.category === category.name && (
                                    <CheckCircle size={20} className={`text-${category.color}-600`} />
                                  )}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-gray-700">
                                  {category.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {category.items.length} items available
                                </p>
                              </button>
                            ))}
                          </div>
                          {validationErrors.category && (
                            <p className="mt-2 text-sm text-red-600">{validationErrors.category}</p>
                          )}
                        </div>

                        {/* Item Selection */}
                        {formData.category && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <label className="text-sm font-medium text-gray-700">
                                Select Items from {formData.category}
                              </label>
                              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {selectedItems.length} items selected
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              {categories
                                .find(cat => cat.name === formData.category)
                                ?.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white"
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                          {item.icon}
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                                          <p className="text-sm text-gray-500">{item.avgCost}</p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedItemDetails(item)}
                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                      >
                                        <Eye size={16} />
                                      </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                      <span>Lead time: {item.leadTime}</span>
                                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                        In Stock
                                      </span>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={() => handleItemSelect(item, categories.find(cat => cat.name === formData.category))}
                                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                    >
                                      Add to Request
                                    </button>
                                  </div>
                                ))}
                            </div>

                            {/* Selected Items Summary */}
                            {selectedItems.length > 0 && (
                              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                                  <Layers size={20} />
                                  Selected Items ({selectedItems.length})
                                </h4>
                                <div className="space-y-3">
                                  {selectedItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                                      <div className="flex items-center space-x-3">
                                        <div className={`p-2 bg-${item.categoryColor}-100 rounded-lg`}>
                                          {item.icon}
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                                          <p className="text-sm text-gray-500">{item.category}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                          <label className="text-sm text-gray-600">Qty:</label>
                                          <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                          />
                                        </div>
                                        <span className="font-medium text-gray-900">
                                          ${(parseFloat(item.avgCost.replace(/[$,]/g, '')) * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => removeItem(item.id)}
                                          className="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-blue-200">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-blue-900">Estimated Total:</span>
                                    <span className="text-xl font-bold text-blue-900">
                                      ${estimatedTotal.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {validationErrors.selectedItem && (
                              <p className="mt-2 text-sm text-red-600">{validationErrors.selectedItem}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Enhanced Request Details */}
                {activeStep === 1 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Budget Information */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget Code
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <select
                              name="budgetCode"
                              value={formData.budgetCode}
                              onChange={(e) => {
                                handleChange(e);
                                setShowBudgetInfo(true);
                              }}
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                validationErrors.budgetCode ? 'border-red-300' : 'border-gray-300'
                              }`}
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
                            <p className="mt-1 text-sm text-red-600">{validationErrors.budgetCode}</p>
                          )}
                          
                          {/* Budget Info Display */}
                          {formData.budgetCode && getBudgetInfo(formData.budgetCode) && (
                            <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-green-900">Budget Status</span>
                                <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                                  Active
                                </span>
                              </div>
                              {(() => {
                                const budget = getBudgetInfo(formData.budgetCode);
                                const remaining = parseFloat(budget.remaining.replace(/[$,]/g, ''));
                                const total = parseFloat(budget.total.replace(/[$,]/g, ''));
                                const percentage = (remaining / total) * 100;
                                return (
                                  <div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-green-700">Remaining: {budget.remaining}</span>
                                      <span className="text-green-600">Total: {budget.total}</span>
                                    </div>
                                    <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Department */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Requesting Department
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <select
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                validationErrors.department ? 'border-red-300' : 'border-gray-300'
                              }`}
                            >
                              <option value="">Select Department</option>
                              <option value="Information Technology">Information Technology</option>
                              <option value="Human Resources">Human Resources</option>
                              <option value="Finance & Accounting">Finance & Accounting</option>
                              <option value="Operations">Operations</option>
                              <option value="Marketing & Communications">Marketing & Communications</option>
                              <option value="Research & Development">Research & Development</option>
                              <option value="Customer Support">Customer Support</option>
                            </select>
                          </div>
                          {validationErrors.department && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.department}</p>
                          )}
                        </div>

                        {/* Urgency Level */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Priority Level
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { level: 'low', label: 'Low', color: 'green', desc: '2-4 weeks' },
                              { level: 'medium', label: 'Medium', color: 'amber', desc: '1-2 weeks' },
                              { level: 'high', label: 'High', color: 'red', desc: '1-3 days' }
                            ].map(({ level, label, color, desc }) => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                                className={`p-4 border-2 rounded-xl transition-all duration-200 text-center ${
                                  formData.urgency === level
                                    ? `border-${color}-500 bg-${color}-50 shadow-lg scale-105`
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`font-bold text-lg ${
                                  formData.urgency === level ? `text-${color}-700` : 'text-gray-900'
                                }`}>
                                  {label}
                                </div>
                                <div className={`text-xs mt-1 ${
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
                      <div className="space-y-6">
                        {/* Required Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Required Delivery Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="date"
                              name="deliveryDate"
                              value={formData.deliveryDate}
                              onChange={handleChange}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Leave blank if no specific date required
                          </p>
                        </div>

                        {/* Preferred Supplier */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Supplier (Optional)
                          </label>
                          <div className="relative">
                            <Truck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="preferredSupplier"
                              value={formData.preferredSupplier}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter supplier name or 'No preference'"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Procurement will consider your preference when sourcing
                          </p>
                        </div>

                        {/* Environmental Impact */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Environmental Considerations
                          </label>
                          <div className="space-y-2">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Justification *
                      </label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                          validationErrors.reason ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Explain why this item is needed, how it will be used, and the business impact of not having it. Include any relevant project details or deadlines."
                      />
                      <div className="mt-1 flex items-center justify-between">
                        {validationErrors.reason ? (
                          <p className="text-sm text-red-600">{validationErrors.reason}</p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Provide detailed justification (minimum 20 characters)
                          </p>
                        )}
                        <span className={`text-xs ${
                          formData.reason.length >= 20 ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {formData.reason.length}/20
                        </span>
                      </div>
                    </div>

                    {/* Alternative Options */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternative Options Considered (Optional)
                      </label>
                      <textarea
                        name="alternativeOptions"
                        value={formData.alternativeOptions}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Describe any alternative solutions you've considered and why this option is preferred."
                      />
                    </div>

                    {/* Enhanced File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supporting Documents (Optional)
                      </label>
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                          isDragActive 
                            ? 'border-blue-500 bg-blue-50 scale-105' 
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center">
                          <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-2 font-medium">
                            {isDragActive 
                              ? "Drop files here..." 
                              : "Drag and drop files here, or click to browse"
                            }
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            PDF, Word, Excel, or images up to 10MB
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span>• Quotes & Specifications</span>
                            <span>• Budget Approvals</span>
                            <span>• Technical Requirements</span>
                          </div>
                        </div>
                      </div>
                      {formData.attachment && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Paperclip size={16} className="text-green-600" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-green-900">
                                  {formData.attachment.name}
                                </span>
                                <p className="text-xs text-green-700">
                                  {Math.round(formData.attachment.size / 1024)} KB • Uploaded successfully
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, attachment: null }))}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Enhanced Review */}
                {activeStep === 2 && (
                  <div className="space-y-8">
                    {/* Request Summary Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-bold text-xl text-gray-900 mb-2 flex items-center gap-3">
                        <Eye size={24} />
                        Request Summary
                      </h4>
                      <p className="text-gray-600">
                        Please review all information carefully before submitting your requisition request.
                      </p>
                    </div>

                    {/* Items Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package size={20} />
                        Requested Items
                      </h5>
                      
                      {useCustomItem ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h6 className="font-medium text-amber-900">Custom Item Request</h6>
                              <p className="text-amber-800 mt-1">{formData.itemName}</p>
                              <div className="mt-2 flex items-center space-x-4 text-sm">
                                <span className="text-amber-700">Quantity: {formData.quantity}</span>
                                {formData.estimatedCost && (
                                  <span className="text-amber-700">Est. Cost: ${formData.estimatedCost}</span>
                                )}
                              </div>
                            </div>
                            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                              Custom
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-4">
                                <div className={`p-2 bg-${item.categoryColor}-100 rounded-lg`}>
                                  {item.icon}
                                </div>
                                <div>
                                  <h6 className="font-medium text-gray-900">{item.name}</h6>
                                  <p className="text-sm text-gray-600">{item.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  {item.quantity} × {item.avgCost}
                                </p>
                                <p className="text-sm font-bold text-blue-600">
                                  ${(parseFloat(item.avgCost.replace(/[$,]/g, '')) * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">Total Estimated Cost:</span>
                              <span className="text-2xl font-bold text-blue-600">
                                ${estimatedTotal.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Request Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - Basic Info */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <FileText size={20} />
                          Request Details
                        </h5>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500">Department</span>
                            <span className="text-sm font-medium text-gray-900">{formData.department}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500">Budget Code</span>
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-900">{formData.budgetCode}</span>
                              <button
                                onClick={() => copyToClipboard(formData.budgetCode)}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-500">Priority Level</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              formData.urgency === 'high' 
                                ? 'bg-red-100 text-red-800'
                                : formData.urgency === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {formData.urgency ? formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1) : 'Not specified'}
                            </span>
                          </div>
                          {formData.deliveryDate && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-500">Required Date</span>
                              <span className="text-sm font-medium text-gray-900">
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
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-500">Preferred Supplier</span>
                              <span className="text-sm font-medium text-gray-900">{formData.preferredSupplier}</span>
                            </div>
                          )}
                          {formData.environmentalImpact && (
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm font-medium text-gray-500">Environmental Preference</span>
                              <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                                {formData.environmentalImpact}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column - Budget Info */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <CreditCard size={20} />
                          Budget Information
                        </h5>
                        {getBudgetInfo(formData.budgetCode) && (
                          <div className="space-y-4">
                            {(() => {
                              const budget = getBudgetInfo(formData.budgetCode);
                              const remaining = parseFloat(budget.remaining.replace(/[$,]/g, ''));
                              const total = parseFloat(budget.total.replace(/[$,]/g, ''));
                              const afterPurchase = remaining - estimatedTotal;
                              const percentage = (remaining / total) * 100;
                              const afterPercentage = (afterPurchase / total) * 100;
                              
                              return (
                                <>
                                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-green-900">Current Budget Status</span>
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {percentage.toFixed(1)}% Available
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-green-700">Available:</span>
                                        <span className="ml-1 font-bold">{budget.remaining}</span>
                                      </div>
                                      <div>
                                        <span className="text-green-700">Total Budget:</span>
                                        <span className="ml-1 font-bold">{budget.total}</span>
                                      </div>
                                    </div>
                                    <div className="mt-3 w-full bg-green-200 rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-blue-900">After This Purchase</span>
                                      <span className={`text-xs px-2 py-1 rounded ${
                                        afterPercentage >= 0 
                                          ? 'bg-blue-100 text-blue-800' 
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {afterPercentage >= 0 ? `${afterPercentage.toFixed(1)}% Remaining` : 'Over Budget'}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-blue-700">Request Cost:</span>
                                        <span className="ml-1 font-bold">${estimatedTotal.toLocaleString()}</span>
                                      </div>
                                      <div>
                                        <span className="text-blue-700">Remaining:</span>
                                        <span className={`ml-1 font-bold ${
                                          afterPurchase >= 0 ? 'text-blue-900' : 'text-red-600'
                                        }`}>
                                          ${afterPurchase.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                    {afterPurchase < 0 && (
                                      <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
                                        ⚠️ This request exceeds available budget. Additional approval may be required.
                                      </div>
                                    )}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Justification & Additional Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageSquare size={20} />
                        Business Justification
                      </h5>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800 leading-relaxed">{formData.reason}</p>
                      </div>
                      
                      {formData.alternativeOptions && (
                        <div className="mt-4">
                          <h6 className="font-medium text-gray-900 mb-2">Alternative Options Considered</h6>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800 leading-relaxed">{formData.alternativeOptions}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Attachments */}
                    {formData.attachment && (
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Paperclip size={20} />
                          Supporting Documents
                        </h5>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900">{formData.attachment.name}</span>
                              <p className="text-xs text-gray-500">
                                {Math.round(formData.attachment.size / 1024)} KB • {formData.attachment.type}
                              </p>
                            </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Terms and Compliance */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                      <h5 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <Shield size={20} />
                        Compliance & Terms
                      </h5>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            required
                          />
                          <label htmlFor="terms" className="text-sm text-purple-900 leading-relaxed">
                            <strong>I confirm that:</strong> All information provided is accurate and complete. This requisition is for legitimate business purposes and complies with company procurement policies. I understand that false information may result in request denial and disciplinary action.
                          </label>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="budget-approval"
                            className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            required
                          />
                          <label htmlFor="budget-approval" className="text-sm text-purple-900 leading-relaxed">
                            <strong>Budget Authorization:</strong> I acknowledge that this request is subject to budget approval and availability. Procurement reserves the right to request additional documentation or alternative sourcing options.
                          </label>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="security-compliance"
                            className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="security-compliance" className="text-sm text-purple-900 leading-relaxed">
                            <strong>Security & Compliance (Optional):</strong> For IT equipment, I acknowledge that items will undergo security review and must meet company standards before deployment.
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Approval Process Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h5 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} />
                        Next Steps
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Send size={20} className="text-blue-600" />
                          </div>
                          <h6 className="font-medium text-blue-900 mb-1">1. Submit Request</h6>
                          <p className="text-xs text-blue-700">Your request will be logged and assigned a tracking number</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users size={20} className="text-blue-600" />
                          </div>
                          <h6 className="font-medium text-blue-900 mb-1">2. Review & Approval</h6>
                          <p className="text-xs text-blue-700">Department head and procurement team will review</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Truck size={20} className="text-blue-600" />
                          </div>
                          <h6 className="font-medium text-blue-900 mb-1">3. Procurement</h6>
                          <p className="text-xs text-blue-700">Items will be sourced and delivered as specified</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Estimated Timeline:</strong> Most requests are processed within 3-5 business days. 
                          You'll receive email notifications at each stage of the process.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Form Actions */}
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
                      onClick={() => setShowConfirmation(true)}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Submitting Request...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Submit Requisition
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

          {/* Enhanced Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Smart Assistant Card */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles size={20} />
                  AI Assistant
                </h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                Get intelligent suggestions and real-time help with your requisition.
              </p>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 text-sm">
                  💡 Suggest alternatives to reduce cost
                </button>
                <button className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 text-sm">
                  📋 Check budget compatibility
                </button>
                <button className="w-full text-left px-4 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 text-sm">
                  ⚡ Find faster delivery options
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap size={20} className="text-orange-500" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <Star size={18} className="text-blue-600" />
                    <span className="font-medium text-blue-900">Browse Templates</span>
                  </div>
                  <ChevronRight size={16} className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <History size={18} className="text-green-600" />
                    <span className="font-medium text-green-900">View History</span>
                  </div>
                  <ChevronRight size={16} className="text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                
                <button
                  onClick={() => setShowFormsModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <Download size={18} className="text-amber-600" />
                    <span className="font-medium text-amber-900">Download Forms</span>
                  </div>
                  <ChevronRight size={16} className="text-amber-600 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-purple-500" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {requisitionHistory.slice(0, 3).map((req) => (
                  <div key={req.id} className="flex items-start space-x-3 p-3 bg-gray-50/80 rounded-lg border border-gray-200/50 hover:bg-gray-100/80 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      {getStatusIcon(req.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{req.itemName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                        <span className="text-xs text-gray-500">{req.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowHistoryModal(true)}
                className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all duration-200"
              >
                View Complete History
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Budget Insights */}
            {formData.budgetCode && getBudgetInfo(formData.budgetCode) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-green-500" />
                  Budget Insights
                </h3>
                
                {(() => {
                  const budget = getBudgetInfo(formData.budgetCode);
                  const remaining = parseFloat(budget.remaining.replace(/[$,]/g, ''));
                  const total = parseFloat(budget.total.replace(/[$,]/g, ''));
                  const percentage = (remaining / total) * 100;
                  
                  return (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-900">Budget Health</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            percentage > 50 ? 'bg-green-100 text-green-800' :
                            percentage > 25 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {percentage > 50 ? 'Healthy' : percentage > 25 ? 'Moderate' : 'Critical'}
                          </span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              percentage > 50 ? 'bg-green-500' :
                              percentage > 25 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-green-700">
                          {budget.remaining} of {budget.total} remaining
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Q1 spending is {percentage < 75 ? 'on track' : 'above average'}</p>
                        <p>• {Math.floor(90 - (100 - percentage))} days remaining in quarter</p>
                        {estimatedTotal > 0 && (
                          <p>• This request uses {((estimatedTotal / total) * 100).toFixed(1)}% of total budget</p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Help & Support */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-500" />
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get assistance with your requisition or learn about procurement policies.
              </p>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <BookOpen size={14} />
                  Procurement Guidelines
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <MessageSquare size={14} />
                  Live Chat Support
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <Phone size={14} />
                  Call Procurement Team
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200 flex items-center gap-2">
                  <Mail size={14} />
                  Email Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals with better UX */}
      
      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Star size={24} className="text-amber-500" />
                    Quick Start Templates
                  </h2>
                  <p className="text-gray-600 mt-1">Pre-configured packages for common business needs</p>
                </div>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template, index) => (
                  <div
                    key={index}
                    className="group border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {template.popular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        POPULAR
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {template.name}
                        </h3>
                        <p className="text-gray-600 mt-1">{template.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-green-600">{template.estimatedCost}</div>
                        <div className="text-xs text-gray-500">{template.items.length} items</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Includes:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {template.items.slice(0, 4).map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                              {item}
                            </span>
                          ))}
                          {template.items.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                              +{template.items.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building size={14} />
                          <span>{template.department}</span>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
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

      {/* Enhanced History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <History size={24} className="text-blue-500" />
                    Requisition History
                  </h2>
                  <p className="text-gray-600 mt-1">Track all your previous requests and their status</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium flex items-center gap-2">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {requisitionHistory.map((req) => (
                  <div key={req.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{req.itemName}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(req.status)}`}>
                            {getStatusIcon(req.status)}
                            <span className="ml-2">{req.status}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <span className="text-blue-600 font-medium">Request ID</span>
                            <p className="font-bold text-blue-900">{req.id}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-gray-600 font-medium">Quantity</span>
                            <p className="font-bold text-gray-900">{req.quantity}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <span className="text-green-600 font-medium">Amount</span>
                            <p className="font-bold text-green-900">{req.amount}</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <span className="text-purple-600 font-medium">Department</span>
                            <p className="font-bold text-purple-900">{req.department}</p>
                          </div>
                          <div className="bg-amber-50 rounded-lg p-3">
                            <span className="text-amber-600 font-medium">Priority</span>
                            <p className="font-bold text-amber-900">{req.urgency}</p>
                          </div>
                          <div className="bg-indigo-50 rounded-lg p-3">
                            <span className="text-indigo-600 font-medium">Submitted</span>
                            <p className="font-bold text-indigo-900">{req.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Budget: {req.budgetCode}</span>
                            <span>Approver: {req.approver}</span>
                            {req.deliveryDate && <span>Expected: {req.deliveryDate}</span>}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                              <Copy size={16} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {req.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800 text-sm font-medium mb-1">
                              <AlertCircle size={14} />
                              Rejection Reason
                            </div>
                            <p className="text-red-700 text-sm">{req.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Forms Modal */}
      {showFormsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Download size={24} className="text-orange-500" />
                    Download Forms & Documents
                  </h2>
                  <p className="text-gray-600 mt-1">Access all required forms and supporting documentation</p>
                </div>
                <button
                  onClick={() => setShowFormsModal(false)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
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
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredForms.map((form, index) => (
                  <div key={index} className="group border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                        <FileText size={28} className="text-blue-600" />
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          form.required 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {form.category}
                        </span>
                        {form.required && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {form.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{form.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center gap-1">
                          <FileText size={12} />
                          {form.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download size={12} />
                          {form.downloads.toLocaleString()}
                        </span>
                      </div>
                      <span>Updated {form.lastUpdated}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(form.url, "_blank")}
                        className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </button>
                      <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredForms.length === 0 && (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or browse all categories.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                <Send size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Submit Requisition Request?
              </h3>
              <div className="text-gray-600 mb-8 space-y-2">
                <p>You're about to submit a requisition request for:</p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-lg font-bold text-blue-900">
                    {useCustomItem ? formData.itemName : selectedItems.map(item => item.name).join(', ')}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    Estimated Total: ${estimatedTotal.toLocaleString()}
                  </div>
                </div>
                <p className="text-sm">This action cannot be undone once submitted.</p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Review Again
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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

      {/* Enhanced Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg animate-pulse">
                <CheckCircle size={40} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Request Submitted Successfully! 🎉
              </h3>
              <div className="text-gray-600 mb-8 space-y-3">
                <p>Your requisition has been successfully submitted and assigned tracking number:</p>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-900 font-mono">
                    REQ-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p>✅ Department manager will be notified</p>
                  <p>✅ Procurement team will begin sourcing</p>
                  <p>✅ You'll receive email updates on progress</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/employee-dash");
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 font-medium shadow-lg"
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
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Item Details</h3>
                <button
                  onClick={() => setSelectedItemDetails(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    {selectedItemDetails.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedItemDetails.name}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-600 font-medium">Average Cost</span>
                    <p className="font-bold text-gray-900">{selectedItemDetails.avgCost}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-600 font-medium">Lead Time</span>
                    <p className="font-bold text-gray-900">{selectedItemDetails.leadTime}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Specifications</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
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
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
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