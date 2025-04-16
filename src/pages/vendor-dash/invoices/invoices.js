import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../../../authcontext/authcontext";

export default function VendorInvoiceSubmissionPage() {
  const { token, user } = useAuth(); // Use the authenticated user from the auth context
  const [vendorId, setVendorId] = useState(null);
  const [pos, setPos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false); // For the invoice submission dialog
  const [selectedPO, setSelectedPO] = useState(null); // Selected PO for invoice submission
  const [invoiceNumber, setInvoiceNumber] = useState(""); // Invoice number input
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  // Fetch vendor details
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/vendors/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch vendor details");
        const data = await response.json();
        setVendorId(data._id);
      } catch (err) {
        console.error("❌ Error fetching vendor details:", err);
        setError("Could not fetch vendor details.");
      }
    };

    fetchVendorDetails();
  }, [token]);

  // Fetch purchase orders assigned to the vendor
  useEffect(() => {
    const fetchPOs = async () => {
      if (!vendorId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/purchase-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch purchase orders");
        const data = await response.json();

        // Filter POs assigned to the vendor
        const vendorPOs = data.filter((po) => po.vendor?._id === vendorId);
        setPos(vendorPOs);
      } catch (err) {
        console.error("❌ Error fetching POs:", err);
        setError("Could not fetch purchase orders.");
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) fetchPOs();
  }, [vendorId, token]);

  // Generate a random 6-digit invoice number
  const generateInvoiceNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit number
  };

  // Open invoice submission dialog
  const handleOpenInvoiceDialog = (po) => {
    setSelectedPO(po); // Set the selected PO
    setInvoiceNumber(generateInvoiceNumber()); // Generate and set a random invoice number
    setOpenInvoiceDialog(true); // Open the dialog
  };

  // Close invoice submission dialog
  const handleCloseInvoiceDialog = () => {
    setOpenInvoiceDialog(false); // Close the dialog
    setInvoiceNumber(""); // Reset invoice number
  };

  // Submit invoice for a PO
  const handleSubmitInvoice = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/api/invoices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          poId: selectedPO._id, // PO ID
          invoiceNumber, // Randomly generated invoice number
          amountDue: selectedPO.totalAmount, // Use the PO's total amount
          vendorId: vendorId, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit invoice");
      }

      const data = await response.json();

      // Update the state with the submitted invoice
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === selectedPO._id
            ? { ...po, invoice: data.invoice } // Update PO with the submitted invoice
            : po
        )
      );

      handleCloseInvoiceDialog(); // Close the dialog
    } catch (err) {
      console.error("❌ Error submitting invoice:", err);
      setError(err.message || "Could not submit invoice.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // No POs available
  if (pos.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No Purchase Orders available for you.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Submit Invoice for Purchase Orders
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pos.map((po) => (
              <TableRow key={po._id}>
                <TableCell>{po._id}</TableCell>
                <TableCell>
                  {po.vendorConfirmation?.confirmed ? "Confirmed" : "Pending"}
                </TableCell>
                <TableCell>{po.deliveryStatus}</TableCell>
                <TableCell>${po.totalAmount}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenInvoiceDialog(po)}
                    disabled={po.invoice} // Disable if invoice is already submitted
                  >
                    {po.invoice ? "Invoice Submitted" : "Submit Invoice"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invoice Submission Dialog */}
      <Dialog open={openInvoiceDialog} onClose={handleCloseInvoiceDialog}>
        <DialogTitle>Submit Invoice</DialogTitle>
        <DialogContent>
          <TextField
            label="Invoice Number"
            value={invoiceNumber}
            InputProps={{ readOnly: true }} // Make the field read-only
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Invoice Amount"
            value={selectedPO ? `$${selectedPO.totalAmount}` : ""}
            InputProps={{ readOnly: true }} // Make the field read-only
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceDialog}>Cancel</Button>
          <Button onClick={handleSubmitInvoice} color="primary">
            Submit Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}