"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format, differenceInDays } from "date-fns"
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
  const transformRequestData = (data) => {
    return data.map(request => ({
      id: request._id,
      employeeName: request.employee.name,
      employeeId: request.employee._id,
      department: "Not specified", // Add default department
      email: request.employee.email,
      purpose: request.purpose,
      country: request.location || "Not specified",
      city: request.location || "Not specified",
      departureDate: new Date(request.departureDate),
      returnDate: new Date(request.returnDate),
      status: request.finalApproval === "approved" ? "approved" : "pending",
      financialStatus: request.financeStatus,
      perDiemAmount: request.payment?.perDiemAmount || (request.currency === "MWK" ? 100000 : 1000), 
      currency: request.currency || "USD",
      cardDetails: {
        lastFour: "1234", // Default value
        type: "VISA", // Default value
        holder: request.employee.name,
      },
      documents: request.documents || [],
      approvedBy: request.finalApprover || "System",
      approvedAt: new Date(request.finalApprovalDate || request.updatedAt),
      priority: "medium", // Default priority
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
        `https://hrms-6s3i.onrender.com/api/travel-requests/${selectedRequest.id}/finance-process`,
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
          "http://localhost:4000/api/travel-requests/finance/pending",
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>


        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
              <Loader2 size={32} className="animate-spin" />
            </Box>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 2fr" }, gap: 3 }}>
              {/* Left Column - Travel Requests */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Financial Requests Processing 
                  </Typography>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Filter size={16} />
                        <span>Filter</span>
                      </Box>
                    )}
                  >
                    <MenuItem value="all">All Requests</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </Box>

                <TextField
                  placeholder="Search requests..."
                  fullWidth
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 20 }
                  }}
                />

                <StyledTabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ width: "100%" }}>
                  <StyledTab value="pending" label="Pending" />
                  <StyledTab value="processed" label="Processed" />
                </StyledTabs>

                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
  {filteredRequests
    .filter((req) => activeTab === "all" || req.financialStatus === activeTab)
    .length === 0 ? (
    <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
      No {activeTab} requests found
    </Box>
  ) : (
    filteredRequests
      .filter((req) => activeTab === "all" || req.financialStatus === activeTab)
      .map((request) => (
        <StyledCard
          key={request.id}
          sx={{
            cursor: "pointer",
            transition: "all 0.2s",
            border: selectedRequest?.id === request.id 
              ? `1px solid ${blue[300]}` 
              : "1px solid transparent",
            boxShadow: selectedRequest?.id === request.id ? 3 : 0,
            "&:hover": {
              borderColor: blue[200]
            }
          }}
          onClick={() => handleSelectRequest(request)}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start", 
              mb: 1 
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {request.employeeName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.id.substring(0, 8)}
                </Typography>
              </Box>
              {getPriorityBadge(request.priority)}
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Globe size={16} sx={{ mr: 0.5, color: "text.secondary" }} />
              <Typography variant="body2">
                {request.city}, {request.country}
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Calendar size={16} sx={{ mr: 0.5, color: "text.secondary" }} />
              <Typography variant="body2">
                {format(request.departureDate, "MMM d")} - {format(request.returnDate, "MMM d, yyyy")}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              mt: 2 
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={request.currency}
                  size="small"
                  sx={{ 
                    bgcolor: blue[50], 
                    color: blue[700], 
                    border: `1px solid ${blue[200]}` 
                  }}
                />
                {request.financialStatus === "completed" && request.perDiemAmount && (
                  <Typography variant="caption" sx={{ color: green[700] }}>
                    {formatCurrency(request.perDiemAmount, request.currency)}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                {request.financialStatus === "completed" && request.paymentDate 
                  ? `Paid: ${format(request.paymentDate, "MMM d, yyyy")}`
                  : `Approved: ${format(request.approvedAt, "MMM d, yyyy")}`}
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      ))
  )}
</Box>
              </Box>

              {/* Right Column - Request Details and Actions */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {selectedRequest ? (
                  <>
                    {/* Request Details */}
                    <StyledCard>
                      <CardHeader
                        sx={{
                          bgcolor: blue[50],
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          pb: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start"
                        }}
                        avatar={
                          <Box sx={{ p: 1, borderRadius: "50%", bgcolor: blue[100] }}>
                            <FileText size={20} color={blue[600]} />
                          </Box>
                        }
                        title={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="h6">{selectedRequest.employeeName}</Typography>
                            {getStatusBadge(selectedRequest.financialStatus)}
                          </Box>
                        }
                        subheader={`${selectedRequest.id.substring(0, 8)} • ${selectedRequest.department}`}
                        action={
                          <Button variant="text" size="small" sx={{ minWidth: 40, height: 40, borderRadius: "50%", p: 0 }}>
                            <MoreHorizontal size={20} />
                          </Button>
                        }
                      />
                      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Purpose of Travel
                              </Typography>
                              <Typography>{selectedRequest.purpose}</Typography>
                            </Box>

                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Destination
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <MapPin size={16} sx={{ mr: 0.5, color: blue[600] }} />
                                <Typography>
                                  {selectedRequest.city}, {selectedRequest.country}
                                </Typography>
                              </Box>
                            </Box>

                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Travel Period
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Calendar size={16} sx={{ mr: 0.5, color: blue[600] }} />
                                <Typography>
                                  {format(selectedRequest.departureDate, "MMM d, yyyy")} -{" "}
                                  {format(selectedRequest.returnDate, "MMM d, yyyy")}
                                  <Chip
                                    label={`${Math.ceil(
                                      (selectedRequest.returnDate - selectedRequest.departureDate) / (1000 * 60 * 60 * 24)
                                    ) + 1} days`}
                                    size="small"
                                    sx={{ ml: 1, bgcolor: grey[100] }}
                                  />
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Payment Details
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                <Box sx={{ p: 1, borderRadius: "50%", bgcolor: blue[100] }}>
                                  <CreditCard size={16} color={blue[600]} />
                                </Box>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {selectedRequest.cardDetails.type} Card **** {selectedRequest.cardDetails.lastFour}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Holder: {selectedRequest.cardDetails.holder}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Currency
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <DollarSign size={16} sx={{ mr: 0.5, color: blue[600] }} />
                                <Typography>{selectedRequest.currency}</Typography>
                                {selectedRequest.currency !== "USD" && (
                                  <Chip
                                    label={`1 USD = ${exchangeRates[selectedRequest.currency]} ${selectedRequest.currency}`}
                                    size="small"
                                    sx={{ ml: 1, bgcolor: grey[100] }}
                                  />
                                )}
                              </Box>
                            </Box>

                            {selectedRequest.financialStatus === "completed" && selectedRequest.perDiemAmount && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Transferred Amount
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Wallet size={16} sx={{ mr: 0.5, color: blue[600] }} />
                                  <Typography sx={{ fontWeight: 500 }}>
                                    {formatCurrency(selectedRequest.perDiemAmount, selectedRequest.currency)}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {selectedRequest.transferredAt && `Transferred on ${format(selectedRequest.transferredAt, "MMMM d, yyyy")}`}
                                </Typography>
                              </Box>
                            )}

                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Approval
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Check size={16} sx={{ mr: 0.5, color: green[600] }} />
                                <Typography>Approved by {selectedRequest.approvedBy}</Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {format(selectedRequest.approvedAt, "MMMM d, yyyy")}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {selectedRequest.financialStatus === "pending" && (
                          <Alert severity="warning" sx={{ bgcolor: amber[50], borderColor: amber[200], color: amber[800] }}>
                            <AlertTitle sx={{ color: amber[700] }}>Action Required</AlertTitle>
                            This request requires per diem calculation and fund transfer to the employee's {selectedRequest.cardDetails.type} card.
                          </Alert>
                        )}

                        {selectedRequest.financialStatus === "in-progress" && (
                          <Alert severity="info" sx={{ bgcolor: blue[50], borderColor: blue[200], color: blue[800] }}>
                            <AlertTitle sx={{ color: blue[700] }}>In Progress</AlertTitle>
                            Funds have been processed. Please notify the employee about the transfer.
                          </Alert>
                        )}

                        {selectedRequest.financialStatus === "completed" && (
                          <Alert severity="success" sx={{ bgcolor: green[50], borderColor: green[200], color: green[800] }}>
                            <AlertTitle sx={{ color: green[700] }}>Completed</AlertTitle>
                            All financial processing has been completed for this travel request.
                          </Alert>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: "space-between", p: 2, bgcolor: grey[50] }}>
                        {selectedRequest.financialStatus === "pending" && (
                          <>
                            <Button
                              variant="outlined"
                              onClick={() => navigate("/")}
                            >
                              Back to Dashboard
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<Calculator size={16} />}
                              onClick={() => setShowPerDiem(true)}
                            >
                              Calculate Per Diem
                            </Button>
                          </>
                        )}

                        {selectedRequest.financialStatus === "in-progress" && (
                          <>
                            <Button
                              variant="outlined"
                              onClick={() => navigate("/travel-dashboard")}
                            >
                              Back to Dashboard
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<Send size={16} />}
                              onClick={() => setShowNotification(true)}
                            >
                              Notify Employee
                            </Button>
                          </>
                        )}

                        {selectedRequest.financialStatus === "completed" && (
                          <>
                            <Button
                              variant="outlined"
                              onClick={() => navigate("/travel-dashboard")}
                            >
                              Back to Dashboard
                            </Button>
                            <Button
                              variant="outlined"
                              sx={{ borderColor: green[200], color: green[700], "&:hover": { bgcolor: green[50] } }}
                              startIcon={<FileText size={16} />}
                            >
                              View Transaction Record
                            </Button>
                          </>
                        )}
                      </CardActions>
                    </StyledCard>

                    {/* Per Diem Calculation Section */}
                    {showPerDiem && (
                      <StyledCard>
                        <CardHeader
                          sx={{
                            bgcolor: amber[50],
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            pb: 2
                          }}
                          avatar={
                            <Box sx={{ p: 1, borderRadius: "50%", bgcolor: amber[100] }}>
                              <Calculator size={20} color={amber[600]} />
                            </Box>
                          }
                          title="Per Diem Calculation"
                          subheader={`Calculate per diem allowance for ${selectedRequest.employeeName}'s trip to ${selectedRequest.city}`}
                        />
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                          <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Daily Rate
                                  <Tooltip title={`Standard daily rate for ${selectedRequest.country} in ${selectedRequest.currency}`}>
                                    <HelpCircle size={16} sx={{ ml: 0.5, color: "text.secondary", display: "inline", verticalAlign: "middle" }} />
                                  </Tooltip>
                                </Typography>
                                <TextField
                                  type="number"
                                  value={perDiemDetails.dailyRate}
                                  onChange={(e) =>
                                    setPerDiemDetails({
                                      ...perDiemDetails,
                                      dailyRate: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {selectedRequest.currency}
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Standard rate for {selectedRequest.country}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Number of Days
                                </Typography>
                                <TextField
                                  type="number"
                                  value={perDiemDetails.days}
                                  onChange={(e) =>
                                    setPerDiemDetails({ ...perDiemDetails, days: Number.parseInt(e.target.value) || 0 })
                                  }
                                  fullWidth
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Based on travel dates: {format(selectedRequest.departureDate, "MMM d")} -{" "}
                                  {format(selectedRequest.returnDate, "MMM d")}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Additional Allowance
                                  <Tooltip title="Any additional funds required for special circumstances">
                                    <HelpCircle size={16} sx={{ ml: 0.5, color: "text.secondary", display: "inline", verticalAlign: "middle" }} />
                                  </Tooltip>
                                </Typography>
                                <TextField
                                  type="number"
                                  placeholder="0.00"
                                  value={perDiemDetails.additionalAllowance}
                                  onChange={(e) =>
                                    setPerDiemDetails({
                                      ...perDiemDetails,
                                      additionalAllowance: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {selectedRequest.currency}
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                />
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Notes
                                </Typography>
                                <TextField
                                  placeholder="Any notes about this per diem calculation"
                                  value={perDiemDetails.notes}
                                  onChange={(e) => setPerDiemDetails({ ...perDiemDetails, notes: e.target.value })}
                                  multiline
                                  rows={4}
                                  fullWidth
                                />
                              </Box>
                            </Box>
                          </Box>

                          <Divider />

                          <Box sx={{ p: 2, bgcolor: grey[50], borderRadius: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Calculation Summary
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", width: 240 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Daily Rate:
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatCurrency(perDiemDetails.dailyRate, selectedRequest.currency)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", width: 240 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Number of Days:
                                    </Typography>
                                    <Typography variant="body2">{perDiemDetails.days}</Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", width: 240 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Subtotal:
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatCurrency(
                                        perDiemDetails.dailyRate * perDiemDetails.days,
                                        selectedRequest.currency,
                                      )}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", width: 240 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Additional Allowance:
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatCurrency(perDiemDetails.additionalAllowance, selectedRequest.currency)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="caption" color="text.secondary">
                                  Total Amount
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                  {formatCurrency(
                                    perDiemDetails.dailyRate * perDiemDetails.days +
                                      Number.parseFloat(perDiemDetails.additionalAllowance || 0),
                                    selectedRequest.currency,
                                  )}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Approx.{" "}
                                  {formatCurrency(
                                    (perDiemDetails.dailyRate * perDiemDetails.days +
                                      Number.parseFloat(perDiemDetails.additionalAllowance || 0)) /
                                      exchangeRates[selectedRequest.currency],
                                    "USD",
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "space-between", p: 2, bgcolor: grey[50] }}>
                          <Button
                            variant="outlined"
                            onClick={() => setShowPerDiem(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            disabled={isCalculating || perDiemDetails.dailyRate <= 0 || perDiemDetails.days <= 0}
                            onClick={calculatePerDiem}
                          >
                            {isCalculating ? (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Loader2 size={16} className="animate-spin" sx={{ mr: 1 }} />
                                Calculating...
                              </Box>
                            ) : (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Check size={16} sx={{ mr: 1 }} />
                                Confirm Calculation
                              </Box>
                            )}
                          </Button>
                        </CardActions>
                      </StyledCard>
                    )}

                    {/* Fund Transfer Section */}
                    {showTransfer && (
                      <StyledCard>
                        <CardHeader
                          sx={{
                            bgcolor: blue[50],
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            pb: 2
                          }}
                          avatar={
                            <Box sx={{ p: 1, borderRadius: "50%", bgcolor: blue[100] }}>
                              <CreditCard size={20} color={blue[600]} />
                            </Box>
                          }
                          title="Fund Transfer"
                          subheader={`Transfer per diem funds to ${selectedRequest.employeeName}'s ${selectedRequest.cardDetails.type} card`}
                        />
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                          <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Card Details
                                </Typography>
                                <Box sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1, bgcolor: grey[50], display: "flex", alignItems: "center", gap: 1 }}>
                                  <Box sx={{ p: 1, borderRadius: "50%", bgcolor: blue[100] }}>
                                    <CreditCard size={20} color={blue[600]} />
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {transferDetails.cardNumber}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Holder: {transferDetails.accountHolder}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Transfer Amount
                                </Typography>
                                <TextField
                                  type="number"
                                  value={transferDetails.amount}
                                  onChange={(e) =>
                                    setTransferDetails({
                                      ...transferDetails,
                                      amount: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {selectedRequest.currency}
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Amount calculated from per diem
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Transfer Date
                                </Typography>
                                <TextField
                                  type="date"
                                  value={transferDetails.transferDate}
                                  onChange={(e) =>
                                    setTransferDetails({ ...transferDetails, transferDate: e.target.value })
                                  }
                                  fullWidth
                                />
                              </Box>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Currency
                                </Typography>
                                <TextField
                                  value={transferDetails.currency}
                                  onChange={(e) =>
                                    setTransferDetails({ ...transferDetails, currency: e.target.value })
                                  }
                                  fullWidth
                                  select
                                >
                                  <MenuItem value={selectedRequest.currency}>{selectedRequest.currency}</MenuItem>
                                </TextField>
                                <Typography variant="caption" color="text.secondary">
                                  Exchange rate: 1 USD = {exchangeRates[selectedRequest.currency]} {selectedRequest.currency}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Processing Fee
                                  <Tooltip title="Standard processing fee for international transfers (0.5%)">
                                    <HelpCircle size={16} sx={{ ml: 0.5, color: "text.secondary", display: "inline", verticalAlign: "middle" }} />
                                  </Tooltip>
                                </Typography>
                                <TextField
                                  value={transferDetails.processingFee.toFixed(2)}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {selectedRequest.currency}
                                      </InputAdornment>
                                    ),
                                    readOnly: true,
                                  }}
                                  fullWidth
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Automatically calculated (0.5% of transfer amount)
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Transfer Notes
                                </Typography>
                                <TextField
                                  placeholder="Any notes about this transfer"
                                  value={transferDetails.notes}
                                  onChange={(e) => setTransferDetails({ ...transferDetails, notes: e.target.value })}
                                  multiline
                                  rows={4}
                                  fullWidth
                                />
                              </Box>
                            </Box>
                          </Box>

                          <Divider />

                          <Box sx={{ p: 2, bgcolor: blue[50], borderRadius: 1, border: "1px solid", borderColor: blue[200] }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ color: blue[800], mb: 1 }}>
                                  Transfer Summary
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", width: 240 }}>
                                    <Typography variant="body2" color={blue[700]}>
                                      Transfer Amount:
                                    </Typography>
                                    <Typography variant="body2" color={blue[700]}>
                                      {formatCurrency(transferDetails.amount, selectedRequest.currency)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", width: 240 }}>
                                    <Typography variant="body2" color={blue[700]}>
                                      Processing Fee:
                                    </Typography>
                                    <Typography variant="body2" color={blue[700]}>
                                      {formatCurrency(transferDetails.processingFee, selectedRequest.currency)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="caption" color={blue[700]}>
                                  Total to Transfer
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: blue[800] }}>
                                  {formatCurrency(transferDetails.totalAmount, selectedRequest.currency)}
                                </Typography>
                                <Typography variant="caption" color={blue[600]}>
                                  Approx.{" "}
                                  {formatCurrency(
                                    transferDetails.totalAmount / exchangeRates[selectedRequest.currency],
                                    "USD",
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Alert severity="warning" sx={{ bgcolor: amber[50], borderColor: amber[200], color: amber[800] }}>
                            <AlertTitle sx={{ color: amber[700] }}>Important</AlertTitle>
                            By proceeding, you confirm that the transfer details are correct and funds will be sent to
                            the employee's {selectedRequest.cardDetails.type} card. This action cannot be undone.
                          </Alert>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "space-between", p: 2, bgcolor: grey[50] }}>
                          <Button
                            variant="outlined"
                            onClick={() => setShowTransfer(false)}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ bgcolor: blue[600], "&:hover": { bgcolor: blue[700] } }}
                            onClick={processTransfer}
                            disabled={isTransferring || transferDetails.amount <= 0}
                          >
                            {isTransferring ? (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Loader2 size={16} className="animate-spin" sx={{ mr: 1 }} />
                                Processing Transfer...
                              </Box>
                            ) : (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <ArrowRight size={16} sx={{ mr: 1 }} />
                                Process Transfer
                              </Box>
                            )}
                          </Button>
                        </CardActions>
                      </StyledCard>
                    )}

                    {/* Notification Section */}
                    {showNotification && (
                      <StyledCard>
                        <CardHeader
                          sx={{
                            bgcolor: green[50],
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            pb: 2
                          }}
                          avatar={
                            <Box sx={{ p: 1, borderRadius: "50%", bgcolor: green[100] }}>
                              <Send size={20} color={green[600]} />
                            </Box>
                          }
                          title="Notify Employee"
                          subheader={`Send notification to ${selectedRequest.employeeName} about the fund transfer`}
                        />
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Recipient
                              </Typography>
                              <TextField
                                value={notificationDetails.recipient}
                                onChange={(e) =>
                                  setNotificationDetails({ ...notificationDetails, recipient: e.target.value })
                                }
                                fullWidth
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Employee's email address
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Subject
                              </Typography>
                              <TextField
                                placeholder="Notification subject"
                                value={notificationDetails.subject}
                                onChange={(e) =>
                                  setNotificationDetails({ ...notificationDetails, subject: e.target.value })
                                }
                                fullWidth
                              />
                            </Box>

                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Message
                              </Typography>
                              <TextField
                                placeholder="Enter notification message"
                                value={notificationDetails.message}
                                onChange={(e) =>
                                  setNotificationDetails({ ...notificationDetails, message: e.target.value })
                                }
                                multiline
                                rows={6}
                                fullWidth
                              />
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={notificationDetails.includeBreakdown}
                                    onChange={(e) =>
                                      setNotificationDetails({ ...notificationDetails, includeBreakdown: e.target.checked })
                                    }
                                  />
                                }
                                label="Include per diem breakdown in notification"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={notificationDetails.sendCopy}
                                    onChange={(e) =>
                                      setNotificationDetails({ ...notificationDetails, sendCopy: e.target.checked })
                                    }
                                  />
                                }
                                label="Send copy to finance department"
                              />
                            </Box>
                          </Box>

                          <Divider />

                          <Box sx={{ p: 2, bgcolor: grey[50], borderRadius: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                              Preview
                            </Typography>
                            <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1, bgcolor: "background.paper" }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                To: {notificationDetails.recipient}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                Subject: {notificationDetails.subject}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                {notificationDetails.message}
                              </Typography>

                              {notificationDetails.includeBreakdown && (
                                <>
                                  <Divider sx={{ my: 2 }} />
                                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Per Diem Breakdown:
                                  </Typography>
                                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography variant="body2">Daily Rate:</Typography>
                                      <Typography variant="body2">
                                        {formatCurrency(perDiemDetails.dailyRate, selectedRequest.currency)}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography variant="body2">Number of Days:</Typography>
                                      <Typography variant="body2">{perDiemDetails.days}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography variant="body2">Additional Allowance:</Typography>
                                      <Typography variant="body2">
                                        {formatCurrency(perDiemDetails.additionalAllowance, selectedRequest.currency)}
                                      </Typography>
                                    </Box>
                                    <Divider sx={{ my: 0.5 }} />
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Total Amount:
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {formatCurrency(transferDetails.totalAmount, selectedRequest.currency)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "space-between", p: 2, bgcolor: grey[50] }}>
                          <Button
                            variant="outlined"
                            onClick={() => setShowNotification(false)}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ bgcolor: green[600], "&:hover": { bgcolor: green[700] } }}
                            onClick={sendNotification}
                            disabled={
                              isSendingNotification || !notificationDetails.subject || !notificationDetails.message
                            }
                          >
                            {isSendingNotification ? (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Loader2 size={16} className="animate-spin" sx={{ mr: 1 }} />
                                Sending...
                              </Box>
                            ) : (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Send size={16} sx={{ mr: 1 }} />
                                Send Notification
                              </Box>
                            )}
                          </Button>
                        </CardActions>
                      </StyledCard>
                    )}
                  </>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 256, textAlign: "center" }}>
                    <FileText size={48} sx={{ color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      No Request Selected
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select a travel request from the list to view details
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}