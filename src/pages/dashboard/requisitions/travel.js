"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Dialog,
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
  Alert as MuiAlert,
  styled,
  createTheme,
  ThemeProvider,
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
} from "@mui/icons-material"
import { motion } from "framer-motion"

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#ec4899",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 700,
      background: "linear-gradient(90deg, #4f46e5, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle1: {
      fontWeight: 400,
      color: "#6b7280",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e5e7eb",
        },
        head: {
          fontWeight: 600,
          color: "#6b7280",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          background: "#ffffff",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  },
});

// Custom styled components
const GradientContainer = styled(Container)(({ theme }) => ({
  background: "linear-gradient(135deg, #f9fafb, #e5e7eb)",
  borderRadius: "16px",
  padding: theme.spacing(4),
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4f46e5, #ec4899)",
  },
}));

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
    meansOfTravel: "Flight",
  },
  {
    _id: "2",
    employee: { _id: "e2", name: "Sarah Johnson" },
    departureDate: "2025-06-01T00:00:00.000Z",
    returnDate: "2025-06-05T00:00:00.000Z",
    location: "Chicago, IL",
    fundingCodes: "FIN-2025-002",
    meansOfTravel: "Train",
  },
  {
    _id: "3",
    employee: { _id: "e3", name: "Michael Chen" },
    departureDate: "2025-05-20T00:00:00.000Z",
    returnDate: "2025-05-27T00:00:00.000Z",
    location: "San Francisco, CA",
    fundingCodes: "FIN-2025-003",
    meansOfTravel: "Flight",
  },
  {
    _id: "4",
    employee: { _id: "e4", name: "Emily Davis" },
    departureDate: "2025-06-10T00:00:00.000Z",
    returnDate: "2025-06-15T00:00:00.000Z",
    location: "Austin, TX",
    fundingCodes: "FIN-2025-004",
    meansOfTravel: "Car",
  },
]

const SupervisorDashboard = () => {
  const [travelRequests, setTravelRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const navigate = useNavigate()
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${backendUrl}/api/travel-requests/pending/all`, {
          headers: {
            Authorization: `Bearer ${token || "preview-token"}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch pending travel requests")
        }

        const data = await response.json()
        setTravelRequests(data)
        setIsPreviewMode(false)
      } catch (error) {
        console.error("Failed to fetch pending travel requests:", error)
        setTravelRequests(MOCK_TRAVEL_REQUESTS)
        setIsPreviewMode(true)
        if (
          typeof window !== "undefined" &&
          window.location.hostname !== "localhost" &&
          !window.location.hostname.includes("vercel.app")
        ) {
          setSnackbarMessage("Failed to fetch pending travel requests")
          setSnackbarSeverity("error")
          setSnackbarOpen(true)
        }
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 800)
      }
    }

    fetchPendingRequests()
  }, [backendUrl])

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  const handleDecision = async (id, decision) => {
    try {
      if (isPreviewMode) {
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))
        setSnackbarMessage(`Travel request ${decision} successfully! (Preview mode)`)
        setSnackbarSeverity("info")
        setSnackbarOpen(true)
        return
      }

      const token = localStorage.getItem("token")
      const supervisorId = JSON.parse(localStorage.getItem("user") || '{"_id":"preview-user"}')._id

      const response = await fetch(`${backendUrl}/api/travel-requests/${id}/supervisor-approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ supervisorId, decision }),
      })

      if (response.ok) {
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))
        setSnackbarMessage(`Travel request ${decision} successfully!`)
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
      } else {
        const errorData = await response.json()
        setSnackbarMessage(errorData.message || "Failed to update travel request")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    } catch (error) {
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
    setSelectedRequestId(null)
    setSelectedDecision(null)
  }

  const confirmDecision = () => {
    handleDecision(selectedRequestId, selectedDecision)
    closeConfirmationDialog()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={60} thickness={5} />
        </motion.div>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <GradientContainer maxWidth="lg">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" component="h1" mb={4}>
            Supervisor Dashboard
          </Typography>
        </motion.div>

        {isPreviewMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert severity="warning" sx={{ mb: 3, borderRadius: "8px" }} icon={<Warning />}>
              Using mock data for preview. In production, this would connect to your backend API.
            </Alert>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <Box
              sx={{
                background: "linear-gradient(135deg, #4f46e5, #ec4899)",
                color: "white",
                p: 3,
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Travel Requests
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Review and manage pending travel requests
                  </Typography>
                </Box>
                <Chip
                  label={`${travelRequests.length} Pending`}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: "medium",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Box>

            {travelRequests.length === 0 ? (
              <Box sx={{ p: 6, textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(79, 70, 229, 0.1)",
                    color: "primary.main",
                    width: 56,
                    height: 56,
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <InfoIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  No Pending Requests
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                  There are currently no travel requests waiting for your approval.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f3f4f6" }}>
                      <TableCell>Employee</TableCell>
                      <TableCell>Travel Period</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {travelRequests.map((request) => (
                      <motion.tr
                        key={request._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{request.employee?.name || "N/A"}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarMonth fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatDate(request.departureDate)}
                              <Typography component="span" color="text.secondary" sx={{ mx: 0.5 }}>
                                →
                              </Typography>
                              {formatDate(request.returnDate)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">{request.location || "N/A"}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <FlightTakeoff fontSize="small" color="action" />
                              <Typography variant="body2">{request.meansOfTravel || "N/A"}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CreditCard fontSize="small" color="action" />
                              <Typography variant="body2">{request.fundingCodes || "N/A"}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Check />}
                              onClick={() => openConfirmationDialog(request._id, "approved")}
                              sx={{
                                bgcolor: "success.main",
                                "&:hover": {
                                  bgcolor: "success.dark",
                                },
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Close />}
                              onClick={() => openConfirmationDialog(request._id, "rejected")}
                              sx={{
                                bgcolor: "error.main",
                                "&:hover": {
                                  bgcolor: "error.dark",
                                },
                              }}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Box sx={{ p: 2, bgcolor: "#f9fafb", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}>
              <Typography variant="body2" color="text.secondary">
                Showing all pending travel requests that require your approval.
              </Typography>
            </Box>
          </Card>
        </motion.div>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmation}
          onClose={closeConfirmationDialog}
          maxWidth="sm"
          fullWidth
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ p: 3, background: "linear-gradient(135deg, #f9fafb, #e5e7eb)" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #4f46e5, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Confirm Decision
              </Typography>
              <DialogContent sx={{ p: 0 }}>
                <Typography>
                  Are you sure you want to mark this travel request as{" "}
                  <Typography
                    component="span"
                    fontWeight="bold"
                    color={selectedDecision === "approved" ? "success.main" : "error.main"}
                  >
                    {selectedDecision}
                  </Typography>
                  ? This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={closeConfirmationDialog}
                  sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDecision}
                  variant="contained"
                  color={selectedDecision === "approved" ? "success" : "error"}
                  sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Box>
          </motion.div>
        </Dialog>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%", borderRadius: "8px" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </GradientContainer>
    </ThemeProvider>
  )
}

export default SupervisorDashboard