"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { format, isAfter, isBefore, isToday } from "date-fns"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarToday,
  Check,
  CheckCircle,
  CreditCard,
  Download,
  Description,
  FilterList,
  Language,
  HelpOutline,
  Home,
  Info,
  MoreHoriz,
  Flight,
  Add,
  Receipt,
  Save,
  Search,
  Upload,
  AccountBalanceWallet,
  Close,
} from "@mui/icons-material"
import CircularProgress from "@mui/material/CircularProgress"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Input,
  InputLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  Divider,
  Tabs,
  Tab,
  Tooltip,
  Alert,
  AlertTitle,
  Chip,
  LinearProgress,
  Avatar,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge as MuiBadge,
  Box,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { MapPin } from "lucide-react"
import { useAuth } from "../../../../authcontext/authcontext";

export default function TravelExecutionReconciliation() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
   const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active")
  const [selectedTrip, setSelectedTrip] = useState(null)
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
      // Create reasonable flight times by adding hours to the base dates
    const outboundDepartureTime = new Date(departureDate);
    outboundDepartureTime.setHours(9, 0, 0); // Set to 9:00 AM
    
    const outboundArrivalTime = new Date(outboundDepartureTime);
    outboundArrivalTime.setHours(outboundDepartureTime.getHours() + 2); // 2 hour flight
    
    const returnDepartureTime = new Date(returnDate);
    returnDepartureTime.setHours(16, 0, 0); // Set to 4:00 PM
    
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

      // Calculate total spent from expenses
    const totalSpent = request.payment?.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
    const perDiemAmount = request.payment?.perDiemAmount || (request.currency === "MWK" ? 100000 : 1000);

      return {
        id: request._id,
        employeeName: request.employee.name,
        employeeId: request.employee._id,
        department: "Department", // Default value since not provided in API
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
          lastFour: "1234", // Default value
          type: "VISA", // Default value
          holder: request.employee.name,
        },
        expenses: request.payment?.expenses?.map(exp => ({
          id: exp._id,
          category: exp.category || "Miscellaneous",
          description: exp.description || "No description",
          amount: exp.amount || 0,
          currency: request.currency || "USD",
          date: new Date(exp.date || request.departureDate),
          paymentMethod: "card", // Default value
          receipt: null, // Default value
          status: "recorded" // Default value
        })) || [],
        travelArrangements: {
          flight: {
            outbound: {
              airline: "Unknown",
              flightNumber: "N/A",
              departureTime: new Date(request.departureDate),
              arrivalTime: new Date(request.departureDate),
              from: "Unknown",
              to: request.location || "Destination",
            },
            return: {
              airline: "Unknown",
              flightNumber: "N/A",
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
            type: request.meansOfTravel === "company" ? "Company Vehicle" : 
                 request.meansOfTravel === "own" ? "Personal Vehicle" : "Other",
            details: request.meansOfTravel,
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
      trip.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || trip.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Set default selected trip if none is selected
  useEffect(() => {
    if (!selectedTrip && filteredTrips.length > 0) {
      setSelectedTrip(filteredTrips[0])

      // Initialize reconciliation data if the trip is completed
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
    setSelectedTrip(trip)
    setShowExpenseForm(false)
    setShowReconciliation(false)
    setReconciliationStep(1)

    // Initialize reconciliation data if the trip is completed
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
    // Reset new expense form
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
      const response = await fetch(`http://localhost:4000/api/travel-requests/${selectedTrip.id}/expenses`, {
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

      // Create the new expense object
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
  
      // Update both the selected trip and the travelRequests array
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
  
      // Show success message
      setSnackbarMessage('Expense added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      // Close form and reset
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

      // Simulate upload delay
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
    // Add date validation
    if (!selectedTrip || !selectedTrip.id) {
      setAlertMessage({
        type: 'error',
        text: 'Please select a valid travel request',
      });
      setShowAlert(true);
      return;
    }
  
    // Validate return date
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
  
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/travel-requests/${selectedTrip.id}/reconcile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          totalSpent: parseFloat(reconciliationData.totalSpent),
          remainingBalance: parseFloat(reconciliationData.remainingBalance),
          additionalNotes: reconciliationData.additionalNotes || '',
          returnDate: returnDate.toISOString(), // Send as ISO string
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit reconciliation');
      }
  
      const data = await response.json();
      setSelectedTrip(data.travelRequest);
      setShowReconciliation(false);
      setReconciliationStep(1);
      setActiveTab("reconciled");
      
      setAlertMessage({
        type: 'success',
        text: 'Reconciliation submitted successfully!',
      });
      
    } catch (error) {
      setAlertMessage({
        type: 'error',
        text: error.message || 'Failed to submit reconciliation',
      });
    } finally {
      setIsSubmitting(false);
      setShowAlert(true);
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

  // Get trip status badge
  const getTripStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Chip label="Active" color="success" size="small" />
      case "completed":
        return <Chip label="Completed" color="info" size="small" />
      case "reconciled":
        return <Chip label="Reconciled" color="secondary" size="small" />
      case "upcoming":
        return <Chip label="Upcoming" color="warning" size="small" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  // Get expense status badge
  const getExpenseStatusBadge = (status) => {
    switch (status) {
      case "recorded":
        return <Chip label="Recorded" color="info" variant="outlined" size="small" />
      case "pending":
        return <Chip label="Pending" color="warning" variant="outlined" size="small" />
      case "approved":
        return <Chip label="Approved" color="success" variant="outlined" size="small" />
      case "rejected":
        return <Chip label="Rejected" color="error" variant="outlined" size="small" />
      default:
        return <Chip label={status} variant="outlined" size="small" />
    }
  }

  // Calculate total expenses
  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0)
  }

  // Calculate remaining balance
  const calculateRemainingBalance = (perDiemAmount, expenses) => {
    const totalExpenses = calculateTotalExpenses(expenses)
    return perDiemAmount - totalExpenses
  }

  useEffect(() => {
    const fetchCompletedRequests = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log(token)
        const response = await fetch(
          "http://localhost:4000/api/travel-requests/finance/processed",
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 2fr" }, gap: 3 }}>
          {/* Left Column - Trips List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
            <Flight />
          </Avatar>
          <Typography variant="h6" component="h1">
            Travel Execution & Reconciliation
          </Typography>
        </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
         
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FilterList fontSize="small" />
                    <span>{selected === "all" ? "All" : selected.charAt(0).toUpperCase() + selected.slice(1)}</span>
                  </Box>
                )}
              >
                <MenuItem value="all">All Trips</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="reconciled">Reconciled</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
              </Select>
            </Box>

            <TextField
              placeholder="Search trips..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1, color: "text.disabled" }} />,
                sx: { borderRadius: 28 },
              }}
            />

            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 2 }}
              variant="fullWidth"
            >
              <Tab label="Active" value="active" />
              <Tab label="Completed" value="completed" />
              <Tab label="Reconciled" value="reconciled" />
              <Tab label="Upcoming" value="upcoming" />
            </Tabs>

            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {activeTab === "active" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {filteredTrips.filter((trip) => trip.status === "active").length === 0 ? (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        No active trips found
                      </Typography>
                    ) : (
                      filteredTrips
                        .filter((trip) => trip.status === "active")
                        .map((trip) => (
                          <Card
                            key={trip.id}
                            onClick={() => handleSelectTrip(trip)}
                            sx={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                              border: selectedTrip?.id === trip.id ? "1px solid" : "1px solid transparent",
                              borderColor: selectedTrip?.id === trip.id ? "primary.main" : "divider",
                              "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 1,
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Box>
                                  <Typography variant="subtitle1">{trip.purpose}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {trip.id}
                                  </Typography>
                                </Box>
                                {getTripStatusBadge(trip.status)}
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <Language fontSize="small" sx={{ color: "text.disabled" }} />
                                <Typography variant="body2">
                                  {trip.city}, {trip.country}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CalendarToday fontSize="small" sx={{ color: "text.disabled" }} />
                                <Typography variant="body2">
                                  {format(trip.departureDate, "MMM d")} - {format(trip.returnDate, "MMM d, yyyy")}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Chip
                                    label={formatCurrency(trip.perDiemAmount, trip.currency)}
                                    size="small"
                                    sx={{ bgcolor: "primary.light", color: "primary.dark" }}
                                  />
                                  <Avatar sx={{ bgcolor: "info.light", width: 24, height: 24 }}>
                                    <CreditCard fontSize="small" sx={{ color: "info.dark" }} />
                                  </Avatar>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {trip.expenses.length} expenses recorded
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </Box>
                )}

                {activeTab === "completed" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {filteredTrips.filter((trip) => trip.status === "completed").length === 0 ? (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        No completed trips found
                      </Typography>
                    ) : (
                      filteredTrips
                        .filter((trip) => trip.status === "completed")
                        .map((trip) => (
                          <Card
                            key={trip.id}
                            onClick={() => handleSelectTrip(trip)}
                            sx={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                              border: selectedTrip?.id === trip.id ? "1px solid" : "1px solid transparent",
                              borderColor: selectedTrip?.id === trip.id ? "primary.main" : "divider",
                              "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 1,
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Box>
                                  <Typography variant="subtitle1">{trip.purpose}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {trip.id}
                                  </Typography>
                                </Box>
                                {getTripStatusBadge(trip.status)}
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <Language fontSize="small" sx={{ color: "text.disabled" }} />
                                <Typography variant="body2">
                                  {trip.city}, {trip.country}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CalendarToday fontSize="small" sx={{ color: "text.disabled" }} />
                                <Typography variant="body2">
                                  {format(trip.departureDate, "MMM d")} - {format(trip.returnDate, "MMM d, yyyy")}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Chip
                                    label={formatCurrency(trip.perDiemAmount, trip.currency)}
                                    size="small"
                                    sx={{ bgcolor: "primary.light", color: "primary.dark" }}
                                  />
                                  <Avatar sx={{ bgcolor: "warning.light", width: 24, height: 24 }}>
                                    <Receipt fontSize="small" sx={{ color: "warning.dark" }} />
                                  </Avatar>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Needs reconciliation
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </Box>
                )}

                {activeTab === "reconciled" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {filteredTrips.filter((trip) => trip.status === "reconciled").length === 0 ? (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        No reconciled trips found
                      </Typography>
                    ) : (
                      filteredTrips
                            .filter(trip => trip.reconciled)
                        .map((trip) => (
                          <Card
                            key={trip.id}
                            onClick={() => handleSelectTrip(trip)}
                            sx={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                              border: selectedTrip?.id === trip.id ? "1px solid" : "1px solid transparent",
                              borderColor: selectedTrip?.id === trip.id ? "primary.main" : "divider",
                              "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 1,
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Box>
                                  <Typography variant="subtitle1">{trip.purpose}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {trip.id}
                                  </Typography>
                                </Box>
                                {getTripStatusBadge(trip.status)}
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <Language fontSize="small" sx={{ color: "text.disabled" }} />
                                <Typography variant="body2">
                                  {trip.city}, {trip.country}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CalendarToday fontSize="small" sx={{ color: "text.disabled" }} />
                                <Typography variant="body2">
                                  {format(trip.departureDate, "MMM d")} - {format(trip.returnDate, "MMM d, yyyy")}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Chip
                                    label={formatCurrency(trip.reconciliation?.totalSpent || 0, trip.currency)}
                                    size="small"
                                    sx={{ bgcolor: "primary.light", color: "primary.dark" }}
                                  />
                                  <Avatar sx={{ bgcolor: "success.light", width: 24, height: 24 }}>
                                    <CheckCircle fontSize="small" sx={{ color: "success.dark" }} />
                                  </Avatar>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {trip.reconciliation ? format(trip.reconciliation.submittedDate, "MMM d, yyyy") : "N/A"}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </Box>
                )}

                {activeTab === "upcoming" && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {filteredTrips.filter((trip) => trip.status === "upcoming").length === 0 ? (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        No upcoming trips found
                      </Typography>
                    ) : (
                      filteredTrips
                        .filter((trip) => trip.status === "upcoming")
                        .map((trip) => (
                          <Card
                            key={trip.id}
                            onClick={() => handleSelectTrip(trip)}
                            sx={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                              border: selectedTrip?.id === trip.id ? "1px solid" : "1px solid transparent",
                              borderColor: selectedTrip?.id === trip.id ? "primary.main" : "divider",
                              "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 1,
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Box>
                                  <Typography variant="subtitle1">{trip.purpose}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {trip.id}
                                  </Typography>
                                </Box>
                                {getTripStatusBadge(trip.status)}
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <Language fontSize="small" sx={{ color: "text.disabled" }} />
                                <Typography variant="body2">
                                  {trip.city}, {trip.country}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CalendarToday fontSize="small" sx={{ color: "text.disabled" }} />
                                <Typography variant="body2">
                                  {format(trip.departureDate, "MMM d")} - {format(trip.returnDate, "MMM d, yyyy")}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Chip
                                    label={formatCurrency(trip.perDiemAmount, trip.currency)}
                                    size="small"
                                    sx={{ bgcolor: "primary.light", color: "primary.dark" }}
                                  />
                                  <Avatar sx={{ bgcolor: "info.light", width: 24, height: 24 }}>
                                    <CreditCard fontSize="small" sx={{ color: "info.dark" }} />
                                  </Avatar>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {trip.expenses.length} expenses recorded
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Right Column - Trip Details and Actions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {selectedTrip ? (
              <>
                {/* Trip Details */}
                <Card sx={{ boxShadow: 3 }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                          <Flight />
                        </Avatar>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="h6">{selectedTrip.purpose}</Typography>
                            {getTripStatusBadge(selectedTrip.status)}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {selectedTrip.id} • {selectedTrip.department}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    action={
                      <IconButton>
                        <MoreHoriz />
                      </IconButton>
                    }
                    sx={{ bgcolor: "primary.light", borderBottom: "1px solid", borderColor: "divider" }}
                  />
                  <CardContent>
                    <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Destination
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <MapPin fontSize="small" color="primary" />
                            <Typography>
                              {selectedTrip.city}, {selectedTrip.country}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Travel Period
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarToday fontSize="small" color="primary" />
                            <Typography>
                              {format(selectedTrip.departureDate, "MMM d, yyyy")} -{" "}
                              {format(selectedTrip.returnDate, "MMM d, yyyy")}
                              <Chip
                                label={`${
                                  Math.ceil(
                                    (selectedTrip.returnDate - selectedTrip.departureDate) / (1000 * 60 * 60 * 24),
                                  ) + 1
                                } days`}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Per Diem Allowance
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccountBalanceWallet fontSize="small" color="primary" />
                            <Typography fontWeight="medium">
                              {formatCurrency(selectedTrip.perDiemAmount, selectedTrip.currency)}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Spent:{" "}
                                {formatCurrency(
                                  calculateTotalExpenses(selectedTrip.expenses),
                                  selectedTrip.currency,
                                )}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Remaining:{" "}
                                {formatCurrency(
                                  calculateRemainingBalance(selectedTrip.perDiemAmount, selectedTrip.expenses),
                                  selectedTrip.currency,
                                )}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (calculateTotalExpenses(selectedTrip.expenses) / selectedTrip.perDiemAmount) * 100
                              }
                              sx={{ height: 4 }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Payment Card
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: "info.light", width: 36, height: 36 }}>
                              <CreditCard fontSize="small" color="info" />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedTrip.cardDetails.type} Card **** {selectedTrip.cardDetails.lastFour}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Holder: {selectedTrip.cardDetails.holder}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {selectedTrip.status === "reconciled" && selectedTrip.reconciliation && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Reconciliation Status
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar sx={{ bgcolor: "success.light", width: 36, height: 36 }}>
                                <CheckCircle fontSize="small" color="success" />
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {selectedTrip.reconciliation.status === "approved" ? "Approved" : "Pending Approval"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Submitted on {format(selectedTrip.reconciliation.submittedDate, "MMMM d, yyyy")}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        )}

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Emergency Contacts
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {selectedTrip.emergencyContacts.map((contact, index) => (
                              <Box key={index}>
                                <Typography fontWeight="medium">{contact.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {contact.phone} • {contact.email}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {selectedTrip.status === "active" && (
                      <Alert
                        severity="info"
                        icon={<Info fontSize="small" />}
                        sx={{ mt: 2, bgcolor: "success.light", color: "success.dark" }}
                      >
                        <AlertTitle>Active Trip</AlertTitle>
                        Your trip is currently active. You can record expenses as they occur and view your travel
                        arrangements.
                      </Alert>
                    )}

                    {selectedTrip.status === "completed" && (
                      <Alert
                        severity="warning"
                        icon={<Info fontSize="small" />}
                        sx={{ mt: 2, bgcolor: "warning.light", color: "warning.dark" }}
                      >
                        <AlertTitle>Trip Completed</AlertTitle>
                        Your trip is complete. Please reconcile your expenses and submit your trip report.
                      </Alert>
                    )}

                    {selectedTrip.status === "reconciled" && (
                      <Alert
                        severity="success"
                        icon={<CheckCircle fontSize="small" />}
                        sx={{ mt: 2, bgcolor: "info.light", color: "info.dark" }}
                      >
                        <AlertTitle>Trip Reconciled</AlertTitle>
                        This trip has been reconciled and{" "}
                        {selectedTrip.reconciliation.status === "approved" ? "approved" : "is pending approval"}.
                        {selectedTrip.reconciliation.remainingBalance > 0 &&
                          ` A remaining balance of ${formatCurrency(
                            selectedTrip.reconciliation.remainingBalance,
                            selectedTrip.currency,
                          )} will be returned to the company.`}
                      </Alert>
                    )}

                    {selectedTrip.status === "upcoming" && (
                      <Alert
                        severity="info"
                        icon={<Info fontSize="small" />}
                        sx={{ mt: 2, bgcolor: "info.light", color: "info.dark" }}
                      >
                        <AlertTitle>Upcoming Trip</AlertTitle>
                        Your trip is scheduled for {format(selectedTrip.departureDate, "MMMM d, yyyy")}. 
                        You'll be able to record expenses once the trip begins.
                      </Alert>
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, bgcolor: "action.hover", display: "flex", justifyContent: "space-between" }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/travel-dashboard")}
                      sx={{ borderRadius: 28 }}
                    >
                      Back to Dashboard
                    </Button>

                    {selectedTrip.status === "active" && (
                      <Button
                        variant="contained"
                        onClick={() => setShowExpenseForm(true)}
                        startIcon={<Add />}
                        sx={{ borderRadius: 28 }}
                      >
                        Record Expense
                      </Button>
                    )}

                    {selectedTrip.status === "completed" && (
                      <Button
                        variant="contained"
                        onClick={() => setShowReconciliation(true)}
                        startIcon={<Receipt />}
                        sx={{ borderRadius: 28 }}
                      >
                        Start Reconciliation
                      </Button>
                    )}

                    {selectedTrip.status === "reconciled" && (
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        sx={{ borderRadius: 28, borderColor: "success.main", color: "success.dark" }}
                      >
                        Download Report
                      </Button>
                    )}
                  </Box>
                </Card>

                {/* Travel Arrangements */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Flight color="primary" />
                      <Typography fontWeight="medium">Travel Arrangements</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {/* Flight Information */}
                      <Card>
                        <CardHeader title="Flight Information" sx={{ pb: 0 }} />
                        <CardContent>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Outbound Flight
                              </Typography>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: "action.hover" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Avatar sx={{ bgcolor: "info.light", width: 32, height: 32 }}>
                                      <Flight fontSize="small" color="info" />
                                    </Avatar>
                                    <Typography fontWeight="medium">
                                      {selectedTrip.travelArrangements.flight.outbound.airline}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={selectedTrip.travelArrangements.flight.outbound.flightNumber}
                                    size="small"
                                  />
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                  <Box>
                                    <Typography fontWeight="medium">
                                      {selectedTrip.travelArrangements.flight.outbound.from}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {format(
                                        new Date(selectedTrip.travelArrangements.flight.outbound.departureTime),
                                        "MMM d, h:mm a",
                                      )}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <ArrowRight fontSize="small" color="disabled" />
                                    <Typography variant="caption" color="text.secondary">
                                      Direct
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography fontWeight="medium">
                                      {selectedTrip.travelArrangements.flight.outbound.to}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {format(
                                        new Date(selectedTrip.travelArrangements.flight.outbound.arrivalTime),
                                        "MMM d, h:mm a",
                                      )}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            </Box>

                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Return Flight
                              </Typography>
                              <Paper elevation={0} sx={{ p: 2, bgcolor: "action.hover" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Avatar sx={{ bgcolor: "info.light", width: 32, height: 32 }}>
                                      <Flight fontSize="small" color="info" />
                                    </Avatar>
                                    <Typography fontWeight="medium">
                                      {selectedTrip.travelArrangements.flight.return.airline}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={selectedTrip.travelArrangements.flight.return.flightNumber}
                                    size="small"
                                  />
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                  <Box>
                                    <Typography fontWeight="medium">
                                      {selectedTrip.travelArrangements.flight.return.from}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {format(
                                        new Date(selectedTrip.travelArrangements.flight.return.departureTime),
                                        "MMM d, h:mm a",
                                      )}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <ArrowRight fontSize="small" color="disabled" />
                                    <Typography variant="caption" color="text.secondary">
                                      Direct
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography fontWeight="medium">
                                      {selectedTrip.travelArrangements.flight.return.to}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {format(
                                        new Date(selectedTrip.travelArrangements.flight.return.arrivalTime),
                                        "MMM d, h:mm a",
                                      )}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>

                      {/* Accommodation */}
                      <Card>
                        <CardHeader title="Accommodation" sx={{ pb: 0 }} />
                        <CardContent>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: "action.hover" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar sx={{ bgcolor: "warning.light", width: 32, height: 32 }}>
                                  <Home fontSize="small" color="warning" />
                                </Avatar>
                                <Typography fontWeight="medium">
                                  {selectedTrip.travelArrangements.accommodation.name}
                                </Typography>
                              </Box>
                              <Chip
                                label={`Confirmation #${selectedTrip.travelArrangements.accommodation.confirmationNumber}`}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {selectedTrip.travelArrangements.accommodation.address}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Check-in
                                </Typography>
                                <Typography fontWeight="medium">
                                  {selectedTrip.travelArrangements.accommodation.checkIn}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="caption" color="text.secondary">
                                  Check-out
                                </Typography>
                                <Typography fontWeight="medium">
                                  {selectedTrip.travelArrangements.accommodation.checkOut}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </CardContent>
                      </Card>

                      {/* Transportation */}
                      <Card>
                        <CardHeader title="Local Transportation" sx={{ pb: 0 }} />
                        <CardContent>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: "action.hover" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar sx={{ bgcolor: "success.light", width: 32, height: 32 }}>
                                  <MapPin fontSize="small" color="success" />
                                </Avatar>
                                <Typography fontWeight="medium">
                                  {selectedTrip.travelArrangements.transportation.type}
                                </Typography>
                              </Box>
                              <Chip
                                label={`Confirmation #${selectedTrip.travelArrangements.transportation.confirmationNumber}`}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2">
                              <Typography component="span" color="text.secondary">
                                Provider:
                              </Typography>{" "}
                              {selectedTrip.travelArrangements.transportation.provider}
                            </Typography>
                            <Typography variant="body2">
                              <Typography component="span" color="text.secondary">
                                Details:
                              </Typography>{" "}
                              {selectedTrip.travelArrangements.transportation.details}
                            </Typography>
                          </Paper>
                        </CardContent>
                      </Card>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Expenses List */}
                <Card sx={{ boxShadow: 3 }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Receipt color="primary" />
                        <Typography variant="h6">Expenses</Typography>
                      </Box>
                    }
                    action={
                      selectedTrip.status === "active" && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setShowExpenseForm(true)}
                          startIcon={<Add />}
                          sx={{ borderRadius: 28 }}
                        >
                          Add Expense
                        </Button>
                      )
                    }
                    sx={{ bgcolor: "action.hover" }}
                  />
                  <CardContent sx={{ p: 0 }}>
                    {selectedTrip.expenses.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        No expenses recorded yet
                      </Typography>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedTrip.expenses.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell>{format(expense.date, "MMM d, yyyy")}</TableCell>
                              <TableCell>{expense.category}</TableCell>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(expense.amount, selectedTrip.currency)}
                              </TableCell>
                              <TableCell>{getExpenseStatusBadge(expense.status)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ bgcolor: "action.hover" }}>
                            <TableCell colSpan={3} align="right">
                              <Typography fontWeight="medium">Total</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="medium">
                                {formatCurrency(
                                  calculateTotalExpenses(selectedTrip.expenses),
                                  selectedTrip.currency,
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* Add Expense Form Dialog */}
                <Dialog
                  open={showExpenseForm}
                  onClose={() => setShowExpenseForm(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "info.light", color: "info.main" }}>
                        <Add />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">Record Expense</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Add a new expense for your trip to {selectedTrip.city}
                        </Typography>
                      </Box>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3, pt: 2 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel id="category-label">Expense Category</InputLabel>
                          <Select
                            labelId="category-label"
                            id="category"
                            value={newExpense.category}
                            label="Expense Category"
                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                          >
                            <MenuItem value="Meals">Meals</MenuItem>
                            <MenuItem value="Transportation">Transportation</MenuItem>
                            <MenuItem value="Accommodation">Accommodation</MenuItem>
                            <MenuItem value="Entertainment">Entertainment</MenuItem>
                            <MenuItem value="Business Services">Business Services</MenuItem>
                            <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          label="Description"
                          placeholder="Brief description of the expense"
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                          fullWidth
                        />

                        <TextField
                          label="Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={newExpense.date}
                          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                          fullWidth
                        />
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                          label="Amount"
                          type="number"
                          placeholder="0.00"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          InputProps={{
                            startAdornment: (
                              <Typography sx={{ mr: 1, color: "text.secondary" }}>
                                {selectedTrip.currency}
                              </Typography>
                            ),
                          }}
                          fullWidth
                        />

                        <FormControl>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Payment Method
                          </Typography>
                          <RadioGroup
                            row
                            value={newExpense.paymentMethod}
                            onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                            sx={{ gap: 2 }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                flex: 1,
                                border: "1px solid",
                                borderColor:
                                  newExpense.paymentMethod === "card" ? "primary.main" : "divider",
                              }}
                            >
                              <FormControlLabel
                                value="card"
                                control={<Radio />}
                                label="Company Card"
                                sx={{ width: "100%" }}
                              />
                            </Paper>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                flex: 1,
                                border: "1px solid",
                                borderColor:
                                  newExpense.paymentMethod === "cash" ? "primary.main" : "divider",
                              }}
                            >
                              <FormControlLabel
                                value="cash"
                                control={<Radio />}
                                label="Cash"
                                sx={{ width: "100%" }}
                              />
                            </Paper>
                          </RadioGroup>
                        </FormControl>

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Receipt
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <input
                              type="file"
                              id="receipt"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              style={{ display: "none" }}
                            />
                            <Button
                              component="label"
                              htmlFor="receipt"
                              variant="outlined"
                              startIcon={<Upload />}
                              fullWidth
                              disabled={isUploadingReceipt}
                            >
                              {isUploadingReceipt ? (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <CircularProgress size={16} sx={{ mr: 1 }} />
                                  Uploading...
                                </Box>
                              ) : newExpense.receipt ? (
                                newExpense.receipt
                              ) : (
                                "Upload Receipt"
                              )}
                            </Button>
                            {newExpense.receipt && (
                              <IconButton
                                onClick={() => setNewExpense({ ...newExpense, receipt: null })}
                              >
                                <Close />
                              </IconButton>
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Upload a photo or scan of your receipt (JPG, PNG, or PDF)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <TextField
                      label="Notes"
                      placeholder="Any additional notes about this expense"
                      value={newExpense.notes}
                      onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                      fullWidth
                      multiline
                      rows={4}
                      sx={{ mt: 3 }}
                    />
                  </DialogContent>
                  <DialogActions sx={{ p: 2, bgcolor: "action.hover" }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowExpenseForm(false)}
                      sx={{ borderRadius: 28 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleAddExpense}
                      disabled={
                        isAddingExpense || !newExpense.category || !newExpense.description || !newExpense.amount
                      }
                      sx={{ borderRadius: 28 }}
                    >
                      {isAddingExpense ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Saving...
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Save sx={{ mr: 1 }} />
                          Save Expense
                        </Box>
                      )}
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Reconciliation Dialog */}
                <Dialog
                  open={showReconciliation}
                  onClose={() => setShowReconciliation(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "warning.light", color: "warning.main" }}>
                        <Receipt />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">Trip Reconciliation</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reconcile your expenses and submit your trip report for {selectedTrip.city}
                        </Typography>
                      </Box>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Stepper activeStep={reconciliationStep - 1} sx={{ mb: 3 }}>
                      <Step>
                        <StepLabel>Trip Report</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Expense Review</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Final Submission</StepLabel>
                      </Step>
                    </Stepper>

                    {/* Step 1: Trip Report */}
                    {reconciliationStep === 1 && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                          label="Trip Report"
                          placeholder="Provide a summary of your trip, including key meetings, outcomes, and any follow-up actions"
                          value={reconciliationData.tripReport}
                          onChange={(e) =>
                            setReconciliationData({ ...reconciliationData, tripReport: e.target.value })
                          }
                          fullWidth
                          multiline
                          rows={8}
                          InputProps={{
                            endAdornment: (
                              <Tooltip title="Provide a summary of your trip, including key meetings, outcomes, and any follow-up actions">
                                <HelpOutline color="action" />
                              </Tooltip>
                            ),
                          }}
                        />

                        <TextField
                          label="Actual Return Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={reconciliationData.returnDate}
                          onChange={(e) =>
                            setReconciliationData({ ...reconciliationData, returnDate: e.target.value })
                          }
                          fullWidth
                        />
                      </Box>
                    )}

                    {/* Step 2: Expense Review */}
                    {reconciliationStep === 2 && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Expense Summary
                          </Typography>
                          <Paper elevation={0} sx={{ p: 3, bgcolor: "action.hover" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Per Diem Allowance
                                </Typography>
                                <Typography variant="h6">
                                  {formatCurrency(selectedTrip.perDiemAmount, selectedTrip.currency)}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="body2" color="text.secondary">
                                  Total Expenses
                                </Typography>
                                <Typography variant="h6">
                                  {formatCurrency(reconciliationData.totalSpent, selectedTrip.currency)}
                                </Typography>
                              </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Remaining Balance
                                </Typography>
                                <Typography
                                  variant="h6"
                                  color={
                                    reconciliationData.remainingBalance < 0 ? "error.main" : "success.main"
                                  }
                                >
                                  {formatCurrency(
                                    reconciliationData.remainingBalance,
                                    selectedTrip.currency,
                                  )}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="body2" color="text.secondary">
                                  Status
                                </Typography>
                                <Chip
                                  label={
                                    reconciliationData.remainingBalance < 0 ? "Overspent" : "Within Budget"
                                  }
                                  color={reconciliationData.remainingBalance < 0 ? "error" : "success"}
                                />
                              </Box>
                            </Box>
                          </Paper>
                        </Box>

                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Expense Details
                          </Typography>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Receipt</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {reconciliationData.expenses.map((expense, index) => (
                                <TableRow key={expense.id}>
                                  <TableCell>{format(expense.date, "MMM d, yyyy")}</TableCell>
                                  <TableCell>{expense.category}</TableCell>
                                  <TableCell>{expense.description}</TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(expense.amount, selectedTrip.currency)}
                                  </TableCell>
                                  <TableCell>
                                    {expense.receipt ? (
                                      <Button variant="text" size="small" startIcon={<Description />}>
                                        View
                                      </Button>
                                    ) : (
                                      <Chip label="Missing" color="error" variant="outlined" size="small" />
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>

                        <Alert
                          severity={reconciliationData.remainingBalance < 0 ? "error" : "success"}
                          sx={{ mt: 2 }}
                        >
                          <AlertTitle>
                            {reconciliationData.remainingBalance < 0 ? "Overspent Budget" : "Within Budget"}
                          </AlertTitle>
                          {reconciliationData.remainingBalance < 0
                            ? `You have exceeded your per diem allowance by ${formatCurrency(
                                Math.abs(reconciliationData.remainingBalance),
                                selectedTrip.currency,
                              )}. Please provide an explanation in the notes.`
                            : `You have ${formatCurrency(
                                reconciliationData.remainingBalance,
                                selectedTrip.currency,
                              )} remaining from your per diem allowance.`}
                        </Alert>
                      </Box>
                    )}

                    {/* Step 3: Final Submission */}
                    {reconciliationStep === 3 && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                          label="Additional Notes"
                          placeholder="Provide any additional information or explanation for your expenses"
                          value={reconciliationData.additionalNotes}
                          onChange={(e) =>
                            setReconciliationData({ ...reconciliationData, additionalNotes: e.target.value })
                          }
                          fullWidth
                          multiline
                          rows={6}
                          InputProps={{
                            endAdornment: (
                              <Tooltip title="Provide any additional information or explanation for your expenses">
                                <HelpOutline color="action" />
                              </Tooltip>
                            ),
                          }}
                        />

                        <Paper elevation={0} sx={{ p: 3, bgcolor: "action.hover" }}>
                          <Typography variant="h6" gutterBottom>
                            Reconciliation Summary
                          </Typography>
                          <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}>
                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Trip Details
                              </Typography>
                              <Typography>
                                <Typography component="span" fontWeight="medium">
                                  Destination:
                                </Typography>{" "}
                                {selectedTrip.city}, {selectedTrip.country}
                              </Typography>
                              <Typography>
                                <Typography component="span" fontWeight="medium">
                                  Purpose:
                                </Typography>{" "}
                                {selectedTrip.purpose}
                              </Typography>
                              <Typography>
  <Typography component="span" fontWeight="medium">
    Travel Period:
  </Typography>{" "}
  {format(selectedTrip.departureDate, "MMM d")} -{" "}
  {reconciliationData.returnDate && !isNaN(new Date(reconciliationData.returnDate).getTime()) 
    ? format(new Date(reconciliationData.returnDate), "MMM d, yyyy")
    : "N/A"}
</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Financial Summary
                              </Typography>
                              <Typography>
                                <Typography component="span" fontWeight="medium">
                                  Per Diem Allowance:
                                </Typography>{" "}
                                {formatCurrency(selectedTrip.perDiemAmount, selectedTrip.currency)}
                              </Typography>
                              <Typography>
                                <Typography component="span" fontWeight="medium">
                                  Total Expenses:
                                </Typography>{" "}
                                {formatCurrency(reconciliationData.totalSpent, selectedTrip.currency)}
                              </Typography>
                              <Typography>
                                <Typography component="span" fontWeight="medium">
                                  Remaining Balance:
                                </Typography>{" "}
                                {formatCurrency(
                                  reconciliationData.remainingBalance,
                                  selectedTrip.currency,
                                )}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Next Steps
                            </Typography>
                            {reconciliationData.remainingBalance > 0 ? (
                              <Typography>
                                The remaining balance of{" "}
                                {formatCurrency(
                                  reconciliationData.remainingBalance,
                                  selectedTrip.currency,
                                )}{" "}
                                will be returned to the company account.
                              </Typography>
                            ) : reconciliationData.remainingBalance < 0 ? (
                              <Typography>
                                Your request for additional reimbursement of{" "}
                                {formatCurrency(
                                  Math.abs(reconciliationData.remainingBalance),
                                  selectedTrip.currency,
                                )}{" "}
                                will be reviewed by your manager.
                              </Typography>
                            ) : (
                              <Typography>
                                Your expenses match exactly with your per diem allowance. No further action is
                                required.
                              </Typography>
                            )}
                          </Box>
                        </Paper>

                        <Alert severity="warning">
                          <AlertTitle>Confirmation</AlertTitle>
                          By submitting this reconciliation, you confirm that all expenses are accurate and
                          comply with company policy. This submission will be reviewed by your manager.
                        </Alert>
                      </Box>
                    )}
                  </DialogContent>
                  <DialogActions sx={{ p: 2, bgcolor: "action.hover" }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (reconciliationStep > 1) {
                          setReconciliationStep(reconciliationStep - 1)
                        } else {
                          setShowReconciliation(false)
                        }
                      }}
                      sx={{ borderRadius: 28 }}
                    >
                      {reconciliationStep > 1 ? "Previous" : "Cancel"}
                    </Button>

                    {reconciliationStep < 3 ? (
                      <Button
                        variant="contained"
                        onClick={() => setReconciliationStep(reconciliationStep + 1)}
                        disabled={reconciliationStep === 1 && !reconciliationData.tripReport}
                        sx={{ borderRadius: 28 }}
                      >
                        Next Step
                      </Button>
                    ) : (<Button
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        console.log('Button clicked');
                        console.log('Selected trip ID:', selectedTrip?._id);
                        console.log('Reconciliation data:', reconciliationData);
                        handleSubmitReconciliation();
                      }}
                      disabled={isSubmitting}
                      sx={{ borderRadius: 28 }}
                    >
                      {isSubmitting ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Submitting...
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Check sx={{ mr: 1 }} />
                          Submit Reconciliation
                        </Box>
                      )}
                    </Button>
                  
                    )}
                  </DialogActions>
                </Dialog>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 256,
                  textAlign: "center",
                }}
              >
                <Flight sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6">No Trip Selected</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Select a trip from the list to view details
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}