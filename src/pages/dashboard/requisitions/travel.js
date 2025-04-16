import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import MuiAlert from '@mui/material/Alert';

// Snackbar Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SupervisorDashboard = () => {
  const [travelRequests, setTravelRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState(null);

  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch all pending travel requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/travel-requests/pending/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pending travel requests");
        }
        const data = await response.json();
        setTravelRequests(data);
      } catch (error) {
        console.error("Failed to fetch pending travel requests:", error);
        setSnackbarMessage("Failed to fetch pending travel requests");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingRequests();
  }, []);

  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Handle approval or rejection
  const handleDecision = async (id, decision) => {
    try {
      const token = localStorage.getItem("token");
      const supervisorId = JSON.parse(localStorage.getItem("user"))._id; // Supervisor's ID

      const response = await fetch(`${backendUrl}/api/travel-requests/${id}/supervisor-approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ supervisorId, decision }),
      });

      if (response.ok) {
        // Update the UI by removing the approved/rejected request
        setTravelRequests((prev) => prev.filter((request) => request._id !== id));

        // Show success message
        setSnackbarMessage(`Travel request ${decision} successfully!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);

        // Show error message
        setSnackbarMessage(errorData.message || "Failed to update travel request");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating approval:", error);

      // Show error message
      setSnackbarMessage("An error occurred while updating the travel request");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Open confirmation dialog
  const openConfirmationDialog = (id, decision) => {
    setSelectedRequestId(id);
    setSelectedDecision(decision);
    setOpenConfirmation(true);
  };

  // Close confirmation dialog
  const closeConfirmationDialog = () => {
    setOpenConfirmation(false);
  };

  // Confirm decision
  const confirmDecision = () => {
    handleDecision(selectedRequestId, selectedDecision);
    closeConfirmationDialog();
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" // Full viewport height
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      {/* Header with Gradient Background */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          color: "white",
          borderRadius: 2,
          p: 3,
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Pending Travel Requests
        </Typography>
        <Typography variant="subtitle1">
          Review and approve or reject travel requests
        </Typography>
      </Box>

      {/* Travel Requests Table */}
      {travelRequests.length === 0 ? (
        <Alert severity="info">No pending travel requests</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Departure Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Funding Codes</TableCell>
                <TableCell>Means of Travel</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {travelRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.employee.name}</TableCell>
                  <TableCell>{new Date(request.departureDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(request.returnDate).toLocaleDateString()}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{request.fundingCodes}</TableCell>
                  <TableCell>{request.meansOfTravel}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Check />}
                      onClick={() => openConfirmationDialog(request._id, "approved")}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Close />}
                      onClick={() => openConfirmationDialog(request._id, "rejected")}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmation} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Decision</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this travel request as {selectedDecision} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog}>Cancel</Button>
          <Button onClick={confirmDecision} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupervisorDashboard;