"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format, parseISO, differenceInDays } from "date-fns"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  History,
  Info,
  Loader2,
  MapPin,
  MoreHorizontal,
  Receipt,
  RefreshCw,
  Search,
  Send,
  X,
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
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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

const StatusBadge = styled(Chip)(({ status }) => ({
  backgroundColor: status === "pending" ? amber[50] : status === "clarification-requested" ? blue[50] : status === "approved" ? green[50] : red[50],
  color: status === "pending" ? amber[700] : status === "clarification-requested" ? blue[700] : status === "approved" ? green[700] : red[700],
  border: `1px solid ${status === "pending" ? amber[200] : status === "clarification-requested" ? blue[200] : status === "approved" ? green[200] : red[200]}`,
}))

const ExpenseStatusBadge = styled(Chip)(({ status }) => ({
  backgroundColor: status === "pending" ? amber[50] : status === "approved" ? green[50] : red[50],
  color: status === "pending" ? amber[700] : status === "approved" ? green[700] : red[700],
  border: `1px solid ${status === "pending" ? amber[200] : status === "approved" ? green[200] : red[200]}`,
}))

const PriorityBadge = styled(Chip)(({ priority }) => ({
  backgroundColor: priority === "high" ? red[500] : priority === "medium" ? amber[500] : green[500],
  color: "white",
}))

export default function FinanceReconciliationReview() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedReconciliation, setSelectedReconciliation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showClarificationForm, setShowClarificationForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isSendingClarification, setIsSendingClarification] = useState(false)
  const [currentExpense, setCurrentExpense] = useState(null)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
     const [alertMessage, setAlertMessage] = useState(null)
     const [showAlert, setShowAlert] = useState(false)
      const [isLoading, setIsLoading] = useState(true)
       const [snackbarMessage, setSnackbarMessage] = useState("")
       const [snackbarSeverity, setSnackbarSeverity] = useState("success")
         const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState({
    internalNotes: "",
    expenseNotes: {},
    approvalDecision: "approve",
    reimbursementMethod: "bank-transfer",
    reimbursementAmount: 0,
    reimbursementCurrency: "",
    reimbursementDate: format(new Date(), "yyyy-MM-dd"),
  })

  const [clarificationRequest, setClarificationRequest] = useState({
    reason: "",
    details: "",
    requestedItems: [],
    dueDate: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"), // 3 days from now
  })

  const transformRequestData = (apiData) => {
    return apiData.map(recon => {
      const today = new Date();
      const departureDate = recon.departureDate ? new Date(recon.departureDate) : new Date();
      const returnDate = recon.returnDate ? new Date(recon.returnDate) : new Date(departureDate.getTime() + 86400000);
      
      const isCompleted = returnDate < today;
      const isActive = (today >= departureDate) && (today <= returnDate);
      const isFinanceProcessed = recon.financeStatus === "processed";
      const isReconciled = recon.reconciled || false;
      
      let status;
    if (recon.status === "pending_reconciliation") {
      status = "pending_reconciliation";
    } else if (isReconciled) {
      status = "clarified";
    } else if (isCompleted) {
      status = "approved";
    } else {
      status = "rejected";
    }

  
      const totalSpent = recon.payment?.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
      const perDiemAmount = recon.payment?.perDiemAmount || (recon.currency === "MWK" ? 100000 : 1000);
  
      return {
        id: recon._id,
        employeeName: recon.employee?.name || 'Unknown Employee',
        employeeId: recon.employee._id,
        department: recon.employee?.department || "Unknown Department",
        purpose: recon.purpose,
        country: recon.travelType === "international" ? "International" : recon.location || "Local",
        city: recon.location || "Local",
        departureDate: departureDate,
        returnDate: returnDate,
        status: status,
        reconciled: isReconciled,
        perDiemAmount: perDiemAmount,
        currency: recon.currency || "USD",
        submittedDate: new Date(recon.reconciliation?.submittedDate || recon.createdAt),
        totalExpenses: totalSpent,
        remainingBalance: perDiemAmount - totalSpent,
        tripReport: recon.reconciliation?.tripReport || "No trip report submitted",
        additionalNotes: recon.reconciliation?.notes || "",
        expenses: recon.payment?.expenses?.map(exp => ({
          id: exp._id || Math.random().toString(36).substr(2, 9),
          category: exp.category || "Miscellaneous",
          description: exp.description || "No description",
          amount: exp.amount || 0,
          currency: recon.currency || "USD",
          date: new Date(exp.date || recon.departureDate),
          paymentMethod: exp.paymentMethod || "card",
          receipt: exp.receipt || null,
          status: exp.status || "recorded"
        })) || [],
        reconciliation: isReconciled ? {
          submittedDate: new Date(recon.reconciliation?.submittedDate || recon.updatedAt),
          approvedDate: recon.reconciliation?.approvedDate ? new Date(recon.reconciliation.approvedDate) : null,
          approvedBy: recon.reconciliation?.approvedBy || recon.finalApprover,
          totalSpent: totalSpent,
          remainingBalance: perDiemAmount - totalSpent,
          status: recon.reconciliation?.status || "pending",
          notes: recon.reconciliation?.notes || ""
        } : null
      };
    });
  };
  const [travelRequests, setTravelRequests] = useState([])

  // Sample data for reconciliations (same as original)
  const reconciliations = [
    // ... (same reconciliation data as original)
  ]

  // Filter reconciliations based on search query and department filter
  const filteredReconciliations = reconciliations.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.tripId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      filterDepartment === "all" || rec.department.toLowerCase() === filterDepartment.toLowerCase()

    return matchesSearch && matchesDepartment
  })

  // Set default selected reconciliation if none is selected
  useEffect(() => {
    if (!selectedReconciliation && filteredReconciliations.length > 0) {
      setSelectedReconciliation(filteredReconciliations[0])

      // Initialize review notes
      if (filteredReconciliations[0]) {
        setReviewNotes({
          internalNotes: "",
          expenseNotes: {},
          approvalDecision: "approve",
          reimbursementMethod: filteredReconciliations[0].remainingBalance < 0 ? "bank-transfer" : "n/a",
          reimbursementAmount:
            filteredReconciliations[0].remainingBalance < 0 ? Math.abs(filteredReconciliations[0].remainingBalance) : 0,
          reimbursementCurrency: filteredReconciliations[0].currency,
          reimbursementDate: format(new Date(), "yyyy-MM-dd"),
        })
      }
    }
  }, [filteredReconciliations, selectedReconciliation])

  // Handle selecting a reconciliation
  const handleSelectReconciliation = (reconciliation) => {
    setSelectedReconciliation(reconciliation)
    setShowReviewForm(false)
    setShowClarificationForm(false)

    // Initialize review notes
    setReviewNotes({
      internalNotes: "",
      expenseNotes: {},
      approvalDecision: "approve",
      reimbursementMethod: reconciliation.remainingBalance < 0 ? "bank-transfer" : "n/a",
      reimbursementAmount: reconciliation.remainingBalance < 0 ? Math.abs(reconciliation.remainingBalance) : 0,
      reimbursementCurrency: reconciliation.currency,
      reimbursementDate: format(new Date(), "yyyy-MM-dd"),
    })

    // Initialize clarification request
    setClarificationRequest({
      reason: "",
      details: "",
      requestedItems: [],
      dueDate: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"), // 3 days from now
    })
  }

  // Handle expense note change
  const handleExpenseNoteChange = (expenseId, note) => {
    setReviewNotes({
      ...reviewNotes,
      expenseNotes: {
        ...reviewNotes.expenseNotes,
        [expenseId]: note,
      },
    })
  }

  // Handle requested item toggle
  const handleRequestedItemToggle = (item) => {
    const currentItems = [...clarificationRequest.requestedItems]
    const itemIndex = currentItems.indexOf(item)

    if (itemIndex >= 0) {
      currentItems.splice(itemIndex, 1)
    } else {
      currentItems.push(item)
    }

    setClarificationRequest({
      ...clarificationRequest,
      requestedItems: currentItems,
    })
  }

  // Process reconciliation approval
  const handleApproveReconciliation = () => {
    setIsApproving(true)

    // Simulate API call
    setTimeout(() => {
      // Update the selected reconciliation status to approved
      const updatedReconciliation = {
        ...selectedReconciliation,
        status: reviewNotes.approvalDecision === "approve" ? "approved" : "rejected",
        approvalDetails:
          reviewNotes.approvalDecision === "approve"
            ? {
                approvedBy: "Sarah Johnson",
                approvedDate: format(new Date(), "yyyy-MM-dd"),
                notes: reviewNotes.internalNotes,
                reimbursementMethod: reviewNotes.reimbursementMethod,
                reimbursementAmount: reviewNotes.reimbursementAmount,
                reimbursementDate: reviewNotes.reimbursementDate,
              }
            : null,
        rejectionDetails:
          reviewNotes.approvalDecision === "reject"
            ? {
                rejectedBy: "Sarah Johnson",
                rejectedDate: format(new Date(), "yyyy-MM-dd"),
                reason: "Policy violations",
                notes: reviewNotes.internalNotes,
              }
            : null,
        expenses: selectedReconciliation.expenses.map((expense) => ({
          ...expense,
          status: reviewNotes.approvalDecision === "approve" ? "approved" : "rejected",
          notes: reviewNotes.expenseNotes[expense.id] || expense.notes,
        })),
      }

      setSelectedReconciliation(updatedReconciliation)
      setIsApproving(false)
      setShowReviewForm(false)

      // Switch to the appropriate tab
      setActiveTab(reviewNotes.approvalDecision === "approve" ? "approved" : "rejected")
    }, 2000)
  }

  // Send clarification request
  const handleSendClarification = () => {
    setIsSendingClarification(true)

    // Simulate API call
    setTimeout(() => {
      // Update the selected reconciliation status to clarification-requested
      const updatedReconciliation = {
        ...selectedReconciliation,
        status: "clarification-requested",
        clarificationRequest: {
          requestedBy: "Sarah Johnson",
          requestedDate: format(new Date(), "yyyy-MM-dd"),
          reason: clarificationRequest.reason,
          details: clarificationRequest.details,
          requestedItems: clarificationRequest.requestedItems,
          dueDate: clarificationRequest.dueDate,
          status: "pending",
        },
      }

      setSelectedReconciliation(updatedReconciliation)
      setIsSendingClarification(false)
      setShowClarificationForm(false)

      // Switch to the clarification tab
      setActiveTab("clarification")
    }, 1500)
  }

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Calculate travel days
  const calculateTravelDays = (departureDate, returnDate) => {
    return differenceInDays(parseISO(returnDate), parseISO(departureDate)) + 1
  }

  // Check if an expense amount is unusual (for demo purposes)
  const isExpenseUnusual = (expense) => {
    // For demo purposes, flag expenses over certain thresholds by category
    const thresholds = {
      Meals: 100,
      Entertainment: 150,
      Transportation: 50,
      Accommodation: 200,
      Miscellaneous: 50,
    }

    return expense.amount > (thresholds[expense.category] || 100)
  }

  // Check if an expense is missing a receipt
  const isReceiptMissing = (expense) => {
    return !expense.receipt
  }


    useEffect(() => {
      const fetchPendingReconciliations = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          console.log(token)
          const response = await fetch(
            "https://hrms-6s3i.onrender.com/api/travel-requests/pending/recon",
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
    
      fetchPendingReconciliations();
    }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1fr 2fr" }, gap: 3 }}>
            {/* Left Column - Reconciliations List */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ p: 1, borderRadius: "50%", bgcolor: blue[50] }}>
              <FileCheck size={20} color={blue[600]} />
            </Box>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
              Finance Department Reconciliations Review 
            </Typography>
          </Box>
                <Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Filter size={16} />
                      <span>Filter</span>
                    </Box>
                  )}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                </Select>
              </Box>

              <TextField
                placeholder="Search reconciliations..."
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
  <StyledTab value="clarification" label="Clarification" />
  <StyledTab value="approved" label="Approved" />
  <StyledTab value="rejected" label="Rejected" />
</StyledTabs>

              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              {filteredReconciliations.filter((recon) => 
  (activeTab === "pending" && (recon.status === "pending" || recon.status === "pending_reconciliation")) ||
  (activeTab !== "pending" && recon.status === activeTab)
).length === 0 ? (
  <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
    No {activeTab} reconciliations found
  </Box>
)  : (
                  filteredReconciliations
                  .filter((recon) => 
                    (activeTab === "pending" && (recon.status === "pending" || recon.status === "pending_reconciliation")) ||
                    (activeTab !== "pending" && recon.status === activeTab)
                  )
                    .map((reconciliation) => (
                      <StyledCard
                        key={reconciliation.id}
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s",
                          border: selectedReconciliation?.id === reconciliation.id ? `1px solid ${blue[300]}` : "1px solid transparent",
                          boxShadow: selectedReconciliation?.id === reconciliation.id ? 3 : 0,
                          "&:hover": {
                            borderColor: blue[200]
                          }
                        }}
                        onClick={() => handleSelectReconciliation(reconciliation)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {reconciliation.employeeName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {reconciliation.id}
                              </Typography>
                            </Box>
                            <StatusBadge 
  label={
    reconciliation.status === "pending_reconciliation" ? "Pending Reconciliation" :
    reconciliation.status === "pending" ? "Pending Review" : 
    reconciliation.status === "clarification-requested" ? "Clarification Requested" :
    reconciliation.status === "approved" ? "Approved" : "Rejected"
  } 
  status={
    reconciliation.status === "pending_reconciliation" ? "pending" :
    reconciliation.status
  } 
  size="small" 
/>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Globe size={16} sx={{ mr: 0.5, color: "text.secondary" }} />
                            <Typography variant="body2">
                              {reconciliation.city}, {reconciliation.country}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Calendar size={16} sx={{ mr: 0.5, color: "text.secondary" }} />
                            <Typography variant="body2">
                              {format(parseISO(reconciliation.departureDate), "MMM d")} - {format(parseISO(reconciliation.returnDate), "MMM d, yyyy")}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={reconciliation.department}
                                size="small"
                                sx={{ bgcolor: blue[50], color: blue[700], border: `1px solid ${blue[200]}` }}
                              />
                              <Box sx={{ p: 0.5, borderRadius: "50%", bgcolor: blue[100] }}>
                                <Receipt size={12} sx={{ color: blue[600] }} />
                              </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Submitted: {format(parseISO(reconciliation.submittedDate), "MMM d, yyyy")}
                            </Typography>
                          </Box>
                        </CardContent>
                      </StyledCard>
                    ))
                )}
              </Box>
            </Box>

            {/* Right Column - Reconciliation Details and Actions */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {selectedReconciliation ? (
                <>
                  {/* Reconciliation Details */}
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
                          <Typography variant="h6">{selectedReconciliation.purpose}</Typography>
                          <StatusBadge label={selectedReconciliation.status === "pending" ? "Pending Review" : 
                                            selectedReconciliation.status === "clarification-requested" ? "Clarification Requested" :
                                            selectedReconciliation.status === "approved" ? "Approved" : "Rejected"} 
                                      status={selectedReconciliation.status} size="small" />
                        </Box>
                      }
                      subheader={`${selectedReconciliation.id} • ${selectedReconciliation.tripId} • ${selectedReconciliation.department}`}
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
                              Employee Information
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                              <Avatar>
                                {selectedReconciliation.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {selectedReconciliation.employeeName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {selectedReconciliation.employeeId} • {selectedReconciliation.email}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Trip Details
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <MapPin size={16} sx={{ mr: 1, color: blue[600] }} />
                                <Typography>
                                  {selectedReconciliation.city}, {selectedReconciliation.country}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Calendar size={16} sx={{ mr: 1, color: blue[600] }} />
                                <Typography>
                                  {format(parseISO(selectedReconciliation.departureDate), "MMM d, yyyy")} -{" "}
                                  {format(parseISO(selectedReconciliation.returnDate), "MMM d, yyyy")}
                                  <Chip
                                    label={`${calculateTravelDays(
                                      selectedReconciliation.departureDate,
                                      selectedReconciliation.returnDate,
                                    )} days`}
                                    size="small"
                                    sx={{ ml: 1, bgcolor: grey[100] }}
                                  />
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Clock size={16} sx={{ mr: 1, color: blue[600] }} />
                                <Typography>
                                  Submitted on {format(parseISO(selectedReconciliation.submittedDate), "MMMM d, yyyy")}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Financial Summary
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>Per Diem Allowance:</Typography>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {formatCurrency(
                                    selectedReconciliation.perDiemAmount,
                                    selectedReconciliation.currency,
                                  )}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>Total Expenses:</Typography>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {formatCurrency(
                                    selectedReconciliation.totalExpenses,
                                    selectedReconciliation.currency,
                                  )}
                                </Typography>
                              </Box>
                              <Divider sx={{ my: 0.5 }} />
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>Remaining Balance:</Typography>
                                <Typography sx={{ 
                                  fontWeight: 500,
                                  color: selectedReconciliation.remainingBalance < 0 ? red[600] : green[600]
                                }}>
                                  {formatCurrency(
                                    selectedReconciliation.remainingBalance,
                                    selectedReconciliation.currency,
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="caption" color="text.secondary">0</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatCurrency(
                                    selectedReconciliation.perDiemAmount,
                                    selectedReconciliation.currency,
                                  )}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (selectedReconciliation.totalExpenses / selectedReconciliation.perDiemAmount) * 100
                                }
                                sx={{ 
                                  height: 4,
                                  backgroundColor: grey[200],
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: selectedReconciliation.totalExpenses > selectedReconciliation.perDiemAmount ? red[500] : blue[500]
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Trip Report
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: grey[50], mt: 1 }}>
                              <Typography variant="body2">
                                {selectedReconciliation.tripReport}
                              </Typography>
                            </Paper>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Additional Notes
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: grey[50], mt: 1 }}>
                              <Typography variant="body2">
                                {selectedReconciliation.additionalNotes || "No additional notes provided."}
                              </Typography>
                            </Paper>
                          </Box>

                          {selectedReconciliation.status === "clarification-requested" &&
                            selectedReconciliation.clarificationRequest && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Clarification Request
                                </Typography>
                                <Paper sx={{ p: 2, bgcolor: blue[50], border: "1px solid", borderColor: blue[200], mt: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, color: blue[800] }}>
                                    {selectedReconciliation.clarificationRequest.reason}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: blue[700], mt: 1 }}>
                                    {selectedReconciliation.clarificationRequest.details}
                                  </Typography>
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" sx={{ color: blue[600] }}>Requested items:</Typography>
                                    <ul style={{ listStyleType: "disc", paddingLeft: 20 }}>
                                      {selectedReconciliation.clarificationRequest.requestedItems.map((item, index) => (
                                        <li key={index}>
                                          <Typography variant="caption" sx={{ color: blue[700] }}>{item}</Typography>
                                        </li>
                                      ))}
                                    </ul>
                                  </Box>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                    <Typography variant="caption" sx={{ color: blue[600] }}>
                                      Requested by: {selectedReconciliation.clarificationRequest.requestedBy}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: blue[600] }}>
                                      Due: {format(parseISO(selectedReconciliation.clarificationRequest.dueDate), "MMM d, yyyy")}
                                    </Typography>
                                  </Box>
                                </Paper>
                              </Box>
                            )}

                          {selectedReconciliation.status === "approved" && selectedReconciliation.approvalDetails && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Approval Details
                              </Typography>
                              <Paper sx={{ p: 2, bgcolor: green[50], border: "1px solid", borderColor: green[200], mt: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <CheckCircle2 size={16} color={green[600]} />
                                  <Typography variant="body2" sx={{ fontWeight: 500, color: green[800] }}>
                                    Approved by {selectedReconciliation.approvalDetails.approvedBy}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: green[700], mt: 1 }}>
                                  {selectedReconciliation.approvalDetails.notes}
                                </Typography>
                                {selectedReconciliation.approvalDetails.reimbursementMethod !== "n/a" && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" sx={{ color: green[600] }}>Reimbursement Details:</Typography>
                                    <Typography variant="body2" sx={{ color: green[700], mt: 0.5 }}>
                                      {formatCurrency(
                                        selectedReconciliation.approvalDetails.reimbursementAmount,
                                        selectedReconciliation.currency,
                                      )}{" "}
                                      via {selectedReconciliation.approvalDetails.reimbursementMethod}
                                    </Typography>
                                    {selectedReconciliation.approvalDetails.reimbursementDate && (
                                      <Typography variant="caption" sx={{ color: green[600], mt: 0.5 }}>
                                        Processed on:{" "}
                                        {format(
                                          parseISO(selectedReconciliation.approvalDetails.reimbursementDate),
                                          "MMMM d, yyyy",
                                        )}
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Paper>
                            </Box>
                          )}

                          {selectedReconciliation.status === "rejected" && selectedReconciliation.rejectionDetails && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Rejection Details
                              </Typography>
                              <Paper sx={{ p: 2, bgcolor: red[50], border: "1px solid", borderColor: red[200], mt: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <X size={16} color={red[600]} />
                                  <Typography variant="body2" sx={{ fontWeight: 500, color: red[800] }}>
                                    Rejected by {selectedReconciliation.rejectionDetails.rejectedBy}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: red[700], mt: 1 }}>
                                  Reason: {selectedReconciliation.rejectionDetails.reason}
                                </Typography>
                                <Typography variant="body2" sx={{ color: red[700], mt: 1 }}>
                                  {selectedReconciliation.rejectionDetails.notes}
                                </Typography>
                              </Paper>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {selectedReconciliation.status === "pending" || selectedReconciliation.status === "pending_reconciliation" ? (
                        <Alert severity="warning" sx={{ bgcolor: amber[50], borderColor: amber[200], color: amber[800], mt: 2 }}>
                          <AlertTitle sx={{ color: amber[700] }}>Action Required</AlertTitle>
                          This reconciliation requires your review. Please check all expenses and the trip report for
                          accuracy and compliance with company policy.
                        </Alert>
                     ):null}
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between", p: 2, bgcolor: grey[50] }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/travel-dashboard")}
                      >
                        Back to Dashboard
                      </Button>

                      {(selectedReconciliation.status === "pending" || selectedReconciliation.status === "pending_reconciliation") && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            sx={{ borderColor: blue[200], color: blue[700], "&:hover": { bgcolor: blue[50] } }}
                            onClick={() => setShowClarificationForm(true)}
                            startIcon={<HelpCircle size={16} />}
                          >
                            Request Clarification
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => setShowReviewForm(true)}
                            startIcon={<FileCheck size={16} />}
                          >
                            Review & Process
                          </Button>
                        </Box>
                      )}

                      {selectedReconciliation.status === "clarification-requested" && (
                        <Button
                          variant="outlined"
                          sx={{ borderColor: blue[200], color: blue[700], "&:hover": { bgcolor: blue[50] } }}
                          startIcon={<History size={16} />}
                        >
                          View Clarification History
                        </Button>
                      )}

                      {selectedReconciliation.status === "approved" && (
                        <Button
                          variant="outlined"
                          sx={{ borderColor: green[200], color: green[700], "&:hover": { bgcolor: green[50] } }}
                          startIcon={<Download size={16} />}
                        >
                          Download Approval Report
                        </Button>
                      )}

                      {selectedReconciliation.status === "rejected" && (
                        <Button
                          variant="outlined"
                          sx={{ borderColor: red[200], color: red[700], "&:hover": { bgcolor: red[50] } }}
                          startIcon={<History size={16} />}
                        >
                          View Rejection Details
                        </Button>
                      )}
                    </CardActions>
                  </StyledCard>

                  {/* Expenses List */}
                  <StyledCard>
                    <CardHeader
                      sx={{
                        bgcolor: grey[100],
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        pb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      avatar={
                        <Box sx={{ p: 1, borderRadius: "50%", bgcolor: blue[100] }}>
                          <Receipt size={20} color={blue[600]} />
                        </Box>
                      }
                      title="Expenses"
                      action={
                        <Chip
                          label={`${selectedReconciliation.expenses.length} items`}
                          size="small"
                          sx={{ bgcolor: blue[50], color: blue[700], border: `1px solid ${blue[200]}` }}
                        />
                      }
                    />
                    <CardContent sx={{ p: 0 }}>
                      {selectedReconciliation.expenses.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>No expenses recorded</Box>
                      ) : (
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Receipt</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedReconciliation.expenses.map((expense) => (
                                <TableRow 
                                  key={expense.id} 
                                  sx={{ 
                                    bgcolor: isExpenseUnusual(expense) ? amber[50] : "inherit",
                                    "&:hover": {
                                      bgcolor: grey[100]
                                    }
                                  }}
                                >
                                  <TableCell>
                                    {format(parseISO(expense.date), "MMM d, yyyy")}
                                  </TableCell>
                                  <TableCell>{expense.category}</TableCell>
                                  <TableCell>{expense.description}</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                                    {formatCurrency(expense.amount, selectedReconciliation.currency)}
                                    {isExpenseUnusual(expense) && (
                                      <Tooltip title="Unusually high amount for this category">
                                        <AlertCircle size={16} sx={{ color: amber[500], ml: 0.5, verticalAlign: "middle" }} />
                                      </Tooltip>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <ExpenseStatusBadge 
                                      label={expense.status === "pending" ? "Pending" : expense.status === "approved" ? "Approved" : "Rejected"} 
                                      status={expense.status} 
                                      size="small" 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {expense.receipt ? (
                                      <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => {
                                          setCurrentExpense(expense)
                                          setShowReceiptDialog(true)
                                        }}
                                        startIcon={<Eye size={16} />}
                                      >
                                        View
                                      </Button>
                                    ) : (
                                      <Chip
                                        label="Missing"
                                        size="small"
                                        sx={{ bgcolor: red[50], color: red[700], border: `1px solid ${red[200]}` }}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="text"
                                      size="small"
                                      sx={{ minWidth: 32, height: 32 }}
                                    >
                                      <MoreHorizontal size={16} />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow sx={{ bgcolor: grey[100], fontWeight: 500 }}>
                                <TableCell colSpan={3} align="right">Total</TableCell>
                                <TableCell align="right">
                                  {formatCurrency(selectedReconciliation.totalExpenses, selectedReconciliation.currency)}
                                </TableCell>
                                <TableCell colSpan={3}></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </CardContent>
                  </StyledCard>

                  {/* Review Form */}
                  {showReviewForm && (
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
                            <FileCheck size={20} color={green[600]} />
                          </Box>
                        }
                        title="Review & Process Reconciliation"
                        subheader={`Review and process ${selectedReconciliation.employeeName}'s reconciliation for ${selectedReconciliation.city}`}
                      />
                      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Decision
                            </Typography>
                            <RadioGroup
                              value={reviewNotes.approvalDecision}
                              onChange={(e) => setReviewNotes({ ...reviewNotes, approvalDecision: e.target.value })}
                              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}
                            >
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  border: "1px solid",
                                  borderColor: reviewNotes.approvalDecision === "approve" ? green[300] : grey[300],
                                  borderRadius: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  "&:hover": {
                                    bgcolor: grey[100]
                                  }
                                }}
                              >
                                <Radio
                                  value="approve"
                                  checked={reviewNotes.approvalDecision === "approve"}
                                  sx={{
                                    color: green[500],
                                    "&.Mui-checked": {
                                      color: green[500],
                                    },
                                  }}
                                />
                                <Typography sx={{ flex: 1 }}>Approve Reconciliation</Typography>
                              </Paper>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  border: "1px solid",
                                  borderColor: reviewNotes.approvalDecision === "reject" ? red[300] : grey[300],
                                  borderRadius: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  "&:hover": {
                                    bgcolor: grey[100]
                                  }
                                }}
                              >
                                <Radio
                                  value="reject"
                                  checked={reviewNotes.approvalDecision === "reject"}
                                  sx={{
                                    color: red[500],
                                    "&.Mui-checked": {
                                      color: red[500],
                                    },
                                  }}
                                />
                                <Typography sx={{ flex: 1 }}>Reject Reconciliation</Typography>
                              </Paper>
                            </RadioGroup>
                          </Box>

                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Internal Notes
                            </Typography>
                            <TextField
                              placeholder="Add notes about this reconciliation (visible to finance team only)"
                              value={reviewNotes.internalNotes}
                              onChange={(e) => setReviewNotes({ ...reviewNotes, internalNotes: e.target.value })}
                              multiline
                              rows={4}
                              fullWidth
                            />
                          </Box>

                          {selectedReconciliation.remainingBalance < 0 &&
                            reviewNotes.approvalDecision === "approve" && (
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Divider />
                                <Typography variant="subtitle2">Reimbursement Details</Typography>

                                <Box>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    Reimbursement Method
                                  </Typography>
                                  <Select
                                    value={reviewNotes.reimbursementMethod}
                                    onChange={(e) =>
                                      setReviewNotes({ ...reviewNotes, reimbursementMethod: e.target.value })
                                    }
                                    fullWidth
                                  >
                                    <MenuItem value="bank-transfer">Bank Transfer</MenuItem>
                                    <MenuItem value="payroll">Add to Next Payroll</MenuItem>
                                    <MenuItem value="check">Check</MenuItem>
                                  </Select>
                                </Box>

                                <Box>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    Reimbursement Amount
                                  </Typography>
                                  <TextField
                                    type="number"
                                    value={reviewNotes.reimbursementAmount}
                                    onChange={(e) =>
                                      setReviewNotes({
                                        ...reviewNotes,
                                        reimbursementAmount: Number.parseFloat(e.target.value),
                                      })
                                    }
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {selectedReconciliation.currency}
                                        </InputAdornment>
                                      ),
                                    }}
                                    fullWidth
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    Default:{" "}
                                    {formatCurrency(
                                      Math.abs(selectedReconciliation.remainingBalance),
                                      selectedReconciliation.currency,
                                    )}
                                  </Typography>
                                </Box>

                                <Box>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    Processing Date
                                  </Typography>
                                  <TextField
                                    type="date"
                                    value={reviewNotes.reimbursementDate}
                                    onChange={(e) =>
                                      setReviewNotes({ ...reviewNotes, reimbursementDate: e.target.value })
                                    }
                                    fullWidth
                                  />
                                </Box>

                                <Paper sx={{ p: 2, bgcolor: blue[50], border: "1px solid", borderColor: blue[200] }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Info size={16} color={blue[600]} />
                                    <Typography variant="subtitle2" sx={{ color: blue[800] }}>
                                      Payment Details
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ color: blue[700] }}>
                                    <Box component="span" sx={{ fontWeight: 500 }}>Account Name:</Box>{" "}
                                    {selectedReconciliation.bankDetails.accountName}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: blue[700] }}>
                                    <Box component="span" sx={{ fontWeight: 500 }}>Account Number:</Box>{" "}
                                    {selectedReconciliation.bankDetails.accountNumber}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: blue[700] }}>
                                    <Box component="span" sx={{ fontWeight: 500 }}>Bank:</Box>{" "}
                                    {selectedReconciliation.bankDetails.bankName}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: blue[700] }}>
                                    <Box component="span" sx={{ fontWeight: 500 }}>Routing Number:</Box>{" "}
                                    {selectedReconciliation.bankDetails.routingNumber}
                                  </Typography>
                                </Paper>
                              </Box>
                            )}

                          {selectedReconciliation.remainingBalance > 0 &&
                            reviewNotes.approvalDecision === "approve" && (
                              <Alert severity="success" sx={{ bgcolor: green[50], borderColor: green[200], color: green[800] }}>
                                <AlertTitle sx={{ color: green[700] }}>Remaining Balance</AlertTitle>
                                The employee has a remaining balance of{" "}
                                {formatCurrency(
                                  selectedReconciliation.remainingBalance,
                                  selectedReconciliation.currency,
                                )}
                                . This amount will be returned to the company account.
                              </Alert>
                            )}

                          {reviewNotes.approvalDecision === "reject" && (
                            <Alert severity="error" sx={{ bgcolor: red[50], borderColor: red[200], color: red[800] }}>
                              <AlertTitle sx={{ color: red[700] }}>Rejection Notice</AlertTitle>
                              The employee will be notified that their reconciliation has been rejected. They will
                              need to resubmit with corrections.
                            </Alert>
                          )}
                        </Box>

                        <Divider />

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Typography variant="subtitle2">Expense Review</Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {selectedReconciliation.expenses.map((expense) => (
                              <Paper
                                key={expense.id}
                                sx={{
                                  p: 2,
                                  border: "1px solid",
                                  borderColor: isExpenseUnusual(expense) ? amber[200] : grey[200],
                                  bgcolor: isExpenseUnusual(expense) ? amber[50] : "inherit"
                                }}
                              >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                  <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                      {expense.category}: {expense.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {format(parseISO(expense.date), "MMMM d, yyyy")}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                      {formatCurrency(expense.amount, selectedReconciliation.currency)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Payment: {expense.paymentMethod}
                                    </Typography>
                                  </Box>
                                </Box>

                                {isExpenseUnusual(expense) && (
                                 <Alert severity="warning" sx={{ bgcolor: amber[50], borderColor: amber[200], color: amber[800], mb: 1 }}>
                                 <AlertTitle sx={{ color: amber[600] }}>Warning</AlertTitle>
                                 This expense amount is unusually high for this category.
                               </Alert>
                                )}

                                {isReceiptMissing(expense) && (
                                 <Alert severity="error" sx={{ bgcolor: red[50], borderColor: red[200], color: red[800], mb: 1 }}>
                                 <AlertTitle sx={{ color: red[600] }}>Error</AlertTitle>
                                 Receipt is missing for this expense.
                               </Alert>
                                )}

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                                  <TextField
                                    placeholder="Add notes for this expense"
                                    value={reviewNotes.expenseNotes[expense.id] || ""}
                                    onChange={(e) => handleExpenseNoteChange(expense.id, e.target.value)}
                                    fullWidth
                                    size="small"
                                  />
                                  <RadioGroup
                                    value={reviewNotes.expenseNotes[expense.id] ? "flagged" : "approved"}
                                    onChange={(e) => {
                                      if (e.target.value === "flagged" && !reviewNotes.expenseNotes[expense.id]) {
                                        handleExpenseNoteChange(expense.id, "Flagged for review")
                                      } else if (e.target.value === "approved") {
                                        handleExpenseNoteChange(expense.id, "")
                                      }
                                    }}
                                    sx={{ display: "flex", gap: 2 }}
                                  >
                                    <FormControlLabel
                                      value="approved"
                                      control={<Radio size="small" sx={{ color: green[500] }} />}
                                      label={<Typography variant="caption">Approve</Typography>}
                                    />
                                    <FormControlLabel
                                      value="flagged"
                                      control={<Radio size="small" sx={{ color: amber[500] }} />}
                                      label={<Typography variant="caption">Flag</Typography>}
                                    />
                                  </RadioGroup>
                                </Box>
                              </Paper>
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "space-between", p: 2, bgcolor: grey[50] }}>
                        <Button
                          variant="outlined"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: reviewNotes.approvalDecision === "approve" ? green[600] : red[600],
                            "&:hover": {
                              bgcolor: reviewNotes.approvalDecision === "approve" ? green[700] : red[700]
                            }
                          }}
                          onClick={handleApproveReconciliation}
                          disabled={isApproving}
                        >
                          {isApproving ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Loader2 size={16} className="animate-spin" sx={{ mr: 1 }} />
                              Processing...
                            </Box>
                          ) : (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {reviewNotes.approvalDecision === "approve" ? (
                                <>
                                  <Check size={16} sx={{ mr: 1 }} />
                                  Approve Reconciliation
                                </>
                              ) : (
                                <>
                                  <X size={16} sx={{ mr: 1 }} />
                                  Reject Reconciliation
                                </>
                              )}
                            </Box>
                          )}
                        </Button>
                      </CardActions>
                    </StyledCard>
                  )}

                  {/* Clarification Request Form */}
                  {showClarificationForm && (
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
                            <HelpCircle size={20} color={blue[600]} />
                          </Box>
                        }
                        title="Request Clarification"
                        subheader={`Request additional information from ${selectedReconciliation.employeeName}`}
                      />
                      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Reason for Clarification
                            </Typography>
                            <Select
                              value={clarificationRequest.reason}
                              onChange={(e) =>
                                setClarificationRequest({ ...clarificationRequest, reason: e.target.value })
                              }
                              fullWidth
                            >
                              <MenuItem value="Missing documentation">Missing documentation</MenuItem>
                              <MenuItem value="Policy violation">Policy violation</MenuItem>
                              <MenuItem value="Incomplete information">Incomplete information</MenuItem>
                              <MenuItem value="Expense discrepancy">Expense discrepancy</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                          </Box>

                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Clarification Details
                            </Typography>
                            <TextField
                              placeholder="Provide detailed information about what needs to be clarified"
                              value={clarificationRequest.details}
                              onChange={(e) =>
                                setClarificationRequest({ ...clarificationRequest, details: e.target.value })
                              }
                              multiline
                              rows={6}
                              fullWidth
                            />
                          </Box>

                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Requested Items
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={clarificationRequest.requestedItems.includes("Missing receipts")}
                                    onChange={(e) => handleRequestedItemToggle("Missing receipts")}
                                  />
                                }
                                label="Missing receipts"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={clarificationRequest.requestedItems.includes("Expense justification")}
                                    onChange={(e) => handleRequestedItemToggle("Expense justification")}
                                  />
                                }
                                label="Expense justification"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={clarificationRequest.requestedItems.includes("Policy explanation")}
                                    onChange={(e) => handleRequestedItemToggle("Policy explanation")}
                                  />
                                }
                                label="Policy explanation"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={clarificationRequest.requestedItems.includes("Additional documentation")}
                                    onChange={(e) => handleRequestedItemToggle("Additional documentation")}
                                  />
                                }
                                label="Additional documentation"
                              />
                            </Box>
                          </Box>

                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Response Due Date
                            </Typography>
                            <TextField
                              type="date"
                              value={clarificationRequest.dueDate}
                              onChange={(e) =>
                                setClarificationRequest({ ...clarificationRequest, dueDate: e.target.value })
                              }
                              fullWidth
                            />
                            <Typography variant="caption" color="text.secondary">
                              Default: 3 business days from today
                            </Typography>
                          </Box>
                        </Box>

                        <Alert severity="info" sx={{ bgcolor: blue[50], borderColor: blue[200], color: blue[800] }}>
                          <AlertTitle sx={{ color: blue[700] }}>Notification</AlertTitle>
                          An email will be sent to {selectedReconciliation.employeeName} (
                          {selectedReconciliation.email}) with your clarification request.
                        </Alert>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "space-between", p: 2, bgcolor: grey[50] }}>
                        <Button
                          variant="outlined"
                          onClick={() => setShowClarificationForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: blue[600], "&:hover": { bgcolor: blue[700] } }}
                          onClick={handleSendClarification}
                          disabled={
                            isSendingClarification ||
                            !clarificationRequest.reason ||
                            !clarificationRequest.details ||
                            clarificationRequest.requestedItems.length === 0
                          }
                        >
                          {isSendingClarification ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Loader2 size={16} className="animate-spin" sx={{ mr: 1 }} />
                              Sending...
                            </Box>
                          ) : (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Send size={16} sx={{ mr: 1 }} />
                              Send Clarification Request
                            </Box>
                          )}
                        </Button>
                      </CardActions>
                    </StyledCard>
                  )}

                  {/* Receipt Dialog */}
                  <Dialog open={showReceiptDialog} onClose={() => setShowReceiptDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Receipt</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {currentExpense?.description} -{" "}
                        {currentExpense ? format(parseISO(currentExpense.date), "MMMM d, yyyy") : ""}
                      </DialogContentText>
                      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                        <Paper sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                          <img
                            src="/placeholder.svg?height=400&width=300"
                            alt="Receipt"
                            style={{ maxHeight: 400, width: "auto", objectFit: "contain" }}
                          />
                        </Paper>
                      </Box>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "space-between" }}>
                      <Button onClick={() => setShowReceiptDialog(false)}>Close</Button>
                      <Button variant="contained" startIcon={<Download size={16} />}>
                        Download
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 256, textAlign: "center" }}>
                  <FileText size={48} sx={{ color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6">No Reconciliation Selected</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select a reconciliation from the list to view details
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}