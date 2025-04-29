"use client"

import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Card,
  Chip,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material"
import {
  Check,
  Close,
  Info as InfoIcon,
  CalendarMonth,
  LocationOn,
  FlightTakeoff,
  CreditCard,
  Warning,
  VerifiedUser,
  Refresh,
  ArrowForward,
} from "@mui/icons-material"
import MuiAlert from "@mui/material/Alert"

// Snackbar Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

// Mock data for preview/development
const MOCK_TRAVEL_REQUESTS = [
  {
    _id: "1",
    employee: { _id: "e1", name: "John Smith" },
    departureDate: "2025-05-15T00:00:00.000Z",
    returnDate: "2025-05-22T00:00:00.000Z",
    location: "New York, NY",
    fundingCodes: "FIN-2025-001",
    meansOfTravel: "own",
    status: "supervisor_approved",
  },
  {
    _id: "2",
    employee: { _id: "e2", name: "Sarah Johnson" },
    departureDate: "2025-06-01T00:00:00.000Z",
    returnDate: "2025-06-05T00:00:00.000Z",
    location: "Chicago, IL",
    fundingCodes: "FIN-2025-002",
    meansOfTravel: "public_transport",
    status: "supervisor_approved",
  },
  {
    _id: "3",
    employee: { _id: "e3", name: "Michael Chen" },
    departureDate: "2025-05-20T00:00:00.000Z",
    returnDate: "2025-05-27T00:00:00.000Z",
    location: "San Francisco, CA",
    fundingCodes: "FIN-2025-003",
    meansOfTravel: "rental",
    status: "supervisor_approved",
  },
  {
    _id: "4",
    employee: { _id: "e4", name: "Emily Davis" },
    departureDate: "2025-06-10T00:00:00.000Z",
    returnDate: "2025-06-15T00:00:00.000Z",
    location: "Austin, TX",
    fundingCodes: "FIN-2025-004",
    meansOfTravel: "company",
    status: "supervisor_approved",
  },
]

const FinalApproverDashboard = () => {
  const [travelRequests, setTravelRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"

  const fetchApprovedRequests = async () => {
    setRefreshing(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${backendUrl}/api/travel-requests/supervisor-approved`, {
        headers: {
          Authorization: `Bearer ${token || "preview-token"}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch supervisor-approved travel requests")
      }

      const data = await response.json()
      setTravelRequests(data)
      setIsPreviewMode(false)
    } catch (error) {
      console.error("Failed to fetch supervisor-approved travel requests:", error)

      // Use mock data for preview/development
      setTravelRequests(MOCK_TRAVEL_REQUESTS)
      setIsPreviewMode(true)

      // Only show error in non-preview environments
      if (
        typeof window !== "undefined" &&
        window.location.hostname !== "localhost" &&
        !window.location.hostname.includes("vercel.app")
      ) {
        setSnackbarMessage("Failed to fetch supervisor-approved travel requests")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    } finally {
      // Add a small delay to simulate network request
      setTimeout(() => {
        setIsLoading(false)
        setRefreshing(false)
      }, 800)
    }
  }

  useEffect(() => {
    fetchApprovedRequests()
  }, [backendUrl])

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  const handleFinalDecision = async (id, decision) => {
    try {
      // If in preview mode, just update the UI without making API calls
      if (isPreviewMode) {
        // Update the UI by removing the approved/rejected request
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))

        // Show success message
        setSnackbarMessage(
          `Travel request ${decision === "approve" ? "approved" : "rejected"} successfully! (Preview mode)`,
        )
        setSnackbarSeverity("info")
        setSnackbarOpen(true)
        return
      }

      const token = localStorage.getItem("token")
      const finalApproverId = JSON.parse(localStorage.getItem("user") || '{"_id":"preview-user"}')._id

      const response = await fetch(`${backendUrl}/api/travel-requests/${id}/final-approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          finalApproverId,
          decision: decision === "approve" ? "approved" : "rejected",
        }),
      })

      if (response.ok) {
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))
        setSnackbarMessage(`Travel request ${decision === "approve" ? "approved" : "rejected"} successfully!`)
        setSnackbarSeverity("success")
      } else {
        const errorData = await response.json()
        console.error("Server Error:", errorData)
        setSnackbarMessage(errorData.message || "Failed to update travel request")
        setSnackbarSeverity("error")
      }
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Error updating final approval:", error)
      setSnackbarMessage("An error occurred while updating the travel request")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  const openConfirmationDialog = (id, decision) => {
    setSelectedRequestId(id)
    setSelectedDecision(decision)
    setOpenConfirmation(true)
  }

  const closeConfirmationDialog = () => {
    setOpenConfirmation(false)
  }

  const confirmDecision = () => {
    handleFinalDecision(selectedRequestId, selectedDecision)
    closeConfirmationDialog()
  }

  // Format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get travel means display text
  const getTravelMeansText = (meansCode) => {
    switch (meansCode) {
      case "own":
        return "Own Vehicle"
      case "company":
        return "Company Vehicle"
      case "rental":
        return "Rental Vehicle"
      case "public_transport":
        return "Public Transport"
      default:
        return meansCode
    }
  }

  // Get travel means icon
  const getTravelMeansIcon = (meansCode) => {
    // You could use different icons for different travel means
    // For simplicity, we're using FlightTakeoff for all
    return <FlightTakeoff fontSize="small" />
  }

  // Get status chip
  const getStatusChip = (status) => {
    switch (status) {
      case "supervisor_approved":
        return (
          <Chip
            icon={<VerifiedUser fontSize="small" />}
            label="Supervisor Approved"
            size="small"
            sx={{
              bgcolor: alpha("#1976d2", 0.1),
              color: "#1976d2",
              fontWeight: 600,
              borderRadius: "16px",
              "& .MuiChip-icon": { color: "#1976d2" },
              boxShadow: "0 2px 4px rgba(25, 118, 210, 0.1)",
              border: "1px solid",
              borderColor: alpha("#1976d2", 0.2),
            }}
          />
        )
      case "final_approved":
        return (
          <Chip
            icon={<Check fontSize="small" />}
            label="Final Approved"
            size="small"
            sx={{
              bgcolor: alpha("#2e7d32", 0.1),
              color: "#2e7d32",
              fontWeight: 600,
              borderRadius: "16px",
              "& .MuiChip-icon": { color: "#2e7d32" },
              boxShadow: "0 2px 4px rgba(46, 125, 50, 0.1)",
              border: "1px solid",
              borderColor: alpha("#2e7d32", 0.2),
            }}
          />
        )
      case "rejected":
        return (
          <Chip
            icon={<Close fontSize="small" />}
            label="Rejected"
            size="small"
            sx={{
              bgcolor: alpha("#d32f2f", 0.1),
              color: "#d32f2f",
              fontWeight: 600,
              borderRadius: "16px",
              "& .MuiChip-icon": { color: "#d32f2f" },
              boxShadow: "0 2px 4px rgba(211, 47, 47, 0.1)",
              border: "1px solid",
              borderColor: alpha("#d32f2f", 0.2),
            }}
          />
        )
      default:
        return (
          <Chip
            label={status || "Unknown"}
            size="small"
            sx={{
              bgcolor: alpha("#757575", 0.1),
              color: "#757575",
              fontWeight: 600,
              borderRadius: "16px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              border: "1px solid",
              borderColor: alpha("#757575", 0.2),
            }}
          />
        )
    }
  }

  // Get employee avatar
  const getEmployeeAvatar = (name) => {
    if (!name) return "?"
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
    return initials
  }

  // Get random background color for avatar based on name
  const getAvatarColor = (name) => {
    if (!name) return "#757575"
    const colors = [
      "#1976d2", // blue
      "#2e7d32", // green
      "#ed6c02", // orange
      "#9c27b0", // purple
      "#d32f2f", // red
      "#0288d1", // light blue
      "#388e3c", // light green
      "#f57c00", // dark orange
      "#7b1fa2", // dark purple
      "#c62828", // dark red
    ]
    const charCode = name.charCodeAt(0) || 0
    return colors[charCode % colors.length]
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: "linear-gradient(to bottom, #f5f7fa, #ffffff)" }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#6a11cb", mb: 2 }} />
        <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
          Loading travel requests...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ background: "linear-gradient(to bottom, #f5f7fa, #ffffff)", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {isPreviewMode && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              "& .MuiAlert-icon": { alignItems: "center" },
            }}
            icon={<Warning />}
          >
            Using mock data for preview. In production, this would connect to your backend API.
          </Alert>
        )}

        <Card
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 3,
            mb: 4,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(230, 235, 240, 0.9)",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
              color: "white",
              p: 4,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -30,
                right: 60,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    Final Approval Dashboard
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
                    Review and finalize supervisor-approved travel requests for your team members.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={`${travelRequests.length} Pending`}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: "bold",
                      border: "none",
                      borderRadius: "20px",
                      px: 1,
                      height: 36,
                      "& .MuiChip-label": { px: 2 },
                    }}
                  />
                  <Tooltip title="Refresh requests">
                    <IconButton
                      onClick={fetchApprovedRequests}
                      disabled={refreshing}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    p: 2,
                    flex: 1,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Pending Approvals
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {travelRequests.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    p: 2,
                    flex: 1,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Approved Today
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {isPreviewMode ? "3" : "0"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    p: 2,
                    flex: 1,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Denied Today
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {isPreviewMode ? "1" : "0"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {travelRequests.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 8,
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha("#4776E6", 0.1),
                  color: "#4776E6",
                  width: 80,
                  height: 80,
                  mb: 3,
                }}
              >
                <InfoIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                No Pending Requests
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 3 }}>
                There are currently no supervisor-approved travel requests waiting for your final approval.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Refresh />}
                onClick={fetchApprovedRequests}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Refresh
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha("#4776E6", 0.03) }}>
                    <TableCell sx={{ fontWeight: 600, py: 2.5, fontSize: "0.875rem" }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2.5, fontSize: "0.875rem" }}>Travel Period</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2.5, fontSize: "0.875rem" }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2.5, fontSize: "0.875rem" }}>Details</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2.5, fontSize: "0.875rem" }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, py: 2.5, fontSize: "0.875rem" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {travelRequests.map((request, index) => (
                    <TableRow
                      key={request._id}
                      sx={{
                        "&:hover": { bgcolor: alpha("#4776E6", 0.02) },
                        bgcolor: index % 2 === 0 ? "white" : alpha("#f5f7fa", 0.5),
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(request.employee?.name),
                              width: 40,
                              height: 40,
                              fontWeight: "bold",
                              fontSize: "1rem",
                            }}
                          >
                            {getEmployeeAvatar(request.employee?.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {request.employee?.name || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Employee ID: {request.employee?._id?.substring(0, 8) || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <CalendarMonth fontSize="small" sx={{ color: "#4776E6" }} />
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {formatDate(request.departureDate)}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                              <Box
                                sx={{
                                  height: 2,
                                  width: 8,
                                  bgcolor: "text.disabled",
                                  borderRadius: 1,
                                  mx: 0.5,
                                }}
                              />
                              <ArrowForward sx={{ fontSize: 12, color: "text.disabled", mx: 0.5 }} />
                              <Box
                                sx={{
                                  height: 2,
                                  width: 8,
                                  bgcolor: "text.disabled",
                                  borderRadius: 1,
                                  mx: 0.5,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" fontWeight={500}>
                              {formatDate(request.returnDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <LocationOn fontSize="small" sx={{ color: "#4776E6" }} />
                          <Typography variant="body2" fontWeight={500}>
                            {request.location}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {getTravelMeansIcon(request.meansOfTravel)}
                            <Typography variant="body2" fontWeight={500}>
                              {getTravelMeansText(request.meansOfTravel)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CreditCard fontSize="small" sx={{ color: "#4776E6" }} />
                            <Typography variant="body2" fontWeight={500}>
                              {request.fundingCodes}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>{getStatusChip(request.status)}</TableCell>
                      <TableCell align="right" sx={{ py: 2.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Check />}
                            onClick={() => openConfirmationDialog(request._id, "approve")}
                            sx={{
                              bgcolor: "#2e7d32",
                              "&:hover": { bgcolor: "#1b5e20" },
                              borderRadius: "8px",
                              boxShadow: "0 4px 10px rgba(46, 125, 50, 0.2)",
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Close />}
                            onClick={() => openConfirmationDialog(request._id, "reject")}
                            sx={{
                              bgcolor: "#d32f2f",
                              "&:hover": { bgcolor: "#b71c1c" },
                              borderRadius: "8px",
                              boxShadow: "0 4px 10px rgba(211, 47, 47, 0.2)",
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Deny
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Divider />
          <Box
            sx={{
              bgcolor: alpha("#4776E6", 0.02),
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing all supervisor-approved travel requests that require your final approval.
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={fetchApprovedRequests}
              startIcon={<Refresh />}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Refresh Data
            </Button>
          </Box>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmation}
          onClose={closeConfirmationDialog}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              maxWidth: 450,
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: selectedDecision === "approve" ? alpha("#2e7d32", 0.05) : alpha("#d32f2f", 0.05),
              py: 3,
              px: 4,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {selectedDecision === "approve" ? "Confirm Approval" : "Confirm Denial"}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: selectedDecision === "approve" ? alpha("#2e7d32", 0.1) : alpha("#d32f2f", 0.1),
                  color: selectedDecision === "approve" ? "#2e7d32" : "#d32f2f",
                }}
              >
                {selectedDecision === "approve" ? <Check /> : <Close />}
              </Avatar>
              <Typography variant="body1" fontWeight={500}>
                You are about to{" "}
                <Typography
                  component="span"
                  fontWeight="bold"
                  color={selectedDecision === "approve" ? "success.main" : "error.main"}
                >
                  {selectedDecision === "approve" ? "approve" : "deny"}
                </Typography>{" "}
                this travel request.
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone. The employee will be notified of your decision.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 4, pb: 3 }}>
            <Button
              onClick={closeConfirmationDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDecision}
              variant="contained"
              color={selectedDecision === "approve" ? "success" : "error"}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                boxShadow:
                  selectedDecision === "approve"
                    ? "0 4px 10px rgba(46, 125, 50, 0.2)"
                    : "0 4px 10px rgba(211, 47, 47, 0.2)",
              }}
            >
              {selectedDecision === "approve" ? "Confirm Approval" : "Confirm Denial"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}

export default FinalApproverDashboard
