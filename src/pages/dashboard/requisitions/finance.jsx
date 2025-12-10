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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert as MuiAlert,
} from "@mui/material";
import { Check, AttachMoney } from "@mui/icons-material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FinanceProcessingPage = () => {
  const [travelRequests, setTravelRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false); // Renamed from openProcessingDialog
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    perDiemRate: 50,
    advanceAmount: 0,
    paymentMethod: "none",
    notes: "",
  });
   const backendUrl = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

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
        setTravelRequests(data);
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const calculatePerDiem = (request) => {
    const days = Math.ceil(
      (new Date(request.returnDate) - new Date(request.departureDate)) /
        (1000 * 60 * 60 * 24)
    );
    return days * paymentDetails.perDiemRate;
  };

  const handleOpenProcessingDialog = (request) => { // Renamed from openProcessingDialog
    setSelectedRequest(request);
    setPaymentDetails({
      perDiemRate: 50, // Default rate
      advanceAmount: 0,
      paymentMethod: "none",
      notes: "",
    });
    setProcessingDialogOpen(true);
  };

  const handleCloseProcessingDialog = () => {
    setProcessingDialogOpen(false);
  };

  const handlePaymentDetailChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: name === "perDiemRate" || name === "advanceAmount" ? Number(value) : value,
    }));
  };

  const processPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const financeOfficerId = JSON.parse(localStorage.getItem("user"))._id;
      const perDiemAmount = calculatePerDiem(selectedRequest);

      const response = await fetch(
        `${backendUrl}/api/travel-requests/${selectedRequest._id}/finance-process`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            perDiemAmount,
            travelAdvanceAmount: paymentDetails.advanceAmount,
            paymentMethod: paymentDetails.paymentMethod,
            financeOfficer: financeOfficerId,
            notes: paymentDetails.notes,
          }),
        }
      );

      if (response.ok) {
        setTravelRequests((prev) =>
          prev.filter((request) => request._id !== selectedRequest._id)
        );
        setSnackbarMessage("Payment processed successfully!");
        setSnackbarSeverity("success");
        setProcessingDialogOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        setSnackbarMessage(errorData.message || "Failed to process payment");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error processing payment:", error);
      setSnackbarMessage("An error occurred while processing payment");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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
          background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          color: "white",
          borderRadius: 2,
          p: 3,
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Finance Processing
        </Typography>
        <Typography variant="subtitle1">
          Process payments for approved travel requests
        </Typography>
      </Box>

      {travelRequests.length === 0 ? (
        <Alert severity="info">No travel requests pending finance processing</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Approval Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {travelRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.employee?.name || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(request.departureDate).toLocaleDateString()} -{" "}
                    {new Date(request.returnDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell>
                    {request.finalApproval === "approved" && "Final Approved"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AttachMoney />}
                      onClick={() => handleOpenProcessingDialog(request)}
                    >
                      Process Payment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={processingDialogOpen}
        onClose={handleCloseProcessingDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Process Travel Payment</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Request Details
              </Typography>
              <Typography>
                <strong>Employee:</strong> {selectedRequest.employee?.name}
              </Typography>
              <Typography>
                <strong>Dates:</strong>{" "}
                {new Date(selectedRequest.departureDate).toLocaleDateString()} -{" "}
                {new Date(selectedRequest.returnDate).toLocaleDateString()} (
                {Math.ceil(
                  (new Date(selectedRequest.returnDate) -
                    new Date(selectedRequest.departureDate)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days)
              </Typography>
              <Typography>
                <strong>Location:</strong> {selectedRequest.location}
              </Typography>
              <Typography>
                <strong>Purpose:</strong> {selectedRequest.purpose}
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <TextField
                    label="Per Diem Rate ($)"
                    name="perDiemRate"
                    type="number"
                    value={paymentDetails.perDiemRate}
                    onChange={handlePaymentDetailChange}
                    sx={{ width: 150 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>
                      <strong>Per Diem Calculation:</strong>{" "}
                      {Math.ceil(
                        (new Date(selectedRequest.returnDate) -
                          new Date(selectedRequest.departureDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days × ${paymentDetails.perDiemRate} = $
                      {calculatePerDiem(selectedRequest)}
                    </Typography>
                  </Box>
                </Box>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="paymentMethod"
                    value={paymentDetails.paymentMethod}
                    label="Payment Method"
                    onChange={handlePaymentDetailChange}
                  >
                    <MenuItem value="none">No Payment Required</MenuItem>
                    <MenuItem value="advance">Travel Advance</MenuItem>
                    <MenuItem value="reimbursement">Expense Reimbursement</MenuItem>
                    <MenuItem value="corporate_card">Corporate Card</MenuItem>
                  </Select>
                </FormControl>

                {paymentDetails.paymentMethod === "advance" && (
                  <TextField
                    label="Advance Amount ($)"
                    name="advanceAmount"
                    type="number"
                    fullWidth
                    value={paymentDetails.advanceAmount}
                    onChange={handlePaymentDetailChange}
                    sx={{ mb: 3 }}
                  />
                )}

                <TextField
                  label="Notes"
                  name="notes"
                  multiline
                  rows={3}
                  fullWidth
                  value={paymentDetails.notes}
                  onChange={handlePaymentDetailChange}
                />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">
                    <strong>Total Amount:</strong> $
                    {calculatePerDiem(selectedRequest) +
                      paymentDetails.advanceAmount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProcessingDialog}>Cancel</Button>
          <Button
            onClick={processPayment}
            variant="contained"
            color="success"
            startIcon={<Check />}
          >
            Complete Processing
          </Button>
        </DialogActions>
      </Dialog>

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
  );
};

export default FinanceProcessingPage;