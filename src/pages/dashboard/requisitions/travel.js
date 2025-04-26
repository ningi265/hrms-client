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
  Alert as MuiAlert,
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

  // Fetch all pending travel requests
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

        // Use mock data for preview/development
        setTravelRequests(MOCK_TRAVEL_REQUESTS)
        setIsPreviewMode(true)

        // Only show error in non-preview environments
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
        // Add a small delay to simulate network request
        setTimeout(() => {
          setIsLoading(false)
        }, 800)
      }
    }

    fetchPendingRequests()
  }, [backendUrl])

  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  // Handle approval or rejection
  const handleDecision = async (id, decision) => {
    try {
      // If in preview mode, just update the UI without making API calls
      if (isPreviewMode) {
        // Update the UI by removing the approved/rejected request
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))

        // Show success message
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
        // Update the UI by removing the approved/rejected request
        setTravelRequests((prev) => prev.filter((request) => request._id !== id))

        // Show success message
        setSnackbarMessage(`Travel request ${decision} successfully!`)
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
      } else {
        const errorData = await response.json()
        console.error("Server Error:", errorData)

        // Show error message
        setSnackbarMessage(errorData.message || "Failed to update travel request")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error("Error updating approval:", error)

      // Show error message
      setSnackbarMessage("An error occurred while updating the travel request")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    }
  }

  // Open confirmation dialog
  const openConfirmationDialog = (id, decision) => {
    setSelectedRequestId(id)
    setSelectedDecision(decision)
    setOpenConfirmation(true)
  }

  // Close confirmation dialog
  const closeConfirmationDialog = () => {
    setOpenConfirmation(false)
  }

  // Confirm decision
  const confirmDecision = () => {
    handleDecision(selectedRequestId, selectedDecision)
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isPreviewMode && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<Warning />}>
          Using mock data for preview. In production, this would connect to your backend API.
        </Alert>
      )}

      <Card
        elevation={3}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            color: "white",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
            }}
          />
        </Box>

        {travelRequests.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 6,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(25, 118, 210, 0.1)",
                color: "primary.main",
                width: 56,
                height: 56,
                mb: 2,
              }}
            >
              <InfoIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              No Pending Requests
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              There are currently no travel requests waiting for your approval.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.03)" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Travel Period</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {travelRequests.map((request) => (
                  <TableRow key={request._id} hover sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}>
                    <TableCell sx={{ fontWeight: "medium" }}>{request.employee.name}</TableCell>
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
                        <Typography variant="body2">{request.location}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <FlightTakeoff fontSize="small" color="action" />
                          <Typography variant="body2">{request.meansOfTravel}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CreditCard fontSize="small" color="action" />
                          <Typography variant="body2">{request.fundingCodes}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Check />}
                          onClick={() => openConfirmationDialog(request._id, "approved")}
                          sx={{
                            color: "success.main",
                            borderColor: "success.light",
                            "&:hover": {
                              bgcolor: "success.lighter",
                              borderColor: "success.main",
                            },
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Close />}
                          onClick={() => openConfirmationDialog(request._id, "rejected")}
                          sx={{
                            color: "error.main",
                            borderColor: "error.light",
                            "&:hover": {
                              bgcolor: "error.lighter",
                              borderColor: "error.main",
                            },
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ bgcolor: "rgba(0, 0, 0, 0.02)", p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
          <Typography variant="body2" color="text.secondary">
            Showing all pending travel requests that require your approval.
          </Typography>
        </Box>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmation} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Decision</DialogTitle>
        <DialogContent>
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
          <Button onClick={closeConfirmationDialog}>Cancel</Button>
          <Button
            onClick={confirmDecision}
            variant="contained"
            color={selectedDecision === "approved" ? "success" : "error"}
          >
            Confirm
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default SupervisorDashboard
