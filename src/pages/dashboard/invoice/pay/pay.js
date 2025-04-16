import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
  } from "@mui/material"; // Import CheckCircleOutline icon
  import { CheckCircleOutline } from "@mui/icons-material"; 
import { useAuth } from "../../../../authcontext/authcontext";

export default function PaymentPage() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice: initialInvoice } = location.state || {}; // Get invoice data from navigation state

  const [invoice, setInvoice] = useState(initialInvoice); // Local state for invoice
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // Track payment success

  const token = localStorage.getItem("token");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Debugging: Log invoice and token
  useEffect(() => {
    console.log("Invoice data:", invoice);
    console.log("Token:", token);
  }, [invoice, token]);

  // Handle input changes for the payment form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!invoice || !token) {
      setError("Invalid invoice or session. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `${backendUrl}/api/invoices/${invoice._id}/status/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentDetails), // Send payment details to the backend
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Invalid or expired token") {
          setSnackbarMessage("Your session has expired. Please log in again.");
          setSnackbarOpen(true);
          logout();
          return;
        }
        throw new Error(data.message || "Failed to process payment");
      }

      // Payment successful
      setSnackbarMessage("Payment processed successfully! Invoice marked as paid.");
      setSnackbarOpen(true);
      setIsPaymentSuccessful(true); // Set payment success state
      setInvoice((prev) => ({ ...prev, status: "paid" })); // Update invoice status locally

      // Redirect to the invoices page after 2 seconds
      setTimeout(() => {
        navigate("/invoices");
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message);
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // If no invoice data is passed, show an error
  if (!invoice) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">No invoice data found. Please go back and try again.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Payment Page
      </Typography>

      {/* Invoice Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Invoice Details
        </Typography>
        <Typography>
          <strong>Invoice Number:</strong> {invoice.invoiceNumber}
        </Typography>
        <Typography>
          <strong>Vendor:</strong> {invoice.vendor?.name}
        </Typography>
        <Typography>
          <strong>Amount Due:</strong> ${invoice.amountDue}
        </Typography>
        <Typography>
          <strong>Status:</strong> {invoice.status}
        </Typography>
      </Paper>

      {/* Payment Form */}
      {!isPaymentSuccessful ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payment Details
          </Typography>
          <TextField
            fullWidth
            label="Card Number"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            disabled={isProcessing || isPaymentSuccessful} // Disable if processing or payment successful
          />
          <TextField
            fullWidth
            label="Expiry Date (MM/YY)"
            name="expiryDate"
            value={paymentDetails.expiryDate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            disabled={isProcessing || isPaymentSuccessful} // Disable if processing or payment successful
          />
          <TextField
            fullWidth
            label="CVV"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            disabled={isProcessing || isPaymentSuccessful} // Disable if processing or payment successful
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePaymentSubmit}
            disabled={isProcessing || isPaymentSuccessful} // Disable if processing or payment successful
          >
            {isProcessing ? <CircularProgress size={24} /> : "Submit Payment"}
          </Button>
        </Paper>
      ) : (
        // Success Message
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <CheckCircleOutline sx={{ fontSize: 60, color: "green", mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Payment Successful!
          </Typography>
          <Typography>
            Your payment for invoice <strong>{invoice.invoiceNumber}</strong> has been processed
            successfully.
          </Typography>
          <Typography>You will be redirected to the invoices page shortly.</Typography>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Snackbar for Success/Failure Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
}