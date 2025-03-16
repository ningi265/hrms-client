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
import { useAuth } from "../../../../authcontext/authcontext";

// Utility function to generate a tracking number (2 letters + 4 digits)
const generateTrackingNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";

  let trackingNumber = "";

  // Generate 2 random letters
  for (let i = 0; i < 2; i++) {
    trackingNumber += letters[Math.floor(Math.random() * letters.length)];
  }

  // Generate 4 random digits
  for (let i = 0; i < 4; i++) {
    trackingNumber += digits[Math.floor(Math.random() * digits.length)];
  }

  return trackingNumber;
};

export default function VendorPODetailsPage() {
  const { token } = useAuth();
  const [vendorId, setVendorId] = useState(null);
  const [pos, setPos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // For the delivery status update dialog
  const [selectedPO, setSelectedPO] = useState(null); // Selected PO for updating delivery status
  const [trackingNumber, setTrackingNumber] = useState(""); // Tracking number input
  const [carrier, setCarrier] = useState(""); // Carrier input

  // Fetch vendor details
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hrms-6s3i.onrender.com/api/vendors/me", {
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

  // Fetch purchase orders for the vendor
  useEffect(() => {
    const fetchPOs = async () => {
      if (!vendorId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hrms-6s3i.onrender.com/api/purchase-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch purchase orders");
        const data = await response.json();

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

  // Confirm a purchase order
  const handleConfirmPO = async (poId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://hrms-6s3i.onrender.com/api/purchase-orders/${poId}/vendor/confirm`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendorId }),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to confirm purchase order. Status: ${response.status}`);

      const updatedPO = await response.json();

      // Update the state with the confirmed PO
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === poId
            ? { ...po, vendorConfirmation: { confirmed: true } }
            : po
        )
      );
    } catch (err) {
      console.error("❌ Error confirming PO:", err);
      setError("Could not confirm purchase order.");
    }
  };

  // Open the dialog for updating delivery status
  const handleOpenDialog = (po) => {
    setSelectedPO(po);
    setTrackingNumber(generateTrackingNumber()); // Auto-generate tracking number
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTrackingNumber("");
    setCarrier("");
  };

  // Update delivery status (shipped or delivered)
  const handleUpdateDeliveryStatus = async (status) => {
    try {
      if (!selectedPO || !trackingNumber || !carrier) {
        throw new Error("Missing required data.");
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://hrms-6s3i.onrender.com/api/purchase-orders/${selectedPO._id}/delivery-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deliveryStatus: status,
            trackingNumber,
            carrier,
            token,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        throw new Error(
          `Failed to update delivery status. Status: ${response.status}. Message: ${errorData.message}`
        );
      }

      const updatedPO = await response.json();

      // Update the state with the updated PO
      setPos((prevPos) =>
        prevPos.map((po) =>
          po._id === selectedPO._id
            ? { ...po, deliveryStatus: status, trackingNumber, carrier }
            : po
        )
      );

      handleCloseDialog(); // Close the dialog
    } catch (err) {
      console.error("❌ Error updating delivery status:", err);
      setError(err.message); // Display the detailed error message
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
        Purchase Orders Assigned to You
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
                    onClick={() => handleConfirmPO(po._id)}
                    disabled={po.vendorConfirmation?.confirmed}
                    sx={{ mr: 2 }}
                  >
                    {po.vendorConfirmation?.confirmed ? "Confirmed" : "Confirm"}
                  </Button>
                  {po.vendorConfirmation?.confirmed && po.deliveryStatus !== "delivered" && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenDialog(po)}
                    >
                      {po.deliveryStatus === "shipped" ? "Mark as Delivered" : "Mark as Shipped"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for updating delivery status */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <TextField
            label="Tracking Number"
            value={trackingNumber}
            InputProps={{ readOnly: true }} // Make the field read-only
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Carrier"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() =>
              handleUpdateDeliveryStatus(
                selectedPO.deliveryStatus === "shipped" ? "delivered" : "shipped"
              )
            }
            color="primary"
            disabled={!carrier} // Disable if carrier is not provided
          >
            {selectedPO?.deliveryStatus === "shipped" ? "Mark as Delivered" : "Mark as Shipped"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}