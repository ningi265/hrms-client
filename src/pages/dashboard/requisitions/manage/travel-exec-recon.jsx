"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { format, isAfter, isBefore, isToday } from "date-fns"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle,
  CreditCard,
  Download,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Home,
  Info,
  MoreHorizontal,
  Plane,
  Plus,
  Receipt,
  Save,
  Search,
  Upload,
  Wallet,
  X,
  MapPin,
  Clock,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity
} from "lucide-react"

import { useAuth } from "../../../../authcontext/authcontext";
import { generateTravelReconciliationReport } from "../../../../utils/generatedPdfReport";

const safeFormatDate = (date, formatStr = "MMM d, yyyy") => {
  if (!date || isNaN(new Date(date).getTime())) {
    return "N/A";
  }
  return format(new Date(date), formatStr);
};

// Custom Components
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", onClick }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={20} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp size={14} className="text-emerald-500" />
            ) : (
              <TrendingUp size={14} className="text-red-500 rotate-180" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

const StatusBadge = ({ status, type = "trip" }) => {
  const getColors = (status, type) => {
    if (type === "trip") {
      switch (status) {
        case "active": return "bg-green-100 text-green-800";
        case "completed": return "bg-blue-100 text-blue-800";
        case "reconciled": return "bg-purple-100 text-purple-800";
        case "upcoming": return "bg-yellow-100 text-yellow-800";
        default: return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status) {
        case "recorded": return "bg-blue-100 text-blue-800";
        case "pending": return "bg-yellow-100 text-yellow-800";
        case "approved": return "bg-green-100 text-green-800";
        case "rejected": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
      }
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColors(status, type)}`}>
      {status}
    </span>
  );
};

const TripCard = ({ trip, isSelected, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{trip.purpose}</h4>
          <p className="text-sm text-gray-500">{trip.id}</p>
        </div>
        <StatusBadge status={trip.status} />
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{trip.city}, {trip.country}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {format(trip.departureDate, "MMM d")} - {format(trip.returnDate, "MMM d, yyyy")}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: trip.currency || "USD",
            }).format(trip.perDiemAmount)}
          </div>
          <div className="p-1 bg-blue-50 rounded">
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <span className="text-xs text-gray-500">{trip.expenses.length} expenses</span>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
  );
};

const Alert = ({ type = "info", title, children, onClose }) => {
  const typeClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const iconClasses = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500"
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${iconClasses[type]}`} />
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default function TravelExecutionReconciliation() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active")
  const [selectedTrip, setSelectedTrip] = useState({ expenses: [] });
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showReconciliation, setShowReconciliation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false)
  const [reconciliationStep, setReconciliationStep] = useState(1)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [travelRequests, setTravelRequests] = useState([])
  const [alertMessage, setAlertMessage] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
   const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    currency: "",
    date: format(new Date(), "yyyy-MM-dd"),
    paymentMethod: "card",
    receipt: null,
    notes: "",
  })

  const [reconciliationData, setReconciliationData] = useState({
    tripReport: "",
    totalSpent: 0,
    remainingBalance: 0,
    expenses: [], 
    receipts: [],
    additionalNotes: "",
    returnDate: format(new Date(), "yyyy-MM-dd"),
    status: "draft",
  })

  // Transform API data to match the expected format
  const transformRequestData = (apiData) => {
    return apiData.map(request => {
      const today = new Date();
      const departureDate = request.departureDate ? new Date(request.departureDate) : new Date();
      const returnDate = request.returnDate ? new Date(request.returnDate) : new Date(departureDate.getTime() + 86400000);
      
      const outboundDepartureTime = new Date(departureDate);
      outboundDepartureTime.setHours(9, 0, 0);
      
      const outboundArrivalTime = new Date(outboundDepartureTime);
      outboundArrivalTime.setHours(outboundDepartureTime.getHours() + 2);
      
      const returnDepartureTime = new Date(returnDate);
      returnDepartureTime.setHours(16, 0, 0);
      
      const returnArrivalTime = new Date(returnDepartureTime);
      returnArrivalTime.setHours(returnDepartureTime.getHours() + 2);
      
      const isCompleted = returnDate < today;
      const isActive = (today >= departureDate) && (today <= returnDate);
      const isFinanceProcessed = request.financeStatus === "processed";
      const isReconciled = request.reconciled || false;
      
      let status;
      if (isReconciled) {
        status = "reconciled";
      } else if (isCompleted) {
        status = "completed";
      } else if (isActive) {
        status = "active";
      } else {
        status = "upcoming";
      }

      const totalSpent = request.payment?.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
      const perDiemAmount = request.payment?.perDiemAmount || (request.currency === "MWK" ? 100000 : 1000);

      return {
        id: request._id,
        employeeName: request.employee?.name || 'Unknown Employee',
        employeeId: request.employee._id,
        department: request.employee?.department || "Unknown Department",
        purpose: request.purpose,
        country: request.travelType === "international" ? "International" : request.location || "Local",
        city: request.location || "Local",
        departureDate: departureDate,
        returnDate: returnDate,
        status: status,
        reconciled: isReconciled,
        perDiemAmount: perDiemAmount,
        currency: request.currency || "USD",
        cardDetails: {
          lastFour: request.payment?.card?.lastFour || "0000",
          type: request.payment?.card?.type || "VISA",
          holder: request.employee?.name || "Unknown",
        },
        expenses: request.payment?.expenses?.map(exp => ({
          id: exp._id,
          category: exp.category || "Miscellaneous",
          description: exp.description || "No description",
          amount: exp.amount || 0,
          currency: request.currency || "USD",
          date: new Date(exp.date || request.departureDate),
          paymentMethod: "card",
          receipt: null,
          status: "recorded"
        })) || [],
        travelArrangements: {
          flight: {
            outbound: {
              airline: request.flight?.outbound?.airline || "Unknown",
              flightNumber: request.flight?.outbound?.flightNumber || "N/A",
              departureTime: new Date(request.departureDate),
              arrivalTime: new Date(request.departureDate),
              from: "Unknown",
              to: request.location || "Destination",
            },
            return: {
              airline: request.flight?.return?.airline || "Unknown",
              flightNumber: request.flight?.return?.flightNumber || "N/A",
              departureTime: new Date(request.returnDate),
              arrivalTime: new Date(request.returnDate),
              from: request.location || "Destination",
              to: "Unknown",
            },
          },
          accommodation: {
            name: "Unknown",
            address: "Not specified",
            checkIn: request.departureDate,
            checkOut: request.returnDate,
            confirmationNumber: "N/A",
          },
          transportation: {
            type: "Other",
            details: request.meansOfTravel || "N/A",
            provider: "Unknown",
            confirmationNumber: "N/A",
          },
        },        
        emergencyContacts: [
          {
            name: "Company HR",
            phone: "+1234567890",
            email: "hr@company.com",
          },
          {
            name: "Local Emergency",
            phone: "+112",
            email: "emergency@local.com",
          },
        ],
        reconciliation: isReconciled ? {
          submittedDate: new Date(request.payment?.processedAt || request.updatedAt),
          approvedDate: isReconciled ? new Date(request.updatedAt) : null,
          approvedBy: request.finalApprover,
          totalSpent: totalSpent,
          remainingBalance: perDiemAmount - totalSpent,
          status: isReconciled ? "approved" : "pending",
          notes: isReconciled ? "Reconciled automatically" : ""
        } : null
      };
    });
  };
        
  // Filter trips based on search query and status filter
  const filteredTrips = travelRequests.filter((trip) => {
    const matchesSearch =
      trip.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.city?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || trip.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Set default selected trip if none is selected
  useEffect(() => {
    if (!selectedTrip && filteredTrips.length > 0) {
      setSelectedTrip(filteredTrips[0])

      if (filteredTrips[0].status === "completed") {
        const totalSpent = filteredTrips[0].expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
        const remainingBalance = filteredTrips[0].perDiemAmount - totalSpent

        setReconciliationData({
          tripReport: "",
          totalSpent: totalSpent,
          remainingBalance: remainingBalance,
          expenses: [...filteredTrips[0].expenses],
          receipts: filteredTrips[0].expenses.map((exp) => exp.receipt),
          additionalNotes: "",
          returnDate: format(filteredTrips[0].returnDate, "yyyy-MM-dd"),
          status: "draft",
        })
      }
    }
  }, [filteredTrips, selectedTrip])

  // Handle selecting a trip
  const handleSelectTrip = (trip) => {
    setSelectedTrip({
      ...trip,
      expenses: trip.expenses || [] 
    });
    setShowExpenseForm(false)
    setShowReconciliation(false)
    setReconciliationStep(1)

    if (trip.status === "completed") {
      const totalSpent = trip.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      const remainingBalance = trip.perDiemAmount - totalSpent;
    
      setReconciliationData({
        tripReport: "",
        totalSpent: totalSpent,
        remainingBalance: remainingBalance,
        expenses: [...trip.expenses],
        receipts: trip.expenses.map((exp) => exp.receipt),
        additionalNotes: "",
        returnDate: trip.returnDate ? format(new Date(trip.returnDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        status: "draft",
      });
    }
    
    setNewExpense({
      category: "",
      description: "",
      amount: "",
      currency: trip ? trip.currency : "",
      date: format(new Date(), "yyyy-MM-dd"),
      paymentMethod: "card",
      receipt: null,
      notes: "",
    })
  }

  // Add new expense
  const handleAddExpense = async () => {
    setIsAddingExpense(true);
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/travel-requests/${selectedTrip.id}/expenses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: newExpense.category,
          amount: newExpense.amount,
          description: newExpense.description
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to save expense');
      }
  
      const updatedRequest = await response.json();

      const newExpenseObj = {
        id: updatedRequest.payment.expenses[updatedRequest.payment.expenses.length - 1]._id,
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        currency: selectedTrip.currency,
        date: new Date(newExpense.date),
        paymentMethod: newExpense.paymentMethod,
        receipt: newExpense.receipt,
        status: "recorded"
      };
  
      setSelectedTrip(prevTrip => ({
        ...prevTrip,
        expenses: [...prevTrip.expenses, newExpenseObj]
      }));
  
      setTravelRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === selectedTrip.id 
            ? {
                ...request,
                expenses: [...request.expenses, newExpenseObj]
              } 
            : request
        )
      );
  
      setSnackbarMessage('Expense added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      setShowExpenseForm(false);
      setNewExpense({
        category: '',
        description: '',
        amount: '',
        currency: selectedTrip.currency,
        date: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: 'card',
        receipt: null,
        notes: ''
      });
  
    } catch (error) {
      console.error('Error saving expense:', error);
      setSnackbarMessage('Failed to save expense');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsAddingExpense(false);
    }
  };

  // Handle file upload for receipts
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploadingReceipt(true)

      setTimeout(() => {
        setNewExpense({
          ...newExpense,
          receipt: file.name,
        })
        setIsUploadingReceipt(false)
      }, 1000)
    }
  }

  // Submit reconciliation
  const handleSubmitReconciliation = async () => {
    if (!selectedTrip || !selectedTrip.id) {
      setAlertMessage({
        type: 'error',
        text: 'Please select a valid travel request',
      });
      setShowAlert(true);
      return;
    }
  
    const returnDate = reconciliationData.returnDate 
      ? new Date(reconciliationData.returnDate)
      : new Date(selectedTrip.returnDate);
      
    if (isNaN(returnDate.getTime())) {
      setAlertMessage({
        type: 'error',
        text: 'Please enter a valid return date',
      });
      setShowAlert(true);
      return;
    }
  
    if (isNaN(reconciliationData.totalSpent) || reconciliationData.totalSpent < 0) {
      setAlertMessage({
        type: 'error',
        text: 'Please enter a valid total amount spent',
      });
      setShowAlert(true);
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${backendUrl}/api/travel-requests/${selectedTrip.id}/reconcile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            totalSpent: parseFloat(reconciliationData.totalSpent),
            remainingBalance: parseFloat(reconciliationData.remainingBalance),
            additionalNotes: reconciliationData.additionalNotes || '',
            returnDate: returnDate.toISOString(),
            tripReport: reconciliationData.tripReport || '',
            expenses: reconciliationData.expenses || [],
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit reconciliation');
      }
  
      const data = await response.json();
      
      const updatedTrip = {
        ...data.travelRequest,
        status: 'pending_reconciliation',
        returnDate: data.travelRequest.returnDate 
          ? new Date(data.travelRequest.returnDate) 
          : new Date(),
        reconciliation: {
          ...data.travelRequest.reconciliation,
          submittedDate: new Date(data.travelRequest.reconciliation.submittedDate),
          approvedDate: data.travelRequest.reconciliation.approvedDate
            ? new Date(data.travelRequest.reconciliation.approvedDate)
            : null,
          status: 'pending_reconciliation',
        },
      };
  
      setSelectedTrip(updatedTrip);
      setTravelRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === selectedTrip.id ? updatedTrip : request
        )
      );
      
      setShowReconciliation(false);
      setReconciliationStep(1);
      setActiveTab("reconciled");
      
      setSnackbarMessage('Reconciliation submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
    } catch (error) {
      console.error('Reconciliation submission error:', error);
      setSnackbarMessage(error.message || 'Failed to submit reconciliation');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }

  // Calculate total expenses
  const calculateTotalExpenses = (expenses = []) => {
    return (expenses || []).reduce((total, expense) => total + (expense?.amount || 0), 0);
  };

  // Calculate remaining balance
  const calculateRemainingBalance = (perDiemAmount = 0, expenses = []) => {
    const totalExpenses = calculateTotalExpenses(expenses);
    return perDiemAmount - totalExpenses;
  };

  useEffect(() => {
    const fetchCompletedRequests = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/api/travel-requests/finance/processed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch completed travel requests");
        }
  
        const data = await response.json();
        const transformedData = transformRequestData(data);
        
        setTravelRequests(transformedData);
  
      } catch (error) {
        console.error("Failed to fetch completed travel requests:", error);
        setSnackbarMessage("Failed to fetch completed travel requests");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCompletedRequests();
  }, []);

  const filteredTripsByTab = filteredTrips.filter(trip => {
    if (activeTab === "reconciled") return trip.reconciled;
    return trip.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Travel Execution & Reconciliation</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Active monitoring</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>{travelRequests.filter(t => t.status === 'active').length} active trips</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white"
            >
              <option value="all">All Trips</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="reconciled">Reconciled</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <button
              onClick={() => navigate("/travel-dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Trip List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search trips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-100">
                <nav className="flex">
                  {[
                    { id: "upcoming", label: "Upcoming", count: filteredTrips.filter(t => t.status === "upcoming").length },
                    { id: "active", label: "Active", count: filteredTrips.filter(t => t.status === "active").length },
                    { id: "completed", label: "Completed", count: filteredTrips.filter(t => t.status === "completed").length },
                    { id: "reconciled", label: "Reconciled", count: filteredTrips.filter(t => t.reconciled).length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                          activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Trip List */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : filteredTripsByTab.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Plane className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No {activeTab} trips found</p>
                  </div>
                ) : (
                  filteredTripsByTab.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      isSelected={selectedTrip?.id === trip.id}
                      onClick={() => handleSelectTrip(trip)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Trip Details */}
          <div className="lg:col-span-2">
            {selectedTrip && selectedTrip.id ? (
              <div className="space-y-6">
                {/* Trip Overview */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Plane className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedTrip.purpose}</h2>
                        <p className="text-gray-500">{selectedTrip.id} • {selectedTrip.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={selectedTrip.status} />
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Destination</h4>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900">{selectedTrip.city}, {selectedTrip.country}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Travel Period</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900">
                            {safeFormatDate(selectedTrip.departureDate, "MMM d")} - {safeFormatDate(selectedTrip.returnDate, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Per Diem Allowance</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <Wallet className="w-4 h-4 text-blue-600" />
                          <span className="text-lg font-semibold text-gray-900">
                            {formatCurrency(selectedTrip.perDiemAmount, selectedTrip.currency)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Spent: {formatCurrency(calculateTotalExpenses(selectedTrip?.expenses || []), selectedTrip.currency)}</span>
                            <span className="text-gray-500">Remaining: {formatCurrency(calculateRemainingBalance(selectedTrip.perDiemAmount, selectedTrip?.expenses || []), selectedTrip.currency)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min((calculateTotalExpenses(selectedTrip?.expenses || []) / selectedTrip.perDiemAmount) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Card</h4>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {selectedTrip.cardDetails?.type ?? "Unknown"} **** {selectedTrip.cardDetails?.lastFour ?? "0000"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {selectedTrip.cardDetails?.holder ?? "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {selectedTrip.status === "reconciled" && selectedTrip.reconciliation && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Reconciliation Status</h4>
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="p-2 bg-green-100 rounded">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedTrip.reconciliation.status === "approved" ? "Approved" : "Pending Approval"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Submitted on {format(selectedTrip.reconciliation.submittedDate, "MMMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Alerts */}
                  <div className="mt-6">
                    {selectedTrip.status === "active" && (
                      <Alert type="success" title="Active Trip">
                        Your trip is currently active. You can record expenses as they occur and view your travel arrangements.
                      </Alert>
                    )}

                    {selectedTrip.status === "completed" && (
                      <Alert type="warning" title="Trip Completed">
                        Your trip is complete. Please reconcile your expenses and submit your trip report.
                      </Alert>
                    )}

                    {selectedTrip.status === "reconciled" && (
                      <Alert type="info" title="Trip Reconciled">
                        This trip has been reconciled and {selectedTrip.reconciliation.status === "approved" ? "approved" : "is pending approval"}.
                        {selectedTrip.reconciliation.remainingBalance > 0 &&
                          ` A remaining balance of ${formatCurrency(selectedTrip.reconciliation.remainingBalance, selectedTrip.currency)} will be returned to the company.`}
                      </Alert>
                    )}

                    {selectedTrip.status === "upcoming" && (
                      <Alert type="info" title="Upcoming Trip">
                        Your trip is scheduled for {format(selectedTrip.departureDate, "MMMM d, yyyy")}. 
                        You'll be able to record expenses once the trip begins.
                      </Alert>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    {selectedTrip.status === "active" && (
                      <button
                        onClick={() => setShowExpenseForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={16} />
                        Record Expense
                      </button>
                    )}

                    {selectedTrip.status === "completed" && (
                      <button
                        onClick={() => setShowReconciliation(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      >
                        <Receipt size={16} />
                        Start Reconciliation
                      </button>
                    )}

                    {selectedTrip.status === "reconciled" && (
                      <button
                        onClick={() => generateTravelReconciliationReport(selectedTrip)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        <Download size={16} />
                        Download Report
                      </button>
                    )}
                  </div>
                </div>

                {/* Travel Arrangements */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Travel Arrangements</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Flight Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Flight Information</h4>
                      <div className="space-y-3">
                        {/* Outbound */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-blue-100 rounded">
                                <Plane className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium">
                                {selectedTrip.travelArrangements?.flight?.outbound?.airline ?? "N/A"}
                              </span>
                            </div>
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                              {selectedTrip.travelArrangements?.flight?.outbound?.flightNumber ?? "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">{selectedTrip.travelArrangements?.flight?.outbound?.from ?? "N/A"}</p>
                              <p className="text-gray-500">{safeFormatDate(selectedTrip.travelArrangements?.flight?.outbound?.departureTime, "MMM d, h:mm a")}</p>
                            </div>
                            <ArrowRight className="text-gray-400" size={16} />
                            <div className="text-right">
                              <p className="font-medium">{selectedTrip.travelArrangements?.flight?.outbound?.to ?? "N/A"}</p>
                              <p className="text-gray-500">{safeFormatDate(selectedTrip.travelArrangements?.flight?.outbound?.arrivalTime, "MMM d, h:mm a")}</p>
                            </div>
                          </div>
                        </div>

                        {/* Return */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-blue-100 rounded">
                                <Plane className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium">
                                {selectedTrip.travelArrangements?.flight?.return?.airline ?? "N/A"}
                              </span>
                            </div>
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                              {selectedTrip.travelArrangements?.flight?.return?.flightNumber ?? "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">{selectedTrip.travelArrangements?.flight?.return?.from ?? "N/A"}</p>
                              <p className="text-gray-500">{safeFormatDate(selectedTrip.travelArrangements?.flight?.return?.departureTime, "MMM d, h:mm a")}</p>
                            </div>
                            <ArrowRight className="text-gray-400" size={16} />
                            <div className="text-right">
                              <p className="font-medium">{selectedTrip.travelArrangements?.flight?.return?.to ?? "N/A"}</p>
                              <p className="text-gray-500">{safeFormatDate(selectedTrip.travelArrangements?.flight?.return?.arrivalTime, "MMM d, h:mm a")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accommodation */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Accommodation</h4>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-orange-100 rounded">
                              <Home className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="font-medium">
                              {selectedTrip.travelArrangements?.accommodation?.name ?? "N/A"}
                            </span>
                          </div>
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            Confirmation #{selectedTrip.travelArrangements?.accommodation?.confirmationNumber ?? "N/A"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedTrip.travelArrangements?.accommodation?.address ?? "N/A"}
                        </p>
                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="text-gray-500">Check-in</p>
                            <p className="font-medium">{selectedTrip.travelArrangements?.accommodation?.checkIn ?? "N/A"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500">Check-out</p>
                            <p className="font-medium">{selectedTrip.travelArrangements?.accommodation?.checkOut ?? "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Expenses</h3>
                    </div>
                    {selectedTrip.status === "active" && (
                      <button
                        onClick={() => setShowExpenseForm(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        <Plus size={16} />
                        Add Expense
                      </button>
                    )}
                  </div>
                  
                  {selectedTrip?.expenses?.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Receipt className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No expenses recorded yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedTrip?.expenses?.map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-900">{format(expense.date, "MMM d, yyyy")}</td>
                              <td className="py-3 px-4 text-sm text-gray-900">{expense.category}</td>
                              <td className="py-3 px-4 text-sm text-gray-900">{expense.description}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                                {formatCurrency(expense.amount, selectedTrip.currency)}
                              </td>
                              <td className="py-3 px-4">
                                <StatusBadge status={expense.status} type="expense" />
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 font-medium">
                            <td colSpan={3} className="py-3 px-4 text-sm text-gray-900 text-right">Total</td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">
                              {formatCurrency(calculateTotalExpenses(selectedTrip?.expenses || []), selectedTrip.currency)}
                            </td>
                            <td className="py-3 px-4"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Trip Selected</h3>
                <p className="text-gray-500">Select a trip from the list to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={showExpenseForm}
          onClose={() => setShowExpenseForm(false)}
          title="Record Expense"
          size="lg"
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Meals">Meals</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Business Services">Business Services</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    placeholder="Brief description of the expense"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {selectedTrip.currency}
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="w-full pl-12 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        newExpense.paymentMethod === "card" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setNewExpense({ ...newExpense, paymentMethod: "card" })}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={newExpense.paymentMethod === "card"}
                          onChange={() => setNewExpense({ ...newExpense, paymentMethod: "card" })}
                          className="text-blue-600"
                        />
                        <span className="text-sm font-medium">Company Card</span>
                      </div>
                    </div>
                    <div 
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        newExpense.paymentMethod === "cash" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setNewExpense({ ...newExpense, paymentMethod: "cash" })}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={newExpense.paymentMethod === "cash"}
                          onChange={() => setNewExpense({ ...newExpense, paymentMethod: "cash" })}
                          className="text-blue-600"
                        />
                        <span className="text-sm font-medium">Cash</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Receipt</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingReceipt}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      {isUploadingReceipt ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Uploading...
                        </>
                      ) : newExpense.receipt ? (
                        <>
                          <FileText size={16} />
                          {newExpense.receipt}
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Receipt
                        </>
                      )}
                    </button>
                    {newExpense.receipt && (
                      <button
                        type="button"
                        onClick={() => setNewExpense({ ...newExpense, receipt: null })}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload a photo or scan of your receipt (JPG, PNG, or PDF)</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                placeholder="Any additional notes about this expense"
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExpense}
                disabled={isAddingExpense || !newExpense.category || !newExpense.description || !newExpense.amount}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingExpense ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Expense
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Reconciliation Modal */}
        <Modal
          isOpen={showReconciliation}
          onClose={() => setShowReconciliation(false)}
          title="Trip Reconciliation"
          size="xl"
        >
          <div className="p-6">
            {/* Stepper */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[
                  { step: 1, label: "Trip Report" },
                  { step: 2, label: "Expense Review" },
                  { step: 3, label: "Final Submission" }
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      reconciliationStep >= item.step 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {reconciliationStep > item.step ? (
                        <Check size={16} />
                      ) : (
                        item.step
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      reconciliationStep >= item.step ? "text-blue-600" : "text-gray-500"
                    }`}>
                      {item.label}
                    </span>
                    {index < 2 && (
                      <div className={`w-12 h-0.5 ml-4 ${
                        reconciliationStep > item.step ? "bg-blue-600" : "bg-gray-200"
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            {reconciliationStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trip Report</label>
                  <textarea
                    placeholder="Provide a summary of your trip, including key meetings, outcomes, and any follow-up actions"
                    value={reconciliationData.tripReport}
                    onChange={(e) => setReconciliationData({ ...reconciliationData, tripReport: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actual Return Date</label>
                  <input
                    type="date"
                    value={reconciliationData.returnDate}
                    onChange={(e) => setReconciliationData({ ...reconciliationData, returnDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {reconciliationStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <MetricCard
                      title="Per Diem Allowance"
                      value={formatCurrency(selectedTrip.perDiemAmount, selectedTrip.currency)}
                      icon={Wallet}
                      color="blue"
                    />
                    <MetricCard
                      title="Total Expenses"
                      value={formatCurrency(reconciliationData.totalSpent, selectedTrip.currency)}
                      icon={Receipt}
                      color="orange"
                    />
                    <MetricCard
                      title="Remaining Balance"
                      value={formatCurrency(reconciliationData.remainingBalance, selectedTrip.currency)}
                      icon={DollarSign}
                      color={reconciliationData.remainingBalance < 0 ? "red" : "green"}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Expense Details</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {reconciliationData.expenses.map((expense, index) => (
                          <tr key={expense.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{format(expense.date, "MMM d, yyyy")}</td>
                            <td className="py-3 px-4 text-sm">{expense.category}</td>
                            <td className="py-3 px-4 text-sm">{expense.description}</td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              {formatCurrency(expense.amount, selectedTrip.currency)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {expense.receipt ? (
                                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                                  <FileText size={14} />
                                  View
                                </button>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Missing</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Alert 
                  type={reconciliationData.remainingBalance < 0 ? "error" : "success"}
                  title={reconciliationData.remainingBalance < 0 ? "Overspent Budget" : "Within Budget"}
                >
                  {reconciliationData.remainingBalance < 0
                    ? `You have exceeded your per diem allowance by ${formatCurrency(Math.abs(reconciliationData.remainingBalance), selectedTrip.currency)}. Please provide an explanation in the notes.`
                    : `You have ${formatCurrency(reconciliationData.remainingBalance, selectedTrip.currency)} remaining from your per diem allowance.`}
                </Alert>
              </div>
            )}

            {reconciliationStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    placeholder="Provide any additional information or explanation for your expenses"
                    value={reconciliationData.additionalNotes}
                    onChange={(e) => setReconciliationData({ ...reconciliationData, additionalNotes: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">Reconciliation Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-500">Trip Details</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Destination:</span> {selectedTrip.city}, {selectedTrip.country}</p>
                        <p><span className="font-medium">Purpose:</span> {selectedTrip.purpose}</p>
                        <p><span className="font-medium">Travel Period:</span> {format(selectedTrip.departureDate, "MMM d")} - {reconciliationData.returnDate && !isNaN(new Date(reconciliationData.returnDate).getTime()) ? format(new Date(reconciliationData.returnDate), "MMM d, yyyy") : "N/A"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-500">Financial Summary</h5>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Per Diem Allowance:</span> {formatCurrency(selectedTrip.perDiemAmount, selectedTrip.currency)}</p>
                        <p><span className="font-medium">Total Expenses:</span> {formatCurrency(reconciliationData.totalSpent, selectedTrip.currency)}</p>
                        <p><span className="font-medium">Remaining Balance:</span> {formatCurrency(reconciliationData.remainingBalance, selectedTrip.currency)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Next Steps</h5>
                    <p className="text-sm text-gray-700">
                      {reconciliationData.remainingBalance > 0 
                        ? `The remaining balance of ${formatCurrency(reconciliationData.remainingBalance, selectedTrip.currency)} will be returned to the company account.`
                        : reconciliationData.remainingBalance < 0 
                          ? `Your request for additional reimbursement of ${formatCurrency(Math.abs(reconciliationData.remainingBalance), selectedTrip.currency)} will be reviewed by your manager.`
                          : "Your expenses match exactly with your per diem allowance. No further action is required."
                      }
                    </p>
                  </div>
                </div>

                <Alert type="warning" title="Confirmation">
                  By submitting this reconciliation, you confirm that all expenses are accurate and comply with company policy. This submission will be reviewed by your manager.
                </Alert>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  if (reconciliationStep > 1) {
                    setReconciliationStep(reconciliationStep - 1)
                  } else {
                    setShowReconciliation(false)
                  }
                }}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {reconciliationStep > 1 ? "Previous" : "Cancel"}
              </button>

              {reconciliationStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setReconciliationStep(reconciliationStep + 1)}
                  disabled={reconciliationStep === 1 && !reconciliationData.tripReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitReconciliation}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Submit Reconciliation
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </Modal>

        {/* Snackbar */}
        {snackbarOpen && (
          <div className="fixed top-4 right-4 z-50">
            <Alert
              type={snackbarSeverity}
              onClose={() => setSnackbarOpen(false)}
            >
              {snackbarMessage}
            </Alert>
          </div>
        )}
      </main>
    </div>
  )
}