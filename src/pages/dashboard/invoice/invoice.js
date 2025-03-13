import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../../../authcontext/authcontext";
import { useNavigate } from "react-router-dom";

export default function InvoicesPage() {
  const { token, user, logout } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  // Fetch invoices from the backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hrms-6s3i.onrender.com/api/invoices", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch invoices");
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        setError("Failed to fetch invoices. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [token]);

  // Open the dialog for approving, rejecting, or marking as paid
  const openDialog = (invoice, type) => {
    setSelectedInvoice(invoice);
    setActionType(type);
    setIsDialogOpen(true);
  };

  // Close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedInvoice(null);
    setActionType("");
  };

  // Handle invoice action (approve, reject, mark as paid)
  const handleInvoiceAction = async () => {
    if (!selectedInvoice || !token) {
      setSnackbarMessage("Invalid request. Please try again.");
      setSnackbarOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      let url;
      let method = "PUT"; // All actions use PUT method

      // Determine the endpoint based on the action type
      switch (actionType) {
        case "approve":
          url = `https://hrms-6s3i.onrender.com/api/invoices/${selectedInvoice._id}/status/approve`;
          break;
        case "reject":
          url = `https://hrms-6s3i.onrender.com/api/invoices/${selectedInvoice._id}/status/reject`;
          break;
        case "mark-as-paid":
          url = `https://hrms-6s3i.onrender.com/api/invoices/${selectedInvoice._id}/status/pay`;
          break;
        default:
          throw new Error("Invalid action type");
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Invalid or expired token") {
          setSnackbarMessage("Your session has expired. Please log in again.");
          setSnackbarOpen(true);
          logout();
          return;
        }
        throw new Error(data.message || "Failed to perform action");
      }

      // Update the invoices list with the updated invoice
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === selectedInvoice._id ? data.invoice : invoice
        )
      );

      setSnackbarMessage(`Invoice ${actionType.replace("-", " ")} successfully!`);
      setSnackbarOpen(true);
      closeDialog();
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigate to the payment page with invoice data
  const handlePayInvoice = (invoice) => {
    navigate("/invoices/pay", { state: { invoice } });
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if fetching invoices fails
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Invoices</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell>PO Number</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount Due</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.po?.poNumber}</TableCell>
                <TableCell>{invoice.vendor?.name}</TableCell>
                <TableCell>${invoice.amountDue}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
                  {invoice.status === "pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => openDialog(invoice, "approve")}
                        disabled={isProcessing}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => openDialog(invoice, "reject")}
                        sx={{ ml: 2 }}
                        disabled={isProcessing}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {invoice.status === "approved" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handlePayInvoice(invoice)}
                        sx={{ mr: 2 }}
                      >
                        Pay
                      </Button>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => openDialog(invoice, "mark-as-paid")}
                      >
                        Mark as Paid
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{`Confirm ${actionType.replace("-", " ")}`}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType.replace("-", " ")} invoice{" "}
            <strong>{selectedInvoice?.invoiceNumber}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={handleInvoiceAction}
            variant="contained"
            color="primary"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}