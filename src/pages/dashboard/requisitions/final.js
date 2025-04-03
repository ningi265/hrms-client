import React, { useState, useEffect } from "react";
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FinalApproverDashboard = () => {
  const [travelRequests, setTravelRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState(null);

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/travel-requests/supervisor-approved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch supervisor-approved travel requests");
        }
        const data = await response.json();
        setTravelRequests(data);
      } catch (error) {
        console.error("Failed to fetch supervisor-approved travel requests:", error);
        setSnackbarMessage("Failed to fetch supervisor-approved travel requests");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovedRequests();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFinalDecision = async (id, decision) => {
    try {
      const token = localStorage.getItem("token");
      const finalApproverId = JSON.parse(localStorage.getItem("user"))._id;

      const response = await fetch(`http://localhost:4000/api/travel-requests/${id}/final-approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          finalApproverId, 
          decision: decision === "approve" ? "approved" : "rejected" 
        }),
      });

      if (response.ok) {
        setTravelRequests((prev) => prev.filter((request) => request._id !== id));
        setSnackbarMessage(`Travel request ${decision === "approve" ? "approved" : "rejected"} successfully!`);
        setSnackbarSeverity("success");
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        setSnackbarMessage(errorData.message || "Failed to update travel request");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating final approval:", error);
      setSnackbarMessage("An error occurred while updating the travel request");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const openConfirmationDialog = (id, decision) => {
    setSelectedRequestId(id);
    setSelectedDecision(decision);
    setOpenConfirmation(true);
  };

  const closeConfirmationDialog = () => {
    setOpenConfirmation(false);
  };

  const confirmDecision = () => {
    handleFinalDecision(selectedRequestId, selectedDecision);
    closeConfirmationDialog();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
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
          Supervisor-Approved Travel Requests
        </Typography>
        <Typography variant="subtitle1">
          Review and confirm or deny travel requests
        </Typography>
      </Box>

      {travelRequests.length === 0 ? (
        <Alert severity="info">No supervisor-approved travel requests</Alert>
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
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {travelRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.employee?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(request.departureDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(request.returnDate).toLocaleDateString()}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{request.fundingCodes}</TableCell>
                  <TableCell>
                    {request.meansOfTravel === 'own' && 'Own Vehicle'}
                    {request.meansOfTravel === 'company' && 'Company Vehicle'}
                    {request.meansOfTravel === 'rental' && 'Rental Vehicle'}
                    {request.meansOfTravel === 'public_transport' && 'Public Transport'}
                  </TableCell>
                  <TableCell>
                    {request.status === 'supervisor_approved' && 'Supervisor Approved'}
                    {request.status === 'final_approved' && 'Final Approved'}
                    {request.status === 'rejected' && 'Rejected'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Check />}
                      onClick={() => openConfirmationDialog(request._id, "approve")}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Close />}
                      onClick={() => openConfirmationDialog(request._id, "reject")}
                    >
                      Deny
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openConfirmation} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Decision</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedDecision === "approve" ? "approve" : "reject"} this travel request?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog}>Cancel</Button>
          <Button 
            onClick={confirmDecision} 
            color={selectedDecision === "approve" ? "success" : "error"}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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

export default FinalApproverDashboard;