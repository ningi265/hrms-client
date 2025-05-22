"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format, differenceInDays } from "date-fns"
import {   purple, teal } from "@mui/material/colors"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  Calendar,
  Check,
  CreditCard,
  DollarSign,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Info,
  Loader2,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  Wallet,
} from "lucide-react"
import FinancialRequestsDashboard  from "./financial-processing"
// Material-UI imports
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { grey, blue, green, amber, red } from "@mui/material/colors"

// Custom styled components to match the original design
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  border: "none",
}))

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    display: "none",
  },
})

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  borderRadius: theme.shape.borderRadius * 2,
  "&.Mui-selected": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
  },
}))

const StatusBadge = styled(Badge)(({ theme, status }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: status === "pending" ? amber[50] : status === "in-progress" ? blue[50] : green[50],
    color: status === "pending" ? amber[700] : status === "in-progress" ? blue[700] : green[700],
    border: `1px solid ${status === "pending" ? amber[200] : status === "in-progress" ? blue[200] : green[200]}`,
    padding: "0 8px",
  },
}))

const PriorityBadge = styled(Chip)(({ priority }) => ({
  backgroundColor: priority === "high" ? red[500] : priority === "medium" ? amber[500] : green[500],
  color: "white",
}))

export default function FinanceProcessing() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showPerDiem, setShowPerDiem] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [isSendingNotification, setIsSendingNotification] = useState(false)
  const [exchangeRates, setExchangeRates] = useState({})
  const [perDiemRates, setPerDiemRates] = useState({})
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [travelRequests, setTravelRequests] = useState([])
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [perDiemDetails, setPerDiemDetails] = useState({
    dailyRate: 0,
    days: 0,
    totalAmount: 0,
    currency: "",
    additionalAllowance: 0,
    notes: "",
  })

  const [transferDetails, setTransferDetails] = useState({
    cardNumber: "",
    cardType: "visa",
    accountHolder: "",
    amount: 0,
    currency: "",
    exchangeRate: 1,
    processingFee: 0,
    totalAmount: 0,
    transferDate: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  })

  const [notificationDetails, setNotificationDetails] = useState({
    recipient: "",
    subject: "",
    message: "",
    includeBreakdown: true,
    sendCopy: false,
  })

  // Sample exchange rates data
  const sampleExchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.82,
    SGD: 1.35,
    AUD: 1.53,
    CAD: 1.37,
    CNY: 7.24,
    INR: 83.12,
    BRL: 5.12,
    MWK: 1800,
  }

  // Sample per diem rates by country (using location as key)
  const samplePerDiemRates = {
    "lilongwe": { currency: "USD", rate: 100 },
    "default": { currency: "MWK", rate: 40000 }
  }

  // Initialize exchange rates and per diem rates
  useEffect(() => {
    setExchangeRates(sampleExchangeRates)
    setPerDiemRates(samplePerDiemRates)
  }, [])

  // Transform API data to match component structure
// Update the transformRequestData function
const transformRequestData = (data) => {
  return data.map(request => ({
    id: request._id,
    employeeName: request.employee?.name || "Employee",
    employeeId: request.employee?._id,
    department: "Not specified",
    email: request.employee?.email || "No email",
    purpose: request.purpose,
    country: request.location || "Not specified",
    city: request.location || "Not specified",
    departureDate: new Date(request.departureDate),
    returnDate: new Date(request.returnDate),
    status: request.finalApproval === "approved" ? "approved" : "pending",
    financialStatus: request.financeStatus || "pending", // Use financeStatus from API
    perDiemAmount: request.payment?.perDiemAmount || (request.currency === "MWK" ? 100000 : 1000), 
    currency: request.currency || "USD",
    cardDetails: {
      lastFour: "1234",
      type: "VISA",
      holder: request.employee?.name || "Employee",
    },
    documents: request.documents || [],
    approvedBy: request.finalApprover || "System",
    approvedAt: new Date(request.finalApprovalDate || request.updatedAt),
    priority: "medium",
    travelType: request.travelType || "local"
  }))
}


  // Filter travel requests based on search query and status filter
  const filteredRequests = travelRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.city.toLowerCase().includes(searchQuery.toLowerCase())
  
    const matchesStatus = filterStatus === "all" || request.financialStatus === filterStatus
  
    return matchesSearch && matchesStatus
  })

  // Set default selected request if none is selected
  useEffect(() => {
    if (!selectedRequest && filteredRequests.length > 0) {
      setSelectedRequest(filteredRequests[0])
    }
  }, [filteredRequests, selectedRequest])

  // Handle selecting a request
  const handleSelectRequest = (request) => {
    setSelectedRequest(request)
    setShowPerDiem(false)
    setShowTransfer(false)
    setShowNotification(false)

    // Reset form states
    if (request) {
      const travelDays = differenceInDays(request.returnDate, request.departureDate) + 1
      const locationRate = perDiemRates[request.city?.toLowerCase()] || perDiemRates["default"]

      setPerDiemDetails({
        dailyRate: locationRate.rate,
        days: travelDays,
        totalAmount: locationRate.rate * travelDays,
        currency: request.currency,
        additionalAllowance: 0,
        notes: "",
      })

      setTransferDetails({
        cardNumber: `**** **** **** ${request.cardDetails.lastFour}`,
        cardType: request.cardDetails.type.toLowerCase(),
        accountHolder: request.cardDetails.holder,
        amount: 0,
        currency: request.currency,
        exchangeRate: exchangeRates[request.currency] || 1,
        processingFee: 0,
        totalAmount: 0,
        transferDate: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      })
    }
  }

  // Calculate per diem
  const calculatePerDiem = () => {
    setIsCalculating(true)

    // Simulate API call
    setTimeout(() => {
      const totalAmount =
        perDiemDetails.dailyRate * perDiemDetails.days + Number.parseFloat(perDiemDetails.additionalAllowance || 0)

      setPerDiemDetails({
        ...perDiemDetails,
        totalAmount: totalAmount,
      })

      setTransferDetails({
        ...transferDetails,
        amount: totalAmount,
        totalAmount: totalAmount + Number.parseFloat(transferDetails.processingFee || 0),
      })

      setIsCalculating(false)
      setShowPerDiem(false)
      setShowTransfer(true)
    }, 1500)
  }

  // Process fund transfer
  const processTransfer = async () => {
    setIsTransferring(true);
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${backendUrl}/api/travel-requests/${selectedRequest.id}/finance-process`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: perDiemDetails.totalAmount, // Use the calculated per diem amount
            currency: transferDetails.currency,
            processingFee: transferDetails.processingFee,
            totalAmount: transferDetails.totalAmount,
            transferDate: transferDetails.transferDate,
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process transfer");
      }
  
      const data = await response.json();
  
      // Update the selected request with backend-calculated values
      const updatedRequest = {
        ...selectedRequest,
        financialStatus: "processed",
        perDiemAmount: data.perDiemAmount, // Use the amount calculated by backend
        paymentDate: new Date(data.paymentDate || new Date()),
      };
  
      setSelectedRequest(updatedRequest);
      setTravelRequests(prevRequests =>
        prevRequests.map(req => 
          req.id === selectedRequest.id ? updatedRequest : req
        )
      );
  
      // Show notification with backend-calculated amount
      setNotificationDetails({
        recipient: selectedRequest.email,
        subject: `Travel Funds Transfer - ${selectedRequest.id.substring(0, 8)}`,
        message: `Dear ${selectedRequest.employeeName},\n\nWe are pleased to inform you that your per diem allowance for your upcoming trip to ${selectedRequest.city}, ${selectedRequest.country} has been processed. A total of ${data.perDiemAmount} ${transferDetails.currency} has been transferred to your ${selectedRequest.cardDetails.type} card ending in ${selectedRequest.cardDetails.lastFour}.\n\nThe funds should be available within 24 hours.\n\nIf you have any questions, please contact the Finance Department.\n\nSafe travels!`,
        includeBreakdown: true,
        sendCopy: true,
      });
  
      setShowNotification(true);
      setSnackbarMessage(`Successfully processed payment of ${data.perDiemAmount} ${transferDetails.currency}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
    } catch (error) {
      console.error("Transfer failed:", error);
      setSnackbarMessage(error.message || "Failed to process transfer");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsTransferring(false);
      setShowTransfer(false);
    }
  };

  // Send notification
  const sendNotification = () => {
    setIsSendingNotification(true)

    // Simulate API call
    setTimeout(() => {
      setIsSendingNotification(false)

      // Update the selected request status
      const updatedRequest = {
        ...selectedRequest,
        financialStatus: "completed",
        transferredAt: new Date(),
      }
      setSelectedRequest(updatedRequest)

      setShowNotification(false)

      // Reset states
      setPerDiemDetails({
        dailyRate: 0,
        days: 0,
        totalAmount: 0,
        currency: "",
        additionalAllowance: 0,
        notes: "",
      })

      setTransferDetails({
        cardNumber: "",
        cardType: "visa",
        accountHolder: "",
        amount: 0,
        currency: "",
        exchangeRate: 1,
        processingFee: 0,
        totalAmount: 0,
        transferDate: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      })

      setNotificationDetails({
        recipient: "",
        subject: "",
        message: "",
        includeBreakdown: true,
        sendCopy: false,
      })
    }, 1500)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    return (
      <StatusBadge badgeContent={status === "pending" ? "Pending" : status === "in-progress" ? "In Progress" : "Completed"} status={status} />
    )
  }

  // Get priority badge
  const getPriorityBadge = (priority) => {
    return <PriorityBadge label={priority === "high" ? "High" : priority === "medium" ? "Medium" : "Low"} priority={priority} size="small" />
  }

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Update processing fee when amount changes
  useEffect(() => {
    if (transferDetails.amount > 0) {
      // Calculate a small processing fee (0.5% of the amount)
      const fee = transferDetails.amount * 0.005
      const total = Number.parseFloat(transferDetails.amount) + fee

      setTransferDetails((prevDetails) => ({
        ...prevDetails,
        processingFee: fee,
        totalAmount: total,
      }))
    }
  }, [transferDetails])

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/api/travel-requests/finance/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch approved travel requests");
        }
        const data = await response.json();
        setTravelRequests(transformRequestData(data));
      } catch (error) {
        console.error("Failed to fetch approved travel requests:", error);
        setSnackbarMessage("Failed to fetch approved travel requests");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovedRequests();
  }, []);

  return (
    <FinancialRequestsDashboard/> 
  )
}